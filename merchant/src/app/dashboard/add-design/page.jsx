import { getAllBrands } from "@/app/actions/brand/brand.actions";
import { getAllMockups } from "@/app/actions/mockup/mockup.actions";
import { auth } from "@/auth";
import AddDesign from "@/components/AddDesign/AddDesign";
import AddDesign3 from "@/components/AddDesign/AddDesign3";
import AddDesignC from "@/components/AddDesign/AddDesignC";
import AddDesignFit from "@/components/AddDesign/AddDesignFit";
import AddDesignFitNew from "@/components/AddDesign/AddDesignFitNew";
import AddDesignFunction from "@/components/AddDesign/AddDesignFunction";
import AddDesignNew from "@/components/AddDesign/AddDesignNew";
import Layout from "@/components/Layout/Layout";
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
