import { PrismaClient } from "@/generated/prisma";

// Create a global object to store Prisma Client
const globalForPrisma = globalThis;

// Use the existing Prisma Client if available, or create a new one
const prisma = globalForPrisma.prisma ?? new PrismaClient();

// In non-production environments, persist the Prisma Client in globalForPrisma
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };