// ProductCard.jsx
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({ product }) => {
  const brandName = product?.Brand?.name || product?.brandName || "Brand";
  const brandId = product?.Brand?.id || null;
  const price = typeof product?.price === "number" ? `৳${product.price.toFixed(2)}` : "৳—";
  
  return (
    <div className='product__item h-100 d-flex flex-column'>
      <div className='product__item__img position-relative'>
        <Link href={`/products/${product.productId}`} className='product__item__img__item d-block'>
          <Image 
            src={product.previewUrl || "/placeholder.png"} 
            alt={product.title || "Product image"} 
            width={400} 
            height={400} 
            className='img-fluid w-100'
            unoptimized
          />
        </Link>
        <div className='product__item__btn position-absolute top-0 end-0 p-2'>
          <Link href='#'>
            <i className='far fa-heart'></i>
          </Link>
        </div>
      </div>
      <div className='product__item__content p-3 mt-auto'>
        <p className='product__item__brand m-0'>
          Brand:{" "}
          <span>
            {brandId ? (
              <Link href={`/brand/${brandId}`}>{brandName}</Link>
            ) : (
              brandName
            )}
          </span>
        </p>
        <h4 className='product__item__title my-2'>
          <Link href={`/products/${product.productId}`}>{product.title}</Link>
        </h4>
        <div className='product__item__box d-flex justify-content-between align-items-center'>
          <div className='product__item__price fw-bold'>{price}</div>
          <div className='product__item__ratings d-flex align-items-center gap-1'>
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <i key={i} className='fas fa-star text-warning'></i>
              ))}
            <span className='small'>4.9 (65)</span>
          </div>
        </div>
        <Link href={`/products/${product.productId}`} className='commerce-btn product__item__link mt-3'>
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
