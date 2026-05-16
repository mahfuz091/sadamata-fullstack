// BrandProfile.jsx
"use client"
import React, { useMemo, useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
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
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import Pagination from 'react-bootstrap/Pagination';

// A simple ProductCard component

import FollowButton from "../brand/FollowButton";
import AddToCartModal from "../FeatureProduct/AddToCartModal";

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
    key: "youtube",
    href: brand?.youtubeLink,
    icon: <FaYoutube />,
    label: "YouTube",
  },
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
    key: "tiktok",
    href: brand?.tiktokLink,
    icon: <FaTiktok />,
    label: "TikTok",
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
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleFavorite, isFavorite } = useFavorites();
  const itemsPerPage = 40;

  const sourceProducts = activeGroup?.products?.length > 0 ? activeGroup.products : products;

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sourceProducts;
    return sourceProducts.filter((p) =>
      (p.title || "").toLowerCase().includes(q) ||
      (p.Brand?.name || p.brandName || "").toLowerCase().includes(q)
    );
  }, [sourceProducts, searchQuery]);

  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const brandStyles = `
  .brand-socials-wrapper {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .brand-social-link {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--commerce-text);
    transition: all 0.3s ease;
    font-size: 14px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  .brand-social-link:hover {
    background-color: var(--commerce-base);
    color: white;
    transform: translateY(-2px);
  }
  .input-group-text {
    background-color: #f8f9fa;
    border-color: #e8effc;
    width: 45px;
    justify-content: center;
    color: var(--commerce-text);
  }
  .banner-upload-preview {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background-color: #f7f8fa;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.3s ease;
  }
  .banner-upload-preview:hover {
    border-color: var(--commerce-base) !important;
  }
  .banner-upload-preview.is-dragging {
    border: 2px dashed var(--commerce-base) !important;
    background-color: rgba(var(--commerce-base-rgb), 0.05);
  }
  .banner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 2;
  }
  .banner-upload-preview:hover .banner-overlay {
    opacity: 1;
  }
  .banner-upload-preview i {
    font-size: 24px;
    margin-bottom: 8px;
  }
  .reposition-hint {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(0,0,0,0.6);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    pointer-events: none;
    z-index: 3;
  }
  .grabbing {
    cursor: grabbing !important;
  }
  .grab {
    cursor: grab !important;
  }
  .banner-edit-container {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 10;
  }
  .banner-edit-btn {
    background: white;
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    font-weight: 600;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 8px;
    color: #1c1e21;
    transition: background 0.2s;
  }
  .banner-edit-btn:hover {
    background: #f2f2f2;
  }
  .banner-dropdown-menu {
    position: absolute;
    bottom: 100%;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    width: 200px;
    padding: 8px 0;
    margin-bottom: 8px;
    display: flex;
    flex-direction: column;
    z-index: 100;
  }
  .banner-dropdown-item {
    background: none;
    border: none;
    padding: 8px 16px;
    text-align: left;
    font-size: 14px;
    color: #1c1e21;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: background 0.2s;
  }
  .banner-dropdown-item:hover {
    background: #f2f2f2;
  }
  .banner-reposition-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 12px 20px;
    background: rgba(0,0,0,0.6);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 15;
  }
  .banner-reposition-controls {
    display: flex;
    gap: 12px;
  }
  .banner-btn-save {
    background: var(--commerce-base);
    color: white;
    border: none;
    padding: 6px 16px;
    border-radius: 6px;
    font-weight: 600;
  }
  .banner-btn-cancel {
    background: rgba(255,255,255,0.2);
    color: white;
    border: none;
    padding: 6px 16px;
    border-radius: 6px;
    font-weight: 600;
  }
  .pagination {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
  }

  .pagination .page-item {
    margin: 0 4px;
  }

  .pagination .page-item.active .page-link {
    background-color: var(--commerce-base);
    border-color: var(--commerce-base);
    color: white;
  }

  .pagination .page-link {
    border-radius: 4px;
    padding: 6px 12px;
    border: 1px solid #dee2e6;
    color: #6c757d;
    transition: background-color 0.3s, color 0.3s;
    outline: none;
  }
    .pagination .page-link:focus{
    box-shadow: none;
    }

  .pagination .page-link:hover {
    background-color: var(--commerce-base) !important;
    color: white;
  }
`;

  return (
    <>
      <div className='brand-profile-top'>
        <style>{brandStyles}</style>
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
                  <form className='brand-profile-top__form__group__form' onSubmit={handleSearch}>
                    <input
                      type='text'
                      name='text'
                      placeholder='Search products'
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    />
                    <button type='submit' className='commerce-btn'>
                      <i className='fas fa-search'></i>
                    </button>
                  </form>
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
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <Col key={product.id} xl={3} lg={4} md={6} sm={6}>
                    <ProductCard
                      product={product}
                      onAddToCart={(p) => { setSelectedProduct(p); setShowModal(true); }}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={isFavorite}
                    />
                  </Col>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <p>{searchQuery ? "No products match your search." : "No products found for this brand."}</p>
                </div>
              )}
            </div>
            <Pagination className="justify-content-center">
              <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              {Array.from({ length: totalPages }, (_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={currentPage === idx + 1}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <AddToCartModal
          show={showModal}
          onHide={() => setShowModal(false)}
          product={selectedProduct}
        />
      )}
    </>
  );
};

export default BrandProfile;
