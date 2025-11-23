"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo-light.png";

import { logOut } from "@/app/actions/auth/auth.actions";
import { useState } from "react";

const HeaderTwo = ({ session }) => {
  const [open, setOpen] = useState(false);
  console.log(session, "session in header");

  return (
    <header className='main-header main-header--two sticky-header sticky-header--normal'>
      <div className='main-header__top'>
        <div className='container-fluid'>
          <div className='main-header__inner'>
            <div className='main-header__logo'>
             <Link href={session?.user ? "/dashboard" : "/"}>
                <Image src='/logo-sadamata.svg' alt='commerce HTML' width={200} height={50} />
              </Link>
            </div>
            <div className='main-header__right'>
              <div className='mobile-nav__info'>
                {/* {session?.user ? (
                  <button onClick={logOut} className='commerce-btn'>
                    Logout {session.user.name}
                  </button>
                ) : (
                  <>
                    <Link href='/login' className='commerce-btn login'>
                      Login
                    </Link>
                   
                  </>
                )} */}
                <div className="mobile-nav__info flex items-center gap-3">
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
        />
      </button>

      {/* Dropdown */}
      {open && (
      <div className="profile-dropdown">
      <Link href="/dashboard/profile" className="dropdown-item">
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
    </header>
  );
};

export default HeaderTwo;
