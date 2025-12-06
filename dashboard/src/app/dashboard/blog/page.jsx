// app/(dashboard)/careers/page.tsx
export const dynamic = "force-dynamic"; // ⬅ IMPORTANT FIX
import { postList } from "@/app/actions/blog/blog.actions";
import BlogTable from "@/components/BlogTable/BlogTable";

import Link from "next/link";
import React from "react";
export const metadata = {
  title: "Meetings",
};

const page = async () => {
  const list = await postList(30);

  return (
    <div className=''>
      <div className='flex flex-1 flex-col'>
        <div className='@container/main flex flex-1 flex-col gap-2'>
          <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
            <div className='px-4 lg:px-6'>
              <div className='flex justify-end mb-4'>
                <Link
                  href='/dashboard/blog/add-blog'
                  className='text-[#fff] transition rounded-[10px] text-[16px] bg-[#0B7956] py-[10px] px-[25px] hover:bg-[#000]'
                >
                  Add Meetings
                </Link>
              </div>

              <BlogTable allPost={list} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
