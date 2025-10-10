"use client";
import React from "react";
import logo from "@/assets/images/logo-sadamata.svg";
import Image from "next/image";
import avatar from "@/assets/images/shapes/aveter.png";
import Select from "react-select";
const options = [
  { value: "chocolate", label: "All Categories" },
  { value: "strawberry", label: "All Categories" },
  { value: "vanilla", label: "All Categories" },
];

// Custom styles object
const customStyles = {
  container: (base) => ({
    ...base,
    width: "100%",
  }),
  control: (base, state) => ({
    ...base,
    border: "none",
    boxShadow: "none",
    "&:hover": {
      border: "none",
    },
  }),
  indicatorSeparator: () => null,
  option: (base, state) => ({
    ...base,
    backgroundColor:
      state.isFocused || state.isSelected ? "var(--commerce-base)" : "white",
    color: state.isFocused || state.isSelected ? "white" : "black",
    borderBottom: "1px solid grey",
  }),
};
const Header = () => {
  return (
    <header className="main-header main-header--one sticky-header sticky-header--normal">
      <div className="main-header__top">
        <div className="container-fluid">
          <div className="main-header__inner">
            <div className="main-header__logo">
              <a href="index">
                <Image src={logo} alt="sadamata" width={200} height={40} />
              </a>
            </div>
            <div className="main-header__search-box">
              <form action="#" className="main-header__search">
                <div className="main-header__search__input-box">
                  <Select
                    options={options}
                    styles={customStyles}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    defaultValue={options[0]}
                    isClearable={false}
                    isSearchable={false}
                    placeholder="All Categories"
                  />
                </div>
                <div className="main-header__search__input-box">
                  <input
                    type="text"
                    name="text"
                    placeholder="Search your products"
                  />
                  <button type="submit" className="main-header__search__button">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </form>
            </div>
            <div className="main-header__right">
              {/* <div className="main-header__language">
                        <a href="#"><img src="assets/images/shapes/united-states-of-america.png" alt="commerce"/>English</a>
                        <div className="main-header__language__dropdown" style="display: none;">
                            <a href="#"><img src="assets/images/shapes/united-states-of-america.png" alt="commerce">English</a>
                            <a href="#"><img src="assets/images/shapes/flag-two.png" alt="commerce">France</a>
                        </div>
                    </div> */}
              <div className="main-header__info">
                <a href="#" className="main-header__info__item">
                  <i className="far fa-heart"></i>
                  <span>03</span>
                </a>
                <a href="#" className="main-header__info__item">
                  <i className="far fa-heart"></i>
                  <span>$75.00</span>
                </a>
              </div>
              <div className="main-header__author">
                <a href="#">
                  <Image src={avatar} alt="author" />
                </a>
              </div>
              <div className="mobile-nav__btn mobile-nav__toggler">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-header__bottom">
        <div className="container-fluid">
          <nav className="main-header__nav main-menu">
            <ul className="main-menu__list">
              <li>
                <a href="#">Offers</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li className="dropdown">
                <a href="#">Discoveries</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
