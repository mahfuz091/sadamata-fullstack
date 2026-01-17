// components/PopularProduct.js
"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import Link from "next/link";

import { getAllProducts } from "@/app/actions/product/product.actions";
import { getProductImage } from "@/lib/helper";

const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL;

const PopularProduct = () => {
  const didInitRef = useRef(false);

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 8; // load more e protibar koto product
  const [totalPages, setTotalPages] = useState(1);

  const [isPending, startTransition] = useTransition();

  const hasMore = page < totalPages;

  // Initial load (page 1)
  useEffect(() => {
    // Next.js dev strict mode e double fetch avoid
    if (didInitRef.current) return;
    didInitRef.current = true;

    startTransition(async () => {
      try {
        const data = await getAllProducts({ page: 1, pageSize });
        setProducts(data?.items || []);
        setTotalPages(data?.totalPages || 1);
        setPage(1);
      } catch (e) {
        console.error("Popular products fetch failed:", e);
        setProducts([]);
        setTotalPages(1);
        setPage(1);
      }
    });
  }, []);

  const handleLoadMore = () => {
    if (!hasMore || isPending) return;

    const nextPage = page + 1;

    startTransition(async () => {
      try {
        const data = await getAllProducts({ page: nextPage, pageSize });
        const nextItems = data?.items || [];

        // append
        setProducts((prev) => [...prev, ...nextItems]);
        setTotalPages(data?.totalPages || totalPages);
        setPage(nextPage);
      } catch (e) {
        console.error("Load more failed:", e);
      }
    });
  };

  return (
    <section className='popular-product py-5'>
      <Container>
        {/* Section top */}
        <div className='product-slider__top d-flex justify-content-between align-items-center mb-4'>
          <h2 className='product-slider__title m-0'>Most Popular Products</h2>

          <div className='d-flex align-items-center gap-3'>
            {isPending && (
              <Spinner animation='border' role='status' size='sm'>
                <span className='visually-hidden'>Loading...</span>
              </Spinner>
            )}

            <div className='product-slider__btn'>
              <Link
                href='/product'
                className='d-inline-flex align-items-center gap-1'
              >
                See All Product <i className='icon-right-arrow' />
              </Link>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <Row className='g-4'>
          {products.map((product) => {
            const rawImg = product?.previewUrl || getProductImage(product);
            const rel = (rawImg || "").replace(/^\/+/, "");

            const imgSrc = rawImg?.startsWith("http")
              ? rawImg
              : rel
                ? `${ASSET_BASE}/${rel}`
                : "/placeholder.png";

            const brand = product?.Brand?.name ?? product?.brandName ?? "—";
            const price =
              typeof product?.price === "number"
                ? `৳${product.price.toFixed(2)}`
                : "৳—";

            return (
              <Col key={product.id} xl={3} lg={4} md={6} sm={6}>
                <div className='product__item h-100 d-flex flex-column'>
                  <div className='product__item__img position-relative'>
                    <Link
                      href={`/products/${product.productId}`}
                      className='product__item__img__item d-block'
                    >
                      <Image
                        src={imgSrc}
                        alt={product?.title || "product image"}
                        width={350}
                        height={350}
                        className='img-fluid w-100'
                        unoptimized
                      />
                    </Link>

                    <div className='product__item__btn position-absolute top-0 end-0 p-2'>
                      <Link href='/cart' className='d-inline-flex'>
                        <i className='far fa-heart' />
                      </Link>
                    </div>
                  </div>

                  <div className='product__item__content flex-grow-1 d-flex flex-column pt-3'>
                    <p className='product__item__brand mb-1'>
                      Brand: <span>{brand}</span>
                    </p>

                    <h4 className='product__item__title mb-2 fs-6 fw-semibold'>
                      <Link href={`/products/${product.productId}`}>
                        {product?.title || "—"}
                      </Link>
                    </h4>

                    <div className='product__item__box d-flex justify-content-between align-items-center mt-auto mb-3'>
                      <div className='product__item__price fw-bold'>
                        {price}
                      </div>

                      <div className='product__item__ratings d-flex align-items-center gap-1'>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <i key={i} className='fas fa-star text-warning' />
                        ))}
                        <span className='small'>4.9 (65)</span>
                      </div>
                    </div>

                    <Link
                      href={`/products/${product.productId}`}
                      className='commerce-btn product__item__link mt-auto align-self-start'
                    >
                      View Product <i className='icon-right-arrow' />
                    </Link>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>

        {/* Load more button */}
        <div className='d-flex justify-content-center mt-4'>
          {hasMore ? (
            <button
              type='button'
              className='commerce-btn text-white'
              onClick={handleLoadMore}
              disabled={isPending}
            >
              {isPending ? "Loading..." : "Load More"}
            </button>
          ) : (
            <div className='text-center small opacity-75'>No more products</div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default PopularProduct;
