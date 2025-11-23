"use client";

import React, { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { loginUser } from "@/app/actions/auth/auth.actions";
import { isValidEmail, isValidBDPhone } from "@/utils/validation"; // 👈 re-use our validators
import { toast } from "sonner";
import { sendResetLink } from "@/app/actions/auth/sendResetLink";

const VendorLogin = () => {
  const initialState = {
    msg: "",
    success: false,
  };

 /* ---------------- RESET PASSWORD ACTION ---------------- */
  const resetInitial = { success: false, message: "" };

  const [resetState, resetAction] = useActionState(sendResetLink, resetInitial);

  useEffect(() => {
    if (resetState?.message) {
      resetState.success
        ? toast.success(resetState.message)
        : toast.error(resetState.message);
    }
  }, [resetState]);

   /* ---------------- FORGOT PASSWORD MODAL ---------------- */
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

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
    setErrors((prev) => ({
      ...prev,
      identifier: "",   // 👈 CLEAR error on valid input
    }));
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

  /* ---------------- HANDLE RESET REQUEST ---------------- */
  const submitReset = (e) => {
    e.preventDefault();

    if (!isValidEmail(resetEmail)) {
      toast.error("Enter a valid email");
      return;
    }

    const form = new FormData();
    form.append("email", resetEmail);

    resetAction(form);
    setShowForgot(false);
  };

  return (
    <>
    {/* ---------------- FORGOT PASSWORD MODAL ---------------- */}
      {showForgot && (
        <div className="forgot-modal">
          <div className="modal-content">
            <h3>Reset Password</h3>

            <form onSubmit={submitReset}>
              <label>Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />

              <button type="submit" className="commerce-btn">
                Send Reset Link
              </button>

              <button
                type="button"
                className="close-btn"
                onClick={() => setShowForgot(false)}
              >
                x
              </button>
            </form>
          </div>
        </div>
      )}
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
                <p className='form-error'>{errors.identifier}</p>
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
                <p className='form-error'>{errors.password}</p>
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
  type="submit"
  className={`commerce-btn ${isPending ? "loading" : ""}`}
 disabled={!!errors.identifier || !!errors.password || isPending}
>
  {isPending ? (
   <> <span className="spinner"></span> <span>Logging in...</span></>
  ) : (
   <> Login <i className="icon-right-arrow" /> </>
  )}
  
</button>

            </div>
          </form>

          <div className='user-login__bottom'>
            <div className='user-login__bottom__top'>
              <Link href=''  onClick={() => setShowForgot(true)}>Forgot your password?</Link>
              
            </div>
            <Link href='/signup'>
              New to here? <span>Create Account</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
    
    </>
   
  );
};

export default VendorLogin;
