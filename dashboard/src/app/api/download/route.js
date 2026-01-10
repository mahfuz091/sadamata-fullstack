import { NextResponse } from "next/server";
import { getPrivateUrl } from "@/lib/s3";

const SIGN_EXPIRES = 60 * 10; // 10 min (download should start quickly)

// Allow only your folders
function isAllowedKey(key) {
  if (!key || typeof key !== "string") return false;
  if (key.includes("..")) return false; // basic traversal guard
  return (
    key.startsWith("products/") ||
    key.startsWith("designs/") ||
    key.startsWith("profile/")
  );
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const filenameOverride = searchParams.get("filename") || "";

  if (!isAllowedKey(key)) {
    return NextResponse.json(
      { success: false, message: "Invalid or not allowed key" },
      { status: 403 }
    );
  }

  // ✅ Generate signed URL on server (bucket stays private)
  const signedUrl = await getPrivateUrl(key, SIGN_EXPIRES);

  const upstream = await fetch(signedUrl, { cache: "no-store" });
  if (!upstream.ok) {
    return NextResponse.json(
      { success: false, message: `Upstream failed: ${upstream.status}` },
      { status: 502 }
    );
  }

  const contentType =
    upstream.headers.get("content-type") || "application/octet-stream";

  // choose filename
  const fallbackName = key.split("/").pop() || "download";
  const filename = filenameOverride || fallbackName;

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
