import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts } from "pdf-lib";

export async function GET(req, { params }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: true,
      user: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  let y = 800;

  page.drawText("INVOICE", { x: 40, y, size: 20, font });
  y -= 30;

  page.drawText(`Order ID: ${order.id}`, { x: 40, y, size: 12, font });
  y -= 20;
  page.drawText(`Customer: ${order.user.name}`, { x: 40, y, size: 12, font });
  y -= 30;

  for (const item of order.items) {
    page.drawText(
      `${item.productTitle} x${item.quantity} - ৳${item.unitPrice}`,
      { x: 40, y, size: 11, font }
    );
    y -= 18;
  }

  y -= 20;
  page.drawText(`Total: ৳${Number(order.grandTotal)}`, {
    x: 40,
    y,
    size: 14,
    font,
  });

  const pdfBytes = await pdf.save();

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice-${order.id}.pdf`,
    },
  });
}
