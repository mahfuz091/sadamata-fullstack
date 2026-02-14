import { getMockupsWithProducts } from "@/app/actions/mockup/mockups.actions";
import { auth } from "@/auth";
import DashBrand from "@/components/DashBrand/DashBrand";
import Layout from "@/components/Layout/Layout";
import { getPrivateUrl } from "@/lib/s3";
import React from "react";

const page = async() => {
  const session = await auth()
  const userId = session?.user?.id
  const data = await getMockupsWithProducts(userId);
  console.log(data, "data");
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
      brand: true,
      addresses: true,
      profileImage: true,
    },
  });
  // console.log(user, 'user');
  const profileImageUrl = user?.profileImage
    ? await getPrivateUrl(user.profileImage)
    : null;

  
  return (
    // <Layout>
      <DashBrand data={data.mockups} brandName = {data.brandName} profileImageUrl={profileImageUrl} />
    // </Layout>
  );
};

export default page;
