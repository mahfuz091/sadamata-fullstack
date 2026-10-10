import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
  // Admin-only: these endpoints expose customer PII, order documents and the
  // private design assets behind them.
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json({ success: 0, message: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ folder: "blogs" }, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: 1,
      file: { url: result.secure_url },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: 0, message: err.message }, { status: 500 });
  }
}
