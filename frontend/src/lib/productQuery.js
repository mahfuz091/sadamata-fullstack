// lib/productQuery.js

export const PUBLIC_VARIANT_WHERE = {
  isActive: true,
};

export const PUBLIC_PRODUCT_WHERE = {
  isActive: true,
  visibility: true,

  // ✅ merchant (User) must be active
  User: {
    isActive: true,
  },

  // ✅ if product has a brand, brand must be active
  // (allows products without a brand)
  OR: [
    { brandId: null },
    {
      Brand: {
        isActive: true,
      },
    },
  ],

  // ✅ must have at least one active variant
  variants: {
    some: PUBLIC_VARIANT_WHERE,
  },
};

export const PUBLIC_PRODUCT_INCLUDE = {
  Brand: { select: { id: true, name: true } },
  User: { select: { id: true, name: true } },
  Mockup: { select: { id: true, name: true } },
  features: { select: { id: true, content: true } },
  tags: { select: { id: true, value: true } },

  // ✅ ONLY ACTIVE VARIANTS
  variants: {
    where: PUBLIC_VARIANT_WHERE,
    select: {
      id: true,
      color: true,
      fitType: true,
      frontImg: true,
      backImg: true,
    },
  },
};
