// components/HistoryProductSection.js
"use client";

import Image from "next/image";
import Slider from "react-slick";
import { Container } from "react-bootstrap";
import { useRef } from "react";

// Import a demo image – replace or map real images later
import productImg from "@/assets/images/products/item-1-1.png";

/**
 * Dummy history-based products — ideally fetch from API or context
 */
const historyProducts = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  brand: "Disney",
  title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  price: 17.95,
  rating: 4.9,
  reviews: 65,
  image: productImg,
}));

export default function TopMovieBrandTshirt() {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    arrows: false, // we use custom external buttons
    centerMode: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className='history-product slider-wrapper py-5'>
      <Container>
        {/* Section Header */}
        <div className=' history-product__top'>
          <h2 className='history-product__title'>Top Movie Brand T-shirt</h2>

          {/* External arrow controls */}
          <div className='history-product__btn'>
            <button
              className='slick-custom-prev slick-arrow'
              onClick={() => sliderRef.current?.slickPrev()}
            >
              <i className='icon-left-arrow' />
            </button>
            <button
              className='slick-custom-next slick-arrow'
              onClick={() => sliderRef.current?.slickNext()}
            >
              <i className='icon-left-arrow' />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <Slider
          {...settings}
          ref={sliderRef}
          className='history-product__carousel'
        >
          {historyProducts.map((prod) => (
            <div key={prod.id} className='item'>
              <div className='product__item'>
                {/* Image & Wish */}
                <div className='product__item__img'>
                  <a href='#' className='product__item__img__item'>
                    <Image src={prod.image} alt='product image' />
                  </a>
                  <div className='product__item__btn'>
                    <a href='/cart'>
                      <i className='far fa-heart' />
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className='product__item__content'>
                  <p className='product__item__brand'>
                    Brand: <a href='#'>{prod.brand}</a>
                  </p>
                  <h4 className='product__item__title'>
                    <a href='/product-details'>{prod.title}</a>
                  </h4>
                  <div className='product__item__box'>
                    <div className='product__item__price'>
                      ${prod.price.toFixed(2)}
                    </div>
                    <div className='product__item__ratings'>
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className='fas fa-star' />
                      ))}
                      <span className=''>
                        {prod.rating} ({prod.reviews})
                      </span>
                    </div>
                  </div>
                  <a href='/cart' className='commerce-btn product__item__link'>
                    Add to Cart <i className='icon-right-arrow' />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </Container>
    </section>
  );
}
