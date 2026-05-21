import { prisma } from "@/lib/prisma";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const LENGTH = 10;

function generateCode() {
  let result = "";
  for (let i = 0; i < LENGTH; i++) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return result;
}

export async function generateUniqueSmpin(tx = prisma) {
  let smpin;
  let attempts = 0;
  do {
    if (attempts++ > 20) throw new Error("Failed to generate unique SMPIN");
    smpin = generateCode();
    const existing = await tx.product.findUnique({ where: { smpin } });
    if (!existing) break;
  } while (true);
  return smpin;
}
