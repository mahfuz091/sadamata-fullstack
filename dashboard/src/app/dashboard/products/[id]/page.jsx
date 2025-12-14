import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Product Details",
};

const BASE_URL = process.env.ASSET_BASE_URL || "";

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
    },
  });

  if (!product) notFound();

  return (
    <div className='p-6 space-y-8'>
      <h1 className='text-2xl font-semibold'>Product Details</h1>

      {/* Basic Info */}
      <Section title='Basic Information'>
        <Item label='Title' value={product.title} />
        <Item label='Price' value={`৳${product.price}`} />
        <Item label='Status' value={product.status} />
        <Item label='Visibility' value={product.isActive ? "Live" : "Hidden"} />
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
      <Section title='Design Files'>
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
      </Section>

      {/* Variants */}
      <Section title='Variants'>
        {product.variants.length === 0 ? (
          <p className='text-sm text-muted-foreground'>No variants</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {product.variants.map((v) => (
              <div key={v.id} className='border rounded p-3 space-y-2'>
                <p className='font-medium'>
                  {v.color} • {v.fitType}
                </p>

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
