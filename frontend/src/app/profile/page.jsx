import { auth } from "@/auth";
import BrandProfile from "@/components/BrandProfile/BrandProfile";
import Layout from "@/components/Layout/Layout";
import Profile from "@/components/Profile/Profile";
import RelatedProducts from "@/components/RelatedProducts/RelatedProducts";
import prisma from "@/lib/prisma";
import React from "react";
import { GetCountries } from "react-country-state-city";

const page =async () => {
  const session = await auth();
    const countries = await GetCountries();
    const userId = session?.user.id;
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id : true,
            name: true,
            email : true,
            phone : true,
            userprofile: true, // must match your relation field name in schema
            addresses: true
        },
    })
  return (
    <Layout>
<Profile user={user} countries={countries}/>
    </Layout>
  );
};

export default page;
