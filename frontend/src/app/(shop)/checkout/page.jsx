import { auth } from "@/auth";
import CheckoutPage from "@/components/CheckoutPage/CheckoutPage";
import CheckoutPageTwo from "@/components/CheckoutPage/CheckoutPageTwo";
import React from "react";

const page = async () => {
  const session = await auth();
  const user = session?.user;
  return (
    <>
      {/* <CheckoutPage user={user}/> */}
      <CheckoutPageTwo user={user} />
    </>
  );
};

export default page;
