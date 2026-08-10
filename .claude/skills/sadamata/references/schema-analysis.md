# Schema analysis — integrity, types, indexes, drift

Findings from reading `prisma/schema.prisma` (523 lines, 25 models, 8 enums) across all 4 copies plus the 61 migrations. Ordered by how much damage each can do.

## 1. Migration history is stale — the live DB was built with `db push`

61 migrations, last one `20260103170610_product_index_add`. The schema files were edited long after (dashboard 2026-05-16, frontend 2026-06-13, brand 2026-06-21, merchant 2026-07-25). All 4 `prisma/migrations/` dirs are byte-identical to each other, and these entities appear in **zero** migration SQL:

`BrandFollow` · `GuestAddress` · `ProductReview` · `Brand.brandSlug` · `Product.smpin` · `MerchantProfile.dailyLimitPct` · `Brand.bannerImage` · `Brand.isExclusive` · `ProductReview.mediaKey`

Consequences:
- `prisma migrate deploy` on a fresh DB produces a schema **missing those tables/columns**. Only `db push` reproduces production.
- `prisma migrate dev` will want to generate a large catch-up migration, and may propose destructive changes. Run `prisma migrate diff` first, never let it auto-reset.
- Anyone adding a migration now inherits the whole drift.

Safest path for a new field today: `db push` in one app + hand-copy the model into the other 3, matching what the codebase already does. Adopting real migrations requires a one-time baseline (`migrate diff --from-schema-datamodel --to-schema-datasource` → `migrate resolve --applied`).

## 2. The 4 schema copies disagree on `@default` — inserts fail in some apps

| Model | brand | merchant | dashboard | frontend |
|---|---|---|---|---|
| `BrandFollow.id` | `@id` bare | `@id` bare | `@default(cuid())` | `@default(cuid())` |
| `GuestAddress.id` | `@id` bare | `@id` bare | `@id` bare | `@default(cuid())` |
| `ProductReview.id` | `@id` bare | `@id` bare | `@id` bare | `@default(cuid())` |
| `ProductReview.updatedAt` | `DateTime` | `DateTime` | `DateTime` | `@updatedAt` |

`@default(cuid())` is generated **client-side by Prisma**, not by the DB column. So a `create()` that omits `id` succeeds from `frontend` and throws `Argument id is missing` from `brand`/`merchant`. Same for `updatedAt` — everywhere except frontend it must be passed manually.

These three models are only written from `frontend` today, which is why it hasn't surfaced. Adding a follow/review/guest-order write to another app will hit it. Fix = copy frontend's version of those three models into the other 3 files.

Other cosmetic divergences (relation field casing, `smpin @db.VarChar(10)` only in brand, `Brand.brandSlug` only in brand, enum ordering) are harmless but make `diff` noisy.

## 3. Deleting a Product destroys or blocks the earnings ledger

`Sale.product` is `onDelete: Cascade`. `SaleItem.Sale` is a **required** relation with no `onDelete` → Prisma default `Restrict`.

```
Product ──Cascade──▶ Sale ──Restrict──▶ SaleItem
```

So `prisma.product.delete()`:
- with sales that have `SaleItem` rows → **FK violation, delete fails**
- with sales that have none → **silently deletes the `Sale` rows**, wiping settled earnings history for that product

Both `merchant/src/app/actions/product/product.actions.js:1150` (`deleteProduct(id)`) and `dashboard/src/app/actions/product/product.actions.js:194` call `product.delete()` raw — no auth guard on the merchant one, no sales check on either, no S3 cleanup. Prefer soft-delete (`isActive:false` / `visibility:false`) or make `Sale.product` `onDelete: Restrict`.

`OrderItem` deliberately has `productId String?` with **no relation at all**, so order history survives product deletion — good, but it means `OrderItem.productId` can point at a row that no longer exists, and every reporting action that maps `productId → product` silently skips those lines (`if (!product) continue`). Deleted products quietly vanish from revenue totals.

## 4. Referential-action map

