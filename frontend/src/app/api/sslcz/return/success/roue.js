// // app/api/sslcz/return/success/route.js
// export const dynamic = "force-dynamic";
// export const runtime = "nodejs";

// import prisma from "@/lib/prisma";               // ✅ default import
// import { validateWithSslcz } from "@/lib/sslcz";
// import { NextResponse } from "next/server";

// function readFromURL(url) {
//   const u = new URL(url);
//   return {
//     val_id: u.searchParams.get("val_id") || "",
//     tran_id: u.searchParams.get("tran_id") || "",
//     gateway: "GET",
//   };
// }

// async function readFromBody(req) {
//   const ct = req.headers.get("content-type") || "";
//   try {
//     if (ct.includes("multipart/form-data")) {
//       const fd = await req.formData();
//       return { ...Object.fromEntries(fd), gateway: "POST/multipart" };
//     }
//     if (ct.includes("application/x-www-form-urlencoded")) {
//       const text = await req.text();
//       return { ...Object.fromEntries(new URLSearchParams(text)), gateway: "POST/urlencoded" };
//     }
//     if (ct.includes("application/json")) {
//       const json = await req.json();
//       return { ...(json || {}), gateway: "POST/json" };
//     }
//   } catch (e) {
//     console.error("sslcz success parse error:", e);
//   }
//   return { gateway: "POST/unknown" };
// }

// async function handle(req, method) {
//   const payload = method === "GET" ? readFromURL(req.url) : await readFromBody(req);
//   const valId = String(payload.val_id || "");
//   const tranId = String(payload.tran_id || "");

//   console.log("[sslcz:success] method=%s gateway=%s tran_id=%s val_id=%s",
//     method, payload.gateway, tranId, valId);

//   if (!tranId) {
//     // no transaction id, nowhere to write status — bounce to failed
//     return NextResponse.redirect(new URL(`/payment-failed?reason=missing_tran`, req.url), { status: 303 });
//   }

//   // We expect a val_id to validate; if missing, mark failed but keep payload
//   let ok = false;
//   let v = null;

//   try {
//     if (valId) {
//       v = await validateWithSslcz(valId);
//       ok = v?.status === "VALID" || v?.status === "VALIDATED";
//     } else {
//       console.warn("[sslcz:success] missing val_id for tran_id:", tranId);
//     }

//     await prisma.order.update({
//       where: { tranId },
//       data: {
//         status: ok ? "PAID" : "FAILED",
//         payment: {
//           upsert: {
//             create: {
//               valId: v?.val_id ?? null,
//               bankTranId: v?.bank_tran_id ?? null,
//               cardType: v?.card_type ?? null,
//               rawPayload: payload, // store exactly what we got back
//             },
//             update: {
//               valId: v?.val_id ?? null,
//               bankTranId: v?.bank_tran_id ?? null,
//               cardType: v?.card_type ?? null,
//               rawPayload: payload,
//             },
//           },
//         },
//       },
//     });
//   } catch (e) {
//     console.error("[sslcz:success] DB update error:", e);
//     // best-effort fallback: still send user to failed page
//     return NextResponse.redirect(new URL(`/payment-failed?tran_id=${encodeURIComponent(tranId)}`, req.url), { status: 303 });
//   }

//   const dest = ok
//     ? `/thank-you?tran_id=${encodeURIComponent(tranId)}`
//     : `/payment-failed?tran_id=${encodeURIComponent(tranId)}`;

//   return NextResponse.redirect(new URL(dest, req.url), { status: 303 });
// }

// export async function GET(req)  { return handle(req, "GET");  }
// export async function POST(req) { return handle(req, "POST"); }



// app/api/sslcz/return/success/route.js


import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tran = searchParams.get("tran");
  console.log("tran:", tran);
  
  if (!tran) {
    return NextResponse.json({ error: "Missing tran param" }, { status: 400 });
  }
  return NextResponse.json({ ok: true, tran }); // temp: prove route exists
}
