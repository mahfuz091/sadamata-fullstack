// lib/productQuery.js

export const PUBLIC_VARIANT_WHERE = {
  isActive: true,
};

export const PUBLIC_PRODUCT_WHERE = {
  isActive: true,
  visibility: true,

  // merchant must be active
  User: {
    isActive: true,
  },

  // ✅ Brand logic (fixed)
  OR: [
    // case 1: linked brand → brand must be active
    {
      brandId: { not: null },
      Brand: {
        isActive: true,
      },
    },

    // case 2: no brandId → brandName exists
    {
      brandId: null,
      brandName: { not: null },
    },
  ],

  // must have at least one active variant
  variants: {
    some: { isActive: true },
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
      isActive: true,
    },
  },
};
