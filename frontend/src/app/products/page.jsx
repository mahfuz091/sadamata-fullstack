import Layout from '@/components/Layout/Layout';
import ProductArea from '@/components/ProductArea/ProductArea';
import React from 'react';
import { searchProducts } from '../actions/search/search.actions';

const page = async({ searchParams }) => {
    const { slug = '', q = '' } = await searchParams || {}
    const result = await searchProducts({ slug: String(slug), q: String(q), page: 1, pageSize: 12 })
    console.log(result);
    const brands = await prisma.brand.findMany({ select: { id: true, name: true } });
    const mockups = await prisma.mockup.findMany({ select: { id: true, name: true } });

    console.log(mockups, "brands");
    
    
    return (
        <Layout>
            <ProductArea result={result} brands={brands} slug={slug} q={q} mockups={mockups}/>
        </Layout>
    );
};

export default page;