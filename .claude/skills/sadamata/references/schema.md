# Data model

Source: `prisma/schema.prisma` (~523 lines, duplicated in all 4 apps). `provider = "postgresql"`, no inline `url` — connection comes from `DATABASE_URL` through `@prisma/adapter-pg`. Client output: `../src/generated/prisma`.

## Copies differ only in relation field names

The 4 schemas are byte-different but structurally identical. Differences are cosmetic:
- `brand/`, `merchant/` use PascalCase relation fields (`BrandFollow`, `ProductReview`, `GuestAddress`); `dashboard/`, `frontend/` use camelCase (`brandFollows`, `followers`, `reviews`, `guestAddress`).
- `dashboard/` names the Brand↔ProductCategory relation `"BrandProductCategories"`.
- `brand/` has `Brand.brandSlug String? @unique`; the other copies may lack it — check before using.
- `brand/` types `Product.smpin` as `@db.VarChar(10)`, `dashboard/` as plain `String?`.
- Enum ordering differs (`merchant/` puts `OrderStatus` earlier) — harmless.

Treat the DB as one. When adding a model/field, add it to all 4 files.

## Entities

### Identity
- **User** — `id`, `email?`/`phone?` (both `@unique`), `password` (bcryptjs), `role: Role`, `isActive` (default `true`), `name`, `profileImage?`. One user → optional `Brand`, optional `MerchantProfile`, optional `UserProfile`, many `UserAddress`.
- **Role** enum: `USER | ADMIN | BRAND | MERCH`.
- **UserProfile** — 1:1 extended shopper details.
- **UserAddress** — shipping addresses, `isDefault`, indexed `[userId, isDefault]`.
- **GuestAddress** — checkout without an account; `Order.guestAddressId`.
- **PasswordResetToken** (`tokenHash @unique`, `expires`, `used`) and **PhoneResetOtp** (`codeHash`, `attempts`) — reset flows.

### Sellers
- **MerchantProfile** — 1:1 with User. KYC (`nidOrPassportNo`, addresses, DOB), bank details (`bankName`, `bankBranch`, `accountName`, `accountNumber`, `routingNumber`), plus `tiar` (default 10), `leftTiar`, `brandOption`, `dailyLimitPct` (default 10).
- **Brand** — 1:1 with User (`userId @unique`). Same KYC+bank block as MerchantProfile, plus `isActive` (default **false** — admin must approve), `isExclusive`, `defaultBrandPct` / `defaultMerchantPct` (both 10.0), socials (`facebookLink`…`youtubeLink`), `bannerImage` + `bannerPosition`, `industryType`, `brandSlug?`, FKs to `BrandCategory` and `ProductCategory`.
- **BrandCategory** — flat lookup.
- **BrandFollow** — `@@unique([userId, brandId])`.

### Catalog
- **Product** — `title`, `description?`, `price: Float`, `userId` (the merchant), `brandId?` + denormalized `brandName?`, `mockupId?`, `frontDesign?` / `backDesign?` (S3 keys), `productId String @unique` (public code), `smpin String? @unique` (10-char code from `merchant/src/lib/smpin.js`), `isActive` (default false), `visibility` (default true), `status: ProductStat?` default `UNDERREVIEW`. Per-product commission overrides: `brandCommissionPct?`, `merchantCommissionPct?`. Indexed on `[isActive, visibility, createdAt]`, `[isActive, visibility, price]`, `brandId`, `mockupId`, `userId`, `createdAt`.
- **ProductStat** enum: `UNDERREVIEW | PROCESSING | ACTIVE | REJECT`.
- **ProductVariant** — `color VarChar(24)`, `fitType: FitType`, `frontImg?`/`backImg?` (S3 keys), `isActive`. `@@unique([productId, color, fitType])`.
- **FitType** enum: `MEN | WOMEN | YOUTH`.
- **Feature** (bullet points) and **Tag** — both simple child rows of Product.
- **ProductCategory** — `name @unique`, `slug? @unique`, `sortOrder`, `isActive`; m2m with Product via relation `"ProductCategories"`.
- **Mockup** / **MockupVariant** — blank garment templates uploaded by admin. `MockupVariant` mirrors ProductVariant (`color`, `fitType`, `frontImg`, `backImg`, `isVisible`), `@@unique([mockupId, color, fitType])`. Products reference a Mockup and overlay the design.

