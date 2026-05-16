import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Client } = pg;

// Load DATABASE_URL from .env if not set in environment
if (!process.env.DATABASE_URL) {
  const envPath = path.join(fileURLToPath(import.meta.url), "../../.env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const m = line.match(/^DATABASE_URL\s*=\s*"?([^"#\n]+)"?/);
      if (m) { process.env.DATABASE_URL = m[1].trim(); break; }
    }
  }
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL not set and not found in .env");
  process.exit(1);
}

const timestamp = new Date()
  .toISOString()
  .replace(/[:.]/g, "-")
  .replace("T", "_")
  .slice(0, 19);

const backupsDir = path.join(fileURLToPath(import.meta.url), "../../../backups");
fs.mkdirSync(backupsDir, { recursive: true });

const outFile = path.join(backupsDir, `sadamata_${timestamp}.sql`);

const client = new Client({ connectionString: DATABASE_URL });
await client.connect();
console.log("Connected to DB");

const out = fs.createWriteStream(outFile, { encoding: "utf8" });
const write = (s) => out.write(s + "\n");

write("-- Sadamata DB Backup");
write(`-- Generated: ${new Date().toISOString()}`);
write("-- Source: " + DATABASE_URL.replace(/:([^@]+)@/, ":***@"));
write("");
write("SET client_encoding = 'UTF8';");
write("SET standard_conforming_strings = on;");
write("");

const { rows: tables } = await client.query(`
  SELECT tablename FROM pg_tables
  WHERE schemaname = 'public'
  ORDER BY tablename
`);

console.log(`Found ${tables.length} tables`);

for (const { tablename } of tables) {
  process.stdout.write(`  Dumping: ${tablename} ... `);

  const { rows: cols } = await client.query(`
    SELECT column_name, data_type, udt_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = $1
    ORDER BY ordinal_position
  `, [tablename]);

  const { rows: data } = await client.query(`SELECT * FROM "${tablename}"`);

  write(`-- Table: ${tablename} (${data.length} rows)`);

  if (data.length === 0) {
    write("");
    console.log("0 rows");
    continue;
  }

  const colNames = cols.map((c) => `"${c.column_name}"`).join(", ");

  for (const row of data) {
    const values = cols.map(({ column_name, data_type }) => {
      const val = row[column_name];
      if (val === null || val === undefined) return "NULL";
      if (data_type === "boolean") return val ? "true" : "false";
      if (["integer","bigint","smallint","numeric","real","double precision"].includes(data_type))
        return String(val);
      if (data_type === "json" || data_type === "jsonb")
        return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
      if (data_type === "ARRAY") {
        const arr = Array.isArray(val) ? val : [];
        return `'{${arr.map((v) => String(v).replace(/'/g, "''")).join(",")}}'`;
      }
      return `'${String(val).replace(/'/g, "''")}'`;
    });
    write(`INSERT INTO "${tablename}" (${colNames}) VALUES (${values.join(", ")});`);
  }

  write("");
  console.log(`${data.length} rows`);
}

await client.end();
out.end();
await new Promise((resolve) => out.on("finish", resolve));

const size = (fs.statSync(outFile).size / 1024).toFixed(1);
console.log(`\nBackup complete: ${outFile} (${size} KB)`);
