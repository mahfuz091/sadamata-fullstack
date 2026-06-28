import { auth } from "@/auth";
import TermsAndConditions from "@/components/TermsAndConditions/TermsAndConditions";

import React from "react";

const page = async () => {
  const session = await auth();
  return (
    <>
      <TermsAndConditions />
    </>
  );
};

export default page;
