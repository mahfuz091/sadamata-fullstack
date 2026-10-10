import { prisma } from "@/lib/prisma";
import { sendEmailAsync } from "@/lib/email";
import { orderStatusEmail } from "@/lib/emailTemplates";

const SHOP_URL = (process.env.SHOP_URL || "https://sadamata.com").replace(
  /\/+$/,
  "",
);

// Statuses the buyer actually needs to hear about. PAID is already covered by
// the confirmation the shop sends on payment, and PENDING is not news.
const NOTIFIABLE = new Set(["SHIPPED", "COMPLETED", "CANCELLED", "RETURNED"]);

const NOTES = {
  SHIPPED: "Your parcel is on its way. Delivery usually takes 2-5 working days.",
  COMPLETED: "Your order has been delivered. Thanks for shopping with Sadamata!",
  CANCELLED: "If you were charged, the refund will be processed to your original payment method.",
  RETURNED: "We have received your return and will follow up about the refund.",
};

/**
 * Tell the buyer their order moved to a new status.
 * Fire-and-forget so an SMTP problem never blocks an admin status change.
 */
export async function notifyOrderStatus(orderId, status) {
  if (!NOTIFIABLE.has(status)) return;

  try {
    const order = await prisma.order.findUnique({
      where: { id: String(orderId) },
      select: {
        id: true,
        tranId: true,
        user: { select: { name: true, email: true } },
        address: { select: { firstName: true, lastName: true, email: true } },
        guestAddress: { select: { firstName: true, lastName: true, email: true } },
      },
    });

    if (!order) return;

    const email =
      order.user?.email ||
      order.address?.email ||
      order.guestAddress?.email ||
      null;

    if (!email) return;

    const name =
      order.user?.name ||
      [order.address?.firstName, order.address?.lastName].filter(Boolean).join(" ") ||
      [order.guestAddress?.firstName, order.guestAddress?.lastName]
        .filter(Boolean)
        .join(" ") ||
      "there";

    const { subject, html } = orderStatusEmail({
      name,
      orderNumber: order.tranId || order.id,
      status,
      trackingNote: NOTES[status],
      orderUrl: `${SHOP_URL}/orders`,
    });

    sendEmailAsync({ to: email, subject, html });
  } catch (err) {
    console.error("[orderMail] status notify failed:", err?.message || err);
  }
}
