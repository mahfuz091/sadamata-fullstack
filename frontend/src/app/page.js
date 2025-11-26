
import Layout from "@/components/Layout/Layout";
import Hero from "@/components/Hero/Hero";
import BrandInfo from "@/components/BrandInfo/BrandInfo";
import PopularProduct from "@/components/PopularProduct/PopularProduct";
import FeatureProduct from "@/components/FeatureProduct/FeatureProduct";
import TopMusicBrand from "@/components/TopMusicBrand/TopMusicBrand";
import TopMusicBrandTshirt from "@/components/TopMusicBrandTshirt/TopMusicBrandTshirt";
import TopMovieBrand from "@/components/TopMovieBrand/TopMovieBrand";
import TopNatokBrand from "@/components/TopNatokBrand/TopNatokBrand";
import TopMovieBrandTshirt from "@/components/TopMovieBrandTshirt/TopMovieBrandTshirt";
import TopNatokBrandTshirt from "@/components/TopNatokBrandTshirt/TopNatokBrandTshirt";
import { getNewArrivals } from "./actions/product/product.actions";
import { auth } from "@/auth";

export default async function Home() {
  // const newA  =  await getNewArrivals()
const session = await auth();
  console.log(session, "session");
  return (
    <Layout session={session}>
      <Hero />
      <BrandInfo />
      <PopularProduct />
      <FeatureProduct />
      <TopMusicBrand />
      <TopMusicBrandTshirt />
      <TopMovieBrand />
      <TopMovieBrandTshirt />
      <TopNatokBrand />
      <TopNatokBrandTshirt />
    </Layout>
  );
}
