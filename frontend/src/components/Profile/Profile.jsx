'use client'
import React, { useState } from 'react';
import {
  CitySelect,
  CountrySelect,
  StateSelect,
  PhonecodeSelect,
} from "react-country-state-city";


const Profile = () => {
     const [phoneValue, setPhoneValue] = useState("");
  const [phonecode, setPhonecode] = useState(null);
  const [country, setCountry] = useState(null);
  const [currentState, setCurrentState] = useState(null);
  const [currentCity, setCurrentCity] = useState(null);
    return (
       <section class="user-profile">
    <div class="container">
        <div class="user-profile-top__text-box">
            <h2 class="user-profile-top__title">Profile Settings</h2>
            <p class="user-profile-top__text">Customize your personal profile data.</p>
        </div>
        <div class="user-profile__form">
            <form action="#" class="user-form">
                <aside class="user-profile__info">
                    <div class="user-profile__info__avater">
                        <div class="avatar-container">
                            <img src="/assets/images/resources/avater.png" alt="Profile Avatar" class="avatar"/>
                            <div class="verified-badge">
                                <input type="file" name="image" id="avater"/>
                                <label for="avater">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#1B2124" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M16.0418 3.02001L8.16183 10.9C7.86183 11.2 7.56183 11.79 7.50183 12.22L7.07183 15.23C6.91183 16.32 7.68183 17.08 8.77183 16.93L11.7818 16.5C12.2018 16.44 12.7918 16.14 13.1018 15.84L20.9818 7.96001C22.3418 6.60001 22.9818 5.02001 20.9818 3.02001C18.9818 1.02001 17.4018 1.66001 16.0418 3.02001Z" stroke="#1B2124" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M14.9102 4.15002C15.5802 6.54002 17.4502 8.41002 19.8502 9.09002" stroke="#1B2124" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </label>
                            </div>
                        </div>
                        
                        <div class="profile-info">
                            <h1 class="profile-name">Sobuz Miah</h1>
                            <p class="profile-username">@sobuz8464</p>
                        </div>
                    </div>
                    <ul class="user-profile__info__menu list-unstyled">
                        <li class="user-profile__info__menu__item"><span class="menu-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#585D64" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M19.211 15.74L15.671 19.2801C15.531 19.4201 15.401 19.68 15.371 19.87L15.181 21.22C15.111 21.71 15.451 22.05 15.941 21.98L17.291 21.79C17.481 21.76 17.751 21.63 17.881 21.49L21.421 17.95C22.031 17.34 22.321 16.63 21.421 15.73C20.531 14.84 19.821 15.13 19.211 15.74Z" stroke="#585D64" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M18.6992 16.25C18.9992 17.33 19.8392 18.17 20.9192 18.47" stroke="#585D64" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M3.41016 22C3.41016 18.13 7.26018 15 12.0002 15C13.0402 15 14.0402 15.15 14.9702 15.43" stroke="#585D64" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span> User Profile information</li>
                        <li class="user-profile__info__menu__item"><span class="menu-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 8.6775H17.6025V6.3525C17.6025 4.86662 17.0122 3.44161 15.9616 2.39093C14.9109 1.34026 13.4859 0.75 12 0.75C10.5141 0.75 9.08911 1.34026 8.03843 2.39093C6.98776 3.44161 6.3975 4.86662 6.3975 6.3525V8.6775H6C5.20435 8.6775 4.44129 8.99357 3.87868 9.55618C3.31607 10.1188 3 10.8819 3 11.6775V20.25C3 21.0456 3.31607 21.8087 3.87868 22.3713C4.44129 22.9339 5.20435 23.25 6 23.25H18C18.7956 23.25 19.5587 22.9339 20.1213 22.3713C20.6839 21.8087 21 21.0456 21 20.25V11.6775C21 10.8819 20.6839 10.1188 20.1213 9.55618C19.5587 8.99357 18.7956 8.6775 18 8.6775ZM7.8975 6.3525C7.8975 5.81375 8.00361 5.28028 8.20978 4.78254C8.41595 4.2848 8.71814 3.83255 9.09909 3.45159C9.48005 3.07064 9.9323 2.76845 10.43 2.56228C10.9278 2.35611 11.4613 2.25 12 2.25C12.5387 2.25 13.0722 2.35611 13.57 2.56228C14.0677 2.76845 14.52 3.07064 14.9009 3.45159C15.2819 3.83255 15.584 4.2848 15.7902 4.78254C15.9964 5.28028 16.1025 5.81375 16.1025 6.3525V8.6775H7.8975V6.3525ZM19.5 20.25C19.5 20.6478 19.342 21.0294 19.0607 21.3107C18.7794 21.592 18.3978 21.75 18 21.75H6C5.60218 21.75 5.22064 21.592 4.93934 21.3107C4.65804 21.0294 4.5 20.6478 4.5 20.25V11.6775C4.5 11.2797 4.65804 10.8981 4.93934 10.6168C5.22064 10.3355 5.60218 10.1775 6 10.1775H18C18.3978 10.1775 18.7794 10.3355 19.0607 10.6168C19.342 10.8981 19.5 11.2797 19.5 11.6775V20.25Z" fill="#585D64"/>
                                <path d="M11.9997 13.4445C11.7087 13.4445 11.4244 13.5315 11.1831 13.6942C10.9419 13.8569 10.7547 14.0879 10.6456 14.3577C10.5365 14.6275 10.5105 14.9236 10.5708 15.2083C10.6311 15.493 10.7751 15.7531 10.9842 15.9555V17.7337C10.9842 17.9326 11.0632 18.1234 11.2038 18.264C11.3445 18.4047 11.5353 18.4837 11.7342 18.4837H12.2652C12.4641 18.4837 12.6549 18.4047 12.7955 18.264C12.9362 18.1234 13.0152 17.9326 13.0152 17.7337V15.9555C13.2243 15.7531 13.3682 15.493 13.4286 15.2083C13.4889 14.9236 13.4628 14.6275 13.3537 14.3577C13.2446 14.0879 13.0575 13.8569 12.8162 13.6942C12.575 13.5315 12.2907 13.4445 11.9997 13.4445Z" fill="#585D64"/>
                            </svg>
                        </span> Change password</li>
                        <li class="user-profile__info__menu__item"><span class="menu-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M20.25 7.5L19.625 18.132C19.5913 18.705 19.3399 19.2436 18.9222 19.6373C18.5045 20.031 17.952 20.2502 17.378 20.25H6.622C6.04796 20.2502 5.49555 20.031 5.07783 19.6373C4.66011 19.2436 4.40868 18.705 4.375 18.132L3.75 7.5M9.75 11.625L12 13.875M12 13.875L14.25 16.125M12 13.875L14.25 11.625M12 13.875L9.75 16.125M3.375 7.5H20.625C21.246 7.5 21.75 6.996 21.75 6.375V4.875C21.75 4.254 21.246 3.75 20.625 3.75H3.375C2.754 3.75 2.25 4.254 2.25 4.875V6.375C2.25 6.996 2.754 7.5 3.375 7.5Z" stroke="#585D64" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span> Delete your account</li>
                        <li class="user-profile__info__menu__item"><span class="menu-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M17.4414 14.62L20.0014 12.06L17.4414 9.5" stroke="#585D64" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9.76172 12.0601H19.9317" stroke="#585D64" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M11.7617 20C7.34172 20 3.76172 17 3.76172 12C3.76172 7 7.34172 4 11.7617 4" stroke="#585D64" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span> Log out</li>
                    </ul>
                </aside>
                <div class="user-profile__contact">
                    <div class="user-profile__top">
                        <h3 class="user-profile__contact__title">User Personal Information</h3>
                        <a href="#" class="commerce-btn"><i class="icon-edit-2"></i> Edit Profile</a>
                    </div>
                    <div class="user-profile__group">
                        <div class="user-profile__group__item">
                            <label for="first-name">First Name</label>
                            <input type="text" name="first-name" id="first-name" placeholder="Zahidul..|"/>
                        </div>
                        <div class="user-profile__group__item">
                            <label for="last-name">Last Name</label>
                            <input type="text" name="last-name" id="last-name" placeholder="Islam"/>
                        </div>
                        <div class="user-profile__group__item">
                            <label for="date">Date of Birth</label>
                            <input type="date" name="date" id="date" placeholder="09 - 12 - 2025"/>
                        </div>
                        <div class="user-profile__group__item">
                            <label for="email">E-mail</label>
                            <input type="email" name="email" id="email" placeholder="zahidulislam8464@gmail.com"/>
                        </div>
                        <div class="user-profile__group__item">
                            <label for="number">Phone Number</label>
                            <div className='d-flex gap-2'>
                                 <PhonecodeSelect
                          containerClassName='form-group'
                          onChange={(_code) => setPhonecode(_code)}
                          defaultValue={phonecode}
                          placeHolder='Select Phone Code'
                        />
                        <input
                          type='number'
                          
                          placeholder='Phone number'
                          value={phoneValue}
                          onChange={(e) => setPhoneValue(e.target.value)}
                        />
                            </div>
                            
                        </div>
                        <div class="user-profile__group__item">
                            <label for="last-name">Country</label>
<CountrySelect
                        value={country}
                        onChange={(_country) => setCountry(_country)}
                        placeHolder='Select Country'
                      />
                        </div>
                        <div class="user-profile__group__item">
                            <label for="address">Full Address</label>
                            <input type="text" name="address" id="address" placeholder="3517 W. Gray St. Utica, Pennsylvania 57867"/>
                        </div>
                        <div class="user-profile__group__item">
                            <label for="zip">Zip Code</label>
                            <input type="text" name="zip" id="zip" placeholder="78748"/>
                        </div>

                    </div>
                </div>
            </form>
        </div>
    </div>
</section>
    );
};

export default Profile;