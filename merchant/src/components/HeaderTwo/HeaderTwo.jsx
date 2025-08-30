"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo-light.png";

import { logOut } from "@/app/actions/auth/auth.actions";

const HeaderTwo = ({ session }) => {
  // const session = await auth();
  console.log(session, "session in header");

  return (
    <header className='main-header main-header--two sticky-header sticky-header--normal'>
      <div className='main-header__top'>
        <div className='container-fluid'>
          <div className='main-header__inner'>
            <div className='main-header__logo'>
              <Link href='/'>
                <Image src={logo} alt='commerce HTML' />
              </Link>
            </div>
            <div className='main-header__right'>
              <div className='mobile-nav__info'>
                {session?.user ? (
                  <button onClick={logOut} className='commerce-btn'>
                    Logout
                  </button>
                ) : (
                  <>
                    <Link href='/login' className='commerce-btn login'>
                      Login
                    </Link>
                    <Link href='/sign-up' className='commerce-btn'>
                      Register <i className='icon-right-arrow' />
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
    </header>
  );
};

export default HeaderTwo;
