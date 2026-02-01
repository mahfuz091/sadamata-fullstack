"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { registerUser } from "@/app/actions/auth/auth.actions";

const isEmail = (val) => /\S+@\S+\.\S+/.test(val || "");
const isBDPhone = (val) =>
  /^(?:\+8801|01)[3-9][0-9]{8}$/.test((val || "").trim());

const STORAGE_KEY = "sadamatta_brand_signup_step1";

export default function BrandEnrollStep2() {
  const router = useRouter();
  const sp = useSearchParams();

  const plan = sp.get("plan"); // exclusive / nonExclusive
  const nameQP = sp.get("name") || "";
  const contactQP = sp.get("contact") || "";

  const [account, setAccount] = useState(null);

  // Step2 profile state
  const [profile, setProfile] = useState({
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
    industryType: "",
    socialProfileLink: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    birthYard: "",
    email: "",
    call: "",
    nidNumber: "",
    presentAddress: "",
    permanentAddress: "",
    bankName: "",
    branchName: "",
    accountName: "",
    accountNumber: "",
    routingNumber: "",
    socialProfileLink: "",
    industryType: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ Load step1 account from sessionStorage (recommended)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (!saved) {
        // fallback: if no storage, send back to signup
        router.push(
          `/vendor/register?name=${encodeURIComponent(nameQP)}&contact=${encodeURIComponent(contactQP)}`,
        );
        return;
      }
      const parsed = JSON.parse(saved);
      setAccount(parsed);

      // Prefill profile from step1
      setProfile((p) => ({
        ...p,
        fullName: p.fullName || parsed.name || nameQP,
        accountName: p.accountName || parsed.name || nameQP,
        email: p.email || (isEmail(parsed.contact) ? parsed.contact : ""),
        call: p.call || (isBDPhone(parsed.contact) ? parsed.contact : ""),
      }));
    } catch {
      router.push("/signup");
    }
  }, [router, nameQP, contactQP]);

  // validators
  const req = (v, label) =>
    !v || !String(v).trim() ? `${label} is required` : "";
  const emailV = (v) =>
    req(v, "Email") ? req(v, "Email") : isEmail(v) ? "" : "Enter a valid email";
  const phoneV = (v) =>
    req(v, "Phone")
      ? req(v, "Phone")
      : isBDPhone(v)
        ? ""
        : "Enter a valid BD phone number";

  const validateAll = () => {
    const bag = {
      fullName: req(profile.fullName, "Full name"),
      birthYard: req(profile.birthYard, "Date of birth"),
      email: emailV(profile.email),
      call: phoneV(profile.call),
      nidNumber: req(profile.nidNumber, "NID/Passport number"),
      presentAddress: req(profile.presentAddress, "Present address"),
      permanentAddress: req(profile.permanentAddress, "Permanent address"),
      bankName: req(profile.bankName, "Bank name"),
      branchName: req(profile.branchName, "Branch name"),
      accountName: req(profile.accountName, "Account name"),
      accountNumber: req(profile.accountNumber, "Account number"),
      routingNumber: req(profile.routingNumber, "Routing number"),
      industryType: req(profile.industryType, "Industry Type"),
      socialProfileLink: req(profile.socialProfileLink, "Social Profile Link"),
    };
    setErrors(bag);
    return Object.values(bag).every((x) => !x);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));

    // live validate (simple)
    setErrors((prev) => {
      const next = { ...prev };
      if (name === "fullName") next.fullName = req(value, "Full name");
      if (name === "birthYard") next.birthYard = req(value, "Date of birth");
      if (name === "email") next.email = emailV(value);
      if (name === "call") next.call = phoneV(value);
      if (name === "nidNumber")
        next.nidNumber = req(value, "NID/Passport number");
      if (name === "presentAddress")
        next.presentAddress = req(value, "Present address");
      if (name === "permanentAddress")
        next.permanentAddress = req(value, "Permanent address");
      if (name === "bankName") next.bankName = req(value, "Bank name");
      if (name === "branchName") next.branchName = req(value, "Branch name");
      if (name === "accountName") next.accountName = req(value, "Account name");
      if (name === "accountNumber")
        next.accountNumber = req(value, "Account number");
      if (name === "routingNumber")
        next.routingNumber = req(value, "Routing number");
      if (name === "industryType")
        next.industryType = req(value, "Industry Type");
      if (name === "socialProfileLink")
        next.socialProfileLink = req(value, "Social Profile Link");
      return next;
    });
  };

  const canSubmit = useMemo(() => {
    const required = [
      "fullName",
      "birthYard",
      "email",
      "call",
      "nidNumber",
      "presentAddress",
      "permanentAddress",
      "industryType",
      "socialProfileLink",
      "bankName",
      "branchName",
      "accountName",
      "accountNumber",
      "routingNumber",
    ];
    for (const f of required) {
      const v = profile[f];
      if (!v || !String(v).trim()) return false;
    }
    return Object.values(errors).every((x) => !x) && !!account && !!plan;
  }, [profile, errors, account, plan]);

  const inputClass = (err) => (err ? "input-error" : "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!account) {
      setErrorMsg("Step 1 data missing. Please signup again.");
      router.push("/signup");
      return;
    }
    if (!plan) {
      setErrorMsg("Please choose a plan first.");
      router.push(
        `/choose-plan?name=${encodeURIComponent(nameQP)}&contact=${encodeURIComponent(contactQP)}`,
      );
      return;
    }

    const ok = validateAll();
    if (!ok) {
      setErrorMsg("Please fix the errors before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      const isExclusive = plan === "exclusive";
      const fd = new FormData();

      fd.append("socialProfileLink", profile.socialProfileLink);
      fd.append("industryType", profile.industryType);
      // Step1 auth (from sessionStorage)
      fd.append("name", account.name);
      fd.append("password", account.password);
      fd.append("confirmPassword", account.confirmPassword);
      fd.append("role", "BRAND");
      fd.append("isExclusive", isExclusive ? "true" : "false");

      if (isEmail(account.contact)) fd.append("email", account.contact);
      else if (isBDPhone(account.contact)) fd.append("phone", account.contact);

      // ✅ plan (if your server wants it)
      //   fd.append("brand-plan", plan);

      // Step2 profile
      fd.append("full-name", profile.fullName);
      fd.append("birth-yard", profile.birthYard);
      fd.append("email", profile.email);
      fd.append("call", profile.call);
      fd.append("nid-number", profile.nidNumber);
      fd.append("present-address", profile.presentAddress);
      fd.append("permanent-address", profile.permanentAddress);

      if (profile.portfolioLink)
        fd.append("portfolio-link", profile.portfolioLink);
      if (profile.webLink) fd.append("web-link", profile.webLink);

      fd.append("bank-name", profile.bankName);
      fd.append("branch-name", profile.branchName);
      fd.append("account-name", profile.accountName);
      fd.append("account-number", profile.accountNumber);
      fd.append("routing-number", profile.routingNumber);

      if (profile.message) fd.append("message", profile.message);

      const res = await registerUser(fd);

      if (res?.success) {
        toast.success(res.message || "Registration submitted.");
        // clear storage
        sessionStorage.removeItem(STORAGE_KEY);

        setTimeout(() => router.push("/activation-notice"), 700);
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
    <section className="brand-register section-space">
      <div className="container">
        <div className="form-one">
          <h2 className="brand-register__title">Creator Information</h2>

          {!plan && (
            <div className="user-login__form-error">
              Plan is missing. Please choose a plan again.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Row className="gutter-y-30">
              <Col xs={12}>
                <div className="brand-register__item">
                  <h4 className="brand-register__item__title">
                    Select Your Industry
                  </h4>

                  <div className="form-one__group">
                    <div className="form-one__control">
                      <label htmlFor="industry-type">Industry Type</label>
                      <input
                        className={inputClass(errors.industryType)}
                        type="text"
                        id="industry-type"
                        name="industryType"
                        value={profile.industryType}
                        onChange={handleProfileChange}
                        required
                        placeholder="e.g. Fashion, Electronics, Beauty"
                      />
                      {errors.industryType && (
                        <p className="form-error">{errors.industryType}</p>
                      )}
                    </div>

                    <div className="form-one__control">
                      <label htmlFor="social-profile">
                        Social Profile Link
                      </label>
                      <input
                        className={inputClass(errors.socialProfileLink)}
                        type="text"
                        id="social-profile"
                        name="socialProfileLink"
                        value={profile.socialProfileLink}
                        onChange={handleProfileChange}
                        required
                        placeholder="e.g. https://facebook.com/yourpage"
                      />
                      {errors.socialProfileLink && (
                        <p className="form-error">{errors.socialProfileLink}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12}>
                <div className="brand-register__item">
                  <h4 className="brand-register__item__title">
                    Personal Information
                  </h4>

                  <div className="form-one__group">
                    <div className="form-one__control">
                      <label htmlFor="full-name">Full name</label>
                      <input
                        className={inputClass(errors.fullName)}
                        type="text"
                        id="full-name"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleProfileChange}
                        required
                      />
                      {errors.fullName && (
                        <p className="form-error">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="form-one__control">
                      <label htmlFor="birth-yard">Date of birth</label>
                      <input
                        className={inputClass(errors.birthYard)}
                        type="date"
                        id="birth-yard"
                        name="birthYard"
                        value={profile.birthYard}
                        onChange={handleProfileChange}
                        required
                      />
                      {errors.birthYard && (
                        <p className="form-error">{errors.birthYard}</p>
                      )}
                    </div>

                    <div className="form-one__control">
                      <label htmlFor="email">Email address</label>
                      <input
                        className={inputClass(errors.email)}
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        required
                      />
                      {errors.email && (
                        <p className="form-error">{errors.email}</p>
                      )}
                    </div>

                    <div className="form-one__control">
                      <label htmlFor="call">Phone number</label>
                      <input
                        className={inputClass(errors.call)}
                        type="text"
                        id="call"
                        name="call"
                        value={profile.call}
                        onChange={handleProfileChange}
                        required
                      />
                      {errors.call && (
                        <p className="form-error">{errors.call}</p>
                      )}
                    </div>

                    <div className="form-one__control">
                      <label htmlFor="nid-number">NID or Passport number</label>
                      <input
                        className={inputClass(errors.nidNumber)}
                        type="text"
                        id="nid-number"
                        name="nidNumber"
                        value={profile.nidNumber}
                        onChange={handleProfileChange}
                        required
                      />
                      {errors.nidNumber && (
                        <p className="form-error">{errors.nidNumber}</p>
                      )}
                    </div>

                    <div className="form-one__control">
                      <label htmlFor="present-address">Present address</label>
                      <input
                        className={inputClass(errors.presentAddress)}
                        type="text"
                        id="present-address"
                        name="presentAddress"
                        value={profile.presentAddress}
                        onChange={handleProfileChange}
                        required
                      />
                      {errors.presentAddress && (
                        <p className="form-error">{errors.presentAddress}</p>
                      )}
                    </div>

                    <div className="form-one__control">
                      <label htmlFor="permanent-address">
                        Permanent address
                      </label>
                      <input
                        className={inputClass(errors.permanentAddress)}
                        type="text"
                        id="permanent-address"
                        name="permanentAddress"
                        value={profile.permanentAddress}
                        onChange={handleProfileChange}
                        required
                      />
                      {errors.permanentAddress && (
                        <p className="form-error">{errors.permanentAddress}</p>
                      )}
                    </div>

                    <div className="form-one__control">
                      <label htmlFor="portfolio-link">
                        Your portfolio link (If you have it)
                      </label>
                      <input
                        type="text"
                        id="portfolio-link"
                        name="portfolioLink"
                        value={profile.portfolioLink}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <div className="form-one__control form-one__control--full">
                      <label htmlFor="web-link">
                        Your website (If you have it)
                      </label>
                      <input
                        type="text"
                        id="web-link"
                        name="webLink"
                        value={profile.webLink}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={12}>
                <div className="brand-register__item">
                  <h4 className="brand-register__item__title">
                    Add Your Bank Account
                  </h4>

                  <div className="form-one__group">
                    <div className="form-one__control">
                      <label htmlFor="bank-name">What is your bank name?</label>
                      <input
                        className={inputClass(errors.bankName)}
                        type="text"
                        id="bank-name"
                        name="bankName"
                        value={profile.bankName}
                        onChange={handleProfileChange}
                        required
                      />
                      {errors.bankName && (
                        <p className="form-error">{errors.bankName}</p>
                      )}
                    </div>

                    <div className="form-one__control">
                      <label htmlFor="branch-name">Branch name</label>
                      <input
                        className={inputClass(errors.branchName)}
                        type="text"
                        id="branch-name"
                        name="branchName"
                        value={profile.branchName}
                        onChange={handleProfileChange}
                        required
                      />
                      {errors.branchName && (
                        <p className="form-error">{errors.branchName}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-one__group-two">
                    <div className="form-one__control">
                      <label htmlFor="account-name">Account holder name</label>
                      <input
                        className={inputClass(errors.accountName)}
                        type="text"
                        id="account-name"
                        name="accountName"
                        value={profile.accountName}
                        onChange={handleProfileChange}
                        required
                      />
                      {errors.accountName && (
                        <p className="form-error">{errors.accountName}</p>
                      )}
                    </div>

                    <div className="form-one__control">
                      <label htmlFor="account-number">Account number</label>
                      <input
                        className={inputClass(errors.accountNumber)}
                        type="text"
                        id="account-number"
                        name="accountNumber"
                        value={profile.accountNumber}
                        onChange={handleProfileChange}
                        required
                      />
                      {errors.accountNumber && (
                        <p className="form-error">{errors.accountNumber}</p>
                      )}
                    </div>

                    <div className="form-one__control form-one__control--full">
                      <label htmlFor="routing-number">Routing number</label>
                      <input
                        className={inputClass(errors.routingNumber)}
                        type="text"
                        id="routing-number"
                        name="routingNumber"
                        value={profile.routingNumber}
                        onChange={handleProfileChange}
                        required
                      />
                      {errors.routingNumber && (
                        <p className="form-error">{errors.routingNumber}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={12}>
                <div className="brand-register__item">
                  <h4 className="brand-register__item__title">
                    Additional Information
                  </h4>
                  <div className="form-one__group">
                    <div className="form-one__control form-one__control--full">
                      <label htmlFor="message">Your Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={profile.message}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {errorMsg && (
              <div className="user-login__form-error mb-4">{errorMsg}</div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="button"
                className="commerce-btn"
                onClick={() =>
                  router.push(
                    `/brand/choose-plan?name=${encodeURIComponent(nameQP)}&contact=${encodeURIComponent(contactQP)}`,
                  )
                }
              >
                ← Back
              </button>

              <button
                type="submit"
                className="commerce-btn"
                disabled={submitting || !canSubmit}
              >
                {submitting ? "Submitting..." : "Submit for review"}
              </button>
            </div>
          </form>
        </div>
      </div>

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
