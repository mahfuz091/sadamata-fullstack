import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireOwnedBrandId } from "@/lib/session";

export async function POST(request) {
  try {
    // Step 1: Parse the form data
    const formData = await request.formData();
    const name = formData.get("name"); // The sub-brand name
    const brandId = formData.get("brandId"); // The brandId to associate with the sub-brand

    // Step 2: Ensure valid data
    if (!name || !brandId) {
      return new NextResponse(
        JSON.stringify({ error: "Missing required fields: name or brandId" }),
        { status: 400 }
      );
    }

    // Step 3: Check the brand exists AND belongs to the caller — brandId
    // comes from the request body, so it is not proof of anything on its own.
    await requireOwnedBrandId(brandId);

    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return new NextResponse(
        JSON.stringify({ error: "Brand not found with the provided brandId" }),
        { status: 404 }
      );
    }

    // Step 4: Create the new sub-brand
    const newSubBrand = await prisma.subBrand.create({
      data: {
        name, // Set the name for the sub-brand
        brandId, // Connect the sub-brand to the brand
      },
    });

    // Step 5: Return the newly created sub-brand
    return new NextResponse(
      JSON.stringify({ success: true, subBrand: newSubBrand }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in subbrand create:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500 }
    );
  }
}
export const runtime = 'nodejs';