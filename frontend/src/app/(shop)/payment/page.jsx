import { auth } from "@/auth";
import PaymentPage from "@/components/PaymentPage/PaymentPage";
import React from "react";

const page = async () => {
  const session = await auth();
  return (
    <>
      <PaymentPage />
    </>
  );
};

export default page;
