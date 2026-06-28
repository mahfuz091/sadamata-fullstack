import { auth } from "@/auth";
import CartPage from "@/components/CartPage/CartPage";
import FavoritePage from "@/components/FavoritePage/FavoritePage";

import React from "react";

const page = () => {
  const session = auth();
  const user = session?.user;
  return (
    <>
      <FavoritePage user={user} />
    </>
  );
};

export default page;
