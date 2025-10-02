'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import cartData from '../CartPage/cartData';
import { useRouter } from 'next/navigation';

const COUPONS = {
  SAVE10: 0.1,
  SAVE20: 0.2,
  WELCOME5: 0.05,
};

const CheckoutPage = ({user}) => {
    console.log(user);
    
    const router = useRouter()
    useEffect(() => {
  if (!user) {
    router.push("/login?redirect=/checkout");
  }
}, [user, router]);
  const [cartItems, setCartItems] = useState([]);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Load cart & coupon from localStorage (fallback to cartData)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart.length ? savedCart : []);

    const meta = JSON.parse(localStorage.getItem('checkoutMeta') || '{}');
    if (meta?.appliedCoupon) setAppliedCoupon(meta.appliedCoupon);
  }, []);

  // Persist cart whenever it changes
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('cart', JSON.stringify(cartItems));
  //   }
  // }, [cartItems]);

  // Compute summary
  const summary = useMemo(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );
    const discountRate = appliedCoupon ? COUPONS[appliedCoupon] || 0 : 0;
    const discount = total * discountRate;
    const tax = total * 0.1; // 10% tax
    const grandTotal = total - discount + tax;
    return { total, discount, tax, grandTotal };
  }, [cartItems, appliedCoupon]);

  // Qty change (supports variants if present)
  const handleQuantityChange = (id, delta, variant = {}) => {
    setCartItems(prev =>
      prev.map(item => {
        const isSame =
          item.id === id &&
          (variant.color ? item.color === variant.color : true) &&
          (variant.fit ? item.fit === variant.fit : true) &&
          (variant.size ? item.size === variant.size : true);
        if (!isSame) return item;
        const nextQty = Math.max(1, Number(item.quantity || 1) + delta);
        return { ...item, quantity: nextQty };
      })
    );
  };

  // Remove item (supports variants if present)
  const handleRemoveItem = (id, variant = {}) => {
    setCartItems(prev =>
      prev.filter(item => {
        const isSame =
          item.id === id &&
          (variant.color ? item.color === variant.color : true) &&
          (variant.fit ? item.fit === variant.fit : true) &&
          (variant.size ? item.size === variant.size : true);
        return !isSame;
      })
    );
  };

  // Apply coupon
  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const next = code in COUPONS ? code : null;
    setAppliedCoupon(next);
    if (typeof window !== 'undefined') {
      const meta = JSON.parse(localStorage.getItem('checkoutMeta') || '{}');
      localStorage.setItem('checkoutMeta', JSON.stringify({ ...meta, appliedCoupon: next }));
    }
  };

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
                    <div className="address-item__icon">
                      <i className="icon-reshot-icon-pin-74U6KRPJEH"></i>
                    </div>
                    <div className="address-item__inner__content">
                      <h3 className="address-item__name">
                        Zahidul ISlam <span>Main Address</span>
                      </h3>
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
                        <input type="text" name="fist_name" id="fist_name" placeholder="Enter your first name" />
                      </div>
                    </div>
                    <div className="form-one__control">
                      <label htmlFor="last_name" className="form-one__label">Last name</label>
                      <div className="form-one__input-box">
                        <input type="text" name="last_name" id="last_name" placeholder="Enter your last name" />
                      </div>
                    </div>
                    <div className="form-one__control">
                      <label htmlFor="phone-number" className="form-one__label">Your phone</label>
                      <div className="form-one__input-box">
                        <input type="tel" name="phone-number" id="phone-number" placeholder="Enter your last name" />
                      </div>
                    </div>
                    <div className="form-one__control">
                      <label htmlFor="email" className="form-one__label">Email address</label>
                      <div className="form-one__input-box">
                        <input type="email" name="email" id="email" placeholder="Your email address" />
                      </div>
                    </div>

                    <div className="form-one__control form-one__control--full">
                      <label htmlFor="shipping" className="form-one__label">Shipping address</label>
                      <div className="form-one__input-box">
                        <input type="text" name="shipping" id="shipping" placeholder="Your full address" />
                      </div>
                    </div>
                    <div className="form-one__control form-one__control--full">
                      <div className="checkbox-item">
                        <input type="checkbox" className="checkbox-item__btn" id="checkbox" name="checkbox" />
                        <label htmlFor="checkbox" className="checkbox-item__title">
                          <span>Save this new address in Sadamata E-commerce</span>
                        </label>
                      </div>
                    </div>
                    <div className="form-one__control"></div>
                    <div className="form-one__control">
                      <div className="form-one__btn">
                        <button type="submit" className="commerce-btn">
                          Save Now <i className="icon-right-arrow"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="cart-one__inner">
              <ul className="cart-one__list list-unstyled">
                {cartItems.map((item) => {
                  const key = `${item.id}-${item.color ?? 'nocolor'}-${item.fit ?? 'nofit'}-${item.size ?? 'nosize'}`;
                  // Support either local file (item.img static import) or remote path (item.image)
                  const imgSrc = item.image ? `http://localhost:3001${item.image}` : item.img;

                  return (
                    <li className="cart-one__list__item" key={key}>
                      <div className="cart-one__list__left">
                        <div className="cart-one__list__image">
                          {imgSrc ? (
                            <Image
                              src={imgSrc}
                              alt={item.title || 'cart image'}
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
                            {item.type || item.brand}
                            {item.fit ? ` | ${item.fit}` : ''}
                            {item.size ? ` | ${item.size}` : ''}
                            {item.color ? ` | ${item.color}` : ''}
                          </span>
                          <div className="cart-one__list__amount">
                            ${(Number(item.price) * Number(item.quantity || 1)).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="cart-one__list__right">
                        <div className="quantity-box">
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(item.id, -1, { color: item.color, fit: item.fit, size: item.size })
                            }
                            className="sub"
                          >
                            <i className="fa fa-minus"></i>
                          </button>
                          <input type="text" readOnly value={item.quantity || 1} />
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(item.id, 1, { color: item.color, fit: item.fit, size: item.size })
                            }
                            className="add"
                          >
                            <i className="fa fa-plus"></i>
                          </button>
                        </div>
                        <div className="cart-one__list__close">
                          <button
                            onClick={() => handleRemoveItem(item.id, { color: item.color, fit: item.fit, size: item.size })}
                            className="remove-btn"
                            style={{ background: 'none', border: 'none' }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="order-summary">
              <div className="order-summary__top">
                <span className="order-summary__top__title">Have a coupon code?</span>
                <div className="input__coupon__box">
                  <input
                    type="text"
                    name="Coupon-codee"
                    placeholder="Coupon code"
                    className="form-one__input"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button type="button" onClick={applyCoupon}>Apply</button>
                </div>
              </div>

              <h3 className="order-summary__title">Product Summary</h3>
              <ul className="order-summary__list list-unstyled">
                <li>
                  <span className="order-summary__text">Total Price</span>
                  <span className="order-summary__text">${summary.total.toFixed(2)}</span>
                </li>
                <li>
                  <span className="order-summary__text">
                    Discount {appliedCoupon ? `(${appliedCoupon})` : ''}
                  </span>
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

              <button type="button" className="commerce-btn">
                Continue to Shipping <i className="icon-right-arrow"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
