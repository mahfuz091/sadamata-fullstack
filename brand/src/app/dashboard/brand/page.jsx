// ✅ SERVER page: S3 signed URL add করে পাঠাও (mockup products এর জন্যও)
// ⚠️ styling change নাই, শুধু data enrich

import { getMockupsWithProducts } from "@/app/actions/mockup/mockups.actions";
import { auth } from "@/auth";
import DashBrand from "@/components/DashBrand/DashBrand";
import { getPrivateUrl } from "@/lib/s3";
import { prisma } from "@/lib/prisma"; // ✅ তুমি prisma use করছো, import লাগবে

const SIGN_EXPIRES = 60 * 60; // 1 hour

async function attachProductPreviewUrls(mockups) {
  return Promise.all(
    (mockups || []).map(async (m) => {
      const products = await Promise.all(
        (m.products || []).map(async (p) => {
          // তোমার client code অনুযায়ী: item.variant.frontImg
          const key = p?.variant?.frontImg || p?.previewImg || p?.frontDesign || null;

          return {
            ...p,
            previewUrl: key ? await getPrivateUrl(key, SIGN_EXPIRES) : null,
          };
        })
      );

      return { ...m, products };
    })
  );
}

const page = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  const data = await getMockupsWithProducts(userId);

  // ✅ profile image signed
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      merchantProfile: true,
      brand: true,
      addresses: true,
      profileImage: true,
    },
  });

  const profileImageUrl = user?.profileImage
    ? await getPrivateUrl(user.profileImage, SIGN_EXPIRES)
    : null;

  const brandBannerUrl = user?.brand?.bannerImage
    ? await getPrivateUrl(user.brand.bannerImage, SIGN_EXPIRES)
    : null;

  // ✅ mockup products signed
  const signedMockups = await attachProductPreviewUrls(data.mockups);

  return (
    <DashBrand
      data={signedMockups}
      brandName={data.brandName}
      profileImageUrl={profileImageUrl}
      brand={user?.brand}
      brandBannerUrl={brandBannerUrl}
    />
  );
};

export default page;
