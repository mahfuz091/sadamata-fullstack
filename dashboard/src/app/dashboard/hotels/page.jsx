// import { getAllHotels } from "@/app/actions/hotel/hotel.actions";
import HotelTable from "@/components/Hotel/HotelTable";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Hotels",
};
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function getAllHotels(limit = 30) {
  const res = await fetch(`${API_BASE}/api/v1/hotels?limit=${limit}`, {
    cache: "no-store", // <= forces always fresh data
  });
  return res.json();
}
const page = async () => {
  const hotels = await getAllHotels(30);
  // console.log(hotels);

  return (
    <div className=''>
      <div className='flex flex-1 flex-col'>
        <div className='@container/main flex flex-1 flex-col gap-2'>
          <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
            <div className='px-4 lg:px-6'>
              {/* <ChartAreaInteractive /> */}
              <div className='flex justify-end'>
                <Link
                  href='/dashboard/hotels/add-hotel'
                  className='text-[#fff] transition rounded-[10px] text-[16px] bg-[#0B7956] py-[10px] px-[25px] hover:bg-[#000]'
                >
                  Add Hotel
                </Link>
              </div>

              <HotelTable hotels={hotels} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
