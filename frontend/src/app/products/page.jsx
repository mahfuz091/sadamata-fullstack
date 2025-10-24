import Layout from '@/components/Layout/Layout';
import ProductArea from '@/components/ProductArea/ProductArea';
import React from 'react';
import { searchProducts } from '../actions/search/search.actions';

const page = async({ searchParams }) => {
    const { slug = '', q = '' } = searchParams || {}
    const result = await searchProducts({ slug: String(slug), q: String(q), page: 1, pageSize: 12 })
    console.log(result);
    
    return (
        <Layout>
            <ProductArea/>
        </Layout>
    );
};

export default page;