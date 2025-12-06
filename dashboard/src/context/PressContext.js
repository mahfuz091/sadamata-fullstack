"use client";

import { createContext, useState } from "react";

export const PressContext = createContext();

export const PressProvider = ({ children }) => {
  const [pressData, setPressData] = useState({
    title: "",
    postSlug: "",
    bannerAltText: "",
    metaTitle: "",
    metaDescription: "",
    shortDesc: "",
    content: null,
    image: "/banner.png",
    // categoryId: "",
  });

  return (
    <PressContext.Provider value={{ pressData, setPressData }}>
      {children}
    </PressContext.Provider>
  );
};
