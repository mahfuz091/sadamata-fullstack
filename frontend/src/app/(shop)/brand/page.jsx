import { auth } from "@/auth";
import BrandProfile from "@/components/BrandProfile/BrandProfile";
import RelatedProducts from "@/components/RelatedProducts/RelatedProducts";
import React from "react";

const page = async () => {
  const session = await auth();
  return (
    <>
      <BrandProfile />
      <RelatedProducts />
    </>
  );
};

export default page;
