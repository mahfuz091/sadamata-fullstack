import Layout from "@/components/Layout/Layout";
import VendorRegister from "@/components/VendorRegister/VendorRegister";
import VendorSignup from "@/components/VendorSignup/VendorSignup";
import React from "react";
import { getAllCategories } from "../actions/brandCategoryActions";

const VendorSignUpPage = async() => {

  const brandCategories = await getAllCategories();
 
  
  return (
    <Layout>
      {/* <VendorSignup /> */}
      <VendorRegister brandCategories={brandCategories}/>
    </Layout>
  );
};

export default VendorSignUpPage;
