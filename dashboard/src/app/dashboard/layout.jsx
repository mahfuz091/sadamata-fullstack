import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
export const metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Sadamata",
  },
  description: "Sadamata Dashboard",
};
export default async function Page({ children }) {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email },
    select: { id: true, name: true, email: true, profileImage: true },
  });
  console.log(user, "user");

  return (
    <SidebarProvider className=' '>
      <AppSidebar variant='inset' user={user} />
      <SidebarInset>
        <SiteHeader />
        <div className='-mt-2'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
