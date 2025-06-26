import Image from "next/image";
import React from "react";
import info from "@/assets/images/shapes/info.svg";
import Link from "next/link";

const VendorSignup = () => {
  return (
    <section className='user-login user-login--two section-space'>
      <div className='container'>
        <div className='user-login__inner'>
          <div className='user-login__top'>
            <h4 className='user-login__top__title'>Create account</h4>
            <p className='user-login__top__text'>All fields are required</p>
          </div>
          <form className='user-login__form'>
            <div className='user-login__form-input-box'>
              <label htmlFor='name'>Your name</label>
              <input
                type='text'
                id='name'
                name='name'
                placeholder='Your full name'
              />
            </div>
            <div className='user-login__form-input-box'>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                id='email'
                name='email'
                placeholder='Enter your mail'
              />
            </div>
            <div className='user-login__form-input-box'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                id='password'
                name='password'
                placeholder='Enter your new password'
              />
              <p className='user-login__form__info'>
                <span className='icon'>
                  <Image src={info} alt='icon' />
                </span>{" "}
                Passwords must be at least 6 characters.
              </p>
            </div>
            <div className='user-login__form-input-box'>
              <label htmlFor='reenter'>Re-enter password</label>
              <input
                type='password'
                id='reenter'
                name='confirmPassword'
                placeholder='Enter your new password again'
              />
            </div>
            <div className='user-login__form-input-box'>
              <button type='submit' className='commerce-btn'>
                Create your account <i className='icon-right-arrow' />
              </button>
              <p>
                By continuing, you agree to amazon’s{" "}
                <Link href='#'>conditions of use</Link> and{" "}
                <Link href='#'>privacy notice</Link>.
              </p>
            </div>
          </form>
          <div className='user-login__bottom'>
            <Link href='#'>
              Already have an account? <span>Sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorSignup;
