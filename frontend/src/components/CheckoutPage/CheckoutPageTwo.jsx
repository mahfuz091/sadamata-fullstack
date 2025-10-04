// app/checkout/page.jsx
"use client";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createCheckoutSession } from "@/app/actions/payment/payment.actions";
import { addUserAddress, listUserAddresses } from "@/app/actions/address/address.actions";

const COUPONS = { SAVE10: 0.1, SAVE20: 0.2, WELCOME5: 0.05 };

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const CheckoutPageTwo = ({ user }) => {
  const router = useRouter();
  const [pending, start] = useTransition();

  const [cartItems, setCartItems] = useState([]);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // addresses
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);

  // new address form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [phone, setPhone]         = useState("");
  const [email, setEmail]         = useState("");
  const [address, setAddress]     = useState("");
  const [makeDefault, setMakeDefault] = useState(true);

  // require login
  useEffect(() => {
    if (!user) router.push("/login?redirect=/checkout");
  }, [user, router]);

  // load cart + coupon
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart.length ? savedCart : []);
    const meta = JSON.parse(localStorage.getItem("checkoutMeta") || "{}");
    if (meta?.appliedCoupon) setAppliedCoupon(meta.appliedCoupon);
  }, []);

  // normalize cart items to the payload shape (and drop invalid lines)
  const sanitizedCart = useMemo(() => {
    return cartItems
      .map((i) => {
        const price =
          [i.price, i.unitPrice, i.amount, i.total, i.newPrice, i.salePrice]
            .map(toNum).find((n) => n > 0) || 0;
        const quantity =
          [i.quantity, i.qty, i.count]
            .map((q) => Math.max(0, toNum(q))).find((n) => n > 0) || 0;

        return {
          productId: i.productId ?? i.id ?? null,
          title: String(i.title || "Item"),
          price,
          quantity,
          color: i.color || null,
          fit: i.fit || null,
          size: i.size || null,
          // keep a couple of raw fields for UI display
          _img: i.image ? `http://localhost:3001${i.image}` : i.img,
          _typeOrBrand: i.type || i.brand,
        };
      })
      .filter((it) => it.price > 0 && it.quantity > 0);
  }, [cartItems]);

  // summary from sanitized cart
  const summary = useMemo(() => {
    const total = sanitizedCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const discountRate = appliedCoupon ? COUPONS[appliedCoupon] || 0 : 0;
    const discount = total * discountRate;
    const tax = total * 0.1; // 10%
    const grandTotal = total - discount + tax;
    return { total, discount, tax, grandTotal };
  }, [sanitizedCart, appliedCoupon]);

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const next = code in COUPONS ? code : null;
    setAppliedCoupon(next);
    const meta = JSON.parse(localStorage.getItem("checkoutMeta") || "{}");
    localStorage.setItem("checkoutMeta", JSON.stringify({ ...meta, appliedCoupon: next }));
  };

  // load addresses via server action
  async function refreshAddresses() {
    if (!user?.id) return;
    const res = await listUserAddresses({ userId: user.id });
    if (res?.ok) {
      const addrs = res.addresses || [];
      setAddresses(addrs);
      const def = addrs.find((a) => a.isDefault) || addrs[0];
      setSelectedId(def?.id || "");
    } else {
      console.error(res?.error || "Failed to load addresses");
    }
  }
  useEffect(() => {
    if (!user?.id) return;
    refreshAddresses();
  }, [user]);

  async function handleCreateAddress(e) {
    e.preventDefault();
    if (!user?.id) return;

    const res = await addUserAddress({
      userId: user.id,
      firstName,
      lastName,
      phone,
      email,
      address,
      isDefault: makeDefault,
    });

    if (!res?.ok) {
      alert(res?.error || "Could not save address");
      return;
    }

    // reset & refresh
    setFirstName(""); setLastName(""); setPhone("");
    setEmail(""); setAddress("");
    setMakeDefault(true);
    setShowNewForm(false);
    await refreshAddresses();
  }
