'use client';
import React, { useState, useEffect } from 'react';
import cartData from './cartData';
import Image from 'next/image';
import { GoTrash } from "react-icons/go";

const CartPage = () => {
    const [cartItems, setCartItems] = useState(cartData);
    const [summary, setSummary] = useState({ total: 0, discount: 0, tax: 0, grandTotal: 0 });

    // Calculate totals
    useEffect(() => {
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discount = total * 0.05; // 5% discount example
        const tax = total * 0.1;       // 10% tax example
        const grandTotal = total - discount + tax;

        setSummary({
            total,
            discount,
            tax,
            grandTotal
        });
    }, [cartItems]);

    const handleQuantityChange = (id, delta) => {
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === id
              ? { ...item, quantity: Math.max(1, item.quantity + delta) }
              : item
          )
        );
      };

    const handleRemove = (index) => {
        setCartItems(prevItems => prevItems.filter((_, i) => i !== index));
    };

    return (
        <section className="cart-page">
            <div className="container">
                <div className="cart-page__top">
                    <h2 className="cart-section-title">Shopping Cart</h2>
                    <p className="cart-section-text">Showing your chosen products</p>
                </div>
                <div className="row gutter-y-30">
                    <div className="col-lg-8">
                        <div className="cart-one__inner">
                            <ul className="cart-one__list list-unstyled">
                                {
                                    cartItems.map((item, index) => (
                                        <li className="cart-one__list__item" key={index}>
                                            <div className="cart-one__list__left">
                                                <div className="cart-one__list__image">
                                                    <Image src={item.img} alt="cart image" />
                                                </div>
                                                <div className="cart-one__list__content">
                                                    <h3 className="cart-one__list__title">{item.title}</h3>
                                                    <span className="cart-one__list__text">{item.category}</span>
                                                    <div className="cart-one__list__amount">${(item.price * item.quantity).toFixed(2)}</div>
                                                </div>
                                            </div>
                                            <div className="cart-one__list__right">
                                                <div className="quantity-box">
                                                    <button  className="sub" onClick={() => handleQuantityChange(item.id, -1)}><i className="fa fa-minus"></i></button>
                                                    <input type="text" readOnly value={item.quantity} />
                                                    <button  className="add" onClick={() => handleQuantityChange(item.id, 1)}><i className="fa fa-plus"></i></button>
                                                </div>
                                                <div className="cart-one__list__close">
                                                    <a  onClick={() => handleRemove(index)}><GoTrash color='#0B0F0E' /></a>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-4">
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
                                    <span className="order-summary__text">${summary.total.toFixed(2)}</span>
                                </li>
                                <li>
                                    <span className="order-summary__text">Discount</span>
                                    <span className="order-summary__text">-${summary.discount.toFixed(2)}</span>
                                </li>
                                <li>
                                    <span className="order-summary__text">Tax & Fee</span>
                                    <span className="order-summary__text">${summary.tax.toFixed(2)}</span>
                                </li>
                            </ul>
                            <div className="order-summary__total">
                                <h3 className="order-summary__total__text">Total Price</h3>
                                <h3 className="order-summary__total__amount">${summary.grandTotal.toFixed(2)}</h3>
                            </div>
                            <button type="submit" className="commerce-btn">Checkout <i className="icon-right-arrow"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CartPage;
