"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import image from "@/assets/images/products/product-d-4-1.png";

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

const products = [
  {
    id: 1,
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
    price: "$17.95",
    rating: 4.9,
    reviews: 65,
    image: item1,
  },
  {
    id: 2,
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
    price: "$17.95",
    rating: 4.9,
    reviews: 65,
    image: item2,
  },
  {
    id: 3,
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
    price: "$17.95",
    rating: 4.9,
    reviews: 65,
    image: item3,
  },
  {
    id: 4,
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
    price: "$17.95",
    rating: 4.9,
    reviews: 65,
    image: item4,
  },
  {
    id: 5,
    brand: "Disney",
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
    price: "$17.95",
    rating: 4.9,
    reviews: 65,
    image: item5,
  },
  // Add more product objects here
];

export default function AddDesign() {
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
            <div className='dashboard-area__content'>
              <div className='dashboard-area__top'>
                <h2 className='dashboard-area__title'>Create Products</h2>
                <a href='#' className='commerce-btn'>
                  Select Products <i className='icon-right-arrow' />
                </a>
              </div>

              {/* Upload area */}
              <div className='dashboard-area__uplode'>
                <div className='dashboard-area__uplode-box'>
                  <form>
                    <div className='upload-area file-upload__area'>
                      <label
                        htmlFor='image-upload'
                        className='file-upload__label'
                      >
                        <input
                          type='file'
                          id='image-upload'
                          className='file-upload__input'
                          hidden
                          onChange={handleFileChange}
                        />
                        <div className='image-upload__icon'>
                          {/* SVG icon here */}
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='60'
                            height='60'
                            viewBox='0 0 60 60'
                            fill='none'
                          >
                            <path
                              d='M49.9908 22.055C47.2178 11.008 36.0146 4.30066 24.9676 7.07371C16.3346 9.24086 10.0661 16.7022 9.42027 25.5795C3.29051 26.5903 -0.859227 32.3789 0.151639 38.5086C1.05025 43.9581 5.77216 47.9489 11.2951 47.927H20.669V44.1774H11.2951C7.15341 44.1774 3.79589 40.8199 3.79589 36.6783C3.79589 32.5366 7.15341 29.1791 11.2951 29.1791C12.3305 29.1791 13.1699 28.3397 13.1699 27.3043C13.1605 17.9855 20.7074 10.4235 30.0261 10.4142C38.0929 10.4062 45.037 16.1091 46.5975 24.0234C46.7515 24.8136 47.3928 25.4173 48.191 25.5232C53.3165 26.2531 56.8797 30.9997 56.1499 36.1251C55.4945 40.7275 51.565 44.1542 46.9162 44.1774H39.417V47.927H46.9162C54.1641 47.9051 60.0219 42.0117 59.9999 34.7637C59.9816 28.7304 55.8519 23.4867 49.9908 22.055Z'
                              fill='black'
                            />
                            <path
                              d='M28.7118 29.7229L21.2126 37.2221L23.8561 39.8656L28.1681 35.5723V53.5516H31.9177V35.5723L36.211 39.8656L38.8545 37.2221L31.3553 29.7229C30.624 28.996 29.4431 28.996 28.7118 29.7229Z'
                              fill='black'
                            />
                          </svg>
                        </div>
                        <span className='file-name'>{fileName}</span>
                        <div className='image-upload__text-box'>
                          <h3 className='image-upload__title'>
                            Drag and drop artwork here
                          </h3>
                          <p className='image-upload__text'>
                            or Click to browse for a file
                          </p>
                        </div>
                      </label>
                    </div>
                  </form>
                </div>

                {/* Guidelines */}
                <div className='dashboard-area__tag-box'>
                  <div className='tag-box-top'>
                    <h2 className='tag-box-title'>Artwork should be:</h2>
                    <button
                      className='tag-box-button'
                      data-target='.tag-box-button__list'
                    >
                      <i className='fas fa-caret-down' />
                    </button>
                  </div>
                  <div className='dashboard-area__list tag-box-button__list toggle-list'>
                    <button className='tag-iterm'>PNG format</button>
                    <button className='tag-iterm'>
                      As large as possible (dimensions of 4500 pixels or more
                      will give you the most flexibility)
                    </button>
                    <button className='tag-iterm'>
                      RGB color, 8 bits/channel
                    </button>
                    <button className='tag-iterm'>Less than 25 MB</button>
                  </div>
                </div>
              </div>

              {/* Product Slider Placeholder (use react-slick or similar if dynamic) */}
              <div className='product-category-list'>
                <div className=''>
                  <Slider
                    {...settings}
                    className='product-slider__carousel commerce-slick__carousel'
                  >
                    {products.map((item, index) => (
                      <div className='item' key={index}>
                        <div className='product__item-two'>
                          <div className='product__item-two__img'>
                            <a
                              href='#'
                              className='product__item-two__img__item'
                            >
                              <Image src={item.image} alt='product image' />
                            </a>
                          </div>
                          <div className='product__item-two__content'>
                            <h4 className='product__item-two__title'>
                              <a href='product-details'>{item.title}</a>
                            </h4>

                            <a
                              href='cart'
                              className='commerce-btn product__item-two__link'
                            >
                              Edit Details <i className='icon-right-arrow'></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                  {/* <Responsive /> */}
                </div>
              </div>

              {/* Product Preview Section */}
              <div className='product-preview-panel'>
                <h2>Product Preview</h2>
                <div className='row gutter-x-30 gutter-y-30'>
                  <div className='col-lg-6'>
                    <div className='product-preview-panel__view-toggle'>
                      <button className='toggle-btn active'>Front</button>
                      <button className='toggle-btn'>Back</button>
                    </div>
                    <div className='product-preview-panel__product-image'>
                      <Image
                        src={image}
                        alt='T-shirt Preview'
                        width={400}
                        height={400}
                      />
                    </div>
                  </div>
                  <div className='col-lg-6'>
                    <div className='product-preview-panel__product-options'>
                      <div className='product-preview-panel__fit-type-selector'>
                        <p className='product-preview-panel__label'>
                          Choose fit types:
                        </p>
                        <label className='fit-checkbox'>
                          <input type='checkbox' checked />
                          <span className='custom-check'></span>
                          Men
                        </label>

                        <label className='fit-checkbox'>
                          <input type='checkbox' />
                          <span className='custom-check'></span>
                          Women
                        </label>

                        <label className='fit-checkbox'>
                          <input type='checkbox' />
                          <span className='custom-check'></span>
                          Youth
                        </label>
                      </div>

                      <div className='product-preview-panel__color-chooser'>
                        <p className='product-preview-panel__label'>
                          Choose colors:
                        </p>
                        <div className='color-options'>
                          <span className='color black'></span>
                          <span className='color green'></span>
                          <span className='color teal'></span>
                          <span className='color red'></span>
                          <span className='color blue'></span>
                          <span className='color light-blue'></span>
                          <span className='color light-gray'></span>
                        </div>
                      </div>

                      <div className='product-preview-panel__price-input-field'>
                        <label className='product-preview-panel__label'>
                          Price
                        </label>
                        <input type='text' placeholder='BDT 0.00' />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details Form */}
              <div className='product-details__form'>
                <div className='product-details__form-top'>
                  <h2 className='product-details__form-title'>
                    Artworld should be:
                  </h2>
                  <button
                    className='tag-box-button'
                    data-target='.product-details__form-two'
                  >
                    <i className='fas fa-caret-down'></i>
                  </button>
                </div>
                <form
                  action='#'
                  className='product-details__form-two toggle-list'
                >
                  <div className='row gutter-x-30 gutter-y-30'>
                    <div className='col-lg-6'>
                      <div className='product-details__form__content'>
                        <h4 className='product-details__form__title'>
                          Product details (required)
                        </h4>
                        <p className='product-details__form__text'>
                          Product names will be appended to this design title
                          e.g. a design title of “Funny Cat” will be displayed
                          as “Funny Cat T-Shirt” on the t-shirt product details
                          page.
                        </p>
                      </div>
                      <div className='form-group'>
                        <div className='form-control-two'>
                          <label htmlFor='name'>Design Title</label>
                          <input type='text' name='name' id='name' />

                          <span>
                            60 characters remaining (minimum 3 characters)
                          </span>
                        </div>
                        <div className='form-control-two'>
                          <label htmlFor='name'>Select Brand</label>
                          <CustomSelect options={options} />

                          <input
                            type='text'
                            name='name'
                            placeholder='Write your brand'
                            className='mt-2'
                          />
                          <span>
                            50 characters remaining (minimum 3 characters)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-6'>
                      <div className='product-details__form__content'>
                        <h4 className='product-details__form__title'>
                          Product Features (optional)
                        </h4>
                        <p className='product-details__form__text'>
                          Summarize the unique details of your design. They’ll
                          appear in a bulleted list, along with other product
                          information we automatically include
                        </p>
                      </div>
                      <div className='form-group'>
                        <div className='form-control-two'>
                          <label htmlFor='name'>Feature bullet 1</label>
                          <input type='text' name='name' id='name' />
                          <span>256 characters remaining</span>
                        </div>
                        <div className='form-control-two'>
                          <label htmlFor='name'>Feature bullet 2</label>
                          <input type='text' name='name' id='name' />
                          <span>
                            50 characters remaining (minimum 3 characters)
                          </span>
                        </div>
                        <div className='form-control-two'>
                          <label htmlFor='name'>Product descriiption</label>
                          <textarea
                            name=''
                            id=''
                            placeholder='Minimum 75 characters'
                          ></textarea>
                          <span>200 characters remaining</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Keywords Input */}
              <div className='product-details__keyword'>
                <div className='product-details__form-top'>
                  <h2 className='product-details__form-title'>
                    Artworld should be:
                  </h2>
                  <button className='tag-box-button' data-target='.keyword'>
                    <i className='fas fa-caret-down'></i>
                  </button>
                </div>
                <p className='product-details__keyword__text'>
                  When entering your product tags or keywords for SEO, you’re
                  taking a crucial step toward increasing your product’s
                  visibility <br /> and attracting more potential customers.
                </p>
                <div className='keyword toggle-list'>
                  <label htmlFor='tagInput' className='tag-input-label'>
                    *Product Keyword
                  </label>
                  <div className='tag-input-wrapper'>
                    <div className='tag-box' id='tagBox'>
                      <input
                        type='text'
                        id='tagInput'
                        className='tag-input'
                        maxlength='200'
                      />
                    </div>
                    <p className='char-limit' id='charLimit'>
                      200 characters remaining
                    </p>
                  </div>
                </div>
              </div>

              {/* Availability Section */}
              <div className='product-details__availability'>
                <div className='product-details__form-top'>
                  <h2 className='product-details__form-title'>
                    Product availability on Amazon
                  </h2>
                  <button
                    className='tag-box-button'
                    data-target='.product-details-form'
                  >
                    <i className='fas fa-caret-down'></i>
                  </button>
                </div>
                <form action='#' className='toggle-list product-details-form'>
                  <div className='row gutter-x-6'>
                    <div className='col-lg-6'>
                      <div className='product-details__item-box'>
                        <label
                          htmlFor='non-searchable'
                          className='availability__item'
                        >
                          <input
                            type='radio'
                            id='non-searchable'
                            name='searchability'
                            value='non-searchable'
                            className='sr-only'
                            checked=''
                          />
                          <span className='custom-radio-circle'></span>
                          <div className='availability__item__content'>
                            <h3 className='availability__item__title'>
                              Non-searchable
                            </h3>
                            <p className='availability__item__text'>
                              Does not appear in Sadamata search results
                            </p>
                          </div>
                        </label>
                      </div>
                      <div className='product-details__btn-group'>
                        <button type='submit' className='commerce-btn'>
                          Save Publish Settings{" "}
                          <i className='icon-right-arrow'></i>
                        </button>
                      </div>
                    </div>
                    <div className='col-lg-6'>
                      <div className='product-details__item-box'>
                        <label
                          htmlFor='searchable'
                          className='availability__item'
                        >
                          <input
                            type='radio'
                            id='searchable'
                            name='searchability'
                            value='non-searchable'
                            className='sr-only'
                            checked=''
                          />
                          <span className='custom-radio-circle'></span>
                          <div className='availability__item__content'>
                            <h3 className='availability__item__title'>
                              Searchable
                            </h3>
                            <p className='availability__item__text'>
                              Appears in amazon search results
                            </p>
                            <p className='availability__item__text'>
                              Customers can find these products through sadamata
                              search <br /> results
                            </p>
                          </div>
                        </label>
                      </div>
                      <div className='product-details__btn-group'>
                        <button type='submit' className='commerce-btn'>
                          Save draft<i className='icon-right-arrow'></i>
                        </button>
                        <button type='submit' className='commerce-btn'>
                          Publish <i className='icon-right-arrow'></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <p className='product-details__availability__text'>
                  By submitting for production, you acknowledge you have all the
                  necessary rights to the original artwork, Brand name, design
                  title, product features and description.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
