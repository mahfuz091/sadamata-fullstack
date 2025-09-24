"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import info from "@/assets/images/shapes/info.svg";
import { toast } from "sonner";
import { registerUser } from "@/app/actions/auth/auth.actions";
import { Col, Row } from "react-bootstrap";

// helpers
const isEmail = (val) => /\S+@\S+\.\S+/.test(val || "");
const isBDPhone = (val) => /^(?:\+8801|01)[3-9][0-9]{8}$/.test((val || "").trim());

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

  const phoneMode = useMemo(() => isBDPhone(account.contact), [account.contact]);

  // validation
  const canNextFromStep1 = useMemo(() => {
    if (!account.name || !account.contact || !account.password || !account.confirmPassword)
      return false;
    if (account.password !== account.confirmPassword) return false;
    return isEmail(account.contact) || isBDPhone(account.contact);
  }, [account]);

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccount((p) => ({ ...p, [name]: value }));
  };
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const gotoNext = () => {
    if (!canNextFromStep1) {
      setErrorMsg("Please complete Step 1 correctly.");
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
    setErrorMsg("");
    setStep(2);
  };

  const gotoBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // final validations
    if (!canNextFromStep1) {
      setErrorMsg("Please fix Step 1 errors first.");
      setStep(1);
      return;
    }

    // minimal example validation for Step 2 (you can expand as needed)
    if (!profile.fullName) {
      setErrorMsg("Full name is required in Personal Information.");
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

  return (
    <section className="user-login user-login--two section-space">
      <div className="container">
        {/* Progress */}
        {/* <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className={`h-2 flex-1 rounded ${step >= 1 ? "bg-black/80" : "bg-black/10"}`} />
            <div className={`h-2 flex-1 rounded ${step >= 2 ? "bg-black/80" : "bg-black/10"}`} />
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span>Step 1: Account</span>
            <span>Step 2: Profile</span>
          </div>
        </div> */}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="user-login user-login--two">
              <div className="user-login__inner">
                <div className="user-login__top">
                  <h4 className="user-login__top__title">Create account</h4>
                  <p className="user-login__top__text">All fields are required</p>
                </div>

                <div className="user-login__form">
                  <div className="user-login__form-input-box">
                    <label htmlFor="name">Your name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      value={account.name}
                      onChange={handleAccountChange}
                      required
                    />
                  </div>

                  <div className="user-login__form-input-box">
                    <label htmlFor="contact">Email or Phone</label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      placeholder="Enter your email or phone number"
                      value={account.contact}
                      onChange={handleAccountChange}
                      required
                    />
                  </div>

                  <div className="user-login__form-input-box">
                    <label htmlFor="password">Password</label>
                    <input
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
                  </div>

                  <div className="user-login__form-input-box">
                    <label htmlFor="confirmPassword">Re-enter password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Enter your new password again"
                      value={account.confirmPassword}
                      onChange={handleAccountChange}
                      required
                    />
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
                  <Link href="#">Already have an account? <span>Sign in</span></Link>
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
                      type="text"
                      id="full-name"
                      name="fullName"
                      placeholder="Your full name"
                      value={profile.fullName}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-one__control">
                    <label htmlFor="birth-yard">Date of birth</label>
                    <input
                      type="date"
                      id="birth-yard"
                      name="birthYard"
                      placeholder="YYYY-MM-DD"
                      value={profile.birthYard}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-one__control">
                    <label htmlFor="email">Email address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={profile.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-one__control">
                    <label htmlFor="call">Phone number</label>
                    <input
                      type="text"
                      id="call"
                      name="call"
                      placeholder="Your phone number"
                      value={profile.call}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-one__control">
                    <label htmlFor="nid-number">NID/Passport number</label>
                    <input
                      type="text"
                      id="nid-number"
                      name="nidNumber"
                      placeholder="your NID or passport number"
                      value={profile.nidNumber}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-one__control">
                    <label htmlFor="present-address">Present address</label>
                    <input
                      type="text"
                      id="present-address"
                      name="presentAddress"
                      placeholder="Your full address"
                      value={profile.presentAddress}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-one__control">
                    <label htmlFor="permanent-address">Permanent address</label>
                    <input
                      type="text"
                      id="permanent-address"
                      name="permanentAddress"
                      placeholder="Your full address"
                      value={profile.permanentAddress}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-one__control">
                    <label htmlFor="portfolio-link">Your portfolio link (If you have it)</label>
                    <input
                      type="text"
                      id="portfolio-link"
                      name="portfolioLink"
                      placeholder="Enter your portfolio"
                      value={profile.portfolioLink}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-one__control form-one__control--full">
                    <label htmlFor="web-link">Your website (If you have it)</label>
                    <input
                      type="text"
                      id="web-link"
                      name="webLink"
                      placeholder="Enter your website link"
                      value={profile.webLink}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
              </div></Col>
                <Col xs={12}>
                {/* Bank */}
              <div className="brand-register__item">
                <h4 className="brand-register__item__title">Add Your Bank Account</h4>
                <div className="form-one__group">
                  <div className="form-one__control">
                    <label htmlFor="bank-name">What is your bank name?</label>
                    <input
                      type="text"
                      id="bank-name"
                      name="bankName"
                      placeholder="Select your bank"
                      value={profile.bankName}
                      onChange={handleProfileChange}
                    />
                    {/* <select
                      id="bank-name"
                      name="bankName"
                      className="selectpicker"
                      value={profile.bankName}
                      onChange={handleProfileChange}
                    >
                      <option value="">Select your bank</option>
                      <option value="DBBL">DBBL</option>
                      <option value="Sonali Bank">Sonali Bank</option>
                      <option value="Jamuna Bank">Jamuna Bank</option>
                    </select> */}
                  </div>
                  <div className="form-one__control">
                    <label htmlFor="branch-name">Where is the bank located?</label>
                    <input
                      type="text"
                      id="branch-name"
                      name="branchName"
                      placeholder="Enter your branch name"
                      value={profile.branchName}
                      onChange={handleProfileChange}
                    />
                    {/* <select
                      id="branch-name"
                      name="branchName"
                      className="selectpicker"
                      value={profile.branchName}
                      onChange={handleProfileChange}
                    >
                      <option value="">Enter your branch name</option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Pabna">Pabna</option>
                    </select> */}
                  </div>
                </div>

                <div className="form-one__group-two">
                  <div className="form-one__control">
                    <label htmlFor="account-name">Account Name</label>
                    <input
                      type="text"
                      id="account-name"
                      name="accountName"
                      placeholder="Your full name"
                      value={profile.accountName}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-one__control">
                    <label htmlFor="account-number">Account number</label>
                    <input
                      type="text"
                      id="account-number"
                      name="accountNumber"
                      placeholder="Your account number"
                      value={profile.accountNumber}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-one__control form-one__control--full">
                    <label htmlFor="routing-number">Routing number</label>
                    <input
                      type="text"
                      id="routing-number"
                      name="routingNumber"
                      placeholder="Routing number"
                      value={profile.routingNumber}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
              </div></Col>
                <Col xs={12}>
                {/* Additional */}
              <div className="brand-register__item">
                <h4 className="brand-register__item__title">Additional Information</h4>
                <div className="form-one__group">
                  <div className="form-one__control form-one__control--full">
                    <label htmlFor="message">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Write your message"
                      value={profile.message}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
              </div></Col>
              </Row>

              

              

              

              {/* Actions */}
              {errorMsg && <div className="user-login__form-error mb-4">{errorMsg}</div>}

              <div className="flex items-center justify-between">
                <button type="button" onClick={gotoBack} className="commerce-btn">
                  ← Back
                </button>
                <button type="submit" className="commerce-btn" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Registration"} <i className="icon-right-arrow" />
                </button>
              </div>
            </div>
               </div>
          )}
        </form>
      </div>
    </section>
  );
}
