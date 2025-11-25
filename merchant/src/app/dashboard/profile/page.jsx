import { auth } from '@/auth';
import Profile from '@/components/Profile/Profile';
import { prisma } from '@/lib/prisma';
import React from 'react';
import { GetCountries } from 'react-country-state-city';

const page = async() => {
    const session = await auth();
    const countries = await GetCountries();
    const userId = session?.user.id;
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id : true,
            name: true,
            email : true,
            phone : true,
            merchantProfile: true, // must match your relation field name in schema
            addresses: true
        },
    })
    // console.log(user, 'user');
    
    return (
       <Profile user={user}  countries={countries}/>
    );
};

export default page;