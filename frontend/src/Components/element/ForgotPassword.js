import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";
import HTMLReactParser from "html-react-parser";
import ApiKey from "../api/ApiKey";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [t, i18n] = useTranslation("global");

  const [errors, setErrors] = useState({
    email: "",
  });

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  let captchaKey = Cookies.get("captchaKey");
  const tokenKey = Cookies.get("tokenClient");
  const currentLanguage = Cookies.get("selectedLanguage") || "en";

  const navigate = useNavigate();

  const [hoverColor, setHoverColor] = useState(false);

  const handleMouseEnter = () => {
    setHoverColor(true);
  };

  const handleMouseLeave = () => {
    setHoverColor(false);
  };

  const [pageContent, setPageContent] = useState([]);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(BaseApi + `/users/apps_forgotPassword`);
      setLoading(false);
      setPageContent(response.data.response);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get data of benefit page");
    }
  };

  useEffect(() => {
    // getData();
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
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const newErrors = {};

      if (formData.email === "") {
        newErrors.email = t("forgotPassword.emailRequired");
      } else if (!isValidEmail(formData.email)) {
        newErrors.email = t("forgotPassword.invalidEmail");
      }

    //   if (!isCaptchaVerified) {
    //     newErrors.captcha = "Please verify captcha";
    //   }

      setErrors(newErrors);

      // Function to validate email format
      function isValidEmail(email) {
        // Use a regular expression to validate email format
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
      }

      if (Object.keys(newErrors).length === 0) {
        // if (isCaptchaVerified) {
          setLoading(true);

          const updatedData = {
            ...formData,
            language: currentLanguage
          }
          const response = await axios.post(
            BaseApi + "/users/forgotPassword",
            updatedData,
            {
                headers: {
                  "Content-Type": "application/json",
                  key: ApiKey,
                  token: tokenKey,
                },
              }
          );
          setLoading(false);
          // console.log("yaha")
          if (response.data.status === 200) {
            navigate(window.history.back());
            Swal.fire({
              title: response.data.message,
              icon: "success",
              confirmButtonText: t("forgotPassword.close"),
            });
            
          } else if (response.data.status === 500) {
            Swal.fire({
              title: response.data.message,
              icon: "error",
              confirmButtonText: t("forgotPassword.close"),
            });
          } else {
            Swal.fire({
              title: response.data.message,
              icon: "warning",
              confirmButtonText: t("forgotPassword.close"),
            });
          }
        }
    //   }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: t("forgotPassword.failedTitle"),
        text: t("forgotPassword.failedTxt"),
        icon: "error",
        confirmButtonText: t("forgotPassword.close"),
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
              <h1 className="">{t("forgotPassword.forgotPassword")}</h1>
              <h6 className="text-muted fw-normal">
                {" "}
                <Link to="/" style={{ color: "grey" }}>
                  {t("forgotPassword.home")}
                </Link>{" "}
                /{t("forgotPassword.forgotPassword")}
                {/* /{pageContent.static_page_title} */}
              </h6>
            </div>
            <div className="container">
              <div className="row">
                <div className="card forgotPasswordCard">
                  <div className="card-body">
                    <h2 className="text-center pb-4 pt-2">
                      {t("forgotPassword.forgot")}
                      <span className="textGradient">
                        {" "}
                        <span className="SubHaddingTxt"> {t("forgotPassword.password")}</span>
                      </span>
                    </h2>
                    <p className="forgotPasswordProcessTxt">
                      {t("forgotPassword.text1")}
                    </p>
                    <form>
                      <div className="mb-2">
                        <input
                          type="email"
                          className={`form-control ${
                            errors.email && "input-error"
                          }`}
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          name="email"
                          value={formData.email}
                          placeholder={t("forgotPassword.emailAddress")}
                          onChange={handleChange}
                        />
                        {errors.email && (
                          <div className="text-danger">{errors.email}</div>
                        )}
                      </div>
                      <p className="forgotPasswordReturnLogin text-muted">
                        {t("forgotPassword.text2")}{" "}
                        <Link onClick={() => window.history.back()}>
                          {t("forgotPassword.loginPage")}
                        </Link>
                      </p>

                      {/* <div className="reCaptchaLogin mb-4">
                        <ReCAPTCHA
                          sitekey={captchaKey}
                          // sitekey="6Ld8bV8nAAAAAEp24xWlKsVFhVDYlBctFF50MI1x"
                          onChange={(value) => setIsCaptchaVerified(value)}
                        />
                        {errors.captcha && (
                          <div className="text-danger">{errors.captcha}</div>
                        )}
                      </div> */}
                      <button
                        type="submit"
                        className="btn w-100 mt-4 mb-3"
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
                        {t("forgotPassword.submitButton")}
                      </button>
                    </form>
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

export default ForgotPassword;
