import { getProductsByProductId } from '@/app/actions/product/product.actions';
import ProductDetails from '@/components/ProductDetails/ProductDetails';
import ProductDetails2 from '@/components/ProductDetails/ProductDetails2';
import React from 'react';

const page = async({ params }) => {
    const { id } = await params
    console.log(id);
    const product = await getProductsByProductId(id);
    console.log(
        product
    );
    
    
    return (
    //    <ProductDetails product={product}/>
       <ProductDetails2 product={product?.item}/>
    );
};

export default page;