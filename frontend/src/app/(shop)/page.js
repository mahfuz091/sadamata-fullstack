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
import RecentlyViewedProducts from "@/components/RecentlyViewedProducts/RecentlyViewedProducts";
import {
  getNewArrivals,
  getProductsByCategorySlug,
} from "@/app/actions/product/product.actions";
import { auth } from "@/auth";
import { getBrandsByCategorySlug } from "@/app/actions/brand/brand.actions";

export default async function Home() {
  // const newA  =  await getNewArrivals()
  const [musicProducts, movieProducts, natokProducts] = await Promise.all([
    getProductsByCategorySlug({ slug: "music" }),
    getProductsByCategorySlug({ slug: "movies" }),
    getProductsByCategorySlug({ slug: "drama" }), // or "natok"
  ]);
  const [musicBrands, movieBrands, natokBrands] = await Promise.all([
    getBrandsByCategorySlug({ slug: "music" }),
    getBrandsByCategorySlug({ slug: "movies" }),
    getBrandsByCategorySlug({ slug: "drama" }), // or "natok"
  ]);
  // console.log(musicProducts, movieProducts, natokProducts, "music Products");
  console.log(musicBrands, movieBrands, natokBrands, "music Brands");

  const session = await auth();
  // console.log(session, "session");
  return (
    <>
      <Hero />
      <BrandInfo />
      <PopularProduct />
      <FeatureProduct />
      <TopMusicBrand brands={musicBrands?.items} />
      <TopMusicBrandTshirt products={musicProducts?.items} />
      <TopMovieBrand brands={movieBrands?.items} />
      <TopMovieBrandTshirt products={movieProducts?.items} />
      <TopNatokBrand brands={natokBrands?.items} />
      <TopNatokBrandTshirt products={natokProducts?.items} />
      <RecentlyViewedProducts />
    </>
  );
}
