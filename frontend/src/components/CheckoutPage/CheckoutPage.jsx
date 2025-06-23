'use client'
import React, { useState } from 'react';
import image1 from '@/assets/images/products/cart-1-1.png'
import Image from 'next/image';
import cartData from '../CartPage/cartData';

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState(cartData);
    const handleQuantityChange = (id, delta) => {
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === id
              ? { ...item, quantity: Math.max(1, item.quantity + delta) }
              : item
          )
        );
      };
    
      const handleRemoveItem = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      };
    
      const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return (
        <section className="checkout-page">
            <div className="container">
                <div className="section__title__two">
                    <h2 className="section__title__two-title">Checkout Page</h2>
                    <p className="section__title__two-text">Showing your choices product</p>
                </div>
                <div className="row gutter-y-30">
                    <div className="col-xl-8">
                        <div className="cart-one__inner">
                            <div className="address-item">
                                <div className="address-item__content">
                                    <h3 className="address-title">Shipping Address</h3>
                                    <div className="address-item__inner">
                                        <div className="address-item__icon"><i className="icon-reshot-icon-pin-74U6KRPJEH"></i></div>
                                        <div className="address-item__inner__content">
                                            <h3 className="address-item__name">Zahidul ISlam <span>Main Address</span></h3>
                                            <p className="address-item__call">081277939572</p>
                                            <p className="address-item__info">2021 Royalty Boulevard Portland, OR 98199</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="address-item__btn">
                                    <a href="product.html">Add New Addres<i className="icon-right-arrow"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="cart-one__inner">
                            <div className="billing-address">
                                <h3 className="billing-address-title">Add New Address</h3>
                                <form action="#" className="form-one">
                                    <div className="form-one__group">
                                        <div className="form-one__control">
                                            <label htmlFor="fist_name" className="form-one__label">First name</label>
                                            <div className="form-one__input-box">
                                                <input type="text" name="fist_name" id="fist_name" placeholder="Enter your first name"/>
                                            </div>
                                        </div>
                                        <div className="form-one__control">
                                            <label htmlFor="last_name" className="form-one__label">Last name</label>
                                            <div className="form-one__input-box">
                                                <input type="text" name="last_name" id="last_name" placeholder="Enter your last name"/>
                                            </div>
                                        </div>
                                        <div className="form-one__control">
                                            <label htmlFor="phone-number" className="form-one__label">Your phone</label>
                                            <div className="form-one__input-box">
                                                <input type="tel" name="phone-number" id="phone-number" placeholder="Enter your last name"/>
                                            </div>
                                        </div>
                                        <div className="form-one__control">
                                            <label htmlFor="email" className="form-one__label">Email address</label>
                                            <div className="form-one__input-box">
                                                <input type="email" name="email" id="email" placeholder="Your email address"/>
                                            </div>
                                        </div>

                                        <div className="form-one__control form-one__control--full">
                                            <label htmlFor="shipping" className="form-one__label">Shipping address</label>
                                            <div className="form-one__input-box">
                                                <input type="text" name="shipping" id="shipping" placeholder="Your full address"/>
                                            </div>
                                        </div>
                                        <div className="form-one__control form-one__control--full">
                                            <div className="checkbox-item">
                                                <input type="checkbox" className="checkbox-item__btn" id="checkbox" name="checkbox"/>
                                                <label htmlFor="checkbox" className="checkbox-item__title"><span>Save this new address in Sadamata E-commerce</span></label>
                                            </div>
                                        </div>
                                        <div className="form-one__control"></div>
                                        <div className="form-one__control">
                                            <div className="form-one__btn">
                                                <button type="submit" className="commerce-btn">Save Now <i className="icon-right-arrow"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="cart-one__inner">
                            <ul className="cart-one__list list-unstyled">
                            {cartItems.map(item => (
          <li className="cart-one__list__item" key={item.id}>
            <div className="cart-one__list__left">
              <div className="cart-one__list__image">
                <Image src={item.img} alt="cart image" />
              </div>
              <div className="cart-one__list__content">
                <h3 className="cart-one__list__title">{item.title}</h3>
                <span className="cart-one__list__text">{item.type}</span>
                <div className="cart-one__list__amount">${item.price * item.quantity}</div>
              </div>
            </div>
            <div className="cart-one__list__right">
              <div className="quantity-box">
                <button type="button" onClick={() => handleQuantityChange(item.id, -1)} className="sub">
                  <i className="fa fa-minus"></i>
                </button>
                <input type="text" readOnly value={item.quantity} />
                <button type="button" onClick={() => handleQuantityChange(item.id, 1)} className="add">
                  <i className="fa fa-plus"></i>
                </button>
              </div>
              <div className="cart-one__list__close">
                <button onClick={() => handleRemoveItem(item.id)} className="remove-btn" style={{ background: 'none', border: 'none' }}>
                  ✕
                </button>
              </div>
            </div>
          </li>
        ))}
                            </ul>
                        </div>
                    </div>
                    <div className="col-xl-4">
                        <div className="order-summary">
                            <div className="order-summary__top">
                                <span className="order-summary__top__title">Have a coupon code?</span>
                                <div className="input__coupon__box">
                                    <input type="text" name="Coupon-codee" placeholder="Coupon code" className="form-one__input"/>
                                    <button type="submit">Apply</button>
                                </div>
                            </div>
                            <h3 className="order-summary__title">Product Summary</h3>
                            <ul className="order-summary__list list-unstyled">
                                <li>
                                    <span className="order-summary__text">Total Price</span>
                                    <span className="order-summary__text">$530</span>
                                </li>
                                <li>
                                    <span className="order-summary__text">Total Price (Discount)</span>
                                    <span className="order-summary__text">$23</span>
                                </li>
                                <li>
                                    <span className="order-summary__text">Tax & Fee</span>
                                    <span className="order-summary__text">$53</span>
                                </li>
                            </ul>
                            <div className="order-summary__total">
                                <h3 className="order-summary__total__text">Total Price</h3>
                                <h3 className="order-summary__total__amount">$100</h3>
                            </div>
                            <button type="submit" className="commerce-btn">Continue to Shipping <i className="icon-right-arrow"></i></button>
                           
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CheckoutPage;