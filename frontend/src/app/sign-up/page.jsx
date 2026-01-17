import { auth } from "@/auth";
import Layout from "@/components/Layout/Layout";
import Registration from "@/components/Registration/Registration";
import React from "react";

const page = async () => {
  const session = await auth();
  return (
    <Layout session={session}>
      <Registration />
    </Layout>
  );
};

export default page;
