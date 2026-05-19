"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import logo from "@/assets/images/logo-sadamata.svg";
import Image from "next/image";
import Link from "next/link";
import { logOut } from "@/app/actions/auth.actions";
import useScrollUp from "@/hooks/useScrollUp";
import SearchBar from "./SearchBar";

const HeaderCloned = ({ session, categories, profileImageUrl }) => {
  const scrollToTop = useScrollUp(500);

  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const computeFavorites = () => {
      const favorites = JSON.parse(localStorage.getItem("favorite_products") || "[]");
      setFavoriteCount(favorites.length);
    };
    computeFavorites();
    window.addEventListener("favorite-updated", computeFavorites);
    return () => window.removeEventListener("favorite-updated", computeFavorites);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/mockups", { cache: "no-store" });
        const data = await res.json();
        if (mounted) setOptions(data?.options ?? []);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const computeTotal = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const total = cart.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
        0
      );
      setCartTotal(total);
    };
    computeTotal();
    window.addEventListener("cart-updated", computeTotal);
    return () => window.removeEventListener("cart-updated", computeTotal);
  }, []);

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = offcanvasOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [offcanvasOpen]);

  return (
    <>
      <header
        className={`main-header main-header--one sticky-header sticky-header--normal sticky-header--cloned ${
          scrollToTop ? "active" : ""
        }`}
      >
        <div className='main-header__top'>
          <div className='container-fluid'>
            <div className='main-header__inner'>
              <div className='main-header__logo'>
                <Link href='/'>
                  <Image src={logo} alt='sadamata' width={140} height={30} />
                </Link>
              </div>
              <SearchBar options={options} />
              <div className='main-header__right'>
                <div className='main-header__info'>
                  <Link href='/favorites' prefetch={false} className='main-header__info__item'>
                    <i className='far fa-heart'></i>
                    <span>{favoriteCount.toString().padStart(2, "0")}</span>
                  </Link>
                  <Link href='/cart' prefetch={false} className='main-header__info__item'>
                    <span>৳{cartTotal.toFixed(2)}</span>
                  </Link>
                </div>
                <div className='main-header__author'>
                  {session?.user ? (
                    <div className='relative' ref={dropdownRef}>
                      <button
                        className='profileImageButton'
                        onClick={() => setOpen((prev) => !prev)}
                      >
                        <img
                          src={profileImageUrl || "/avatar.png"}
                          width={32}
                          height={32}
                          alt='User Avatar'
                          style={{ objectFit: "cover" }}
                          onError={() => logOut()}
                        />
                      </button>
                      {open && (
                        <div className='profile-dropdown'>
                          <Link href='/profile' className='dropdown-item'>
                            My Account
                          </Link>
                          <Link href='/orders' className='dropdown-item'>
                            My Orders
                          </Link>
                          <button onClick={logOut} className='dropdown-item logout-btn'>
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link href='/login' className='commerce-btn login'>
                      Sign In
                    </Link>
                  )}
                </div>
                <button
                  className='mobile-search-btn'
                  onClick={() => setMobileSearchOpen(true)}
                  aria-label='Open search'
                >
                  <i className='fas fa-search'></i>
                </button>
                <button
                  className='mobile-nav__btn mobile-nav__toggler'
                  onClick={() => setOffcanvasOpen(true)}
                  aria-label='Open menu'
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='main-header__bottom'>
          <div className='container-fluid'>
            <nav className='main-header__nav main-menu'>
              <ul className='main-menu__list'>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href='/categories/[slug]'
                      as={`/categories/${category.slug}`}
                      prefetch={false}
                      className='main-menu__list__item'
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {offcanvasOpen && (
        <div
          className='offcanvas-overlay'
          onClick={() => setOffcanvasOpen(false)}
        />
      )}

      <div className={`mobile-offcanvas ${offcanvasOpen ? "is-open" : ""}`}>
        <div className='mobile-offcanvas__head'>
          <Link href='/' onClick={() => setOffcanvasOpen(false)}>
            <Image src={logo} alt='sadamata' width={120} height={26} />
          </Link>
          <button
            className='mobile-offcanvas__close'
            onClick={() => setOffcanvasOpen(false)}
            aria-label='Close menu'
          >
            <i className='fas fa-times'></i>
          </button>
        </div>
        <div className='mobile-offcanvas__body'>
          <div className='mobile-offcanvas__auth'>
            {session?.user ? (
              <>
                <Link href='/profile' className='mobile-offcanvas__auth-link' onClick={() => setOffcanvasOpen(false)}>
                  <i className='fas fa-user'></i> My Account
                </Link>
                <Link href='/orders' className='mobile-offcanvas__auth-link' onClick={() => setOffcanvasOpen(false)}>
                  <i className='fas fa-box'></i> My Orders
                </Link>
                <button className='mobile-offcanvas__auth-link' onClick={() => { setOffcanvasOpen(false); logOut(); }}>
                  <i className='fas fa-sign-out-alt'></i> Logout
                </button>
              </>
            ) : (
              <Link href='/login' className='mobile-offcanvas__signin' onClick={() => setOffcanvasOpen(false)}>
                <i className='fas fa-user'></i> Sign In
              </Link>
            )}
          </div>
          <div className='mobile-offcanvas__divider' />
          <div className='mobile-offcanvas__actions'>
            <Link href='/favorites' className='mobile-offcanvas__action-item' onClick={() => setOffcanvasOpen(false)}>
              <i className='far fa-heart'></i>
              <span>Favourites</span>
              <span className='mobile-offcanvas__badge'>{favoriteCount.toString().padStart(2, "0")}</span>
            </Link>
            <Link href='/cart' className='mobile-offcanvas__action-item' onClick={() => setOffcanvasOpen(false)}>
              <i className='fas fa-shopping-cart'></i>
              <span>Cart</span>
              <span className='mobile-offcanvas__badge'>৳{cartTotal.toFixed(2)}</span>
            </Link>
          </div>
          <div className='mobile-offcanvas__divider' />
          <nav className='mobile-offcanvas__nav'>
            <p className='mobile-offcanvas__nav-title'>Categories</p>
            <ul>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href='/categories/[slug]'
                    as={`/categories/${category.slug}`}
                    prefetch={false}
                    className='mobile-offcanvas__nav-item'
                    onClick={() => setOffcanvasOpen(false)}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile search overlay */}
      <div
        className={`mobile-search-overlay${mobileSearchOpen ? " is-open" : ""}`}
        onMouseDown={(e) => { if (e.target === e.currentTarget) setMobileSearchOpen(false); }}
      >
        <div className='mobile-search-overlay__card'>
          <div className='mobile-search-overlay__header'>
            <span className='mobile-search-overlay__title'>Search</span>
            <button
              className='mobile-search-close'
              onClick={() => setMobileSearchOpen(false)}
              aria-label='Close search'
            >
              <i className='fas fa-times'></i>
            </button>
          </div>
          <SearchBar options={options} onSearch={() => setMobileSearchOpen(false)} />
        </div>
      </div>
    </>
  );
};

export default HeaderCloned;
