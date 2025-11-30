"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { CountrySelect } from "react-country-state-city";
import {
  updateUserInfo,
  updateUserAddressProfileImageFile,
  updateMerchantBankInfo,
  updateUserPassword,
} from "@/app/actions/auth/userAddressActions"; // keep your existing user update

import { useRouter } from "next/navigation";
import Link from "next/link";

const ChangePassword = ({ user, countries }) => {
  const [editMode, setEditMode] = useState(false);
  const [phoneValue, setPhoneValue] = useState(
    user?.merchantProfile?.contactPhone || ""
  );
  const [country, setCountry] = useState(null);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  useEffect(() => {
    if (user?.merchantProfile?.country) {
      const matched = countries.find(
        (c) => c.name === user.merchantProfile.country
      );
      setCountry(matched);
    }
  }, [user, countries]);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(
    user?.profileImage || "/assets/images/resources/avater.png"
  );

  const [formData, setFormData] = useState({
    bankName: user?.merchantProfile?.bankName || "",
    bankBranch: user?.merchantProfile?.bankBranch || "",
    accountName: user?.merchantProfile?.accountName || "",
    accountNumber: user?.merchantProfile?.accountNumber || "",
    routingNumber: user?.merchantProfile?.routingNumber || "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function formatDateForInput(date) {
    if (!date) return "";
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  }

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setPreview(URL.createObjectURL(selectedFile));
    setFile(selectedFile);

    try {
      const updated = await updateUserAddressProfileImageFile(
        user.id,
        selectedFile
      );
      // updated is expected to return { updatedAddress, publicUrl } or at least updatedAddress.profileImage
      // If your server action returns different shape, adapt accordingly.
      const newImg = updated?.profileImage || updated?.publicUrl || null;
      if (newImg) setPreview(newImg);
      router.refresh(); // refresh server components & session data
      toast.success("Profile image updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Existing update handler (personal info)
  const handleSubmit = async () => {
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    if (form.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      // Call server action
      await updateUserPassword(user.id, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      toast.success("Password updated successfully");
      setEditMode(false);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });

      // optional: refresh server components / session
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  // NEW: bank-specific update handler
  const handleBankUpdate = async () => {
    setLoading(true);
    try {
      await updateMerchantBankInfo(user.id, formData);

      toast.success("Bank info updated!");
      setEditMode(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update bank info");
    }
    setLoading(false);
  };

  return (
    <section className='user-profile'>
      <div className='container'>
        <div className='user-profile-top__text-box'>
          <h2 className='user-profile-top__title'>Profile Settings</h2>
          <p className='user-profile-top__text'>
            Customize your personal profile data.
          </p>
        </div>

        <div className='user-profile__form'>
          <form
            className='user-form form-one'
            onSubmit={(e) => {
              e.preventDefault();
              // If editMode and bank fields are visible, you may want to call handleBankUpdate
            }}
          >
            <aside className='user-profile__info'>
              <div className='user-profile__info__avater'>
                <div className='avatar-container'>
                  <img src={preview} alt='Profile Avatar' className='avatar' />
                  <div className='verified-badge'>
                    <input
                      type='file'
                      name='image'
                      id='avater'
                      onChange={handleFileChange}
                    />
                    <label htmlFor='avater'>
                      {/* SVG unchanged */}
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                      >
                        <path
                          d='M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13'
                          stroke='#1B2124'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <path
                          d='M16.0418 3.02001L8.16183 10.9C7.86183 11.2 7.56183 11.79 7.50183 12.22L7.07183 15.23C6.91183 16.32 7.68183 17.08 8.77183 16.93L11.7818 16.5C12.2018 16.44 12.7918 16.14 13.1018 15.84L20.9818 7.96001C22.3418 6.60001 22.9818 5.02001 20.9818 3.02001C18.9818 1.02001 17.4018 1.66001 16.0418 3.02001Z'
                          stroke='#1B2124'
                          strokeWidth='1.5'
                          strokeMiterlimit='10'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </label>
                  </div>
                </div>

                <div className='profile-info'>
                  <h1 className='profile-name'>{user?.name}</h1>
                  <p className='profile-username d-none'>@sobuz8464</p>
                </div>
              </div>
              <ul className='user-profile__info__menu list-unstyled'>
                <Link href='/dashboard/profile/'>
                  <li className='user-profile__info__menu__item'>
                    User Profile information
                  </li>
                </Link>

                <Link href='/dashboard/profile/bank'>
                  <li className='user-profile__info__menu__item'>
                    User Bank information
                  </li>
                </Link>
                <Link href='/dashboard/profile/change-password'>
                  <li className='user-profile__info__menu__item '>
                    Change password
                  </li>
                </Link>

                <li className='user-profile__info__menu__item mt-3'>
                  Delete your account
                </li>
              </ul>
            </aside>

            <div className='user-profile__contact'>
              <div className='user-profile__top'>
                <h3 className='user-profile__contact__title'>
                  Update Password
                </h3>

                <div>
                  <button
                    type='button'
                    className='commerce-btn'
                    onClick={() => setEditMode((prev) => !prev)}
                  >
                    <i className='icon-edit-2'></i>{" "}
                    {editMode ? "Cancel" : "Change Password"}
                  </button>

                  {editMode && (
                    <button
                      type='button'
                      className='commerce-btn'
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  )}
                </div>
              </div>

              <div className='user-profile__group'>
                <div className='user-profile__group__item'>
                  <label htmlFor='currentPassword'>Current Password</label>
                  <input
                    type='password'
                    name='currentPassword'
                    id='currentPassword'
                    value={form.currentPassword}
                    onChange={handleChange}
                    readOnly={!editMode}
                    autoComplete='current-password'
                  />
                </div>

                <div className='user-profile__group__item'>
                  <label htmlFor='newPassword'>New Password</label>
                  <input
                    type='password'
                    name='newPassword'
                    id='newPassword'
                    value={form.newPassword}
                    onChange={handleChange}
                    readOnly={!editMode}
                    autoComplete='new-password'
                  />
                </div>

                <div className='user-profile__group__item'>
                  <label htmlFor='confirmPassword'>Confirm New Password</label>
                  <input
                    type='password'
                    name='confirmPassword'
                    id='confirmPassword'
                    value={form.confirmPassword}
                    onChange={handleChange}
                    readOnly={!editMode}
                    autoComplete='new-password'
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
