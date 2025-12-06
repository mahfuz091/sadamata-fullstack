"use client";
import AddPress from "@/components/AddPress/AddPress";
// import SeeBlog from "@/components/PreviewBlog/PreviewBlog";
import React from "react";

const AddPressPage = () => {
  return (
    <div className='flex flex-1 flex-col '>
      <div className='flex flex-1 flex-col gap-2 '>
        <div className='flex  gap-4 py-4 md:gap-6 md:py-6 max-w-3xl mx-auto w-full'>
          <div className='w-full'>
            <AddPress />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPressPage;
