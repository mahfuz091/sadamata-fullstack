// ProductCard.jsx
import Image from "next/image";
import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className='col-xl-3 col-lg-4 col-md-6'>
      <div className='product__item'>
        <div className='product__item__img'>
          <a href='#' className='product__item__img__item'>
            <Image src={product.image} alt={product.title} />
          </a>
          <div className='product__item__btn'>
            <a href='cart.html'>
              <i className='far fa-heart'></i>
            </a>
          </div>
        </div>
        <div className='product__item__content'>
          <p className='product__item__brand'>
            Brand: <a href='#'>{product.brand}</a>
          </p>
          <h4 className='product__item__title'>
            <a href='product-details.html'>{product.title}</a>
          </h4>
          <div className='product__item__box'>
            <div className='product__item__price'>{product.price}</div>
            <div className='product__item__ratings'>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <i key={i} className='fas fa-star'></i>
                ))}
              <span>
                {product.rating} ({product.reviews})
              </span>
            </div>
          </div>
          <a href='cart.html' className='commerce-btn product__item__link'>
            Add to Cart <i className='icon-right-arrow'></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
