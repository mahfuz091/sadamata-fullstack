"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Select from "react-select";
import { Container, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import user1 from "@/assets/images/resources/user-1-2.png";
// --------------- Helpers ---------------
const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL ;

const getBase = () => {
  if (ASSET_BASE) return ASSET_BASE.replace(/\/+$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
};

export const toPublicUrl = (path) => {
  if (!path) return `/uploads/placeholder.png`;
  const rel = path.replace(/^\/+/, "");

  return `${ASSET_BASE}/${rel}`;
};

const hexToName = (hex) => {
  const map = {
    "#000": "Black",
    "#000000": "Black",
    "#fff": "White",
    "#ffffff": "White",
    "#000080": "Navy",
    "#807e78": "Stone",
  };
  return map[hex?.toLowerCase?.()] ?? hex?.toUpperCase?.() ?? "Unknown";
};

const groupByFit = (variants = []) =>
  variants.reduce(
    (acc, v) => {
      const key = v?.fitType || "MEN";
      (acc[key] ||= []).push(v);
      return acc;
    },
    { MEN: [], WOMEN: [], YOUTH: [] }
  );

const colorsForFit = (vs = []) => {
  const seen = new Set();
  const list = [];
  vs.forEach((v) => {
    if (v?.color && !seen.has(v.color)) {
      seen.add(v.color);
      list.push(v.color);
    }
  });
  return list;
};

// --------------- Component ---------------
export default function ProductDetails2({ product }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const mainSwiperRef = useRef(null);

  const grouped = useMemo(
    () => groupByFit(product?.variants || []),
    [product?.variants]
  );
  const availableFits = useMemo(
  () => ["MEN", "WOMEN", "YOUTH"].filter((k) => (grouped[k] || []).length > 0),
  [grouped]
);

  // const initialFit = product?.variants?.[0]?.fitType || "MEN";
  // const [fit, setFit] = useState(initialFit);
  const initialFit = availableFits[0] || "MEN";
const [fit, setFit] = useState(initialFit);
  const [size, setSize] = useState("S");
  useEffect(() => {
  if (!availableFits.length) return;
  setFit((prev) => (availableFits.includes(prev) ? prev : availableFits[0]));
}, [availableFits]);

  const fitVariants = grouped[fit] || [];
  const fitColors = useMemo(() => colorsForFit(fitVariants), [fitVariants]);
  const [color, setColor] = useState(fitColors[0] || "#000");

  // keep selected color valid as fit/colors change
  useEffect(() => {
    if (!fitColors.length) return;
    setColor((prev) => (fitColors.includes(prev) ? prev : fitColors[0]));
  }, [fitColors]);

  const currentVariant =
    fitVariants.find((v) => v.color === color) || fitVariants[0] || null;

  // Rule: MEN + exactly 4 colors => show all MEN colors (front only)
  //   const showAllForFit = fit === "MEN" && fitColors.length === 4;
  const showAllForFit = fitColors.length;

  // Build gallery (front-only) + color -> slide index
  const { galleryImages, colorToIndex } = useMemo(() => {
    if (!fitVariants.length) return { galleryImages: [], colorToIndex: {} };

    if (showAllForFit) {
      let slideIndex = 0;
      const map = {};
      const imgs = [];

      fitVariants.forEach((v) => {
        if (v.frontImg) {
          if (!(v.color in map)) map[v.color] = slideIndex;
          imgs.push({
            src: v.frontImg,
            alt: `MEN ${hexToName(v.color)} – Front`,
            key: `${v.id}-front`,
            color: v.color,
          });
          slideIndex += 1;
        }
      });

      return { galleryImages: imgs, colorToIndex: map };
    }

    // only the selected variant’s front image
    return currentVariant?.frontImg
      ? {
          galleryImages: [
            {
              src: currentVariant.frontImg,
              alt: `${fit} ${hexToName(color)} – Front`,
              key: `selected-${currentVariant.id}-front`,
              color,
            },
          ],
          colorToIndex: { [color]: 0 },
        }
      : { galleryImages: [], colorToIndex: {} };
  }, [fit, fitVariants, color, showAllForFit, currentVariant]);

  // Reset to first slide when fit/mode changes
  useEffect(() => {
    if (mainSwiperRef.current) mainSwiperRef.current.slideTo(0, 0);
  }, [fit, showAllForFit]);

  // Jump to clicked color’s slide when showing-all mode is active
  useEffect(() => {
    if (!showAllForFit) return;
    const idx = colorToIndex[color] ?? 0;
    if (mainSwiperRef.current) mainSwiperRef.current.slideTo(idx, 0);
    if (thumbsSwiper?.slideTo) thumbsSwiper.slideTo(idx, 0);
  }, [color, showAllForFit, colorToIndex, thumbsSwiper]);

  const [quantity, setQuantity] = useState(1);
  console.log(galleryImages, "galleryImages");

  // --------------- Cart Helper ---------------
const addToCart = (product, options) => {
  if (typeof window === "undefined") return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const item = {
    id: product?.id,
    title: product?.title,
    brand: product?.Brand?.name || product?.brandName || "—",
    price: product?.price,
    quantity: options.quantity,
    color: options.color,
    fit: options.fit,
    size: options.size,
    image: options.image, // 👈 correct front image for chosen fit + color
  };

  const existingIndex = cart.findIndex(
    (p) =>
      p.id === item.id &&
      p.color === item.color &&
      p.fit === item.fit &&
      p.size === item.size
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "/cart";
};


const fitOptions = useMemo(
  () => availableFits.map((f) => ({ value: f, label: f })),
  [availableFits]
);

// keep it controlled (same as your native select)
const selectedFitOption =
  fitOptions.find((o) => o.value === fit) ?? null;
console.log(fit, 'fit')
  return (
    <>
      <section className="product-details py-5">
        <Container>
          {/* Breadcrumbs */}
          <div className="product-header-top mb-3">
            <ul className="commerce-breadcrumb list-unstyled ">
              <li>
                <a href="/">Home</a>
              </li>
              {/* <li><a href="#">T-Shirts</a></li> */}
              <li>
                <span>{product?.title || "Product"}</span>
              </li>
            </ul>
          </div>

          <Row>
            {/* -------- Left: Gallery (front-only) -------- */}
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="product-details__product">
                {/* Main Carousel */}
                <Swiper
                  modules={[Navigation, Thumbs]}
                  navigation
                  // thumbs={{ swiper: thumbsSwiper }}
                  thumbs={
                    thumbsSwiper && !thumbsSwiper.destroyed
                      ? { swiper: thumbsSwiper }
                      : undefined
                  }
                  className="product-details__carousel mb-3"
                  onSwiper={(s) => (mainSwiperRef.current = s)}
                  key={`${fit}-${showAllForFit ? "all" : "one"}`}
                >
                  {galleryImages.map(({ src, alt, key }, idx) =>{
                    const rel = (src || "").replace(/^\/+/, ""); // strip leading slash
  const imgSrc = rel ? `${ASSET_BASE}/${rel}` : `${ASSET_BASE}/uploads/placeholder.png`;

                    return (

                    <SwiperSlide key={key}>
                      <div className="product-details__image">
                        <Image
                          src={imgSrc}
                          alt={alt}
                          className="img-fluid overflow-hidden"
                          width={720}
                          height={620}
                          priority={idx === 0}
                          unoptimized
                        />
                      </div>
                    </SwiperSlide>
                  )
                  } )}
                </Swiper>

                {/* Thumbnails */}
                <Swiper
                  onSwiper={setThumbsSwiper}
                  slidesPerView={4}
                  spaceBetween={10}
                  watchSlidesProgress
                  className="product-details__thumb"
                  freeMode
                >
                  {galleryImages.map(({ src, alt, key, color }, idx) => {
                    const rel = (src || "").replace(/^\/+/, ""); // strip leading slash
                    const imgSrc = rel ? `${ASSET_BASE}/${rel}` : `${ASSET_BASE}/uploads/placeholder.png`;
                    return(
                    <SwiperSlide
                      key={`${key}-thumb`}
                      onClick={() => {
                        // manually sync both swipers and selected color
                        mainSwiperRef.current?.slideTo(idx);
                        thumbsSwiper?.slideTo?.(idx);
                        setColor(color);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="product-details__thumb__item">
                        <Image
                          src={imgSrc}
                          alt={`${alt} thumbnail`}
                          className="img-fluid"
                          width={200}
                          height={200}
                        />
                      </div>
                    </SwiperSlide>
                  )
                  }
                  )}
                </Swiper>
              </div>
            </Col>

            {/* -------- Right: Content & Controls -------- */}
            <Col lg={6}>
              <div className="product-details__content">
                <p className="product-details__brand-name">
                  Brand:{" "}
                  <span>
                    {product?.Brand?.name || product?.brandName || "—"}
                  </span>
                </p>
                <h4 className="product-details__title">
                  {product?.title || "Untitled"}
                </h4>
                <p className="product-details__status">
                  Status:{" "}
                  <span>{product?.isActive ? "In Stock" : "Unavailable"}</span>
                </p>

                {/* Rating */}
                <div className="product-details__start">
                  <div className="product-details__start__item">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                    <span>(120 Reviews)</span>
                  </div>
                  <p className="product-details__start__text">
                    <span>150,000+ Satisfied</span> Customers Worldwide!
                  </p>
                </div>

                {!!product?.features?.length && (
                  <div className="populer-feature">
                    <h4 className="populer-feature__title">Product Features</h4>
                    <ul className="populer-feature__list list-unstyled">
                      {product.features.map((f) => (
                        <li key={f.id}>
                          <i className="fas fa-check-circle" /> {f.content}
                        </li>
                      ))}
                      <li>
                      <i className="fas fa-check-circle"></i> Stunning matt
                      finish
                    </li>
                    <li>
                      <i className="fas fa-check-circle"></i> W500 x D340 x
                      H168mm
                    </li>
                    <li>
                      <i className="fas fa-check-circle"></i> Lifetime guarantee
                    </li>
                    <li>
                      <i className="fas fa-check-circle"></i> No overflow - use
                      unslotted basin waste
                    </li>
                    </ul>
                  </div>
                )}

                {/* Fit selector */}
                <div className="product-details__box">
                  {/* Quantity */}
                  <div className="product-details__quantity ">
                    <h4 className="product-details__box__title">Quantity:</h4>
                    <div className="product-details__quantity__box">
                      <button
                        type="button"
                        className="sub"
                        onClick={() => setQuantity((q) => q + 1)}
                        aria-label="Increase quantity"
                      >
                        <i className="fas fa-angle-up"></i>
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        readOnly
                        aria-live="polite"
                      />
                      <button
                        type="button"
                        className=" add"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        aria-label="Decrease quantity"
                      >
                        <i className="fas fa-angle-down"></i>
                      </button>
                    </div>
                  </div>
                  <div className="product-details__size">
                    <h4 className="product-details__box__title">
                      Product Size:
                    </h4>
                    <select
                      className="form-select"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                    >
                      {["S", "M", "L", "XL", "XXL", "3XL"].map((ft) => (
                        <option key={ft} value={ft}>
                          {ft}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="product-details__size">
                    <h4 className="product-details__box__title">Fit Type:</h4>
                    
                   
    {/* <select
      className="form-select"
      value={fit}
      onChange={(e) => setFit(e.target.value)}
    >
      {availableFits.map((ft) => (
        <option key={ft} value={ft}>
          {ft}
        </option>
      ))}
    </select> */}
    <Select
  className="fit-select"
  classNamePrefix="fit"
  options={fitOptions}
  value={selectedFitOption}
  onChange={(opt) => setFit(opt?.value ?? fitOptions[0]?.value ?? "")}
  isSearchable={false}
  // orange theming for hover/selected states
  styles={{
    control: (base, state) => ({
      ...base,
      minHeight: 38,
      borderColor: state.isFocused ? "#ff8a00" : base.borderColor,
      boxShadow: state.isFocused ? "0 0 0 1px #ff8a00" : "none",
      ":hover": { borderColor: "#ff8a00" }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#ff8a00" // selected bg
        : state.isFocused
        ? "rgba(255,138,0,0.15)" // hover bg
        : "transparent",
      color: state.isSelected ? "#fff" : "#111",
      ":active": {
        backgroundColor: state.isSelected
          ? "#ff8a00"
          : "rgba(255,138,0,0.25)"
      }
    }),
    menu: (base) => ({ ...base, zIndex: 10 }),
    singleValue: (base) => ({ ...base, color: "#111" }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? "#ff8a00" : base.color,
      ":hover": { color: "#ff8a00" }
    })
  }}
/>
  
                  </div>

                  {/* Color swatches */}
                  <div className="product-details__color">
                    <h4 className="product-details__box__title">Colors:</h4>
                    <div className="d-flex gap-2 flex-wrap">
                      {fitColors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setColor(c);
                            if (showAllForFit) {
                              const idx = colorToIndex[c] ?? 0;
                              if (mainSwiperRef.current)
                                mainSwiperRef.current.slideTo(idx);
                              if (thumbsSwiper?.slideTo)
                                thumbsSwiper.slideTo(idx);
                            }
                          }}
                          aria-label={`Select color ${hexToName(c)}`}
                          title={hexToName(c)}
                          style={{
                            backgroundColor: c,
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            border:
                              color === c ? "2px solid #111" : "1px solid #ccc",
                            outline: "none",
                            cursor: "pointer",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="product-details__price mt-3">
                  <span>
                    {product?.price != null ? `$${product.price}` : ""}
                  </span>
                </div>

                {/* CTA */}
                <div className="product-details__btn">
                  <div className="product-details__btn__item">
                    <button className="commerce-btn" onClick={() =>
                      addToCart(product, {
                        quantity,
                        color,
                        fit,
                        size,
                        image: currentVariant?.frontImg || "",
                      })
                    }>
                      Add to Cart <i className="icon-right-arrow"></i>
                    </button>
                  </div>
                  <div className="product-details__btn__item">
                    <button
                      className="product-details__btn__info"
                      aria-label="Add to wishlist"
                    >
                      <i className="far fa-heart"></i>
                    </button>
                  </div>
                  <div className="product-details__btn__item">
                    <button
                      className="product-details__btn__info"
                      aria-label="Share"
                    >
                      <i className="fas fa-share-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="product-info">
        <Container>
          <div className="product-info__tabs">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="active"
                  id="home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#home"
                  type="button"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true"
                >
                  Detail Product
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile"
                  type="button"
                  role="tab"
                  aria-controls="profile"
                  aria-selected="false"
                >
                  Report an Issue with this Product or Seller
                </button>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="home"
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                <h2 className="product-info__title">
                   {product?.title || "Untitled"}
                </h2>
                <p className="product-info__text">
                  After tragically losing his father, King Mufasa to his
                  treacherous uncle Scar, Simba narrowly escapes a hyena attack
                  and flees for his life. Simba might be growing up in exile,
                  but he isn’t alone. Along with his two best friends, Timon the
                  meerkat and Pumbaa the warthog, life is pretty good. But his
                  past won’t stay hidden forever, and their peaceful existence
                  is shattered when childhood friend Nala stumbles upon the trio
                  while hunting for food. When he hears the kingdom is starving
                  and his family believes him dead, Simba must decide if he can
                  go back, face his fears, and fulfill his destiny as his
                  father’s heir. Get your officially Licensed The Lion King
                  graphic tees, hoodies, sweatshirts and more!
                </p>
                <div className="product-info__list__info">
                  <h3 className="product-info__list__title">About this item</h3>
                  <ul className="product-info__list">
                    <li>
                      Officially Licensed Disney The Lion King Apparel for Women
                      - Men - Youth - Toddler; Disney Villains T-Shirt; Holiday;
                      Seasonal; Christmas; Vintage; Disneyland; Disney+; Disney
                      Plus; Disney World; Present; Birthday; Scar T-Shirt; Lion;
                      Hyena;
                    </li>
                    <li>15PXLK061</li>
                    <li>
                      Lightweight, Classic fit, Double-needle sleeve and bottom
                      hem
                    </li>
                  </ul>
                </div>
                <div className="product-info__list__info">
                  <h3 className="product-info__list__title">Product details</h3>
                  <ul className="product-info__list">
                    <li>
                      <span>Fabric type :</span> Solid colors: 100% Cotton;
                      Heather Grey: 90% Cotton, 10% Polyester; Dark Heather and
                      Heather Blue: 50% Cotton, 50% Polyester; OR Dark Heather,
                      Heather Blue and All Other Heathers: 65% Polyester, 35%
                      Cotton; Girls' Heathers: 60% Cotton, 40% Polyester
                    </li>
                    <li>
                      <span>Care instructions :</span> Machine Wash
                    </li>
                    <li>
                      <span>Closure type :</span>Pull On
                    </li>
                    <li>
                      <span>Date First Available :</span> September 11, 2017
                    </li>
                    <li>
                      <span>Manufacturer :</span> Disney
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="profile"
                role="tabpanel"
                aria-labelledby="profile-tab"
              >
                <div className="product-info__form-box">
                  <h3 className="product-info__form-box__title">
                    Please tell us about the issue
                  </h3>
                  <form action="#" className="form-one">
                    <div className="form-one__group">
                      <div className="form-one__control form-one__control--full">
                        <label htmlFor="words" className="form-one__label">
                          What is the issue?
                        </label>
                        <div className="form-one__input-box">
                          <textarea
                            name="massage"
                            id="words"
                            placeholder="Write your issue.."
                          ></textarea>
                        </div>
                      </div>
                      <div className="form-one__control form-one__control--full">
                        <div className="product-info__form-box__btn">
                          <button type="submit" className="commerce-btn">
                            Submit Now <i className="icon-right-arrow"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="product-reviews">
        <div className="product-reviews__top">
          <div className="container">
            <h2 className="circle-rating__title">Product Reviews</h2>
            <div className="product-reviews__inner">
              <div className="row">
                <div className="col-lg-5">
                  <div className="rating-card">
                    <div className="circle-rating">
                      <svg width="84" height="84">
                        <circle
                          cx="42"
                          cy="42"
                          r="37"
                          stroke="#e6e9ee"
                          strokeWidth="6"
                          fill="none"
                        />
                        <circle
                          cx="42"
                          cy="42"
                          r="37"
                          stroke="#ffaa34"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray="190"
                          strokeDashoffset="9.3"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="number">4.8</div>
                    </div>
                    <div className="circle-rating__content">
                      <div className="circle-rating__start">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                      <p className="circle-rating__text">from 1,25k reviews</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-7">
                  <div className="rating-card__right">
                    {[5, 4, 3, 2, 1].map((rating, index) => {
                      const widths = [90, 70, 40, 0, 0];
                      const counts = [2823, 38, 4, 0, 0];
                      return (
                        <div className="rating-row" key={rating}>
                          <div className="rating-label">
                            <span>{rating}.0 </span>
                            <i className="fas fa-star"></i>
                          </div>
                          <div className="rating-bar-container">
                            <div className="rating-bar">
                              <span
                                style={{ width: `${widths[index]}%` }}
                              ></span>
                            </div>
                          </div>
                          <div className="rating-count">{counts[index]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="product-reviews__bottom">
          <div className="container">
            <div className="product-reviews__inner-box">
              {/* Filter Sidebar */}
              <div className="product-reviews__filter">
                <aside className="sidebar__menu">
                  <div className="sidebar__menu__header">
                    <h3 className="sidebar__menu__title">Reviews Filter</h3>
                  </div>
                  <ul className="sidebar__menu__area list-unstyled">
                    {/* Rating Filter */}
                    <li className="sidebar__menu__area__item">
                      <a href="#" className="sidebar__menu__title">
                        Rating{" "}
                        <i className="icon-reshot-icon-arrow-chevron-right-WDGHUKQ634"></i>
                      </a>
                      <ul className="sidebar__menu__sub-menu list-unstyled">
                        {[5, 4, 3, 2, 1].map((star, i) => (
                          <li className="checkbox" key={star}>
                            <input
                              type="checkbox"
                              name="filter"
                              id={`rating${i === 0 ? "" : i}`}
                            />
                            <label htmlFor={`rating${i === 0 ? "" : i}`}>
                              <span></span>
                              <i className="fas fa-star"></i>
                              {star}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </li>

                    {/* Review Topics Filter */}
                    <li className="sidebar__menu__area__item">
                      <a href="#" className="sidebar__menu__title">
                        Review Topics{" "}
                        <i className="icon-reshot-icon-arrow-chevron-right-WDGHUKQ634"></i>
                      </a>
                      <ul className="sidebar__menu__sub-menu list-unstyled">
                        {[
                          "Product Quality",
                          "Sk Brand",
                          "Seller Services",
                          "Product Price",
                          "Shipment",
                          "Match with Description",
                        ].map((topic, i) => (
                          <li className="checkbox" key={topic}>
                            <input
                              type="checkbox"
                              name="filter"
                              id={`brand${i === 0 ? "" : i}`}
                            />
                            <label htmlFor={`brand${i === 0 ? "" : i}`}>
                              <span></span>
                              {topic}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </aside>
              </div>

              {/* Review List Section */}
              <div className="product-reviews__user">
                <div className="review-header">
                  <h2 className="review-title">Review Lists</h2>
                  <div className="review-filters">
                    <button className="filter-tab active">All Reviews</button>
                    <button className="filter-tab">With Photo & Video</button>
                    <button className="filter-tab">With Description</button>
                  </div>
                </div>

                <div className="product-reviews__user__list">
                  {[1, 2, 3].map((_, index) => (
                    <div className="product-reviews__user__item" key={index}>
                      <div className="product-reviews__user__star">
                        {[...Array(5)].map((_, i) => (
                          <i className="fas fa-star" key={i}></i>
                        ))}
                      </div>
                      <p className="product-reviews__user__text">
                        This is amazing product I have.
                      </p>
                      <span className="product-reviews__user__date">
                        July 2, 2020 03:29 PM
                      </span>
                      <div className="product-reviews__user__avatar">
                        <div className="product-reviews__user__info">
                          <Image
                            src={user1}
                            width={50}
                            height={50}
                            alt="User Avatar"
                          />
                          <h5 className="product-reviews__user__name">
                            Darrell Steward
                          </h5>
                        </div>
                        <div className="product-reviews__user__action">
                          <button className="product-reviews__user__action__btn">
                            <i className="fas fa-thumbs-up"></i> 128
                          </button>
                          <button className="product-reviews__user__action__btn">
                            <i className="fas fa-thumbs-down"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="product-reviews__user__pagination">
                  <ul className="list-unstyled">
                    <li>
                      <a className="active" href="#">
                        1
                      </a>
                    </li>
                    <li>
                      <a href="#">2</a>
                    </li>
                    <li>
                      <a href="#">...</a>
                    </li>
                    <li>
                      <a href="#">19</a>
                    </li>
                    <li>
                      <a className="next-page" href="#">
                        <i className="icon-reshot-icon-arrow-chevron-right-WDGHUKQ634"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
