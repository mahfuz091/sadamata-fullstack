import AboutCta from "@/components/AboutCta/AboutCta";
import ContentCreator from "@/components/ContentCreator/ContentCreator";
import DoesWork from "@/components/DoesWork/DoesWork";
import Faq from "@/components/Faq/Faq";
import FeatureArea from "@/components/FeatureArea/FeatureArea";
import Layout from "@/components/Layout/Layout";
import RecurringProduct from "@/components/RecurringProduct/RecurringProduct";
export default function Home() {
  return (
    <Layout>
      <ContentCreator />
      <FeatureArea />
      <DoesWork />
      <AboutCta />
      <RecurringProduct />
      <Faq />
    </Layout>
  );
}
