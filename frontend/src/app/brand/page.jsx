import BrandProfile from "@/components/BrandProfile/BrandProfile";
import Layout from "@/components/Layout/Layout";
import RelatedProducts from "@/components/RelatedProducts/RelatedProducts";
import React from "react";

const page = () => {
  return (
    <Layout>
      <BrandProfile />
      <RelatedProducts />
    </Layout>
  );
};

export default page;
