import { getProducts } from "@/app/actions/product/product.actions";
import ProductsTable from "@/components/ProductsTable/ProductsTable";

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const page = Number(params?.page || 1);
  const pageSize = Number(params?.pageSize || 10);

  const merchantId = params?.merchantId || null;
  const brandId = params?.brandId || null;
  const q = params?.q || "";

  const res = await getProducts({ page, pageSize, merchantId, brandId, q });

  if (!res?.success) return <div>Failed to load products</div>;

  return (
    <div className='px-4 lg:px-6'>
      <ProductsTable
        initial={res.data.items}
        meta={res.data.meta}
        merchants={res.data.merchants}
        brands={res.data.brands}
        filters={{ merchantId, brandId, q }}
      />
    </div>
  );
}
