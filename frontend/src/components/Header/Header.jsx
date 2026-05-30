"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import logo from "@/assets/images/logo-sadamata.svg";
import Image from "next/image";
import avatar from "@/assets/images/shapes/aveter.png";
import Select from "react-select";
import { searchRedirect } from "@/app/actions/search.actions";
import Link from "next/link";
import { logOut } from "@/app/actions/auth.actions";
import useScrollUp from "@/hooks/useScrollUp";
import SearchBar from "./SearchBar";
const options = [
  { value: "chocolate", label: "All Categories" },
  { value: "strawberry", label: "All Categories" },
  { value: "vanilla", label: "All Categories" },
];

// Custom styles object
const customStyles = {
  container: (base) => ({
    ...base,
    width: "100%",
  }),
  control: (base, state) => ({
    ...base,
    border: "none",
    boxShadow: "none",
    "&:hover": {
      border: "none",
    },
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
const Header = ({ session, categories, profileImageUrl }) => {
  const scrollToTop = useScrollUp(500);

  // console.log(categories, "session header");

  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [cartTotal, setCartTotal] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const computeFavorites = () => {
      const favorites = JSON.parse(
        localStorage.getItem("favorite_products") || "[]"
      );
      setFavoriteCount(favorites.length);
    };

    // initial load
    computeFavorites();

    // listen for updates
    const handleFavoriteUpdated = () => {
      computeFavorites();
    };

    window.addEventListener("favorite-updated", handleFavoriteUpdated);

    return () => {
      window.removeEventListener("favorite-updated", handleFavoriteUpdated);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/mockups", { cache: "no-store" });
        const data = await res.json();
        // console.log(data, "data");

        if (mounted) setOptions(data?.options ?? []);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;

    const computeTotal = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");

      const total = cart.reduce(
        (sum, item) =>
          sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
        0
      );

      setCartTotal(total);
    };

    // initial load
    computeTotal();

    // ✅ listen for our custom event
    const handleCartUpdated = () => {
      computeTotal();
    };

    window.addEventListener("cart-updated", handleCartUpdated);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
    };
  }, []);

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = offcanvasOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [offcanvasOpen]);

  const placeholder = useMemo(() => "All", []);
  return (
    <>
    <header
      className={`main-header main-header--one sticky-header sticky-header--normal ${
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
            {/* <div className='main-header__search-box'>
              <form action={searchRedirect} className='main-header__search'>
                <div className='main-header__search__input-box'>
                  <Select
                    instanceId='category-select'
                    options={options}
                    value={selected}
                    onChange={(opt) => setSelected(opt)}
                    styles={customStyles}
                    components={{ IndicatorSeparator: () => null }}
                    isClearable={true}
                    isSearchable={true}
                    placeholder={placeholder}
                  />

                  <input
                    type='hidden'
                    name='slug'
                    value={selected?.value || ""}
                  />
                </div>
                <div className='main-header__search__input-box'>
                  <input
                    type='text'
                    name='text'
                    placeholder='Search your products'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button type='submit' className='main-header__search__button'>
                    <i className='fas fa-search'></i>
                  </button>
                </div>
              </form>
            </div> */}
            {/* ✅ replace old search with component */}
            <SearchBar options={options} />
            <div className='main-header__right'>
              {/* <div className="main-header__language">
                        <a href="#"><img src="assets/images/shapes/united-states-of-america.png" alt="commerce"/>English</a>
                        <div className="main-header__language__dropdown" style="display: none;">
                            <a href="#"><img src="assets/images/shapes/united-states-of-america.png" alt="commerce">English</a>
                            <a href="#"><img src="assets/images/shapes/flag-two.png" alt="commerce">France</a>
                        </div>
                    </div> */}
              <div className='main-header__info'>
                {/* <a href='#' className='main-header__info__item'>
                  <i className='far fa-heart'></i>
                  <span>00</span>
                </a> */}
                <Link
                  href='/favorites'
                  prefetch={false}
                  className='main-header__info__item'
                >
                  <i className='far fa-heart'></i>
                  <span>{favoriteCount.toString().padStart(2, "0")}</span>
                </Link>

                <Link
                  href='/cart'
                  prefetch={false}
                  className='main-header__info__item'
                >
                  <span>৳{cartTotal.toFixed(2)}</span>
                </Link>
              </div>
              <div className='main-header__author'>
                {/* <a href="#">
                  <Image src={avatar} alt="author" />
                </a> */}
                {session?.user ? (
                  <div className='relative' ref={dropdownRef}>
                    {/* Profile Image Button */}
                    <button
                      className='profileImageButton'
                      onClick={() => setOpen((prev) => !prev)}
                    >
                      <img
                        src={
                          profileImageUrl || "/avatar.png"
                        }
                        width={32}
                        height={32}
                        alt='User Avatar'
                        style={{
                          objectFit: "cover",
                        }}
                        onError={() => logOut()}
                      />
                    </button>

                    {/* Dropdown */}
                    {open && (
                      <div className='profile-dropdown'>
                        <Link href='/profile' className='dropdown-item'>
                          My Account
                        </Link>
                        <Link href='/orders' className='dropdown-item'>
                          My Orders
                        </Link>

                        <button
                          onClick={logOut}
                          className='dropdown-item logout-btn'
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link href='/login' className='commerce-btn login'>
                      Sign In
                      <i className='fas fa-user header-signin-icon'></i>
                    </Link>
                  </>
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

    {/* Offcanvas overlay */}
    {offcanvasOpen && (
      <div
        className='offcanvas-overlay'
        onClick={() => setOffcanvasOpen(false)}
      />
    )}

    {/* Offcanvas panel */}
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
        {/* Auth */}
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

        {/* Cart & Favourites */}
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

        {/* Categories */}
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

export default Header;

