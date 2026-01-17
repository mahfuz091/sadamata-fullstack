import { auth } from "@/auth";
import Layout from "@/components/Layout/Layout";
import Login from "@/components/Login/Login";

import React from "react";

const page = async () => {
  const session = auth();

  return (
    <Layout session={session}>
      <Login />
    </Layout>
  );
};

export default page;
