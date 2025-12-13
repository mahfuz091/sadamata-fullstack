import { getOrders } from "@/app/actions/order/order.actions";
import OrdersTable from "@/components/OrdersTable/OrdersTable";
import React from "react";

const page = async () => {
  const orders = await getOrders(null, {});
  return (
    <div className=''>
      <div className='flex flex-1 flex-col'>
        <div className='@container/main flex flex-1 flex-col gap-2'>
          <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
            <div className='px-4 lg:px-6'>
              <OrdersTable initial={orders?.data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
