import React, { Suspense } from "react";
import ForgotPassword from "@/components/ForgotPassword/ForgotPassword";

export const metadata = {
  title: "Forgot password",
  description: "Sadamata",
};

const Page = () => (
  <Suspense fallback={null}>
    <ForgotPassword />
  </Suspense>
);

export default Page;
