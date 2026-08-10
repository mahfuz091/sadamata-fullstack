"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import brand1 from "@/assets/images/products/brand-1-1.jpg";
import brand2 from "@/assets/images/products/brand-1-2.jpg";
import brand3 from "@/assets/images/products/brand-1-3.jpg";
import brand4 from "@/assets/images/products/brand-1-4.jpg";

const fallbackThumbs = [brand1, brand2, brand3, brand4];

const photoSlides = [
  {
    type: "photo",
    img: "/images/hero/Rectangle%2023160.png",
    title: "Buy the best stylish T-shirt",
    bg: "#33526e",
  },
  {
    type: "photo",
    img: "/images/hero/Group%201597882539.png",
    title: "Buy the best stylish T-shirt",
    bg: "#d8cccc",
  },
];

// Each brand slide shows a 2x2 grid, so it needs exactly 4 tiles.
const toTiles = (brands = []) =>
  Array.from({ length: 4 }, (_, i) => {
    const brand = brands[i];
    const fallback = fallbackThumbs[i % fallbackThumbs.length];

    if (!brand) {
      return { key: `placeholder-${i}`, name: "Brand name", img: fallback.src, href: null };
    }

    return {
      key: brand.id || `brand-${i}`,
      name: brand.name || brand.user?.name || "Brand name",
      // landscape first — the tile crops 4:3, banners survive that better than avatars
      img: brand.bannerImageUrl || brand.previewUrl || brand.profileImageUrl || fallback.src,
      href: brand.brandSlug || brand.id ? `/brand/${brand.brandSlug || brand.id}` : null,
    };
  });

const HeroMobileSlider = ({
  musicBrands = [],
  movieBrands = [],
  natokBrands = [],
}) => {
  const slides = useMemo(
    () => [
      {
        type: "brands",
        bg: "#33526e",
        title: "Music Brand T-shirt",
        subtitle:
          "Elevate your wardrobe with the perfect blend of comfort and style",
        tiles: toTiles(musicBrands),
      },
      {
        type: "brands",
        bg: "#33526e",
        title: "Movie Brand T-shirt",
        subtitle: "Posters, quotes and characters from the films you rewatch",
        tiles: toTiles(movieBrands),
      },
      {
        type: "brands",
        bg: "#33526e",
        title: "Natok Brand T-shirt",
        subtitle: "Your favourite drama moments, printed to wear",
        tiles: toTiles(natokBrands),
      },
      ...photoSlides,
    ],
    [musicBrands, movieBrands, natokBrands]
  );

  return (
    <div className='hero-mobile-slider'>
      {/* slidesPerView="auto" + a CSS slide width: Swiper's own measurement of
          the container comes out wrong here, so the width is pinned in CSS. */}
      <Swiper slidesPerView='auto' spaceBetween={16} observer observeParents>
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            {s.type === "brands" ? (
              <div
                className='hero-mobile-card hero-mobile-card--brands'
                style={{ backgroundColor: s.bg }}
              >
                <h2 className='hero-brand__title'>{s.title}</h2>
                <p className='hero-brand__subtitle'>{s.subtitle}</p>

                <div className='hero-brand__grid'>
                  {s.tiles.map((tile) => {
                    const inner = (
                      <>
                        <span className='hero-brand__thumb'>
                          <img src={tile.img} alt='' />
                        </span>
                        <span className='hero-brand__name'>{tile.name}</span>
                      </>
                    );

                    return tile.href ? (
                      <Link
                        key={tile.key}
                        href={tile.href}
                        className='hero-brand__cell'
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div key={tile.key} className='hero-brand__cell'>
                        {inner}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                className='hero-mobile-card'
                style={{ backgroundColor: s.bg }}
              >
                <h2 className='hero-mobile-card__title'>{s.title}</h2>
                <img className='hero-mobile-card__img' src={s.img} alt='' />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroMobileSlider;
