import Layout from "@/components/Layout/Layout";

import { auth } from "@/auth";
import { notFound } from "next/navigation";
import {
  getProductsByCategorySlug,
  getRandomProductsByCategorySlug,
} from "@/app/actions/product/product.actions";
import CategoryProductsClient from "@/components/CategoryProducts/CategoryProductsClient";
import prisma from "@/lib/prisma";

export default async function Page({ params }) {
  const session = await auth();
  const { slug } = await params;

  const firstPage = await getProductsByCategorySlug({
    slug,
    page: 1,
    pageSize: 24,
    q: "",
    fitType: [],
    colors: [],
    sort: "newest",
  });
  console.log(firstPage);

  if (!firstPage.found) notFound();

  async function loadMore(prevState, formData) {
    "use server";
    const nextPage = Number(formData.get("nextPage") || 1);

    const q = formData.get("q") || "";
    const sort = formData.get("sort") || "newest";
    const brandId = formData.get("brandId") || "";

    const fitType = JSON.parse(formData.get("fitType") || "[]");
    const colors = JSON.parse(formData.get("colors") || "[]");

    return await getProductsByCategorySlug({
      slug,
      page: nextPage,
      pageSize: 24,
      q,
      sort,
      brandId: brandId || null,
      fitType,
      colors,
    });
  }

  const brands = await prisma.brand.findMany({
    where: {
      productCategoryId: firstPage.category.id,
      isActive: true,
    },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  const mockups = await prisma.mockup.findMany({
    select: { id: true, name: true },
  });
  const relatedProducts = await getRandomProductsByCategorySlug({
    slug,
    limit: 8,
  });

  return (
    <Layout session={session}>
      <CategoryProductsClient
        initialItems={firstPage.items}
        initialPage={firstPage.page}
        totalPages={firstPage.totalPages}
        loadMoreAction={loadMore}
        category={firstPage.category}
        brands={brands}
        mockups={mockups}
        relatedProducts={relatedProducts?.items || []}
      />
    </Layout>
  );
}
