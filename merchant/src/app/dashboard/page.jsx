import { auth } from "@/auth";
import DashboardMain from "@/components/DashboardMain/DashboardMain";
import Layout from "@/components/Layout/Layout";
import React from "react";

const page = async () => {
  const session = await auth(); // Fetch session data here
  return <DashboardMain />;
};

export default page;
