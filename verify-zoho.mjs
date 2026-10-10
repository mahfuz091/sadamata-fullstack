// Checks the Zoho SMTP handshake for every app, then optionally sends one test
// mail. Never prints the password.
//
//   node verify-zoho.mjs                 # handshake only
//   node verify-zoho.mjs you@example.com # handshake + one real send
//
// Run from the repo root.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const APPS = ["frontend", "merchant", "brand", "dashboard"];
const to = process.argv[2] || null;

function parseEnv(file) {
  const out = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

let sentOnce = false;

for (const app of APPS) {
  const envFile = path.join(app, ".env");
  if (!fs.existsSync(envFile)) {
    console.log(`${app.padEnd(10)} no .env`);
    continue;
  }

  const env = parseEnv(envFile);
  const host = env.EMAIL_HOST;
  const port = Number(env.EMAIL_PORT || 465);
  const user = env.EMAIL_USER;
  const pass = env.EMAIL_PASS;

  if (!host || !user || !pass || pass === "...") {
    console.log(`${app.padEnd(10)} EMAIL_PASS not set`);
    continue;
  }

  // Each app has its own node_modules; use that app's nodemailer.
  const require = createRequire(path.resolve(app, "package.json"));
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user, pass },
  });

  try {
    await transporter.verify();
    console.log(`${app.padEnd(10)} OK   ${user} via ${host}:${port}`);

    if (to && !sentOnce) {
      const info = await transporter.sendMail({
        from: env.EMAIL_FROM || user,
        to,
        subject: "Sadamata Zoho SMTP test",
        text: "Zoho SMTP is wired up correctly.",
      });
      console.log(`${" ".repeat(10)} sent test to ${to} (${info.messageId})`);
      sentOnce = true;
    }
  } catch (err) {
    console.log(`${app.padEnd(10)} FAIL ${err.message}`);
  } finally {
    transporter.close();
  }
}
