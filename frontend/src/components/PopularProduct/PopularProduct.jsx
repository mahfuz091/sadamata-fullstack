"use client";

import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";

// 👉 Static image import (replace / add your own)
import productImg from "@/assets/images/products/item-1-1.png";


/**
 * Dummy data – replace with real data or fetch from an API.
 */
const products = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  brand: "Disney",
  title: "Disney The Lion King Scar I'm Surrounded T‑Shirt",
  price: 17.95,
  rating: 4.9,
  reviews: 65,
  image: productImg,
}));

const PopularProduct = () => {

  
  
  return (
    <section className='popular-product py-5'>
      <Container>
        {/* Section top */}
        <div className='product-slider__top d-flex justify-content-between align-items-center mb-4'>
          <h2 className='product-slider__title m-0'>Most Popular Products</h2>
          <div className='product-slider__btn'>
            <Link
              href='/product'
              className='d-inline-flex align-items-center gap-1'
            >
              See All Product <i className='icon-right-arrow' />
            </Link>
          </div>
        </div>

        {/* Product grid */}
        <Row className='g-4'>
          {products.map((prod) => (
            <Col key={prod.id} xl={3} lg={4} md={6} sm={6}>
              <div className='product__item h-100 d-flex flex-column'>
                {/* Image */}
                <div className='product__item__img position-relative'>
                  <Link href='#' className='product__item__img__item d-block'>
                    <Image
                      src={prod.image}
                      alt='product image'
                      width={350}
                      height={350}
                      className='img-fluid w-100'
                    />
                  </Link>
                  {/* Wishlist button */}
                  <div className='product__item__btn position-absolute top-0 end-0 p-2'>
                    <Link href='/cart' className='d-inline-flex'>
                      <i className='far fa-heart' />
                    </Link>
                  </div>
                </div>

                {/* Content */}
                <div className='product__item__content flex-grow-1 d-flex flex-column pt-3'>
                  <p className='product__item__brand mb-1'>
                    Brand: <Link href='#'>{prod.brand}</Link>
                  </p>
                  <h4 className='product__item__title mb-2 fs-6 fw-semibold'>
                    <Link href='/product-details'>{prod.title}</Link>
                  </h4>

                  {/* Price + ratings */}
                  <div className='product__item__box d-flex justify-content-between align-items-center mt-auto mb-3'>
                    <div className='product__item__price fw-bold'>
                      ${prod.price.toFixed(2)}
                    </div>
                    <div className='product__item__ratings d-flex align-items-center gap-1'>
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <i
                          key={starIdx}
                          className={`fas fa-star${
                            starIdx + 1 > Math.round(prod.rating)
                              ? "-half-alt"
                              : ""
                          }`}
                        />
                      ))}
                      <span className='small'>
                        {prod.rating} ({prod.reviews})
                      </span>
                    </div>
                  </div>

                  <Link
                    href='/cart'
                    className='commerce-btn product__item__link mt-auto align-self-start'
                  >
                    Add to Cart <i className='icon-right-arrow' />
                  </Link>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default PopularProduct;
