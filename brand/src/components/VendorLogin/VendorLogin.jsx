"use client";

import React, { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { loginUser } from "@/app/actions/auth/auth.actions";
import { isValidEmail, isValidBDPhone } from "@/utils/validation"; // 👈 re-use our validators
import { toast } from "sonner";

const VendorLogin = () => {
  const initialState = {
    msg: "",
    success: false,
  };

  const [state, formAction, isPending] = useActionState(
    loginUser,
    initialState
  );

  console.log(state);
  useEffect(() => {
    if(state.message){
      if (!state?.success) {
        toast.warning(state?.message);
      }
      else if(state?.success){
        toast.success(state?.message);
        console.log(state, "state");
      }
    }
    
  }, [state]);

  // console.log(state?.msg, state?.success);

  // Local validation states
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ identifier: "", password: "" });

  const handleIdentifierChange = (e) => {
    const value = e.target.value;
    setIdentifier(value);

    if (!value) {
      setErrors((prev) => ({
        ...prev,
        identifier: "Email or phone is required",
      }));
    } else if (!isValidEmail(value) && !isValidBDPhone(value)) {
      setErrors((prev) => ({
        ...prev,
        identifier: "Enter a valid email or BD phone",
      }));
    } else {
      setErrors((prev) => ({ ...prev, identifier: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!value) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
    } else if (value.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  return (
    <section className='user-login section-space'>
      <div className='container'>
        <div className='user-login__inner'>
          <div className='user-login__top'>
            <h4 className='user-login__top__title'>Sign in</h4>
          </div>

          <form className='user-login__form' action={formAction}>
            {/* Identifier */}
            <div className='user-login__form-input-box'>
              <label htmlFor='identifier'>Email or mobile phone number</label>
              <input
                type='text'
                id='identifier'
                name='identifier'
                value={identifier}
                onChange={handleIdentifierChange}
                placeholder='Email or mobile phone number'
                required
              />
              {errors.identifier && (
                <p className='text-red-500 text-sm mt-1'>{errors.identifier}</p>
              )}
            </div>

            {/* Password */}
            <div className='user-login__form-input-box'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                id='password'
                name='password'
                value={password}
                onChange={handlePasswordChange}
                placeholder='Password'
                required
              />
              {errors.password && (
                <p className='text-red-500 text-sm mt-1'>{errors.password}</p>
              )}

              <p>
                By continuing, you agree to amazon’s{" "}
                <Link href='#'>conditions of use</Link> and{" "}
                <Link href='#'>privacy notice</Link>.
              </p>
            </div>

            {/* Submit */}
            <div className='user-login__form-input-box'>
              <button
                type='submit'
                className='commerce-btn'
                disabled={!!errors.identifier || !!errors.password || isPending}
              >
                {isPending ? "Login..." : "Login"}
                <i className='icon-right-arrow' />
              </button>
            </div>
          </form>

          <div className='user-login__bottom'>
            <div className='user-login__bottom__top'>
              <Link href='#'>Forgot your password?</Link>
              <Link href='#'>Other issues with Sign-In</Link>
            </div>
            <Link href='/signup'>
              New to here? <span>Create Account</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorLogin;
