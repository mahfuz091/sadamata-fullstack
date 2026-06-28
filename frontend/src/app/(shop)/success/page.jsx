import { auth } from "@/auth";
import SuccessPage from "@/components/SuccessPage/SuccessPage";

import React from "react";

const page = async ({ searchParams }) => {
  const session = await auth();
  const { tran } = await searchParams;

  console.log(tran);

  return (
    <>
      <SuccessPage />
    </>
  );
};

export default page;
