import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductCategoriesSection from "../_components/ProductCategoriesSection";
import ProductStatusControl from "../_components/ProductStatusControl";
import DownloadButton from "../_components/DownloadButton";
import ProductVariantActiveToggle from "../_components/ProductVariantActiveToggle";
import { getPrivateUrl } from "@/lib/s3";
import { resolveCurrentCommission } from "@/lib/commission/currentRates";

export const metadata = {
  title: "Product Details",
};

const BASE_URL = process.env.NEXT_PUBLIC_ASSET_BASE_URL || "";

const COLOR_ORDER = [
  "#000",
  "#fff",
  "#192252",
  "#636B2F",
  "#895129",
  "#4CBB17",
  "#708090",
  "#24357a",
  "#4f3065",
  "#595855",
  "#669f51",
  "#c1daf7",
  "#f7a5bb",
].map((c) => c.toLowerCase());

const imgSrc = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default async function ProductDetailsPage({ params }) {
  const {id} = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      User: true,
      Brand: true,
      features: true,
      tags: true,
      variants: true,
      categories: true,
    },
  });

  const SIGN_EXPIRES = 60 * 60; // 1 hour

  async function sign(key) {
    return key ? await getPrivateUrl(key, SIGN_EXPIRES) : null;
  }

  const frontDesignUrl = await sign(product.frontDesign);
  const backDesignUrl = await sign(product.backDesign);

  const signedVariants = await Promise.all(
    product.variants.map(async (v) => ({
      ...v,
      frontImgUrl: await sign(v.frontImg),
      backImgUrl: await sign(v.backImg),
    }))
  );

  const sortedVariants = [...signedVariants].sort((a, b) => {
    const ca = (a.color || "").trim().toLowerCase();
    const cb = (b.color || "").trim().toLowerCase();

    const ia = COLOR_ORDER.indexOf(ca);
    const ib = COLOR_ORDER.indexOf(cb);

    // colors that are not in COLOR_ORDER go to the end
    const ra = ia === -1 ? 9999 : ia;
    const rb = ib === -1 ? 9999 : ib;

    // first sort by color order, then by fitType, then by color string (stable-ish)
    if (ra !== rb) return ra - rb;

    const fa = (a.fitType || "").toString();
    const fb = (b.fitType || "").toString();
    if (fa !== fb) return fa.localeCompare(fb);

    return ca.localeCompare(cb);
  });

  const allCategories = await prisma.productCategory.findMany({
    orderBy: { name: "asc" },
  });

  // what a sale of this product would pay if it settled right now
  const current = await resolveCurrentCommission({
    merchantId: product.userId,
    brandId: product.brandId || null,
  });

  const samePct = (a, b) =>
    a == null || Math.abs(Number(a) - Number(b)) < 0.001;

  const drift = [
    samePct(product.brandCommissionPct, current.brandPct) ? null : "brand",
    samePct(product.merchantCommissionPct, current.merchantPct)
      ? null
      : "merchant",
  ].filter(Boolean);

  if (!product) notFound();

  return (
    <div className='p-6 space-y-8'>
      <h1 className='text-2xl font-semibold'>Product Details</h1>

      {/* Basic Info */}
      {/* <Section title='Basic Information'>
        <Item label='Title' value={product.title} />
        <Item label='Price' value={`৳${product.price}`} />
        <Item label='Status' value={product.status} />
        <Item label='Visibility' value={product.isActive ? "Live" : "Hidden"} />
        <Item label='Created At' value={product.createdAt.toDateString()} />
      </Section> */}

      <Section title='Basic Information'>
        <Item label='Title' value={product.title} />
        <Item label='Price' value={`৳${product.price}`} />

        <div>
          <p className='text-sm text-muted-foreground'>Status / Visibility</p>
          <ProductStatusControl
            productId={product.id}
            initialStatus={product.status}
            initialIsActive={product.isActive}
          />
        </div>

        <Item label='Created At' value={product.createdAt.toDateString()} />
      </Section>

      {/* Merchant & Brand */}
      <Section title='Ownership'>
        <Item label='Merchant' value={product.User?.name} />
        <Item label='Merchant Email' value={product.User?.email} />
        <Item label='Brand' value={product.Brand?.name || product.brandName} />
      </Section>

      {/* Commission */}
      <Section title='Commission Settings'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <RateCard
            title='Current active rates'
            hint={
              current.isExclusive
                ? "Exclusive brand — the brand rule sets the brand share"
                : "Live CommissionSetting cascade"
            }
            rows={[
              {
                label: "Brand",
                pct: current.brandPct,
                source: current.brandSource,
              },
              {
                label: "Merchant",
                pct: current.merchantPct,
                source: current.merchantSource,
              },
              {
                label: "Platform",
                pct: current.platformPct,
                source: "remainder",
              },
            ]}
          />

          <RateCard
            title='Frozen on this product'
            hint='Snapshot taken at product creation — what settlement pays today'
            rows={[
              {
                label: "Brand",
                pct: product.brandCommissionPct,
                source: product.brandCommissionPct == null ? "not set" : null,
              },
              {
                label: "Merchant",
                pct: product.merchantCommissionPct,
                source:
                  product.merchantCommissionPct == null ? "not set" : null,
              },
            ]}
          />
        </div>

        {current.clamped && (
          <p className='text-sm text-amber-600'>
            Brand + merchant exceed 100% — merchant share clamped.
          </p>
        )}

        {drift.length > 0 && (
          <p className='text-sm text-amber-600'>
            Frozen snapshot differs from the current rates ({drift.join(", ")}).
            Existing sales already settled keep their original amounts.
          </p>
        )}
      </Section>

      {/* Design Files */}
      {/* <Section title='Design Files'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-sm text-muted-foreground mb-1'>Front Design</p>
            {product.frontDesign ? (
              <img
                src={imgSrc(product.frontDesign)}
                alt='Front Design'
                className='w-full max-w-sm rounded border'
              />
            ) : (
              <p>-</p>
            )}
          </div>

          <div>
            <p className='text-sm text-muted-foreground mb-1'>Back Design</p>
            {product.backDesign ? (
              <img
                src={imgSrc(product.backDesign)}
                alt='Back Design'
                className='w-full max-w-sm rounded border'
              />
            ) : (
              <p>-</p>
            )}
          </div>
        </div>
      </Section> */}
      <Section title='Design Files'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-sm text-muted-foreground mb-1'>Front Design</p>

            {product.frontDesign ? (
              <>
                <img
                  // src={imgSrc(product.frontDesign)}
                  src={frontDesignUrl}
                  alt='Front Design'
                  className='w-full max-w-sm rounded border'
                />
                {/* <DownloadButton
                  // url={imgSrc(product.frontDesign)}
                  url={frontDesignUrl}
                  filename={`front-design-${product.id}.png`}
                /> */}
                <DownloadButton
                  s3Key={product.frontDesign}
                  filename={`front-design-${product.id}.png`}
                />
              </>
            ) : (
              <p>-</p>
            )}
          </div>

          <div>
            <p className='text-sm text-muted-foreground mb-1'>Back Design</p>

            {product.backDesign ? (
              <>
                <img
                  // src={imgSrc(product.backDesign)}
                  src={backDesignUrl}
                  alt='Back Design'
                  className='w-full max-w-sm rounded border'
                />
                {/* <DownloadButton
                  // url={imgSrc(product.backDesign)}
                  url={backDesignUrl}
                  filename={`back-design-${product.id}.png`}
                /> */}

                <DownloadButton
                  s3Key={product.backDesign}
                  filename={`back-design-${product.id}.png`}
                />
              </>
            ) : (
              <p>-</p>
            )}
          </div>
        </div>
      </Section>

      {/* Variants */}
      <Section title='Variants'>
        {product.variants.length === 0 ? (
          <p className='text-sm text-muted-foreground'>No variants</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {sortedVariants.map((v) => (
              <div key={v.id} className='border rounded p-3 space-y-2'>
                <div className='flex items-center justify-between gap-3'>
                  <p className='font-medium'>
                    {v.color} • {v.fitType}
                  </p>

                  <ProductVariantActiveToggle
                    variantId={v.id}
                    initialIsActive={v.isActive}
                  />
                </div>

                <div className='flex gap-3'>
                  {v.frontImg && (
                    <img
                      // src={imgSrc(v.frontImg)}
                      src={v.frontImgUrl}
                      alt='Variant Front'
                      className='w-32 h-32 object-cover rounded border'
                    />
                  )}

                  {v.backImg && (
                    <img
                      // src={imgSrc(v.backImg)}
                      src={v.backImgUrl}
                      alt='Variant Back'
                      className='w-32 h-32 object-cover rounded border'
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Features */}
      <Section title='Features'>
        {product.features.length === 0 ? (
          <p className='text-sm text-muted-foreground'>No features</p>
        ) : (
          product.features.map((f) => <p key={f.id}>• {f.content}</p>)
        )}
      </Section>

      {/* Tags */}
      <Section title='Tags'>
        {product.tags.length === 0 ? (
          <p className='text-sm text-muted-foreground'>No tags</p>
        ) : (
          product.tags.map((t) => (
            <span
              key={t.id}
              className='inline-block mr-2 px-2 py-1 border rounded text-sm'
            >
              {t.value}
            </span>
          ))
        )}
      </Section>

      {/* Categories */}
      <Section title='Product Categories'>
        <ProductCategoriesSection
          productId={product.id}
          selectedCategories={product.categories}
          allCategories={allCategories}
        />
      </Section>
    </div>
  );
}

/* ---------------- Reusable UI ---------------- */

function Section({ title, children }) {
  return (
    <div className='border rounded-lg p-4'>
      <h2 className='text-lg font-medium mb-4'>{title}</h2>
      <div className='space-y-2'>{children}</div>
    </div>
  );
}

function RateCard({ title, hint, rows }) {
  return (
    <div className='border rounded-lg p-4'>
      <p className='font-medium'>{title}</p>
      <p className='text-xs text-muted-foreground mb-3'>{hint}</p>

      <div className='space-y-2'>
        {rows.map((r) => (
          <div key={r.label} className='flex items-baseline justify-between'>
            <span className='text-sm text-muted-foreground'>{r.label}</span>
            <span className='text-right'>
              <span className='font-semibold tabular-nums'>
                {r.pct == null ? "—" : `${Number(r.pct)}%`}
              </span>
              {r.source && (
                <span className='block text-xs text-muted-foreground'>
                  {r.source}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Item({ label, value }) {
  return (
    <div>
      <p className='text-sm text-muted-foreground'>{label}</p>
      <p className='font-medium break-all'>{value || "-"}</p>
    </div>
  );
}
