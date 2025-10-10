import { assertIsMerchant, getMerchantProducts } from "@/app/actions/merchant/merchant-products.actions";
import { auth } from "@/auth";
import DashboardManage from "@/components/DashboardManage/DashboardManage";
import Layout from "@/components/Layout/Layout";
import React from "react";
import placeholder from "@/assets/images/products/cart.png";

const page = async() => {
  const session = await auth();
const merchantId = session?.user?.id; // adjust per your auth payload


if (!merchantId) {
return (
<section className="container py-5">
<p>Please sign in.</p>
</section>
);
}


await assertIsMerchant(merchantId);


// initial server fetch
const firstPage = await getMerchantProducts({ merchantId, page: 1, pageSize: 12 });


// Define a server action *inside* the server component and pass to client
async function loadMoreAction(prevState, formData) {
"use server";
const nextPage = Number(formData.get("nextPage"));
const res = await getMerchantProducts({ merchantId, page: nextPage, pageSize: 12 });
return res; // will be returned to client component
}
  return <DashboardManage  initialItems={firstPage.items}
totalPages={firstPage.totalPages}
initialPage={firstPage.page}
loadMoreAction={loadMoreAction}
placeholderSrc={placeholder}/>;
};

export default page;
