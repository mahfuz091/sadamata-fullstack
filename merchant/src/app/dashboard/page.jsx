import { auth } from "@/auth";
import DashboardMain from "@/components/DashboardMain/DashboardMain";
import Layout from "@/components/Layout/Layout";
import React from "react";
import { getTodayMerchantSalesReportFromOrders } from "../actions/payout/todaySalesByMerchant.actions";
import { getMerchantSalesSummary } from "../actions/payout/merchantSalesSummary.actions";
import {
  getMerchantProductStats,
  getTodayUploadedProducts,
} from "../actions/payout/merchantProductStats.actions";
import { getMerchantSalesKpis } from "../actions/payout/merchantSales.actions";
import { getPrivateUrl } from "@/lib/s3";

const SIGN_EXPIRES = 60 * 60; // 1 hour for URL expiration

// Helper function to sign image URLs in sales data
async function attachPreviewUrlToSalesData(items) {
  return await Promise.all(
    items.map(async (item) => {
      const imageKey = item.image; // Assuming the image key is in `item.image`
      const signedUrl = imageKey ? await getPrivateUrl(imageKey, SIGN_EXPIRES) : null;
      return {
        ...item,
        previewUrl: signedUrl, // Add signed URL to item
      };
    })
  );
}

const page = async () => {
  const session = await auth(); // Fetch session data here
  const report = await getTodayMerchantSalesReportFromOrders(session?.user?.id);
  const salesReport = await getMerchantSalesSummary(session?.user?.id);
  const stats = await getMerchantProductStats(session?.user?.id, {
    useVisibility: true,
  });
  const today = await getTodayUploadedProducts(session?.user?.id);
  const salesData = await getMerchantSalesKpis(session?.user?.id);
  // const signedSalesData = await attachPreviewUrlToSalesData(salesData);
  // console.log( report,"report");
  console.log(salesData, "stats");
  // console.log(today, "today");
  // console.log(salesReport, "salesreport");
  // console.log(salesData, "salesData");

  return (
    <DashboardMain
      report={report}
      session={session}
      salesReport={salesReport}
      stats={stats}
      today={today}
      salesData={salesData}
    />
  );
};

export default page;
