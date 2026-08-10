# Code conventions

## Prisma client (`src/lib/prisma.js`) — identical in all 4 apps

```js
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";

const adapter = new PrismaPg({ connectionString: `${process.env.DATABASE_URL}` });

let prisma;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.prisma) global.prisma = new PrismaClient({ adapter });
  prisma = global.prisma;
}
export { prisma };
```

**Export style is not consistent.** `brand`, `merchant`, `dashboard` end with `export { prisma }` (named). `frontend` ends with `export default prisma`. Import to match the app you are in — `import { prisma } from "@/lib/prisma"` everywhere except frontend, which uses `import prisma from "@/lib/prisma"`.

## Auth (`src/auth.js`)

NextAuth v5, credentials provider, JWT session. Login accepts **email or phone** through one `identifier` field:

```js
const identifier = String(value||"").trim();
identifier.includes("@") ? identifier.toLowerCase() : identifier;
// prisma.user.findFirst({ where: { OR: [{ email: identifier }, { phone: identifier }] } })
```

`jwt` callback puts `token.id` and `token.profileImage` on the token and refreshes `profileImage` from the DB on later calls; `session` callback copies them onto `session.user`. `pages.signIn` differs per app (`/signin` in brand/merchant, `/login` in frontend/dashboard). `trustHost: true`, secret from `AUTH_SECRET`.

Guard a server action:
```js
import { auth } from "@/auth";
const session = await auth();
if (!session?.user) throw new Error("Unauthorized");
```
Dashboard has `requireRole(["ADMIN"])` in `src/lib/requireRole.js` — throws `Unauthorized` / `Forbidden`, returns `session.user`.

Note: `session.user.role` is **not** set by the current jwt callback in every app — re-read the user from the DB if you need the role, or add it to the callback.

## Server actions

File naming: `src/app/actions/<domain>/<thing>.actions.js`. Shape:

```js
"use server";
import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import { revalidatePath } from "next/cache";

export async function getX(userId, opts = {}) {
  noStore();                    // read actions opt out of caching
  ...
}

export async function createX(formData) {   // called directly from <form action={createX}>
  ...
  revalidatePath("/dashboard/...");
}
```

Patterns already in the codebase, reuse them:
- `assertUserActive(userId)` guard at the top of merchant/brand read actions
- `buildOrderBy(sort)` switch mapping `"price_desc"`-style strings to Prisma `orderBy`
- Actions return plain objects (`{ items, count }`), never Prisma model instances with Decimals unconverted — call `Number()` / `.toString()` before crossing to a client component
- Comments are mixed English/Bangla; keep whatever the file uses

## S3

One private bucket, `sadamata-images` in `ap-south-1`. `src/lib/s3.js` (per app) exports:
```js
uploadToS3({ key, body, contentType })  // returns key — store THIS in the DB
getPrivateUrl(key, expiresIn = 3600)    // signed GET url, render time only
deleteFromS3(key)                        // skips full http(s) urls
```

Key builders (`merchant`/`brand` `src/lib/s3Keys.js`):
```
products/<productId>/<ts>-<clean-filename>
designs/<designId|general>/<ts>-<clean-filename>
profile/<userId>.<ext>
```
`cleanName` strips whitespace → `-` and drops anything outside `[a-zA-Z0-9._-]`.

For listings, batch-sign with `attachPreviewUrl` / `attachPreviewUrlTwo` (`src/lib/attachPreviewUrl.js.js` in frontend + dashboard) instead of signing per row in a loop.

Image priority for a product card: `ProductVariant.frontImg` → `backImg` → mockup variant image (`getProductImage` in `frontend/src/lib/helper.js`).

## Components

`src/components/<PascalCaseFeature>/` — one folder per page/feature, files inside are client components (`"use client"`). Server components live in `src/app/**/page.jsx` and pass fetched data down as props. Dashboard additionally has `src/components/ui/` (shadcn, kebab-case files) — those are generated, prefer `npx shadcn add` over hand-writing.

## next.config

All 4 whitelist remote image hosts (localhost:3000/3001/3003, `*.sadamata.com`, the S3 bucket, `img.youtube.com`) and raise the Server Action body limit — 10mb (frontend, brand), 100mb (dashboard), 800mb (merchant, for canvas exports). Dashboard needs `PrismaPlugin` in webpack + `outputFileTracingRoot` because of the custom Prisma output path.

## Environment variables

