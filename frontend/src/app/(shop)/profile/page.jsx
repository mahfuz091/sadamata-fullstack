import { auth } from "@/auth";
import BrandProfile from "@/components/BrandProfile/BrandProfile";
import Profile from "@/components/Profile/Profile";
import RelatedProducts from "@/components/RelatedProducts/RelatedProducts";
import prisma from "@/lib/prisma";
import { getPrivateUrl } from "@/lib/s3";
import { redirect } from "next/navigation";
import React from "react";
import { GetCountries } from "react-country-state-city";

const page = async () => {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  const countries = await GetCountries();
  const userId = session?.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      userProfile: true,
      addresses: true,
      profileImage: true,
    },
  });

  const profileImageUrl = user?.profileImage
    ? await getPrivateUrl(user.profileImage, 86400).catch(() => null)
    : null;
  return (
    <>
      <Profile user={user} countries={countries} profileImageUrl={profileImageUrl} />
    </>
  );
};

export default page;
