"use client";

import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import { Container } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import AddToCartModal from "../FeatureProduct/AddToCartModal";
import { getSignedUrls } from "@/app/actions/product/getSignedUrls";

export const RECENTLY_VIEWED_PRODUCTS_KEY = "recently_viewed_products";
export const RECENTLY_VIEWED_PRODUCTS_LIMIT = 15;

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// stored entries may predate the "Unknown" fallback
const displayBrand = (brand) =>
  brand && brand !== "—" && brand !== "Brand" ? brand : "Unknown";

const readRecentlyViewedProducts = () => {
  if (typeof window === "undefined") return [];

  try {
    const products = JSON.parse(
      window.localStorage.getItem(RECENTLY_VIEWED_PRODUCTS_KEY) || "[]"
    );

    if (!Array.isArray(products)) return [];

    const now = Date.now();
    const fresh = products.filter(
      (p) => p?.viewedAt && now - new Date(p.viewedAt).getTime() < SEVEN_DAYS_MS
    );

    if (fresh.length !== products.length) {
      window.localStorage.setItem(
        RECENTLY_VIEWED_PRODUCTS_KEY,
        JSON.stringify(fresh)
      );
    }

    return fresh;
  } catch {
    return [];
  }
};

export const trackRecentlyViewedProduct = (product) => {
  if (typeof window === "undefined" || !product?.id) return;

  const normalized = {
    id: product.id,
    productId: product.productId || product.id,
    title: product.title || "Untitled product",
    price: product.price ?? null,
    brand: product.brand || "Unknown",
    brandId: product.brandId || null,
    imageKey: product.imageKey || null,
    imageUrl: product.imageUrl || null,
    previewUrl: product.imageUrl || product.previewUrl || null,
    variants: Array.isArray(product.variants) ? product.variants : [],
    rating: product.rating ?? 5,
    reviews: product.reviews ?? 0,
    viewedAt: new Date().toISOString(),
  };

  const current = readRecentlyViewedProducts();
  const next = [
    normalized,
    ...current.filter((item) => item?.id !== normalized.id),
  ].slice(0, RECENTLY_VIEWED_PRODUCTS_LIMIT);

  window.localStorage.setItem(
    RECENTLY_VIEWED_PRODUCTS_KEY,
    JSON.stringify(next)
  );
  window.dispatchEvent(new Event("recently-viewed-products-updated"));
};

