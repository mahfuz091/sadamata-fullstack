import ProductDetails from '@/components/ProductDetails/ProductDetails';
import React from 'react';

const page = async({ params }) => {
    const { id } = await params
    console.log(id);
    
    return (
       <ProductDetails/>
    );
};

export default page;