import { auth } from "@/auth";
import Layout from "@/components/Layout/Layout";
import TermsPage from "@/components/TermsPage/TermsPage";
import React from "react";

const page = async () => {
  const session = await auth();
  return (
    <Layout session={session}>
      <TermsPage />
    </Layout>
  );
};

export default page;
