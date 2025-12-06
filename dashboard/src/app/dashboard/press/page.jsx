export const dynamic = "force-dynamic"; // ⬅ IMPORTANT FIX
import { pressList } from "@/app/actions/press/press.actions";
import PressTable from "@/components/Dashboard/Press/Press";
import Link from "next/link";
// import SeeBlog from "@/components/PreviewBlog/PreviewBlog";
export const metadata = {
  title: "Press",
};
import React from "react";

const AddPressPage = async () => {
  const allPost = await pressList();
  console.log("allPost", allPost);
  return (
    <div className=''>
      <div className='flex flex-1 flex-col'>
        <div className='@container/main flex flex-1 flex-col gap-2'>
          <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
            <div className='px-4 lg:px-6'>
              {/* <ChartAreaInteractive /> */}
              <div className='flex justify-end'>
                <Link
                  href='/dashboard/press/add-press'
                  className='text-[#fff] transition rounded-[10px] text-[16px] bg-[#0B7956] py-[10px] px-[25px] hover:bg-[#000]'
                >
                  Add Press
                </Link>
              </div>
              <div className='px-4 lg:px-6'>
                {/* <ChartAreaInteractive /> */}
                <PressTable allPost={allPost} />
              </div>
              {/* <HotelTable hotels={hotels} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPressPage;
