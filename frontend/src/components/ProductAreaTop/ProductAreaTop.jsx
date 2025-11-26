'use client';
import Link from 'next/link';
import React from 'react';
import Select from 'react-select';

const customStyles = {
  container: (base) => ({
    ...base,
    minWidth: '180px',
  }),
  control: (base) => ({
    ...base,
    border: '1px solid var(--commerce-border-color)',
    borderRadius: '8px !important',
    boxShadow: 'none',
    minHeight: '46px',
  }),
  indicatorSeparator: () => null,
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused || state.isSelected ? 'var(--commerce-base)' : 'white',
    color: state.isFocused || state.isSelected ? 'white' : 'black',
    borderBottom: '1px solid grey',
  }),
};

const options = [
  { value: 'views_desc', label: 'Sort by views' },
  { value: 'price_asc', label: 'Sort by price (low → high)' },
  { value: 'price_desc', label: 'Sort by price (high → low)' },
];

function rangeLabel(total, page, pageSize) {
  if (!total) return 'No products found';
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return `Showing ${start} – ${end} of ${total} product${total === 1 ? '' : 's'}`;
}

const ProductAreaTop = ({ slug, q, result, sortBy, setSortBy }) => {
  const { total = 0, page = 1, pageSize = 12 } = result || {};

  return (
    <div className="product-header-top">
      <ul className="commerce-breadcrumb list-unstyled">
        <li><Link href="/">Home</Link></li>
        {slug && <li><Link href="#">{slug}</Link></li>}
        {q && <li><span>{q}</span></li>}
      </ul>

      <div className="product-header-top__inner">
        <div className="product-header-top__text-box">
          <h2 className="product-header-top__title">
            {q ? <>Showing products for “{q}”</> : 'Products'}
          </h2>
          <p className="product-header-top__text">
            {rangeLabel(total, page, pageSize)}
          </p>
        </div>

        <div className="product-header-top__right">
          <div className="product-header-top__showing-sort">
            <span className="product-header-top__showing-sort__title">Sort By:</span>
            <Select
              options={options}
              styles={customStyles}
              components={{ IndicatorSeparator: () => null }}
              value={options.find(o => o.value === sortBy)}
  onChange={(opt) => setSortBy(opt.value)}
              defaultValue={options[0]}
              isClearable={false}
              isSearchable={false}
              placeholder="Relevant Products"
            />
          </div>

          <Link className="product-header-top__showing-box" href="#" aria-label="Grid view">
            <i className="icon-element"></i>
          </Link>
          <Link className="product-header-top__showing-box" href="#" aria-label="List view">
            <i className="fas fa-bars"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductAreaTop;
