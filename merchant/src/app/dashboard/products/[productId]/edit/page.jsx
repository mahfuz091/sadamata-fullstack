// app/dashboard/products/[id]/edit/page.jsx

import { getProductById } from "@/app/actions/product/product.actions";
import EditProductDesign from "@/components/AddDesign/EditProductDesign";

// export default async function EditProductPage({ params }) {
//   const { productId } = params;

//   console.log("ID:", productId);

//   if (!productId) {
//     return <div>Invalid product ID</div>;
//   }

//   return <p>{productId}</p>;
// }
export default async function EditProductPage(props) {
  console.log("PROPS:", props);

  return (
    <pre style={{ whiteSpace: "pre-wrap" }}>
      {JSON.stringify(props, null, 2)}
    </pre>
  );
}
