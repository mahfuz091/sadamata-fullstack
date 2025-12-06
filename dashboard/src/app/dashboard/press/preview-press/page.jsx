// "use client";

import React from "react";

import { auth } from "@/auth";
import SeePress from "@/components/PreviewPress/PreviewPress";
import CategoryAdd from "@/components/PreviewPress/CategoryAdd";

const PreviewPressContainer = async () => {
  const session = await auth();
  console.log(session, "session");
  const userId = session?.user?.id;
  return (
    <div className='max-w-6xl mx-auto py-8 flex  gap-8'>
      <div className='w-1/2'>
        <SeePress userId={userId} />
      </div>
      <div className='sticky top-9 w-1/2 self-start'>
        <CategoryAdd />
      </div>
    </div>
  );
};

export default PreviewPressContainer;
