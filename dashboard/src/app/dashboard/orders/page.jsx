import OrdersTable from "@/components/OrdersTable/OrdersTable";
import { getOrders } from "@/app/actions/order/order.actions";

export default async function Page({ searchParams }) {
  // ✅ safe read (Next expects this shape)
  const params = await searchParams;
  const page = Number(params?.page ?? 1);
  const pageSize = Number(params?.pageSize ?? 10);

  const status = params?.status ?? null;
  const q = params?.q ?? "";
  const from = params?.from ?? null;
  const to = params?.to ?? null;

  const res = await getOrders(null, { page, pageSize, status, q, from, to });

  return (
    <div className='px-4 lg:px-6'>
      <OrdersTable
        initial={res?.data?.items || []}
        meta={res?.data?.meta}
        filters={{ status, q, from, to }}
      />
    </div>
  );
}
