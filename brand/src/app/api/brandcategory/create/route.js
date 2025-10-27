// src/app/api/brandcategory/create/route.js
import { createCategory } from "@/app/actions/brandCategoryActions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
  // Parse form data from the request
  const formData = await request.formData();
  const name = formData.get("name");

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    // Parse form-data
    // const formData = await request.formData();
    // const name = formData.get("name"); // get field value

    const newCategory = await createCategory(name);

    return new NextResponse(JSON.stringify(newCategory), { status: 201 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
export const runtime = 'nodejs';