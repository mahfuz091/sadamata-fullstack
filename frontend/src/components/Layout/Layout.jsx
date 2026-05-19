import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import HeaderCloned from "../Header/HeaderCloned";
import prisma from "@/lib/prisma";
import { getPrivateUrl } from "@/lib/s3";

const Layout = async ({ children, session }) => {
  const [categories, profileImageUrl] = await Promise.all([
    prisma.productCategory.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    session?.user?.profileImage
      ? getPrivateUrl(session.user.profileImage, 86400).catch(() => null)
      : Promise.resolve(null),
  ]);

  return (
    <>
      <Header session={session} categories={categories} profileImageUrl={profileImageUrl} />
      <HeaderCloned session={session} categories={categories} profileImageUrl={profileImageUrl} />
      {children}
      <Footer session={session} />
    </>
  );
};

export default Layout;
