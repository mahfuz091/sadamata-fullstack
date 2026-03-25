"use client";

import Image from "next/image";
import Slider from "react-slick";
import { Container } from "react-bootstrap";
import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import AddToCartModal from "../FeatureProduct/AddToCartModal";
import { toast } from "sonner";
 const FAVORITE_KEY = "favorite_products";
  const getFavorites = () => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];
    } catch {
      return [];
    }
  };
export default function TopMovieBrandTshirt({
  title = "Movie Merchandise Shop",
  products = [],
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
   const [favorites, setFavorites] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
          setFavorites(getFavorites());
        }, []);
console.log("products", products);

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

  const normalized = useMemo(() => {
    return (products ?? []).map((p) => ({
      id: p.id,
      productId: p.productId,
      title: p.title,
      price: p.price,
      brand: p.Brand?.name || p.brandName || "Brand",
      brandId: p.Brand?.id || null,
      imageUrl: p.previewUrl || null,
      rating: p.rating ?? 5,
      reviews: p.reviews ?? 0,
      variants: p.variants || [],
    }));
  }, [products]);
  const toggleFavorite = (product) => {
      let action = null;
      let nextFavorites = [];

      setFavorites((prev) => {
        const exists = prev.some((p) => p.id === product.id);

        if (exists) {
          action = "remove";
          nextFavorites = prev.filter((p) => p.id !== product.id);
        } else {
          action = "add";
          nextFavorites = [
            ...prev,
            {
              id: product.id,
              productId: product.productId,
              title: product.title,
              price: product.price,
              image: product.previewUrl,
            },
          ];
        }

        return nextFavorites; // ✅ PURE
      });

      // ✅ Side-effects AFTER render
      queueMicrotask(() => {
        localStorage.setItem("favorite_products", JSON.stringify(nextFavorites));

        if (action === "add") {
          toast.success("Added to favorites", {
            description: product.title,
          });
        } else if (action === "remove") {
          toast.success("Removed from favorites", {
            description: product.title,
          });
        }

        window.dispatchEvent(new Event("favorite-updated"));
      });
    };

  return (
    <section className='history-product slider-wrapper py-5'>
      <Container>
        <div className='history-product__top'>
          <h2 className='history-product__title'>{title}</h2>

          <div className='history-product__btn'>
            <button
              className='slick-custom-prev slick-arrow'
              onClick={() => sliderRef.current?.slickPrev()}
              type='button'
              aria-label='Previous'
            >
              <i className='icon-left-arrow' />
            </button>
            <button
              className='slick-custom-next slick-arrow'
              onClick={() => sliderRef.current?.slickNext()}
              type='button'
              aria-label='Next'
            >
              <i className='icon-left-arrow' />
            </button>
          </div>
        </div>

        <Slider
          {...settings}
          ref={sliderRef}
          className='history-product__carousel'
        >
         {normalized.map((prod) => {
            const isFavorite = favorites.some((f) => f.id === prod.id);
return (
            <div key={prod.id} className='item'>
              <div className='product__item'>
                <div className='product__item__img position-relative'>
                  <Link
                    href={`/products/${prod.productId}`}
                    className='product__item__img__item'
                  >
                    {prod.imageUrl ? (
                      <Image
                        src={prod.imageUrl}
                        alt={prod.title}
                        width={600}
                        height={600}
                        style={{ width: "100%", height: "auto" }}
                        unoptimized
                      />
                    ) : (
                      <div style={{ aspectRatio: "1/1" }} />
                    )}
                  </Link>

                  <div
                        className='product__item__btn position-absolute top-0 end-0 p-2'
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleFavorite(prod)}
                      >
                        <div className={`heart ${isFavorite ? "active" : ""}`}>
                          <i
                            className={
                              isFavorite ? "far fa-heart" : "far fa-heart"
                            }
                          ></i>
                        </div>
                      </div>
                </div>

                <div className='product__item__content'>
                  <p className='product__item__brand'>
                    Brand:{" "}
                    <span>
                      {prod.brandId ? (
                        <Link href={`/brand/${prod.brandId}`}>{prod.brand}</Link>
                      ) : (
                        prod.brand
                      )}
                    </span>
                  </p>

                  <h4 className='product__item__title'>
                    <Link href={`/products/${prod.productId}`}>
                      {prod.title}
                    </Link>
                  </h4>

                  <div className='product__item__box'>
                    <div className='product__item__price'>
                      ৳{Number(prod.price ?? 0).toFixed(2)}
                    </div>

                    <div className='product__item__ratings'>
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className='fas fa-star' />
                      ))}
                      <span>
                        {prod.rating} ({prod.reviews})
                      </span>
                    </div>
                  </div>

                  <button
                    className='commerce-btn product__item__link mt-auto'
                    onClick={() => {
                      setSelectedProduct(prod);
                      setShowModal(true);
                    }}
                  >
                    Add to Cart 
                  </button>
                </div>
              </div>
            </div>)}
          )}
        </Slider>
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
