// lib/sslcz.js
const endpoints = {
  sandbox: {
    init: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    validate: "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php",
  },
  live: {
    init: "https://securepay.sslcommerz.com/gwprocess/v4/api.php",
    validate: "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php",
  },
};

const MODE = process.env.SSLCZ_MODE === "live" ? "live" : "sandbox";
export function sslczEndpoint(key) {
  return endpoints[MODE][key];
}

function toDebuggable(x) {
  try {
    if (typeof x === "string") return x.slice(0, 800);
    return JSON.stringify(x, null, 2).slice(0, 1200);
  } catch { return String(x).slice(0, 800); }
}

export async function initSslczSession(payload) {
  const body = new URLSearchParams(payload).toString();
  const res = await fetch(sslczEndpoint("init"), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json" },
    body,
  });
  const rawText = await res.text();
  let json = null; try { json = JSON.parse(rawText); } catch {}

  if (!res.ok)
    throw new Error(`SSLCZ init failed: ${res.status} ${res.statusText}\nBody: ${toDebuggable(rawText)}`);

  if (json?.status && json.status !== "SUCCESS") {
    const reason = json.failedreason || json.error || json.status;
    throw new Error(
      `SSLCZ init returned non-success status: ${reason}\n` +
      `Payload: ${toDebuggable(payload)}\n` +
      `Response: ${toDebuggable(json)}`
    );
  }

  if (!json?.GatewayPageURL)
    throw new Error(`SSLCZ response missing GatewayPageURL\nBody: ${toDebuggable(json || rawText)}`);

  return json;
}

// ✅ SAFE validator: short-circuit on missing val_id; never throws; never returns plain text
export async function validateWithSslcz(valId) {
  if (!valId || !String(valId).trim()) {
    return { status: "INVALID", reason: "missing_val_id" };
  }

  // Dev helper: accept a known OK token locally
  if (process.env.SSLCZ_DEV_ACCEPT === "1" && String(valId) === "DEV_OK") {
    return { status: "VALID", val_id: "DEV_OK", bank_tran_id: "bank_dev", card_type: "VISA" };
  }

  try {
    const qs = new URLSearchParams({
      val_id: String(valId),
      store_id: process.env.SSLCZ_STORE_ID,
      store_passwd: process.env.SSLCZ_STORE_PASSWORD,
      format: "json",
    });
    const url = `${sslczEndpoint("validate")}?${qs}`;
    const resp = await fetch(url, { cache: "no-store", headers: { "Accept": "application/json" } });

    if (!resp.ok) {
      console.warn("[sslcz] validator non-OK:", resp.status, resp.statusText);
      return { status: "INVALID", http: resp.status };
    }

    const data = await resp.json().catch(() => null);
    return data ?? { status: "INVALID", http: 200, parse: "failed" };
  } catch (e) {
    console.warn("[sslcz] validator error:", e?.message || e);
    return { status: "INVALID", error: "network" };
  }
}
