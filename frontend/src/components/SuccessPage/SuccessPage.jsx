import React from "react";
import { Container } from "react-bootstrap";
import Link from "next/link";

const SuccessPage = () => {
  return (
    <section className='success-page'>
      <Container>
        <div class='payment-status'>
          <div class='container'>
            <div class='payment-status__inner'>
              <div class='payment-status__icon'>
                <i class='fas fa-check'></i>
              </div>
              <div class='payment-status__content'>
                <h2 class='payment-status__title'>
                  Your Payment is Succesfull
                </h2>
                <p class='payment-status__text'>
                  Your payment will be proceed in 30 mins. If any problem please
                  chat to customer service. Detail information will included
                  below.
                </p>
                <Link href='/' class='commerce-btn'>
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
