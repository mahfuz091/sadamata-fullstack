import { getAllBrands } from "@/app/actions/brand/brand.actions";
import { getAllMockups } from "@/app/actions/mockup/mockup.actions";
import { auth } from "@/auth";
import AddDesignFitAdmin from "@/components/AddDesign/AddDesignFitAdmin";

import AddDesignFitNew from "@/components/AddDesign/AddDesignFitNew";
import AddDesignFitNew2 from "@/components/AddDesign/AddDesignFitNew2";
import AddDesignFitNewN from "@/components/AddDesign/AddDesignFitNewN";
import DesignAdd from "@/components/DesignAdd";
import { prisma } from "@/lib/prisma";

import React from "react";

const page = async () => {
  const brands = await getAllBrands();
  const allMockup = await getAllMockups();
  const session = await auth();
  const currentUserId = session?.user.id;
  // const user = await prisma.user.findUnique({
  //   where: {
  //     id: currentUserId,
  //   },
  //   select: {
  //     name: true,
  //     merchantProfile: true, // must match your relation field name in schema
  //     CommissionSetting: { where: { isActive: true } , select:{ brandCommissionPct: true, merchantCommissionPct: true, brandSelectedMerchantPct: true }} },
  //   },
  // });
  // console.log(brands, "mockup");
  const user = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: {
      name: true,
      merchantProfile: true,
      CommissionSetting: {
        where: { isActive: true },
        select: {
          brandCommissionPct: true,
          merchantCommissionPct: true,
          brandSelectedMerchantPct: true,
        },
      },
    },
  });

  console.log("brands", brands);
  

  return (
    <AddDesignFitAdmin
      allMockup={allMockup}
      currentUserId={currentUserId}
      brands={brands}
      user={user}
    />
    // <DesignAdd
    //   allMockup={allMockup}
    //   currentUserId={currentUserId}
    //   brands={brands}
    //   user={user}
    // />
  );
};

export default page;
