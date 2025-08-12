"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import image from "@/assets/images/products/product-d-4-1.png";
import itemImage from "@/assets/images/products/item-1-1.png";

import bgImage from "@/assets/images/backgrounds/admin-bg-home.jpg";
import userImage from "@/assets/images/resources/user-1-1.png";

import item1 from "@/assets/images/products/product-4-1.png";
import item2 from "@/assets/images/products/product-4-1.png";
import item3 from "@/assets/images/products/product-4-1.png";
import item4 from "@/assets/images/products/product-4-1.png";
import item5 from "@/assets/images/products/product-4-1.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Responsive from "./responsive";
import CustomSelect from "../CustomSelect/CustomSelect";
import DashSidebar from "../DashSidebar/DashSidebar";

var settings = {
  dots: true,
  infinite: false,
  speed: 300,
  slidesToShow: 4,
  slidesToScroll: 4,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        dots: true,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const items = [
  {
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T‑Shirt",
    price: "17.95",
    rating: 4.9,
    reviews: 65,
  },
  {
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T‑Shirt",
    price: "17.95",
    rating: 4.9,
    reviews: 65,
  },
  {
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T‑Shirt",
    price: "17.95",
    rating: 4.9,
    reviews: 65,
  },
  ,
  {
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T‑Shirt",
    price: "17.95",
    rating: 4.9,
    reviews: 65,
  },
  ,
  {
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T‑Shirt",
    price: "17.95",
    rating: 4.9,
    reviews: 65,
  },
  ,
  {
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T‑Shirt",
    price: "17.95",
    rating: 4.9,
    reviews: 65,
  },
];

export default function DashBrand() {
  const [fileName, setFileName] = useState("");
  const [charCount, setCharCount] = useState(200);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleKeywordChange = (e) => {
    setCharCount(200 - e.target.value.length);
  };
  const options = [
    { value: "chocolate", label: "Marketplace: All" },
    { value: "strawberry", label: "Marketplace: All" },
    { value: "vanilla", label: "Marketplace: All" },
  ];

  return (
    <section className='dashboard-area section-space'>
      <div className='container'>
        <div className='row gutter-x-40'>
          <div className='col-lg-3'>
            <DashSidebar />
          </div>

          <div className='col-lg-9'>
            <div class='dashboard-area__content'>
              <div className='brand-profile-top'>
                <div
                  className='brand-profile-top__bg'
                  style={{
                    backgroundImage: `url(${bgImage.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>

                <div className='brand-profile-top__inner'>
                  <div className='brand-profile-top__profile'>
                    <div className='brand-profile-top__left'>
                      <div className='brand-profile-top__image'>
                        <Image src={userImage} alt='user image' />
                      </div>
                      <div className='brand-profile-top__content'>
                        <h4 className='brand-profile-top__name'>Disney</h4>
                        <span className='brand-profile-top__followers'>
                          5.8K Followers
                        </span>
                      </div>
                    </div>

                    <div className='brand-profile-top__right'>
                      <div className='brand-profile-top__btn'>
                        <a href='#' className='commerce-btn'>
                          <i className='icon-edit-2'></i> Edit Profile
                        </a>
                      </div>
                    </div>
                  </div>

                  <ul className='brand-profile-top__list list-unstyled'>
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <li key={idx} className={idx === 0 ? "active" : ""}>
                        <a href='#'>Brand Name</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className='brand-item-area'>
                <div className='row gutter-x-51 gutter-y-20'>
                  {items.map((item, idx) => (
                    <div key={idx} className='col-lg-4 col-md-6 col-sm-6'>
                      <div className='brand-item'>
                        <div className='brand-item__img'>
                          <a href='#' className='brand-item__img__item'>
                            <Image
                              src={itemImage}
                              alt='product image'
                              width={300}
                              height={300}
                            />
                          </a>
                          <div className='brand-item__dropdown'>
                            <a
                              className='dropdown-toggle'
                              href='#'
                              role='button'
                              id={`dropdownMenuLink-${idx}`}
                              data-bs-toggle='dropdown'
                              aria-expanded='false'
                            >
                              <i className='fas fa-ellipsis-h'></i>
                            </a>
                            <ul
                              className='dropdown-menu'
                              aria-labelledby={`dropdownMenuLink-${idx}`}
                            >
                              <li>
                                <a className='dropdown-item' href='#'>
                                  Edit
                                  {/* SVG omitted for brevity */}
                                </a>
                              </li>
                              <li>
                                <a className='dropdown-item' href='#'>
                                  Delete
                                  {/* SVG omitted for brevity */}
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className='brand-item__content'>
                          <p className='brand-item__brand'>
                            Brand: <a href='#'>{item.brand}</a>
                          </p>
                          <h4 className='brand-item__title'>
                            <a href='product-details.html'>{item.title}</a>
                          </h4>
                          <div className='brand-item__box'>
                            <div className='brand-item__price'>
                              ${item.price}
                            </div>
                            <div className='brand-item__ratings'>
                              {Array.from({ length: 5 }).map((_, starIdx) => (
                                <i
                                  key={starIdx}
                                  className={`fas fa-star${
                                    starIdx + 1 <= Math.floor(item.rating)
                                      ? ""
                                      : "-half"
                                  }`}
                                ></i>
                              ))}
                              <span>
                                {item.rating} ({item.reviews})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
