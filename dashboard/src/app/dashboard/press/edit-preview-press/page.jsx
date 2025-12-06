// "use client";

import React from "react";

import { auth } from "@/auth";

import EditSeePress from "@/components/EditPreviewPress/EditPreviewPress";
import EditCategoryAddPress from "@/components/EditPreviewPress/EditCategoryAddPress";

const PreviewPressContainer = async () => {
  const session = await auth();
  // console.log(session, "session");
  const userId = session?.user?.id;
  return (
    <div className='max-w-6xl mx-auto py-8 flex  gap-8'>
      <div className='w-1/2'>
        <EditSeePress userId={userId} />
      </div>
      <div className='sticky top-9 w-1/2 self-start'>
        <EditCategoryAddPress />
      </div>
    </div>
  );
};

export default PreviewPressContainer;
