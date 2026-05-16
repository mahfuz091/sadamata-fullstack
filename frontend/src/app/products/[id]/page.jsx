import { getProductsByProductId, getRelatedProducts, getProductSalesRank } from "@/app/actions/product/product.actions";
import { auth } from "@/auth";
import Layout from "@/components/Layout/Layout";
import ProductDetails2 from "@/components/ProductDetails/ProductDetails2";
import RelatedProducts from "@/components/RelatedProducts/RelatedProducts";
import React from "react";

const page = async ({ params, searchParams }) => {
  const session = await auth();
  const { id } = await params;
  const query = await searchParams;
  const product = await getProductsByProductId(id);

  const item = product?.item;

  const [related, salesRank] = await Promise.all([
    item
      ? getRelatedProducts({
          excludeId: item.id,
          brandId: item.brandId || null,
          userId: item.userId || null,
        })
      : Promise.resolve([]),
    item ? getProductSalesRank(item.id) : Promise.resolve({ rank: null, totalUnitsSold: 0 }),
  ]);

  return (
    <Layout session={session}>
      <ProductDetails2
        product={item}
        user={session?.user || null}
        reviewOrderItemId={query?.reviewOrderItem || ""}
        salesRank={salesRank}
      />
      {related.length > 0 && (
        <RelatedProducts
          products={related}
          title="Related Products"
          seeAllHref="/products"
        />
      )}
    </Layout>
  );
};

export default page;
