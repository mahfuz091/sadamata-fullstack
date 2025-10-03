// app/api/sslcz/return/cancel/route.js
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const form = await req.formData();
  const tranId = String(form.get("tran_id") ?? "");
  if (tranId) {
    await prisma.order.update({ where: { tranId }, data: { status: "CANCELLED" } });
  }
  return NextResponse.redirect(new URL(`/payment-cancelled?tran_id=${tranId}`, req.url));
}
