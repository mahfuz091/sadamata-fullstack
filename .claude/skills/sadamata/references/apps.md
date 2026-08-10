# Per-app map

## frontend/ — public shop (port 3000, `sadamata.com`)

Owns: catalog, cart, checkout, SSLCommerz payment, orders, reviews, brand follow, vendor signup entry points.

Routes (`src/app/`):
```
(shop)/page.js               home
(shop)/products/             list + [id] detail
(shop)/categories/[slug]/    category listing
(shop)/brand/  brand/[slug]/ brand list + brand profile page
(shop)/cart  checkout  payment  success
(shop)/favorites  orders  profile
(shop)/login  sign-up
(shop)/about  privacy  terms  refund
thankyou/  vendor-login/  vendor-signup/
```

API routes:
```
api/auth/[...nextauth]      NextAuth handler
api/mockups                 mockup data
api/search/suggest          typeahead
api/sslcz/success           payment success (marks PAID, settles earnings)
api/sslcz/success-bridge    POST→GET bridge for the redirect
api/sslcz/ipn               async IPN
api/sslcz/return/{fail,cancel,ipn}
```

Server actions (`src/app/actions/`): `auth.actions.js`, `address/address.actions.js`, `userAddressActions.js`, `brand/brand.actions.js`, `brand/follow.actions.js`, `cart/cart.actions.js`, `payment/payment.actions.js`, `product/product.actions.js`, `product/getSignedUrls.js`, `review/review.actions.js`, `search/search.actions.js` (+ a duplicate `search.actions.js` at the actions root).

`src/lib/`:
| File | Purpose |
|---|---|
| `prisma.js` | singleton client |
| `auth.js` | `signAuthToken`, `verifyAuthToken`, `setAuthCookie` (jose JWT, outside NextAuth) |
| `s3.js` | `uploadToS3`, `getPrivateUrl` |
| `sslcz.js` | SSLCommerz init/validate, `SSLCZ_MODE` switches sandbox/live |
| `settlement.js` | **`settleOrderEarnings(orderId)`** — the money split, writes `Sale` + `SaleItem` in a transaction |
| `productQuery.js` | shared Prisma `where`/`include` fragments for public listings |
| `attachPreviewUrl.js.js` | `attachPreviewUrl`/`attachPreviewUrlTwo` — batch-sign variant images |
| `helper.js` | `getProductImage` (variant priority), `isDarkColor`/`isLightColor` |
| `url.js`, `reactSelect.js` | small helpers |

`src/hooks/`: `useFavorites`, `useScrollUp`. `src/app/middleware.js` protects `/checkout` → `/login?redirect=<path>`.

Extra deps here only: `sslcommerz-lts`, `swiper`, `react-hook-form`, `react-icons`.

---

## merchant/ — merchant portal (port 3001, `merch.sadamata.com`)

Owns: merchant onboarding, design upload, product creation on top of mockups, per-merchant sales/payout reporting, refunds.

Routes:
```
page.js  signin/  signup/  activation-notice/  overview/
mockup/                              mockup create form (posts to createMockup)
dashboard/                           merchant home
dashboard/add-design/
dashboard/manage/  dashboard/analyze/
dashboard/product/edit/[productId]/  and dashboard/products/[productId]/edit/  (two edit routes exist)
dashboard/profile/  profile/bank/  profile/change-password/
```

API: only `api/auth/[...nextauth]`.

Server actions:
```
auth/auth.actions.js  auth/sendResetLink.js  auth/resetPassword.js  auth/userAddressActions.js
brand/brand.actions.js
merchant/merchant-products.actions.js
mockup/mockup.actions.js
product/product.actions.js
payout/payout.actions.js
payout/merchantSales.actions.js       merchantSalesSummary.actions.js
payout/merchantProductStats.actions.js
payout/todaySalesByMerchant.actions.js  todaySalesReport.actions.js
payout/sales-summery.actions.js
payout/refundOrderItem.actions.js
```

`src/lib/`: `prisma.js`, `s3.js`, `s3helper.js`, `s3Keys.js` (key builders), `s3View.js`, `smpin.js` (`generateUniqueSmpin` — 10-char A–Z0–9 unique product code), `email.js` (nodemailer, password reset), `constants.js`.
`src/utils/`: `color.js`, `generateTitle.js`, `financeSummary.js`, `validation.js`.

Extra deps here only: `fabric` (canvas design editor), `jszip`, `file-saver`, `react-player`, `nodemailer`, `zod`.

