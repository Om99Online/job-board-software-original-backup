import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";
import HTMLReactParser from "html-react-parser";
import { useTranslation } from "react-i18next";

const CareerTools = () => {
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
  const [loading, setLoading] = useState(false);
  const [t, i18n] = useTranslation("global");
  const recaptchaLanguage = Cookies.get("selectedLanguage");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const currentLanguage = Cookies.get("selectedLanguage") || "en";

  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  let captchaKey = Cookies.get("captchaKey");

  const [hoverColor, setHoverColor] = useState(false);

  const handleMouseEnter = () => {
    setHoverColor(true);
  };

  const handleMouseLeave = () => {
    setHoverColor(false);
  };

  const [pageContent, setPageContent] = useState([]);
  const [recaptchaKey, setRecaptchaKey] = useState(captchaKey);
  const [recaptchaVisible, setRecaptchaVisible] = useState(true);


  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/page/staticpage/career-tools`,
        { language: currentLanguage }
      );
      setLoading(false);
      setPageContent(response.data.response);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get data of career tools page");
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
        newErrors.email = t("messageForm.invalidEmail");
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
          const response = await axios.post(
            BaseApi + "/page/contact-us",
            formData
          );
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
      Swal.fire({
        title: t("messageForm.messageFailedTitle"),
        text: t("messageForm.messageFailedTxt"),
        icon: "error",
        confirmButtonText: t("messageForm.close"),
      });
    }
    console.log(formData);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <NavBar />
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <div className="privacyPolicy">
            <div className="text-center PPSection1">
              <h1 className="">{pageContent.page_title}</h1>
              <h6 className="text-muted fw-normal">
                {" "}
                <Link to="/" style={{ color: "grey" }}>
                  {t("navHeaders.home")}
                </Link>{" "}
                /{pageContent.page_title}
              </h6>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <div className="upperPart">
                    <p>
                      {pageContent.page_description &&
                        HTMLReactParser(pageContent.page_description)}
                    </p>

                    {/* <p className="mt-4">
                      We build products to connect tech professionals with the
                      careers they desire and employer with the talent the need
                      .Passion for helping people thrive drives all of our 500+
                      employees worldwide spanning Des Moines,New
                      York,London,Singapor,HongKong,UK...etc
                    </p>
                    <p className="mt-4">
                      1. After registering and loging into the app you can
                      access access application functioanlities from dashbaord
                      or by the side menu.
                    </p> */}
                    {/* <p className="mt-2">
                      2. After posting a job all the filtered candidates will be
                      notified.
                    </p>
                    <p className="mt-2">
                      3. When any user will apply on any job, you will be
                      notified through the app.
                    </p>
                    <p className="mt-2">
                      4. You can check the list of all the candidates and can
                      change the status of there application status from the
                      app.
                    </p> */}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h2 className="text-center pb-4 pt-2">
                        {t("messageForm.sendusa")}
                        <span className="textGradient">
                          {" "}
                          <span className="SubHaddingTxt">
                            {" "}
                            {t("messageForm.message")}
                          </span>
                        </span>
                      </h2>
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
                            placeholder={t("messageForm.namePlaceholder")}
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
                            placeholder={t("messageForm.emailPlaceholder")}
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
                            <option>
                              {t("messageForm.selectPlaceholder")}
                            </option>
                            <option value="1">
                              {t("messageForm.messageFormSelectOption1")}
                            </option>
                            <option value="2">
                              {t("messageForm.messageFormSelectOption2")}
                            </option>
                            <option value="3">
                              {t("messageForm.messageFormSelectOption3")}
                            </option>
                            <option value="3">
                              {t("messageForm.messageFormSelectOption4")}
                            </option>
                            <option value="3">
                              {t("messageForm.messageFormSelectOption5")}
                            </option>
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
                            rows="5"
                            name="message"
                            value={formData.message}
                            placeholder={t("messageForm.descPlaceholder")}
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
                            // sitekey="6Ld8bV8nAAAAAEp24xWlKsVFhVDYlBctFF50MI1x"
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
                          {t("messageForm.sendMessageButton")}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default CareerTools;
