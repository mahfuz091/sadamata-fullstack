// payoutActions.js
import { PrismaClient, PayoutActor } from '@prisma/client';

const prisma = new PrismaClient();

// Count only sales from PAID orders
const paidSaleWhere = {
  orderItem: {
    order: { status: 'PAID' },
  },
};

// -------- helpers --------
const toDecimalString = (val) => {
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return val.toFixed(2); // store as Decimal string
  throw new Error('Amount must be number or string');
};

// A tiny 64-bit hash for advisory locks (best-effort concurrency safety)
const hash64 = (s) => {
  let h1 = 0x9e3779b1, h2 = 0x85ebca77;
  for (let i = 0; i < s.length; i++) {
    h1 = Math.imul(h1 ^ s.charCodeAt(i), 0x85ebca6b);
    h2 = Math.imul(h2 ^ s.charCodeAt(i), 0xc2b2ae35);
  }
  h1 = (h1 ^ (h2 >>> 7)) >>> 0;
  h2 = (h2 ^ (h1 >>> 9)) >>> 0;
  return (BigInt(h1) << 32n) | BigInt(h2); // bigint
};

// -------- balances --------
export async function getBrandBalance(brandId) {
  const [sales, payouts] = await Promise.all([
    prisma.sale.aggregate({
      where: { ...paidSaleWhere, brandId },
      _sum: { brandEarning: true, total: true },
    }),
    prisma.payout.aggregate({
      where: { actor: PayoutActor.BRAND, brandId },
      _sum: { amount: true },
    }),
  ]);

  const totalSell = sales._sum.total || 0;
  const totalIncome = sales._sum.brandEarning || 0;
  const withdrawn = payouts._sum.amount ? Number(payouts._sum.amount) : 0;
  const available = totalIncome - withdrawn;

  return { brandId, totalSell, totalIncome, withdrawn, available };
}

export async function getMerchantBalance(merchantId) {
  const [sales, payouts] = await Promise.all([
    prisma.sale.aggregate({
      where: { ...paidSaleWhere, merchantId },
      _sum: { merchantEarning: true, total: true },
    }),
    prisma.payout.aggregate({
      where: { actor: PayoutActor.MERCHANT, merchantId },
      _sum: { amount: true },
    }),
  ]);

  const totalSell = sales._sum.total || 0;
  const totalIncome = sales._sum.merchantEarning || 0;
  const withdrawn = payouts._sum.amount ? Number(payouts._sum.amount) : 0;
  const available = totalIncome - withdrawn;

  return { merchantId, totalSell, totalIncome, withdrawn, available };
}

// -------- create payouts (withdraw) --------
// Creates a BRAND payout after checking available balance
export async function createBrandPayout({ brandId, amount, note = '' }) {
  const amt = Number(amount);
  if (!brandId) throw new Error('brandId is required');
  if (!Number.isFinite(amt) || amt <= 0) throw new Error('amount must be > 0');

  const lockKey = hash64(`brand:${brandId}`);

  const result = await prisma.$transaction(async (tx) => {
    // Best-effort lock to avoid race (works on Postgres/Neon)
    try {
      await tx.$executeRawUnsafe('SELECT pg_advisory_xact_lock($1)', lockKey);
    } catch (_) {
      // ignore if not supported
    }

    const bal = await (async () => {
      const [sales, payouts] = await Promise.all([
        tx.sale.aggregate({
          where: { ...paidSaleWhere, brandId },
          _sum: { brandEarning: true, total: true },
        }),
        tx.payout.aggregate({
          where: { actor: PayoutActor.BRAND, brandId },
          _sum: { amount: true },
        }),
      ]);
      const totalSell = sales._sum.total || 0;
      const totalIncome = sales._sum.brandEarning || 0;
      const withdrawn = payouts._sum.amount ? Number(payouts._sum.amount) : 0;
      const available = totalIncome - withdrawn;
      return { totalSell, totalIncome, withdrawn, available };
    })();

    if (amt > bal.available + 1e-9) {
      throw new Error(`Insufficient balance. Available: ${bal.available.toFixed(2)}`);
    }

    const payout = await tx.payout.create({
      data: {
        actor: PayoutActor.BRAND,
        brandId,
        amount: toDecimalString(amt),
        note,
      },
    });

    const newWithdrawn = bal.withdrawn + amt;
    const newAvailable = bal.totalIncome - newWithdrawn;

    return {
      payout,
      before: bal,
      after: {
        withdrawn: newWithdrawn,
        available: Number(newAvailable.toFixed(2)),
      },
    };
  });

  return result;
}

// Creates a MERCHANT payout after checking available balance
export async function createMerchantPayout({ merchantId, amount, note = '' }) {
  const amt = Number(amount);
  if (!merchantId) throw new Error('merchantId is required');
  if (!Number.isFinite(amt) || amt <= 0) throw new Error('amount must be > 0');

  const lockKey = hash64(`merchant:${merchantId}`);

  const result = await prisma.$transaction(async (tx) => {
    try {
      await tx.$executeRawUnsafe('SELECT pg_advisory_xact_lock($1)', lockKey);
    } catch (_) {}

    const bal = await (async () => {
      const [sales, payouts] = await Promise.all([
        tx.sale.aggregate({
          where: { ...paidSaleWhere, merchantId },
          _sum: { merchantEarning: true, total: true },
        }),
        tx.payout.aggregate({
          where: { actor: PayoutActor.MERCHANT, merchantId },
          _sum: { amount: true },
        }),
      ]);
      const totalSell = sales._sum.total || 0;
      const totalIncome = sales._sum.merchantEarning || 0;
      const withdrawn = payouts._sum.amount ? Number(payouts._sum.amount) : 0;
      const available = totalIncome - withdrawn;
      return { totalSell, totalIncome, withdrawn, available };
    })();

    if (amt > bal.available + 1e-9) {
      throw new Error(`Insufficient balance. Available: ${bal.available.toFixed(2)}`);
    }

    const payout = await tx.payout.create({
      data: {
        actor: PayoutActor.MERCHANT,
        merchantId,
        amount: toDecimalString(amt),
        note,
      },
    });

    const newWithdrawn = bal.withdrawn + amt;
    const newAvailable = bal.totalIncome - newWithdrawn;

    return {
      payout,
      before: bal,
      after: {
        withdrawn: newWithdrawn,
        available: Number(newAvailable.toFixed(2)),
      },
    };
  });

  return result;
}

// -------- history (lists) --------
export async function listBrandPayouts(brandId, { page = 1, pageSize = 20 } = {}) {
  if (!brandId) throw new Error('brandId is required');
  const skip = (page - 1) * pageSize;

  const [rows, total] = await Promise.all([
    prisma.payout.findMany({
      where: { actor: PayoutActor.BRAND, brandId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      select: { id: true, amount: true, note: true, createdAt: true },
    }),
    prisma.payout.count({ where: { actor: PayoutActor.BRAND, brandId } }),
  ]);

  return { rows, page, pageSize, total, pages: Math.ceil(total / pageSize) };
}

export async function listMerchantPayouts(merchantId, { page = 1, pageSize = 20 } = {}) {
  if (!merchantId) throw new Error('merchantId is required');
  const skip = (page - 1) * pageSize;

  const [rows, total] = await Promise.all([
    prisma.payout.findMany({
      where: { actor: PayoutActor.MERCHANT, merchantId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      select: { id: true, amount: true, note: true, createdAt: true },
    }),
    prisma.payout.count({ where: { actor: PayoutActor.MERCHANT, merchantId } }),
  ]);

  return { rows, page, pageSize, total, pages: Math.ceil(total / pageSize) };
}
