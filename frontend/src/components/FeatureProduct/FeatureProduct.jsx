// components/FeatureProductSection.js
"use client";
const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL;
import Image from "next/image";
import { useState, useEffect, useTransition, useRef } from "react";
import {
  Container,
  Row,
  Col,
 
  Spinner,
} from "react-bootstrap";

import {
  getAllProducts,
  getNewArrivals,
  getBestSellers,
  getFeaturedProducts,
} from "@/app/actions/product/product.actions";
import Link from "next/link";
import { getProductImage } from "@/lib/helper";
import AddToCartModal from "./AddToCartModal";
import { toast } from "sonner";
import { DOTS, getPaginationRange } from "@/utils/helper";

const TABS = [
  { label: "All Products", key: "all" },
  { label: "New Arrivals", key: "new" },
  { label: "Best Sellers", key: "best" },
  { label: "Featured Product", key: "featured" },
];

// Map each tab to its loader (server action)
const loaders = {
  all: (args) => getAllProducts(args),
  new: (args) => getNewArrivals(args),
  best: (args) => getBestSellers(args),
  featured: (args) => getFeaturedProducts({ ...args, featuredTag: "featured" }),
};

const FAVORITE_KEY = "favorite_products";
const getFavorites = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];
  } catch {
    return [];
  }
};



const FeatureProduct = () => {
  const sectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [favorites, setFavorites] = useState([]);
  const pageSize = 32;
  // console.log(products, "features");

  const paginationRange = getPaginationRange(totalPages, page, 1);



  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const scrollToSectionTop = () => {
    const el = sectionRef.current;
    if (!el) return;

    const headerOffset = 90; // তোমার navbar height অনুযায়ী adjust করো
    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

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

  console.log(products, "products");

  // Fetch whenever tab or page changes
  useEffect(() => {
    startTransition(async () => {
      try {
        const loader = loaders[activeTab];
        const data = await loader({ page, pageSize });
        console.log(data, "features data");

        setProducts(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch (e) {
        console.error("Product fetch failed:", e);
        setProducts([]);
        setTotalPages(1);
      }
    });
  }, [activeTab, page]);

  // When switching tabs, reset to page 1
  const handleTabClick = (key) => {
    if (key === activeTab) return;
    setActiveTab(key);
    setPage(1);
  };

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <section className='feature-product py-5' ref={sectionRef}>
      <Container>
        <div className='feature-product__top text-center mb-4'>
          <h2 className='feature-product__title mb-3'>
            Elevate Your Style with Our Trendy Tees
          </h2>

          <ul className='list-unstyled post-filter feature-product__filter__list'>
            {TABS.map((t) => (
              <li
                key={t.key}
                className={activeTab === t.key ? "active" : ""}
                onClick={() => handleTabClick(t.key)}
                style={{ cursor: "pointer" }}
              >
                <span>{t.label}</span>
              </li>
            ))}
          </ul>

          {isPending && (
            <Spinner animation='border' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </Spinner>
          )}
        </div>

        <Row className='g-4'>
          {products.map((product) => {
            const rawImg = getProductImage(product);
            const rel = (rawImg || "").replace(/^\/+/, "");
            const imgSrc = rel
              ? `${ASSET_BASE}/${rel}`
              : `${ASSET_BASE}/uploads/placeholder.png`;
            const isFavorite = favorites.some((p) => p.id === product.id);

            return (
              <Col key={product.id} md={6} lg={4} xl={3}>
                <div className='product__item h-100 d-flex flex-column'>
                  <div className='product__item__img position-relative'>
                    <Link
                      href={`/products/${product.productId}`}
                      className='product__item__img__item d-block'
                    >
                      <Image
                        // src={imgSrc}
                        src={product.previewUrl || "/placeholder.png"}
                        alt={product.title || "Product image"}
                        className='img-fluid'
                        width={500}
                        height={500}
                        unoptimized
                      />
                    </Link>
                    {/* <div className='product__item__btn position-absolute top-0 end-0 p-2'>
                      <i className='far fa-heart'></i>
                    </div> */}
                    <div
                      className='product__item__btn position-absolute top-0 end-0 p-2'
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleFavorite(product)}
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

                  <div className='product__item__content p-3 mt-auto'>
                    <p className='product__item__brand m-0'>
                      Brand:{" "}
                      <span>
                        {product?.Brand?.id ? (
                          <Link href={`/brand/${product.Brand.id}`}>
                            {product?.Brand?.name ?? product?.brandName ?? "—"}
                          </Link>
                        ) : (
                          product?.Brand?.name ?? product?.brandName ?? "—"
                        )}
                      </span>
                    </p>

                    <h4 className='product__item__title my-2'>
                      <Link href={`/products/${product.productId}`}>
                        {product.title}
                      </Link>
                    </h4>

                    <div className='product__item__box d-flex justify-content-between align-items-center'>
                      <div className='product__item__price'>
                        {typeof product.price === "number"
                          ? `৳${product.price.toFixed(2)}`
                          : "৳—"}
                      </div>
                      <div className='product__item__ratings'>
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className='fas fa-star text-warning'></i>
                        ))}
                        <span className='ms-1'>4.9 (65)</span>
                      </div>
                    </div>

                    {/* <Link
                      href={`/products/${product.productId}`}
                      className='commerce-btn product__item__link mt-2'
                    >
                      Add to Cart 
                    </Link> */}
                    <button
                      className='commerce-btn product__item__link mt-auto'
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowModal(true);
                      }}
                    >
                      Add to Cart 
                    </button>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>

        {selectedProduct && (
          <AddToCartModal
            show={showModal}
            onHide={() => setShowModal(false)}
            product={selectedProduct}
          />
        )}

        {/* Pagination */}

        <div className='feature-product__pagination mt-4'>
          <div className='post-pagination'>
            <button
              className='previous'
              disabled={page <= 1 || isPending}
              onClick={() => {
                handlePrev();
                requestAnimationFrame(() => scrollToSectionTop());
              }}
            >
              <i className='icon-left-arrow'></i> Previous
            </button>

            {/* <ul className='post-pagination-list justify-content-center'>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <li key={n}>
                  <button
                    type='button'
                    className={n === page ? "active" : ""}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                </li>
              ))}
            </ul> */}
            <ul className='post-pagination-list justify-content-center'>
              {paginationRange.map((item, idx) => {
                if (item === DOTS) {
                  return (
                    <li key={`dots-${idx}`}>
                      <span className='dots'>…</span>
                    </li>
                  );
                }

                return (
                  <li key={item}>
                    <button
                      type='button'
                      className={item === page ? "active" : ""}
                      onClick={() => {
                        setPage(item);
                        requestAnimationFrame(() => scrollToSectionTop());
                      }}
                      disabled={isPending}
                    >
                      {item}
                    </button>
                  </li>
                );
              })}
            </ul>

            <button
              className='next'
              disabled={page >= totalPages || isPending}
              onClick={() => {
                handleNext();
                requestAnimationFrame(() => scrollToSectionTop());
              }}
            >
              Next 
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
};
export default FeatureProduct;
