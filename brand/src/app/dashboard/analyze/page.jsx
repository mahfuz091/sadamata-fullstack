import { getBrandId } from "@/app/actions/brand/getBrandId.actions";
import { getBrandProductSalesSummaryByUser } from "@/app/actions/brand/sales-summery.actions";
import { auth } from "@/auth";
import Analyze from "@/components/Analyze/Analyze";
import Layout from "@/components/Layout/Layout";
import { prisma } from "@/lib/prisma";
import { getBrandFinancialSummary } from "@/utils/financeSummary";
import React from "react";

const page = async() => {
     const session = await auth();
  const userId = session?.user?.id;
  const brandId = await getBrandId(userId)
   const summery = await getBrandFinancialSummary(brandId);
  console.log(summery);
 

  console.log(brandId, "brandId");
  
  const allRes = await getBrandProductSalesSummaryByUser({
  userId: userId,
  page: 1,
  pageSize: 12,
  
});
console.log(allRes, "res");

async function loadMoreAction(prevState, formData) {
"use server";
const nextPage = Number(formData.get("nextPage"));
const res = await getBrandProductSalesSummaryByUser({ userId, page: nextPage, pageSize: 12 });
return res; // will be returned to client component
}


  return (
   
      <Analyze initialItems={allRes.items}
totalPages={allRes.totalPages}
initialPage={allRes.page}
loadMoreAction={loadMoreAction} summery={summery} />

  
  );
};

export default page;
