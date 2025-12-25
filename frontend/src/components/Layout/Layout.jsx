import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import HeaderCloned from "../Header/HeaderCloned";
import prisma from "@/lib/prisma";

const Layout = async ({ children, session }) => {
  const categories = await prisma.productCategory.findMany();
  return (
    <>
      <Header session={session} categories={categories} />
      <HeaderCloned session={session} categories={categories} />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
