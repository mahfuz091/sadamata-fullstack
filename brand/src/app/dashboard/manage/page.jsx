import { getAllBrandProductsOfUser } from '@/app/actions/brand/brand-products.actions';
import { auth } from '@/auth';
import DashboardManage from '@/components/DashboardManage/DashboardManage';
import Layout from '@/components/Layout/Layout';
import React from 'react';

const page = async() => {
      const session = await auth();
const userId = session?.user?.id;
const allRes = await getAllBrandProductsOfUser({
  userId,
  page: 1,
  pageSize: 12,
  sort: "createdAt_desc",
});

console.log(allRes, "result");



// Define a server action *inside* the server component and pass to client
async function loadMoreAction(prevState, formData) {
"use server";
const nextPage = Number(formData.get("nextPage"));
const res = await getAllBrandProductsOfUser({ merchantId, page: nextPage, pageSize: 12 });
return res; // will be returned to client component
}

    return (
   
<DashboardManage initialItems={allRes.items}
totalPages={allRes.totalPages}
initialPage={allRes.page}
loadMoreAction={loadMoreAction}/>
  
            
       
    );
};

export default page;