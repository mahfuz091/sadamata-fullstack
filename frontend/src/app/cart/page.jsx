import { auth } from '@/auth';
import CartPage from '@/components/CartPage/CartPage';
import Layout from '@/components/Layout/Layout';
import RelatedProducts from '@/components/RelatedProducts/RelatedProducts';
import React from 'react';

const page = () => {
    const session = auth();
    const user = session?.user;
    return (
        <Layout>
            <CartPage user={user}/>
            <RelatedProducts/>
            <div style={{height: '100px'}}></div>
        </Layout>
    );
};

export default page;