import { auth } from "@/auth";
import BrandProfile from "@/components/BrandProfile/BrandProfile";
import Layout from "@/components/Layout/Layout";
import RelatedProducts from "@/components/RelatedProducts/RelatedProducts";
import React from "react";

const page = async () => {
  const session = await auth();
  return (
    <Layout session={session}>
      <BrandProfile />
      <RelatedProducts />
    </Layout>
  );
};

export default page;