console.log(sanitizedCart, "sanitizedCart");
  return (
    <section className="checkout-page">
      <div className="container">
        <div className="section__title__two">
          <h2 className="section__title__two-title">Checkout Page</h2>
          <p className="section__title__two-text">Showing your chosen products</p>
        </div>

        <div className="row gutter-y-30">
          <div className="col-xl-8">
            {/* Address block */}
            <div className="cart-one__inner">
              <div className="address-item">
                <div className="address-item__content">
                  <h3 className="address-title">Shipping Address</h3>

                  {addresses.length === 0 ? (
                    <div className="address-item__inner__content">
                      <p>No saved addresses.</p>
                    </div>
                  ) : (
                    <>
                      {selectedId && (
                        <div className="address-item__inner">
                          <div className="address-item__icon">
                            <i className="icon-reshot-icon-pin-74U6KRPJEH"></i>
                          </div>
                          <div className="address-item__inner__content">
                            {(() => {
                              const a = addresses.find((x) => x.id === selectedId);
                              return a ? (
                                <>
                                  <h3 className="address-item__name">
                                    {a.firstName} {a.lastName} {a.isDefault && <span>Main Address</span>}
                                  </h3>
                                  <p className="address-item__call">{a.phone}</p>
                                  <p className="address-item__info">{a.address}</p>
                                </>
                              ) : null;
                            })()}
                          </div>
                        </div>
                      )}

                      <div className="form-one__control form-one__control--full" style={{ marginTop: 12 }}>
                        <label className="form-one__label">Select address</label>
                        <select
                          className="form-one__input"
                          value={selectedId}
                          onChange={(e) => setSelectedId(e.target.value)}
                        >
                          {addresses.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.firstName} {a.lastName} — {a.address}{a.isDefault ? " [Default]" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>

                <div className="address-item__btn">
                  <button
                    type="button"
                    className="commerce-btn"
                    onClick={() => setShowNewForm((v) => !v)}
                  >
                    {addresses.length === 0 ? "Add New Address" : showNewForm ? "Close" : "Add New Address"}
                    <i className="icon-right-arrow"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Add New Address form */}
            {showNewForm && (
              <div className="cart-one__inner">
                <div className="billing-address">
                  <h3 className="billing-address-title">Add New Address</h3>
                  <form className="form-one" onSubmit={handleCreateAddress}>
                    <div className="form-one__group">
                      <div className="form-one__control">
                        <label className="form-one__label">First name</label>
                        <div className="form-one__input-box">
                          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter your first name" />
                        </div>
                      </div>
                      <div className="form-one__control">
                        <label className="form-one__label">Last name</label>
                        <div className="form-one__input-box">
                          <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter your last name" />
                        </div>
                      </div>
                      <div className="form-one__control">
                        <label className="form-one__label">Your phone</label>
                        <div className="form-one__input-box">
                          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" />
                        </div>
                      </div>
                      <div className="form-one__control">
                        <label className="form-one__label">Your Email</label>
                        <div className="form-one__input-box">
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@example.com" />
                        </div>
                      </div>
                      <div className="form-one__control form-one__control--full">
                        <label className="form-one__label">Shipping address</label>
                        <div className="form-one__input-box">
                          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street / Address line" />
                        </div>
                      </div>

                      <div className="form-one__control form-one__control--full">
                        <div className="checkbox-item">
                          <input
                            type="checkbox"
                            className="checkbox-item__btn"
                            id="makeDefault"
                            checked={makeDefault}
                            onChange={(e) => setMakeDefault(e.target.checked)}
                          />
                          <label htmlFor="makeDefault" className="checkbox-item__title">
                            <span>Save as Main Address</span>
                          </label>
                        </div>
                      </div>

                      <div className="form-one__control" />
                      <div className="form-one__control">
                        <div className="form-one__btn">
                          <button type="submit" className="commerce-btn">
                            Save Now <i className="icon-right-arrow" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Cart list (using sanitizedCart for amounts) */}
            <div className="cart-one__inner">
              <ul className="cart-one__list list-unstyled">
                {sanitizedCart.map((item) => {
                  const key = `${item.productId}-${item.color ?? "nocolor"}-${item.fit ?? "nofit"}-${item.size ?? "nosize"}`;
                  return (
                    <li className="cart-one__list__item" key={key}>
                      <div className="cart-one__list__left">
                        <div className="cart-one__list__image">
                          {item._img ? (
                            <Image src={item._img} alt={item.title || "cart image"} width={80} height={80} />
                          ) : (
                            <span>No Image</span>
                          )}
                        </div>
                        <div className="cart-one__list__content">
                          <h3 className="cart-one__list__title">{item.title}</h3>
                          <span className="cart-one__list__text">
                            {item._typeOrBrand}
                            {item.fit ? ` | ${item.fit}` : ""}
                            {item.size ? ` | ${item.size}` : ""}
                            {item.color ? ` | ${item.color}` : ""}
                          </span>
                          <div className="cart-one__list__amount">
                            ৳{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="cart-one__list__right">
                        <div className="quantity-box">
                          <button
                            type="button"
                            onClick={() => {
                              setCartItems((prev) =>
                                prev.map((x) =>
                                  (x.productId ?? x.id) === item.productId
                                    ? { ...x, quantity: Math.max(1, toNum(x.quantity ?? x.qty ?? x.count) - 1) }
                                    : x
                                )
                              );
                            }}
                            className="sub"
                          >
                            <i className="fa fa-minus" />
                          </button>
                          <input type="text" readOnly value={item.quantity} />
                          <button
                            type="button"
                            onClick={() => {
                              setCartItems((prev) =>
                                prev.map((x) =>
                                  (x.productId ?? x.id) === item.productId
                                    ? { ...x, quantity: toNum(x.quantity ?? x.qty ?? x.count) + 1 }
                                    : x
                                )
                              );
                            }}
                            className="add"
                          >
                            <i className="fa fa-plus" />
                          </button>
                        </div>
                        <div className="cart-one__list__close">
                          <button
                            onClick={() =>
                              setCartItems((prev) => prev.filter((x) => (x.productId ?? x.id) !== item.productId))
                            }
                            className="remove-btn"
                            style={{ background: "none", border: "none" }}
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

          {/* summary + pay */}
          <div className="col-xl-4">
            <div className="order-summary">
              <div className="order-summary__top">
                <span className="order-summary__top__title">Have a coupon code?</span>
                <div className="input__coupon__box">
                  <input
                    type="text"
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
                <li><span className="order-summary__text">Total Price</span><span className="order-summary__text">৳{summary.total.toFixed(2)}</span></li>
                <li><span className="order-summary__text">Discount {appliedCoupon ? `(${appliedCoupon})` : ""}</span><span className="order-summary__text">-৳{summary.discount.toFixed(2)}</span></li>
                <li><span className="order-summary__text">Tax & Fee</span><span className="order-summary__text">৳{summary.tax.toFixed(2)}</span></li>
              </ul>

              <div className="order-summary__total">
                <h3 className="order-summary__total__text">Total Price</h3>
                <h3 className="order-summary__total__amount">৳{summary.grandTotal.toFixed(2)}</h3>
              </div>


              <button
                disabled={pending || sanitizedCart.length === 0 || !selectedId || !(summary.grandTotal > 0)}
                onClick={() =>
                  start(async () => {
                    try {
                      const payload = {
                        items: sanitizedCart.map((i) => ({
                          productId: i.productId,
                          title: i.title,
                          price: i.price,
                          quantity: i.quantity,
                          color: i.color,
                          fit: i.fit,
                          size: i.size,
                        })),
                        couponCode: (appliedCoupon || "").toUpperCase(),
                        userId: user?.id,
                        addressId: selectedId,
                      };
                      const { url } = await createCheckoutSession(payload);
                      // ✅ Clear cart from localStorage after payment session is created
        localStorage.removeItem("cart");
        localStorage.removeItem("checkoutMeta");
        
                      window.location.href = url;
                    } catch (err) {
                      console.error(err);
                      alert(err?.message || "Payment init failed");
                    }
                  })
                }
                className="commerce-btn"
              >
                {pending ? "Redirecting…" : `Pay ৳${summary.grandTotal.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPageTwo;
