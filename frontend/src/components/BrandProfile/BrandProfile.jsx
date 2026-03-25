// BrandProfile.jsx
import React from "react";
import ProductCard from "../ProductCard/ProductCard";
import image from "@/assets/images/products/item-1-1.png";
import bg from "@/assets/images/backgrounds/bg-home.jpg";
import user from "@/assets/images/resources/user-1-1.png";
import Image from "next/image";
import { Col } from "react-bootstrap";

// A simple ProductCard component

const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL;

// Main BrandProfile section
const BrandProfile = ({ brand, products = [] }) => {

  console.log("brand",brand);
  
  const brandName = brand?.name || "Brand Name";
  
  const rawBanner = brand?.bannerImage;
  const bannerRel = (rawBanner || "").replace(/^\/+/, "");
  const bannerImg = rawBanner?.startsWith("http")
    ? rawBanner
    : bannerRel
      ? `${ASSET_BASE}/${bannerRel}`
      : bg.src;

  const rawProfile = brand?.user?.profileImage;
  const profileRel = (rawProfile || "").replace(/^\/+/, "");
  const profileImg = rawProfile?.startsWith("http")
    ? rawProfile
    : profileRel
      ? `${ASSET_BASE}/${profileRel}`
      : user;

      console.log("bannerImg",bannerImg);
      console.log("profileImg",profileImg);
      

  return (
    <>
      <div className='brand-profile-top'>
        <div
          className='brand-profile-top__bg'
          style={{ backgroundImage: `url(${bannerImg})`, backgroundPosition: `center ${brand?.bannerPosition || '50'}%` }}
        ></div>
        <div className='container'>
          <div className='brand-profile-top__inner'>
            <div className='brand-profile-top__profile'>
              <div className='brand-profile-top__left'>
                <div className='brand-profile-top__image'>
                  <Image 
                    src={profileImg} 
                    alt={brandName} 
                    width={100} 
                    height={100} 
                    unoptimized={!!brand?.user?.profileImage}
                  />
                </div>
                <div className='brand-profile-top__content'>
                  <h4 className='brand-profile-top__name'>{brandName}</h4>
                  <span className='brand-profile-top__followers'>
                    {brand?.followersCount || "0"} Followers
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
            {/* Brand navigation/tabs could go here if needed, keeping placeholder for now */}
            <ul className='brand-profile-top__list list-unstyled'>
               <li className='active'>
                <a href='#'>All Products</a>
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
              {products.length > 0 ? (
                products.map((product, index) => (
                  <Col key={index} xl={3} lg={4} md={6} sm={6}>
                    <ProductCard product={product} />
                  </Col>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                   <p>No products found for this brand.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BrandProfile;
