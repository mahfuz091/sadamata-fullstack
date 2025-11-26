"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import item1 from "@/assets/images/products/item-1-1.png";
import item2 from "@/assets/images/products/item-1-2.png";
import item3 from "@/assets/images/products/item-1-3.png";
import item4 from "@/assets/images/products/item-1-4.png";
import item5 from "@/assets/images/products/item-1-5.png";
import { Col, Container, Row } from "react-bootstrap";

// Swiper (dots only)
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const products = [
  {
    id: 1,
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
    price: "$17.95",
    rating: 4.9,
    reviews: 65,
    image: item1,
  },
  {
    id: 2,
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
    price: "$17.95",
    rating: 4.9,
    reviews: 65,
    image: item2,
  },
  {
    id: 3,
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
    price: "$17.95",
    rating: 4.9,
    reviews: 65,
    image: item3,
  },
  {
    id: 4,
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
    price: "$17.95",
    rating: 4.9,
    reviews: 65,
    image: item4,
  },
  {
    id: 5,
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
    price: "$17.95",
    rating: 4.9,
    reviews: 65,
    image: item5,
  },
];

const RelatedProducts = () => {
  return (
    <div className="product-slider mt-5">
      <Container>
        <div className="product-slider__top">
          <h2 className="product-slider__title">Related Product</h2>
          <div className="product-slider__btn">
            <Link href="/product" className="inline-flex items-center gap-2">
              See All Product <i className="icon-right-arrow" />
            </Link>
          </div>
        </div>

        <div className="product-slider__carousel commerce-swiper__carousel">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            loop
            speed={300}
            spaceBetween={24}
            breakpoints={{
              // >= 0px
              0: { slidesPerView: 1, slidesPerGroup: 1 },
              // >= 480px
              480: { slidesPerView: 1, slidesPerGroup: 1 },
              // >= 600px
              600: { slidesPerView: 2, slidesPerGroup: 1 },
              // >= 1024px
              1024: { slidesPerView: 3, slidesPerGroup: 1 },
              // >= 1280px (desktop default similar to 4x in slick)
              1280: { slidesPerView: 4, slidesPerGroup: 1 },
            }}
            className=""
          >
            {products.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="item">
                  <div className="product__item">
                    <div className="product__item__img">
                      <Link href="#" className="product__item__img__item">
                        <Image src={item.image} alt="product image" />
                      </Link>
                      <div className="product__item__btn">
                        <Link href="/cart" aria-label="Add to wishlist">
                          <i className="far fa-heart" />
                        </Link>
                      </div>
                    </div>
                    <div className="product__item__content">
                      <p className="product__item__brand">
                        Brand: <Link href="#">{item.brand}</Link>
                      </p>
                      <h4 className="product__item__title">
                        <Link href="/product-details">{item.title}</Link>
                      </h4>
                      <div className="product__item__box">
                        <div className="product__item__price">{item.price}</div>
                        <div className="product__item__ratings">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <span>
                            {item.rating} ({item.reviews})
                          </span>
                        </div>
                      </div>
                      <Link href="/cart" className="commerce-btn product__item__link">
                        Add to Cart <i className="icon-right-arrow" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>
    </div>
  );
};

export default RelatedProducts;
