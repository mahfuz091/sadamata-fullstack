import { auth } from "@/auth";
import Layout from "@/components/Layout/Layout";
import VendorLogin from "@/components/VendorLogin/VendorLogin";
import { redirect } from "next/navigation";
import React from "react";

const VendorLoginPage = async () => {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }
  return (
    <Layout>
      <VendorLogin />
    </Layout>
  );
};

export default VendorLoginPage;
