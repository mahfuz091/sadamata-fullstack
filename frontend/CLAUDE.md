# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (Next.js on port 3000)
npm run build     # production build
npm run start     # run production build
```

Prisma client is regenerated automatically via the `postinstall` hook (`prisma generate`). To regenerate manually:

```bash
npx prisma generate
npx prisma migrate dev --name <migration-name>
npx prisma db push   # push schema without migration history (dev only)
```

## Architecture

**Stack:** Next.js 16 (App Router, JS not TS), React 19, Prisma 7 + PostgreSQL (via `@prisma/adapter-pg`), NextAuth v5, SSLCommerz payments, AWS S3.

**Path alias:** `@/` maps to `src/`.

### Key directories

| Path | Purpose |
|---|---|
| `src/app/` | Next.js App Router pages and API routes |
| `src/app/actions/` | Server Actions (`"use server"`) — auth, cart, product, payment, address, brand, review |
| `src/app/api/sslcz/` | SSLCommerz webhook callbacks: `success`, `return`, `ipn`, `success-bridge` |
| `src/components/` | One folder per feature/page — all client-side React components |
| `src/lib/` | Shared server utilities (see below) |
| `src/hooks/` | Client-side React hooks (`useFavorites`, `useScrollUp`) |
| `src/utils/` | Pure helpers: `helper.js` (validation), `validation.js` |
| `src/generated/prisma/` | Generated Prisma client — never edit manually |
| `prisma/schema.prisma` | Source of truth for the DB schema |

### `src/lib/` utilities

| File | What it does |
|---|---|
| `prisma.js` | Singleton Prisma client (dev: global, prod: new instance) |
| `auth.js` | JWT helpers (`signAuthToken`, `verifyAuthToken`, `setAuthCookie`) — used for custom sessions outside NextAuth |
| `s3.js` | `uploadToS3`, `getPrivateUrl` — all product images stored as private S3 keys |
| `sslcz.js` | SSLCommerz init/validate helpers; reads `SSLCZ_MODE` to switch sandbox/live |
| `settlement.js` | `settleOrderEarnings(orderId)` — computes brand/merchant/platform splits and upserts `Sale` + `SaleItem` records inside a transaction |
| `attachPreviewUrl.js.js` | `attachPreviewUrl` / `attachPreviewUrlTwo` — resolves S3 signed URLs for product variant images |
| `helper.js` | `getProductImage` (variant priority order), `isDarkColor`, `isLightColor` |
| `productQuery.js` | Shared Prisma `where`/`include` fragments for public product listings |

### Auth

`src/auth.js` is the NextAuth v5 config (`handlers`, `signIn`, `signOut`, `auth`). Uses the `credentials` provider — login accepts email or phone. JWT strategy; `token.id` and `token.profileImage` are added in the callbacks.

`src/app/middleware.js` protects `/checkout` and redirects unauthenticated users to `/login?redirect=<path>`.

### Data model highlights (see `prisma/schema.prisma`)

- `User` has roles: `USER`, `ADMIN`, `BRAND`, `MERCH`. BRAND and MERCH start as `isActive: false` (need admin approval).
- `Product` belongs to a `User` (merchant) and optionally a `Brand`. Variants (`ProductVariant`) hold per-color/fit-type images as S3 keys.
- `Order` → `OrderItem` → `Sale` / `SaleItem`. Earnings split calculated in `settlement.js`.
- `Mockup` / `MockupVariant` are base T-shirt templates that products reference.
- Commission rates cascade: product-level → brand default → merchant default.

### Payment flow (SSLCommerz)

1. Client calls server action in `src/app/actions/payment/` to initiate.
2. SSLCommerz redirects to `/api/sslcz/success` (POST/GET) on payment.
3. `success` handler marks order `PAID`, upserts `Payment`, calls `settleOrderEarnings`, then redirects to `/success?tran=...`.
4. `/api/sslcz/ipn` handles async IPN notifications.
5. Set `SSLCZ_MODE=live` env var for production; defaults to sandbox.

### Image handling

Product images and designs are stored in private S3 buckets. Always store the S3 key in the DB, never the signed URL. Use `getPrivateUrl(key)` from `src/lib/s3.js` to generate short-lived URLs at render time. `attachPreviewUrl` / `attachPreviewUrlTwo` batch this for product listings.

## Required environment variables

```
DATABASE_URL
AUTH_SECRET
AWS_REGION
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_BUCKET
SSLCZ_STORE_ID
SSLCZ_STORE_PASSWORD
SSLCZ_MODE          # "sandbox" or "live"
APP_BASE_URL        # absolute URL for SSLCommerz redirect (e.g. https://yourdomain.com)
SSLCZ_DEV_ACCEPT    # set to "1" in dev to bypass validation with val_id="DEV_OK"
```
