"use client";

import React, { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { resetPassword } from "@/app/actions/auth/resetPassword";

const initialState = { success: false, message: "" };

const ResetPassword = () => {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const email = params.get("email") || "";

  const [state, formAction, isPending] = useActionState(
    resetPassword,
    initialState,
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });

  useEffect(() => {
    if (!state?.message) return;

    if (state.success) {
      toast.success(state.message);
      router.push("/login");
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  const validate = (next, nextConfirm) => {
    setErrors({
      password:
        next.length && next.length < 8
          ? "Password must be at least 8 characters"
          : "",
      confirmPassword:
        nextConfirm.length && next !== nextConfirm ? "Passwords do not match" : "",
    });
  };

  const invalidLink = !token || !email;
  const canSubmit =
    !invalidLink &&
    password.length >= 8 &&
    password === confirmPassword &&
    !isPending;

  return (
    <section className='login-page section-space'>
      <div className='container'>
        <div className='login-page__inner'>
          <div className='login-page__top'>
            <h4 className='login-page__top__title'>Set a new password</h4>
            {!invalidLink && (
              <p className='login-page__top__text'>Resetting the password for {email}</p>
            )}
          </div>

          {invalidLink ? (
            <div className='login-page__form'>
              <p>This reset link is incomplete or expired. Request a new one.</p>
              <Link href='/forgot-password' className='commerce-btn'>
                Request a new link
              </Link>
            </div>
          ) : (
            <form className='login-page__form' action={formAction}>
              <input type='hidden' name='token' value={token} />
              <input type='hidden' name='email' value={email} />

              <div className='login-page__form-input-box'>
                <input
                  type={showPassword ? "text" : "password"}
                  id='password'
                  name='password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validate(e.target.value, confirmPassword);
                  }}
                  placeholder='New password'
                  required
                />
                <i
                  className={`toggle-password pass-field-icon fa fa-fw ${
                    showPassword ? "fa-eye" : "fa-eye-slash"
                  }`}
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{ cursor: "pointer" }}
                ></i>
                {errors.password && (
                  <p className='text-red-500 text-sm mt-1'>{errors.password}</p>
                )}
              </div>

              <div className='login-page__form-input-box'>
                <input
                  type={showPassword ? "text" : "password"}
                  id='confirmPassword'
                  name='confirmPassword'
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    validate(password, e.target.value);
                  }}
                  placeholder='Confirm new password'
                  required
                />
                {errors.confirmPassword && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className='login-page__form-input-box'>
                <button type='submit' className='commerce-btn' disabled={!canSubmit}>
                  {isPending ? "Updating..." : "Update password"}
                </button>
              </div>

              <div className='login-page__bottom'>
                <Link href='/login'>Back to sign in</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
