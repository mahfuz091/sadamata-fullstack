import React from 'react';
import appleIcon from '@/assets/images/icon/apple.png';
import googlrIcon from '@/assets/images/icon/google.png';
import facebookIcon from '@/assets/images/icon/facebook.png';
import Image from 'next/image';
import Link from 'next/link';

const Login = () => {
    return (
        <section class="login-page">
        <div class="container">
            <div class="login-page__inner">
                <div class="login-page__top">
                    <h4 class="login-page__top__title">Login to the System</h4>
                    <p class="login-page__top__text">Welcome Back! Please Enter Your Details.</p>
                </div>
                <form class="login-page__form">
    
                    <div class="login-page__form-input-box">
                        <input type="email" name="email" placeholder="Your Email or Mobile Number"/>
                        <span class="login-page__form-input-box__icon icon-mail"></span>
                    </div>
                    
                    <div class="login-page__form-input-box">
                        <input type="password" name="password" placeholder="Password*"/>
                        <span class="login-page__form-input-box__icon icon-lock"></span>
                        <i class="toggle-password pass-field-icon fa fa-fw fa-eye-slash"></i>
                    </div>
                    <div class="login-page__checked-box">
                        <div class="login-page__checked-inner">
                            <input type="checkbox" name="save-data" id="save-data"/>
                            <label for="save-data"><span></span>I agree to the Terms & Conditions</label>
                        </div>
                        <div class="login-page__checked-inner">
                            <a href="#">Forgot password</a>
                        </div>
                    </div>
                    <div class="login-page__form-input-box">
                        <button type="submit" class="commerce-btn"><span>Login</span></button>
                    </div>
                </form>
                <div class="login-page__bottom">
                    <span class="login-page__bottom__title">Or, Sign in with</span>
                    <div class="login-page__bottom__social">
                        <a href="https://www.facebook.com/" class="login-page__bottom__social__item"><Image src={facebookIcon} alt="icon"/></a>
                        <a href="http://google.com/" class="login-page__bottom__social__item"><Image src={googlrIcon} alt="icon"/></a>
                        <a href="https://www.apple.com/" class="login-page__bottom__social__item"><Image src={appleIcon} alt="icon"/></a>
                    </div>
                    <p class="login-page__bottom__text">Don't have an account? <Link href="/sign-up">Register</Link></p>
                </div>
            </div>
        </div>
    </section>
    );
};

export default Login;