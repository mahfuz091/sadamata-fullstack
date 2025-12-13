import { auth } from "@/auth";

export async function requireRole(allowedRoles = []) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (!allowedRoles.includes(session.user.role)) {
    throw new Error("Forbidden");
  }

  return session.user;
}
