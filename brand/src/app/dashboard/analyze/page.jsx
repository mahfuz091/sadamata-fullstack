// ✅ SERVER page (Brand Analyze) — now supports: page/pageSize + dateFrom/dateTo + searchTerm
import { getBrandId } from "@/app/actions/brand/getBrandId.actions";
import { getBrandProductSalesSummaryByUser } from "@/app/actions/brand/sales-summery.actions";
import { auth } from "@/auth";
import Analyze from "@/components/Analyze/Analyze";
import { getBrandFinancialSummary } from "@/utils/financeSummary";
import { getPrivateUrl } from "@/lib/s3";

const SIGN_EXPIRES = 60 * 60;

async function attachPreviewUrl(items) {
  return Promise.all(
    items.map(async (item) => ({
      ...item,
      previewUrl: item.previewImg ? await getPrivateUrl(item.previewImg, SIGN_EXPIRES) : null,
    }))
  );
}

const page = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return <div className="container py-5">Please sign in.</div>;

  const brandId = await getBrandId(userId);
  const summery = await getBrandFinancialSummary(brandId);

  // initial fetch (no filters)
  const firstPage = await getBrandProductSalesSummaryByUser({
    userId,
    page: 1,
    pageSize: 12,
  });

  const signedFirstItems = await attachPreviewUrl(firstPage.items);

  async function loadPageAction(prevState, formData) {
    "use server";

    const page = Number(formData.get("page") || 1);
    const pageSize = Number(formData.get("pageSize") || 12);

    // ✅ optional filters
    const dateFrom = formData.get("dateFrom") || undefined; // "YYYY-MM-DD"
    const dateTo = formData.get("dateTo") || undefined;     // "YYYY-MM-DD"
    const searchTerm = (formData.get("searchTerm") || "").toString().trim();

    const res = await getBrandProductSalesSummaryByUser({
      userId,
      page,
      pageSize,
      dateFrom,
      dateTo,
      searchTerm, // ✅ we’ll add support in the action below
    });

    const signed = await attachPreviewUrl(res.items);
    return { ...res, items: signed };
  }

  return (
    <Analyze
      initialItems={signedFirstItems}
      totalPages={firstPage.totalPages}
      initialPage={firstPage.page}
      loadMoreAction={loadPageAction}
      summery={summery}
    />
  );
};

export default page;
