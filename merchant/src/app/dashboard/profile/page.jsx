import { auth } from "@/auth";
import Profile from "@/components/Profile/Profile";
import { prisma } from "@/lib/prisma";
import { getPrivateUrl } from "@/lib/s3";
import { getSignedS3Url } from "@/lib/s3View";
import React from "react";
import { GetCountries } from "react-country-state-city";

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
  // console.log(user, 'user');

  const profileImageUrl = user?.profileImage
    ? await getPrivateUrl(user.profileImage)
    : null;

  return (
    <Profile
      user={user}
      countries={countries}
      profileImageUrl={profileImageUrl}
    />
  );
};

export default page;
