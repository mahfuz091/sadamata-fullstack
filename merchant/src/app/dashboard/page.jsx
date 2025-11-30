import { auth } from "@/auth";
import DashboardMain from "@/components/DashboardMain/DashboardMain";
import Layout from "@/components/Layout/Layout";
import React from "react";
import { getTodayMerchantSalesReportFromOrders } from "../actions/payout/todaySalesByMerchant.actions";
import { getMerchantSalesSummary } from "../actions/payout/merchantSalesSummary.actions";
import { getMerchantProductStats, getTodayUploadedProducts } from "../actions/payout/merchantProductStats.actions";
import { getMerchantSalesKpis } from "../actions/payout/merchantSales.actions";




const page = async () => {
  const session = await auth(); // Fetch session data here
const report = await getTodayMerchantSalesReportFromOrders(session?.user?.id);
const salesReport  = await getMerchantSalesSummary(session?.user?.id);
const stats = await getMerchantProductStats(session?.user?.id, { useVisibility: true });
const today = await getTodayUploadedProducts(session?.user?.id);
const salesData = await getMerchantSalesKpis(session?.user?.id)

// console.log( report,"report");
console.log(stats, "stats");
// console.log(today, "today");
// console.log(salesReport, "salesreport");
// console.log(salesData, "salesData");

  return <DashboardMain report={report} session={session} salesReport={salesReport} stats={stats} today={today} salesData={salesData} />;
};

export default page;
