import Layout from '@/components/Layout/Layout';
import SuccessPage from '@/components/SuccessPage/SuccessPage';
import React from 'react';

const page = ({ searchParams }) => {
     const tran = searchParams.tran;
     console.log("tran:", tran);
     
    return (
        <Layout><SuccessPage/></Layout>
    );
};

export default page;