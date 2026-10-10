import nodemailer from "nodemailer";

/**
 * Zoho Mail SMTP transport.
 *
 * Zoho rejects any `from` address that is not the authenticated mailbox or a
 * verified alias on the same org ("553 Relaying disallowed"), so the sender is
 * always forced back to EMAIL_USER when EMAIL_FROM is missing or mismatched.
 *
 * Env:
 *   EMAIL_HOST  smtp.zoho.com (US) | smtp.zoho.in | smtp.zoho.eu
 *   EMAIL_PORT  465 (SSL, default) or 587 (STARTTLS)
 *   EMAIL_USER  full Zoho mailbox, e.g. no-reply@sadamata.com
 *   EMAIL_PASS  Zoho app-specific password (not the account password)
 *   EMAIL_FROM  optional display form, e.g. "Sadamata <no-reply@sadamata.com>"
 */

const HOST = process.env.EMAIL_HOST || "smtp.zoho.com";
const PORT = Number(process.env.EMAIL_PORT || 465);
const USER = process.env.EMAIL_USER;
const PASS = process.env.EMAIL_PASS;

// 465 = implicit SSL, 587 = STARTTLS
const SECURE = PORT === 465;

// Reuse one pooled transport across hot reloads / lambda invocations.
const globalForMailer = globalThis;
globalForMailer.__sadamataMailer ??= { transporter: null };

function isConfigured() {
  return Boolean(HOST && USER && PASS);
}

export function getTransporter() {
  if (!isConfigured()) return null;

  if (!globalForMailer.__sadamataMailer.transporter) {
    globalForMailer.__sadamataMailer.transporter = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      secure: SECURE,
      requireTLS: !SECURE,
      auth: { user: USER, pass: PASS },
      pool: true,
      maxConnections: 3,
      maxMessages: 50,
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    });
  }

  return globalForMailer.__sadamataMailer.transporter;
}

// Keep the envelope sender aligned with the authenticated Zoho mailbox.
function resolveFrom() {
  const configured = (process.env.EMAIL_FROM || "").trim();
  if (!configured) return USER;

  const address = configured.match(/<([^>]+)>/)?.[1] || configured;
  if (address.toLowerCase() !== String(USER).toLowerCase()) {
    // Display name is kept, address is swapped to the mailbox Zoho authorises.
    const name = configured.replace(/<[^>]*>/, "").trim().replace(/^"|"$/g, "");
    return name ? `"${name}" <${USER}>` : USER;
  }

  return configured;
}

// Crude but dependency-free plain-text fallback for clients without HTML.
function htmlToText(html = "") {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Send one mail. Never throws — transactional flows (approval, signup,
 * checkout) must not fail because SMTP is down. Inspect the return value when
 * the caller needs to react to a failure.
 *
 * @returns {Promise<{success: boolean, messageId?: string, skipped?: boolean, error?: string}>}
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
  cc,
  bcc,
  attachments,
} = {}) {
  if (!to || !subject) {
    return { success: false, error: "`to` and `subject` are required" };
  }

  const transporter = getTransporter();
  if (!transporter) {
    console.warn(
      "[email] EMAIL_HOST/EMAIL_USER/EMAIL_PASS not set — skipped:",
      subject,
    );
    return { success: false, skipped: true, error: "SMTP not configured" };
  }

  try {
    const info = await transporter.sendMail({
      from: resolveFrom(),
      to,
      cc,
      bcc,
      replyTo: replyTo || process.env.EMAIL_REPLY_TO || undefined,
      subject,
      html,
      text: text || (html ? htmlToText(html) : undefined),
      attachments,
    });

    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("[email] send failed:", subject, err?.message || err);
    return { success: false, error: err?.message || "Failed to send email" };
  }
}

/** Fire-and-forget wrapper for places where the response must not wait on SMTP. */
export function sendEmailAsync(options) {
  return sendEmail(options).catch((err) => {
    console.error("[email] async send failed:", err?.message || err);
    return { success: false, error: err?.message || "Failed to send email" };
  });
}

/** Handshake check — useful from a health route or a one-off script. */
export async function verifyMailer() {
  const transporter = getTransporter();
  if (!transporter) return { success: false, error: "SMTP not configured" };

  try {
    await transporter.verify();
    return { success: true, host: HOST, port: PORT, user: USER };
  } catch (err) {
    return { success: false, error: err?.message || "Verify failed" };
  }
}

// Back-compat: merchant code imports the raw transporter.
export const transporter = getTransporter();
