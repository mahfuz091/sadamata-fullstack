import Image from "next/image";
import React from "react";
import hero1 from "@/assets/images/resources/hero-1-1.jpg";
import hero2 from "@/assets/images/resources/hero-1-2.jpg";
import hero3 from "@/assets/images/resources/hero-1-3.jpg";
import hero4 from "@/assets/images/resources/hero-2-1.jpg";
import hero5 from "@/assets/images/resources/hero-2-2.jpg";
import hero6 from "@/assets/images/resources/hero-2-3.jpg";

const Hero = () => {
  return (
    <section class='hero-area'>
      <div class='container'>
        <div class='row'>
          <div class='col-xl-3 col-lg-3 col-md-12'>
            <div class='hero-area__thumb'>
              <div class='hero-area__thumb__item'>
                <Image src={hero1} alt='hero image' />
                <Image src={hero2} alt='hero image' />
              </div>
              <div class='hero-area__thumb__item'>
                <Image src={hero3} alt='hero image' />
              </div>
            </div>
          </div>
          <div class='col-xl-6 col-lg-3 col-md-12'>
            <div class='hero-area__content'>
              <h2 class='hero-area__title'>
                Buy the best stylish T-shirt of your choice.
              </h2>
              <p class='hero-area__text'>
                Elevate your wardrobe with the perfect blend of comfort and
                style
              </p>
              <div class='hero-area__btn text-center'>
                <a href='product.html' class='commerce-btn'>
                  Shop Now <i class='icon-right-arrow'></i>
                </a>
              </div>
            </div>
          </div>
          <div class='col-xl-3 col-lg-3 col-md-12'>
            <div class='hero-area__thumb'>
              <div class='hero-area__thumb__item'>
                <Image src={hero6} alt='hero image' />
              </div>
              <div class='hero-area__thumb__item'>
                <Image src={hero4} alt='hero image' />
                <Image src={hero5} alt='hero image' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
