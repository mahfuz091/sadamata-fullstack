import React, { Suspense } from "react";
import Layout from "@/components/Layout/Layout";
import ForgotPassword from "@/components/ForgotPassword/ForgotPassword";

export const metadata = {
  title: "Forgot password",
  description: "Sadamata",
};

const Page = () => (
  <Layout>
    <Suspense fallback={null}>
      <ForgotPassword />
    </Suspense>
  </Layout>
);

export default Page;
