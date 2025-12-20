import { auth } from "@/auth";
import CartPage from "@/components/CartPage/CartPage";
import FavoritePage from "@/components/FavoritePage/FavoritePage";
import Layout from "@/components/Layout/Layout";

import React from "react";

const page = () => {
  const session = auth();
  const user = session?.user;
  return (
    <Layout session={session}>
      <FavoritePage user={user} />
    </Layout>
  );
};

export default page;
