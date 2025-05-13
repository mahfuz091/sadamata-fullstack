import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import ProductAreaTop from '../ProductAreaTop/ProductAreaTop';
import item1 from '@/assets/images/products/item-1-1.png'
import Image from 'next/image';

const ProductArea = () => {
    return (
       <section className="product-area">
        <Container fluid>
            <ProductAreaTop/>
            <div className="product-area__inner">
            <aside className="sidebar__menu">
    <ul className="sidebar__menu__area list-unstyled">
        <li className="sidebar__menu__area__item">
            <a href="#" className="sidebar__menu__title">Gender</a>
            <ul className="sidebar__menu__sub-menu list-unstyled">
                <li className="checkbox">
                    <input type="checkbox" name="filter" id="filter"/>
                    <label for="filter"><span></span>Men</label>
                </li>
                <li className="checkbox">
                    <input type="checkbox" name="filter" id="filter1"/>
                    <label for="filter1"><span></span>Women</label>
                </li>
                <li className="checkbox">
                    <input type="checkbox" name="filter" id="filter2"/>
                    <label for="filter2"><span></span>Youth</label>
                </li>
                <li className="checkbox">
                    <input type="checkbox" name="filter" id="filter3"/>
                    <label for="filter3"><span></span>All</label>
                </li>
            </ul>
        </li>
        <li className="sidebar__menu__area__item">
            <a href="#" className="sidebar__menu__title">Category</a>
        </li>
        <li className="sidebar__menu__area__item">
            <a href="#" className="sidebar__menu__title">Category</a>
            <ul className="sidebar__menu__sub-menu list-unstyled">
                <li className="checkbox">
                    <input type="checkbox" name="filter" id="category"/>
                    <label for="category"><span></span>T-shirt</label>
                </li>
                <li className="checkbox">
                    <input type="checkbox" name="filter" id="category1"/>
                    <label for="category1"><span></span>Fashion</label>
                </li>
                <li className="checkbox">
                    <input type="checkbox" name="filter" id="category2"/>
                    <label for="category2"><span></span>Head caps</label>
                </li>
                <li className="checkbox">
                    <input type="checkbox" name="filter" id="category3"/>
                    <label for="category3"><span></span>Book</label>
                </li>
                <li className="checkbox">
                    <input type="checkbox" name="filter" id="category4"/>
                    <label for="category4"><span></span>Gaming</label>
                </li>
                <li className="checkbox-link"><a href="#">Show All Categories</a></li>
            </ul>
        </li>
        <li className="sidebar__menu__area__item">
            <a href="#" className="sidebar__menu__title">Brand Name</a>
            <ul className="sidebar__menu__sub-menu list-unstyled">
                <li className="checkbox">
                    <input type="checkbox" name="filter" id="brand"/>
                    <label for="brand"><span></span>Nancy Brand</label>
                </li>
                <li className="checkbox">
                    <input type="checkbox" name="filter" id="brand1"/>
                    <label for="brand1"><span></span>Sk Brand</label>
                </li>
                <li className="checkbox">
                    <input type="checkbox" name="filter" id="brand2"/>
                    <label for="brand2"><span></span>Medan Brand</label>
                </li>
                <li className="checkbox">
                    <input type="checkbox" name="filter" id="brand3"/>
                    <label for="brand3"><span></span>Surabaya Brand</label>
                </li>
                <li className="checkbox">
                    <input type="checkbox" name="filter" id="brand4"/>
                    <label for="brand4"><span></span>Jogja Brand</label>
                </li>
                <li className="checkbox-link"><a href="#">Show All</a></li>
            </ul>
        </li>
    </ul>
</aside>
            <div className="product-area__content">
                <Row className="gutter-y-32 gutter-x-32">
                    <Col xl={3} lg={4} md={6} >
                        <div className="product__item">
	<div className="product__item__img">
		<div className="product__item__img__item">
			<Image src={item1} alt="product image"/>
		</div>
		<div className="product__item__btn">
			<a href="cart.html"><i className="far fa-heart"></i></a>
		</div>
	</div>
	<div className="product__item__content">
		<p className="product__item__brand">Brand:  <a href="#">Disney</a></p>
		<h4 className="product__item__title"><a href="product-details.html">Disney The Lion King Scar I'm Surrounded T-Shirt</a></h4>
		<div className="product__item__box">
			<div className="product__item__price">$17,95</div>
			<div className="product__item__ratings">
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<span>4.9 (65)</span>
			</div>
		</div>
		<a href="cart.html" className="commerce-btn product__item__link">Add to Cart <i className="icon-thin-long-arrow-right-icon"></i></a>
	</div>
</div>
                    </Col>
                    <Col xl={3} lg={4} md={6} >
                        <div className="product__item">
	<div className="product__item__img">
		<div className="product__item__img__item">
			<Image src={item1} alt="product image"/>
		</div>
		<div className="product__item__btn">
			<a href="cart.html"><i className="far fa-heart"></i></a>
		</div>
	</div>
	<div className="product__item__content">
		<p className="product__item__brand">Brand:  <a href="#">Disney</a></p>
		<h4 className="product__item__title"><a href="product-details.html">Disney The Lion King Scar I'm Surrounded T-Shirt</a></h4>
		<div className="product__item__box">
			<div className="product__item__price">$17,95</div>
			<div className="product__item__ratings">
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<span>4.9 (65)</span>
			</div>
		</div>
		<a href="cart.html" className="commerce-btn product__item__link">Add to Cart <i className="icon-thin-long-arrow-right-icon"></i></a>
	</div>
</div>
                    </Col>
                    <Col xl={3} lg={4} md={6} >
                        <div className="product__item">
	<div className="product__item__img">
		<div className="product__item__img__item">
			<Image src={item1} alt="product image"/>
		</div>
		<div className="product__item__btn">
			<a href="cart.html"><i className="far fa-heart"></i></a>
		</div>
	</div>
	<div className="product__item__content">
		<p className="product__item__brand">Brand:  <a href="#">Disney</a></p>
		<h4 className="product__item__title"><a href="product-details.html">Disney The Lion King Scar I'm Surrounded T-Shirt</a></h4>
		<div className="product__item__box">
			<div className="product__item__price">$17,95</div>
			<div className="product__item__ratings">
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<span>4.9 (65)</span>
			</div>
		</div>
		<a href="cart.html" className="commerce-btn product__item__link">Add to Cart <i className="icon-thin-long-arrow-right-icon"></i></a>
	</div>
</div>
                    </Col>
                    <Col xl={3} lg={4} md={6} >
                        <div className="product__item">
	<div className="product__item__img">
		<div className="product__item__img__item">
			<Image src={item1} alt="product image"/>
		</div>
		<div className="product__item__btn">
			<a href="cart.html"><i className="far fa-heart"></i></a>
		</div>
	</div>
	<div className="product__item__content">
		<p className="product__item__brand">Brand:  <a href="#">Disney</a></p>
		<h4 className="product__item__title"><a href="product-details.html">Disney The Lion King Scar I'm Surrounded T-Shirt</a></h4>
		<div className="product__item__box">
			<div className="product__item__price">$17,95</div>
			<div className="product__item__ratings">
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<span>4.9 (65)</span>
			</div>
		</div>
		<a href="cart.html" className="commerce-btn product__item__link">Add to Cart <i className="icon-thin-long-arrow-right-icon"></i></a>
	</div>
</div>
                    </Col>
                    <Col xl={3} lg={4} md={6} >
                        <div className="product__item">
	<div className="product__item__img">
		<div className="product__item__img__item">
			<Image src={item1} alt="product image"/>
		</div>
		<div className="product__item__btn">
			<a href="cart.html"><i className="far fa-heart"></i></a>
		</div>
	</div>
	<div className="product__item__content">
		<p className="product__item__brand">Brand:  <a href="#">Disney</a></p>
		<h4 className="product__item__title"><a href="product-details.html">Disney The Lion King Scar I'm Surrounded T-Shirt</a></h4>
		<div className="product__item__box">
			<div className="product__item__price">$17,95</div>
			<div className="product__item__ratings">
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<span>4.9 (65)</span>
			</div>
		</div>
		<a href="cart.html" className="commerce-btn product__item__link">Add to Cart <i className="icon-thin-long-arrow-right-icon"></i></a>
	</div>
</div>
                    </Col>
                    <Col xl={3} lg={4} md={6} >
                        <div className="product__item">
	<div className="product__item__img">
		<div className="product__item__img__item">
			<Image src={item1} alt="product image"/>
		</div>
		<div className="product__item__btn">
			<a href="cart.html"><i className="far fa-heart"></i></a>
		</div>
	</div>
	<div className="product__item__content">
		<p className="product__item__brand">Brand:  <a href="#">Disney</a></p>
		<h4 className="product__item__title"><a href="product-details.html">Disney The Lion King Scar I'm Surrounded T-Shirt</a></h4>
		<div className="product__item__box">
			<div className="product__item__price">$17,95</div>
			<div className="product__item__ratings">
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<span>4.9 (65)</span>
			</div>
		</div>
		<a href="cart.html" className="commerce-btn product__item__link">Add to Cart <i className="icon-thin-long-arrow-right-icon"></i></a>
	</div>
</div>
                    </Col>
                    <Col xl={3} lg={4} md={6} >
                        <div className="product__item">
	<div className="product__item__img">
		<div className="product__item__img__item">
			<Image src={item1} alt="product image"/>
		</div>
		<div className="product__item__btn">
			<a href="cart.html"><i className="far fa-heart"></i></a>
		</div>
	</div>
	<div className="product__item__content">
		<p className="product__item__brand">Brand:  <a href="#">Disney</a></p>
		<h4 className="product__item__title"><a href="product-details.html">Disney The Lion King Scar I'm Surrounded T-Shirt</a></h4>
		<div className="product__item__box">
			<div className="product__item__price">$17,95</div>
			<div className="product__item__ratings">
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<span>4.9 (65)</span>
			</div>
		</div>
		<a href="cart.html" className="commerce-btn product__item__link">Add to Cart <i className="icon-thin-long-arrow-right-icon"></i></a>
	</div>
</div>
                    </Col>
                </Row>
            </div>
        </div>
        </Container>
       </section>
    );
};

export default ProductArea;