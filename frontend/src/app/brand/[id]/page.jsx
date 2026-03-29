import { auth } from "@/auth";
import BrandProfile from "@/components/BrandProfile/BrandProfile";
import Layout from "@/components/Layout/Layout";
import React from "react";
import { getBrandById, getProductsByBrandId } from "@/app/actions/brand/brand.actions";
import { getFollowStatus, getFollowerCount } from "@/app/actions/brand/follow.actions";
import { notFound } from "next/navigation";

const BrandPage = async ({ params }) => {
  const { id } = await params;
  const session = await auth();

  const brand = await getBrandById(id);

  if (!brand) {
    return notFound();
  }

  const { items: products } = await getProductsByBrandId(id, { pageSize: 100 });

  const isFollowing = await getFollowStatus(id);
  const followerCount = await getFollowerCount(id);

  return (
    <Layout session={session}>
      <BrandProfile 
        brand={brand} 
        products={products} 
        initialIsFollowing={isFollowing} 
        followerCount={followerCount} 
      />
    </Layout>
  );
};

export default BrandPage;
