"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const slides = [
  {
    img: "/images/hero/Rectangle%2023160.png",
    title: "Buy the best stylish T-shirt",
    bg: "#33526e",
  },
  {
    img: "/images/hero/Group%201597882539.png",
    title: "Buy the best stylish T-shirt",
    bg: "#d8cccc",
  },
];

const HeroMobileSlider = () => {
  return (
    <div className='hero-mobile-slider'>
      <Swiper slidesPerView={1.12} spaceBetween={16}>
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div
              className='hero-mobile-card'
              style={{ backgroundColor: s.bg }}
            >
              <h2 className='hero-mobile-card__title'>{s.title}</h2>
              <img className='hero-mobile-card__img' src={s.img} alt='' />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroMobileSlider;
