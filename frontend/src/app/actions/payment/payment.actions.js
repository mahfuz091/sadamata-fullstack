// src/app/actions/payment/payment.actions.js
"use server";

import prisma from "@/lib/prisma";
import { initSslczSession } from "@/lib/sslcz";
import { joinUrl } from "@/lib/url";

const DEFAULT_CITY     = process.env.APP_DEFAULT_CITY     || "Dhaka";
const DEFAULT_POSTCODE = process.env.APP_DEFAULT_POSTCODE || "1000";
const DEFAULT_COUNTRY  = process.env.APP_DEFAULT_COUNTRY  || "Bangladesh";

const COUPONS = { SAVE10: 0.1, SAVE20: 0.2, WELCOME5: 0.05 };

const toNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

function normalizeItems(raw = []) {
  return raw.map((it) => {
    const unitPrice = [it.unitPrice, it.price, it.amount, it.total, it.newPrice, it.salePrice]
      .map(toNum).find(n => n > 0) || 0;
    const quantity  = [it.quantity, it.qty, it.count]
      .map(q => Math.max(0, toNum(q))).find(n => n > 0) || 0;

    return {
      productId: it.productId ?? it.id ?? null,
      productTitle: String(it.title || "Item"),
      unitPrice,
      quantity,
      color: it.color || null,
      size: it.size || null,
    };
  }).filter(it => it.unitPrice > 0 && it.quantity > 0);
}

function computeTotals(items, couponCode) {
  const subtotal = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
  const rate = COUPONS[couponCode] || 0;
  const discount = subtotal * rate;
  const tax = subtotal * 0.10;
  const shippingFee = 0;
  const grand = subtotal - discount + tax + shippingFee;
  return { subtotal, discount, tax, shippingFee, grand, rate };
}

async function loadAddressForUser(userId, addressId) {
  if (!userId) throw new Error("User required.");
  if (!addressId) throw new Error("addressId required.");
  const addr = await prisma.userAddress.findFirst({ where: { id: addressId, userId } });
  if (!addr) throw new Error("Address not found for this user.");
  return addr;
}

export async function createCheckoutSession(payload) {
  const { items = [], couponCode, userId, addressId } = payload || {};
  if (!userId) throw new Error("User required.");

  const sanitized = normalizeItems(items);
  if (!Array.isArray(items) || items.length === 0 || sanitized.length === 0) {
    throw new Error("Cart is empty or items missing price/quantity");
  }

  const code = String((couponCode || "").toUpperCase());
  const { subtotal, discount, tax, shippingFee, grand, rate } = computeTotals(sanitized, code);
  if (!(grand > 0)) throw new Error("Grand total must be greater than zero");

  const addr = await loadAddressForUser(userId, addressId);
  const userRow = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });

  const tranId = `tran_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

  const order = await prisma.order.create({
    data: {
      userId,
      addressId: addr.id,

      currency: "BDT",
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      tax: tax.toFixed(2),
      shippingFee: shippingFee.toFixed(2),
      grandTotal: grand.toFixed(2),

      couponCode: code || null,
      couponRate: rate ? rate.toFixed(4) : null,

      status: "PENDING",
      tranId,

      items: {
        create: sanitized.map((it) => ({
          productId: it.productId,
          productTitle: it.productTitle,
          unitPrice: it.unitPrice.toFixed(2),
          quantity: it.quantity,
          color: it.color,
          size: it.size,
          fitType: null, // ← always NULL as requested
        })),
      },
      payment: { create: {} },
    },
    include: { items: true, payment: true },
  });

  const base = process.env.APP_BASE_URL;

  // 💡 Point success to a bridge that will update DB and return HTML that self-redirects to /thank-you
  const successBridge = joinUrl(base, `/sslcz/success-bridge?tran=${encodeURIComponent(tranId)}`);

  const resp = await initSslczSession({
    store_id: process.env.SSLCZ_STORE_ID,
    store_passwd: process.env.SSLCZ_STORE_PASSWORD,
    total_amount: Number(order.grandTotal).toFixed(2),
    currency: "BDT",
    tran_id: order.tranId,

    success_url: joinUrl(base, `/api/sslcz/success?tran=${encodeURIComponent(tranId)}`),
    fail_url:    joinUrl(base, `/api/sslcz/return/fail`),
    cancel_url:  joinUrl(base, `/api/sslcz/return/cancel`),
    ipn_url:     joinUrl(base, `/api/sslcz/ipn`), // keep IPN for authoritative update

    cus_name:  `${addr.firstName} ${addr.lastName}`.trim(),
    cus_email: addr.email || userRow?.email || "customer@example.com",
    cus_add1:  addr.address,
    cus_city:  DEFAULT_CITY,
    cus_postcode: DEFAULT_POSTCODE,
    cus_country: DEFAULT_COUNTRY,
    cus_phone: addr.phone,

    shipping_method: "NO",
    product_name: order.items.map(i => i.productTitle).slice(0, 3).join(", "),
    product_category: "general",
    product_profile: "general",
    emi_option: "0",

    value_a: order.id,
    value_b: order.addressId,
  });

  return { url: resp.GatewayPageURL, orderId: order.id, tranId: order.tranId };
}
