import AddHotel from "@/components/AddHotel/AddHotel";
import BookingTable from "@/components/BookingTable/BookingTable";
import React from "react";
export const metadata = {
  title: "Bookings",
};
const page = () => {
  return (
    <div className=''>
      <div className='flex flex-1 flex-col'>
        <div className='@container/main flex flex-1 flex-col gap-2'>
          <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
            <div className='px-4 lg:px-6'>
              {/* <ChartAreaInteractive /> */}
              <BookingTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
