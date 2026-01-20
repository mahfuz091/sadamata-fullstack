import { auth } from "@/auth";
import Layout from "@/components/Layout/Layout";
import TermsAndConditions from "@/components/TermsAndConditions/TermsAndConditions";

import React from "react";

const page = async () => {
  const session = await auth();
  return (
    <Layout session={session}>
      <TermsAndConditions />
    </Layout>
  );
};

export default page;
