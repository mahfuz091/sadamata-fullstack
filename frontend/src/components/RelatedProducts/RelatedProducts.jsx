"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import item1 from "@/assets/images/products/item-1-1.png";
import item2 from "@/assets/images/products/item-1-2.png";
import item3 from "@/assets/images/products/item-1-3.png";
import item4 from "@/assets/images/products/item-1-4.png";
import item5 from "@/assets/images/products/item-1-5.png";
// import item6 from "@/assets/images/products/item-1-6.png";
// import item7 from "@/assets/images/products/item-1-7.png";
// import item8 from "@/assets/images/products/item-1-8.png";
import { Col, Container, Row } from "react-bootstrap";
import Slider from "react-slick";
var settings = {
  dots: true,
  infinite: true,
  speed: 300,
  slidesToShow: 4,
  slidesToScroll: 4,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

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
  // Add more product objects here
];
const RelatedProducts = () => {
  return (
    <div className='product-slider'>
      <Container>
        <div className='product-slider__top'>
          <h2 className='product-slider__title'>Related Product</h2>
          <div className='product-slider__btn'>
            <Link href='product'>
              See All Product <i className='icon-right-arrow'></i>
            </Link>
          </div>
        </div>
        <div className='product-slider__carousel commerce-slick__carousel slick-initialized slick-slider slick-dotted'>
          <Slider {...settings} className=''>
            {products.map((item, index) => (
              <div className='item' key={index}>
                <div className='product__item'>
                  <div className='product__item__img'>
                    <a href='#' className='product__item__img__item'>
                      <Image src={item.image} alt='product image' />
                    </a>
                    <div className='product__item__btn'>
                      <a href='cart'>
                        <i className='far fa-heart'></i>
                      </a>
                    </div>
                  </div>
                  <div className='product__item__content'>
                    <p className='product__item__brand'>
                      Brand: <a href='#'>{item.brand}</a>
                    </p>
                    <h4 className='product__item__title'>
                      <a href='product-details'>{item.title}</a>
                    </h4>
                    <div className='product__item__box'>
                      <div className='product__item__price'>$17,95</div>
                      <div className='product__item__ratings'>
                        <i className='fas fa-star'></i>
                        <i className='fas fa-star'></i>
                        <i className='fas fa-star'></i>
                        <i className='fas fa-star'></i>
                        <i className='fas fa-star'></i>
                        <span>4.9 (65)</span>
                      </div>
                    </div>
                    <a href='cart' className='commerce-btn product__item__link'>
                      Add to Cart <i className='icon-right-arrow'></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </Container>
    </div>
  );
};

export default RelatedProducts;
