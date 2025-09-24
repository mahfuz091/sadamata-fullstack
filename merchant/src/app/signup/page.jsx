import Layout from "@/components/Layout/Layout";
import VendorRegister from "@/components/VendorRegister/VendorRegister";
import VendorSignup from "@/components/VendorSignup/VendorSignup";
import React from "react";

const VendorSignUpPage = () => {
  return (
    <Layout>
      {/* <VendorSignup /> */}
      <VendorRegister/>
    </Layout>
  );
};

export default VendorSignUpPage;
