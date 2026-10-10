import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/index.js";

// These hit a real database. They only run when TEST_DATABASE_URL is provided,
// e.g. TEST_DATABASE_URL=postgres://... npm test
const url = process.env.TEST_DATABASE_URL;
const d = url ? describe : describe.skip;

d("MerchantBonusRule lifecycle (integration)", () => {
  let prisma;

  beforeAll(() => {
    const adapter = new PrismaPg({ connectionString: url });
    prisma = new PrismaClient({ adapter });
  });

  afterAll(async () => {
    if (prisma) await prisma.$disconnect();
  });

  it("closes the old row and leaves exactly one active after an update", async () => {
    const now = new Date();
    await prisma.merchantBonusRule.updateMany({
      where: { isActive: true },
      data: { isActive: false, effectiveTo: now },
    });

    await prisma.$transaction(async (tx) => {
      await tx.merchantBonusRule.create({
        data: { priceThreshold: 1000, excessPct: 40, isActive: true },
      });
    });
    await prisma.$transaction(async (tx) => {
      await tx.merchantBonusRule.updateMany({
        where: { isActive: true },
        data: { isActive: false, effectiveTo: new Date() },
      });
      await tx.merchantBonusRule.create({
        data: { priceThreshold: 1500, excessPct: 35, isActive: true },
      });
    });

    const active = await prisma.merchantBonusRule.count({
      where: { isActive: true },
    });
    expect(active).toBe(1);

    const current = await prisma.merchantBonusRule.findFirst({
      where: { isActive: true },
    });
    expect(Number(current.priceThreshold)).toBe(1500);
    expect(Number(current.excessPct)).toBe(35);
  });
});
