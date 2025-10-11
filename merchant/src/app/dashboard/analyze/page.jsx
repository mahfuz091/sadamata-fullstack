import { getMerchantProductSalesSummary } from "@/app/actions/payout/sales-summery.actions";
import { auth } from "@/auth";
import Analyze from "@/components/Analyze/Analyze";
import Layout from "@/components/Layout/Layout";
import { getMerchantFinancialSummary } from "@/utils/financeSummary";
import React from "react";

const page = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  const summery = await getMerchantFinancialSummary(userId);
  console.log(summery);
  const merchantId = session?.user?.id;
  if (!merchantId) return <div className="container py-5">Please sign in.</div>;

  // initial fetch (10 items)
  const firstPage = await getMerchantProductSalesSummary({
    merchantId,
    page: 1,
    pageSize: 10,
  });

  // server action for load more
  async function loadMoreSales(prevState, formData) {
    "use server";
    const nextPage = Number(formData.get("nextPage"));
    const res = await getMerchantProductSalesSummary({
      merchantId,
      page: nextPage,
      pageSize: 10,
    });
    return res;
  }

  return (
    <Analyze
      initialItems={firstPage.items}
      initialPage={firstPage.page}
      totalPages={firstPage.totalPages}
      loadMoreAction={loadMoreSales}
      summery={summery}
    />
  );
};

export default page;
