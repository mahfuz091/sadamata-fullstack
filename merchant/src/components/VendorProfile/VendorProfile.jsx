import React from 'react';

const VendorProfile = () => {
    return (
        <section className="brand-register">
      <div className="container">
        <form action="#" className="form-one">
          <h2 className="brand-register__title">Creator Information</h2>
          <div className="row gutter-y-30">

            {/* Personal Information */}
            <div className="col-12">
              <div className="brand-register__item">
                <h4 className="brand-register__item__title">Personal Information</h4>
                <div className="form-one__group">
                  <div className="form-one__control">
                    <label htmlFor="full-name">Full name</label>
                    <input type="text" name="full-name" id="full-name" placeholder="Your full name" />
                  </div>
                  <div className="form-one__control">
                    <label htmlFor="birth-yard">Date of birth</label>
                    <input type="text" name="birth-yard" id="birth-yard" placeholder="Your birthday" />
                  </div>
                  <div className="form-one__control">
                    <label htmlFor="email">Email address</label>
                    <input type="email" name="email" id="email" placeholder="Enter your profile link" />
                  </div>
                  <div className="form-one__control">
                    <label htmlFor="call">Phone number</label>
                    <input type="number" name="call" id="call" placeholder="Your phone number" />
                  </div>
                  <div className="form-one__control">
                    <label htmlFor="nid-number">NID/Passport number</label>
                    <input type="text" name="nid-number" id="nid-number" placeholder="your NID or passport number" />
                  </div>
                  <div className="form-one__control">
                    <label htmlFor="present-address">Present address</label>
                    <input type="text" name="present-address" id="present-address" placeholder="Your full address" />
                  </div>
                  <div className="form-one__control">
                    <label htmlFor="permanent-address">Permanent address</label>
                    <input type="text" name="permanent-address" id="permanent-address" placeholder="Your full address" />
                  </div>
                  <div className="form-one__control">
                    <label htmlFor="portfolio-link">Your portfolio link (If you have it)</label>
                    <input type="text" name="portfolio-link" id="portfolio-link" placeholder="Enter your portfolio" />
                  </div>
                  <div className="form-one__control form-one__control--full">
                    <label htmlFor="web-link">Your website (If you have it)</label>
                    <input type="text" name="web-link" id="web-link" placeholder="Enter your website link" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Information */}
            <div className="col-12">
              <div className="brand-register__item">
                <h4 className="brand-register__item__title">Add Your Bank Account</h4>
                <div className="form-one__group">
                  <div className="form-one__control">
                    <label htmlFor="bank-name">What is your bank name?</label>
                    <select className="selectpicker" name="bank-name" id="bank-name" aria-label="Select your bank">
                      <option defaultValue="">Select your bank</option>
                      <option value="DBBL">DBBL</option>
                      <option value="Sonali Bank">Sonali Bank</option>
                      <option value="Jamuna Bank">Jamuna Bank</option>
                    </select>
                  </div>
                  <div className="form-one__control">
                    <label htmlFor="branch-name">Where is the bank located?</label>
                    <select className="selectpicker" name="branch-name" id="branch-name" aria-label="Enter your branch name">
                      <option defaultValue="">Enter your branch name</option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Pabna">Pabna</option>
                    </select>
                  </div>
                </div>
                <div className="form-one__group-two">
                  <div className="form-one__control">
                    <label htmlFor="account-name">Account Name</label>
                    <input type="text" name="account-name" id="account-name" placeholder="Your full name" />
                  </div>
                  <div className="form-one__control">
                    <label htmlFor="account-number">Account number</label>
                    <input type="text" name="account-number" id="account-number" placeholder="Your account number" />
                  </div>
                  <div className="form-one__control form-one__control--full">
                    <label htmlFor="routing-number">Routing number</label>
                    <input type="text" name="routing-number" id="routing-number" placeholder="Routing number" />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="col-12">
              <div className="brand-register__item">
                <h4 className="brand-register__item__title">Additional Information</h4>
                <div className="form-one__group">
                  <div className="form-one__control form-one__control--full">
                    <label htmlFor="message">Your Message</label>
                    <textarea name="message" id="message" placeholder="Write your message"></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="col-12">
              <div className="brand-register__btn text-end">
                <button type="submit" className="commerce-btn">
                  Send Request <i className="icon-right-arrow"></i>
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </section>
    );
};

export default VendorProfile;