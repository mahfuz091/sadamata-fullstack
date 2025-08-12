"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import image from "@/assets/images/products/cart.png";
import CustomSelect from "../CustomSelect/CustomSelect";
import DashSidebar from "../DashSidebar/DashSidebar";

export default function DashboardManage() {
  const [products, setProducts] = useState([
    {
      id: 1,
      marketplace: ".com",
      title: "Fathers day shirt funny its",
      brand: "Husband and dad last minute father's day gift",
      type: "Standard T-shirt",
      modified: "2/3/25",
      price: "$14.00",
      status: "Live",
      image: image,
    },
    {
      id: 2,
      marketplace: ".com",
      title: "Fathers day shirt funny its",
      brand: "Husband and dad last minute father's day gift",
      type: "Standard T-shirt",
      modified: "2/3/25",
      price: "$14.00",
      status: "Live",
      image: image,
    },
    {
      id: 3,
      marketplace: ".com",
      title: "Fathers day shirt funny its",
      brand: "Husband and dad last minute father's day gift",
      type: "Standard T-shirt",
      modified: "2/3/25",
      price: "$14.00",
      status: "Live",
      image: image,
    },
    {
      id: 4,
      marketplace: ".com",
      title: "Fathers day shirt funny its",
      brand: "Husband and dad last minute father's day gift",
      type: "Standard T-shirt",
      modified: "2/3/25",
      price: "$14.00",
      status: "Live",
      image: image,
    },
    {
      id: 5,
      marketplace: ".com",
      title: "Fathers day shirt funny its",
      brand: "Husband and dad last minute father's day gift",
      type: "Standard T-shirt",
      modified: "2/3/25",
      price: "$14.00",
      status: "Live",
      image: image,
    },
    {
      id: 6,
      marketplace: ".com",
      title: "Fathers day shirt funny its",
      brand: "Husband and dad last minute father's day gift",
      type: "Standard T-shirt",
      modified: "2/3/25",
      price: "$14.00",
      status: "Live",
      image: image,
    },
    {
      id: 7,
      marketplace: ".com",
      title: "Fathers day shirt funny its",
      brand: "Husband and dad last minute father's day gift",
      type: "Standard T-shirt",
      modified: "2/3/25",
      price: "$14.00",
      status: "Live",
      image: image,
    },
    {
      id: 8,
      marketplace: ".com",
      title: "Fathers day shirt funny its",
      brand: "Husband and dad last minute father's day gift",
      type: "Standard T-shirt",
      modified: "2/3/25",
      price: "$14.00",
      status: "Live",
      image: image,
    },
    {
      id: 9,
      marketplace: ".com",
      title: "Fathers day shirt funny its",
      brand: "Husband and dad last minute father's day gift",
      type: "Standard T-shirt",
      modified: "2/3/25",
      price: "$14.00",
      status: "Live",
      image: image,
    },
    {
      id: 1,
      marketplace: ".com",
      title: "Fathers day shirt funny its",
      brand: "Husband and dad last minute father's day gift",
      type: "Standard T-shirt",
      modified: "2/3/25",
      price: "$14.00",
      status: "Live",
      image: image,
    },
    {
      id: 1,
      marketplace: ".com",
      title: "Fathers day shirt funny its",
      brand: "Husband and dad last minute father's day gift",
      type: "Standard T-shirt",
      modified: "2/3/25",
      price: "$14.00",
      status: "Live",
      image: image,
    },
    {
      id: 1,
      marketplace: ".com",
      title: "Fathers day shirt funny its",
      brand: "Husband and dad last minute father's day gift",
      type: "Standard T-shirt",
      modified: "2/3/25",
      price: "$14.00",
      status: "Live",
      image: image,
    },
    {
      id: 1,
      marketplace: ".com",
      title: "Fathers day shirt funny its",
      brand: "Husband and dad last minute father's day gift",
      type: "Standard T-shirt",
      modified: "2/3/25",
      price: "$14.00",
      status: "Live",
      image: image,
    },
    // Add more products here
  ]);

  const handleSelect = (selected) => {
    console.log("Selected:", selected);
  };

  const options = [
    { value: "chocolate", label: "Marketplace: All" },
    { value: "strawberry", label: "Marketplace: All" },
    { value: "vanilla", label: "Marketplace: All" },
  ];
  const options2 = [
    { value: "chocolate", label: "Product: 1 Selected" },
    { value: "strawberry", label: "Product: 1 Selected" },
    { value: "vanilla", label: "Product: 1 Selected" },
  ];
  const options3 = [
    { value: "chocolate", label: "Status: All" },
    { value: "strawberry", label: "Status: All" },
    { value: "vanilla", label: "Status: All" },
  ];
  const options4 = [
    { value: "chocolate", label: "Availability: All" },
    { value: "strawberry", label: "Availability: All" },
    { value: "vanilla", label: "Availability: All" },
  ];

  return (
    <section className='dashboard-area section-space'>
      <div className='container'>
        <div className='row gutter-x-40'>
          <div className='col-lg-3'>
            <DashSidebar />
          </div>

          <div className='col-lg-9'>
            <div className='dashboard-area__content'>
              <div className='dashboard-area__top'>
                <h2 className='dashboard-area__title'>Manage</h2>
                <div className='dashboard-area__button-group'>
                  <button className='commerce-btn active'>Products</button>
                  <button className='commerce-btn'>Designs</button>
                </div>
              </div>

              <div className='dashboard-area__tabel-box'>
                <div className='filter-section'>
                  <div className='filter-section__left'>
                    <div className='filter-item'>
                      <CustomSelect
                        options={options}
                        onChange={handleSelect}
                        placeholder='Marketplace: All'
                      />
                    </div>
                    <div className='filter-item'>
                      <CustomSelect
                        options={options2}
                        onChange={handleSelect}
                        placeholder='Product: 1 Selected'
                      />
                    </div>
                    <div className='filter-item'>
                      <CustomSelect
                        options={options3}
                        onChange={handleSelect}
                        placeholder='Status: All'
                      />
                    </div>
                    <div className='filter-item'>
                      <CustomSelect
                        options={options4}
                        onChange={handleSelect}
                        placeholder='Availability: All'
                      />
                    </div>
                  </div>
                  <div className='filter-item'>
                    <div className='filter-item__search'>
                      <input type='text' name='search' placeholder='Search' />
                      <button type='submit'>
                        <i className='fas fa-search'></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className='dashboard-area__tabel'>
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        {[
                          "Mkt",
                          "Title",
                          "Brand",
                          "Product Type",
                          "Modified",
                          "List Price",
                          "Status",
                          "Edit",
                        ].map((header) => (
                          <th key={header}>
                            <div className='sort-item'>
                              <span>{header}</span>
                              <div className='sort-btn-group'>
                                <button className='ort-btn'>
                                  <i className='fas fa-caret-up'></i>
                                </button>
                                <button className='ort-btn'>
                                  <i className='fas fa-caret-down'></i>
                                </button>
                              </div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.marketplace}</td>
                          <td>
                            <div className='d-flex align-items-center'>
                              <Image
                                src={product.image}
                                alt='Product Image'
                                className='product-image me-2'
                              />
                              <span>{product.title}</span>
                            </div>
                          </td>
                          <td>{product.brand}</td>
                          <td>{product.type}</td>
                          <td>{product.modified}</td>
                          <td>{product.price}</td>
                          <td>{product.status}</td>
                          <td>
                            <button className='action-buttons'>
                              {/* You can replace with a component or an icon library */}
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='16'
                                height='15'
                                viewBox='0 0 16 15'
                                fill='none'
                              >
                                <path
                                  d='M9.64016 1.17332L10.2268 0.58665C10.9202 -0.106683 12.1268 -0.106683 12.8202 0.58665L13.2935 1.05998C13.6402 1.40665 13.8335 1.86665 13.8335 2.35332C13.8335 2.83998 13.6402 3.30665 13.2935 3.64665L12.7068 4.23332L9.64016 1.16665V1.17332ZM8.9335 1.87998L2.86016 7.95332C2.66683 8.14665 2.54683 8.39998 2.52683 8.67332L2.34683 10.6266C2.32683 10.8733 2.4135 11.1133 2.58683 11.2933C2.74683 11.4533 2.9535 11.54 3.1735 11.54H3.24683L5.20016 11.36C5.4735 11.3333 5.72683 11.2133 5.92016 11.02L11.9935 4.94665L8.92683 1.87998H8.9335ZM15.1668 13.6666C15.1668 13.3933 14.9402 13.1666 14.6668 13.1666H1.3335C1.06016 13.1666 0.833496 13.3933 0.833496 13.6666C0.833496 13.94 1.06016 14.1666 1.3335 14.1666H14.6668C14.9402 14.1666 15.1668 13.94 15.1668 13.6666Z'
                                  fill='#818B9C'
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className='dashboard-area__btn'>
                <Link href='#'>
                  Load More <i className='icon-right-arrow'></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
