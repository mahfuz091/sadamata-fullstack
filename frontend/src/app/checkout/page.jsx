import { auth } from '@/auth';
import CheckoutPage from '@/components/CheckoutPage/CheckoutPage';
import CheckoutPageTwo from '@/components/CheckoutPage/CheckoutPageTwo';
import Layout from '@/components/Layout/Layout';
import React from 'react';

const page = async() => {
    const session = await auth();
        const user = session?.user;
    return (
        <Layout>
            {/* <CheckoutPage user={user}/> */}
            <CheckoutPageTwo user={user}/>
        </Layout>
    );
};

export default page;