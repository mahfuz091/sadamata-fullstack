import { auth } from "@/auth";
import Layout from "@/components/Layout/Layout";
import { redirect } from "next/navigation";
import React from "react";

const layout = async ({ children }) => {
  const session = await auth(); // Fetch session data here
  console.log(session, "session in layout");

  if (!session?.user) {
    redirect("/login");
  }
  return <Layout session={session}>{children}</Layout>;
};

export default layout;
