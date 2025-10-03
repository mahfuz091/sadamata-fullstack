// app/api/sslcz/ipn/route.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import prisma from "@/lib/prisma";
import { validateWithSslcz } from "@/lib/sslcz";
import { NextResponse } from "next/server";

async function fromBody(req) {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("multipart/form-data")) {
    const fd = await req.formData();
    return Object.fromEntries(fd);
  }
  if (ct.includes("application/x-www-form-urlencoded")) {
    const text = await req.text();
    return Object.fromEntries(new URLSearchParams(text));
  }
  if (ct.includes("application/json")) {
    return await req.json();
  }
  return {};
}

export async function POST(req) {
  const payload = await fromBody(req);
  const valId = String(payload.val_id || "");
  const tranId = String(payload.tran_id || "");

  if (!tranId) return NextResponse.json({ ok: false, reason: "missing_tran" }, { status: 400 });

  let ok = false;
  if (valId) {
    const v = await validateWithSslcz(valId);
    ok = v?.status === "VALID" || v?.status === "VALIDATED";
    await prisma.order.update({
      where: { tranId },
      data: {
        status: ok ? "PAID" : "FAILED",
        payment: {
          upsert: {
            create: {
              valId: v?.val_id ?? null,
              bankTranId: v?.bank_tran_id ?? null,
              cardType: v?.card_type ?? null,
              rawPayload: payload,
            },
            update: {
              valId: v?.val_id ?? null,
              bankTranId: v?.bank_tran_id ?? null,
              cardType: v?.card_type ?? null,
              rawPayload: payload,
            },
          },
        },
      },
    });
  } else {
    // No val_id: mark failed but keep payload
    await prisma.order.update({
      where: { tranId },
      data: {
        status: "FAILED",
        payment: {
          upsert: {
            create: { rawPayload: payload },
            update: { rawPayload: payload },
          },
        },
      },
    });
  }

  return NextResponse.json({ ok: true });
}
