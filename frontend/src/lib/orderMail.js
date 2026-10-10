import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { orderConfirmationEmail, orderStatusEmail } from "@/lib/emailTemplates";
import { absoluteUrl } from "@/lib/siteUrl";

// Prisma Decimal -> plain number for the templates.
const num = (value) => Number(value ?? 0);

function recipientOf(order) {
  const guest = order.guestAddress;
  const address = order.address;

  const email = order.user?.email || address?.email || guest?.email || null;
  const name =
    order.user?.name ||
    [address?.firstName, address?.lastName].filter(Boolean).join(" ") ||
    [guest?.firstName, guest?.lastName].filter(Boolean).join(" ") ||
    "there";

  const lines = [
    name,
    address?.address || guest?.address,
    address?.zipCode || guest?.zipCode,
    address?.phone || guest?.phone,
  ].filter(Boolean);

  return { email, name, shippingAddress: lines.join("\n") };
}

function loadOrder(orderId) {
  return prisma.order.findUnique({
    where: { id: String(orderId) },
    include: {
      items: true,
      user: { select: { name: true, email: true } },
      address: true,
      guestAddress: true,
    },
  });
}

/**
 * Emails the buyer their paid-order receipt. Guest checkouts are covered too —
 * the address row carries the email when there is no user account.
 * Never throws: a mail failure must not turn a successful payment into a 500.
 */
export async function sendOrderConfirmation(orderId) {
  try {
    const order = await loadOrder(orderId);
    if (!order) return { success: false, error: "Order not found" };

    const { email, name, shippingAddress } = recipientOf(order);
    if (!email) {
      console.warn("[orderMail] no recipient email for order", orderId);
      return { success: false, error: "No recipient email" };
    }

    const { subject, html } = orderConfirmationEmail({
      name,
      orderNumber: order.tranId || order.id,
      items: order.items.map((item) => ({
        name: item.productTitle,
        variant: [item.color, item.size, item.fitType]
          .filter(Boolean)
          .join(" / "),
        quantity: item.quantity,
        total: num(item.unitPrice) * item.quantity,
      })),
      subtotal: num(order.subtotal),
      shipping: num(order.shippingFee),
      total: num(order.grandTotal),
      shippingAddress,
      orderUrl: absoluteUrl("orders"),
    });

    return await sendEmail({ to: email, subject, html });
  } catch (err) {
    console.error("[orderMail] confirmation failed:", err?.message || err);
    return { success: false, error: err?.message || "Failed to send" };
  }
}

/** Emails the buyer when an order moves to shipped / delivered / cancelled. */
export async function sendOrderStatusUpdate(orderId, status, trackingNote) {
  try {
    const order = await loadOrder(orderId);
    if (!order) return { success: false, error: "Order not found" };

    const { email, name } = recipientOf(order);
    if (!email) return { success: false, error: "No recipient email" };

    const { subject, html } = orderStatusEmail({
      name,
      orderNumber: order.tranId || order.id,
      status: status || order.status,
      trackingNote,
      orderUrl: absoluteUrl("orders"),
    });

    return await sendEmail({ to: email, subject, html });
  } catch (err) {
    console.error("[orderMail] status update failed:", err?.message || err);
    return { success: false, error: err?.message || "Failed to send" };
  }
}
