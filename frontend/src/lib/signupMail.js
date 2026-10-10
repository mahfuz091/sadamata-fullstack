import { sendEmailAsync } from "@/lib/email";
import { welcomeEmail, adminNewApplicationEmail } from "@/lib/emailTemplates";
import { PORTAL, absoluteUrl } from "@/lib/siteUrl";

const ADMIN_ALERT_EMAIL = process.env.ADMIN_ALERT_EMAIL;
const ADMIN_REVIEW_URL = process.env.ADMIN_REVIEW_URL;

/**
 * Welcome the new account and, for portals that need admin approval, ping the
 * admin inbox. Fire-and-forget — signup must succeed even when SMTP is down.
 */
export function sendSignupEmails({ email, name, portal = PORTAL, loginPath }) {
  if (!email) return;

  const { subject, html } = welcomeEmail({
    name,
    portal,
    loginUrl: loginPath ? absoluteUrl(loginPath) : undefined,
  });

  sendEmailAsync({ to: email, subject, html });

  if (ADMIN_ALERT_EMAIL && (portal === "merchant" || portal === "brand")) {
    const admin = adminNewApplicationEmail({
      applicantName: name,
      applicantEmail: email,
      portal,
      reviewUrl: ADMIN_REVIEW_URL,
    });

    sendEmailAsync({ to: ADMIN_ALERT_EMAIL, subject: admin.subject, html: admin.html });
  }
}
