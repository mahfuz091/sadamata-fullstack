// BrandProfile.jsx
import React from "react";
import ProductCard from "../ProductCard/ProductCard";
import image from "@/assets/images/products/item-1-1.png";
import bg from "@/assets/images/backgrounds/bg-home.jpg";
import user from "@/assets/images/resources/user-1-1.png";
import Image from "next/image";

// A simple ProductCard component

// Main BrandProfile section
const BrandProfile = () => {
  const products = Array(12).fill({
    image: image,
    title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
    brand: "Disney",
    price: "$17.95",
    rating: "4.9",
    reviews: 65,
  });

  return (
    <>
      <div className='brand-profile-top'>
        <div
          className='brand-profile-top__bg'
          style={{ backgroundImage: `url(${bg.src})` }}
        ></div>
        <div className='container'>
          <div className='brand-profile-top__inner'>
            <div className='brand-profile-top__profile'>
              <div className='brand-profile-top__left'>
                <div className='brand-profile-top__image'>
                  <Image src={user} alt='user image' />
                </div>
                <div className='brand-profile-top__content'>
                  <h4 className='brand-profile-top__name'>Disney</h4>
                  <span className='brand-profile-top__followers'>
                    5.8K Followers
                  </span>
                </div>
              </div>
              <div className='brand-profile-top__right'>
                <div className='brand-profile-top__form'>
                  <div className='brand-profile-top__form__group__form'>
                    <input
                      type='text'
                      name='text'
                      placeholder='Search products'
                    />
                    <button type='submit' className='commerce-btn'>
                      <i className='fas fa-search'></i>
                    </button>
                  </div>
                </div>
                <div className='brand-profile-top__btn'>
                  <a href='#'>Follow Me</a>
                </div>
              </div>
            </div>
            <ul className='brand-profile-top__list list-unstyled'>
              <li className='active'>
                <a href='#'>Brand Name</a>
              </li>
              <li>
                <a href='#'>Brand Name</a>
              </li>
              <li>
                <a href='#'>Brand Name</a>
              </li>
              <li>
                <a href='#'>Brand Name</a>
              </li>
              <li>
                <a href='#'>Brand Name</a>
              </li>
              <li>
                <a href='#'>Brand Name</a>
              </li>
              <li>
                <a href='#'>Brand Name</a>
              </li>
              <li>
                <a href='#'>Brand Name</a>
              </li>
              <li>
                <a href='#'>Brand Name</a>
              </li>
              <li>
                <a href='#'>Brand Name</a>
              </li>
              <li>
                <a href='#'>Brand Name</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <section className='brand-profile'>
        {/* Product Grid Section */}
        <div className='brand-profile__bottom pb-120'>
          <div className='container'>
            <div className='row gutter-y-32 gutter-x-32'>
              {products.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BrandProfile;
