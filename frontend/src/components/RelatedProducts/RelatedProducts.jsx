"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import item1 from "@/assets/images/products/item-1-1.png";
import item2 from "@/assets/images/products/item-1-2.png";
import item3 from "@/assets/images/products/item-1-3.png";
import item4 from "@/assets/images/products/item-1-4.png";
import item5 from "@/assets/images/products/item-1-5.png";
import { Container } from "react-bootstrap";
import { useFavorites } from "@/hooks/useFavorites";
import AddToCartModal from "../FeatureProduct/AddToCartModal";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const BDT_SYMBOL = "\u09F3";

const fallbackProducts = [
  {
    id: 1,
    brand: "Sadamata",
    title: "Sadamata The Lion King Scar I'm Surrounded T-Shirt",
    price: 17.95,
    rating: 4.9,
    reviews: 65,
    image: item1,
    href: "#",
  },
  {
    id: 2,
    brand: "Sadamata",
    title: "Sadamata The Lion King Scar I'm Surrounded T-Shirt",
    price: 17.95,
    rating: 4.9,
    reviews: 65,
    image: item2,
    href: "#",
  },
  {
    id: 3,
    brand: "Sadamata",
    title: "Sadamata The Lion King Scar I'm Surrounded T-Shirt",
    price: 17.95,
    rating: 4.9,
    reviews: 65,
    image: item3,
    href: "#",
  },
  {
    id: 4,
    brand: "Sadamata",
    title: "Sadamata The Lion King Scar I'm Surrounded T-Shirt",
    price: 17.95,
    rating: 4.9,
    reviews: 65,
    image: item4,
    href: "#",
  },
  {
    id: 5,
    brand: "Sadamata",
    title: "Sadamata The Lion King Scar I'm Surrounded T-Shirt",
    price: 17.95,
    rating: 4.9,
    reviews: 65,
    image: item5,
    href: "#",
  },
];

const getVariantImage = (product) => {
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const imageVariant =
    variants.find((variant) => variant.frontImgUrl || variant.backImgUrl) ||
    variants.find((variant) => variant.frontImg || variant.backImg) ||
    null;

  return (
    imageVariant?.frontImgUrl ||
    imageVariant?.backImgUrl ||
    imageVariant?.frontImg ||
    imageVariant?.backImg ||
    null
  );
};

const normalizeProduct = (product) => {
  const productId = product.productId || product.id;
  const rawPrice = product.rawPrice ?? product.price ?? 0;
  const numericPrice = Number(String(rawPrice).replace(/[^0-9.]/g, ""));
  const priceValue = Number.isFinite(numericPrice) ? numericPrice : 0;
  const displayPrice =
    typeof product.price === "string" && product.price.includes(BDT_SYMBOL)
      ? product.price
      : `${BDT_SYMBOL}${priceValue.toFixed(2)}`;
  const image =
    product.previewUrl || product.imageUrl || product.image || getVariantImage(product);

  return {
    ...product,
    id: product.id,
    productId,
    brand: product.Brand?.name || product.brandName || product.brand || "",
    brandId: product.Brand?.id || product.brandId || null,
    title: product.title || "Untitled product",
    price: priceValue,
    displayPrice,
    rawPrice: priceValue,
    rating: product.rating ?? 5,
    reviews: product.reviews ?? 0,
    image,
    imageUrl: image,
    previewUrl: image,
    variants: Array.isArray(product.variants) ? product.variants : [],
    href: productId ? `/products/${productId}` : product.href || "#",
  };
};

const RelatedProducts = ({
  products,
  title = "Related Product",
  seeAllHref = "/products",
}) => {
  const list = Array.isArray(products)
    ? products.map(normalizeProduct)
    : fallbackProducts.map(normalizeProduct);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  if (!list.length) return null;

  return (
    <div className='product-slider mt-5'>
      <Container>
        <div className='product-slider__top'>
          <h2 className='product-slider__title'>{title}</h2>
          <div className='product-slider__btn'>
            <Link href={seeAllHref} className='inline-flex items-center gap-2'>
              See All Product
            </Link>
          </div>
        </div>

        <div className='product-slider__carousel commerce-swiper__carousel'>
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            loop={list.length > 4}
            speed={300}
            spaceBetween={24}
            breakpoints={{
              0: { slidesPerView: 1, slidesPerGroup: 1 },
              480: { slidesPerView: 1, slidesPerGroup: 1 },
              600: { slidesPerView: 2, slidesPerGroup: 1 },
              1024: { slidesPerView: 3, slidesPerGroup: 1 },
              1280: { slidesPerView: 4, slidesPerGroup: 1 },
            }}
          >
            {list.map((item) => (
              <SwiperSlide key={item.id}>
                <div className='item'>
                  <div className='product__item'>
                    <div className='product__item__img position-relative'>
                      <Link href={item.href} className='product__item__img__item'>
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={600}
                            height={600}
                            style={{ width: "100%", height: "auto" }}
                            unoptimized={typeof item.image === "string"}
                          />
                        ) : (
                          <div style={{ aspectRatio: "1/1" }} />
                        )}
                      </Link>
                      <button
                        className='product__item__btn related-products__favorite position-absolute top-0 end-0 p-2'
                        type='button'
                        aria-label={isFavorite(item.id) ? "Remove from favorites" : "Add to favorites"}
                        onClick={() => toggleFavorite(item)}
                      >
                        <span className={`heart ${isFavorite(item.id) ? "active" : ""}`}>
                          <i className='far fa-heart'></i>
                        </span>
                      </button>
                    </div>
                    <div className='product__item__content'>
                      {item.brand && (
                        <p className='product__item__brand'>
                          Brand:{" "}
                          <span>
                            {item.brandId ? (
                              <Link href={`/brand/${item.brandId}`}>{item.brand}</Link>
                            ) : (
                              item.brand
                            )}
                          </span>
                        </p>
                      )}
                      <h4 className='product__item__title'>
                        <Link href={item.href}>{item.title}</Link>
                      </h4>
                      <div className='product__item__box'>
                        <div className='product__item__price'>{item.displayPrice}</div>
                        <div className='product__item__ratings'>
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className='fas fa-star'></i>
                          ))}
                          <span>
                            {item.rating} ({item.reviews})
                          </span>
                        </div>
                      </div>
                      <button
                        className='commerce-btn product__item__link'
                        type='button'
                        onClick={() => {
                          setSelectedProduct({
                            ...item,
                            price: item.price,
                          });
                          setShowModal(true);
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>

      {selectedProduct && (
        <AddToCartModal
          show={showModal}
          onHide={() => setShowModal(false)}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default RelatedProducts;
