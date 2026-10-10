import React, { Suspense } from "react";
import ResetPassword from "@/components/ResetPassword/ResetPassword";

export const metadata = {
  title: "Reset password",
  description: "Sadamata",
};

const Page = () => (
  <Suspense fallback={null}>
    <ResetPassword />
  </Suspense>
);

export default Page;
