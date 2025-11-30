import React from "react";
import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";

import { GetCountries } from "react-country-state-city";
import ChangePassword from "@/components/ChangePassword/ChangePassword";
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
      merchantProfile: true, // must match your relation field name in schema
      addresses: true,
      profileImage: true,
    },
  });
  return (
    <>
      <ChangePassword user={user} countries={countries} />
    </>
  );
};

export default page;
