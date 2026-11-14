import { auth } from "@/auth";
import CheckoutPage from "@/components/CheckoutPage/CheckoutPage";
import CheckoutPageTwo from "@/components/CheckoutPage/CheckoutPageTwo";
import { getPartialPaymentRule } from "@/lib/partialPaymentRule";
import { resolvePartialPercent } from "@/lib/partialPayment";
import React from "react";

const page = async () => {
  const session = await auth();
  const user = session?.user;

  // The admin-configured "pay now" percentage. Null hides the partial option.
  const rule = await getPartialPaymentRule();
  const partialPaymentPercent = resolvePartialPercent(rule);

  return (
    <>
      {/* <CheckoutPage user={user}/> */}
      <CheckoutPageTwo
        user={user}
        partialPaymentPercent={partialPaymentPercent}
      />
    </>
  );
};

export default page;
