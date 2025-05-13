'use client';
import Link from 'next/link';
import React from 'react';

import Select from "react-select";
const customStyles = {
    container: (base) => ({
      ...base,
    //   width: "100%",
    minWidth: "180px",
    }),
    control: (base, state) => ({
      ...base,
      border: "1px solid var(--commerce-border-color)",
      borderRadius: "8px !important",
      boxShadow: "none",
       minHeight: "46px", 
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

const options = [
  { value: "chocolate", label: "Sort by view" },
  { value: "strawberry", label: "Sort by price" },
  { value: "vanilla", label: "Sort by price" },
];

const ProductAreaTop = () => {
    return (
        <div className="product-header-top">
        <ul className="commerce-breadcrumb list-unstyled">
            <li><Link href="/">Home</Link></li>
            <li><Link href="#">Electronic</Link></li>
            <li><span>Search Resulst</span></li>
        </ul>
        <div className="product-header-top__inner">
            <div className="product-header-top__text-box">
                <h2 className="product-header-top__title">Showing product for “Disney The Lion King”</h2>
                <p className="product-header-top__text">Showing 1 - 60 Products</p>
            </div>
            <div className="product-header-top__right">
                <div className="product-header-top__showing-sort">
                    <span className="product-header-top__showing-sort__title">Sort By:</span>
                    <Select
                    options={options}
                    styles={customStyles}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    defaultValue={options[0]}
                    isClearable={false}
                    isSearchable={false}
                    placeholder="Relevant Products"
                  />
                  
                 
                </div>
                <Link className="product-header-top__showing-box" href="#"><i className="icon-element"></i></Link>
                <Link className="product-header-top__showing-box" href="#"><i className="fas fa-bars"></i></Link>
            </div>
        </div>
    </div>
    );
};

export default ProductAreaTop;