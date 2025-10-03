export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import prisma from "@/lib/prisma";
import { validateWithSslcz } from "@/lib/sslcz";

function readURL(url) {
  const u = new URL(url);
  return {
    tran: u.searchParams.get("tran") || "",       // our query param from createCheckoutSession
    val_id: u.searchParams.get("val_id") || "",   // gateway may append
    tran_id: u.searchParams.get("tran_id") || "", // gateway may append
    gw: "GET",
  };
}

async function readBody(req) {
  const ct = req.headers.get("content-type") || "";
  try {
    if (ct.includes("multipart/form-data")) {
      const fd = await req.formData();
      return { ...Object.fromEntries(fd), gw: "POST/multipart" };
    }
    if (ct.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      return { ...Object.fromEntries(new URLSearchParams(text)), gw: "POST/urlencoded" };
    }
    if (ct.includes("application/json")) {
      const json = await req.json();
      return { ...(json || {}), gw: "POST/json" };
    }
  } catch (e) {
    console.error("[bridge] parse error:", e);
  }
  return { gw: "POST/unknown" };
}

function htmlRedirect(dest, msg = "Redirecting…") {
  return new Response(
`<!doctype html><html><head>
<meta charset="utf-8"/>
<meta http-equiv="refresh" content="0;url=${dest}"/>
<title>${msg}</title>
</head><body>
  <p>${msg} If not redirected, <a href="${dest}">click here</a>.</p>
  <script>
    (function () {
      var url = ${JSON.stringify(dest)};
      try { if (top && top !== self) top.location.href = url; else location.replace(url); }
      catch (e) { location.href = url; }
    })();
  </script>
</body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 200 }
  );
}

async function handle(req, method) {
  const p = method === "GET" ? readURL(req.url) : await readBody(req);
  const tranId = String(p.tran_id || p.tran || "");
  const valId  = String(p.val_id || "");
  console.log("[bridge] method=%s gw=%s tran=%s hasVal=%s", method, p.gw, tranId, !!valId);

  if (!tranId) {
    return htmlRedirect(new URL("/payment-failed?reason=missing_tran", req.url).toString(), "Missing transaction");
  }

  let ok = false;
  try {
    if (valId) {
      const v = await validateWithSslcz(valId); // ← now SAFE
      ok = v?.status === "VALID" || v?.status === "VALIDATED";

      await prisma.order.update({
        where: { tranId },
        data: {
          status: ok ? "PAID" : "FAILED",
          payment: {
            upsert: {
              create: {
                valId: v?.val_id ?? null,
                bankTranId: v?.bank_tran_id ?? null,
                cardType: v?.card_type ?? null,
                rawPayload: p,
              },
              update: {
                valId: v?.val_id ?? null,
                bankTranId: v?.bank_tran_id ?? null,
                cardType: v?.card_type ?? null,
                rawPayload: p,
              },
            },
          },
        },
      });
    } else {
      // No val_id (e.g. you opened the URL manually) — do not call validator.
      await prisma.order.update({
        where: { tranId },
        data: {
          payment: {
            upsert: {
              create: { rawPayload: p },
              update: { rawPayload: p },
            },
          },
        },
      });
    }
  } catch (e) {
    console.error("[bridge] DB update error:", e);
    return htmlRedirect(new URL(`/payment-failed?tran_id=${encodeURIComponent(tranId)}`, req.url).toString(), "Payment update failed");
  }

  const dest = new URL(
    ok ? `/thank-you?tran_id=${encodeURIComponent(tranId)}` : `/payment-failed?tran_id=${encodeURIComponent(tranId)}`,
    req.url
  ).toString();

  return htmlRedirect(dest, ok ? "Payment successful" : "Payment failed");
}

export async function GET(req)  { return handle(req, "GET"); }
export async function POST(req) { return handle(req, "POST"); }
