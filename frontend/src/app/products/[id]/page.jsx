import { getProductsByProductId } from "@/app/actions/product/product.actions";
import { auth } from "@/auth";
import Layout from "@/components/Layout/Layout";
import ProductDetails from "@/components/ProductDetails/ProductDetails";
import ProductDetails2 from "@/components/ProductDetails/ProductDetails2";
import React from "react";

const page = async ({ params }) => {
  const session = await auth();
  const { id } = await params;
  //   console.log(id);
  const product = await getProductsByProductId(id);
  //   console.log(product);

  return (
    //    <ProductDetails product={product}/>
    <Layout session={session}>
      <ProductDetails2 product={product?.item} />
    </Layout>
  );
};

export default page;
