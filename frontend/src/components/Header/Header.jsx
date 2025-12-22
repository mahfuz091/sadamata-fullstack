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
const Header = ({ session }) => {
  const scrollToTop = useScrollUp(500);

  useEffect;
  console.log(session, "session header");

  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

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
        console.log(data, "data");

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

  const placeholder = useMemo(() => "All", []);
  return (
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
                <Image src={logo} alt='sadamata' width={200} height={40} />
              </Link>
            </div>
            <div className='main-header__search-box'>
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
                  {/* hidden input: server action এ slug যাবে */}
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
            </div>
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
                      <Image
                        src={
                          session.user.profileImage
                            ? `${process.env.NEXT_PUBLIC_BASE_URL}/${session.user.profileImage}`
                            : "/avatar.png" // fallback image
                        }
                        width={40}
                        height={40}
                        alt='User Avatar'
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    </button>

                    {/* Dropdown */}
                    {open && (
                      <div className='profile-dropdown'>
                        <Link href='/profile' className='dropdown-item'>
                          My Account
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
                      Login
                    </Link>
                  </>
                )}
              </div>
              <div className='mobile-nav__btn mobile-nav__toggler'>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='main-header__bottom'>
        <div className='container-fluid'>
          <nav className='main-header__nav main-menu'>
            <ul className='main-menu__list'>
              <li>
                <a href='#'>Best Sellers</a>
              </li>
              <li>
                <a href='#'>Trending Today</a>
              </li>
              <li>
                <a href='#'>Music</a>
              </li>
              <li>
                <a href='#'>Movies</a>
              </li>
              <li>
                <a href='#'>Sports</a>
              </li>
              <li>
                <a href='#'>Anime</a>
              </li>
              <li>
                <a href='#'>Sci-Fi</a>
              </li>
              <li>
                <a href='#'>Vintage</a>
              </li>
              <li>
                <a href='#'>Books</a>
              </li>
              <li>
                <a href='#'>Food</a>
              </li>
              <li>
                <a href='#'>Art</a>
              </li>
              <li>
                <a href='#'>Gmaing</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
