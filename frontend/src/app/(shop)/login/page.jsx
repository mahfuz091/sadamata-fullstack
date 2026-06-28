import { auth } from "@/auth";
import Login from "@/components/Login/Login";

import React from "react";

const page = async () => {
  const session = auth();

  return (
    <>
      <Login />
    </>
  );
};

export default page;
