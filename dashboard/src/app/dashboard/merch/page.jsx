import { merchList } from "@/app/actions/user/user.actions";
import MerchTable from "@/components/MerchTable/MerchTable";
import React from "react";
export const metadata = {
  title: "Merchants",
};

const page = async () => {
  const users = await merchList();
  console.log(users, "merch");

  return (
    <div className=''>
      <div className='flex flex-1 flex-col'>
        <div className='@container/main flex flex-1 flex-col gap-2'>
          <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
            <div className='px-4 lg:px-6'>
              {/* <ChartAreaInteractive /> */}

              <div className='px-4 lg:px-6'>
                {/* <ChartAreaInteractive /> */}
                <MerchTable initial={users} />
              </div>
              {/* <HotelTable hotels={hotels} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
