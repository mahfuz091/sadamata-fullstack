import { auth } from "@/auth";
import CartPage from "@/components/CartPage/CartPage";
import RelatedProducts from "@/components/RelatedProducts/RelatedProducts";
import React from "react";

const page = async () => {
  const session = await auth();
  const user = session?.user;

  
  return (
    <>
      <CartPage user={user} />
      {/* <RelatedProducts /> */}

    </>
  );
};

export default page;
