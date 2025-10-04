// app/api/sslcz/ipn/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const ct = req.headers.get("content-type") || "";
    const p = ct.includes("application/json")
      ? await req.json()
      : Object.fromEntries(await req.formData());

    const v = p;
    const tranId = String(v.tran_id || "");
    const orderId = Number(v.value_a || 0);

    if (!tranId || !orderId) {
      return NextResponse.json({ ok: false, error: "Missing tran_id or value_a" }, { status: 400 });
    }

    // Example status mapping; prefer using validation API for final status
    const status =
      v.status === "VALID" ? "PAID" :
      v.status === "FAILED" ? "FAILED" :
      v.status === "CANCELLED" ? "CANCELLED" :
      "PENDING";

    await prisma.order.update({
      where: { id: orderId, tranId },
      data: {
        status,
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

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message || "Server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Use POST" }, { status: 405 });
}
