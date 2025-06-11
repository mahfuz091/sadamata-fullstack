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

const initialState = { success: false, message: "" };

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  //   const [state, formAction, isPending] = useActionState(async (_, formData) => {
  //     const result = await loginUser(_, formData); // your server action
  //     return result;
  //   }, initialState);
  const [state, formAction, isPending] = useActionState(
    loginUser,
    initialState
  );

  const [showPassword, setShowPassword] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);
  const router = useRouter();
  console.log(isPending, "isPending");

  const onSubmit = (data) => {
    if (!data.terms) {
      setCheckboxError(true);
      return;
    }
    setCheckboxError(false);

    const formData = new FormData();
    formData.append("password", data.password);
    formData.append("identifier", data.contact);

    formAction(formData);
  };

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/"); // adjust as needed
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

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

          <form className='login-page__form' onSubmit={handleSubmit(onSubmit)}>
            <div className='login-page__form-input-box'>
              <input
                type='text'
                placeholder='Your Email or Mobile Number'
                {...register("contact", {
                  required: "Email or Phone is required",
                })}
              />
              <span className='login-page__form-input-box__icon icon-mail'></span>
              {errors.contact && (
                <p className='text-red-500 text-sm'>{errors.contact.message}</p>
              )}
            </div>

            <div className='login-page__form-input-box'>
              <input
                type={showPassword ? "text" : "password"}
                placeholder='Password*'
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
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
              <div className='login-page__checked-inner'>
                <input type='checkbox' id='save-data' {...register("terms")} />
                <label htmlFor='save-data'>
                  <span></span>I agree to the Terms & Conditions
                </label>
              </div>
              <div className='login-page__checked-inner'>
                <Link href='#'>Forgot password</Link>
              </div>
              {checkboxError && (
                <p className='text-red-500 text-sm mt-1'>
                  You must agree to the Terms & Conditions
                </p>
              )}
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
                className='login-page__bottom__social__item'
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
                className='login-page__bottom__social__item'
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