`next.config.js` proxies `/mockup/uploads/mockups/:file*` → `NEXT_PUBLIC_MOCKUP_ORIGIN` (default `http://localhost:3003`, prod `https://admin.sadamata.com`). Server Action body limit raised to **800mb** for canvas uploads.

---

## brand/ — brand portal (port 3002)

Nearly a fork of `merchant/` with brand-scoped reporting instead of payouts.

Routes:
```
page.js  signin/  signup/  enroll/  choose-plan/  activation-notice/  overview/
dashboard/  dashboard/brand/  dashboard/manage/  dashboard/analyze/
dashboard/profile/  profile/bank/  profile/change-password/
```

API: `api/auth/[...nextauth]`, `api/brand/create`, `api/brand/subbrand/create`, `api/brandcategory/create`.

Server actions: `auth/{auth,brand,userAddressActions}.actions.js`, `brandActions.js`, `brandCategoryActions.js`, `s3Actions.js`, `mockup/mockups.actions.js`, and `brand/` → `brand-products.actions.js`, `brandSales.actions.js`, `brandSalesSummary.actions.js`, `brand-stats.actions.js`, `getBrandId.actions.js`, `sales-summery.actions.js`.

`src/lib/`: `prisma.js`, `auth.js`, `s3.js`, `s3helper.js`, `s3Keys.js`, `brandSlug.js`, `generateOptionsFromBrandCategories.js`.
Extra deps: `recharts`, `react-datepicker`, `date-fns`, `cookie`.

---

## dashboard/ — admin (port 3003, `admin.sadamata.com`)

Owns: user/brand/merchant approval + commission overrides, mockup library, product moderation, order fulfilment artifacts. Also carries a CMS (blog, press, careers, feedback) and a hotel/room/booking module bolted on from another project — **neither has tables in `schema.prisma`**. Hotel/room actions `fetch()` an external API at `NEXT_PUBLIC_API_BASE_URL`; blog/press actions call `prisma.blogPost` / `prisma.pressPost` / `prisma.post`, which don't exist, so they fail at runtime.

Routes (`src/app/dashboard/`):
```
page.jsx                        admin home
users/                          all users
brands/  brands/[id]/  brands/[id]/stats/
merch/   merch/[id]/   merch/[id]/stats/
products/  products/[id]/       moderation (ProductStat)
product-categories/
mockups/  add-mockup/  edit-mockup/[id]/
orders/  orders/[id]/
blog/    add-blog/ edit-blog/[id]/ preview-blog/ edit-preview-blog/
press/   add-press/ edit-press/[id]/ preview-press/ edit-preview-press/
careers/ add-career/ edit-career/[id]/ view/[id]/
client-feedback/ add-feedback/ edit-feedback/[slug]/
hotels/  add-hotel/ edit-hotel/[slug]/
rooms/   add-room/  edit-room/[slug]/
bookings/  bookings/[id]/
profile/
(auth)/login/  (auth)/register/
```

API routes:
```
api/auth/[...nextauth]
api/upload           api/editor-upload      api/download
api/orders/[id]/invoice            pdf-lib invoice
api/orders/[id]/production-sheet   print sheet
api/orders/[id]/zip                jszip bundle of design files
api/user/update-name
```

Server actions: `user/user.actions.js`, `user/setBrandCommission.js`, `user/setMerchantCommission.js`, `product/product.actions.js`, `productCategory.actions.js`, `brandCategory.actions.js`, `mockup/mockup.actions.js`, `order/order.actions.js`, `blog/blog.actions.js`, `blog/blogCategory.js`, `press/press.actions.js`, `hotel/hotel.actions.js`, `room/room.actions.js`.

`src/lib/`: `prisma.js`, `s3.js`, `utils.js` (`cn`), `requireRole.js`, `constants.js`, `attachPreviewUrl.js.js`.
`src/context/`: `BlogContext`, `PressContext`. `src/hooks/use-mobile.js`.

UI stack: shadcn/ui in `src/components/ui/` (26 primitives), Ant Design 5 (`antd` + `@ant-design/v5-patch-for-react-19`) for heavy tables, `@tanstack/react-table`, `recharts`, `@dnd-kit` + `@hello-pangea/dnd` + `react-dnd` for ordering, Editor.js for rich text, `cloudinary` alongside S3.

`next.config.mjs` here uses turbopack + the `PrismaPlugin` webpack workaround and a **100mb** action body limit.
