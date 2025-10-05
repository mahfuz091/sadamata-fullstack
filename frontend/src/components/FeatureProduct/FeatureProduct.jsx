// components/FeatureProductSection.js
"use client";
const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL ;
import Image from "next/image";
import { useState, useEffect, useTransition } from "react";
import { Container, Row, Col, Button, Nav, Pagination, Spinner } from "react-bootstrap";

import {
  getAllProducts,
  getNewArrivals,
  getBestSellers,
  getFeaturedProducts,
} from "@/app/actions/product/product.actions";
import Link from "next/link";
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



const FeatureProduct = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isPending, startTransition] = useTransition();
  const pageSize = 8;


console.log(products, "products");






  // Fetch whenever tab or page changes
  useEffect(() => {
    startTransition(async () => {
      try {
        const loader = loaders[activeTab];
        const data = await loader({ page, pageSize });
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
console.log(products, "products");

  return (
    // <section className='feature-product py-5'>
    //   <Container>
    //     <div className='feature-product__top text-center mb-4'>
    //       <h2 className='feature-product__title mb-3'>
    //         Elevate Your Style with Our Trendy Tees
    //       </h2>
    //       <ul className='list-unstyled post-filter feature-product__filter__list'>
    //         {filters.map((item) => (
    //           <li
    //             key={item.value}
    //             className={`${filter === item.value ? "active" : ""}`}
    //             onClick={() => setFilter(item.value)}
    //           >
    //             <span>{item.label}</span>
    //           </li>
    //         ))}
    //       </ul>
    //     </div>

    //     <Row className='g-4'>
    //       {products.map((product) => (
    //         <Col key={product.id} md={6} lg={4} xl={3}>
    //           <div className='product__item'>
    //             <div className='product__item__img position-relative'>
    //               <a href='#' className='product__item__img__item d-block'>
    //                 <Image
    //                   src={productImg}
    //                   alt='product image'
    //                   className='img-fluid'
    //                 />
    //               </a>
    //               <div className='product__item__btn position-absolute top-0 end-0 p-2'>
    //                 <a href='/cart'>
    //                   <i className='far fa-heart'></i>
    //                 </a>
    //               </div>
    //             </div>
    //             <div className='product__item__content p-3'>
    //               <p className='product__item__brand'>
    //                 Brand: <a href='#'>{product.Brand? product.Brand.name : product.brandName}</a>
    //               </p>
    //               <h4 className='product__item__title'>
    //                 <a href='/product-details'>{product.title}</a>
    //               </h4>
    //               <div className='product__item__box'>
    //                 <div className='product__item__price'>$17.95</div>
    //                 <div className='product__item__ratings'>
    //                   {[...Array(5)].map((_, i) => (
    //                     <i key={i} className='fas fa-star text-warning'></i>
    //                   ))}
    //                   <span className='ms-1'>4.9 (65)</span>
    //                 </div>
    //               </div>
    //               <a href='/cart' className='commerce-btn product__item__link'>
    //                 Add to Cart <i className='icon-right-arrow'></i>
    //               </a>
    //             </div>
    //           </div>
    //         </Col>
    //       ))}
    //     </Row>

    //     <div className='feature-product__pagination'>
    //       <div className='post-pagination'>
    //         <a href='#' className='previous'>
    //           <i className='icon-left-arrow'></i> Previous
    //         </a>
    //         <ul className='post-pagination-list justify-content-center'>
    //           <li>
    //             {" "}
    //             <a href='#' className='active'>
    //               1
    //             </a>
    //           </li>
    //           <li>
    //             {" "}
    //             <a href='#'>2</a>
    //           </li>
    //           <li>
    //             {" "}
    //             <a href='#'>3</a>
    //           </li>
    //           <li>
    //             {" "}
    //             <a href='#'>...</a>
    //           </li>
    //         </ul>
    //         <a href='#' className='next'>
    //           Next <i className='icon-right-arrow'></i>
    //         </a>
    //       </div>
    //     </div>
    //   </Container>
    // </section>
    <section className="feature-product py-5">
      <Container>
        <div className="feature-product__top text-center mb-4">
          <h2 className="feature-product__title mb-3">
            Elevate Your Style with Our Trendy Tees
          </h2>

          <ul className="list-unstyled post-filter feature-product__filter__list">
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
           <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
          )}
        </div>

        <Row className="g-4">
          {products.map((product) => {
           const rel = (product?.variants[0]?.frontImg || "").replace(/^\/+/, ""); // strip leading slash
  const imgSrc = rel ? `${ASSET_BASE}/${rel}` : `${ASSET_BASE}/uploads/placeholder.png`;

            return (
              <Col key={product.id} md={6} lg={4} xl={3}>
                <div className="product__item h-100 d-flex flex-column">
                  <div className="product__item__img position-relative">
                    <a className="product__item__img__item d-block">
                      <Image
                        src={imgSrc}
                        alt={product.title || "Product image"}
                        className="img-fluid"
                        width={500}
                        height={500}
                        unoptimized
                      />
                    </a>
                    <div className="product__item__btn position-absolute top-0 end-0 p-2">
                      <i className="far fa-heart"></i>
                    </div>
                  </div>

                  <div className="product__item__content p-3 mt-auto">
                    <p className="product__item__brand m-0">
                      Brand:{" "}
                      <span>
                        {product?.Brand?.name ??
                          product?.brandName ??
                          "—"}
                      </span>
                    </p>

                    <h4 className="product__item__title my-2">
                      <Link href={`/products/${product.productId}`}>{product.title}</Link>
                    </h4>

                    <div className="product__item__box d-flex justify-content-between align-items-center">
                      <div className="product__item__price">
                        {typeof product.price === "number"
                          ? `$${product.price.toFixed(2)}`
                          : "$—"}
                      </div>
                      <div className="product__item__ratings">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="fas fa-star text-warning"></i>
                        ))}
                        <span className="ms-1">4.9 (65)</span>
                      </div>
                    </div>

                    <Link href={`/products/${product.productId}`} className="commerce-btn product__item__link mt-2">
                      Add to Cart <i className="icon-right-arrow"></i>
                    </Link>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>

        {/* Pagination */}
        <div className="feature-product__pagination mt-4">
          <Pagination className="justify-content-center">
            <Pagination.Prev disabled={page <= 1 || isPending} onClick={handlePrev} />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Pagination.Item
                key={n}
                active={n === page}
                onClick={() => setPage(n)}
                disabled={isPending}
              >
                {n}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={page >= totalPages || isPending}
              onClick={handleNext}
            />
          </Pagination>
        </div>
      </Container>
    </section>
  );
};
export default FeatureProduct;
