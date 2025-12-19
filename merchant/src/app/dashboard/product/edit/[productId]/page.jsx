import { getAllBrands } from "@/app/actions/brand/brand.actions";
import { getAllMockups } from "@/app/actions/mockup/mockup.actions";
import { getProductById } from "@/app/actions/product/product.actions";
import DesignFitAdmin from "@/components/AddDesign/DesignFitAdmin";
import EditProductDesign from "@/components/AddDesign/EditProductDesign";

export default async function EditProductPage({ params }) {
  const { productId } = await params;
  const brands = await getAllBrands();
  const allMockup = await getAllMockups();

  console.log("ID:", productId);
  const product = await getProductById(productId);

  if (!productId) {
    return <div>Invalid product ID</div>;
  }

  return (
    <EditProductDesign
      mode='edit'
      product={product}
      allMockup={[product.Mockup]}
      currentUserId={product.userId}
      brands={brands}
      user={product.User}
    />
  );
}
