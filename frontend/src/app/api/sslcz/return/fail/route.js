// app/api/sslcz/return/fail/route.js
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const form = await req.formData();
  const tranId = String(form.get("tran_id") ?? "");
  if (tranId) {
    await prisma.order.update({ where: { tranId }, data: { status: "FAILED" } });
  }
  return NextResponse.redirect(new URL(`/payment-failed?tran_id=${tranId}`, req.url));
}
