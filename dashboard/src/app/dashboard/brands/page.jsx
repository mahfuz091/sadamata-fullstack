import { brandList } from "@/app/actions/user/user.actions";
import BrandsTable from "@/components/BrandsTable/BrandsTable";
import UsersTable from "@/components/UsersTable/UsersTable";
import React from "react";
export const metadata = {
  title: "Brand",
};

const page = async () => {
  const users = await brandList();

  return (
    <div className=''>
      <div className='flex flex-1 flex-col'>
        <div className='@container/main flex flex-1 flex-col gap-2'>
          <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
            <div className='px-4 lg:px-6'>
              {/* <ChartAreaInteractive /> */}

              <div className='px-4 lg:px-6'>
                {/* <ChartAreaInteractive /> */}
                <BrandsTable initial={users} />
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
