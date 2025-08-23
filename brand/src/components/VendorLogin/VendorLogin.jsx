"use client";
import React, { useState } from "react";
import Link from "next/link";
import { loginUser } from "@/app/actions/auth/auth.actions";

const VendorLogin = () => {
  const [formData, setFormData] = useState(new FormData());

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call loginUser function with form data
    const result = await loginUser(formData);
    if (result.success) {
      // Handle successful login, maybe redirect to dashboard
      console.log("Login successful:", result.user);
    } else {
      // Handle failed login
      console.log("Login failed:", result.message);
    }
  };

  // const handleInputChange = (e) => {
  //   setFormData((prevFormData) => {
  //     const newFormData = new FormData(prevFormData);
  //     newFormData.set(e.target.name, e.target.value);
  //     return newFormData;
  //   });
  // };
  const handleInputChange = (e) => {
    setFormData((prevFormData) => {
      const newFormData = new FormData(); // Create a new instance of FormData
      // Copy the existing data from the previous FormData
      prevFormData.forEach((value, key) => {
        newFormData.append(key, value);
      });
      newFormData.set(e.target.name, e.target.value); // Update with the new input value
      return newFormData;
    });
  };

  return (
    <section className='user-login section-space'>
      <div className='container'>
        <div className='user-login__inner'>
          <div className='user-login__top'>
            <h4 className='user-login__top__title'>Sign in</h4>
          </div>
          <form className='user-login__form' onSubmit={handleSubmit}>
            <div className='user-login__form-input-box'>
              <label htmlFor='identifier'>Email or mobile phone number</label>
              <input
                type='text'
                id='identifier'
                name='identifier'
                placeholder='Email or Phone'
                onChange={handleInputChange}
              />
            </div>
            <div className='user-login__form-input-box'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                id='password'
                name='password'
                placeholder='Password'
                onChange={handleInputChange}
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
