import ProductArea from "@/components/ProductArea/ProductArea";
import React from "react";
import { searchProducts } from "@/app/actions/search/search.actions";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const page = async ({ searchParams }) => {
  const session = await auth();
  const { slug = "", q = "" } = (await searchParams) || {};
  const result = await searchProducts({
    slug: String(slug),
    q: String(q),
    page: 1,
    pageSize: 12,
  });
  //   console.log(result);
  const brands = await prisma.brand.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  const mockups = await prisma.mockup.findMany({
    select: { id: true, name: true },
  });

  async function loadMore(prevState, formData) {
    "use server";

    const q = formData.get("q") || "";
    const slug = formData.get("slug") || "";
    const sort = formData.get("sort") || "newest";
    const brandId = formData.get("brandId") || "";
    const cursor = formData.get("cursor") || "";
    const minPrice = formData.get("minPrice") || "";
    const maxPrice = formData.get("maxPrice") || "";
    const fitType = JSON.parse(formData.get("fitType") || "[]");

    return await searchProducts({
      q: q ? String(q) : undefined,
      slug: slug ? String(slug) : undefined,
      brandId: brandId || undefined,
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
      fitType: fitType[0] || undefined,
      sort,
      pageSize: 12,
      cursor: cursor || null,
    });
  }

  return (
    <>
      <ProductArea
        result={result}
        brands={brands}
        slug={slug}
        q={q}
        mockups={mockups}
        relatedProducts={result?.items?.slice(0, 8) || []}
        loadMoreAction={loadMore}
      />
    </>
  );
};

export default page;
