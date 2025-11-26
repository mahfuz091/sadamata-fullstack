import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Layout = ({ children, session }) => {
  return (
    <>
      <Header session={session} />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
