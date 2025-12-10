import { auth } from "@/auth";
import Layout from "@/components/Layout/Layout";
import SuccessPage from "@/components/SuccessPage/SuccessPage";
import React from "react";

const page = async ({ searchParams }) => {
  const session = await auth();
  const tran = searchParams.tran;
  console.log("tran:", tran);

  return (
    <Layout session={session}>
      <SuccessPage />
    </Layout>
  );
};

export default page;
