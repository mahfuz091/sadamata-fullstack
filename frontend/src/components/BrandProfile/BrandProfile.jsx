// BrandProfile.jsx
"use client"
import React, { useMemo, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import image from "@/assets/images/products/item-1-1.png";
import bg from "@/assets/images/backgrounds/bg-home.jpg";
import user from "@/assets/images/resources/user-1-1.png";
import Image from "next/image";
import { Col } from "react-bootstrap";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

// A simple ProductCard component

import FollowButton from "../brand/FollowButton";

const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL;

// Main BrandProfile section
const BrandProfile = ({ brand, products = [], initialIsFollowing = false, followerCount = 0 }) => {

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

      const socialLinks = [
  {
    key: "facebook",
    href: brand?.facebookLink,
    icon: <FaFacebookF />,
    label: "Facebook",
  },
  {
    key: "instagram",
    href: brand?.instagramLink,
    icon: <FaInstagram />,
    label: "Instagram",
  },
  {
    key: "linkedin",
    href: brand?.linkedinLink,
    icon: <FaLinkedinIn />,
    label: "LinkedIn",
  },
  {
    key: "twitter",
    href: brand?.twitterLink,
    icon: <FaTwitter />,
    label: "Twitter",
  },
].filter((item) => item.href);


// group products by mockup
  const mockupGroups = useMemo(() => {
    const map = new Map();

    for (const product of products) {
      const mockupId = product?.Mockup?.id || "no-mockup";
      const mockupName = product?.Mockup?.name || "Other Products";

      if (!map.has(mockupId)) {
        map.set(mockupId, {
          id: mockupId,
          name: mockupName,
          products: [],
        });
      }

      map.get(mockupId).products.push(product);
    }

    return Array.from(map.values());
  }, [products]);

  const [activeIdx, setActiveIdx] = useState(0);
  const activeGroup = mockupGroups[activeIdx] || null;
      

  return (
    <>
      <div className='brand-profile-top'>
        <div
          className='brand-profile-top__bg'
          style={{ 
            backgroundImage: `url("${bannerImg}"), url("${bg.src}")`, 
            backgroundPosition: `center ${brand?.bannerPosition || '50'}%, center` 
          }}
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
                    {followerCount} Followers
                  </span>
                  <div className="brand-profile-top__social">
                    {socialLinks.map((link) => (
                      <Link
                        key={link.key}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brand-social-link"
                        aria-label={link.label}
                      >
                        {link.icon}
                      </Link>
                    ))}
                  </div>
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
                  <FollowButton brandId={brand?.id} initialIsFollowing={initialIsFollowing} />
                </div>
              </div>
            </div>
            {/* Brand navigation/tabs could go here if needed, keeping placeholder for now */}
            <ul className="brand-profile-top__list list-unstyled">
              {mockupGroups.length > 0 ? (
                mockupGroups.map((group, idx) => (
                  <li
                    key={group.id}
                    className={idx === activeIdx ? "active" : ""}
                  >
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveIdx(idx);
                      }}
                      title={`${group.name} • ${group.products.length} products`}
                    >
                      {group.name}
                    </a>
                  </li>
                ))
              ) : (
                <li className="active">
                  <a href="#">All Products</a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
     <section className="brand-profile">
        <div className="brand-profile__bottom pb-120">
          <div className="container">
            <div className="row gutter-y-32 gutter-x-32">
              {activeGroup?.products?.length > 0 ? (
                activeGroup.products.map((product) => (
                  <Col key={product.id} xl={3} lg={4} md={6} sm={6}>
                    <ProductCard product={product} />
                  </Col>
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <Col key={product.id} xl={3} lg={4} md={6} sm={6}>
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
