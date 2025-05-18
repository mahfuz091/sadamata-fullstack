import React from 'react';
import { Container } from 'react-bootstrap';
import tick from "@/assets/images/tick-circle.png";
import Image from 'next/image';
import Link from 'next/link';

const SuccessPage = () => {
    return (
        <section className='success-page'> 
            <Container>
                <div className="success-inner">
<Image src={tick} alt="tick" />
                    <h2>Your Payment is Succesfull</h2>
                    <p>Your payment will be proceed in 30 mins. If any problem please chat to customer service. <br />
                    Detail information will included below.</p>
                    <Link href="/" className='commerce-btn'>Back to home</Link>
                </div>
            </Container>
        </section>
    );
};

export default SuccessPage;