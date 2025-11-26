"use client";
import React, { useEffect, useMemo, useState } from "react";
import logo from "@/assets/images/logo-sadamata.svg";
import Image from "next/image";
import avatar from "@/assets/images/shapes/aveter.png";
import Select from "react-select";
import { searchRedirect } from "@/app/actions/search.actions";
import Link from "next/link";
import { logOut } from "@/app/actions/auth.actions";
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
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [text, setText] = useState('');
const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/mockups', { cache: 'no-store' });
        const data = await res.json();
        console.log(data, 'data');
        
        if (mounted) setOptions(data?.options ?? []);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const placeholder = useMemo(() => 'All Mockups', []);
  return (
    <header className="main-header main-header--one sticky-header sticky-header--normal">
      <div className="main-header__top">
        <div className="container-fluid">
          <div className="main-header__inner">
            <div className="main-header__logo">
              <Link href="/">
                <Image src={logo} alt="sadamata" width={200} height={40} />
              </Link>
            </div>
            <div className="main-header__search-box">
              <form action={searchRedirect} className="main-header__search">
                <div className="main-header__search__input-box">
                    <Select
            options={options}
            value={selected}                 // ❌ no default
            onChange={(opt) => setSelected(opt)}
            styles={customStyles}
            components={{ IndicatorSeparator: () => null }}
            isClearable={true}
            isSearchable={true}
            placeholder={placeholder}
          />
          {/* hidden input: server action এ slug যাবে */}
          <input type="hidden" name="slug" value={selected?.value || ''} />
                </div>
                <div className="main-header__search__input-box">
                  <input
                    type="text"
                    name="text"
                    placeholder="Search your products"
                    value={text}
            onChange={(e) => setText(e.target.value)}
                  />
                  <button type="submit" className="main-header__search__button">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </form>
            </div>
            <div className="main-header__right">
              {/* <div className="main-header__language">
                        <a href="#"><img src="assets/images/shapes/united-states-of-america.png" alt="commerce"/>English</a>
                        <div className="main-header__language__dropdown" style="display: none;">
                            <a href="#"><img src="assets/images/shapes/united-states-of-america.png" alt="commerce">English</a>
                            <a href="#"><img src="assets/images/shapes/flag-two.png" alt="commerce">France</a>
                        </div>
                    </div> */}
              <div className="main-header__info">
                <a href="#" className="main-header__info__item">
                  <i className="far fa-heart"></i>
                  <span>03</span>
                </a>
                <a href="#" className="main-header__info__item">
                  <i className="far fa-heart"></i>
                  <span>$75.00</span>
                </a>
              </div>
              <div className="main-header__author">
                {/* <a href="#">
                  <Image src={avatar} alt="author" />
                </a> */}
                {session?.user ? (
    <div className="relative">
      {/* Profile Image Button */}
      <button
        className="profileImageButton"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Image
          src={
            session.user.profileImage
              ? session.user.profileImage
              : "/avatar.png" // fallback image
          }
          width={40}
          height={40}
          alt="User Avatar"
        style={
          {
            objectFit: "cover"
          }
        }
        />
      </button>

      {/* Dropdown */}
      {open && (
      <div className="profile-dropdown">
      <Link href="/profile" className="dropdown-item">
        My Account
      </Link>

      <button onClick={logOut} className="dropdown-item logout-btn">
        Logout
      </button>
    </div>
      )}
    </div>
  ) : (
    <>
      <Link href="/login" className="commerce-btn login">
        Login
      </Link>
    </>
  )}
              </div>
              <div className="mobile-nav__btn mobile-nav__toggler">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-header__bottom">
        <div className="container-fluid">
          <nav className="main-header__nav main-menu">
            <ul className="main-menu__list">
              <li>
                <a href="#">Offers</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li>
                <a href="#">Discoveries</a>
              </li>
              <li className="dropdown">
                <a href="#">Discoveries</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
