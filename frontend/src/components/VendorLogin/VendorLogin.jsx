import React from "react";

import Link from "next/link";

const VendorLogin = () => {
  return (
    <section className='user-login section-space'>
      <div className='container'>
        <div className='user-login__inner'>
          <div className='user-login__top'>
            <h4 className='user-login__top__title'>Sign in</h4>
          </div>
          <form className='user-login__form'>
            <div className='user-login__form-input-box'>
              <label htmlFor='info'>Email or mobile phone number</label>
              <input
                type='text'
                id='info'
                name='identifier'
                placeholder='Full Name'
              />
              <p>
                By continuing, you agree to amazon’s{" "}
                <Link href='#'>conditions of use</Link> and{" "}
                <Link href='#'>privacy notice</Link>.
              </p>
            </div>
            <div className='user-login__form-input-box'>
              <button type='submit' className='commerce-btn'>
                Register <i className='icon-right-arrow' />
              </button>
            </div>
          </form>
          <div className='user-login__bottom'>
            <div className='user-login__bottom__top'>
              <Link href='#'>Forgot your password?</Link>
              <Link href='#'>Other issues with Sign-In</Link>
            </div>
            <Link href='#'>
              New to here? <span>Create Account</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorLogin;
