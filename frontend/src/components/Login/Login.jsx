"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Image from "next/image";
import Link from "next/link";

import appleIcon from "@/assets/images/icon/apple.png";
import googleIcon from "@/assets/images/icon/google.png";
import facebookIcon from "@/assets/images/icon/facebook.png";
import { loginUser } from "@/app/actions/auth.actions"; // adjust as needed
import { isValidBDPhone, isValidEmail } from "@/utils/validation";

const initialState = { success: false, message: "" };

const Login = () => {
  const initialState = {
    message: "",
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

  

const [identifier, setIdentifier] = useState("");
  const [errors, setErrors] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
   const [password, setPassword] = useState("");

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
    <section className='login-page'>
      <div className='container'>
        <div className='login-page__inner'>
          <div className='login-page__top'>
            <h4 className='login-page__top__title'>Login to the System</h4>
            <p className='login-page__top__text'>
              Welcome Back! Please Enter Your Details.
            </p>
          </div>

          <form className='login-page__form' action={formAction}>
            <div className='login-page__form-input-box'>
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

            <div className='login-page__form-input-box'>
              
              <input
                type={showPassword ? "text" : "password"}
                id='password'
                name='password'
                value={password}
                onChange={handlePasswordChange}
                placeholder='Password'
                required
              />
              <span className='login-page__form-input-box__icon icon-lock'></span>
              <i
                className={`toggle-password pass-field-icon fa fa-fw ${
                  showPassword ? "fa-eye" : "fa-eye-slash"
                }`}
                onClick={() => setShowPassword((prev) => !prev)}
                style={{ cursor: "pointer" }}
              ></i>
              {errors.password && (
                <p className='text-red-500 text-sm'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className='login-page__checked-box'>
              {/* <div className='login-page__checked-inner'>
                <input type='checkbox' id='save-data' {...register("terms")} />
                <label htmlFor='save-data'>
                  <span></span>I agree to the Terms & Conditions
                </label>
              </div> */}
              <div className='login-page__checked-inner'>
                <Link href='#'>Forgot password</Link>
              </div>
              
            </div>

            <div className='login-page__form-input-box'>
              <button
                type='submit'
                className='commerce-btn'
                disabled={isPending}
              >
                {isPending ? "Logging in..." : "Login"}
              </button>
              {state.message && (
                <p
                  className={
                    state.success ? "text-green-600 mt-2" : "text-red-600 mt-2"
                  }
                >
                  {state.message}
                </p>
              )}
            </div>
          </form>

          <div className='login-page__bottom'>
            <span className='login-page__bottom__title'>Or, Sign in with</span>
            <div className='login-page__bottom__social'>
              <a
                href='https://www.facebook.com/'
                className='login-page__bottom__social__item d-none'
              >
                <Image src={facebookIcon} alt='Facebook' />
              </a>
              <a
                href='https://www.google.com/'
                className='login-page__bottom__social__item'
              >
                <Image src={googleIcon} alt='Google' />
              </a>
              <a
                href='https://www.apple.com/'
                className='login-page__bottom__social__item d-none' 
              >
                <Image src={appleIcon} alt='Apple' />
              </a>
            </div>
            <p className='login-page__bottom__text'>
              Don&apos;t have an account? <Link href='/sign-up'>Register</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
