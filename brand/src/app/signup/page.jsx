import Layout from "@/components/Layout/Layout";
import VendorRegister from "@/components/VendorRegister/VendorRegister";
import VendorSignup from "@/components/VendorSignup/VendorSignup";
import React, { Suspense } from "react";
import { getAllCategories } from "../actions/brandCategoryActions";
import VendorSignupStep1 from "./_components/VendorSignupStep1";

const VendorSignUpPage = async() => {

  const brandCategories = await getAllCategories();
 
  
  return (
    <Layout>
      {/* <VendorSignup /> */}
      {/* <VendorRegister brandCategories={brandCategories}/> */}
      <Suspense>

      <VendorSignupStep1/>
      </Suspense>
    </Layout>
  );
};

export default VendorSignUpPage;
