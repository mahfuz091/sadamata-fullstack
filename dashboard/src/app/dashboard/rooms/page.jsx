export const dynamic = "force-dynamic"; // ⬅ IMPORTANT FIX
import { getAllHotels } from "@/app/actions/hotel/hotel.actions";
import RoomsTable from "@/components/RoomTable/RoomTable";
import Link from "next/link";
import React from "react";
export const metadata = {
  title: "Rooms",
};
const page = async () => {
  const hotels = await getAllHotels(60);
  console.log(hotels);
  return (
    <div className=''>
      <div className='flex flex-1 flex-col'>
        <div className='@container/main flex flex-1 flex-col gap-2'>
          <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
            <div className='px-4 lg:px-6'>
              {/* <ChartAreaInteractive /> */}
              <div className='flex justify-end'>
                <Link
                  href='/dashboard/rooms/add-room'
                  className='text-[#fff] transition rounded-[10px] text-[16px] bg-[#0B7956] py-[10px] px-[25px] hover:bg-[#000]'
                >
                  Add Room
                </Link>
              </div>
              <RoomsTable hotels={hotels} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
