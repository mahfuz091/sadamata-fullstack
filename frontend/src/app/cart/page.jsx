import { auth } from "@/auth";
import CartPage from "@/components/CartPage/CartPage";
import Layout from "@/components/Layout/Layout";
import RelatedProducts from "@/components/RelatedProducts/RelatedProducts";
import React from "react";

const page = async () => {
  const session = await auth();
  const user = session?.user;

  
  return (
    <Layout session={session}>
      <CartPage user={user} />
      {/* <RelatedProducts /> */}
  
    </Layout>
  );
};

export default page;
