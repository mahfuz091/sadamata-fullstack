"use client";
import React, { useState, useMemo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ProductAreaTop from "../ProductAreaTop/ProductAreaTop";
import Image from "next/image";
import RelatedProducts from "../RelatedProducts/RelatedProducts";

const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL;

export const toPublicUrl = (path) => {
  if (!path) return `/uploads/placeholder.png`;
  const rel = path.replace(/^\/+/, "");
  return `${ASSET_BASE}/${rel}`;
};

const ProductArea = ({ result, slug, q, brands, mockups }) => {
  // 🧠 State for filters
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

const filteredProducts = useMemo(() => {
  return result.items.filter((item) => {
    const fits = item.variants.map(
      (v) => v.fitType?.toUpperCase?.() || ""
    );

    // ✅ Gender filter
    if (
      selectedGenders.length > 0 &&
      !selectedGenders.includes("ALL") &&
      !fits.some((fit) => selectedGenders.includes(fit))
    ) {
      return false;
    }

    // ✅ Brand filter
    if (selectedBrands.length > 0 && !selectedBrands.includes(item.brandName))
      return false;

    // ✅ Category filter
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(item.mockupName)
    )
      return false;

    // ✅ Price filter
    if (minPrice && item.price < parseFloat(minPrice)) return false;
    if (maxPrice && item.price > parseFloat(maxPrice)) return false;

    return true;
  });
}, [
  result.items,
  selectedGenders,
  selectedBrands,
  selectedCategories,
  minPrice,
  maxPrice,
]);



  return (
    <section className="product-area">
      <Container fluid>
        <ProductAreaTop slug={slug} q={q} result={result} />
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
                          toggleFilter(b.name, setSelectedBrands, selectedBrands)
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
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
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
                          <a href={`/products/${item.productId}`}>
                            {item.title}
                          </a>
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
                        <a href="#" className="commerce-btn product__item__link">
                          Add to Cart <i className="icon-right-arrow"></i>
                        </a>
                      </div>
                    </div>
                  </Col>
                ))
              ) : (
                <p>No products found.</p>
              )}
            </Row>

            <div className="post-pagination">
              <a href="#" className="previous">
                <i className="icon-left-arrow"></i> Previous
              </a>
              <ul className="post-pagination-list justify-content-center">
                <li>
                  <a href="#" className="active">
                    1
                  </a>
                </li>
                <li>
                  <a href="#">2</a>
                </li>
                <li>
                  <a href="#">3</a>
                </li>
              </ul>
              <a href="#" className="next">
                Next <i className="icon-right-arrow"></i>
              </a>
            </div>

            <RelatedProducts />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ProductArea;
