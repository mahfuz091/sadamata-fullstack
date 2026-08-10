# Commission & earnings — merchant + brand

Percentages are **of the line total** (`unitPrice × quantity`), not of a margin. Three buckets always sum to 100:

```
brandEarning    = total × brandPct/100
merchantEarning = total × merchantPct/100
platformEarning = total − brandEarning − merchantEarning   (the remainder)
```

There is **no single shared resolver**. Four different implementations exist, and they do not agree. Know which one you are touching.

## Where percentages are stored

| Location | Field | Meaning |
|---|---|---|
| `Product` | `brandCommissionPct?`, `merchantCommissionPct?` | **Frozen snapshot** written once at product creation. This is what settlement actually pays on. |
| `Brand` | `defaultBrandPct` (10.0), `defaultMerchantPct` (10.0) | Per-brand fallback |
| `CommissionSetting` | `brandCommissionPct` (6.0), `merchantCommissionPct` (11.0), `brandSelectedMerchantPct` (6.0) | Admin-managed rules, scoped by `brandId` / `merchantId` / `productId`, versioned by `isActive` + `effectiveFrom`/`effectiveTo` |
| `MerchantProfile` | `tiar`, `leftTiar`, `dailyLimitPct` | Upload quota, not money — see bottom |

### `brandSelectedMerchantPct` — the third rate

A merchant earns **less** when the product is published under a brand, because the brand takes a royalty. So a merchant-scoped `CommissionSetting` row carries two merchant rates:

- `merchantCommissionPct` (default 11.0) — merchant sells standalone, no brand
- `brandSelectedMerchantPct` (default 6.0) — merchant sells under a brand

Which one applies is decided at product-create time by whether `brandId` is set.

## Rate resolution at product creation — the one that matters

`merchant/src/lib/commissionRates.js` → `resolveEffectiveCommissions({ merchantId, brandId })`, called from `merchant/src/app/actions/product/product.actions.js` under `// ---- commissions (server truth) ----`, result stored into `Product.brandCommissionPct` / `Product.merchantCommissionPct`.

```
brandPct    (brand royalty — only when the product is published under a brand)
  1. CommissionSetting { isActive, merchantId, brandId, productId: null } → brandCommissionPct
  2. CommissionSetting { isActive, merchantId: null, brandId, productId: null } → brandCommissionPct
  3. Brand.defaultBrandPct
  4. Brand.isExclusive ? 10 : 6
  no brandId → 0

merchantPct
  with a brand:    pair rule.brandSelectedMerchantPct
                   → merchant rule.brandSelectedMerchantPct
                   → 6
  without a brand: merchant rule.merchantCommissionPct → 11
```

Sum is clamped so `brandPct + merchantPct ≤ 100`; a `[commission]` line is logged at create time with the resolved rates and their source.

Notes:
- **Fixed 2026-08-10.** The previous version read `brandCommissionPct` off the **merchant** rule and never looked at the brand at all, so exclusivity (10 vs 6) and every admin per-brand setting were ignored, and brand-less products froze a non-zero brand share that no one could be paid. `merchant/scripts/fix-product-commissions.mjs` repairs the frozen rows (dry run by default, `--apply`, optional `--resettle`).
- A merchant rule's `brandCommissionPct` is now unused — brand rates come from brand-scoped sources only.
- The merchant UI (`AddDesignFitAdmin.jsx`, ~line 2356) computes a **preview** merchant earning from `commissionSetting.brandSelectedMerchantPct` vs `merchantCommissionPct` using the same brand/no-brand switch, and posts `brandCommissionPct` / `merchantCommissionPct` in the FormData — **the server never reads those fields**. Display only.
- Once written to `Product`, the rate is frozen. Changing a `CommissionSetting` later does **not** reprice existing products.

## Rate resolution at settlement — what actually gets paid

`frontend/src/lib/settlement.js` → `resolveRates(product, brand)`, run inside `settleOrderEarnings(orderId)` from `api/sslcz/success`:

```
hasBrand    = product.brandId && brand
brandPct    = hasBrand ? (product.brandCommissionPct ?? brand.defaultBrandPct ?? 0) : 0
merchantPct = product.merchantCommissionPct ?? (hasBrand ? brand.defaultMerchantPct ?? 0 : 0)
platformPct = max(0, 100 − (brandPct + merchantPct))     // merchant share clamped if the sum > 100
```

Ignores `CommissionSetting` entirely — reads only the frozen product snapshot, then the brand default. A product with no `brandId` always pays `brandPct = 0`, even if a stale snapshot says otherwise.

Writes are idempotent: `sale.upsert` / `saleItem.upsert` keyed on `orderItemId @unique`, all inside one `$transaction`, so replayed webhooks are safe.

## A third resolver, unused by the money path

`dashboard/src/lib/commission/resolveCommission.js` → `resolveCommission({ productId, brandId, merchantId })`, the "full" 5-step cascade:

```
1. CommissionSetting { productId, isActive }
2. CommissionSetting { brandId, isActive, productId: null }
3. CommissionSetting { merchantId, isActive, productId: null, brandId: null }
4. Brand.defaultBrandPct / defaultMerchantPct
5. hard fallback { brandPct: 10, merchantPct: 10 }
```

It never touches `brandSelectedMerchantPct` and nothing in the settlement path calls it. Treat it as the intended design, not the live behaviour.

## Where the defaults get seeded

