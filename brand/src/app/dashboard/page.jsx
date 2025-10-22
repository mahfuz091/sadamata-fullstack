import DashboardMain from "@/components/DashboardMain/DashboardMain";
import Layout from "@/components/Layout/Layout";
import React from "react";

import { auth } from "@/auth";
import { getTodayBrandSalesReportFromOrders, getTodayUploadedProducts, getTodayUploadedProductsForFirstBrand, getUserFirstBrandStats, getUserProductStats } from "../actions/brand/brand-stats.actions";
import { getBrandSalesSummary } from "../actions/brand/brandSalesSummary.actions";
import { getBrandSalesKpis } from "../actions/brand/brandSales.actions";

const page = async() => {
    const session = await auth();
  const report = await getUserFirstBrandStats(session?.user?.id)
  const stats = await getUserProductStats(session?.user?.id, { useVisibility: true });
  // const salesReport = await getTodayBrandSalesReportFromOrders(session?.user?.id);
  const salesReport  = await getBrandSalesSummary(session?.user?.id);
  const today = await getTodayUploadedProducts(session?.user?.id);
  const salesData= await getBrandSalesKpis(session?.user?.id);
console.log(report, "report");
console.log(stats, "stats");
console.log(today, "today");
console.log(salesReport, "salesReport");
console.log(salesData, "salesData");

  return (
    // <Layout>
      <DashboardMain report={report} today={today} stats={stats} salesReport={salesReport} salesData={salesData}/>
    // </Layout>
  );
};

export default page;
