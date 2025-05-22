import React, { useEffect, useState } from "react";
import NavBar from "../element/NavBar";
import Footer from "../element/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ReCAPTCHA from "react-google-recaptcha";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const [contactData, setContactData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [t, i18n] = useTranslation("global")


  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  let captchaKey = Cookies.get("captchaKey");
  const recaptchaLanguage = Cookies.get("selectedLanguage");

  const [hoverColor, setHoverColor] = useState(false);

  const handleMouseEnter = () => {
    setHoverColor(true);
  };

  const handleMouseLeave = () => {
    setHoverColor(false);
  };
  const [recaptchaKey, setRecaptchaKey] = useState(captchaKey);
  const [recaptchaVisible, setRecaptchaVisible] = useState(true);

  const handleRecaptchaReset = () => {
    setRecaptchaVisible(false);
    setRecaptchaKey(generateRecaptchaKey());
    setTimeout(() => {
      setRecaptchaVisible(true);
    }, 0); // Using setTimeout to unmount and then mount the ReCAPTCHA
  };

  const generateRecaptchaKey = () => {
    return Math.random().toString(36).substring(2, 15);
  };
  const getData = async () => {
    try {
      const response = await axios.get(BaseApi + `/page/contact-us`);
      setContactData(response.data.response.contact_details);
    } catch (error) {
      console.log("Error getting contact information!");
    }
  };
  useEffect(() => {
    getData();
    window.scrollTo(0, 0);
  }, []);

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const newErrors = {};

      if (formData.name === "") {
        newErrors.name = t("messageForm.nameRequired");
      }
      if (formData.email === "") {
        newErrors.email = t("messageForm.emailRequired");
      } else if (!isValidEmail(formData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (formData.subject === "") {
        newErrors.subject = t("messageForm.subjectRequired");
      }
      if (formData.message === "") {
        newErrors.message = t("messageForm.messageRequired");
      }
      if (!isCaptchaVerified) {
        newErrors.captcha = t("messageForm.captchaRequired");
      }

      setErrors(newErrors);

      // Function to validate email format
      function isValidEmail(email) {
        // Use a regular expression to validate email format
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
      }

      if (Object.keys(newErrors).length === 0) {
        if (isCaptchaVerified) {
          setLoading(true);
          const response = await axios.post(
            BaseApi + "/page/contact-us",
            formData
          );
          setLoading(false);
           // Reset the reCAPTCHA
           handleRecaptchaReset();
          if (response.data.status === 200) {
            Swal.fire({
              title: t("messageForm.messageSuccessTitle"),
              icon: "success",
              confirmButtonText: t("messageForm.close"),
            });
            setFormData({
              ...formData,
              name: "",
              email: "",
              subject: "",
              message: "",
            });
          } else if (response.data.status === 500) {
            Swal.fire({
              title: response.data.message,
              icon: "error",
              confirmButtonText: t("messageForm.close"),
            });
          } else {
            Swal.fire({
              title: response.data.message,
              icon: "error",
              confirmButtonText: t("messageForm.close"),
            });
          }
        }
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: t("messageForm.messageFailedTitle"),
        text: t("messageForm.messageFailedTxt"),
        icon: "error",
        confirmButtonText: t("messageForm.close"),
      });
    }
    console.log(formData);
  };

  return (
    <>
      <div className="contactUs">
        <NavBar />
        {loading ? (
          <div className="loader-container"></div>
        ) : (
          <>
            <div className="ContactSection1 text-center">
              <h1>{t("navHeaders.contactus")}</h1>
              <h6 className="text-muted fw-normal">
                {" "}
                <Link to="/" style={{ color: "grey" }}>
                {t("navHeaders.home")}
                </Link>{" "}
                /{t("navHeaders.contactus")}
              </h6>
            </div>
            <div className="ContactSection3 container mt-3">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="contactInfo">
                    <div className="card mb-3 mt-3">
                      <div className="card-body">
                        {/* <div className="ContactTopHadding">
                          <p className="h4 card-title">{t("contactPage.header1")}</p>
                          <p className="card-body">
                          {t("contactPage.header2.1")}{" "}
                            <br></br>
                            {t("contactPage.header2.2")}
                          </p>
                        </div> */}
                        <div className="row">
                          <div className="ContactDetails col-sm-12">
                            <i>
                              <img src="/Images/email-icon.png" alt="" />
                            </i>
                            <div className="ContactDetailsBx">
                              <strong>{t("contactPage.contactEmail")}:</strong>
                              <span> {contactData.email}</span>
                            </div>
                          </div>
                          <div className="ContactDetails col-sm-12">
                            <i>
                              <img src="/Images/call-icon.png" alt="" />
                            </i>
                            <div className="ContactDetailsBx">
                              <strong>{t("contactPage.contactPhone")}: </strong>
                              <span> {contactData.contact}</span>
                            </div>
                          </div>
                          <div className="ContactDetails col-sm-12">
                            <i>
                              <img src="/Images/location-icon.png" alt="" />
                            </i>
                            <div className="ContactDetailsBx">
                              <strong>{t("contactPage.contactLocation")}:</strong>{" "}
                              <span> {contactData.address}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="ContactForm">
                    <form>
                      <div className="mb-4">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.name && "input-error"
                          }`}
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          name="name"
                          value={formData.name}
                          placeholder={t("faq.namePlaceholder")}
                          onChange={handleChange}
                        />
                        {errors.name && (
                          <div className="text-danger">{errors.name}</div>
                        )}
                      </div>
                      <div className="mb-4">
                        <input
                          type="email"
                          className={`form-control ${
                            errors.email && "input-error"
                          }`}
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          name="email"
                          value={formData.email}
                          placeholder={t("faq.emailPlaceholder")}
                          onChange={handleChange}
                        />
                        {errors.email && (
                          <div className="text-danger">{errors.email}</div>
                        )}
                      </div>
                      <div className="mb-4">
                        <select
                          className={`form-select ${
                            errors.subject && "input-error"
                          }`}
                          aria-label="Default select example"
                          value={formData.subject}
                          name="subject"
                          onChange={handleChange}
                        >
                          <option>{t("faq.selectPlaceholder")}</option>
                        <option value="1">{t("faq.messageFormSelectOption1")}</option>
                        <option value="2">{t("faq.messageFormSelectOption2")}</option>
                        <option value="3">{t("faq.messageFormSelectOption3")}</option>
                        <option value="3">{t("faq.messageFormSelectOption4")}</option>
                        <option value="3">{t("faq.messageFormSelectOption5")}</option>
                        </select>
                        {errors.subject && (
                          <div className="text-danger">{errors.subject}</div>
                        )}
                      </div>
                      <div className="mb-4">
                        <textarea
                          className={`form-control ${
                            errors.message && "input-error"
                          }`}
                          id="exampleFormControlTextarea1"
                          rows="3"
                          name="message"
                          value={formData.message}
                          placeholder={t("faq.descPlaceholder")}
                          onChange={handleChange}
                        ></textarea>
                        {errors.message && (
                          <div className="text-danger">{errors.message}</div>
                        )}
                      </div>
                      <div className="reCaptchaLogin mb-4">
                        <ReCAPTCHA
                        key={recaptchaKey}
                          sitekey={captchaKey}
                          hl={recaptchaLanguage}
                          onChange={(value) => setIsCaptchaVerified(value)}
                        />
                        {errors.captcha && (
                          <div className="text-danger">{errors.captcha}</div>
                        )}
                      </div>
                      <button
                        type="submit"
                        className="btn w-100"
                        onClick={handleClick}
                        style={{
                          backgroundColor: `${
                            secondaryColor &&
                            (hoverColor ? secondaryColor : primaryColor)
                          }`,
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        {/* SEND MESSAGE */}
                        {t("faq.sendMessageButton")}
                      </button>
                    </form>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="MapIfream">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50470.0761220329!2d-122.47879945360117!3d37.757692829126256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2sin!4v1700197119524!5m2!1sen!2sin"
                      width="600"
                      height="450"
                      style={{ border: "0" }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </>
        )}
      </div>
    </>
  );
};

export default Contact;
