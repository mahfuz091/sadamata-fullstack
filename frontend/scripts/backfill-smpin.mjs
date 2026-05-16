import pg from "pg";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const { Client } = pg;
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateCode() {
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return result;
}

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const { rows: products } = await client.query(
  'SELECT id FROM "Product" WHERE smpin IS NULL ORDER BY "createdAt" ASC'
);

console.log(`Found ${products.length} products without SMPIN`);

const existing = new Set(
  (await client.query('SELECT smpin FROM "Product" WHERE smpin IS NOT NULL')).rows.map(
    (r) => r.smpin
  )
);

let updated = 0;
for (const product of products) {
  let smpin;
  let attempts = 0;
  do {
    if (attempts++ > 50) throw new Error(`Could not generate unique SMPIN for product ${product.id}`);
    smpin = generateCode();
  } while (existing.has(smpin));

  existing.add(smpin);
  await client.query('UPDATE "Product" SET smpin = $1 WHERE id = $2', [smpin, product.id]);
  updated++;
  process.stdout.write(`\rBackfilled ${updated}/${products.length}`);
}

console.log(`\nDone. ${updated} products updated.`);
await client.end();
