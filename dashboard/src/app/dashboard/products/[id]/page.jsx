import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductCategoriesSection from "../_components/ProductCategoriesSection";
import ProductStatusControl from "../_components/ProductStatusControl";
import DownloadButton from "../_components/DownloadButton";
import ProductVariantActiveToggle from "../_components/ProductVariantActiveToggle";

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
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      User: true,
      Brand: true,
      features: true,
      tags: true,
      variants: true,
      categories: true,
    },
  });

  const sortedVariants = [...product.variants].sort((a, b) => {
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
        <Item
          label='Brand Commission %'
          value={product.brandCommissionPct ?? "Default"}
        />
        <Item
          label='Merchant Commission %'
          value={product.merchantCommissionPct ?? "Default"}
        />
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
                  src={imgSrc(product.frontDesign)}
                  alt='Front Design'
                  className='w-full max-w-sm rounded border'
                />
                <DownloadButton
                  url={imgSrc(product.frontDesign)}
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
                  src={imgSrc(product.backDesign)}
                  alt='Back Design'
                  className='w-full max-w-sm rounded border'
                />
                <DownloadButton
                  url={imgSrc(product.backDesign)}
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
                      src={imgSrc(v.frontImg)}
                      alt='Variant Front'
                      className='w-32 h-32 object-cover rounded border'
                    />
                  )}

                  {v.backImg && (
                    <img
                      src={imgSrc(v.backImg)}
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

function Item({ label, value }) {
  return (
    <div>
      <p className='text-sm text-muted-foreground'>{label}</p>
      <p className='font-medium break-all'>{value || "-"}</p>
    </div>
  );
}
