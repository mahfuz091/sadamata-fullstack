import React from "react";
import Footer from "../Footer/Footer";
import HeaderTwo from "../HeaderTwo/HeaderTwo";

const Layout = ({ children }) => {
  return (
    <>
      <HeaderTwo />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
