import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Server actions are public POST endpoints. Every action below takes the
 * account it should operate on as an argument, which a caller can set to any
 * value, so the ids have to be checked against the session instead of trusted.
 */
export async function requireSessionUser() {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  return user;
}

/** Asserts the caller is acting on their own account. */
export async function requireSessionUserId(requestedUserId) {
  const user = await requireSessionUser();

  if (requestedUserId && String(requestedUserId) !== String(user.id)) {
    throw new Error("Forbidden");
  }

  return user.id;
}

/** Asserts the brand belongs to the signed-in user. */
export async function requireOwnedBrandId(brandId) {
  const user = await requireSessionUser();
  if (!brandId) throw new Error("Forbidden");

  const brand = await prisma.brand.findFirst({
    where: { id: String(brandId), userId: user.id },
    select: { id: true },
  });

  if (!brand) throw new Error("Forbidden");

  return brand.id;
}