**Merchant signup / USER→MERCH migration** (`merchant/src/app/actions/auth/auth.actions.js`, ~line 223, 377, 469): after creating `MerchantProfile`, creates one `CommissionSetting` if none exists —
```js
const DEFAULT_BRAND_PCT = 10.0;
const DEFAULT_MERCHANT_PCT = 10.0;
{ brandId: null, merchantId: user.id, productId: null,
  brandCommissionPct: 10.0, merchantCommissionPct: 10.0, isActive: true }
```
`merchantId` must reference **`User.id`**, not `MerchantProfile.id`. Note `brandSelectedMerchantPct` is left at the schema default 6.0.

**Brand signup** (`brand/src/app/actions/auth/auth.actions.js`, ~line 352):
```js
const defaultBrandPct = isExclusive ? 10 : 6;   // exclusive brands earn more
const defaultMerchantPct = 6;
```
written onto the `Brand` row, then mirrored into a brand-scoped `CommissionSetting` (`brandId: brand.id`, `merchantId: null`).

## Admin controls (dashboard)

`dashboard/src/app/actions/user/setBrandCommission.js` — `setBrandCommission(_, { brandId, brandCommissionPct })`. Note `brandId` here is a **`User.id`**; it looks the brand up via `brand.findUnique({ where: { userId: brandId } })`. Guard: `session.user.role !== "ADMIN"`. Validates 0–100, then in one transaction deactivates the current brand-scoped rule (`isActive: false`, `effectiveTo: now`), creates a new one carrying the old `merchantCommissionPct` forward, and syncs `Brand.defaultBrandPct` so the rule and the brand default can't diverge. UI: `components/BrandsTable/BrandCommissionEditor.jsx`, page `dashboard/brands/[id]`.

`dashboard/src/app/actions/user/setMerchantCommission.js` — two actions, both admin-guarded (`["ADMIN","SUPERADMIN"]`, though `SUPERADMIN` is not in the `Role` enum), both validate `0–100`, both deactivate-then-create so history is preserved:
- `setMerchantCommission(_, { merchantId, merchantCommissionPct })` — carries the existing `brandSelectedMerchantPct` forward (or 6.0)
- `updateCommissionWithBrandPctAction(_, { merchantId, brandSelectedMerchantPct })` — carries the existing `merchantCommissionPct` forward (or 11.0)

UI: `components/MerchTable/MerchantAdminActions.jsx`, page `dashboard/merch/[id]`. Neither sets `brandCommissionPct` on the merchant rule, so it stays whatever signup seeded.

`prisma.commissionSetting` rows are never deleted — always `isActive: false` + `effectiveTo`.

## Reporting — three inconsistent readers

| Function | Source of truth | Order statuses counted |
|---|---|---|
| `merchant/src/utils/financeSummary.js` → `getMerchantFinancialSummary` | reads **`Sale.merchantEarning`** (aggregate) | `PAID` only |
| same file → `getBrandFinancialSummary` | reads `Sale.brandEarning` | `PAID` only |
| `brand/src/utils/financeSummary.js` → `getBrandFinancialSummary` | **recomputes** from `OrderItem` × `Product.brandCommissionPct ?? Brand.defaultBrandPct` — ignores `Sale` | `PAID`, `SHIPPED`, `COMPLETED` |
| `merchant/.../payout/merchantSalesSummary.actions.js`, `todaySalesByMerchant.actions.js`, `brand/.../brandSalesSummary.actions.js`, `brand-stats.actions.js` | **recompute** from `OrderItem` × product pct, falling back to `Brand.default*Pct` only when `brandId` is set (else 0) | varies per file |

Recomputing readers use `Prisma.Decimal` and derive platform as `total − brandAmt − merchAmt`. Because they read `Product.*Pct` — the same frozen snapshot settlement used — they normally match `Sale`, but they diverge whenever:
- a product's pct was edited after a sale settled
- the order moved past `PAID` (brand app counts `SHIPPED`/`COMPLETED`, merchant app does not)
- a `Refund` exists — recomputing readers ignore `Refund` entirely, `Sale`-reading ones don't subtract it either

Payout balance in both apps: `totalAfterWithdraw = <role>TotalIncome − sum(Payout.amount where actor = BRAND|MERCHANT)`.

## Refunds

`merchant/src/app/actions/payout/refundOrderItem.actions.js` writes a `Refund` row mirroring the original `Sale`'s three buckets for the refunded quantity. Nothing subtracts `Refund` from the summaries above — reconcile manually if you need net figures.

## Upload quota (adjacent, often confused with commission)

`MerchantProfile.tiar` = lifetime product allowance (default 10). `dailyLimitPct` (default 10) = percent of `tiar` uploadable per day, `dailyLimit = ceil(tiar × dailyLimitPct/100)`. Both enforced inside the create-product transaction (`product.actions.js` ~line 1002) before `product.create`; `leftTiar = max(0, tiar − totalProducts)` is updated after. Errors thrown: `Upload limit reached. Maximum allowed products: N.` / `Daily upload limit exceeded. You can upload only N product(s) per day.`

## If you change commission logic

1. `resolveEffectiveCommissions` (merchant create) and `resolveRates` (frontend settlement) must stay compatible — the first writes what the second reads.
2. The merchant UI preview at `AddDesignFitAdmin.jsx:2356` duplicates the rule; update it too.
3. Every recomputing reporting action listed above duplicates the rule a third time.
4. Existing products keep their frozen pct — a migration is needed if the change must apply retroactively.
