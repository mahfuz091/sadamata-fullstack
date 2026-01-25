import { getMerchantProductSalesSummary } from "@/app/actions/payout/sales-summery.actions";
import { auth } from "@/auth";
import Analyze from "@/components/Analyze/Analyze";
import { getMerchantFinancialSummary } from "@/utils/financeSummary";
import { getPrivateUrl } from "@/lib/s3";

const SIGN_EXPIRES = 60 * 60; // 1 hour

async function attachPreviewUrl(items) {
  return await Promise.all(
    items.map(async (item) => ({
      ...item,
      previewUrl: item.previewImg
        ? await getPrivateUrl(item.previewImg, SIGN_EXPIRES)
        : null,
    }))
  );
}

const page = async () => {
  const session = await auth();
  const merchantId = session?.user?.id;

  if (!merchantId) return <div className='container py-5'>Please sign in.</div>;

  const summery = await getMerchantFinancialSummary(merchantId);

  // initial fetch
  const firstPage = await getMerchantProductSalesSummary({
    merchantId,
    page: 1,
    pageSize: 10,
  });

  // ✅ sign initial items
  const signedFirstItems = await attachPreviewUrl(firstPage.items);

  // async function loadMoreSales(prevState, formData) {
  //   "use server";
  //   const nextPage = Number(formData.get("nextPage"));

  //   const res = await getMerchantProductSalesSummary({
  //     merchantId,
  //     page: nextPage,
  //     pageSize: 10,
  //   });

  //   // ✅ sign loaded items too
  //   const signed = await attachPreviewUrl(res.items);

  //   return { ...res, items: signed };
  // }
async function loadPageSales(prevState, formData) {
  "use server";
  const page = Number(formData.get("page") || 1);
  const pageSize = Number(formData.get("pageSize") || 10);

  const res = await getMerchantProductSalesSummary({
    merchantId,
    page,
    pageSize,
  });

  const signed = await attachPreviewUrl(res.items);
  return { ...res, items: signed };
}

  return (
    <Analyze
      initialItems={signedFirstItems}
      initialPage={firstPage.page}
      totalPages={firstPage.totalPages}
      loadMoreAction={loadPageSales}
      summery={summery}
    />
  );
};

export default page;
