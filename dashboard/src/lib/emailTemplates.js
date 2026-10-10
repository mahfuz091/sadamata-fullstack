/**
 * Transactional email templates shared by all four Sadamata apps.
 * Table-based, inline-styled markup — Outlook and Gmail strip <style> blocks.
 */

const BRAND = "Sadamata";
const ACCENT = "#111111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#f4f4f5";

function esc(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function button(label, href) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background:${ACCENT};border-radius:6px;">
          <a href="${esc(href)}"
             style="display:inline-block;padding:13px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;">
            ${esc(label)}
          </a>
        </td>
      </tr>
    </table>`;
}

function layout({ title, body, footerNote }) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${BG};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                 style="max-width:560px;background:#ffffff;border:1px solid ${BORDER};border-radius:10px;overflow:hidden;">
            <tr>
              <td style="padding:24px 32px;border-bottom:1px solid ${BORDER};">
                <span style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:bold;letter-spacing:1px;color:${ACCENT};">
                  ${BRAND}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1f2937;">
                <h1 style="margin:0 0 16px;font-size:20px;line-height:1.35;color:${ACCENT};">${esc(title)}</h1>
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid ${BORDER};font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${MUTED};">
                ${footerNote ? `${footerNote}<br /><br />` : ""}
                This is an automated message from ${BRAND}. Please do not reply to this address.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

const PORTALS = {
  shop: { label: "Sadamata", role: "customer" },
  merchant: { label: "Sadamata Merchant", role: "merchant" },
  brand: { label: "Sadamata Brand", role: "brand" },
  admin: { label: "Sadamata Admin", role: "admin" },
};

function portalLabel(portal) {
  return PORTALS[portal]?.label || BRAND;
}

/* ------------------------------ password reset ----------------------------- */

export function passwordResetEmail({ name, link, minutes = 15, portal = "shop" }) {
  const who = portalLabel(portal);
  return {
    subject: `Reset your ${who} password`,
    html: layout({
      title: "Reset your password",
      body: `
        <p style="margin:0 0 12px;">Hi ${esc(name || "there")},</p>
        <p style="margin:0 0 12px;">
          We received a request to reset the password for your ${esc(who)} account.
          Click the button below to choose a new one.
        </p>
        ${button("Reset password", link)}
        <p style="margin:0 0 12px;color:${MUTED};font-size:13px;">
          This link expires in ${minutes} minutes and can be used once.
        </p>
        <p style="margin:0;color:${MUTED};font-size:13px;">
          Button not working? Paste this into your browser:<br />
          <span style="word-break:break-all;color:${ACCENT};">${esc(link)}</span>
        </p>`,
      footerNote:
        "If you did not request a password reset, you can safely ignore this email — your password will not change.",
    }),
  };
}

export function passwordChangedEmail({ name, portal = "shop" }) {
  const who = portalLabel(portal);
  return {
    subject: `Your ${who} password was changed`,
    html: layout({
      title: "Your password was changed",
      body: `
        <p style="margin:0 0 12px;">Hi ${esc(name || "there")},</p>
        <p style="margin:0;">
          The password for your ${esc(who)} account was just changed. If this was you, nothing else is needed.
        </p>`,
      footerNote:
        "If you did not make this change, contact support immediately — your account may be compromised.",
    }),
  };
}

/* -------------------------------- onboarding ------------------------------- */

export function welcomeEmail({ name, portal = "shop", loginUrl }) {
  const who = portalLabel(portal);
  const needsApproval = portal === "merchant" || portal === "brand";

  return {
    subject: `Welcome to ${who}`,
    html: layout({
      title: `Welcome to ${who}`,
      body: `
        <p style="margin:0 0 12px;">Hi ${esc(name || "there")},</p>
        <p style="margin:0 0 12px;">Your ${esc(who)} account has been created.</p>
        ${
          needsApproval
            ? `<p style="margin:0 0 12px;">
                 Our team is reviewing your application. You will get another email as soon
                 as it is approved, and you can sign in from then on.
               </p>`
            : `<p style="margin:0 0 12px;">You can sign in and start shopping right away.</p>`
        }
        ${loginUrl && !needsApproval ? button("Sign in", loginUrl) : ""}`,
    }),
  };
}

/* ---------------------------- approval decisions --------------------------- */

export function accountApprovedEmail({ name, portal = "merchant", loginUrl }) {
  const who = portalLabel(portal);
  return {
    subject: `Your ${who} account is approved`,
    html: layout({
      title: "Your account is approved",
      body: `
        <p style="margin:0 0 12px;">Hi ${esc(name || "there")},</p>
        <p style="margin:0 0 12px;">
          Good news — your ${esc(who)} account has been reviewed and approved.
          You now have full access to the portal.
        </p>
        ${
          portal === "merchant"
            ? `<p style="margin:0 0 12px;">You can upload designs, create products, and start selling.</p>`
            : ""
        }
        ${
          portal === "brand"
            ? `<p style="margin:0 0 12px;">Your brand is now live — you can publish brand products and track sales.</p>`
            : ""
        }
        ${loginUrl ? button("Go to dashboard", loginUrl) : ""}`,
    }),
  };
}

export function accountDeactivatedEmail({ name, portal = "merchant", reason }) {
  const who = portalLabel(portal);
  return {
    subject: `Your ${who} account has been deactivated`,
    html: layout({
      title: "Your account has been deactivated",
      body: `
        <p style="margin:0 0 12px;">Hi ${esc(name || "there")},</p>
        <p style="margin:0 0 12px;">
          Your ${esc(who)} account has been deactivated by an administrator, so you will not be
          able to sign in until it is reactivated.
        </p>
        ${reason ? `<p style="margin:0 0 12px;"><strong>Reason:</strong> ${esc(reason)}</p>` : ""}
        <p style="margin:0;">If you believe this is a mistake, reply to our support team.</p>`,
    }),
  };
}

/* ---------------------------------- orders --------------------------------- */

function money(amount) {
  const n = Number(amount || 0);
  return `৳${n.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function orderRows(items = []) {
  if (!items.length) return "";

  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-size:14px;">
            ${esc(item.name || "Item")}
            ${item.variant ? `<br /><span style="color:${MUTED};font-size:12px;">${esc(item.variant)}</span>` : ""}
          </td>
          <td align="center" style="padding:10px 0;border-bottom:1px solid ${BORDER};font-size:14px;">
            ${esc(item.quantity ?? 1)}
          </td>
          <td align="right" style="padding:10px 0;border-bottom:1px solid ${BORDER};font-size:14px;">
            ${money(item.total ?? (item.price || 0) * (item.quantity || 1))}
          </td>
        </tr>`,
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
      <tr>
        <td style="padding:0 0 8px;border-bottom:2px solid ${ACCENT};font-size:12px;text-transform:uppercase;color:${MUTED};">Item</td>
        <td align="center" style="padding:0 0 8px;border-bottom:2px solid ${ACCENT};font-size:12px;text-transform:uppercase;color:${MUTED};">Qty</td>
        <td align="right" style="padding:0 0 8px;border-bottom:2px solid ${ACCENT};font-size:12px;text-transform:uppercase;color:${MUTED};">Total</td>
      </tr>
      ${rows}
    </table>`;
}

export function orderConfirmationEmail({
  name,
  orderNumber,
  items = [],
  subtotal,
  shipping,
  total,
  shippingAddress,
  orderUrl,
}) {
  return {
    subject: `Order confirmed — #${orderNumber}`,
    html: layout({
      title: `Thanks for your order, ${esc(name || "there")}!`,
      body: `
        <p style="margin:0 0 12px;">
          We received your payment and your order <strong>#${esc(orderNumber)}</strong> is being prepared.
        </p>
        ${orderRows(items)}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
          ${subtotal != null ? `<tr><td style="padding:4px 0;color:${MUTED};">Subtotal</td><td align="right" style="padding:4px 0;">${money(subtotal)}</td></tr>` : ""}
          ${shipping != null ? `<tr><td style="padding:4px 0;color:${MUTED};">Shipping</td><td align="right" style="padding:4px 0;">${money(shipping)}</td></tr>` : ""}
          <tr>
            <td style="padding:10px 0 0;border-top:1px solid ${BORDER};font-weight:bold;">Total paid</td>
            <td align="right" style="padding:10px 0 0;border-top:1px solid ${BORDER};font-weight:bold;">${money(total)}</td>
          </tr>
        </table>
        ${
          shippingAddress
            ? `<p style="margin:20px 0 0;font-size:13px;color:${MUTED};">
                 <strong style="color:${ACCENT};">Shipping to</strong><br />${esc(shippingAddress).replace(/\n/g, "<br />")}
               </p>`
            : ""
        }
        ${orderUrl ? button("View your order", orderUrl) : ""}`,
    }),
  };
}

export function orderStatusEmail({ name, orderNumber, status, orderUrl, trackingNote }) {
  const pretty = String(status || "").replace(/_/g, " ").toLowerCase();
  return {
    subject: `Order #${orderNumber} — ${pretty}`,
    html: layout({
      title: `Your order is ${esc(pretty)}`,
      body: `
        <p style="margin:0 0 12px;">Hi ${esc(name || "there")},</p>
        <p style="margin:0 0 12px;">
          Order <strong>#${esc(orderNumber)}</strong> is now <strong>${esc(pretty)}</strong>.
        </p>
        ${trackingNote ? `<p style="margin:0 0 12px;">${esc(trackingNote)}</p>` : ""}
        ${orderUrl ? button("Track your order", orderUrl) : ""}`,
    }),
  };
}

/* ------------------------------ admin notices ------------------------------ */

export function adminNewApplicationEmail({ applicantName, applicantEmail, portal, reviewUrl }) {
  const who = portalLabel(portal);
  return {
    subject: `New ${who} application — ${applicantName || applicantEmail}`,
    html: layout({
      title: `New ${who} application`,
      body: `
        <p style="margin:0 0 12px;">A new ${esc(who)} account is waiting for review.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;">
          <tr><td style="padding:4px 16px 4px 0;color:${MUTED};">Name</td><td>${esc(applicantName || "—")}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:${MUTED};">Email</td><td>${esc(applicantEmail || "—")}</td></tr>
        </table>
        ${reviewUrl ? button("Review application", reviewUrl) : ""}`,
    }),
  };
}