| Relation | Action | Effect |
|---|---|---|
| `UserProfile/UserAddress/MerchantProfile → User` | Cascade | delete user wipes profile + addresses |
| `Brand → User` | (default Restrict) | can't delete a user who owns a brand |
| `Product → User` | (default Restrict) | can't delete a merchant with products |
| `Product → Brand` / `→ Mockup` | optional, SetNull | deleting a brand/mockup orphans products, keeps them |
| `ProductVariant/Feature/Tag → Product` | Cascade | fine |
| `MockupVariant → Mockup` | Cascade | fine |
| `OrderItem → Order` | Cascade | fine |
| `Payment → Order` | Cascade | fine |
| `Sale → OrderItem` | Cascade | deleting an order removes its sales |
| `Sale → Product` | **Cascade** | see §3 |
| `Sale → User` (merchant) | Restrict | can't delete a merchant with sales |
| `SaleItem → Sale` | **Restrict** | blocks the cascade above |
| `Refund → OrderItem` | Cascade | refund dies with the order |
| `Refund → Sale` | optional, SetNull | refund survives sale deletion, detached |
| `CommissionSetting → Brand/User/Product` | Cascade (all three) | **deleting a product deletes its commission rules** |
| `Payout → Brand/User` | optional, SetNull | payout survives, loses its owner |
| `BrandFollow → Brand/User` | Cascade | fine |
| `ProductReview → Product/User/OrderItem` | Cascade | fine |
| `Order → User/UserAddress/GuestAddress` | optional, SetNull | order keeps history, loses address link |

Net: `Payout` rows can silently become ownerless (`brandId`/`merchantId` null) while still counting in `payout.aggregate({ where: { actor, brandId } })` — they'd drop out of the filtered sum, inflating `totalAfterWithdraw`.

## 5. Money columns mix `Float` and `Decimal` — inside the same ledger

| `Decimal(12,2)` | `Float` |
|---|---|
| `Order.subtotal/tax/shippingFee/discount/grandTotal` | **`Product.price`** |
| `OrderItem.unitPrice` | **`Sale.total`** |
| `SaleItem.unitPrice`, `SaleItem.total` | **`Sale.brandEarning`** |
| `Refund.amount` + its 3 earning columns | **`Sale.merchantEarning`** |
| `Payout.amount` | **`Sale.platformEarning`** |
| `Order.couponRate Decimal(5,4)` | all `*Pct` fields (`Float`) |

`Sale` — the authoritative earnings ledger — is `double precision`, while `SaleItem` sitting directly under it is `Decimal`. `settlement.js` converts with `Number(item.unitPrice)` then `+(x).toFixed(2)`, so cents are rounded per line, but the stored type still can't represent them exactly and sums drift over volume.

Reporting code compensates inconsistently: the recomputing readers (`merchantSalesSummary`, `brandSalesSummary`, `brand-stats`, `brand/utils/financeSummary`) build totals with `Prisma.Decimal`, while the `Sale`-reading ones (`merchant/utils/financeSummary`) `_sum` Floats. Two paths, two roundings, same question.

Fixing means migrating `Sale.*` and `Product.price` to `Decimal(12,2)` — a real migration, and every `Number()` call on those fields has to be revisited.

## 6. `SaleItem` has no integrity at all

```prisma
model SaleItem {
  id, saleId, productId String, quantity Int,
  orderItemId String @unique, total Decimal, unitPrice Decimal
  Sale Sale @relation(fields: [saleId], references: [id])   // only FK
}
```

`productId` and `orderItemId` are bare strings — no relation, no FK, no index. They can point at deleted rows. The model duplicates `Sale` almost exactly (same `orderItemId @unique`, same quantity/total), so today it's a 1:1 shadow of `Sale` that adds nothing but the `Restrict` in §3. Either give it real relations or drop it.

## 7. Missing indexes on the hot paths

Prisma does **not** create indexes on FK columns for PostgreSQL (verified: `CREATE INDEX` count in the init migration is 0). Existing indexes are only the explicit `@@index`/`@@unique`. Gaps that matter:

