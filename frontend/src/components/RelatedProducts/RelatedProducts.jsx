'use client'
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
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
    infinite: false,
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
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
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
        <div className='related-products container'>
            <div className='related-products__header d-flex justify-content-between align-items-center' >
                <h2 className='related-products__title'>Branded Products Related to Your Search</h2>
                <Link href='#' className='related-products__view-all'>See All Product <i className='icon-right-arrow'></i></Link>
            </div>
            <div >
            <Slider {...settings}>
            {products.map((item, index) => (
          <div key={index} className="mx-32">
            <div className="product__item">
              <div className="product__item__img">
                <div className="product__item__img__item">
                  <Image src={item.image} alt="related product" />
                </div>
                <div className="product__item__btn">
                  <Link href="/cart">
                    <i className="far fa-heart"></i>
                  </Link>
                </div>
              </div>
              <div className="product__item__content">
                <p className="product__item__brand">
                  Brand: <Link href="#">Disney</Link>
                </p>
                <h4 className="product__item__title">
                  <Link href="/product-details">
                    Related Product Title
                  </Link>
                </h4>
                <div className="product__item__box">
                  <div className="product__item__price">$17.95</div>
                  <div className="product__item__ratings">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                    <span>4.9 (65)</span>
                  </div>
                </div>
                <Link href="/cart" className="commerce-btn product__item__link">
                  Add to Cart <i className="icon-right-arrow"></i>
                </Link>
              </div>
            </div>
          </div>
        ))}
              
            </Slider>
            </div>
            
            
        </div>
    );
};

export default RelatedProducts;