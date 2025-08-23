import { getAuthToken, verifyAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Step 1: Get the JWT token from cookies
    const token = await getAuthToken(request);
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: "Authorization token is required" }),
        { status: 401 }
      );
    }

    // Step 2: Verify the token and get the userId
    const { userId } = await verifyAuthToken(token);
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401 }
      );
    }

    // Step 3: Parse the form data from the request
    const formData = await request.formData();
    const brandCategoryId = formData.get("brandCategoryId");
    const name = formData.get("name");

    if (!brandCategoryId || !name) {
      return new NextResponse(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Step 5: Create the new brand
    const newBrand = await prisma.brand.create({
      data: {
        name,
        isActive: false, // Default to false
        user: { connect: { id: userId } }, // Associate the brand with the userId
        brandCategory: {
          connect: { id: brandCategoryId }, // Connect to an existing BrandCategory
        },
      },
    });

    // Step 6: Return the newly created brand in the response
    return new NextResponse(
      JSON.stringify({ success: true, brand: newBrand }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating brand:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500 }
    );
  }
}
