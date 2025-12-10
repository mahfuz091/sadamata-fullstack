import { auth } from "@/auth";
import Layout from "@/components/Layout/Layout";
import PaymentPage from "@/components/PaymentPage/PaymentPage";
import React from "react";

const page = async () => {
  const session = await auth();
  return (
    <Layout session={session}>
      <PaymentPage />
    </Layout>
  );
};

export default page;
