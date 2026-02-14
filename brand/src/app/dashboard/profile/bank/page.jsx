import Bank from "@/components/Bank/Bank";
import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";
import React from "react";
import { GetCountries } from "react-country-state-city";
import { getPrivateUrl } from "@/lib/s3";

const page = async () => {
  const session = await auth();
  const countries = await GetCountries();
  const userId = session?.user.id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      brand: true, // must match your relation field name in schema
      addresses: true,
      profileImage: true,
    },
  });

    const profileImageUrl = user?.profileImage
      ? await getPrivateUrl(user.profileImage)
      : null;
  
  return (
    <>
      <Bank user={user} countries={countries} profileImageUrl={profileImageUrl} />
    </>
  );
};

export default page;
