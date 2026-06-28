import Header from "@/components/Header/Header";
import HeaderCloned from "@/components/Header/HeaderCloned";
import Footer from "@/components/Footer/Footer";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getPrivateUrl } from "@/lib/s3";

export default async function ShopLayout({ children }) {
  const session = await auth();
  const userId = session?.user?.id;

  const [categories, freshUser] = await Promise.all([
    prisma.productCategory.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    userId
      ? prisma.user.findUnique({
          where: { id: userId },
          select: { profileImage: true },
        })
      : Promise.resolve(null),
  ]);

  const profileImageUrl = freshUser?.profileImage
    ? await getPrivateUrl(freshUser.profileImage, 86400).catch(() => null)
    : null;

  return (
    <>
      <Header
        session={session}
        categories={categories}
        profileImageUrl={profileImageUrl}
      />
      <HeaderCloned
        session={session}
        categories={categories}
        profileImageUrl={profileImageUrl}
      />
      {children}
      <Footer session={session} />
    </>
  );
}
