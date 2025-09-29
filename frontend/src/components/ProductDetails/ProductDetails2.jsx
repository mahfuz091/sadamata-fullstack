"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// --------------- Helpers ---------------
const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE || ""; // e.g. https://cdn.example.com


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

  const initialFit = product?.variants?.[0]?.fitType || "MEN";
  const [fit, setFit] = useState(initialFit);
  const [size, setSize] = useState("S");

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

  return (
    <section className="product-details py-5">
      <Container>
        {/* Breadcrumbs */}
        <div className="product-header-top mb-3">
          <ul className="commerce-breadcrumb list-unstyled ">
            <li><a href="/">Home</a></li>
            {/* <li><a href="#">T-Shirts</a></li> */}
            <li><span>{product?.title || "Product"}</span></li>
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
                {galleryImages.map(({ src, alt, key }, idx) => (
                    
                  <SwiperSlide key={key}>
                    <div className="product-details__image">
                      <Image
                        src={`http://localhost:3001${src}`}
                        alt={alt}
                    className="img-fluid"
                        width={900}
                        height={900}
                        priority={idx === 0}
                        unoptimized
                      />
                    </div>
                  </SwiperSlide>
                ))}
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
                {galleryImages.map(({ src, alt, key, color }, idx) => (
                  <SwiperSlide key={`${key}-thumb`} 
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
                             src={`http://localhost:3001${src}`}
                        alt={`${alt} thumbnail`}
                        className="img-fluid"
                        width={200}
                        height={200}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </Col>

          {/* -------- Right: Content & Controls -------- */}
          <Col lg={6}>
            <div className="product-details__content">
              <p className="product-details__brand-name">
                Brand: <span>{product?.Brand?.name || product?.brandName || "—"}</span>
              </p>
              <h4 className="product-details__title">{product?.title || "Untitled"}</h4>
              <p className="product-details__status">
                Status: <span>{product?.isActive ? "In Stock" : "Unavailable"}</span>
              </p>

              {!!(product?.features?.length) && (
                <div className="populer-feature">
                  <h4 className="populer-feature__title">Product Features</h4>
                  <ul className="populer-feature__list list-unstyled">
                    {product.features.map((f) => (
                      <li key={f.id}><i className="fas fa-check-circle" /> {f.content}</li>
                    ))}
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
                    <input type="text" value={quantity} readOnly aria-live="polite" />
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
                  <h4 className="product-details__box__title">Product Size:</h4>
                  <select
                    className="form-select"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                  >
                    {["S", "M", "L", "XL", "XXL", "3XL"].map((ft) => (
                      <option key={ft} value={ft}>{ft}</option>
                    ))}
                  </select>
                </div>
                <div className="product-details__size">
                  <h4 className="product-details__box__title">Fit Type:</h4>
                  <select
                    className="form-select"
                    value={fit}
                    onChange={(e) => setFit(e.target.value)}
                  >
                    {["MEN", "WOMEN", "YOUTH"].map((ft) => (
                      <option key={ft} value={ft}>{ft}</option>
                    ))}
                  </select>
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
                            if (mainSwiperRef.current) mainSwiperRef.current.slideTo(idx);
                            if (thumbsSwiper?.slideTo) thumbsSwiper.slideTo(idx);
                          }
                        }}
                        aria-label={`Select color ${hexToName(c)}`}
                        title={hexToName(c)}
                        style={{
                          backgroundColor: c,
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          border: color === c ? "2px solid #111" : "1px solid #ccc",
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
                <span>{product?.price != null ? `$${product.price}` : ""}</span>
              </div>

              {/* CTA */}
              <div className="product-details__btn">
                <div className="product-details__btn__item">
                  <button className="commerce-btn">
                    Add to Cart <i className="icon-right-arrow"></i>
                  </button>
                </div>
                <div className="product-details__btn__item">
                  <button className="product-details__btn__info" aria-label="Add to wishlist">
                    <i className="far fa-heart"></i>
                  </button>
                </div>
                <div className="product-details__btn__item">
                  <button className="product-details__btn__info" aria-label="Share">
                    <i className="fas fa-share-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
