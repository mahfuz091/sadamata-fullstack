import { sendEmailAsync } from "@/lib/email";
import {
  accountApprovedEmail,
  accountDeactivatedEmail,
} from "@/lib/emailTemplates";

const PORTAL_URLS = {
  merchant: process.env.MERCHANT_PORTAL_URL || "https://merch.sadamata.com",
  brand: process.env.BRAND_PORTAL_URL || "https://brand.sadamata.com",
  shop: process.env.SHOP_URL || "https://sadamata.com",
};

// Role -> which portal the account actually signs in to.
export function portalForRole(role) {
  if (role === "MERCH") return "merchant";
  if (role === "BRAND") return "brand";
  return "shop";
}

/**
 * Tell a merchant / brand that an admin approved or deactivated their account.
 * Fire-and-forget: a mail failure must never roll back the status change.
 */
export function notifyAccountStatus({ email, name, role, isActive, reason }) {
  if (!email) return;

  const portal = portalForRole(role);

  // Customers are not gated by admin approval, so this notice is noise for them.
  if (portal === "shop") return;

  const { subject, html } = isActive
    ? accountApprovedEmail({ name, portal, loginUrl: PORTAL_URLS[portal] })
    : accountDeactivatedEmail({ name, portal, reason });

  sendEmailAsync({ to: email, subject, html });
}
