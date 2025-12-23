import React from "react";
import ProductCategoriesTable from "./_components/product-categories-table";
import { getAllProductCategories } from "@/app/actions/productCategory.actions";

const page = async () => {
  const allCategories = await getAllProductCategories();
  console.log(allCategories);

  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <ProductCategoriesTable initial={allCategories?.data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
