"use client";

import { Container, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { useState } from "react";
import product1 from "@/assets/images/products/product-d-1-1.png";
import user1 from "@/assets/images/resources/user-1-2.png";
import Image from "next/image";

export default function ProductDetails({product}) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);
  return (
    <>
      <section className="product-details py-5">
        <Container>
          <div className="product-header-top mb-3">
            <ul className="commerce-breadcrumb list-unstyled d-flex gap-2">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="#">Electronic</a>
              </li>
              <li>
                <span>Search Results</span>
              </li>
            </ul>
          </div>

          <Row>
            {/* Product Images */}
            <Col lg={6}>
              <div className="product-details__product">
                {/* Main Carousel */}
                <Swiper
                  modules={[Navigation, Thumbs]}
                  navigation
                  thumbs={{ swiper: thumbsSwiper }}
                  className="product-details__carousel mb-3"
                >
                  {[1, 2, 3, 4].map((i) => (
                    <SwiperSlide key={i}>
                      <div className="product-details__image">
                        <Image
                          src={product1}
                          alt={`product ${i}`}
                          className="img-fluid"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Thumbnail Carousel */}
                <Swiper
                  onSwiper={setThumbsSwiper}
                  slidesPerView={4}
                  spaceBetween={10}
                  watchSlidesProgress
                  className="product-details__thumb"
                >
                  {[1, 2, 3, 4, 1, 2, 3, 4].map((i, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="product-details__thumb__item">
                        <Image
                          src={product1}
                          alt={`thumb ${i}`}
                          className="img-fluid"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </Col>

            {/* Product Content */}
            <Col lg={6}>
              <div className="product-details__content">
                <p className="product-details__brand-name">
                  Brand: <span>Disney-Shirt</span>
                </p>
                <h4 className="product-details__title">
                  Disney The Lion King Scar I'm Surrounded Premium T-Shirt
                </h4>
                <p className="product-details__status">
                  Status: <span>In Stock</span>
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

                {/* Features */}
                <div className="populer-feature">
                  <h4 className="populer-feature__title">Product Features</h4>
                  <ul className="populer-feature__list list-unstyled">
                    <li>
                      <i className="fas fa-check-circle"></i> Countertop basin
                    </li>
                    <li>
                      <i className="fas fa-check-circle"></i> Made from stone
                      resin
                    </li>
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

                {/* Quantity, Size & Color */}
                <div className="product-details__box">
                  <div className="product-details__quantity">
                    <h4 className="product-details__box__title">Quantity:</h4>
                    <div className="product-details__quantity__box">
                      <button
                        type="button"
                        className="sub"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <i className="fas fa-angle-up"></i>
                      </button>
                      <input type="text" value={quantity} readOnly />
                      <button
                        type="button"
                        className="add"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <i className="fas fa-angle-down"></i>
                      </button>
                    </div>
                  </div>

                  <div className="product-details__size">
                    <h4 className="product-details__box__title">
                      Product Size:
                    </h4>
                    <select className="form-select">
                      <option>M</option>
                      <option>L</option>
                      <option>XL</option>
                      <option>XXL</option>
                    </select>
                  </div>
                  <div className="product-details__size ">
                    <h4 className="product-details__box__title">Fit Type:</h4>
                    <select className="form-select">
                      <option>MEN</option>
                      <option>WOMEN</option>
                      <option>YOUTH</option>
                    </select>
                  </div>

                  <div className="product-details__color">
                    <h4 className="product-details__box__title">Colors:</h4>
                    <div className="d-flex gap-2">
                      {[
                        "#131921",
                        "#62D9BB",
                        "#AFCEE2",
                        "#952523",
                        "#472E67",
                        "#E6638F",
                        "#2A73E9",
                        "#B9DBF1",
                      ].map((c, i) => (
                        <span
                          key={i}
                          style={{
                            backgroundColor: c,
                            width: "25px",
                            height: "25px",
                            borderRadius: "50%",
                            display: "inline-block",
                            cursor: "pointer",
                          }}
                        ></span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price & Buttons */}
                <div className="product-details__price">
                  <span>$1500.00</span>
                  <del>$ 100.00</del>
                </div>
                <div className="product-details__btn">
                  <div className="product-details__btn__item">
                    <a href="#" className="commerce-btn">
                      Add to Cart <i className="icon-right-arrow"></i>
                    </a>
                  </div>
                  <div className="product-details__btn__item">
                    <a href="#" className="product-details__btn__info">
                      <i className="far fa-heart"></i>
                    </a>
                  </div>
                  <div className="product-details__btn__item">
                    <a href="#" className="product-details__btn__info">
                      <i className="fas fa-share-alt"></i>
                    </a>
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
                  Disney The Lion King Scar I'm Surrounded Premium T-Shirt
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
                      <circle cx="42" cy="42" r="37" stroke="#e6e9ee" strokeWidth="6" fill="none" />
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
                            <span style={{ width: `${widths[index]}%` }}></span>
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
                      Rating <i className="icon-reshot-icon-arrow-chevron-right-WDGHUKQ634"></i>
                    </a>
                    <ul className="sidebar__menu__sub-menu list-unstyled">
                      {[5, 4, 3, 2, 1].map((star, i) => (
                        <li className="checkbox" key={star}>
                          <input type="checkbox" name="filter" id={`rating${i === 0 ? '' : i}`} />
                          <label htmlFor={`rating${i === 0 ? '' : i}`}>
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
                      Review Topics <i className="icon-reshot-icon-arrow-chevron-right-WDGHUKQ634"></i>
                    </a>
                    <ul className="sidebar__menu__sub-menu list-unstyled">
                      {[
                        'Product Quality',
                        'Sk Brand',
                        'Seller Services',
                        'Product Price',
                        'Shipment',
                        'Match with Description',
                      ].map((topic, i) => (
                        <li className="checkbox" key={topic}>
                          <input type="checkbox" name="filter" id={`brand${i === 0 ? '' : i}`} />
                          <label htmlFor={`brand${i === 0 ? '' : i}`}>
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
                    <p className="product-reviews__user__text">This is amazing product I have.</p>
                    <span className="product-reviews__user__date">July 2, 2020 03:29 PM</span>
                    <div className="product-reviews__user__avatar">
                      <div className="product-reviews__user__info">
                        <Image
                          src={user1}
                          width={50}
                          height={50}
                          alt="User Avatar"
                        />
                        <h5 className="product-reviews__user__name">Darrell Steward</h5>
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
                  <li><a className="active" href="#">1</a></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">...</a></li>
                  <li><a href="#">19</a></li>
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
