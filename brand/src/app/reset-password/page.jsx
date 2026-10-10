import React, { Suspense } from "react";
import Layout from "@/components/Layout/Layout";
import ResetPassword from "@/components/ResetPassword/ResetPassword";

export const metadata = {
  title: "Reset password",
  description: "Sadamata",
};

const Page = () => (
  <Layout>
    <Suspense fallback={null}>
      <ResetPassword />
    </Suspense>
  </Layout>
);

export default Page;
