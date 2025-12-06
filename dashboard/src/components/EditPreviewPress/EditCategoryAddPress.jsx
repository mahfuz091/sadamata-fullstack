"use client";

import React, { useContext, useEffect, useState } from "react";
import { blogCategoryList } from "@/app/actions/blog/blogCategory";
import { toast } from "sonner";
import { Spin } from "antd";
import { PressContext } from "@/context/PressContext";

const EditCategoryAddPress = () => {
  const { pressData, setPressData } = useContext(PressContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false); // loading state

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await blogCategoryList();
      if (res.success) {
        setCategories(res.blogCategory);
      } else {
        toast.error(res.msg || "Failed to fetch categories");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   fetchCategories();
  // }, []);

  // const handleCategoryToggle = (category) => {
  //   setPressData((prev) => {
  //     const exists = prev.categories.some((c) => c.id === category.id);
  //     if (exists) {
  //       return {
  //         ...prev,
  //         categories: prev.categories.filter((c) => c.id !== category.id),
  //       };
  //     }
  //     return { ...prev, categories: [...prev.categories, category] };
  //   });
  // };
  const handleCategorySelect = (categoryId) => {
    setPressData((prev) => ({
      ...prev,
      categoryId: prev.categoryId === categoryId ? "" : categoryId, // toggle selection
    }));
  };

  const MAX_CHAR = 200;
  const shortDesc = pressData.shortDesc || "";
  const remaining = MAX_CHAR - shortDesc.length;

  const handleDescChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHAR) {
      setPressData((prev) => ({ ...prev, shortDesc: value }));
    }
  };

  return (
    <div>
      <div className='bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md transition-colors duration-300'>
        {/* <p className='text-gray-800 mb-2 text-lg'>Select Categories</p> */}

        <div className='mt-5 '>
          <textarea
            placeholder='Short Description'
            rows={4}
            value={shortDesc}
            onChange={handleDescChange}
            className='w-full resize-none mt-4 text-gray-800 placeholder-gray-800 opacity-90 border-b border-gray-400 bg-transparent pb-2 outline-none'
          />
          <div
            className={`text-sm mt-1 flex justify-end ${
              remaining === 0 ? "text-red-500" : "text-gray-400"
            }`}
          >
            {remaining} characters remaining
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryAddPress;
