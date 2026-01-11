import { auth } from "@/auth";
import Layout from "@/components/Layout/Layout";
import { getPrivateUrl } from "@/lib/s3";
import { redirect } from "next/navigation";
import React from "react";

const layout = async ({ children }) => {
  const session = await auth(); // Fetch session data here
  // console.log(session, "session in layout");
  const profileImageUrl = session?.user?.profileImage
    ? await getPrivateUrl(session.user.profileImage)
    : null;
  if (!session?.user) {
    redirect("/signin");
  }
  return (
    <Layout session={session} profileImageUrl={profileImageUrl}>
      {children}
    </Layout>
  );
};

export default layout;
