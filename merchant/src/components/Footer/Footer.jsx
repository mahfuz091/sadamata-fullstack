import Image from "next/image";
import React from "react";
import payment from "@/assets/images/shapes/payment.png";
import logoFooter from "@/assets/images/logo-footer.png";

const Footer = () => {
  return (
    <>
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
                      <Image
                        src="/logo-sadamata.svg"
                       width={200} height={50}
                        alt='logo'
                      />
                    </a>
                  </div>
                  <p className='footer-widget__text'>
                    Join an elite group of traders with real-time insights,
                    institutional-level strategies, and the power of a private
                    trading network.
                  </p>
                  <div className='footer-widget__social'>
                    <h4 className='footer-widget__social__title'>Follow Us</h4>
                    <div className='footer-widget__social__icon'>
                      <a href='https://facebook.com'>
                        <i className='fab fa-facebook-f'></i>
                      </a>
                      <a href='https://twitter.com'>
                        <i className='icon-twitter'></i>
                      </a>
                      <a href='https://instagram.com'>
                        <i className='icon-instragram'></i>
                      </a>
                      <a href='https://linkedin.com'>
                        <i className='fab fa-linkedin-in'></i>
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
                  <h2 className='footer-widget__title'>Comapny</h2>
                  {/* /.footer-widget__title */}
                  <ul className='list-unstyled footer-widget__links'>
                    <li>
                      <a href='#'>Home</a>
                    </li>
                    <li>
                      <a href='#'>About Us</a>
                    </li>
                    <li>
                      <a href='#'>Our Product</a>
                    </li>
                    <li>
                      <a href='#'>Affiliate</a>
                    </li>
                    <li>
                      <a href='#'>Brand</a>
                    </li>
                    <li>
                      <a href='#'>Contact Us</a>
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
                      <a href='#'>Privacy Policy</a>
                    </li>
                    <li>
                      <a href='#'>Terms and Condition</a>
                    </li>
                    <li>
                      <a href='#'>Delivery & collection</a>
                    </li>
                    <li>
                      <a href='#'>Returns & refunds</a>
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
                            href='tel:123-456 7890'
                            className='footer-widget__contact__link'
                          >
                            (123) 456 7890
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
                            href='mailto:info@tradenova.com'
                            className='footer-widget__contact__link'
                          >
                            info@tradenova.com
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
                            Phone Number
                          </span>
                          <a
                            href='https://www.google.com/maps'
                            className='footer-widget__contact__link'
                          >
                            Channel Dike North 111, 5642 JA Eindhoven
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
              className='main-footer__bottom__inner wow fadeInUp'
              data-wow-duration='1500ms'
              data-wow-delay='500ms'
            >
              <p className='main-footer__copyright'>
                {" "}
                &copy; Copyright <span className='dynamic-year'></span>{" "}
                <span className='name'> Logohere</span> All rights reserved. 
              </p>
              <div className='main-footer__bottom__payment'>
                <Image src={payment} alt='images' />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
