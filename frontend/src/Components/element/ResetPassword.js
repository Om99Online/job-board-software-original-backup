import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "./NavBar";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";
import HTMLReactParser from "html-react-parser";
import ApiKey from "../api/ApiKey";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const { slug1, slug2, slug3 } = useParams();
  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
    id: slug1,
    md5id: slug2,
    email: slug3,
  });
  const recaptchaLanguage = Cookies.get("selectedLanguage");
  const [t, i18n] = useTranslation("global");
  const currentLanguage = Cookies.get("selectedLanguage") || "en";

  const [initialData, setInitialData] = useState({
    id: slug1,
    md5id: slug2,
    email: slug3,
  });
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false); // New state variable

  // ... Other state variables and functions ...

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state variable

  // ... Other state variables and functions ...

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  let captchaKey = Cookies.get("captchaKey");
  const tokenKey = Cookies.get("tokenClient");

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
      console.log(initialData);
      const response = await axios.post(
        BaseApi + "/candidates/resetPassword",
        initialData,
        {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            token: tokenKey,
          },
        }
      );
      setLoading(false);
      //   setPageContent(response.data.response);
    } catch (error) {
      setLoading(false);
      
      console.log("Cannot get data of benefit page");
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
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const newErrors = {};

      if (formData.password === "") {
        newErrors.password = t("resetPassword.newPassRequired");
      }
      if (formData.confirm_password === "") {
        newErrors.confirm_password = t("resetPassword.confirmPassRequired");
      }
      if (formData.password) {
        if (formData.password.length < 8) {
          newErrors.password = t("resetPassword.passwordLengthError");
        }
      }
      if (formData.confirm_password) {
        if (formData.confirm_password.length < 8) {
          newErrors.confirm_password = t("resetPassword.passwordLengthError");
        }
      }
      if (formData.password && formData.confirm_password) {
        if (formData.password !== formData.confirm_password) {
          newErrors.confirm_password =
          t("resetPassword.passwordMatchError");
        }
      }

      //   if (!isCaptchaVerified) {
      //     newErrors.captcha = "Please verify captcha";
      //   }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        // if (isCaptchaVerified) {
        setLoading(true);
        const updatedData = {
          ...formData,
          language: currentLanguage
        }
        const response = await axios.post(
          BaseApi + "/candidates/resetPassword",
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
        // console.log("yaha");
        if (response.data.status === 200) {
          navigate("/user/employerlogin");
          Swal.fire({
            title: response.data.message,
            icon: "success",
            confirmButtonText: "Close",
          });
        } else if (response.data.status === 500) {
          Swal.fire({
            title: response.data.message,
            icon: "warning",
            confirmButtonText: "Close",
          });
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
      }
      //   }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: t("resetPassword.failedTitle"),
        text: t("resetPassword.failedTxt"),
        icon: "error",
        confirmButtonText: t("resetPassword.close"),
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
              <h1 className="">{t("resetPassword.resetPassword")}</h1>
              <h6 className="text-muted fw-normal">
                {" "}
                <Link to="/" style={{ color: "grey" }}>
                {t("resetPassword.home")}
                </Link>{" "}
                /{t("resetPassword.resetPassword")}
                {/* /{pageContent.static_page_title} */}
              </h6>
            </div>
            <div className="container">
              <div className="row">
                <div className="card forgotPasswordCard">
                  <div className="card-body">
                    <h2 className="text-center pb-4 pt-2">
                    {t("resetPassword.resetYour")}
                      <span className="textGradient">
                        {" "}
                        <span className="SubHaddingTxt"> {t("resetPassword.password")}</span>
                      </span>
                    </h2>
                    <p className="forgotPasswordProcessTxt">
                    {t("resetPassword.text1")}
                    </p>
                    <form>
                      <div className="mb-2 passwordBox">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`form-control ${
                            errors.password && "input-error"
                          }`}
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          name="password"
                          value={formData.password}
                          placeholder={t("resetPassword.newPassword")}
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
                      </div>
                      <div className="mb-2 passwordBox">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className={`form-control ${
                            errors.confirm_password && "input-error"
                          }`}
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          name="confirm_password"
                          value={formData.confirm_password}
                          placeholder={t("resetPassword.confirmPassword")}
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
                      </div>
                      {/* <p className="forgotPasswordReturnLogin text-muted">
                        Oops, I just remembered it! Take me back to the{" "}
                        <Link to={() => navigate(window.history.go(-1))}>
                          Login Page
                        </Link>
                      </p> */}

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
                        className="btn w-100 mt-4"
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
                        {t("resetPassword.changePasswordButton")}
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

export default ResetPassword;