| Query in code | Missing index |
|---|---|
| `sale.aggregate({ where: { merchantId } })` — every merchant dashboard load | `Sale.merchantId` |
| `sale.aggregate({ where: { brandId } })` | `Sale.brandId` |
| `order.findMany({ where: { status: { in: [...] } } })` — `brand/utils/financeSummary`, loads **every** matching order with items | `Order.status` |
| `orderItem.findMany({ where: { order: { status: 'PAID' } } })` then `orderItemId: { in: [...] }` — `getMerchantFinancialSummary` pulls every paid order item id into memory first | `OrderItem.orderId` |
| `commissionSetting.findFirst({ where: { merchantId, brandId, isActive } })` | covered by `@@index([brandId, merchantId, productId])` only if `brandId` leads — merchant-only lookups (`brandId: null`) can't use it well |
| `product.findUnique({ where: { smpin } })` in the SMPIN retry loop | `@unique` covers it |

`Sale` only has `@@index([productId, createdAt])`. Every per-merchant and per-brand financial query is a sequential scan today.

Also: `getMerchantFinancialSummary` (both apps) fetches **all** paid `OrderItem` ids and passes them as an `IN (...)` list. That grows unbounded with order volume and will eventually blow the query size. Rewrite as a relation filter (`where: { merchantId, orderItem: { order: { status: 'PAID' } } }`) — the commented-out version above it already did that correctly.

## 8. Dead and misleading schema elements

- **`User.brandId String?`** — a bare scalar with no relation. The real link is `Brand.userId @unique`. Nothing reads it; it will always be null. Drop it.
- **`enum Visibility { SEARCHABLE, NON_SEARCHABLE }`** and **`enum ImageType { FRONT, BACK }`** — declared, referenced by nothing. `Product.visibility` is a `Boolean`.
- **`Product.brandName String?`** — denormalized copy of `Brand.name`, written at create time, never resynced. Stale after a brand rename.
- **`Product.productId String @unique`** — a slug-like public code, distinct from `Product.id`. Two "ids" on one model; read the field name carefully. `smpin` is a third identifier (10-char A–Z0–9).
- **`MerchantProfile.tiar`** — means "tier" (upload allowance), not a typo to auto-correct; it's the column name.
- **`ProductVariant` has no `images` relation**, but `merchant/.../product.actions.js` `getAllProducts()` does `variants: { include: { images: true } }` → throws at runtime. Dead code path.
- **`Refund.saleId` is optional** while every refund logically has a sale.

## 9. Constraints the schema can't express (enforced only in code, or not at all)

- `Order` may have `addressId`, `guestAddressId`, both, or neither — nothing enforces exactly one, nor that `userId XOR guestAddressId`.
- `CommissionSetting` has no partial-unique on "one active rule per scope". `setBrandCommission`/`setMerchantCommission` emulate it with `updateMany({ isActive: false })` then `create` — **not in a transaction**, so a concurrent call can leave two active rules. `findFirst(orderBy: effectiveFrom desc)` then silently picks one.
- `effectiveFrom`/`effectiveTo` are never checked against `now()` by any resolver — only `isActive` is. A rule with a past `effectiveTo` still applies if someone forgets to flip the flag.
- Percentages have no DB check that `brandPct + merchantPct <= 100`. `settlement.js` clamps with `Math.max(0, 100 - …)`, so an over-100 pair silently gives the platform 0 and overpays.
- `Product.status` (`ProductStat`) and `Product.isActive`/`visibility` are three independent flags with overlapping meaning; nothing keeps `status: ACTIVE` and `isActive: false` from coexisting.
- `ProductReview` is gated to buyers only by `orderItemId @unique` + the composite unique — there is no check that the `OrderItem` belongs to the reviewing `userId`. That's application logic in `frontend/.../review.actions.js`.

## 10. Quick wins, in order

1. Copy frontend's `BrandFollow` / `GuestAddress` / `ProductReview` model definitions into the other 3 schema files (§2) — pure win, no migration.
2. Add `@@index([merchantId])`, `@@index([brandId])` to `Sale`; `@@index([status])` to `Order`; `@@index([orderId])` to `OrderItem` (§7).
3. Change `Sale.product` to `onDelete: Restrict` and route deletes through a soft-delete (§3).
4. Rewrite `getMerchantFinancialSummary`'s two-step `IN (...)` into a relation filter (§7).
5. Wrap the deactivate+create pairs in `setBrandCommission`/`setMerchantCommission` in `$transaction` (§9).
6. Baseline the migration history before anyone runs `migrate dev` (§1).
7. Longer term: `Sale.*` and `Product.price` → `Decimal(12,2)` (§5).
