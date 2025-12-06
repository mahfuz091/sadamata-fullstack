// app/(dashboard)/careers/page.tsx

import CareerTable from "@/components/CareerTable/CareerTable";
import Link from "next/link";
import React from "react";
export const metadata = {
  title: "Careers",
};
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAllCareers(limit = 100) {
  const res = await fetch(`${API_BASE}/api/v1/careers?limit=${limit}`, {
    cache: "no-store", // always fresh
  });
  return res.json();
}

const page = async () => {
  const careers = await getAllCareers(100);
  // backend may return array or { data, careers, items } — prefer array if present
  const list = Array.isArray(careers)
    ? careers
    : careers.careers ?? careers.data ?? careers.items ?? [];

  return (
    <div className=''>
      <div className='flex flex-1 flex-col'>
        <div className='@container/main flex flex-1 flex-col gap-2'>
          <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
            <div className='px-4 lg:px-6'>
              <div className='flex justify-end mb-4'>
                <Link
                  href='/dashboard/careers/add-career'
                  className='text-[#fff] transition rounded-[10px] text-[16px] bg-[#0B7956] py-[10px] px-[25px] hover:bg-[#000]'
                >
                  Add Role
                </Link>
              </div>

              <CareerTable careers={list} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
