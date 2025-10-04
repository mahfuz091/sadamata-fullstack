// app/api/sslcz/success/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { settleOrderEarnings } from "@/lib/settlement";

async function parseIncoming(req) {
  const url = new URL(req.url);
  const method = req.method || "GET";
  const ct = req.headers.get("content-type") || "";

  let payload = {};
  if (method === "POST") {
    payload = ct.includes("application/json")
      ? await req.json()
      : Object.fromEntries(await req.formData());
  }

  const v = payload || {};
  const qpTran = url.searchParams.get("tran") || url.searchParams.get("tran_id");
  const qpValA = url.searchParams.get("value_a");

  const tranId = String(v.tran_id || qpTran || "");
  const orderIdRaw = v.value_a ?? qpValA ?? null;

  return { v, payload, tranId, orderIdRaw };
}

export async function GET(req) { return handleSuccess(req); }
export async function POST(req) { return handleSuccess(req); }

async function handleSuccess(req) {
  try {
    const { v, payload: p, tranId, orderIdRaw } = await parseIncoming(req);
    let orderId = Number(orderIdRaw || 0);

    if (!tranId) {
      return NextResponse.json({ ok: false, error: "Missing tran_id (tran)" }, { status: 400 });
    }

    if (!orderId) {
      const found = await prisma.order.findFirst({ where: { tranId }, select: { id: true } });
      if (!found) {
        return NextResponse.json({ ok: false, error: "Could not resolve order by tran_id" }, { status: 404 });
      }
      orderId = found.id;
    }

    // TODO: validate v.val_id with SSLCOMMERZ before marking PAID in production

    // Mark paid + store payment payload
    await prisma.order.update({
      where: { id: orderId, tranId },
      data: {
        status: "PAID",
        payment: {
          upsert: {
            create: {
              valId: v?.val_id ?? null,
              bankTranId: v?.bank_tran_id ?? null,
              cardType: v?.card_type ?? null,
              rawPayload: p,
            },
            update: {
              valId: v?.val_id ?? null,
              bankTranId: v?.bank_tran_id ?? null,
              cardType: v?.card_type ?? null,
              rawPayload: p,
            },
          },
        },
      },
    });

    // 💰 Settle earnings (idempotent because Sale.orderItemId is unique)
    await settleOrderEarnings(String(orderId));

    // Absolute redirect URL (fixes middleware error)
    const base = process.env.APP_BASE_URL || req.nextUrl.origin;
    const bridge = `${base}/success?tran=${encodeURIComponent(tranId)}`;
    return NextResponse.redirect(bridge, { status: 303 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message || "Server error" }, { status: 500 });
  }
}
