"use client";

import ScrollToTop from "react-scroll-to-top";
import Image from "next/image";
import React from "react";
import payment from "@/assets/images/shapes/payment.png";
import logo from "@/assets/images/logo-sadamata.svg";

const Footer = () => {
  return (
    <>
      <section className='footer-cta'>
        <div className='container'>
          <div className='footer-cta__inner'>
            <div className='footer-cta__content'>
              <h3 className='footer-cta__title'>
                Sign up to recieve br <span>15% off</span> <br /> of your first
                order!
              </h3>
              <p className='footer-cta__text'>
                Join our email list for exclusive offers and the latest news.
              </p>
            </div>
            <div className='footer-cta__form'>
              <form
                action='#'
                data-url='MAILCHIMP_FORM_URL'
                className='footer-cta__form__newsletter mc-form'
              >
                <div className='footer-cta__form__group__form'>
                  <span className='icon-mail'></span>
                  <input
                    type='email'
                    name='EMAIL'
                    placeholder='Your email address'
                  />
                  <button type='submit' className='commerce-btn'>
                    Subscribe
                  </button>
                </div>
                {/* /.form-group */}
              </form>
              {/* /.footer-cta__form__newsletter mc-form */}
              <div className='mc-form__response'></div>
              {/* /.mc-form__response */}
            </div>
          </div>
        </div>
        {/* <div className='footer-cta__scroll-top'>
          <p className='footer-cta__scroll-top__text'>
            Back on Top{" "}
            <span className='icon-reshot-icon-arrow-chevron-up-9ECRMJ2GNT'></span>
          </p>
        </div> */}
        <div className='footer-cta__scroll-top'>
          <ScrollToTop
            smooth
            top={300}
            component={
              <p className='footer-cta__scroll-top__text'>
                Back on Top{" "}
                <span className='icon-reshot-icon-arrow-chevron-up-9ECRMJ2GNT'></span>
              </p>
            }
            style={{
              background: "none",
              boxShadow: "none",
              position: "relative",
              width: "100%",
              height: "fit-content",
              bottom: "0",
            }}
          />
        </div>
      </section>

      <footer className='main-footer'>
        <div className='main-footer__middle section-space'>
          <div className='container'>
            <div className='row gutter-y-40'>
              <div className='col-md-6 col-lg-4 col-xl-4'>
                <div
                  className='footer-widget footer-widget--about wow fadeInUp'
                  data-wow-duration='1500ms'
                  data-wow-delay='700ms'
                >
                  <div className='footer-widget__logo'>
                    <a href='#' className='logo'>
                      <Image src={logo} width={190} height='auto' alt='logo' />
                    </a>
                  </div>
                  {/* <p className='footer-widget__text'>
                    Join an elite group of traders with real-time insights,
                    institutional-level strategies, and the power of a private
                    trading network.
                  </p> */}
                  <div className='footer-widget__social'>
                    <h4 className='footer-widget__social__title'>Follow Us</h4>
                    <div className='footer-widget__social__icon'>
                      <a
                        href='https://www.facebook.com/sadamataplc'
                        target='_blank'
                      >
                        <i className='fab fa-facebook-f'></i>
                      </a>
                      <a href='https://x.com/Sadamatacl' target='_blank'>
                        <i className='icon-twitter'></i>
                      </a>
                      <a
                        href='https://www.instagram.com/sadamata_com/'
                        target='_blank'
                      >
                        <i className='icon-instragram'></i>
                      </a>
                      <a
                        href='https://www.tiktok.com/@sadamata.company.limited'
                        target='_blank'
                      >
                        <i className='fab fa-tiktok'></i>
                      </a>
                      <a
                        href='https://www.youtube.com/@SadamataCL'
                        target='_blank'
                      >
                        <i className='fab fa-youtube'></i>
                      </a>
                      <a
                        href='https://www.threads.com/@sadamata_com'
                        target='_blank'
                      >
                        <i className='fab fa-threads'></i>
                      </a>
                    </div>
                  </div>
                  {/* /.footer-widget__social */}
                </div>
                {/* /.footer-widget */}
              </div>
              {/* /.col-md-6 */}
              <div className='col-md-6 col-lg-4 col-xl-3'>
                <div
                  className='footer-widget footer-widget--links wow fadeInUp'
                  data-wow-duration='1500ms'
                  data-wow-delay='300ms'
                >
                  <h2 className='footer-widget__title'>Company</h2>
                  {/* /.footer-widget__title */}
                  <ul className='list-unstyled footer-widget__links'>
                    <li>
                      <a href='/about'>About Us</a>
                    </li>
                    <li>
                      <a href='/privecy'>Privacy Policy</a>
                    </li>
                    <li>
                      <a href='/terms'>Terms and Condition</a>
                    </li>
                    <li>
                      <a href='/refund'>Returns & refunds</a>
                    </li>
                  </ul>
                  {/* /.list-unstyled footer-widget__links */}
                </div>
                {/* /.footer-widget */}
              </div>
              {/* /.col-md-6 */}
              <div className='col-md-6 col-lg-4 col-xl-3'>
                <div
                  className='footer-widget footer-widget--links-two wow fadeInUp'
                  data-wow-duration='1500ms'
                  data-wow-delay='300ms'
                >
                  <h2 className='footer-widget__title'>Market</h2>
                  {/* /.footer-widget__title */}
                  <ul className='list-unstyled footer-widget__links'>
                    <li>
                      <a href='#'>Delivery & collection</a>
                    </li>

                    <li>
                      <a href='#'>Track your order</a>
                    </li>
                    <li>
                      <a href='#'>Size guide</a>
                    </li>
                  </ul>
                  {/* /.list-unstyled footer-widget__links */}
                </div>
                {/* /.footer-widget */}
              </div>
              {/* /.col-md-6 */}

              <div className='col-md-6 col-lg-4 col-xl-2'>
                <div
                  className='footer-widget footer-widget--links-three wow fadeInUp'
                  data-wow-duration='1500ms'
                  data-wow-delay='900ms'
                >
                  <h2 className='footer-widget__title'>Contact Information</h2>
                  {/* /.footer-widget__title */}
                  <ul className='list-unstyled footer-widget__contact'>
                    <li>
                      <div className='footer-widget__contact__item'>
                        <div className='footer-widget__contact__icon'>
                          <i className='icon-call-calling'></i>
                        </div>
                        <div className='footer-widget__contact__content'>
                          <span className='footer-widget__contact__title'>
                            Phone Number
                          </span>
                          <a
                            href='tel:+8801717012170'
                            className='footer-widget__contact__link'
                          >
                            +880 1717 012170
                          </a>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className='footer-widget__contact__item'>
                        <div className='footer-widget__contact__icon'>
                          <i className='icon-mail'></i>
                        </div>
                        <div className='footer-widget__contact__content'>
                          <span className='footer-widget__contact__title'>
                            Email :{" "}
                          </span>
                          <a
                            href='mailto:support@sadamata.com
'
                            className='footer-widget__contact__link'
                          >
                            support@sadamata.com
                          </a>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className='footer-widget__contact__item'>
                        <div className='footer-widget__contact__icon'>
                          <i className='icon-reshot-icon-pin-74U6KRPJEH'></i>
                        </div>
                        <div className='footer-widget__contact__content'>
                          <span className='footer-widget__contact__title'>
                            Location
                          </span>
                          <a
                            href='https://www.google.com/maps'
                            className='footer-widget__contact__link'
                          >
                            159/12, Mannan Soroni, West Shawrapara, Mirpur-1216,
                            Dhaka, BD
                          </a>
                        </div>
                      </div>
                    </li>
                  </ul>
                  {/* /.list-unstyled footer-widget__links */}
                </div>
                {/* /.footer-widget */}
              </div>
              {/* /.col-md-6 */}
            </div>
          </div>
        </div>
        <div className='main-footer__bottom'>
          <div className='container'>
            <div
              className='main-footer__bottom__inner wow fadeInUp flex-column gap-3'
              data-wow-duration='1500ms'
              data-wow-delay='500ms'
            >
              <p className='main-footer__copyright'>
                &copy; {new Date().getFullYear()}
                <span className='name'> Sadmata.</span> All rights reserved.
              </p>
              <div className='main-footer__bottom__payment'>
                <a
                  target='_blank'
                  href='https://www.sslcommerz.com/'
                  title='SSLCommerz'
                  alt='SSLCommerz'
                >
                  <img
                    // style='width:300px;height:auto;'
                    src='https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-03.png'
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
