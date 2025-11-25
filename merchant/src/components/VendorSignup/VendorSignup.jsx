"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import info from "@/assets/images/shapes/info.svg";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth/auth.actions";
import { toast } from "sonner";

const VendorSignup = () => {
  // -----------------------
  // Validation Functions
  // -----------------------
  const isValidBDPhone = (value) => {
    return /^(?:\+?8801|01)[3-9]\d{8}$/.test(value);
  };

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  // -----------------------
  // State
  // -----------------------
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    password: "",
    confirmPassword: "",
    role: "MERCH",
  });

  const [errors, setErrors] = useState({
    contact: "",
    password: "",
    confirmPassword: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [isPhoneNumber, setIsPhoneNumber] = useState(false);

  // -----------------------
  // Real-time Validation
  // -----------------------
  const validateField = (name, value) => {
    let message = "";

    switch (name) {
      case "contact":
        if (!value.trim()) {
          message = "Email or phone number is required.";
        } else if (isValidBDPhone(value)) {
          message = "";
          setIsPhoneNumber(true);
        } else if (isValidEmail(value)) {
          message = "";
          setIsPhoneNumber(false);
        } else {
          message = "Invalid email or Bangladesh phone number.";
        }
        break;

      case "password":
        if (value.length < 6) {
          message = "Password must be at least 6 characters long.";
        } else {
          message = "";
        }
        break;

      case "confirmPassword":
        if (value !== formData.password) {
          message = "Passwords do not match.";
        } else {
          message = "";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  // -----------------------
  // Input Change Handler
  // -----------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Live validation
    validateField(name, value);
  };

  // -----------------------
  // Submit Handler
  // -----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // final validation check
    if (errors.contact || errors.password || errors.confirmPassword) {
      return;
    }

    const contactField = formData.contact.trim();
    const validEmail = isValidEmail(contactField);
    const validPhone = isValidBDPhone(contactField);

    if (!validEmail && !validPhone) {
      setErrors((prev) => ({
        ...prev,
        contact: "Please enter a valid email or Bangladesh phone number.",
      }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
      return;
    }

    const contactType = validEmail ? "email" : "phone";

    const form = new FormData();
    form.append(contactType, formData.contact);

    Object.keys(formData).forEach((key) => {
      if (key !== "contact") form.append(key, formData[key]);
    });

    try {
      const result = await registerUser(form);

      if (result.success) {
        toast.success(result.message);
        setSuccessMessage("Account created successfully!");

        setFormData({
          name: "",
          contact: "",
          password: "",
          confirmPassword: "",
          role: "BRAND",
        });

        setErrors({
          contact: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        setSuccessMessage("");
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <section className='user-login user-login--two section-space'>
      <div className='container'>
        <div className='user-login__inner'>
          <div className='user-login__top'>
            <h4 className='user-login__top__title'>Create account</h4>
            <p className='user-login__top__text'>All fields are required</p>
          </div>

          <form className='user-login__form' onSubmit={handleSubmit}>
            
            {/* NAME */}
            <div className='user-login__form-input-box'>
              <label htmlFor='name'>Your name</label>
              <input
                type='text'
                id='name'
                name='name'
                placeholder='Your full name'
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* CONTACT */}
            <div className='user-login__form-input-box'>
              <label htmlFor='contact'>Email or Phone</label>
              <input
                type='text'
                id='contact'
                name='contact'
                placeholder='Enter your email or Bangladesh phone number'
                value={formData.contact}
                onChange={handleChange}
                required
              />

              {errors.contact && (
                <p className="input-error-text">{errors.contact}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className='user-login__form-input-box'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                id='password'
                name='password'
                placeholder='Enter your password'
                value={formData.password}
                onChange={handleChange}
                required
              />

              {errors.password && (
                <p className="input-error-text">{errors.password}</p>
              )}

              <p className='user-login__form__info'>
                <span className='icon'>
                  <Image src={info} alt='icon' />
                </span>
                Passwords must be at least 6 characters.
              </p>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className='user-login__form-input-box'>
              <label htmlFor='confirmPassword'>Re-enter password</label>
              <input
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                placeholder='Enter your password again'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              {errors.confirmPassword && (
                <p className="input-error-text">{errors.confirmPassword}</p>
              )}
            </div>

            {/* SUCCESS MESSAGE */}
            {successMessage && (
              <div className='user-login__form-success'>{successMessage}</div>
            )}

            <div className='user-login__form-input-box'>
              <button type='submit' className='commerce-btn'>
                Create your account <i className='icon-right-arrow' />
              </button>
              <p>
                By continuing, you agree to amazon’s{" "}
                <Link href='#'>conditions of use</Link> and{" "}
                <Link href='#'>privacy notice</Link>.
              </p>
            </div>
          </form>

          <div className='user-login__bottom'>
            <Link href='#'>
              Already have an account? <span>Sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorSignup;
