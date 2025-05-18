import CartPage from '@/components/CartPage/CartPage';
import Layout from '@/components/Layout/Layout';
import RelatedProducts from '@/components/RelatedProducts/RelatedProducts';
import React from 'react';

const page = () => {
    return (
        <Layout>
            <CartPage/>
            <RelatedProducts/>
            <div style={{height: '100px'}}></div>
        </Layout>
    );
};

export default page;