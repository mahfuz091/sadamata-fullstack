'use client'
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CountrySelect, GetCountries } from 'react-country-state-city';
import { updateUserAddressProfileImageFile, updateUserInfo } from '@/app/actions/auth/userAddressActions';

const Profile = ({ user, countries }) => {
  const [editMode, setEditMode] = useState(false);
  const [phoneValue, setPhoneValue] = useState(user?.merchantProfile?.contactPhone || '');
  const [country, setCountry] = useState(null);
// console.log(country, 'country');

useEffect(() => {
  


  if (user?.merchantProfile?.country) {
    const matched = countries.find(
      (c) => c.name === user.merchantProfile.country
    );
    // console.log(matched, 'matched');
    
    setCountry(matched);
  }
}, [user, countries]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.addresses[0]?.profileImage || '/assets/images/resources/avater.png');
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || user.addresses[0].email || '',
    dateOfBirth: user.merchantProfile?.dateOfBirth ? formatDateForInput(user.merchantProfile.dateOfBirth) : '',
    address: user.merchantProfile?.permanentAddress || '',
    zipCode: user.merchantProfile?.zipCode || '',
  });
  const [loading, setLoading] = useState(false);

  function formatDateForInput(date) {
    if (!date) return '';
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setPreview(URL.createObjectURL(selectedFile));
    setFile(selectedFile);

    try {
      const updated = await updateUserAddressProfileImageFile(user.addresses[0].id, selectedFile);
      setPreview(updated.profileImage);
      toast.success('Profile image updated!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateUserInfo(user.id, {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
        phone: phoneValue,
        country: country.name,
      });
      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    }
    setLoading(false);
  };

  return (
    <section className="user-profile">
      <div className="container">
        <div className="user-profile-top__text-box">
          <h2 className="user-profile-top__title">Profile Settings</h2>
          <p className="user-profile-top__text">Customize your personal profile data.</p>
        </div>

        <div className="user-profile__form">
          <form className="user-form" onSubmit={(e) => e.preventDefault()}>
            <aside className="user-profile__info">
              <div className="user-profile__info__avater">
                <div className="avatar-container">
                  <img src={preview} alt="Profile Avatar" className="avatar" />
                  <div className="verified-badge">
                    <input type="file" name="image" id="avater" onChange={handleFileChange} />
                    <label htmlFor="avater">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#1B2124" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16.0418 3.02001L8.16183 10.9C7.86183 11.2 7.56183 11.79 7.50183 12.22L7.07183 15.23C6.91183 16.32 7.68183 17.08 8.77183 16.93L11.7818 16.5C12.2018 16.44 12.7918 16.14 13.1018 15.84L20.9818 7.96001C22.3418 6.60001 22.9818 5.02001 20.9818 3.02001C18.9818 1.02001 17.4018 1.66001 16.0418 3.02001Z" stroke="#1B2124" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </label>
                  </div>
                </div>

                <div className="profile-info">
                  <h1 className="profile-name">{user?.name}</h1>
                  <p className="profile-username d-none">@sobuz8464</p>
                </div>
              </div>
              <ul className="user-profile__info__menu list-unstyled">
                <li className="user-profile__info__menu__item">User Profile information</li>
                <li className="user-profile__info__menu__item d-none">Change password</li>
                <li className="user-profile__info__menu__item">Delete your account</li>
              </ul>
            </aside>

            <div className="user-profile__contact">
              <div className="user-profile__top">
                <h3 className="user-profile__contact__title">User Personal Information</h3>
                <div>
                    <button
                  type="button"
                  className="commerce-btn"
                  onClick={() => setEditMode((prev) => !prev)}
                >
                  <i className="icon-edit-2"></i> {editMode ? 'Cancel' : 'Edit Profile'}
                </button>
                {editMode && (
                  <button type="button" className="commerce-btn" onClick={handleUpdate} disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                )}
                </div>
              </div>

              <div className="user-profile__group">
                <div className="user-profile__group__item">
                  <label htmlFor="name">Name</label>
                  
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} readOnly={!editMode}  />
                  
                </div>

                <div className="user-profile__group__item">
                  <label htmlFor="email">Email</label>
                  
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange}  readOnly/>
                  
                </div>

                <div className="user-profile__group__item">
                  <label htmlFor="phone">Phone Number</label>
              
                    <input
                      type="text"
                      name="phone"
                      value={phoneValue}
                      onChange={(e) => setPhoneValue(e.target.value)} readOnly={!editMode}
                    />
                 
                </div>

                <div className="user-profile__group__item">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  
                    <input type="date" name="dateOfBirth" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} readOnly={!editMode}/>
                  
                </div>

                <div className="user-profile__group__item">
                  <label htmlFor="country">Country</label>
                 
                    <CountrySelect  value={country} onChange={setCountry} placeHolder="Select Country" />
                  
                </div>

                <div className="user-profile__group__item">
                  <label htmlFor="address">Full Address</label>
                
                    <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} readOnly={!editMode} />
                  
                </div>

                <div className="user-profile__group__item">
                  <label htmlFor="zipCode">Zip Code</label>
                  
                    <input type="text" name="zipCode" id="zipCode" value={formData.zipCode} onChange={handleChange} readOnly={!editMode}/>
                  
                </div>

                {/* {editMode && (
                  <button type="button" className="commerce-btn mt-3" onClick={handleUpdate} disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                )} */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Profile;
