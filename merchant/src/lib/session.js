import { auth } from "@/auth";

/**
 * Server actions are public POST endpoints. The merchant/user id an action
 * operates on arrives as an argument, so it has to be checked against the
 * session rather than trusted.
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
