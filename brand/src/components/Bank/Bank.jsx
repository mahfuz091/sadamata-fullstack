"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { CountrySelect } from "react-country-state-city";
import {
  updateUserInfo,
  updateUserAddressProfileImageFile,
  updateMerchantBankInfo,
} from "@/app/actions/auth/userAddressActions"; // keep your existing user update

import { useRouter } from "next/navigation";
import Link from "next/link";
import ProfileImageUploader from "../Profile/ProfileImageUploader";

const Bank = ({ user, countries, profileImageUrl }) => {
  const [editMode, setEditMode] = useState(false);
  const [phoneValue, setPhoneValue] = useState(user?.brand?.contactPhone || "");
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (user?.brand?.country) {
      const matched = countries.find((c) => c.name === user.brand.country);
      setCountry(matched);
    }
  }, [user, countries]);

  const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(
     profileImageUrl || "/assets/images/resources/avater.png"
   );
   useEffect(() => {
     if (profileImageUrl) setPreview(profileImageUrl);
   }, [profileImageUrl]);

  const [formData, setFormData] = useState({
    bankName: user?.brand?.bankName || "",
    bankBranch: user?.brand?.bankBranch || "",
    accountName: user?.brand?.accountName || "",
    accountNumber: user?.brand?.accountNumber || "",
    routingNumber: user?.brand?.routingNumber || "",
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
        user?.id,
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Existing update handler (personal info)
  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateUserInfo(user.id, {
        ...formData,
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth)
          : null,
        phone: phoneValue,
        country: country?.name || "",
      });
      toast.success("Profile updated successfully!");
      setEditMode(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
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
            className='user-form'
            onSubmit={(e) => {
              e.preventDefault();
              // If editMode and bank fields are visible, you may want to call handleBankUpdate
            }}
          >
            <aside className='user-profile__info'>
             <ProfileImageUploader userId={user.id} initialUrl={preview} />
              <ul className='user-profile__info__menu list-unstyled'>
                <Link href='/dashboard/profile/'>
                  <li className='user-profile__info__menu__item'>
                    User Profile information
                  </li>
                </Link>

                <Link href='/dashboard/profile/bank'>
                  <li className='user-profile__info__menu__item active'>
                    User Bank information
                  </li>
                </Link>
                <Link href='/dashboard/profile/change-password'>
                  <li className='user-profile__info__menu__item '>
                    Change password
                  </li>
                </Link>

               <Link href='/dashboard'>
                  <li className='user-profile__info__menu__item mt-3'>
                    Back To Dashboard
                  </li>
                </Link>
              </ul>
            </aside>

            <div className='user-profile__contact'>
              <div className='user-profile__top'>
                <h3 className='user-profile__contact__title'>
                  User Personal Information
                </h3>
                <div>
                  <button
                    type='button'
                    className='commerce-btn'
                    onClick={() => setEditMode((prev) => !prev)}
                  >
                    <i className='icon-edit-2'></i>{" "}
                    {editMode ? "Cancel" : "Edit Profile"}
                  </button>

                  {/* Show separate Update buttons for personal info and bank info */}
                  {editMode && (
                    <>
                      <button
                        type='button'
                        className='commerce-btn'
                        onClick={handleBankUpdate}
                        disabled={loading}
                      >
                        {loading ? "Updating..." : "Update Bank Info"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className='user-profile__group'>
                {/* BANK FIELDS - unchanged classes */}
                <div className='user-profile__group__item'>
                  <label htmlFor='bankName'>Bank Name</label>
                  <input
                    type='text'
                    name='bankName'
                    id='bankName'
                    value={formData.bankName}
                    onChange={handleChange}
                    readOnly={!editMode}
                  />
                </div>

                <div className='user-profile__group__item'>
                  <label htmlFor='bankBranch'>Bank Branch</label>
                  <input
                    type='text'
                    name='bankBranch'
                    id='bankBranch'
                    value={formData.bankBranch}
                    onChange={handleChange}
                    readOnly={!editMode}
                  />
                </div>

                <div className='user-profile__group__item'>
                  <label htmlFor='accountName'>Account Name</label>
                  <input
                    type='text'
                    name='accountName'
                    id='accountName'
                    value={formData.accountName}
                    onChange={handleChange}
                    readOnly={!editMode}
                  />
                </div>

                <div className='user-profile__group__item'>
                  <label htmlFor='accountNumber'>Account Number</label>
                  <input
                    type='text'
                    name='accountNumber'
                    id='accountNumber'
                    value={formData.accountNumber}
                    onChange={handleChange}
                    readOnly={!editMode}
                  />
                </div>

                <div className='user-profile__group__item'>
                  <label htmlFor='routingNumber'>Routing Number</label>
                  <input
                    type='text'
                    name='routingNumber'
                    id='routingNumber'
                    value={formData.routingNumber}
                    onChange={handleChange}
                    readOnly={!editMode}
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

export default Bank;
