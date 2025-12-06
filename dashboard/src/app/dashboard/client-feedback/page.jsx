import ClientFeedbackTable from "@/components/FeedbackTable/FeedbackTable";

import React from "react";
export const metadata = {
  title: "Client Feedback",
};
const page = async () => {
  return (
    <div className=''>
      <div className='flex flex-1 flex-col'>
        <div className='@container/main flex flex-1 flex-col gap-2'>
          <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
            <div className='px-4 lg:px-6'>
              {/* <ChartAreaInteractive /> */}
              {/* <div className='flex justify-end'>
                <Link
                  href='/dashboard/client-feedback/add-feedback'
                  className='text-[#fff] transition rounded-[10px] text-[16px] bg-[#0B7956] py-[10px] px-[25px] hover:bg-[#000]'
                >
                  Add Feedback
                </Link>
              </div> */}
              <ClientFeedbackTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
