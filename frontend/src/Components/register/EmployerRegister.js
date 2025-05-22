import React, { useEffect, useState } from "react";
import NavBar from "../element/NavBar";
import Footer from "../element/Footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ReCAPTCHA from "react-google-recaptcha";
import Swal from "sweetalert2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Tooltip } from "@mui/material";
import PasswordStrengthBar from "react-password-strength-bar";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const EmployerRegister = () => {
  const [registerData, setRegisterData] = useState({
    company_name: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    user_type: "recruiter",
  });
  const [errors, setErrors] = useState({
    company_name: "",
    first_name: "",
    last_name: "",
    captcha: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const userType = Cookies.get("user_type");
  const tokenClient = Cookies.get("tokenClient");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [t, i18n] = useTranslation("global");
  const recaptchaLanguage = Cookies.get("selectedLanguage");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const currentLanguage = Cookies.get("selectedLanguage") || "en";

  const [pageChanges, setPageChanges] = useState();
  const [hoverSubmitColor, setHoverSubmitColor] = useState(false);
  const [constantData, setConstantData] = useState([]);

  const handleSubmitMouseEnter = () => {
    setHoverSubmitColor(true);
  };

  const handleSubmitMouseLeave = () => {
    setHoverSubmitColor(false);
  };

  const [hoverResetColor, setHoverResetColor] = useState(false);

  const handleResetMouseEnter = () => {
    setHoverResetColor(true);
  };

  const handleResetMouseLeave = () => {
    setHoverResetColor(false);
  };

  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  let siteLogo = Cookies.get("siteLogo");
  let captchaKey = Cookies.get("captchaKey");
  let siteTitle = Cookies.get("siteTitle");

  // const getData = async () => {
  //   try {
  //     const response = await axios.get(BaseApi + "/getconstant");
  //     setPageChanges(response.data.response.site_logo);
  //     setConstantData(response.data.response);
  //   } catch (error) {
  //     console.log("Error getting navbar logo information!");
  //   }
  // };
  useEffect(() => {
    // getData();
    // window.scrollTo(0, 0);
  }, []);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const newErrors = {};

      if (registerData.company_name === "") {
        newErrors.company_name = t("employerRegister.companyRequired");
        window.scrollTo(0, 0);
      }
      if (registerData.first_name === "") {
        newErrors.first_name = t("employerRegister.firstNameRequired");
        window.scrollTo(0, 0);
      }
      if (registerData.last_name === "") {
        newErrors.last_name = t("employerRegister.lastNameRequired");
        window.scrollTo(0, 0);
      }
      if (registerData.email === "") {
        newErrors.email = t("employerRegister.emailRequired");
        window.scrollTo(0, 0);
      } else if (!isValidEmail(registerData.email)) {
        newErrors.email = t("employerRegister.invalidEmail");
        window.scrollTo(0, 0);
      }
      if (registerData.password === "") {
        newErrors.password = t("employerRegister.passwordRequired");
        window.scrollTo(0, 0);
      }
      if (registerData.confirm_password === "") {
        newErrors.confirm_password = t(
          "employerRegister.confirmPasswordRequired"
        );
        window.scrollTo(0, 0);
      }
      if (registerData.password) {
        if (registerData.password.length < 8) {
          newErrors.password = t("employerRegister.passwordLengthError");
          window.scrollTo(0, 0);
        }
      }
      if (registerData.confirm_password) {
        if (registerData.confirm_password.length < 8) {
          newErrors.confirm_password = t(
            "employerRegister.passwordLengthError"
          );
          window.scrollTo(0, 0);
        }
      }
      if (registerData.confirm_password && registerData.confirm_password) {
        if (registerData.password != registerData.confirm_password) {
          newErrors.confirm_password = t("employerRegister.passwordMatchError");
          window.scrollTo(0, 0);
        }
      }
      if (!isCaptchaVerified) {
        newErrors.captcha = t("employerRegister.captchaRequired");
      }

      setErrors(newErrors);

      // Function to validate email format
      function isValidEmail(email) {
        // Use a regular expression to validate email format
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
      }
      // if(registerData.password.length < 8) {
      //   setErrors({
      //     password: "Please enter atleast 8 characters"
      //   })
      //   return;
      // }
      // if(registerData.confirm_password.length < 8) {
      //   setErrors({
      //     confirm_password: "Please enter atleast 8 characters"
      //   })
      //   return;
      // }
      // if(registerData.password != registerData.confirm_password) {
      //   setErrors({
      //     confirm_password: "Password and confirm password do not match"
      //   })
      //   return;
      // }

      if (Object.keys(newErrors).length === 0) {
        if (isCaptchaVerified) {
          setLoading(true);

          const updatedData = {
            ...registerData,
            language: currentLanguage
          }
          const response = await axios.post(
            BaseApi + "/users/registration",
            updatedData
          );
          console.log(response.data);
          let status = response.data.status;

          if (status === 200) {
            Swal.fire({
              title: t("employerRegister.creationSuccessMessage"),
              icon: "success",
              confirmButtonText: t("employerRegister.close"),
            });
            navigate("/user/employerlogin");
            setIsCaptchaVerified(false);
          } else {
            Swal.fire({
              title: response.data.message,
              confirmButtonText: t("employerRegister.close"),
            });
            setIsCaptchaVerified(false);
          }
          setLoading(false);
          console.log("Request sent successfully");
        }
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: t("employerRegister.failedTitle"),
        text: t("employerRegister.failedMessage"),
        icon: "error",
        confirmButtonText: t("employerRegister.close"),
      });
      setIsCaptchaVerified(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const [showPassword, setShowPassword] = useState(false); // New state variable

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state variable

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleCaptchaVerify = (value) => {
    setIsCaptchaVerified(value);
    if (isCaptchaVerified) {
      setErrors({
        captcha: "",
      });
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    setRegisterData({
      company_name: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (
      (tokenClient && userType === "recruiter") ||
      (tokenClient && userType === "candidate")
    ) {
      navigate("/");
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "warning",
        title: t("employerRegister.alreadyLoggedIn"),
      });
    }
  }, []);

  return (
    <>
      <NavBar />
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <div className="container employerLogin EPRegistration">
            <div className="card rounded">
              <div className="row">
                <div className="col-md-6 leftSection">
                  <img src="/Images/employerlogin.jpg" alt="" />
                </div>
                <div className="col-md-6 mt-5">
                  <div className="text-center">
                    {siteLogo && <img src={siteLogo} alt="logo" />}
                    {!siteLogo && <img src="/Images/logo.png" alt="" />}
                  </div>

                  <div className="card-title text-center h3 pt-5">
                    <p>{t("employerRegister.empAcRegistration")}</p>
                  </div>
                  <div className="card-body">
                    <form className="border border-light">
                      <div className="mb-4">
                        <input
                          type="text"
                          id="defaultLoginFormEmail"
                          className={`form-control ${
                            errors.company_name && "input-error"
                          }`}
                          value={registerData.company_name}
                          name="company_name"
                          placeholder={t("employerRegister.companyName")}
                          onChange={handleChange}
                        />
                        {errors.company_name && (
                          <div className="text-danger">
                            {errors.company_name}
                          </div>
                        )}
                      </div>
                      <div className="mb-4">
                        <input
                          type="text"
                          id="defaultLoginFormEmail"
                          className={`form-control ${
                            errors.first_name && "input-error"
                          }`}
                          value={registerData.first_name}
                          name="first_name"
                          placeholder={t("employerRegister.firstName")}
                          onChange={handleChange}
                        />
                        {errors.first_name && (
                          <div className="text-danger">{errors.first_name}</div>
                        )}
                      </div>
                      <div className="mb-4">
                        <input
                          type="text"
                          id="defaultLoginFormEmail"
                          className={`form-control ${
                            errors.last_name && "input-error"
                          }`}
                          value={registerData.last_name}
                          name="last_name"
                          placeholder={t("employerRegister.lastName")}
                          onChange={handleChange}
                        />
                        {errors.last_name && (
                          <div className="text-danger">{errors.last_name}</div>
                        )}
                      </div>
                      <div className="mb-4">
                        <input
                          type="email"
                          id="defaultLoginFormEmail"
                          className={`form-control ${
                            errors.email && "input-error"
                          }`}
                          value={registerData.email}
                          name="email"
                          placeholder={t("employerRegister.email")}
                          onChange={handleChange}
                        />
                        {errors.email && (
                          <div className="text-danger">{errors.email}</div>
                        )}
                      </div>
                      <div className="mb-4 passwordBox">
                        <input
                          type={showPassword ? "text" : "password"} // Use the showPassword state variable to toggle the input type
                          id="defaultLoginFormPassword"
                          className={`form-control ${
                            errors.password && "input-error"
                          }`}
                          value={registerData.password}
                          name="password"
                          placeholder={t("employerRegister.password")}
                          onChange={handleChange}
                        />
                        <div className="passwordVisibility">
                          <p
                            className="btn-primary"
                            type="button"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <>
                                <Tooltip title="Hide Password">
                                  <VisibilityOffIcon />
                                </Tooltip>
                              </>
                            ) : (
                              <>
                                <Tooltip title="View Password">
                                  <VisibilityIcon />
                                </Tooltip>
                              </>
                            )}
                          </p>
                        </div>
                        {errors.password && (
                          <div className="text-danger">{errors.password}</div>
                        )}
                        {registerData.password && (
                          <PasswordStrengthBar
                            password={registerData.password}
                          />
                        )}
                      </div>
                      <div className="mb-4 passwordBox">
                        <input
                          type={showConfirmPassword ? "text" : "password"} // Use the showPassword state variable to toggle the input type
                          id="defaultLoginFormPassword"
                          className={`form-control ${
                            errors.confirm_password && "input-error"
                          }`}
                          value={registerData.confirm_password}
                          name="confirm_password"
                          placeholder={t("employerRegister.confirmPassword")}
                          onChange={handleChange}
                        />
                        <div className="passwordVisibility">
                          <p
                            className="btn-primary"
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                          >
                            {showConfirmPassword ? (
                              <>
                                <Tooltip title="Hide Password">
                                  <VisibilityOffIcon />
                                </Tooltip>
                              </>
                            ) : (
                              <>
                                <Tooltip title="View Password">
                                  <VisibilityIcon />
                                </Tooltip>
                              </>
                            )}
                          </p>
                        </div>
                        {errors.confirm_password && (
                          <div className="text-danger">
                            {errors.confirm_password}
                          </div>
                        )}
                        {registerData.confirm_password && (
                          <PasswordStrengthBar
                            password={registerData.confirm_password}
                          />
                        )}
                      </div>
                      <div className="reCaptchaLogin">
                        <ReCAPTCHA
                          sitekey={captchaKey}
                          // sitekey="6Ld8bV8nAAAAAEp24xWlKsVFhVDYlBctFF50MI1x"
                          onChange={(value) => handleCaptchaVerify(value)}
                        />
                        {errors.captcha && (
                          <div className="text-danger CaptchaVerify">
                            {errors.captcha}
                          </div>
                        )}
                      </div>
                      <div className="d-flex justify-content-evenly text-center">
                        <button
                          className="btn button1 my-4 "
                          type="submit"
                          onClick={handleClick}
                          style={{
                            backgroundColor: hoverSubmitColor
                              ? secondaryColor
                              : primaryColor,
                            border: hoverSubmitColor
                              ? secondaryColor
                              : primaryColor,
                          }}
                          onMouseEnter={handleSubmitMouseEnter}
                          onMouseLeave={handleSubmitMouseLeave}
                        >
                          {t("employerRegister.submitButton")}
                        </button>
                        <button
                          onClick={handleReset}
                          className="btn button2 my-4 "
                          type="submit"
                          style={{
                            color: hoverResetColor
                              ? primaryColor
                              : secondaryColor,
                            backgroundColor: "white",
                            border: hoverResetColor
                              ? `2px solid ${primaryColor}`
                              : `2px solid ${secondaryColor}`,
                          }}
                          onMouseEnter={handleResetMouseEnter}
                          onMouseLeave={handleResetMouseLeave}
                        >
                          {t("employerRegister.resetButton")}
                        </button>
                      </div>
                      <p className="EPRegistrationBottomText">
                        {t("employerRegister.bottomTxt1")} {siteTitle}{" "}
                        <Link to="/terms_and_conditions">
                          {t("employerRegister.bottomTxt2")}
                        </Link>
                      </p>
                      <p className="EPRegistrationBottomText">
                        {t("employerRegister.bottomTxt3")}{" "}
                        <Link to="/user/employerlogin">
                          {t("employerRegister.bottomTxt4")}
                        </Link>
                      </p>
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

export default EmployerRegister;
