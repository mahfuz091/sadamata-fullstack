'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { GoTrash } from "react-icons/go";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const CartPage = ({ user }) => {
   const router = useRouter()

  const [cartItems, setCartItems] = useState([])
  const [summary, setSummary] = useState({ total: 0, discount: 0, tax: 0, grandTotal: 0 })
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  // no writer effect anymore
  const hydrated = useRef(false)

  const coupons = { SAVE10: 0.1, SAVE20: 0.2, WELCOME5: 0.05 }

  // Hydrate once
  useEffect(() => {
    if (typeof window === 'undefined') return
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(savedCart)

    const savedMeta = JSON.parse(localStorage.getItem('checkoutMeta') || '{}')
    if (savedMeta?.appliedCoupon) setAppliedCoupon(savedMeta.appliedCoupon)

    hydrated.current = true
  }, [])

  // Recompute summary
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    )
    const discountRate = appliedCoupon ? coupons[appliedCoupon] || 0 : 0
    const discount = total * discountRate
    const tax = total * 0.1
    const grandTotal = total - discount + tax
    setSummary({ total, discount, tax, grandTotal })
  }, [cartItems, appliedCoupon])

  // Helper to update cart + persist immediately (no effect)
  const setCartAndPersist = (updater) => {
    setCartItems(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      if (typeof window !== 'undefined' && hydrated.current) {
        localStorage.setItem('cart', JSON.stringify(next))
      }
      return next
    })
  }

  const handleQuantityChange = (id, color, fit, size, delta) => {
    setCartAndPersist(items =>
      items.map(it =>
        it.id === id && it.color === color && it.fit === fit && it.size === size
          ? { ...it, quantity: Math.max(1, (Number(it.quantity) || 1) + delta) }
          : it
      )
    )
  }

  const handleRemove = (id, color, fit, size) => {
    setCartAndPersist(items =>
      items.filter(it => !(it.id === id && it.color === color && it.fit === fit && it.size === size))
    )
  }

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase()
    const meta = { appliedCoupon: code in coupons ? code : null }
    setAppliedCoupon(meta.appliedCoupon)
    if (typeof window !== 'undefined' && hydrated.current) {
      localStorage.setItem('checkoutMeta', JSON.stringify(meta))
    }
  }

  const handleCheckout = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cartItems))
      localStorage.setItem('checkoutMeta', JSON.stringify({ appliedCoupon: appliedCoupon || null, summary }))
    }
    router.push('/checkout')
  }

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
                {cartItems.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  cartItems.map((item) => {
                    const key = `${item.id}-${item.color}-${item.fit}-${item.size}`;
                    return (
                      <li className="cart-one__list__item" key={key}>
                        <div className="cart-one__list__left">
                          <div className="cart-one__list__image">
                            {item.image ? (
                              <Image
                                src={`http://localhost:3001${item.image}`}
                                alt={item.title}
                                width={80}
                                height={80}
                              />
                            ) : (
                              <span>No Image</span>
                            )}
                          </div>
                          <div className="cart-one__list__content">
                            <h3 className="cart-one__list__title">{item.title}</h3>
                            <span className="cart-one__list__text">
                              {item.brand} | {item.fit} | {item.size} | {item.color}
                            </span>
                            <div className="cart-one__list__amount">
                              ${(Number(item.price) * Number(item.quantity || 1)).toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="cart-one__list__right">
                          <div className="quantity-box">
                            <button
                              className="sub"
                              onClick={() => handleQuantityChange(item.id, item.color, item.fit, item.size, -1)}
                            >
                              <i className="fa fa-minus"></i>
                            </button>
                            <input type="text" readOnly value={item.quantity || 1} />
                            <button
                              className="add"
                              onClick={() => handleQuantityChange(item.id, item.color, item.fit, item.size, 1)}
                            >
                              <i className="fa fa-plus"></i>
                            </button>
                          </div>
                          <div className="cart-one__list__close">
                            <button
                              type="button"
                              onClick={() => handleRemove(item.id, item.color, item.fit, item.size)}
                              className="remove-btn"
                              title="Remove item"
                              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                            >
                              <GoTrash color="#0B0F0E" />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="order-summary">
              <div className="order-summary__top">
                <span className="order-summary__top__title">Have a coupon code?</span>
                <div className="input__coupon__box">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon code"
                    className="form-one__input"
                  />
                  <button type="button" className="apply-btn" onClick={handleApplyCoupon}>
                    Apply
                  </button>
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
              <button
                type="button"
                className="commerce-btn"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                Checkout <i className="icon-right-arrow"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
