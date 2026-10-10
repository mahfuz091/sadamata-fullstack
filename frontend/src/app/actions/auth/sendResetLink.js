"use server";

import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { passwordResetEmail } from "@/lib/emailTemplates";
import { PORTAL, absoluteUrl } from "@/lib/siteUrl";

const TOKEN_TTL_MINUTES = 15;

// SHA-256 (not bcrypt) so the token can be looked up directly on the unique
// `tokenHash` index instead of scanning every row for the email.
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Same reply whether or not the account exists — no account enumeration.
const NEUTRAL = {
  success: true,
  message: "If an account exists for that email, a reset link is on its way.",
};

export async function sendResetLink(_prevState, formData) {
  const email = String(formData?.get?.("email") || "")
    .toLowerCase()
    .trim();

  if (!email) {
    return { success: false, message: "Email is required" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    if (!user) return NEUTRAL;

    // Any link mailed earlier is dead the moment a new one is issued.
    await prisma.passwordResetToken.updateMany({
      where: { email, used: false },
      data: { used: true },
    });

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.passwordResetToken.create({
      data: {
        email,
        tokenHash: hashToken(token),
        expires: new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000),
      },
    });

    const link = absoluteUrl(
      `reset-password?token=${token}&email=${encodeURIComponent(email)}`,
    );

    const { subject, html } = passwordResetEmail({
      name: user.name,
      link,
      minutes: TOKEN_TTL_MINUTES,
      portal: PORTAL,
    });

    const result = await sendEmail({ to: email, subject, html });

    if (!result.success) {
      return {
        success: false,
        message: "Could not send the reset email. Please try again shortly.",
      };
    }

    return NEUTRAL;
  } catch (err) {
    console.error("sendResetLink error:", err);
    return { success: false, message: "Something went wrong" };
  }
}
