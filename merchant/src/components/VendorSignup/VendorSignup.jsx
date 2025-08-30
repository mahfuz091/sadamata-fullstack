"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import info from "@/assets/images/shapes/info.svg";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth/auth.actions";
import { toast } from "sonner";

const VendorSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "", // This will be either email or phone
    password: "",
    confirmPassword: "",
    role: "MERCH", // Default role set to 'MERCH'
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPhoneNumber, setIsPhoneNumber] = useState(false); // Track if phone number is entered
  console.log(errorMessage, isPhoneNumber, formData, "remon");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Check if the input is a phone number
    if (name === "contact" && value.trim()) {
      const isValidPhone = /^(?:\+8801|01)[3-9][0-9]{8}$/.test(value);
      setIsPhoneNumber(isValidPhone); // Set the state based on phone validation
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation for password matching
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const contactField = formData.contact.trim();
    if (!contactField) {
      setErrorMessage("Please enter an email or phone number.");
      return;
    }

    // Regular expression to check if the input is an email
    const isValidEmail = /\S+@\S+\.\S+/.test(contactField);

    // Regular expression to check if the input is a phone number (basic format)
    const isValidPhone = /^(?:\+8801|01)[3-9][0-9]{8}$/.test(contactField);

    if (!isValidEmail && !isValidPhone) {
      setErrorMessage("Please enter a valid email or phone number.");
      return;
    }

    // If contact is phone, make sure name and password fields are also filled
    if (isValidPhone) {
      if (!formData.name || !formData.password || !formData.confirmPassword) {
        setErrorMessage("All fields are required. r");
        return;
      }
    } else {
      // For email, you can validate other fields normally
      if (!formData.name || !formData.password || !formData.confirmPassword) {
        setErrorMessage("All fields are required. s");
        return;
      }
    }

    // Determine the type of contact (email or phone)
    const contactType = isValidEmail
      ? "email"
      : isValidPhone
      ? "phone"
      : "phone";

    // Convert form data to FormData object
    const form = new FormData();
    // Append the appropriate field (either email or phone) based on the validation
    form.append(contactType, formData.contact);

    // Append other form fields (name, password, etc.)
    Object.keys(formData).forEach((key) => {
      if (key !== "contact") form.append(key, formData[key]);
    });

    try {
      // Call registerUser function (simulated on the server side)
      const result = await registerUser(form);

      if (result.success) {
        setSuccessMessage("Account created successfully!");
        setErrorMessage(""); // Clear error message if successful
        toast.success(result.message);
        setFormData({
          name: "",
          contact: "",
          password: "",
          confirmPassword: "",
          role: "BRAND", // Default role remains the same
        });
      } else {
        setSuccessMessage(""); // Clear success message if failed
        setErrorMessage(result.message || "Something went wrong.");
      }
    } catch (err) {
      setSuccessMessage(""); // Clear success message if error occurs
      setErrorMessage("Error occurred. Please try again.");
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
            <div className='user-login__form-input-box'>
              <label htmlFor='name'>Your name</label>
              <input
                type='text'
                id='name'
                name='name'
                placeholder='Your full name'
                value={formData.name}
                onChange={handleChange}
                required={isPhoneNumber} // Make this required if phone is entered
              />
            </div>
            <div className='user-login__form-input-box'>
              <label htmlFor='contact'>Email or Phone</label>
              <input
                type='text'
                id='contact'
                name='contact'
                placeholder='Enter your email or phone number'
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </div>
            <div className='user-login__form-input-box'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                id='password'
                name='password'
                placeholder='Enter your new password'
                value={formData.password}
                onChange={handleChange}
                required={isPhoneNumber} // Make this required if phone is entered
              />
              <p className='user-login__form__info'>
                <span className='icon'>
                  <Image src={info} alt='icon' />
                </span>{" "}
                Passwords must be at least 6 characters.
              </p>
            </div>
            <div className='user-login__form-input-box'>
              <label htmlFor='reenter'>Re-enter password</label>
              <input
                type='password'
                id='reenter'
                name='confirmPassword'
                placeholder='Enter your new password again'
                value={formData.confirmPassword}
                onChange={handleChange}
                required={isPhoneNumber} // Make this required if phone is entered
              />
            </div>

            {/* Display error or success messages */}
            {errorMessage && (
              <div className='user-login__form-error'>{errorMessage}</div>
            )}
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

// Exporting the function to be used in the frontend
export default VendorSignup;
