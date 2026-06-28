import { auth } from "@/auth";
import Registration from "@/components/Registration/Registration";
import React from "react";

const page = async () => {
  const session = await auth();
  return (
    <>
      <Registration />
    </>
  );
};

export default page;
