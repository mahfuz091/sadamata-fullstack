import { auth } from "@/auth";
import BrandProfile from "@/components/BrandProfile/BrandProfile";
import React from "react";
import { getBrandBySlug, getProductsByBrandId } from "@/app/actions/brand/brand.actions";
import { getFollowStatus, getFollowerCount } from "@/app/actions/brand/follow.actions";
import { notFound } from "next/navigation";

const BrandPage = async ({ params }) => {
  const { slug } = await params;
  const session = await auth();

  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return notFound();
  }

  const { items: products } = await getProductsByBrandId(brand.id, { pageSize: 100 });

  const isFollowing = await getFollowStatus(brand.id);
  const followerCount = await getFollowerCount(brand.id);

  return (
    <>
      <BrandProfile
        brand={brand} 
        products={products} 
        initialIsFollowing={isFollowing} 
        followerCount={followerCount} 
      />
    </>
  );
};

export default BrandPage;
