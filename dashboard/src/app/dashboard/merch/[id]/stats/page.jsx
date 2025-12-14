import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Merchant Earnings",
};

export default async function MerchantStatsPage({ params }) {
  const userId = params.id;

  // 1️⃣ Ensure merchant exists
  const merchant = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      merchantProfile: {
        select: {
          tiar: true,
          leftTiar: true,
        },
      },
    },
  });

  if (!merchant || !merchant.merchantProfile) {
    notFound();
  }

  // 2️⃣ Sales (merchant earnings)
  const sales = await prisma.sale.findMany({
    where: {
      merchantId: userId,
    },
    select: {
      total: true,
      merchantEarning: true,
      productId: true,
      createdAt: true,
    },
  });

  const totalSales = sales.length;

  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total), 0);

  const totalMerchantEarning = sales.reduce(
    (sum, s) => sum + Number(s.merchantEarning),
    0
  );

  const productsWithSales = new Set(sales.map((s) => s.productId)).size;

  // 3️⃣ Withdrawals (merchant payouts)
  const payoutAgg = await prisma.payout.aggregate({
    where: {
      merchantId: userId,
      actor: "MERCHANT",
    },
    _sum: { amount: true },
  });

  const withdrawn = Number(payoutAgg._sum.amount || 0);
  const balance = totalMerchantEarning - withdrawn;

  return (
    <div className='p-6 space-y-8'>
      <h1 className='text-2xl font-semibold'>
        Merchant Earnings – {merchant.name}
      </h1>

      {/* Top Summary */}
      <div className='grid grid-cols-3 gap-4'>
        <Stat title='BDT Balance' value={balance} />
        <Stat title='Total Income' value={totalMerchantEarning} />
        <Stat title='Withdrawn Amount' value={withdrawn} />
      </div>

      {/* Sales Report */}
      <Section title='Sales Report'>
        <Mini label='Total Sales' value={totalSales} />
        <Mini label='Total Revenue' value={totalRevenue} />
        <Mini label='Products with Sales' value={productsWithSales} />
      </Section>

      {/* Product Tier */}
      <Section title='Product Limit'>
        <Mini label='Total Allowed' value={merchant.merchantProfile.tiar} />
        <Mini
          label='Used'
          value={
            merchant.merchantProfile.tiar - merchant.merchantProfile.leftTiar
          }
        />
        <Mini label='Remaining' value={merchant.merchantProfile.leftTiar} />
      </Section>
    </div>
  );
}

/* ───────── UI Helpers ───────── */

function Stat({ title, value }) {
  return (
    <div className='border rounded-lg p-4'>
      <p className='text-sm text-muted-foreground'>{title}</p>
      <p className='text-2xl font-semibold'>৳{Number(value).toFixed(2)}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className='border rounded-lg p-4 space-y-3'>
      <h2 className='font-medium'>{title}</h2>
      <div className='grid grid-cols-3 gap-4'>{children}</div>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div>
      <p className='text-sm text-muted-foreground'>{label}</p>
      <p className='font-semibold'>{value}</p>
    </div>
  );
}
