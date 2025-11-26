"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ProductAreaTop from "../ProductAreaTop/ProductAreaTop";
import Image from "next/image";
import RelatedProducts from "../RelatedProducts/RelatedProducts";
import Link from "next/link";

const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL;

export const toPublicUrl = (path) => {
  if (!path) return `/uploads/placeholder.png`;
  const rel = path.replace(/^\/+/, "");
  return `${ASSET_BASE}/${rel}`;
};

const ProductArea = ({ result, slug, q, brands, mockups }) => {
  // 🧠 State for filters
  const [page, setPage] = useState(1);
  const pageSize = 40;
  const [sortBy, setSortBy] = useState("views_desc");

  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // 🧩 Handlers
  const toggleFilter = (value, setter, state) => {
    if (state.includes(value)) {
      setter(state.filter((v) => v !== value));
    } else {
      setter([...state, value]);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [
    selectedGenders,
    selectedBrands,
    selectedCategories,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  const { allFiltered, paginated } = useMemo(() => {
    let products = result.items.filter((item) => {
      const fits = item.variants.map((v) => v.fitType?.toUpperCase?.() || "");

      if (
        selectedGenders.length > 0 &&
        !selectedGenders.includes("ALL") &&
        !fits.some((fit) => selectedGenders.includes(fit))
      )
        return false;

      if (selectedBrands.length > 0 && !selectedBrands.includes(item.brandName))
        return false;

      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(item.mockupName)
      )
        return false;

      if (minPrice && item.price < parseFloat(minPrice)) return false;
      if (maxPrice && item.price > parseFloat(maxPrice)) return false;

      return true;
    });

    // --------- SORTING ---------
    if (sortBy === "price_asc") products.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") products.sort((a, b) => b.price - a.price);
    if (sortBy === "views_desc")
      products.sort((a, b) => (b.views || 0) - (a.views || 0));

    // --------- PAGINATION ---------
    const start = (page - 1) * pageSize;
    const paginated = products.slice(start, start + pageSize);

    return { allFiltered: products, paginated };
  }, [
    result.items,
    selectedGenders,
    selectedBrands,
    selectedCategories,
    minPrice,
    maxPrice,
    sortBy,
    page,
  ]);

  // 🧮 Filtered products
  // const filteredProducts = useMemo(() => {
  //   return result.items.filter((item) => {
  //     const gender = item.variants[0]?.fitType?.toUpperCase();

  //     // ✅ Gender filter
  //     if (
  //       selectedGenders.length > 0 &&
  //       !selectedGenders.includes("ALL") && // <-- if "ALL" selected, skip gender filter
  //       !selectedGenders.includes(gender)
  //     ) {
  //       return false;
  //     }

  //     // ✅ Brand filter
  //     if (selectedBrands.length > 0 && !selectedBrands.includes(item.brandName))
  //       return false;

  //     // ✅ Category filter
  //     if (
  //       selectedCategories.length > 0 &&
  //       !selectedCategories.includes(item.mockupName)
  //     )
  //       return false;

  //     // ✅ Price filter
  //     if (minPrice && item.price < parseFloat(minPrice)) return false;
  //     if (maxPrice && item.price > parseFloat(maxPrice)) return false;

  //     return true;
  //   });
  // }, [
  //   result.items,
  //   selectedGenders,
  //   selectedBrands,
  //   selectedCategories,
  //   minPrice,
  //   maxPrice,
  // ]);

  // const filteredProducts = useMemo(() => {
  //   return result.items.filter((item) => {
  //     const fits = item.variants.map(
  //       (v) => v.fitType?.toUpperCase?.() || ""
  //     );

  //     // ✅ Gender filter
  //     if (
  //       selectedGenders.length > 0 &&
  //       !selectedGenders.includes("ALL") &&
  //       !fits.some((fit) => selectedGenders.includes(fit))
  //     ) {
  //       return false;
  //     }

  //     // ✅ Brand filter
  //     if (selectedBrands.length > 0 && !selectedBrands.includes(item.brandName))
  //       return false;

  //     // ✅ Category filter
  //     if (
  //       selectedCategories.length > 0 &&
  //       !selectedCategories.includes(item.mockupName)
  //     )
  //       return false;

  //     // ✅ Price filter
  //     if (minPrice && item.price < parseFloat(minPrice)) return false;
  //     if (maxPrice && item.price > parseFloat(maxPrice)) return false;

  //     return true;
  //   });
  // }, [
  //   result.items,
  //   selectedGenders,
  //   selectedBrands,
  //   selectedCategories,
  //   minPrice,
  //   maxPrice,
  // ]);

  const filteredProducts = useMemo(() => {
    const products = result.items.filter((item) => {
      const fits = item.variants.map((v) => v.fitType?.toUpperCase?.() || "");

      if (
        selectedGenders.length > 0 &&
        !selectedGenders.includes("ALL") &&
        !fits.some((fit) => selectedGenders.includes(fit))
      ) {
        return false;
      }

      if (selectedBrands.length > 0 && !selectedBrands.includes(item.brandName))
        return false;

      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(item.mockupName)
      )
        return false;

      if (minPrice && item.price < parseFloat(minPrice)) return false;
      if (maxPrice && item.price > parseFloat(maxPrice)) return false;

      return true;
    });

    // ✅ Sorting
    if (sortBy === "price_asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === "views_desc") {
      products.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    return products;
  }, [
    result.items,
    selectedGenders,
    selectedBrands,
    selectedCategories,
    minPrice,
    maxPrice,
    sortBy, // <<— Add this dependency
  ]);

  const totalPages = Math.ceil(allFiltered.length / pageSize);

  return (
    <section className="product-area">
      <Container fluid>
        <ProductAreaTop
          slug={slug}
          q={q}
          result={result}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <div className="product-area__inner">
          {/* Sidebar */}
          <aside className="sidebar__menu">
            <ul className="sidebar__menu__area list-unstyled">
              {/* Gender Filter */}
              <li className="sidebar__menu__area__item">
                <a href="#" className="sidebar__menu__title">
                  Gender
                </a>
                <ul className="sidebar__menu__sub-menu list-unstyled">
                  {["MEN", "WOMEN", "YOUTH", "ALL"].map((g) => (
                    <li className="checkbox" key={g}>
                      <input
                        type="checkbox"
                        id={`gender-${g}`}
                        checked={selectedGenders.includes(g)}
                        onChange={() =>
                          toggleFilter(g, setSelectedGenders, selectedGenders)
                        }
                      />
                      <label htmlFor={`gender-${g}`}>
                        <span></span>
                        {g.charAt(0) + g.slice(1).toLowerCase()}
                      </label>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Price Range Filter */}
              <li className="sidebar__menu__area__item">
                <a href="#" className="sidebar__menu__title">
                  Price Range
                </a>
                <ul className="sidebar__menu__sub-menu list-unstyled">
                  <li className="price-input-box">
                    <div className="price-input">
                      <select>
                        <option>TK</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Minimum price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                    </div>
                  </li>
                  <li className="price-input-box">
                    <div className="price-input">
                      <select>
                        <option>TK</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Maximum price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </li>
                </ul>
              </li>

              {/* Category Filter */}
              <li className="sidebar__menu__area__item">
                <a href="#" className="sidebar__menu__title">
                  Category
                </a>
                <ul className="sidebar__menu__sub-menu list-unstyled">
                  {mockups.map((m) => (
                    <li className="checkbox" key={m.id}>
                      <input
                        type="checkbox"
                        id={`cat-${m.id}`}
                        checked={selectedCategories.includes(m.name)}
                        onChange={() =>
                          toggleFilter(
                            m.name,
                            setSelectedCategories,
                            selectedCategories
                          )
                        }
                      />
                      <label htmlFor={`cat-${m.id}`}>
                        <span></span>
                        {m.name}
                      </label>
                    </li>
                  ))}
                  <li className="checkbox-link">
                    <a href="#">Show All Categories</a>
                  </li>
                </ul>
              </li>

              {/* Brand Filter */}
              <li className="sidebar__menu__area__item">
                <a href="#" className="sidebar__menu__title">
                  Brand Name
                </a>
                <ul className="sidebar__menu__sub-menu list-unstyled">
                  {brands.map((b) => (
                    <li className="checkbox" key={b.id || b.name}>
                      <input
                        type="checkbox"
                        id={`brand-${b.name}`}
                        checked={selectedBrands.includes(b.name)}
                        onChange={() =>
                          toggleFilter(
                            b.name,
                            setSelectedBrands,
                            selectedBrands
                          )
                        }
                      />
                      <label htmlFor={`brand-${b.name}`}>
                        <span></span>
                        {b.name}
                      </label>
                    </li>
                  ))}
                  <li className="checkbox-link">
                    <a href="#">Show All</a>
                  </li>
                </ul>
              </li>
            </ul>
          </aside>

          {/* Product Grid */}
          <div className="product-area__content">
            <Row className="gutter-y-32 gutter-x-32">
              {paginated.length > 0 ? (
                paginated.map((item) => (
                  <Col xl={3} lg={4} md={6} key={item.id}>
                    <div className="product__item">
                      <div className="product__item__img">
                        <div className="product__item__img__item">
                          <Image
                            src={toPublicUrl(item.variants[0].frontImg)}
                            alt="product image"
                            width={300}
                            height={300}
                          />
                        </div>
                        <div className="product__item__btn">
                          <a href="#">
                            <i className="far fa-heart"></i>
                          </a>
                        </div>
                      </div>
                      <div className="product__item__content">
                        <p className="product__item__brand">
                          Brand: <a href="#">{item.brandName}</a>
                        </p>
                        <h4 className="product__item__title">
                          <Link href={`/products/${item.productId}`}>
                            {item.title}
                          </Link>
                        </h4>
                        <div className="product__item__box">
                          <div className="product__item__price">
                            ৳ {item.price}
                          </div>
                          <div className="product__item__ratings">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <span>4.9 (65)</span>
                          </div>
                        </div>
                        <Link
                          href={`/products/${item.productId}`}
                          className="commerce-btn product__item__link"
                        >
                          Add to Cart <i className="icon-right-arrow"></i>
                        </Link>
                      </div>
                    </div>
                  </Col>
                ))
              ) : (
                <p>No products found.</p>
              )}
            </Row>

            <div className="post-pagination">
              {/* Previous */}
              <button
                className="previous"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <i className="icon-left-arrow"></i> Previous
              </button>

              <ul className="post-pagination-list justify-content-center">
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i}>
                    <button
                      className={page === i + 1 ? "active" : ""}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Next */}
              <button
                className="next"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next <i className="icon-right-arrow"></i>
              </button>
            </div>

            <RelatedProducts />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ProductArea;
