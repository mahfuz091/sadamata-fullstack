import { PrismaClient } from "@/generated/prisma";

// Create a global object to store Prisma Client
const globalForPrisma = globalThis;

// Use the existing Prisma Client if available, or create a new one
const prisma = globalForPrisma.prisma ?? new PrismaClient();

// In non-production environments, persist the Prisma Client in globalForPrisma
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Prisma middleware to handle role-based updates
prisma.$use(async (params, next) => {
  // Check if the operation is an update on the `User` model
  if (params.model === "User" && params.action === "update") {
    const { userRole, userId } = params.context; // Assuming the current user's role and ID are passed in the context
    const updatedData = params.args.data; // Data being updated

    // If the current user is trying to update their own account (not admin)
    if (userRole !== "ADMIN" && userId !== params.args.where.id) {
      throw new Error(
        "You are not authorized to update other users' accounts."
      );
    }

    // If the user is not an admin, do not allow updating `isActive`
    if (userRole !== "ADMIN" && updatedData.isActive) {
      throw new Error("Only admins can update the account activation status.");
    }

    // If the user is an admin, allow updating `isActive`, but restrict other fields from being modified.
    if (userRole === "ADMIN") {
      const allowedFields = Object.keys(updatedData);
      if (allowedFields.some((field) => field !== "isActive")) {
        throw new Error("Admins can only update the `isActive` field.");
      }
    }
  }

  return next(params);
});

export { prisma };
