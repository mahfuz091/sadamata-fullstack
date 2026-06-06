  // components/PopularProduct.js
  "use client";

  import { useEffect, useRef, useState, useTransition } from "react";
  import Image from "next/image";
  import { Container, Row, Col, Spinner } from "react-bootstrap";
  import Link from "next/link";

  import { getAllProducts } from "@/app/actions/product/product.actions";
  import { getProductImage } from "@/lib/helper";
  import { toast } from "sonner";
import AddToCartModal from "../FeatureProduct/AddToCartModal";

  const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL;

  const FAVORITE_KEY = "favorite_products";
  const getFavorites = () => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];
    } catch {
      return [];
    }
  };


  const PopularProduct = () => {
    const didInitRef = useRef(false);

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 16; // load more e protibar koto product
    const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState([]);
    const [isPending, startTransition] = useTransition();
      const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

    const hasMore = page < totalPages;

    useEffect(() => {
        setFavorites(getFavorites());
      }, []);

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

    const handleLoadAll = () => {
    if (isPending) return;

    startTransition(async () => {
      try {
        // already loaded upto `page`
        let currentPage = page;
        let all = products;

        // safety: if totalPages unknown/1, nothing to do
        if (totalPages <= currentPage) return;

        // sequentially load remaining pages
        while (currentPage < totalPages) {
          const nextPage = currentPage + 1;
          const data = await getAllProducts({ page: nextPage, pageSize });
          const nextItems = data?.items || [];

          all = [...all, ...nextItems];

          // update totals if server returns updated totalPages
          const serverTotalPages = data?.totalPages || totalPages;
          setTotalPages(serverTotalPages);

          currentPage = nextPage;

          // keep UI responsive + show progressively
          setProducts(all);
          setPage(currentPage);

          // if server totalPages changed, continue until latest
          if (serverTotalPages !== totalPages) {
            // local variable update so loop uses latest
            // eslint-disable-next-line no-unused-vars
          }
        }
      } catch (e) {
        console.error("Load all failed:", e);
      }
    });
  };

  console.log("products",products);
  

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

              <div className='product-slider__btn d-none'>
    <button
      type='button'
      onClick={handleLoadAll}
      className='d-inline-flex align-items-center gap-1 bg-transparent border-0 p-0'
      style={{ cursor: "pointer" }}
      disabled={isPending || !hasMore}
    >
      {isPending ? "Loading..." : "See All Product"} 
    </button>
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

                  const isFavorite = favorites.some((p) => p.id === product.id);

              return (
                <Col key={product.id} xl={3} lg={4} md={6} sm={6} xs={6}>
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

                    <div className='product__item__content flex-grow-1 d-flex flex-column pt-3'>
                      <p className='product__item__brand mb-1'>
                        Brand:{" "}
                        <span>
                          {product?.Brand?.id ? (
                            <Link href={`/brand/${product.Brand.id}`}>
                              {brand}
                            </Link>
                          ) : (
                            brand
                          )}
                        </span>
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

                      <button
                      className='commerce-btn product__item__link mt-auto d-inline-flex align-items-center justify-content-center gap-2'
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
        {selectedProduct && (
                  <AddToCartModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    product={selectedProduct}
                  />
                )}
      </section>
    );
  };

  export default PopularProduct;
