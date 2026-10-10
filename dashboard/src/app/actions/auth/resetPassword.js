"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendEmailAsync } from "@/lib/email";
import { passwordChangedEmail } from "@/lib/emailTemplates";
import { PORTAL } from "@/lib/siteUrl";

const MIN_PASSWORD_LENGTH = 8;

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function resetPassword(_prevState, formData) {
  const token = String(formData?.get?.("token") || "").trim();
  const email = String(formData?.get?.("email") || "")
    .toLowerCase()
    .trim();
  const password = String(formData?.get?.("password") || "");
  const confirmPassword = String(formData?.get?.("confirmPassword") || password);

  if (!token || !email || !password) {
    return { success: false, message: "Invalid request" };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      success: false,
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    };
  }

  if (password !== confirmPassword) {
    return { success: false, message: "Passwords do not match" };
  }

  try {
    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashToken(token) },
    });

    if (
      !record ||
      record.used ||
      record.email !== email ||
      record.expires < new Date()
    ) {
      return { success: false, message: "This reset link is invalid or expired" };
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true },
    });

    if (!user) {
      return { success: false, message: "This reset link is invalid or expired" };
    }

    const hashed = await bcrypt.hash(password, 10);

    // Burn the token in the same transaction that changes the password, so a
    // replayed link can never set a second password.
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashed },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { used: true },
      }),
      prisma.passwordResetToken.updateMany({
        where: { email, used: false },
        data: { used: true },
      }),
    ]);

    const { subject, html } = passwordChangedEmail({
      name: user.name,
      portal: PORTAL,
    });
    sendEmailAsync({ to: email, subject, html });

    return { success: true, message: "Password updated. You can sign in now." };
  } catch (err) {
    console.error("resetPassword error:", err);
    return { success: false, message: "Something went wrong" };
  }
}
