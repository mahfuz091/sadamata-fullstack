"use client";
import React from "react";
import brand1 from "@/assets/images/products/brand-1-1.jpg";
import brand2 from "@/assets/images/products/brand-1-2.jpg";
import brand3 from "@/assets/images/products/brand-1-3.jpg";
import brand4 from "@/assets/images/products/brand-1-4.jpg";
import brand5 from "@/assets/images/products/brand-1-5.jpg";

import Image from "next/image";
import Slider from "react-slick";
import { Container } from "react-bootstrap";
import { useRef } from "react";

const brands = [
  brand1,
  brand2,
  brand3,
  brand4,
  brand5,
  brand1,
  brand2,
  brand3,
  brand4,
  brand5,
];

const TopMovieBrand = () => {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    arrows: false,

    slidesToShow: 7,
    slidesToScroll: 1,

    responsive: [
      { breakpoint: 1600, settings: { slidesToShow: 7 } },
      { breakpoint: 1400, settings: { slidesToShow: 6 } },
      { breakpoint: 1200, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className='top-brand slider-wrapper'>
      <Container>
        <div className='top-brand__top'>
          <h2 className='top-brand__title'>Top Movie Brand</h2>
          <div className='top-brand__btn'>
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
        <div className='top-brand__carousel commerce-slick__carousel slick-initialized slick-slider'>
          <Slider {...settings} ref={sliderRef}>
            {brands.map((src, idx) => (
              <div key={idx} className='item'>
                <div className='top-brand__item'>
                  <div className='top-brand__item__image'>
                    <Image src={src} alt='Brand Image' />
                  </div>
                  <h4 className='top-brand__item__title'>
                    <a href='#'>Brand Name</a>
                  </h4>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </Container>
    </section>
  );
};

export default TopMovieBrand;
