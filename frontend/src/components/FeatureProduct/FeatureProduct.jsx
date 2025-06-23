// components/FeatureProductSection.js
"use client";

import Image from "next/image";
import { useState } from "react";
import { Container, Row, Col, Button, Nav, Pagination } from "react-bootstrap";
import productImg from "@/assets/images/products/item-1-1.png";

const filters = [
  { label: "All Product", value: "all" },
  { label: "New Arrivals", value: "spa" },
  { label: "Best Sellers", value: "reflexology" },
  { label: "Featured Product", value: "thermo-stone" },
];

const products = [
  {
    id: 1,
    category: "spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 2,
    category: "reflexology spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 3,
    category: "thermo-stone",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 4,
    category: "reflexology",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 5,
    category: "spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 6,
    category: "reflexology",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 7,
    category: "spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 8,
    category: "spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 1,
    category: "spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 2,
    category: "reflexology spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 3,
    category: "thermo-stone",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 4,
    category: "reflexology",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 5,
    category: "spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 6,
    category: "reflexology",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 7,
    category: "spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 8,
    category: "spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 1,
    category: "spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 2,
    category: "reflexology spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 3,
    category: "thermo-stone",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 4,
    category: "reflexology",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 5,
    category: "spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 6,
    category: "reflexology",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 7,
    category: "spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 8,
    category: "spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 1,
    category: "spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 2,
    category: "reflexology spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 3,
    category: "thermo-stone",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 4,
    category: "reflexology",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 5,
    category: "spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 6,
    category: "reflexology",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 7,
    category: "spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 8,
    category: "spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 1,
    category: "spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 2,
    category: "reflexology spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 3,
    category: "thermo-stone",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 4,
    category: "reflexology",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 5,
    category: "spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 6,
    category: "reflexology",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 7,
    category: "spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
  {
    id: 8,
    category: "spa",
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
  },
];

const FeatureProduct = () => {
  const [filter, setFilter] = useState("all");

  const filteredProducts =
    filter === "all"
      ? products
      : products.filter((product) => product.category.includes(filter));

  return (
    <section className='feature-product py-5'>
      <Container>
        <div className='feature-product__top text-center mb-4'>
          <h2 className='feature-product__title mb-3'>
            Elevate Your Style with Our Trendy Tees
          </h2>
          <ul className='list-unstyled post-filter feature-product__filter__list'>
            {filters.map((item) => (
              <li
                key={item.value}
                className={`${filter === item.value ? "active" : ""}`}
                onClick={() => setFilter(item.value)}
              >
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <Row className='g-4'>
          {filteredProducts.map((product) => (
            <Col key={product.id} md={6} lg={4} xl={3}>
              <div className='product__item'>
                <div className='product__item__img position-relative'>
                  <a href='#' className='product__item__img__item d-block'>
                    <Image
                      src={productImg}
                      alt='product image'
                      className='img-fluid'
                    />
                  </a>
                  <div className='product__item__btn position-absolute top-0 end-0 p-2'>
                    <a href='/cart'>
                      <i className='far fa-heart'></i>
                    </a>
                  </div>
                </div>
                <div className='product__item__content p-3'>
                  <p className='product__item__brand'>
                    Brand: <a href='#'>{product.brand}</a>
                  </p>
                  <h4 className='product__item__title'>
                    <a href='/product-details'>{product.title}</a>
                  </h4>
                  <div className='product__item__box'>
                    <div className='product__item__price'>$17.95</div>
                    <div className='product__item__ratings'>
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className='fas fa-star text-warning'></i>
                      ))}
                      <span className='ms-1'>4.9 (65)</span>
                    </div>
                  </div>
                  <a href='/cart' className='commerce-btn product__item__link'>
                    Add to Cart <i className='icon-right-arrow'></i>
                  </a>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <div class='feature-product__pagination'>
          <div class='post-pagination'>
            <a href='#' class='previous'>
              <i class='icon-left-arrow'></i> Previous
            </a>
            <ul class='post-pagination-list justify-content-center'>
              <li>
                {" "}
                <a href='#' class='active'>
                  1
                </a>
              </li>
              <li>
                {" "}
                <a href='#'>2</a>
              </li>
              <li>
                {" "}
                <a href='#'>3</a>
              </li>
              <li>
                {" "}
                <a href='#'>...</a>
              </li>
            </ul>
            <a href='#' class='next'>
              Next <i class='icon-right-arrow'></i>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
};
export default FeatureProduct;
