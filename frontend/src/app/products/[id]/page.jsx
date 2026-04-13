import { getProductsByProductId } from "@/app/actions/product/product.actions";
import { auth } from "@/auth";
import Layout from "@/components/Layout/Layout";
import ProductDetails2 from "@/components/ProductDetails/ProductDetails2";
import React from "react";

const page = async ({ params, searchParams }) => {
  const session = await auth();
  const { id } = await params;
  const query = await searchParams;
  const product = await getProductsByProductId(id);

  return (
    <Layout session={session}>
      <ProductDetails2
        product={product?.item}
        user={session?.user || null}
        reviewOrderItemId={query?.reviewOrderItem || ""}
      />
    </Layout>
  );
};

export default page;
