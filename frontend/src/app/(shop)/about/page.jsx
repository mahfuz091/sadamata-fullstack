// app/about/page.jsx

import { auth } from "@/auth";
import AboutUs from "@/components/AboutUs/AboutUs";

export default async function Page() {
  const session = await auth();
  return (
    <>
      <AboutUs />
    </>
  );
}
