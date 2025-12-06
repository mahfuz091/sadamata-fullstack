import Image from "next/image";
import LoginPage from "./(auth)/login/page";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }
  return (
    <div>
      <LoginPage />
    </div>
  );
}
