import { auth } from "@/auth";
import DashboardMain from "@/components/DashboardMain/DashboardMain";
import Layout from "@/components/Layout/Layout";
import React from "react";
import { getTodayMerchantSalesReportFromOrders } from "../actions/payout/todaySalesByMerchant.actions";
import { getMerchantSalesSummary } from "../actions/payout/merchantSalesSummary.actions";




const page = async () => {
  const session = await auth(); // Fetch session data here
const report = await getTodayMerchantSalesReportFromOrders(session?.user?.id);
const salesReport  = await getMerchantSalesSummary(session?.user?.id);


console.log(salesReport, "report");

  return <DashboardMain report={report} session={session} salesReport={salesReport} />;
};

export default page;
