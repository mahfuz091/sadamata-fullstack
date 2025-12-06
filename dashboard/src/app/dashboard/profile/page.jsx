import { auth } from "@/auth";
import ProfileContent from "@/components/profile-content";
import ProfileHeader from "@/components/profile-header";
import { prisma } from "@/lib/prisma";
export const metadata = {
  title: "Profile",
};
export default async function Page() {
  const session = await auth();

  // Fetch fresh data from DB instead of using session.user directly
  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email },
    select: { id: true, name: true, email: true, profileImage: true },
  });
  return (
    <div className='container mx-auto space-y-6 px-4 py-10'>
      <ProfileHeader user={user} />
      <ProfileContent user={user} />
    </div>
  );
}
