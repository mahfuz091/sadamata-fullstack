"use client";

import React, { useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import { Container } from "react-bootstrap";

import brand1 from "@/assets/images/products/brand-1-1.jpg";
import brand2 from "@/assets/images/products/brand-1-2.jpg";
import brand3 from "@/assets/images/products/brand-1-3.jpg";
import brand4 from "@/assets/images/products/brand-1-4.jpg";
import brand5 from "@/assets/images/products/brand-1-5.jpg";

const dummyBrands = [
  { id: "dummy-1", name: "Demo Brand 1", image: brand1, isDummy: true },
  { id: "dummy-2", name: "Demo Brand 2", image: brand2, isDummy: true },
  { id: "dummy-3", name: "Demo Brand 3", image: brand3, isDummy: true },
  { id: "dummy-4", name: "Demo Brand 4", image: brand4, isDummy: true },
  { id: "dummy-5", name: "Demo Brand 5", image: brand5, isDummy: true },
  { id: "dummy-6", name: "Demo Brand 6", image: brand1, isDummy: true },
  { id: "dummy-7", name: "Demo Brand 7", image: brand2, isDummy: true },
  { id: "dummy-8", name: "Demo Brand 8", image: brand3, isDummy: true },
  { id: "dummy-9", name: "Demo Brand 9", image: brand4, isDummy: true },
];

const normalizeBrand = (brand, index) => ({
  id: brand?.id || `brand-${index}`,
  name: brand?.name || brand?.user?.name || `Brand ${index + 1}`,
  image:
    
  brand?.profileImageUrl ||
    brand?.bannerImageUrl ||
    brand?.previewUrl ||
    brand1,
  isDummy: false,
});

const TopNatokBrand = ({ brands = [], title = "Drama Merchandise Shop" }) => {
  const sliderRef = useRef(null);

  const finalBrands = useMemo(() => {
    const realBrands = brands.map(normalizeBrand);

    if (realBrands.length >= 9) return realBrands;

    const need = 9 - realBrands.length;
    return [...realBrands, ...dummyBrands.slice(0, need)];
  }, [brands]);

  const settings = {
    dots: false,
    infinite: finalBrands.length > 7,
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
    <section className="top-brand slider-wrapper">
      <Container>
        <div className="top-brand__top">
          <h2 className="top-brand__title">{title}</h2>

          <div className="top-brand__btn">
            <button
              type="button"
              className="slick-custom-prev slick-arrow"
              onClick={() => sliderRef.current?.slickPrev()}
            >
              <i className="icon-left-arrow" />
            </button>

            <button
              type="button"
              className="slick-custom-next slick-arrow"
              onClick={() => sliderRef.current?.slickNext()}
            >
              <i className="icon-left-arrow" />
            </button>
          </div>
        </div>

        <div className="top-brand__carousel commerce-slick__carousel">
          <Slider {...settings} ref={sliderRef}>
            {finalBrands.map((brand, idx) => {
              const card = (
                <div className="top-brand__item">
                  <div className="top-brand__item__image">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      width={220}
                      height={220}
                      className="object-cover"
                    />
                  </div>
                  <h4 className="top-brand__item__title">{brand.name}</h4>
                </div>
              );

              return (
                <div key={`${brand.id}-${idx}`} className="item">
                  {brand.isDummy ? (
                    <div>{card}</div>
                  ) : (
                    <Link href={`/brand/${brand.id}`}>{card}</Link>
                  )}
                </div>
              );
            })}
          </Slider>
        </div>
      </Container>
    </section>
  );
};

export default TopNatokBrand;