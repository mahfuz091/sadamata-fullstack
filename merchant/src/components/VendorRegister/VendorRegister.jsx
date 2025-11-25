"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import info from "@/assets/images/shapes/info.svg";
import { toast } from "sonner";
import { registerUser } from "@/app/actions/auth/auth.actions";
import { Col, Row } from "react-bootstrap";

/**
 * VendorRegister (full, two-step) with VendorLogin-style validation for ALL fields.
 *
 * - Step 1 (Account) validations:
 *   - name (required)
 *   - contact (required, must be email OR valid BD phone)
 *   - password (required, >=6)
 *   - confirmPassword (required, must match)
 *
 * - Step 2 (Profile) validations: EVERYTHING required (per user request)
 *   - fullName, birthYard, email, call, nidNumber,
 *     presentAddress, permanentAddress, portfolioLink, webLink,
 *     bankName, branchName, accountName, accountNumber, routingNumber, message
 *
 * Inline errors, live validation, disabled Next/Submit buttons, and nice UX.
 */

// helpers (kept from your original file)
const isEmail = (val) => /\S+@\S+\.\S+/.test(val || "");
const isBDPhone = (val) =>
  /^(?:\+8801|01)[3-9][0-9]{8}$/.test((val || "").trim());

export default function VendorRegister() {
  const [step, setStep] = useState(1);

  // Step 1 state (account)
  const [account, setAccount] = useState({
    name: "",
    contact: "", // email OR phone
    password: "",
    confirmPassword: "",
    role: "MERCH",
  });

  // Step 2 state (profile)
  const [profile, setProfile] = useState({
    // personal
    fullName: "",
    birthYard: "", // string date; server converts to Date
    email: "",
    call: "",
    nidNumber: "",
    presentAddress: "",
    permanentAddress: "",
    portfolioLink: "",
    webLink: "",
    // bank
    bankName: "",
    branchName: "",
    accountName: "",
    accountNumber: "",
    routingNumber: "",
    // misc
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // validation error bags
  const [errorsStep1, setErrorsStep1] = useState({
    name: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });

  const [errorsStep2, setErrorsStep2] = useState({
    fullName: "",
    birthYard: "",
    email: "",
    call: "",
    nidNumber: "",
    presentAddress: "",
    permanentAddress: "",
    portfolioLink: "",
    webLink: "",
    bankName: "",
    branchName: "",
    accountName: "",
    accountNumber: "",
    routingNumber: "",
    message: "",
  });

  // derived
  const phoneMode = useMemo(() => isBDPhone(account.contact), [account.contact]);

  /* =========================
     Validation helpers
     ========================= */

  // Step 1 validators
  const validateName = (value) => {
    if (!value || !value.trim()) return "";
    return "";
  };

  const validateContact = (value) => {
    if (!value || !value.trim()) return "";
    if (!isEmail(value) && !isBDPhone(value))
      return "Enter a valid email or BD phone number";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateConfirmPassword = (value, pwd) => {
    if (!value) return "";
    if (value !== pwd) return "Passwords do not match";
    return "";
  };

  // Step 2 validators (everything required as per user request)
  const validateRequired = (value, label = "This field") => {
    if (value === undefined || value === null) return ``;
    if (typeof value === "string" && !value.trim()) return `${label} is required`;
    return "";
  };

  const validateEmailField = (val) => {
    if (!val || !val.trim()) return "";
    if (!isEmail(val)) return "Enter a valid email";
    return "";
  };

  const validatePhoneField = (val) => {
    if (!val || !val.trim()) return "";
    if (!isBDPhone(val)) return "Enter a valid BD phone number";
    return "";
  };

  /* =========================
     Field change handlers (live validation)
     ========================= */

  const handleAccountChange = (e) => {
    const { name, value } = e.target;

    setAccount((prev) => {
      const next = { ...prev, [name]: value };

      // update validation for changed field (and dependent fields)
      setErrorsStep1((prevErr) => {
        const nextErr = { ...prevErr };

        if (name === "name") nextErr.name = validateName(value);
        if (name === "contact") {
          nextErr.contact = validateContact(value);

          // if user changed contact and it affects confirm (no) or phoneMode - nothing else needed
        }
        if (name === "password") {
          nextErr.password = validatePassword(value);
          // update confirmPassword validation because password changed
          nextErr.confirmPassword = validateConfirmPassword(
            next.confirmPassword,
            value
          );
        }
        if (name === "confirmPassword") {
          nextErr.confirmPassword = validateConfirmPassword(value, next.password);
        }

        return nextErr;
      });

      return next;
    });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => {
      const next = { ...prev, [name]: value };

      setErrorsStep2((prevErr) => {
        const nextErr = { ...prevErr };

        // All fields are required (option 4)
        switch (name) {
          case "fullName":
            nextErr.fullName = validateRequired(value, "Full name");
            break;
          case "birthYard":
            nextErr.birthYard = validateRequired(value, "Date of birth");
            break;
          case "email":
            nextErr.email = validateEmailField(value);
            break;
          case "call":
            nextErr.call = validatePhoneField(value);
            break;
          case "nidNumber":
            nextErr.nidNumber = validateRequired(value, "NID/Passport number");
            break;
          case "presentAddress":
            nextErr.presentAddress = validateRequired(value, "Present address");
            break;
          case "permanentAddress":
            nextErr.permanentAddress = validateRequired(value, "Permanent address");
            break;
         
          case "bankName":
            nextErr.bankName = validateRequired(value, "Bank name");
            break;
          case "branchName":
            nextErr.branchName = validateRequired(value, "Branch name");
            break;
          case "accountName":
            nextErr.accountName = validateRequired(value, "Account name");
            break;
          case "accountNumber":
            nextErr.accountNumber = validateRequired(value, "Account number");
            break;
          case "routingNumber":
            nextErr.routingNumber = validateRequired(value, "Routing number");
            break;
          
          default:
            break;
        }

        return nextErr;
      });

      return next;
    });
  };

  /* =========================
     Validate full step helpers (used before navigation / submit)
     ========================= */

  const validateStep1 = () => {
    const nameErr = validateName(account.name);
    const contactErr = validateContact(account.contact);
    const passwordErr = validatePassword(account.password);
    const confirmPasswordErr = validateConfirmPassword(
      account.confirmPassword,
      account.password
    );

    const newErrors = {
      name: nameErr,
      contact: contactErr,
      password: passwordErr,
      confirmPassword: confirmPasswordErr,
    };

    setErrorsStep1(newErrors);

    // return boolean
    return !(
      nameErr ||
      contactErr ||
      passwordErr ||
      confirmPasswordErr
    );
  };

  const validateStep2 = () => {
    const newErr = {};

    newErr.fullName = validateRequired(profile.fullName, "Full name");
    newErr.birthYard = validateRequired(profile.birthYard, "Date of birth");
    newErr.email = validateEmailField(profile.email);
    newErr.call = validatePhoneField(profile.call);
    newErr.nidNumber = validateRequired(profile.nidNumber, "NID/Passport number");
    newErr.presentAddress = validateRequired(profile.presentAddress, "Present address");
    newErr.permanentAddress = validateRequired(profile.permanentAddress, "Permanent address");
    newErr.portfolioLink = "";
    newErr.webLink = ""

    newErr.bankName = validateRequired(profile.bankName, "Bank name");
    newErr.branchName = validateRequired(profile.branchName, "Branch name");
    newErr.accountName = validateRequired(profile.accountName, "Account name");
    newErr.accountNumber = validateRequired(profile.accountNumber, "Account number");
    newErr.routingNumber = validateRequired(profile.routingNumber, "Routing number");

    newErr.message = "";

    setErrorsStep2((prev) => ({ ...prev, ...newErr }));

    // return boolean (no errors)
    return Object.values(newErr).every((v) => !v);
  };

  /* =========================
     Derived booleans for UI
     ========================= */

  const canNextFromStep1 = useMemo(() => {
    // quick early check (fast): required fields present
    if (!account.name || !account.contact || !account.password || !account.confirmPassword)
      return false;

    // run validation (but don't mutate state here). We'll rely on errorsStep1 to reflect live state.
    const valid =
      !errorsStep1.name &&
      !errorsStep1.contact &&
      !errorsStep1.password &&
      !errorsStep1.confirmPassword;

    // If errors haven't been populated yet (first render), run lightweight check:
    if (
      errorsStep1.name === "" &&
      errorsStep1.contact === "" &&
      errorsStep1.password === "" &&
      errorsStep1.confirmPassword === ""
    ) {
      // fallback: check rules synchronously
      return (
        validateName(account.name) === "" &&
        validateContact(account.contact) === "" &&
        validatePassword(account.password) === "" &&
        validateConfirmPassword(account.confirmPassword, account.password) === ""
      );
    }

    return valid;
  }, [account, errorsStep1]);

  const canSubmitStep2 = useMemo(() => {
    // require step1 to be valid too (can't submit unless step1 valid)
    if (!validateStep1()) return false;

    // quick pre-check: any empty required fields?
    const requiredFields = [
  "fullName",
  "birthYard",
  "email",
  "call",
  "nidNumber",
  "presentAddress",
  "permanentAddress",
  "bankName",
  "branchName",
  "accountName",
  "accountNumber",
  "routingNumber",
];
// portfolioLink, webLink, message are optional

    for (const f of requiredFields) {
      const v = profile[f];
      if (v === undefined || v === null || (typeof v === "string" && !v.trim()))
        return false;
    }

    // rely on step2 errors bag
    return Object.values(errorsStep2).every((err) => !err);
  }, [profile, errorsStep2]); // note: validateStep1 called inside (mutates errorsStep1), but that's fine to ensure correctness

  /* =========================
     Navigation handlers
     ========================= */

  const gotoNext = () => {
    setErrorMsg("");
    const ok = validateStep1();
    if (!ok) {
      setErrorMsg("Please fix Step 1 errors before continuing.");
      return;
    }

    // prefill step-2 email/phone with step-1 contact if user didn’t type them
    setProfile((p) => ({
      ...p,
      email: p.email || (isEmail(account.contact) ? account.contact : ""),
      call: p.call || (isBDPhone(account.contact) ? account.contact : ""),
      fullName: p.fullName || account.name,
      accountName: p.accountName || account.name,
    }));

    setStep(2);
  };

  const gotoBack = () => {
    setStep(1);
  };

  /* =========================
     Submit handler
     ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // final validations
    const ok1 = validateStep1();
    const ok2 = validateStep2();

    if (!ok1) {
      setErrorMsg("Please fix Step 1 errors first.");
      setStep(1);
      return;
    }
    if (!ok2) {
      setErrorMsg("Please fix Step 2 errors before submitting.");
      setStep(2);
      return;
    }

    try {
      setSubmitting(true);

      // Build FormData exactly as the server expects
      const fd = new FormData();

      // Step 1 → auth
      fd.append("name", account.name);
      fd.append("password", account.password);
      fd.append("confirmPassword", account.confirmPassword);
      fd.append("role", "MERCH");

      // contact goes to the right field
      if (isEmail(account.contact)) fd.append("email", account.contact);
      else if (isBDPhone(account.contact)) fd.append("phone", account.contact);

      // Step 2 → profile (keep original ids/names the server maps)
      fd.append("full-name", profile.fullName);
      if (profile.birthYard) fd.append("birth-yard", profile.birthYard);
      if (profile.email) fd.append("email", profile.email);
      if (profile.call) fd.append("call", profile.call);
      if (profile.nidNumber) fd.append("nid-number", profile.nidNumber);
      if (profile.presentAddress) fd.append("present-address", profile.presentAddress);
      if (profile.permanentAddress) fd.append("permanent-address", profile.permanentAddress);
      if (profile.portfolioLink) fd.append("portfolio-link", profile.portfolioLink);
      if (profile.webLink) fd.append("web-link", profile.webLink);

      if (profile.bankName) fd.append("bank-name", profile.bankName);
      if (profile.branchName) fd.append("branch-name", profile.branchName);
      if (profile.accountName) fd.append("account-name", profile.accountName);
      if (profile.accountNumber) fd.append("account-number", profile.accountNumber);
      if (profile.routingNumber) fd.append("routing-number", profile.routingNumber);

      if (profile.message) fd.append("message", profile.message);

      const res = await registerUser(fd);

      if (res?.success) {
        toast.success(res.message || "Registration submitted.");

        // reset
        setAccount({
          name: "",
          contact: "",
          password: "",
          confirmPassword: "",
          role: "MERCH",
        });
        setProfile({
          fullName: "",
          birthYard: "",
          email: "",
          call: "",
          nidNumber: "",
          presentAddress: "",
          permanentAddress: "",
          portfolioLink: "",
          webLink: "",
          bankName: "",
          branchName: "",
          accountName: "",
          accountNumber: "",
          routingNumber: "",
          message: "",
        });
        setErrorsStep1({
          name: "",
          contact: "",
          password: "",
          confirmPassword: "",
        });
        setErrorsStep2({
          fullName: "",
          birthYard: "",
          email: "",
          call: "",
          nidNumber: "",
          presentAddress: "",
          permanentAddress: "",
          portfolioLink: "",
          webLink: "",
          bankName: "",
          branchName: "",
          accountName: "",
          accountNumber: "",
          routingNumber: "",
          message: "",
        });

        setStep(1);
      } else {
        setErrorMsg(res?.message || "Something went wrong.");
        toast.error(res?.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error occurred. Please try again.");
      toast.error("Error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
     Small helper for input classes
     ========================= */

  const inputClass = (err) => (err ? "input-error" : "");

  /* =========================
     Render
     ========================= */

  return (
    <section className="user-login user-login--two section-space">
      <div className="container">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="user-login user-login--two">
              <div className="user-login__inner">
                <div className="user-login__top">
                  <h4 className="user-login__top__title">Create account</h4>
                  <p className="user-login__top__text">All fields are required</p>
                </div>

                <div className="user-login__form">
                  {/* Name */}
                  <div className="user-login__form-input-box">
                    <label htmlFor="name">Your name</label>
                    <input
                      className={inputClass(errorsStep1.name)}
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      value={account.name}
                      onChange={handleAccountChange}
                      required
                    />
                    {errorsStep1.name && (
                      <p className="form-error">{errorsStep1.name}</p>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="user-login__form-input-box">
                    <label htmlFor="contact">Email or Phone</label>
                    <input
                      className={inputClass(errorsStep1.contact)}
                      type="text"
                      id="contact"
                      name="contact"
                      placeholder="Enter your email or phone number"
                      value={account.contact}
                      onChange={handleAccountChange}
                      required
                    />
                    {errorsStep1.contact && (
                      <p className="form-error">{errorsStep1.contact}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="user-login__form-input-box">
                    <label htmlFor="password">Password</label>
                    <input
                      className={inputClass(errorsStep1.password)}
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter your new password"
                      value={account.password}
                      onChange={handleAccountChange}
                      required
                    />
                    <p className="user-login__form__info">
                      <span className="icon">
                        <Image src={info} alt="icon" />
                      </span>{" "}
                      Passwords must be at least 6 characters.
                    </p>
                    {errorsStep1.password && (
                      <p className="form-error">{errorsStep1.password}</p>
                    )}
                  </div>

                  {/* Confirm */}
                  <div className="user-login__form-input-box">
                    <label htmlFor="confirmPassword">Re-enter password</label>
                    <input
                      className={inputClass(errorsStep1.confirmPassword)}
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Enter your new password again"
                      value={account.confirmPassword}
                      onChange={handleAccountChange}
                      required
                    />
                    {errorsStep1.confirmPassword && (
                      <p className="form-error">{errorsStep1.confirmPassword}</p>
                    )}
                  </div>

                  {errorMsg && <div className="user-login__form-error">{errorMsg}</div>}

                  <div className="user-login__form-input-box">
                    <button
                      type="button"
                      onClick={gotoNext}
                      className="commerce-btn"
                      disabled={!canNextFromStep1}
                    >
                      Next: Profile <i className="icon-right-arrow" />
                    </button>
                    <p className="mt-2">
                      By continuing, you agree to{" "}
                      <Link href="#">conditions of use</Link> and{" "}
                      <Link href="#">privacy notice</Link>.
                    </p>
                  </div>
                </div>

                <div className="user-login__bottom">
                  <Link href="#">
                    Already have an account? <span>Sign in</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="brand-register">
              <div className="form-one">
                <h2 className="brand-register__title">Creator Information</h2>

                <Row className="gutter-y-30">
                  <Col xs={12}>
                    {/* Personal */}
                    <div className="brand-register__item">
                      <h4 className="brand-register__item__title">Personal Information</h4>
                      <div className="form-one__group">
                        <div className="form-one__control">
                          <label htmlFor="full-name">Full name</label>
                          <input
                            className={inputClass(errorsStep2.fullName)}
                            type="text"
                            id="full-name"
                            name="fullName"
                            placeholder="Your full name"
                            value={profile.fullName}
                            onChange={handleProfileChange}
                            required
                          />
                          {errorsStep2.fullName && (
                            <p className="form-error">{errorsStep2.fullName}</p>
                          )}
                        </div>

                        <div className="form-one__control">
                          <label htmlFor="birth-yard">Date of birth</label>
                          <input
                            className={inputClass(errorsStep2.birthYard)}
                            type="date"
                            id="birth-yard"
                            name="birthYard"
                            placeholder="YYYY-MM-DD"
                            value={profile.birthYard}
                            onChange={handleProfileChange}
                            required
                          />
                          {errorsStep2.birthYard && (
                            <p className="form-error">{errorsStep2.birthYard}</p>
                          )}
                        </div>

                        <div className="form-one__control">
                          <label htmlFor="email">Email address</label>
                          <input
                            className={inputClass(errorsStep2.email)}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={profile.email}
                            onChange={handleProfileChange}
                            required
                          />
                          {errorsStep2.email && (
                            <p className="form-error">{errorsStep2.email}</p>
                          )}
                        </div>

                        <div className="form-one__control">
                          <label htmlFor="call">Phone number</label>
                          <input
                            className={inputClass(errorsStep2.call)}
                            type="text"
                            id="call"
                            name="call"
                            placeholder="Your phone number"
                            value={profile.call}
                            onChange={handleProfileChange}
                            required
                          />
                          {errorsStep2.call && (
                            <p className="form-error">{errorsStep2.call}</p>
                          )}
                        </div>

                        <div className="form-one__control">
                          <label htmlFor="nid-number">NID/Passport number</label>
                          <input
                            className={inputClass(errorsStep2.nidNumber)}
                            type="text"
                            id="nid-number"
                            name="nidNumber"
                            placeholder="your NID or passport number"
                            value={profile.nidNumber}
                            onChange={handleProfileChange}
                            required
                          />
                          {errorsStep2.nidNumber && (
                            <p className="form-error">{errorsStep2.nidNumber}</p>
                          )}
                        </div>

                        <div className="form-one__control">
                          <label htmlFor="present-address">Present address</label>
                          <input
                            className={inputClass(errorsStep2.presentAddress)}
                            type="text"
                            id="present-address"
                            name="presentAddress"
                            placeholder="Your full address"
                            value={profile.presentAddress}
                            onChange={handleProfileChange}
                            required
                          />
                          {errorsStep2.presentAddress && (
                            <p className="form-error">{errorsStep2.presentAddress}</p>
                          )}
                        </div>

                        <div className="form-one__control">
                          <label htmlFor="permanent-address">Permanent address</label>
                          <input
                            className={inputClass(errorsStep2.permanentAddress)}
                            type="text"
                            id="permanent-address"
                            name="permanentAddress"
                            placeholder="Your full address"
                            value={profile.permanentAddress}
                            onChange={handleProfileChange}
                            required
                          />
                          {errorsStep2.permanentAddress && (
                            <p className="form-error">{errorsStep2.permanentAddress}</p>
                          )}
                        </div>

                        <div className="form-one__control">
                          <label htmlFor="portfolio-link">Your portfolio link (If you have it)</label>
                          <input
                            className={inputClass(errorsStep2.portfolioLink)}
                            type="text"
                            id="portfolio-link"
                            name="portfolioLink"
                            placeholder="Enter your portfolio"
                            value={profile.portfolioLink}
                            onChange={handleProfileChange}
                          
                          />
                          {errorsStep2.portfolioLink && (
                            <p className="form-error">{errorsStep2.portfolioLink}</p>
                          )}
                        </div>

                        <div className="form-one__control form-one__control--full">
                          <label htmlFor="web-link">Your website (If you have it)</label>
                          <input
                            className={inputClass(errorsStep2.webLink)}
                            type="text"
                            id="web-link"
                            name="webLink"
                            placeholder="Enter your website link"
                            value={profile.webLink}
                            onChange={handleProfileChange}
                           
                          />
                          {errorsStep2.webLink && (
                            <p className="form-error">{errorsStep2.webLink}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col xs={12}>
                    {/* Bank */}
                    <div className="brand-register__item">
                      <h4 className="brand-register__item__title">Add Your Bank Account</h4>
                      <div className="form-one__group">
                        <div className="form-one__control">
                          <label htmlFor="bank-name">What is your bank name?</label>
                          <input
                            className={inputClass(errorsStep2.bankName)}
                            type="text"
                            id="bank-name"
                            name="bankName"
                            placeholder="Select your bank"
                            value={profile.bankName}
                            onChange={handleProfileChange}
                            required
                          />
                          {errorsStep2.bankName && (
                            <p className="form-error">{errorsStep2.bankName}</p>
                          )}
                        </div>

                        <div className="form-one__control">
                          <label htmlFor="branch-name">Where is the bank located?</label>
                          <input
                            className={inputClass(errorsStep2.branchName)}
                            type="text"
                            id="branch-name"
                            name="branchName"
                            placeholder="Enter your branch name"
                            value={profile.branchName}
                            onChange={handleProfileChange}
                            required
                          />
                          {errorsStep2.branchName && (
                            <p className="form-error">{errorsStep2.branchName}</p>
                          )}
                        </div>
                      </div>

                      <div className="form-one__group-two">
                        <div className="form-one__control">
                          <label htmlFor="account-name">Account Name</label>
                          <input
                            className={inputClass(errorsStep2.accountName)}
                            type="text"
                            id="account-name"
                            name="accountName"
                            placeholder="Your full name"
                            value={profile.accountName}
                            onChange={handleProfileChange}
                            required
                          />
                          {errorsStep2.accountName && (
                            <p className="form-error">{errorsStep2.accountName}</p>
                          )}
                        </div>

                        <div className="form-one__control">
                          <label htmlFor="account-number">Account number</label>
                          <input
                            className={inputClass(errorsStep2.accountNumber)}
                            type="text"
                            id="account-number"
                            name="accountNumber"
                            placeholder="Your account number"
                            value={profile.accountNumber}
                            onChange={handleProfileChange}
                            required
                          />
                          {errorsStep2.accountNumber && (
                            <p className="form-error">{errorsStep2.accountNumber}</p>
                          )}
                        </div>

                        <div className="form-one__control form-one__control--full">
                          <label htmlFor="routing-number">Routing number</label>
                          <input
                            className={inputClass(errorsStep2.routingNumber)}
                            type="text"
                            id="routing-number"
                            name="routingNumber"
                            placeholder="Routing number"
                            value={profile.routingNumber}
                            onChange={handleProfileChange}
                            required
                          />
                          {errorsStep2.routingNumber && (
                            <p className="form-error">{errorsStep2.routingNumber}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col xs={12}>
                    {/* Additional */}
                    <div className="brand-register__item">
                      <h4 className="brand-register__item__title">Additional Information</h4>
                      <div className="form-one__group">
                        <div className="form-one__control form-one__control--full">
                          <label htmlFor="message">Your Message</label>
                          <textarea
                            className={inputClass(errorsStep2.message)}
                            id="message"
                            name="message"
                            placeholder="Write your message"
                            value={profile.message}
                            onChange={handleProfileChange}
                            
                          />
                          {errorsStep2.message && (
                            <p className="form-error">{errorsStep2.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Actions */}
                {errorMsg && <div className="user-login__form-error mb-4">{errorMsg}</div>}

                <div className="flex items-center justify-between">
                  <button type="button" onClick={gotoBack} className="commerce-btn">
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="commerce-btn"
                    disabled={submitting || !canSubmitStep2}
                  >
                    {submitting ? "Submitting..." : "Submit Registration"}{" "}
                    <i className="icon-right-arrow" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Minimal inline styles for invalid inputs (optional - remove if you have global css) */}
      <style jsx>{`
        .form-error {
          color: #d22;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        .input-error {
          border-color: #d22 !important;
          box-shadow: 0 0 0 1px rgba(210, 34, 34, 0.06);
        }
        .user-login__form-error {
          background: #ffecec;
          color: #b00020;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
        }
        .commerce-btn[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
}
