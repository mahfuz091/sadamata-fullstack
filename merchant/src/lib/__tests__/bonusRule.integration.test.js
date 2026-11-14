import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/index.js";

// These hit a real database. They only run when TEST_DATABASE_URL is provided,
// e.g. TEST_DATABASE_URL=postgres://... npm test
const url = process.env.TEST_DATABASE_URL;
const d = url ? describe : describe.skip;

d("BonusRule lifecycle (integration)", () => {
  let prisma;
  const SCENARIO = "EXCLUSIVE_BRAND";

  beforeAll(() => {
    const adapter = new PrismaPg({ connectionString: url });
    prisma = new PrismaClient({ adapter });
  });

  afterAll(async () => {
    if (prisma) await prisma.$disconnect();
  });

  it("closes the old row and leaves exactly one active per scenario after an update", async () => {
    const now = new Date();

    await prisma.bonusRule.updateMany({
      where: { scenario: SCENARIO, isActive: true },
      data: { isActive: false, effectiveTo: now },
    });

    await prisma.$transaction(async (tx) => {
      await tx.bonusRule.create({
        data: { scenario: SCENARIO, priceThreshold: 1000, brandPct: 60, merchantPct: 20, platformPct: 20, isActive: true },
      });
    });
    await prisma.$transaction(async (tx) => {
      await tx.bonusRule.updateMany({
        where: { scenario: SCENARIO, isActive: true },
        data: { isActive: false, effectiveTo: new Date() },
      });
      await tx.bonusRule.create({
        data: { scenario: SCENARIO, priceThreshold: 1500, brandPct: 50, merchantPct: 25, platformPct: 25, isActive: true },
      });
    });

    const active = await prisma.bonusRule.count({
      where: { scenario: SCENARIO, isActive: true },
    });
    expect(active).toBe(1);

    const current = await prisma.bonusRule.findFirst({
      where: { scenario: SCENARIO, isActive: true },
    });
    expect(Number(current.priceThreshold)).toBe(1500);
    expect(Number(current.brandPct)).toBe(50);
    expect(Number(current.merchantPct) + Number(current.platformPct) + Number(current.brandPct)).toBe(100);
  });

  it("has a rule for every scenario from the seed/migration", async () => {
    const scenarios = await prisma.bonusRule.findMany({
      where: { isActive: true },
      select: { scenario: true },
    });
    const set = new Set(scenarios.map((r) => r.scenario));
    expect(set.has("NO_BRAND")).toBe(true);
    expect(set.has("NON_EXCLUSIVE_BRAND")).toBe(true);
  });
});
