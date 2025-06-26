import React from "react";
import { Container } from "react-bootstrap";
import Link from "next/link";

const SuccessPage = () => {
  return (
    <section className='success-page'>
      <Container>
        <div className='payment-status'>
          <div className='container'>
            <div className='payment-status__inner'>
              <div className='payment-status__icon'>
                <i className='fas fa-check'></i>
              </div>
              <div className='payment-status__content'>
                <h2 className='payment-status__title'>
                  Your Payment is Succesfull
                </h2>
                <p className='payment-status__text'>
                  Your payment will be proceed in 30 mins. If any problem please
                  chat to customer service. Detail information will included
                  below.
                </p>
                <Link href='/' className='commerce-btn'>
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SuccessPage;