```
DATABASE_URL
AUTH_SECRET
AWS_REGION  AWS_ACCESS_KEY_ID  AWS_SECRET_ACCESS_KEY  AWS_BUCKET
```
frontend only:
```
SSLCZ_STORE_ID  SSLCZ_STORE_PASSWORD
SSLCZ_MODE          "sandbox" | "live"
SSLCZ_DEV_ACCEPT    "1" in dev → bypass validation with val_id=DEV_OK
APP_BASE_URL        absolute url for SSLCommerz redirects
```
merchant only: `NEXT_PUBLIC_MOCKUP_ORIGIN` (mockup asset proxy target), SMTP vars for `src/lib/email.js`.
dashboard: Cloudinary vars alongside the S3 set.

## Commands

### From the repo root — runs all 4 apps at once

`E:\sadamata new\package.json` is a thin runner (not a monorepo — no workspaces, each app keeps its own `node_modules`). It only depends on `concurrently`.

```bash
npm install              # root, once — installs concurrently only
npm run dev              # ALL FOUR: frontend 3000, merchant 3001, brand 3002, dashboard 3003
npm run dev:frontend     # or one at a time: dev:merchant, dev:brand, dev:dashboard
npm run build            # all 4 in parallel, --kill-others-on-fail
npm run build:seq        # sequential, if parallel builds exhaust RAM
npm run start            # all 4 production servers
npm run install:all      # npm install inside all 4 apps
npm run generate         # prisma generate for all 4 schemas
npm run pm2:start        # pm2 all 4 via root ecosystem.config.cjs
```

Output is prefixed and colour-coded per app (`[frontend]`, `[merchant]`, `[brand]`, `[dashboard]`). Ctrl-C stops the runner but **can leave the four `next dev` children alive** — if a rerun reports `EADDRINUSE`, kill them by port:

```powershell
foreach ($p in 3000,3001,3002,3003) {
  Get-NetTCPConnection -LocalPort $p -State Listen -EA SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
}
```

Root `.npmrc` sets `package-lock=false` on purpose. A root `package-lock.json` makes Next.js infer `E:\sadamata new` as the workspace root ("We detected multiple lockfiles…"), which breaks `outputFileTracing` for every app. Don't commit one; don't run `npm install --package-lock-only` at the root.

`dev:dashboard` deliberately passes no `--port` — `dashboard/package.json` already hardcodes `next dev --port 3003`, and adding it again produces `--port 3003 --port 3003`.

Root `ecosystem.config.cjs` runs all 4 under pm2 (`sadamata`, `merch-sadamata`, `brand-sadamata`, `admin-sadamata`) with `cwd` per app. The per-app `ecosystem.config.cjs` files still exist and still work individually; `dashboard/` never had one.

### Inside a single app dir

```bash
npm run dev              # frontend 3000, merchant 3000(!), brand 3000(!), dashboard 3003
npm run build && npm run start
npx prisma generate
npx prisma db push                     # how the live schema was actually built
npx prisma migrate dev --name <name>   # read schema-analysis.md §1 FIRST — history is stale
node scripts/backup-db.mjs             # frontend: npm run db:backup
pm2 start ecosystem.config.cjs         # prod (not present in dashboard/)
```

Only `dashboard` pins its dev port in its own script — `frontend`, `merchant`, and `brand` all default to 3000 and collide if started bare. That's why the root runner passes `--port` explicitly.

## Gotchas

- No TypeScript anywhere. `jsconfig.json` only maps `@/* → ./src/*`.
- Only `dashboard/` has ESLint configured (`eslint.config.mjs`); `brand`/`merchant` declare a `lint` script with no config, `frontend` has no lint script.
- `attachPreviewUrl.js.js` — the doubled `.js` is the real filename, not a typo to fix blindly (imports depend on it).
- `merchant/` has two product-edit routes (`dashboard/product/edit/[productId]` and `dashboard/products/[productId]/edit`) — check which one is linked before editing.
- `frontend/src/app/actions/` has both `search.actions.js` and `search/search.actions.js`; same for `userAddressActions.js` duplicated across apps.
- `dashboard/` carries a CMS/hotel module grafted from another project:
  - `hotel/`, `room/` actions are `"use server"` + `import "server-only"` and `fetch()` an **external REST API** at `NEXT_PUBLIC_API_BASE_URL` (`/api/v1/hotels`, `/api/v1/rooms`) — no Prisma involved.
  - `blog/`, `press/` actions call `prisma.blogPost`, `prisma.pressPost`, `prisma.post` — **none of those models exist in `schema.prisma`**. Those code paths throw at runtime. Don't copy them as a pattern; adding a Blog/Press model to all 4 schemas is what would make them work.
- `dashboard/` mixes Ant Design and shadcn/Tailwind in the same app; match whatever the neighbouring file uses.
