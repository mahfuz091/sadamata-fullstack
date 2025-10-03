// middleware.js
import { NextResponse } from "next/server";
import { auth } from "@/auth"; // <-- from your NextAuth v5 setup (see below)

const PROTECTED_PREFIXES = ["/checkout"];

export default auth((req) => {
  const { nextUrl } = req;

  const isProtected = PROTECTED_PREFIXES.some((p) =>
    nextUrl.pathname.startsWith(p)
  );

  // Not signed in and trying to access a protected route
  if (isProtected && !req.auth) {
    const loginUrl = new URL("/login", req.url);
    // keep original path + query (e.g. /checkout?plan=premium)
    loginUrl.searchParams.set("redirect", nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // Optional UX: if a signed-in user lands on /login?redirect=... -> bounce them there
  if (nextUrl.pathname.startsWith("/login") && req.auth) {
    const target = nextUrl.searchParams.get("redirect") || "/";
    const safeTarget = typeof target === "string" && target.startsWith("/") ? target : "/";
    return NextResponse.redirect(new URL(safeTarget, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/checkout/:path*", "/login"],
};
