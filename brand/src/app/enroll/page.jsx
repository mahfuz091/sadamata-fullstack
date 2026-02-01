import Layout from '@/components/Layout/Layout';
import React, { Suspense } from 'react';
import BrandEnrollStep2 from './_components/BrandEnrollStep2';

const page = () => {
    return (
        <Layout>
            <Suspense>

            <BrandEnrollStep2 />
            </Suspense>
        </Layout>
    );
};

export default page;