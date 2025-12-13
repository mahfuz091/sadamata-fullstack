import { getProducts } from "@/app/actions/product/product.actions";
import ProductsTable from "@/components/ProductsTable/ProductsTable";

export default async function ProductsPage() {
  const res = await getProducts();
  console.log(res);

  if (!res?.success) {
    return <div>Failed to load products</div>;
  }

  return (
    <div className=''>
      <div className='flex flex-1 flex-col'>
        <div className='@container/main flex flex-1 flex-col gap-2'>
          <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
            <div className='px-4 lg:px-6'>
              <ProductsTable initial={res.data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
