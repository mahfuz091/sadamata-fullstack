import Layout from "@/components/Layout/Layout";
import VendorLogin from "@/components/VendorLogin/VendorLogin";
import React from "react";

export const metadata = {
  title: "Login",
  description: "Sadamata Brand",
}

const VendorLoginPage = () => {
  return (
    <Layout>
      <VendorLogin />
    </Layout>
  );
};

export default VendorLoginPage;
