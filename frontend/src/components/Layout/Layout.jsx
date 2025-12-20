import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import HeaderCloned from "../Header/HeaderCloned";

const Layout = ({ children, session }) => {
  return (
    <>
      <Header session={session} />
      <HeaderCloned session={session} />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
