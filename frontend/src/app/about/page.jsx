// app/about/page.jsx

import { auth } from "@/auth";
import AboutUs from "@/components/AboutUs/AboutUs";
import Layout from "@/components/Layout/Layout";

export default async function Page() {
  const session = await auth();
  return (
    <Layout session={session}>
      <AboutUs />
    </Layout>
  );
}
