"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import info from "@/assets/images/shapes/info.svg";
import { useRouter, useSearchParams } from "next/navigation";

const isEmail = (val) => /\S+@\S+\.\S+/.test(val || "");
const isBDPhone = (val) => /^(?:\+8801|01)[3-9][0-9]{8}$/.test((val || "").trim());

const STORAGE_KEY = "sadamatta_brand_signup_step1";

// ✅ change if your choose-plan route is different
const CHOOSE_PLAN_ROUTE = "/choose-plan";

// ✅ your step2 page route
const ENROLL_ROUTE = "/enroll";

export default function VendorSignupStep1() {
  const router = useRouter();
  const sp = useSearchParams();

  const plan = sp.get("plan"); // exclusive / nonExclusive

  const [account, setAccount] = useState({
    name: "",
    contact: "",
    password: "",
    confirmPassword: "",
    role: "BRAND", // or MERCH if you want
  });

  const [errors, setErrors] = useState({
    name: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  // ✅ If plan missing, go back to choose plan (because plan is step-1 now)
  useEffect(() => {
    if (!plan) router.push(CHOOSE_PLAN_ROUTE);
  }, [plan, router]);

  // ✅ Prefill from sessionStorage (if user comes back)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setAccount((p) => ({ ...p, ...parsed }));
      }
    } catch {}
  }, []);

  // validators
  const validateName = (v) => (!v || !v.trim() ? "Name is required" : "");
  const validateContact = (v) => {
    if (!v || !v.trim()) return "Contact is required";
    if (!isEmail(v) && !isBDPhone(v)) return "Enter a valid email or BD phone number";
    return "";
  };
  const validatePassword = (v) => {
    if (!v) return "Password is required";
    if (v.length < 6) return "Password must be at least 6 characters";
    return "";
  };
  const validateConfirm = (v, pwd) => {
    if (!v) return "Confirm password is required";
    if (v !== pwd) return "Passwords do not match";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAccount((p) => ({ ...p, [name]: value }));

    setErrors((prev) => {
      const next = { ...prev };
      if (name === "name") next.name = validateName(value);
      if (name === "contact") next.contact = validateContact(value);
      if (name === "password") {
        next.password = validatePassword(value);
        next.confirmPassword = validateConfirm(account.confirmPassword, value);
      }
      if (name === "confirmPassword") next.confirmPassword = validateConfirm(value, account.password);
      return next;
    });
  };

  const validateAll = () => {
    const bag = {
      name: validateName(account.name),
      contact: validateContact(account.contact),
      password: validatePassword(account.password),
      confirmPassword: validateConfirm(account.confirmPassword, account.password),
    };
    setErrors(bag);
    return Object.values(bag).every((x) => !x);
  };

  const canContinue = useMemo(() => {
    if (!account.name || !account.contact || !account.password || !account.confirmPassword) return false;
    return Object.values(errors).every((x) => !x) && !!plan;
  }, [account, errors, plan]);

  const goEnroll = () => {
    setErrorMsg("");
    const ok = validateAll();
    if (!ok) {
      setErrorMsg("Please fix the errors before continuing.");
      return;
    }

    // ✅ Save step-1 data
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(account));

    // ✅ Go step-2 with plan
    const qs = new URLSearchParams({ plan });
    router.push(`${ENROLL_ROUTE}?${qs.toString()}`);
  };

  const inputClass = (err) => (err ? "input-error" : "");

  return (
    <section className="user-login user-login--two section-space">
      <div className="container">
        <div className="user-login user-login--two">
          <div className="user-login__inner">
            <div className="user-login__top">
              <h4 className="user-login__top__title">Create an account</h4>
              <p className="user-login__top__text">All fields are required</p>
            </div>

            <div className="user-login__form">
              <div className="user-login__form-input-box">
                <label htmlFor="name">Your name</label>
                <input
                  className={inputClass(errors.name)}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  value={account.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              <div className="user-login__form-input-box">
                <label htmlFor="contact">Email address or mobile number</label>
                <input
                  className={inputClass(errors.contact)}
                  type="text"
                  id="contact"
                  name="contact"
                  placeholder="Enter your email address or mobile number"
                  value={account.contact}
                  onChange={handleChange}
                  required
                />
                {errors.contact && <p className="form-error">{errors.contact}</p>}
              </div>

              <div className="user-login__form-input-box">
                <label htmlFor="password">Password</label>
                <input
                  className={inputClass(errors.password)}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your new password"
                  value={account.password}
                  onChange={handleChange}
                  required
                />
                <p className="user-login__form__info">
                  <span className="icon">
                    <Image src={info} alt="icon" />
                  </span>{" "}
                  Password must be at least 6 characters long.
                </p>
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              <div className="user-login__form-input-box">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  className={inputClass(errors.confirmPassword)}
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Enter your password again"
                  value={account.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
              </div>

              {errorMsg && <div className="user-login__form-error">{errorMsg}</div>}

              <div className="user-login__form-input-box">
                <button type="button" onClick={goEnroll} className="commerce-btn" disabled={!canContinue}>
                  Continue
                </button>

                <p className="mt-2">
                  By continuing, you agree to Sadamata’s{" "}
                  <Link href="#">Terms & Conditions</Link> and{" "}
                  <Link href="#">Privacy Policy</Link>.
                </p>
              </div>

              {/* Optional back */}
              <div className="mt-3">
                <button type="button" className="commerce-btn" onClick={() => router.push(CHOOSE_PLAN_ROUTE)}>
                  ← Back to Choose Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .form-error { color: #d22; font-size: 0.875rem; margin-top: 0.25rem; }
        .input-error { border-color: #d22 !important; box-shadow: 0 0 0 1px rgba(210, 34, 34, 0.06); }
        .user-login__form-error {
          background: #ffecec; color: #b00020; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1rem;
        }
        .commerce-btn[disabled] { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </section>
  );
}
