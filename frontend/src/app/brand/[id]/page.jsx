import { auth } from "@/auth";
import BrandProfile from "@/components/BrandProfile/BrandProfile";
import Layout from "@/components/Layout/Layout";
import React from "react";
import { getBrandById, getProductsByBrandId } from "@/app/actions/brand/brand.actions";
import { notFound } from "next/navigation";

const BrandPage = async ({ params }) => {
  const { id } = await params;
  const session = await auth();

  const brand = await getBrandById(id);

  if (!brand) {
    return notFound();
  }

  const { items: products } = await getProductsByBrandId(id, { pageSize: 100 });

  return (
    <Layout session={session}>
      <BrandProfile brand={brand} products={products} />
    </Layout>
  );
};

export default BrandPage;
