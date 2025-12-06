"use client";

import { getPressById } from "@/app/actions/press/press.actions";
import EditPress from "@/components/EditPress/EditPress";

import { PressContext } from "@/context/PressContext";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const Page = () => {
  const { id } = useParams();
  const { pressData, setPressData } = useContext(PressContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      const result = await getPressById(id);
      if (result.success) {
        setPressData(result.post);
      } else {
        alert(result.msg);
      }
      setLoading(false);
    };

    fetchBlog();
  }, [id, setPressData]);
  console.log("pressData rem", pressData);

  if (loading) return <div>Loading...</div>;

  return (
    <div className='flex  gap-4 py-4 md:gap-6 md:py-6 max-w-3xl mx-auto w-full'>
      <div className='w-full'>
        <EditPress id={id} />
      </div>
    </div>
  );
};

export default Page;