export default function RecentlyViewedProducts({ title = "Inspired by Your Browsing History" }) {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const sliderRef = useRef(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  const refreshAndSet = async (list) => {
    const keys = list.map((p) => p.imageKey).filter(Boolean);
    if (!keys.length) { setProducts(list); return; }
    try {
      const urlMap = await getSignedUrls(keys);
      setProducts(
        list.map((p) =>
          p.imageKey && urlMap[p.imageKey]
            ? { ...p, imageUrl: urlMap[p.imageKey], previewUrl: urlMap[p.imageKey] }
            : p
        )
      );
    } catch {
      setProducts(list);
    }
  };

  useEffect(() => {
    const syncProducts = () => refreshAndSet(readRecentlyViewedProducts());

    syncProducts();
    window.addEventListener("storage", syncProducts);
    window.addEventListener("recently-viewed-products-updated", syncProducts);

    return () => {
      window.removeEventListener("storage", syncProducts);
      window.removeEventListener(
        "recently-viewed-products-updated",
        syncProducts
      );
    };
  }, []);

  if (!products.length) return null;

  const settings = {
    dots: false,
    infinite: products.length > 4,
    arrows: false,
    centerMode: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const renderCard = (product) => {
    const favoriteActive = isFavorite(product.id);
    return (
      <div className='product__item'>
        <div className='product__item__img position-relative'>
          <Link
            href={`/products/${product.productId}`}
            className='product__item__img__item'
          >
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                width={600}
                height={600}
                style={{ width: "100%", height: "auto" }}
                unoptimized
              />
            ) : (
              <div className='recently-viewed-products__placeholder' />
            )}
          </Link>

          <button
            className='product__item__btn recently-viewed-products__favorite position-absolute top-0 end-0 p-2'
            type='button'
            aria-label={favoriteActive ? "Remove from favorites" : "Add to favorites"}
            onClick={() => toggleFavorite(product)}
          >
            <span className={`heart ${favoriteActive ? "active" : ""}`}>
              <i className='far fa-heart'></i>
            </span>
          </button>
        </div>

        <div className='product__item__content'>
          <p className='product__item__brand'>
            Brand:{" "}
            <span>
              {product.brandId ? (
                <Link
                  href={`/brand/${product.brandSlug || product.brandId}`}
                  className='recently-viewed-products__brand-link'
                >
                  {displayBrand(product.brand)}
                </Link>
              ) : (
                displayBrand(product.brand)
              )}
            </span>
          </p>

          <h4 className='product__item__title'>
            <Link href={`/products/${product.productId}`}>{product.title}</Link>
          </h4>

          <div className='product__item__box'>
            <div className='product__item__price'>
              ৳{Number(product.price ?? 0).toFixed(2)}
            </div>

            <div className='product__item__ratings'>
              {[...Array(5)].map((_, i) => (
                <i key={i} className='fas fa-star' />
              ))}
              <span>
                {product.rating ?? 5} ({product.reviews ?? 0})
              </span>
            </div>
          </div>

          <button
            className='commerce-btn product__item__link mt-auto'
            type='button'
            onClick={() => {
              setSelectedProduct(product);
              setShowModal(true);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className='recently-viewed-products history-product slider-wrapper py-5'>
      <Container>
        <div className='history-product__top'>
          <h2 className='history-product__title'>{title}</h2>

          <div className='history-product__btn'>
            <button
              className='slick-custom-prev slick-arrow'
              onClick={() => sliderRef.current?.slickPrev()}
              type='button'
              aria-label='Previous recently viewed product'
            >
              <i className='icon-left-arrow' />
            </button>

            <button
              className='slick-custom-next slick-arrow'
              onClick={() => sliderRef.current?.slickNext()}
              type='button'
              aria-label='Next recently viewed product'
            >
              <i className='icon-left-arrow' />
            </button>
          </div>
        </div>

        <Slider
          {...settings}
          ref={sliderRef}
          className='history-product__carousel recently-viewed-products__carousel'
        >
          {products.map((product) => {
            const favoriteActive = isFavorite(product.id);

            return (
              <div key={product.id} className='item'>
                <div className='product__item'>
                  <div className='product__item__img position-relative'>
                    <Link
                      href={`/products/${product.productId}`}
                      className='product__item__img__item'
                    >
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          width={600}
                          height={600}
                          style={{ width: "100%", height: "auto" }}
                          unoptimized
                        />
                      ) : (
                        <div className='recently-viewed-products__placeholder' />
                      )}
                    </Link>

                    <button
                      className='product__item__btn recently-viewed-products__favorite position-absolute top-0 end-0 p-2'
                      type='button'
                      aria-label={favoriteActive ? "Remove from favorites" : "Add to favorites"}
                      onClick={() => toggleFavorite(product)}
                    >
                      <span className={`heart ${favoriteActive ? "active" : ""}`}>
                        <i className='far fa-heart'></i>
                      </span>
                    </button>
                  </div>

                  <div className='product__item__content'>
                    <p className='product__item__brand'>
                      Brand:{" "}
                      <span>
                        {product.brandId ? (
                          <Link
                            href={`/brand/${product.brandSlug || product.brandId}`}
                            className='recently-viewed-products__brand-link'
                          >
                            {displayBrand(product.brand)}
                          </Link>
                        ) : (
                          displayBrand(product.brand)
                        )}
                      </span>
                    </p>

                    <h4 className='product__item__title'>
                      <Link href={`/products/${product.productId}`}>
                        {product.title}
                      </Link>
                    </h4>

                    <div className='product__item__box'>
                      <div className='product__item__price'>
                        ৳{Number(product.price ?? 0).toFixed(2)}
                      </div>

                      <div className='product__item__ratings'>
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className='fas fa-star' />
                        ))}
                        <span>
                          {product.rating ?? 5} ({product.reviews ?? 0})
                        </span>
                      </div>
                    </div>

                    <button
                      className='commerce-btn product__item__link mt-auto'
                      type='button'
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowModal(true);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>

        <div className='history-product__mobile'>
          {products.slice(0, visibleCount).map((product) => (
            <div key={`m-${product.id}`} className='item'>
              {renderCard(product)}
            </div>
          ))}
        </div>

        {visibleCount < products.length && (
          <div className='history-product__loadmore'>
            <button
              type='button'
              className='commerce-btn'
              onClick={() => setVisibleCount((c) => c + 6)}
            >
              Load More
            </button>
          </div>
        )}
      </Container>

      {selectedProduct && (
        <AddToCartModal
          show={showModal}
          onHide={() => setShowModal(false)}
          product={selectedProduct}
        />
      )}
    </section>
  );
}