### Orders
- **Order** — `id cuid`, `tranId @unique` (SSLCommerz), `status: OrderStatus` default `PENDING`, money as `Decimal(12,2)`: `subtotal`, `shippingFee`, `tax`, `discount`, `grandTotal`; `couponCode?`, `couponRate Decimal(5,4)?`, `currency` default `"BDT"`; `userId?` **or** `guestAddressId?`; `addressId?`; `settledAt?`, `cancelledAt?`.
- **OrderStatus** enum: `PENDING | PAID | FAILED | CANCELLED | SHIPPED | COMPLETED | RETURNED`.
- **OrderItem** — snapshot row: `productTitle`, `unitPrice Decimal(12,2)`, `quantity`, `color?`, `fitType?`, `size?`. `productId` is nullable so deleting a product doesn't destroy order history.
- **Payment** — 1:1 with Order. `valId`, `bankTranId`, `cardType`, `rawPayload Json`.

### Money
- **Sale** — one per paid `OrderItem` (`orderItemId @unique`). Holds `total` plus the split: `brandEarning`, `merchantEarning`, `platformEarning`. Links product, merchant (User), brand.
- **SaleItem** — line detail under a Sale (`unitPrice`, `total` as `Decimal`).
- **CommissionSetting** — time-bounded rates, scoped by any of `brandId` / `merchantId` / `productId`. Fields: `brandCommissionPct` (6.0), `merchantCommissionPct` (11.0), `brandSelectedMerchantPct` (6.0), `effectiveFrom`, `effectiveTo?`, `isActive`. Indexed `[brandId, merchantId, productId]`.
- **Refund** — one per `orderItemId @unique`; reverses the same three earning buckets.
- **Payout** — cash out to a `BRAND` or `MERCHANT` (`actor: PayoutActor`), `amount Decimal(12,2)`, `note?`.

### Reviews
- **ProductReview** — tied to a purchased `orderItemId @unique`, so only buyers can review. `rating Int`, `comment?`, `mediaKey?` + `mediaType: ReviewMediaType (IMAGE | VIDEO)`. `@@unique([productId, userId, orderItemId])`.

Other enums present but lightly used: `Visibility (SEARCHABLE | NON_SEARCHABLE)`, `ImageType (FRONT | BACK)`.

## Money flow

1. Merchant creates a product → `resolveEffectiveCommissions` **freezes** `brandCommissionPct` / `merchantCommissionPct` onto the `Product` row.
2. Cart → `frontend` server action creates `Order` (`PENDING`) + `OrderItem`s + `tranId`.
3. SSLCommerz redirect → `api/sslcz/success` validates, sets order `PAID`, upserts `Payment`.
4. `settleOrderEarnings(orderId)` (`frontend/src/lib/settlement.js`) runs in a transaction: reads the frozen product pct (falling back to `Brand.default*Pct`), upserts a `Sale` + `SaleItem` per `OrderItem` keyed on `orderItemId` (idempotent).
5. `merchant/` and `brand/` build summaries — some read `Sale`, some recompute from `Product` pct; admin records `Payout` rows when money is actually sent.

Settlement does **not** consult `CommissionSetting`; that model only feeds product creation and admin UI. Full detail and the divergences between the four resolvers: `commission.md`. Refunds go through `merchant/src/app/actions/payout/refundOrderItem.actions.js`, which writes a `Refund` mirroring the original `Sale`.
