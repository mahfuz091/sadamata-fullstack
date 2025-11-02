import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import ProductAreaTop from "../ProductAreaTop/ProductAreaTop";
import item1 from "@/assets/images/products/item-1-1.png";
import Image from "next/image";
import RelatedProducts from "../RelatedProducts/RelatedProducts";
const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL ;
export const toPublicUrl = (path) => {
  if (!path) return `/uploads/placeholder.png`;
  const rel = path.replace(/^\/+/, "");

  return `${ASSET_BASE}/${rel}`;
};
const ProductArea = ({result, slug, q, brands, mockups}) => {
  return (
    <section className="product-area">
      <Container fluid>
        <ProductAreaTop  slug={slug} q={q} result={result}/>
        <div className="product-area__inner">
          <aside className="sidebar__menu">
            <ul className="sidebar__menu__area list-unstyled">
              <li className="sidebar__menu__area__item">
                <a href="#" className="sidebar__menu__title">
                  Gender
                </a>
                <ul className="sidebar__menu__sub-menu list-unstyled">
                  <li className="checkbox">
                    <input type="checkbox" name="filter" id="filter" />
                    <label htmlFor="filter">
                      <span></span>Men
                    </label>
                  </li>
                  <li className="checkbox">
                    <input type="checkbox" name="filter" id="filter1" />
                    <label htmlFor="filter1">
                      <span></span>Women
                    </label>
                  </li>
                  <li className="checkbox">
                    <input type="checkbox" name="filter" id="filter2" />
                    <label htmlFor="filter2">
                      <span></span>Youth
                    </label>
                  </li>
                  <li className="checkbox">
                    <input type="checkbox" name="filter" id="filter3" />
                    <label htmlFor="filter3">
                      <span></span>All
                    </label>
                  </li>
                </ul>
              </li>
              <li className="sidebar__menu__area__item">
                <a href="#" className="sidebar__menu__title">
                  Price Range
                </a>

                <ul className="sidebar__menu__sub-menu list-unstyled">
                  <li className="price-input-box">
                    <div className="price-input">
                      <select>
                        <option >TK</option>
                        <option>TK</option>
                        <option>TK</option>
                      </select>
                      <input type="number" placeholder="Minimum price" />
                    </div>
                  </li>
                  <li className="price-input-box">
                    <div className="price-input">
                      <select>
                        <option >TK</option>
                        <option>TK</option>
                        <option>TK</option>
                      </select>
                      <input type="number" placeholder="Maximum price" />
                    </div>
                  </li>
                </ul>
              </li>
              <li className="sidebar__menu__area__item">
                <a href="#" className="sidebar__menu__title">
                  Category
                </a>
                <ul className="sidebar__menu__sub-menu list-unstyled">
                  {
                    mockups.map(m => (
                      <li className="checkbox">
                        <input type="checkbox" name="filter" id={m.name} />
                        <label htmlFor={m.name}>
                          <span></span>{m.name}
                        </label>
                      </li>
                    ))
                  }
                  
                  <li className="checkbox-link">
                    <a href="#">Show All Categories</a>
                  </li>
                </ul>
              </li>
              <li className="sidebar__menu__area__item">
                <a href="#" className="sidebar__menu__title">
                  Brand Name
                </a>
                <ul className="sidebar__menu__sub-menu list-unstyled">
                  {
                    brands.map(b => (
                      <li className="checkbox">
                        <input type="checkbox" name="filter" id={b.name} />
                        <label htmlFor={b.name}>
                          <span></span>{b.name}
                        </label>
                      </li>
                    ))
                  }
                  
                  <li className="checkbox-link">
                    <a href="#">Show All</a>
                  </li>
                </ul>
              </li>
            </ul>
          </aside>
          <div className="product-area__content">
            <Row className="gutter-y-32 gutter-x-32">
              {
                result.items.map(item => (
                  <Col xl={3} lg={4} md={6} key={item.id}>
                <div className="product__item">
                  <div className="product__item__img">
                    <div className="product__item__img__item">
                      <Image src={toPublicUrl(item.variants[0].frontImg)} alt="product image" width={300} height={300} />
                    </div>
                    <div className="product__item__btn">
                      <a href="cart.html">
                        <i className="far fa-heart"></i>
                      </a>
                    </div>
                  </div>
                  <div className="product__item__content">
                    <p className="product__item__brand">
                      Brand: <a href="#">{ item.brandName }</a>
                    </p>
                    <h4 className="product__item__title">
                      <a href={`/products/${item.productId}`}>
                        {item.title}
                      </a>
                    </h4>
                    <div className="product__item__box">
                      <div className="product__item__price">৳ {item.price}</div>
                      <div className="product__item__ratings">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <span>4.9 (65)</span>
                      </div>
                    </div>
                    <a
                      href="cart.html"
                      className="commerce-btn product__item__link"
                    >
                      Add to Cart{" "}
                      <i className="icon-right-arrow"></i>
                    </a>
                  </div>
                </div>
              </Col>
                ))
              }
              
            </Row>
            <div className="post-pagination">
              <a href="#" className="previous">
                <i className="icon-left-arrow"></i> Previous
              </a>
              <ul className="post-pagination-list justify-content-center">
                <li>
                  {" "}
                  <a href="#" className="active">
                    1
                  </a>
                </li>
                <li>
                  {" "}
                  <a href="#">2</a>
                </li>
                <li>
                  {" "}
                  <a href="#">3</a>
                </li>
                <li>
                  {" "}
                  <a href="#">4</a>
                </li>
                <li>
                  {" "}
                  <a href="#">5</a>
                </li>
                <li>
                  {" "}
                  <a href="#">...</a>
                </li>
              </ul>
              <a href="#" className="next">
                Next <i className="icon-right-arrow"></i>
              </a>
            </div>
		  		<RelatedProducts/>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ProductArea;
