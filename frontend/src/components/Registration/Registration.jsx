"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useActionState } from "react";

import Image from "next/image";
import Link from "next/link";

import appleIcon from "@/assets/images/icon/apple.png";
import googleIcon from "@/assets/images/icon/google.png";
import facebookIcon from "@/assets/images/icon/facebook.png";
import { registerUser } from "@/app/actions/auth.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const initialState = { success: false, message: "" };

const Registration = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [state, formAction, isPending] = useActionState(async (_, formData) => {
    const result = await registerUser(_, formData);
    return result;
  }, initialState);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");
  const [checkboxError, setCheckboxError] = useState(false);
  //   console.log("Checkbox Error:", checkboxError);

  const onSubmit = (data) => {
    //     console.log("Form Data:", data);

    if (!data.contact) {
      toast.error("Email or Phone is required");
      return;
    }
    const isChecked = data.terms;
    console.log("Checkbox is checked:", data.terms);
    if (!data.terms) {
      setCheckboxError(true);
      return;
    } else {
      setCheckboxError(false);
    }

    const formData = new FormData();
    const [firstName, ...lastName] = data.fullName.split(" ");
    formData.append("firstName", firstName || "");
    formData.append("lastName", lastName.join(" ") || "");
    formData.append("password", data.password);
    if (data.contact.includes("@")) {
      formData.append("email", data.contact);
    } else {
      formData.append("phone", data.contact);
    }

    formAction(formData);
  };
  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast.success(state.message);

      router.refresh();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <section className='login-page'>
      <div className='container'>
        <div className='login-page__inner'>
          <div className='login-page__top'>
            <h4 className='login-page__top__title'>Create an Account</h4>
            <p className='login-page__top__text'>
              Welcome Back! Please Enter Your Details.
            </p>
          </div>

          <form className='login-page__form' onSubmit={handleSubmit(onSubmit)}>
            <div className='login-page__form-input-box'>
              <input
                type='text'
                placeholder='Full Name'
                {...register("fullName", { required: "Full name is required" })}
              />
              <span className='login-page__form-input-box__icon icon-user1'></span>
              {errors.fullName && (
                <p className='text-red-500'>{errors.fullName.message}</p>
              )}
            </div>

            <div className='login-page__form-input-box'>
              <input
                type='text'
                placeholder='Email or Phone'
                {...register("contact", {
                  required: "Email or phone is required",
                })}
              />
              <span className='login-page__form-input-box__icon icon-mail'></span>
              {errors.contact && (
                <p className='text-red-500'>{errors.contact.message}</p>
              )}
            </div>

            {/* Password */}
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
                <p className='text-red-500'>{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className='login-page__form-input-box'>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder='Confirm Password*'
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              <span className='login-page__form-input-box__icon icon-lock'></span>
              <i
                className={`toggle-password pass-field-icon fa fa-fw ${
                  showConfirmPassword ? "fa-eye" : "fa-eye-slash"
                }`}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                style={{ cursor: "pointer" }}
              ></i>
              {errors.confirmPassword && (
                <p className='text-red-500'>{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <div className='login-page__checked-box'>
                <div className='login-page__checked-inner'>
                  <input
                    type='checkbox'
                    id='save-data'
                    {...register("terms")}
                  />
                  <label htmlFor='save-data'>
                    <span></span>I agree to the Terms & Conditions
                  </label>
                </div>
                {checkboxError && (
                  <p className='text-red-500'>You must agree to the terms</p>
                )}
              </div>
            </div>

            <div className='login-page__form-input-box'>
              <button
                type='submit'
                className='commerce-btn'
                disabled={isPending}
              >
                {isPending ? "Registering..." : "Register"}
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
            <span className='login-page__bottom__title'>Or, Register with</span>
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
              Already have an account? <Link href='/login'>Login</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registration;
