import { auth } from "@/auth";
import Analyze from "@/components/Analyze/Analyze";
import Layout from "@/components/Layout/Layout";
import { getMerchantFinancialSummary } from "@/utils/financeSummary";
import React from "react";

const page = async() => {
  const session = await auth();
  const userId = session?.user?.id
  const summery = await getMerchantFinancialSummary(userId);
  console.log(summery);
  
  return <Analyze />;
};

export default page;
