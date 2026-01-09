import {
  assertIsMerchant,
  getMerchantProducts,
} from "@/app/actions/merchant/merchant-products.actions";
import { auth } from "@/auth";
import DashboardManage from "@/components/DashboardManage/DashboardManage";
import Layout from "@/components/Layout/Layout";
import React from "react";
import placeholder from "@/assets/images/products/cart.png";
import { getPrivateUrl } from "@/lib/s3";
const SIGN_EXPIRES = 60 * 60; // 1 hour
async function attachPreviewUrl(items) {
  return await Promise.all(
    items.map(async (p) => {
      // ✅ choose the key that actually stores S3 key
      // if you store it in p.previewImg then use that
      const key = p.previewImg || p.frontDesign || null;

      return {
        ...p,
        previewUrl: key ? await getPrivateUrl(key, SIGN_EXPIRES) : null,
      };
    })
  );
}

const page = async () => {
  const session = await auth();
  const merchantId = session?.user?.id; // adjust per your auth payload

  if (!merchantId) {
    return (
      <section className='container py-5'>
        <p>Please sign in.</p>
      </section>
    );
  }

  await assertIsMerchant(merchantId);

  // initial server fetch
  const firstPage = await getMerchantProducts({
    merchantId,
    page: 1,
    pageSize: 12,
  });
  const signedFirstItems = await attachPreviewUrl(firstPage.items);

  // Define a server action *inside* the server component and pass to client
  async function loadMoreAction(prevState, formData) {
    "use server";
    const nextPage = Number(formData.get("nextPage"));
    const res = await getMerchantProducts({
      merchantId,
      page: nextPage,
      pageSize: 12,
    });
    // ✅ sign new items too
    const signedItems = await attachPreviewUrl(res.items);

    return {
      ...res,
      items: signedItems,
    };
  }

  return (
    <DashboardManage
      initialItems={signedFirstItems}
      totalPages={firstPage.totalPages}
      initialPage={firstPage.page}
      loadMoreAction={loadMoreAction}
      placeholderSrc={placeholder}
      merchantId={merchantId}
    />
  );
};

export default page;
