import { getMockupsWithProducts } from "@/app/actions/mockup/mockups.actions";
import { auth } from "@/auth";
import DashBrand from "@/components/DashBrand/DashBrand";
import Layout from "@/components/Layout/Layout";
import React from "react";

const page = async() => {
  const session = await auth()
  const userId = session?.user?.id
  const data = await getMockupsWithProducts(userId);
  console.log(data, "data");
  
  return (
    // <Layout>
      <DashBrand data={data.mockups} brandName = {data.brandName} />
    // </Layout>
  );
};

export default page;
