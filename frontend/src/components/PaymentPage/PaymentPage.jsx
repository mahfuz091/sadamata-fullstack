import Link from 'next/link';
import React from 'react';
import payment1 from '@/assets/images/shapes/payment-1-1.png';
import payment2 from '@/assets/images/shapes/payment-1-2.png';
import payment3 from '@/assets/images/shapes/payment-1-3.png';
import edit2 from '@/assets/images/resources/edit-2.svg';
import Image from 'next/image';

const PaymentPage = () => {

    
    return (
        <section className="checkout-page">
        <div className="container">
          <div className="section__title__two">
            <h2 className="section__title__two-title">Checkout Page</h2>
            <p className="section__title__two-text">Showing your choices product</p>
          </div>
          <div className="row gutter-y-30">
            <div className="col-xl-8">
              {/* Payment Method */}
              <div className="cart-one__inner">
                <div className="payment-method">
                  <div className="payment-method__top">
                    <h3 className="payment-method__title">Payment Method</h3>
                    <Link href="#" className="payment-method__top__btn">Change method</Link>
                  </div>
                  <form className="payment-method__form">
                    {[
                      { id: 'payment_one', name: 'Credit Card', email: 'yelenastacia99@gmail.com', img: payment1 },
                      { id: 'payment_two', name: 'Bkash', email: '01714-298464', img: payment2 },
                      { id: 'payment_three', name: 'Nagad', email: '01614-298464', img: payment3 },
                    ].map(({ id, name, email, img }) => (
                      <div className="payment-method__item" key={id}>
                        <div className="radio-item">
                          <input type="radio" id={id} name="turnaround" className="radio-item__btn" />
                          <label htmlFor={id} className="radio-item__title">
                            <div className="payment-method__image">
                              <Image src={img} alt="icon" />
                            </div>
                            <div className="payment-method__content">
                              <h4 className="payment-method__name">{name}</h4>
                              <p className="payment-method__link">{email}</p>
                            </div>
                          </label>
                        </div>
                        <div className="payment-method__btn">
                          <Link href="#" className="commerce-btn">
                           <Image src={edit2} alt="icon" />
                            <span>Edit Info</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                    <div className="payment-method__item">
                      <div className="payment-method__submit">
                        <button type="submit" className="commerce-btn">Add Payment Method</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
  
              {/* Add Debit Card */}
              <div className="cart-one__inner">
                <div className="billing-address">
                  <h3 className="billing-address-title">Add Debit Card</h3>
                  <form className="form-one">
                    <div className="form-one__group">
                      <div className="form-one__control">
                        <label htmlFor="fist_name" className="form-one__label">Holder name</label>
                        <div className="form-one__input-box">
                          <input type="text" name="fist_name" id="fist_name" placeholder="Enter your name" />
                        </div>
                      </div>
                      <div className="form-one__control">
                        <label htmlFor="number" className="form-one__label">Card number</label>
                        <div className="form-one__input-box">
                          <input type="number" name="number" id="number" placeholder="0000 - 0000 - 0000 - 0000" />
                        </div>
                      </div>
                      <div className="form-one__control">
                        <label htmlFor="date" className="form-one__label">Expire date</label>
                        <div className="form-one__input-box">
                          <input type="date" name="date" id="date" />
                        </div>
                      </div>
                      <div className="form-one__control">
                        <label htmlFor="CVV" className="form-one__label">CVV</label>
                        <div className="form-one__input-box">
                          <input type="text" name="CVV" id="CVV" placeholder="Enter your CVV" />
                        </div>
                      </div>
                      <div className="form-one__control form-one__control--full">
                        <div className="form-one__btn">
                          <button type="button" className="commerce-btn">Cancel</button>
                          <button type="submit" className="commerce-btn">Save Now <i className="icon-right-arrow"></i></button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
  
            {/* Right Column */}
            <div className="col-xl-4">
            <div className="order-summary">
                            <div className="order-summary__top">
                                <span className="order-summary__top__title">Have a coupon code?</span>
                                <div className="input__coupon__box">
                                    <input type="text" name="Coupon-code" placeholder="Coupon code" className="form-one__input" />
                                    <button type="submit" className='apply-btn'>Apply</button>
                                </div>
                            </div>
                            <h3 className="order-summary__title">Product Summary</h3>
                            <ul className="order-summary__list list-unstyled">
                                <li>
                                    <span className="order-summary__text">Total Price</span>
                                    <span className="order-summary__text">$1440</span>
                                </li>
                                <li>
                                    <span className="order-summary__text">Discount</span>
                                    <span className="order-summary__text">-$70</span>
                                </li>
                                <li>
                                    <span className="order-summary__text">Tax & Fee</span>
                                    <span className="order-summary__text">$53</span>
                                </li>
                            </ul>
                            <div className="order-summary__total">
                                <h3 className="order-summary__total__text">Total Price</h3>
                                <h3 className="order-summary__total__amount">$530</h3>
                            </div>
                            <button type="submit" className="commerce-btn">Checkout <i className="icon-right-arrow"></i></button>
                        </div>
            </div>
          </div>
        </div>
      </section>
    );
};

export default PaymentPage;