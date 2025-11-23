"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function resetPassword(formData) {
  const token = formData.get("token");
  const email = (formData.get("email") || "").toLowerCase().trim();
  const newPassword = formData.get("password");

  if (!token || !email || !newPassword) {
    return { success: false, message: "Invalid request" };
  }

  // find records for this email and not used
  const records = await prisma.passwordResetToken.findMany({
    where: { email, used: false, expires: { gt: new Date() } },
    orderBy: { createdAt: "desc" }
  });

  if (!records || records.length === 0) {
    return { success: false, message: "Invalid or expired token" };
  }

  // verify token by comparing hash
  const bcrypt = (await import("bcryptjs")).default;
  let matched = null;
  for (const r of records) {
    const ok = await bcrypt.compare(token, r.tokenHash);
    if (ok) { matched = r; break; }
  }

  if (!matched) return { success: false, message: "Invalid or expired token" };

  // update user password
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { password: hashed },
  });

  // mark token used (single-use)
  await prisma.passwordResetToken.update({
    where: { id: matched.id },
    data: { used: true },
  });

  return { success: true, message: "Password has been reset — you can now login." };
}
