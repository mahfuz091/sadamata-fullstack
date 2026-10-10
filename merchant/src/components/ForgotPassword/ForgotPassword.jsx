"use client";

import React, { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { sendResetLink } from "@/app/actions/auth/sendResetLink";
import { isValidEmail } from "@/utils/validation";

const initialState = { success: false, message: "" };

const ForgotPassword = () => {
  const [state, formAction, isPending] = useActionState(
    sendResetLink,
    initialState,
  );

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!state?.message) return;

    if (state.success) {
      toast.success(state.message);
      setSent(true);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setError(!value ? "Email is required" : !isValidEmail(value) ? "Enter a valid email" : "");
  };

  return (
    <section className='user-login section-space'>
      <div className='container'>
        <div className='user-login__inner'>
          <div className='user-login__top'>
            <h4 className='user-login__top__title'>Forgot password</h4>
            <p className='user-login__top__text'>
              Enter the email on your account and we will send you a reset link.
            </p>
          </div>

          {sent ? (
            <div className='user-login__form'>
              <p>
                Check your inbox — if an account exists for <strong>{email}</strong>,
                a reset link is on the way. It expires in 15 minutes.
              </p>
              <Link href='/signin' className='commerce-btn'>
                Back to sign in
              </Link>
            </div>
          ) : (
            <form className='user-login__form' action={formAction}>
              <div className='user-login__form-input-box'>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={email}
                  onChange={handleChange}
                  placeholder='Email address'
                  required
                />
                {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
              </div>

              <div className='user-login__form-input-box'>
                <button
                  type='submit'
                  className='commerce-btn'
                  disabled={isPending || Boolean(error) || !email}
                >
                  {isPending ? "Sending..." : "Send reset link"}
                </button>
              </div>

              <div className='user-login__bottom'>
                <Link href='/signin'>Back to sign in</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
