import JSZip from "jszip";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          Sale: {
            include: {
              product: true,
            },
          },
        },
      },
      user: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const zip = new JSZip();

  for (const item of order.items) {
    const product = item.Sale?.[0]?.product;
    if (!product) continue;

    // fetch design files
    if (product.frontDesign) {
      const res = await fetch(product.frontDesign);
      zip.file(
        `${item.productTitle}/front-design.png`,
        await res.arrayBuffer()
      );
    }

    if (product.backDesign) {
      const res = await fetch(product.backDesign);
      zip.file(`${item.productTitle}/back-design.png`, await res.arrayBuffer());
    }

    // metadata
    zip.file(
      `${item.productTitle}/metadata.json`,
      JSON.stringify(
        {
          product: item.productTitle,
          quantity: item.quantity,
          color: item.color,
          fit: item.fitType,
          size: item.size,
          unitPrice: Number(item.unitPrice),
        },
        null,
        2
      )
    );
  }

  const blob = await zip.generateAsync({ type: "uint8array" });

  return new NextResponse(blob, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename=order-${order.id}.zip`,
    },
  });
}
