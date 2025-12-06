// app/dashboard/mockups/page.jsx

import { getAllMockups } from "@/app/actions/mockup/mockup.actions";
import MockupsTable from "@/components/MockupsTable/MockupsTable";
import Link from "next/link";

export default async function MockupsPage() {
  const mockups = await getAllMockups();

  return (
    <div className=''>
      <div className='flex flex-1 flex-col'>
        <div className='@container/main flex flex-1 flex-col gap-2'>
          <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
            <div className='px-4 lg:px-6'>
              {/* <ChartAreaInteractive /> */}
              <div className='flex justify-end'>
                <Link
                  href='/dashboard/mockups/add-mockup'
                  className='text-[#fff] transition rounded-[10px] text-[16px] bg-[#f37927] py-[10px] px-[25px] hover:bg-[#000]'
                >
                  Add Mockup
                </Link>
              </div>

              <MockupsTable mockups={mockups} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
