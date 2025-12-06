// import HotelUpdate from "@/components/HotelUpdate/HotelUpdate";
import FeedbackUpdate from "@/components/FeedbackUpdate/FeedbackUpdate";
import RoomUpdate from "@/components/RoomUpdate/RoomUpdate";
import React from "react";

const page = () => {
  return (
    <div className=''>
      <div className='flex flex-1 flex-col'>
        <div className='@container/main flex flex-1 flex-col gap-2'>
          <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
            <div className='px-4 lg:px-6'>
              <FeedbackUpdate />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
