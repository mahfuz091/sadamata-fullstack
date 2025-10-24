import { getAllBrands } from "@/app/actions/brand/brand.actions";
import { getAllMockups } from "@/app/actions/mockup/mockup.actions";
import { auth } from "@/auth";

import AddDesignFitNew from "@/components/AddDesign/AddDesignFitNew";


import React from "react";

const page =async () => {
  const brands = await getAllBrands();
  const allMockup = await getAllMockups();
  const session = await auth();
  const currentUserId = session?.user.id;
 const user = await prisma.user.findUnique({
  where: {
    id: currentUserId,
  },
  select: {
    name: true,
    merchantProfile: true, // must match your relation field name in schema
  },
});
console.log(brands, "mockup");
  return <AddDesignFitNew allMockup={allMockup} currentUserId={currentUserId} brands={brands}  user={user}/>;
};

export default page;
