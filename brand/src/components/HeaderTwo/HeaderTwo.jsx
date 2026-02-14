"use client";

import Image from "next/image";
import Link from "next/link";

import { logOut } from "@/app/actions/auth/auth.actions";
import { useState, useEffect, useRef } from "react";

const HeaderTwo = ({ session, profileImageUrl }) => {
    const [open, setOpen] = useState(false);
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

  return (
    <header className='main-header main-header--two sticky-header sticky-header--normal'>
      <div className='main-header__top'>
        <div className='container-fluid'>
          <div className='main-header__inner'>
            <div className='main-header__logo'>
              <Link href={session?.user ? "/dashboard" : "/"}>
                <Image
                  src='/logo-sadamata.svg'
                  alt='commerce HTML'
                  width={300}
                  height={50}
                />
              </Link>
            </div>
             <div className='main-header__right'>
              <div className='mobile-nav__info'>
                <div className='mobile-nav__info flex items-center gap-3'>
                  {session?.user ? (
                    <div className='relative' ref={dropdownRef}>
                      {/* Profile Image Button */}
                      <button
                        className='profileImageButton'
                        onClick={() => setOpen((prev) => !prev)}
                      >
                        <img
                          src={profileImageUrl || "/avatar.png"}
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
                          <Link
                            href='/dashboard/profile'
                            className='dropdown-item'
                          >
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
                      <Link href='/signin' className='commerce-btn login'>
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </div>
              {/* <div className='mobile-nav__btn mobile-nav__toggler'>
                <span></span>
                <span></span>
                <span></span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderTwo;
