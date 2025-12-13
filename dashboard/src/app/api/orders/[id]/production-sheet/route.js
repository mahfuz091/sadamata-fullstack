import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
  const page = pdf.addPage([595, 842]); // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  let y = 800;

  page.drawText(`Production Sheet`, { x: 40, y, size: 18, font });
  y -= 30;

  page.drawText(`Order: ${order.id}`, { x: 40, y, size: 12, font });
  y -= 20;

  for (const item of order.items) {
    page.drawText(
      `${item.productTitle} | Qty: ${item.quantity} | ${item.color} | ${item.fitType}`,
      { x: 40, y, size: 11, font }
    );
    y -= 18;
  }

  const pdfBytes = await pdf.save();

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=production-${order.id}.pdf`,
    },
  });
}
