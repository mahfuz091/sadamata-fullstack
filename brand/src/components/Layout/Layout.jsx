import React from "react";
import Footer from "../Footer/Footer";
import HeaderTwo from "../HeaderTwo/HeaderTwo";

const Layout = ({ children, session  }) => {
  return (
    <>
      <HeaderTwo  session={session}/>
      {children}
      <Footer />
    </>
  );
};

export default Layout;
