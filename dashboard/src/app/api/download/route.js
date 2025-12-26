import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { success: false, message: "url is required" },
      { status: 400 }
    );
  }

  // ✅ Security: only allow your domain + uploads path
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid url" },
      { status: 400 }
    );
  }

  const allowedHosts = new Set([
    "merch.sadamata.com",
    "www.merch.sadamata.com",
  ]);
  if (!allowedHosts.has(parsed.hostname)) {
    return NextResponse.json(
      { success: false, message: "Host not allowed" },
      { status: 403 }
    );
  }

  if (!parsed.pathname.startsWith("/uploads/")) {
    return NextResponse.json(
      { success: false, message: "Path not allowed" },
      { status: 403 }
    );
  }

  const upstream = await fetch(url, { cache: "no-store" });
  if (!upstream.ok) {
    return NextResponse.json(
      { success: false, message: `Upstream failed: ${upstream.status}` },
      { status: 502 }
    );
  }

  const contentType =
    upstream.headers.get("content-type") || "application/octet-stream";

  const filename = parsed.pathname.split("/").pop() || "download";

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
