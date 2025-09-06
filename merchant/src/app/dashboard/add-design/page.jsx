import { getAllMockups } from "@/app/actions/mockup/mockup.actions";
import AddDesign from "@/components/AddDesign/AddDesign";
import AddDesign3 from "@/components/AddDesign/AddDesign3";
import AddDesignC from "@/components/AddDesign/AddDesignC";
import AddDesignFit from "@/components/AddDesign/AddDesignFit";
import AddDesignFunction from "@/components/AddDesign/AddDesignFunction";
import AddDesignNew from "@/components/AddDesign/AddDesignNew";
import Layout from "@/components/Layout/Layout";
import React from "react";

const page =async () => {
  const allMockup = await getAllMockups();
console.log(allMockup, "mockup");
  return <AddDesignFit allMockup={allMockup}/>;
};

export default page;
