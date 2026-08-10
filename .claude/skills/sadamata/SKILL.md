---
name: sadamata
description: Map of the Sadamata multi-app platform — 4 Next.js 16 apps (frontend, merchant, brand, dashboard) sharing one PostgreSQL DB via Prisma. Use for any work in E:\sadamata new — locating code, understanding the schema, adding pages/server actions, S3 image handling, commission/settlement logic, auth, or cross-app changes.
---

# Sadamata Platform

Print-on-demand marketplace. 4 separate Next.js apps, **one shared PostgreSQL database**, one shared private S3 bucket. No monorepo — each app is standalone with its own `package.json`, `node_modules`, and a near-identical copy of `prisma/schema.prisma`.

## The 4 apps

| Dir | pm2 name | Port | Domain | Who uses it |
|---|---|---|---|---|
| `frontend/` | `sadamata` | 3000 | sadamata.com | Public shop — browse, cart, checkout, orders, reviews |
| `merchant/` | `merch-sadamata` | 3001 | merch.sadamata.com | Merchants — upload designs, create products, sales/payouts |
| `brand/` | `brand-sadamata` | 3002 | (brand portal) | Brands — brand profile, brand products, brand sales |
| `dashboard/` | — (`next dev --port 3003`) | 3003 | admin.sadamata.com | Admin — approve users, mockups, orders, CMS |

**Run all 4 with one command** — `npm run dev` at the repo root (`E:\sadamata new`). Root `package.json` is a thin `concurrently` runner: prefixed colour-coded output, correct ports, no workspaces. Also `npm run build`, `npm run start`, `npm run install:all`, `npm run generate`, `npm run pm2:start`. Single app: `npm run dev:frontend` / `dev:merchant` / `dev:brand` / `dev:dashboard`.

Bare `npm run dev` **inside** `frontend`, `merchant`, or `brand` all bind 3000 and collide — only `dashboard` pins its own port. Prod: root `ecosystem.config.cjs` runs all 4 under pm2. See `references/conventions.md` → Commands for the `EADDRINUSE` cleanup and why the root has no lockfile.

## Stack (all 4)

Next.js 16 App Router · **JavaScript, not TypeScript** · React 19 · Prisma 7 + `@prisma/adapter-pg` → PostgreSQL · NextAuth v5 (credentials, JWT) · AWS S3 private bucket (`sadamata-images`, ap-south-1) · `sonner` toasts · path alias `@/` → `src/`.

Styling splits:
- `frontend`, `merchant`, `brand` → Bootstrap 5 + `react-bootstrap` + hand-written CSS in `src/assets/css/`
- `dashboard` → Tailwind v4 + shadcn/ui (`src/components/ui/`, new-york, lucide) **+ Ant Design 5** side by side

## Critical rules

1. **Schema is shared.** Editing `prisma/schema.prisma` in one app changes the DB all 4 read. Mirror the change into the other 3 schema files, or they drift. Only migrate from ONE app.
   **Migration history is stale** — the last migration is `20260103170610`, but the schemas were edited months later via `db push`. `BrandFollow`, `GuestAddress`, `ProductReview`, `smpin`, `brandSlug` and more exist in no migration. Do **not** run `prisma migrate dev` before reading `references/schema-analysis.md` §1.
2. **Prisma client is generated into `src/generated/prisma/`** (see `generator.output`), not `node_modules`. Never edit it. `postinstall` runs `prisma generate`.
3. **S3 keys, never URLs, go in the DB.** Sign at render time with `getPrivateUrl(key)`.
4. **Server Actions are the default data path**, not API routes. API routes exist only for NextAuth, SSLCommerz webhooks, and file/binary responses.
5. `datasource db` has no `url` — it comes from `DATABASE_URL` via `prisma.config.js` + the pg adapter.

## Where things live (every app)

```
src/app/          routes (page.jsx) + route handlers (api/**/route.js)
src/app/actions/  "use server" server actions — grouped by domain
src/components/   one PascalCase folder per feature/page, client components
src/lib/          server utils: prisma.js, s3.js, auth helpers
src/utils/        pure helpers, validation
src/generated/    generated Prisma client (do not edit)
src/auth.js       NextAuth v5 config — exports { handlers, signIn, signOut, auth }
prisma/           schema.prisma + migrations
```

## Reference files

Load the one that matches the task:

- `references/apps.md` — per-app route map, server actions, lib inventory, what each app owns
- `references/schema.md` — full data model, relations, enums, money flow
- `references/schema-analysis.md` — **audit of the schema**: migration drift, per-app `@default` divergence, cascade map, Float/Decimal split, missing indexes, dead fields, unenforced constraints, ranked fixes
- `references/commission.md` — **merchant/brand commission percentages**: where rates live, the 4 conflicting resolvers, `brandSelectedMerchantPct`, admin controls, reporting divergence, upload quota (`tiar`)
- `references/conventions.md` — code patterns: server actions, S3, auth guards, image handling, env vars

`frontend/CLAUDE.md` also exists and is accurate for that app specifically.

## Doing common tasks

**Add a page** → `src/app/<route>/page.jsx` (server component by default) + a folder in `src/components/<Feature>/` for the client UI. Page fetches via a server action, passes plain data down.

**Add a server action** → put it in `src/app/actions/<domain>/<name>.actions.js`, `"use server"` at top, import `{ prisma } from "@/lib/prisma"`, guard with `auth()` / `requireRole()`, `revalidatePath()` after mutation.

**Add a schema field** → `npx prisma db push` from one app (matching how the current schema was built — see `schema-analysis.md` §1 before choosing `migrate dev`), then copy the model change into the other 3 schemas and run `npx prisma generate` in each.

**Touch money / commission** → read `references/commission.md` first. Rates are frozen onto `Product.brandCommissionPct` / `merchantCommissionPct` at creation (`merchant/.../product.actions.js`), then paid out by `frontend/src/lib/settlement.js` on payment success. Four separate resolvers exist and disagree — do not add a fifth.
