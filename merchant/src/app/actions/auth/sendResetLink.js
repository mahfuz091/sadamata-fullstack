"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { BASE_URL } from "@/lib/constants"; // e.g. https://your-site.com

export async function sendResetLink(formData) {
  const email = (formData.get("email") || "").toLowerCase().trim();
  if (!email) return { success: false, message: "Email is required" };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Avoid revealing whether account exists — still respond success to avoid enumeration
    return { success: true, message: "If an account exists, a reset link was sent" };
  }

  // create secure token and store its hash
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = await bcrypt.hash(token, 10);

  // create record (expire in 15 minutes)
  await prisma.passwordResetToken.create({
    data: {
      email,
      tokenHash,
      expires: new Date(Date.now() + 1000 * 60 * 15),
    },
  });

  const link = `${BASE_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  await sendEmail({
    to: email,
    subject: "Reset your password",
    html: `<p>Click to reset your password: <a href="${link}">${link}</a></p><p>This link expires in 15 minutes.</p>`,
  });

  return { success: true, message: "If an account exists, a reset link was sent" };
}
