import { NextResponse } from "next/server";

import { requireRole } from "@/lib/requireRole";
import { sendEmail, verifyMailer } from "@/lib/email";

/**
 * Admin-only SMTP check.
 *   GET  /api/email/test            -> verifies the Zoho handshake
 *   GET  /api/email/test?to=a@b.com -> also sends a test message
 */
export async function GET(req) {
  try {
    await requireRole(["ADMIN"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const verified = await verifyMailer();
  const to = req.nextUrl.searchParams.get("to");

  if (!to) return NextResponse.json({ verified });

  const sent = await sendEmail({
    to,
    subject: "Sadamata SMTP test",
    html: "<p>Zoho SMTP is wired up correctly.</p>",
  });

  return NextResponse.json({ verified, sent });
}
