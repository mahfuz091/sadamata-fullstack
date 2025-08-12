import React from "react";
import Slider from "react-slick";

import item1 from "@/assets/images/products/product-4-1.png";
import item2 from "@/assets/images/products/product-4-1.png";
import item3 from "@/assets/images/products/product-4-1.png";
import item4 from "@/assets/images/products/product-4-1.png";
import item5 from "@/assets/images/products/product-4-1.png";
import Image from "next/image";
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

function Responsive() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
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
  return (
    <div className='slider-container'>
      <Slider {...settings}>
        {products.map((item, index) => (
          <div className='item' key={index}>
            <div className='product__item-two'>
              <div className='product__item-two__img'>
                <a href='#' className='product__item-two__img__item'>
                  <Image src={item.image} alt='product image' />
                </a>
              </div>
              <div className='product__item-two__content'>
                <h4 className='product__item-two__title'>
                  <a href='product-details'>{item.title}</a>
                </h4>

                <a href='cart' className='commerce-btn product__item-two__link'>
                  Edit Details <i className='icon-right-arrow'></i>
                </a>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Responsive;
