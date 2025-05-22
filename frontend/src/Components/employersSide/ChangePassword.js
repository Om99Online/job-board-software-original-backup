import React, { useEffect, useState } from "react";
import NavBar from "../element/NavBar";
import Sidebar from "./Sidebar";
import Footer from "../element/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import PasswordStrengthBar from "react-password-strength-bar";
import { useTranslation } from "react-i18next";

const ChangePassword = () => {
  const [password, setPassword] = useState({
    old_password: "",
    new_password: "",
    conf_password: "",
  });
  const [errors, setErrors] = useState({
    old_password: "",
    new_password: "",
    conf_password: "",
  });
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("tokenClient");
  const navigate = useNavigate();
  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  const [t, i18n] = useTranslation("global");
  const currentLanguage = Cookies.get("selectedLanguage") || "en";

  const [hoverSearchColor, setHoverSearchColor] = useState(false);

  const handleSearchMouseEnter = () => {
    setHoverSearchColor(true);
  };

  const handleSearchMouseLeave = () => {
    setHoverSearchColor(false);
  };

  const [hoverUploadCVColor, setHoverUploadCVColor] = useState(false);

  const handleUploadCVMouseEnter = () => {
    setHoverUploadCVColor(true);
  };

  const handleUploadCVMouseLeave = () => {
    setHoverUploadCVColor(false);
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleClick = async () => {
    try {
      const newErrors = {};

      if (password.old_password === "") {
        newErrors.old_password = t("employerChangePassword.oldPassRequired");
        window.scrollTo(0, 0);
      }

      if (password.new_password === "") {
        newErrors.new_password = t("employerChangePassword.newPassRequired");
        window.scrollTo(0, 0);
      }
      if (password.conf_password === "") {
        newErrors.conf_password = t("employerChangePassword.confPassRequired");
        window.scrollTo(0, 0);
      }
      if (password.new_password) {
        if (password.new_password.length < 8) {
          newErrors.new_password = t("employerChangePassword.passLengthError");
        }
      }
      if (password.conf_password) {
        if (password.conf_password.length < 8) {
          newErrors.conf_password = t("employerChangePassword.passLengthError");
        }
      }
      if (password.new_password && password.conf_password) {
        if (password.new_password !== password.conf_password) {
          newErrors.conf_password = t("employerChangePassword.passMatchError");
        }
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: t("employerChangePassword.passConfirmTitle"),
          text: t("employerChangePassword.passConfirmTxt"),
          icon: "question",
          showCancelButton: true,
          confirmButtonText: t("employerChangePassword.yes"),
          cancelButtonText: t("employerChangePassword.no"),
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);

          const updatedData = {
            ...password,
            language: currentLanguage
          }
          const response = await axios.post(
            BaseApi + "/users/changePassword",
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
          if (response.data.status === 200) {
            
            Swal.fire({
              title: t("employerChangePassword.passSuccessTitle"),
              icon: "success",
              confirmButtonText: t("employerChangePassword.close"),
            });
            navigate("/user/myprofile");
          } else if (response.data.status === 400) {
            Cookies.remove("tokenClient");
            Cookies.remove("user_type");
            Cookies.remove("fname");
            navigate("/");
            Swal.fire({
              title: response.data.message,
              icon: "warning",
              confirmButtonText: t("employerChangePassword.close"),
            });
          } else {
            Swal.fire({
              title: response.data.message,
              icon: "warning",
              confirmButtonText: t("employerChangePassword.close"),
            });
          }
        }
      }
      // }
    } catch (error) {
      setLoading(false);
      if(error.message === "Network Error") {
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: t("tokenExpired.tokenExpired"),
          icon: "warning",
          confirmButtonText: t("jobDescription.close"),
        });
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      }
      Swal.fire({
        title: t("employerChangePassword.passFailedTitle"),
        icon: "error",
        confirmButtonText: t("employerChangePassword.close"),
      });
      console.log("Could not change password!");
    }
  };

  useEffect(() => {
    if (!tokenKey) {
      navigate("/user/employerlogin");
    } else {
      window.scrollTo(0, 0);
    }
  }, [tokenKey, navigate]);

  return (
    <>
      <NavBar />

      <div className="container changePassword editProfile">
        <div className="row">
          <div className="col-lg-3">
            <Sidebar />
          </div>
          {loading ? (
            <div className="loader-container"></div>
          ) : (
            <>
              <div
                className="col-lg-9 mb-5"
                style={{
                  borderLeft: "2px solid #e6e8e7",
                  borderRight: "2px solid #e6e8e7",
                }}
              >
                <div className="d-flex mx-3 PageHeader">
                  <img src="/Images/employerSide/icon9color.png" alt="" />
                  <h3 className="mx-2">
                    {t("employerChangePassword.changeYourPassword")}
                  </h3>
                </div>
                <form>
                  <div className="mb-5 mt-5">
                    <div class="form-outline mb-5 DashBoardInputBx">
                      <label class="form-label" for="form3Example1">
                        {t("employerChangePassword.oldPassword")}{" "}
                        <span className="RedStar">*</span>
                      </label>
                      <input
                        type="password"
                        id="form3Example1"
                        className={`form-control ${
                          errors.old_password && "input-error"
                        }`}
                        placeholder={t("employerChangePassword.oldPassword")}
                        value={password.old_password}
                        name="old_password"
                        onChange={handleChange}
                      />
                      {errors.old_password && (
                        <div className="text-danger">{errors.old_password}</div>
                      )}
                    </div>
                    <div class="form-outline mb-5 DashBoardInputBx">
                      <label class="form-label" for="form3Example3">
                        {t("employerChangePassword.newPassword")}
                        <span className="RedStar">*</span>
                      </label>
                      <input
                        type="password"
                        id="form3Example3"
                        className={`form-control ${
                          errors.new_password && "input-error"
                        }`}
                        placeholder={t("employerChangePassword.newPassword")}
                        value={password.new_password}
                        name="new_password"
                        onChange={handleChange}
                      />
                      {errors.new_password && (
                        <div className="text-danger">{errors.new_password}</div>
                      )}
                      {password.new_password && (
                        <PasswordStrengthBar password={password.new_password} />
                      )}
                    </div>
                    <div class="form-outline mb-5 DashBoardInputBx">
                      <label class="form-label" for="form3Example3">
                        {t("employerChangePassword.confirmPassword")}{" "}
                        <span className="RedStar">*</span>
                      </label>
                      <input
                        type="password"
                        id="form3Example3"
                        className={`form-control ${
                          errors.conf_password && "input-error"
                        }`}
                        placeholder={t(
                          "employerChangePassword.confirmPassword"
                        )}
                        value={password.conf_password}
                        name="conf_password"
                        onChange={handleChange}
                      />
                      {errors.conf_password && (
                        <div className="text-danger">
                          {errors.conf_password}
                        </div>
                      )}
                      {password.conf_password && (
                        <PasswordStrengthBar
                          password={password.conf_password}
                        />
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary button1 mx-3"
                    onClick={handleClick}
                    style={{
                      backgroundColor: hoverSearchColor
                        ? secondaryColor
                        : primaryColor,
                      border: hoverSearchColor ? secondaryColor : primaryColor,
                    }}
                    onMouseEnter={handleSearchMouseEnter}
                    onMouseLeave={handleSearchMouseLeave}
                  >
                    {t("employerChangePassword.updateButton")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary button2"
                    style={{
                      color: hoverUploadCVColor ? primaryColor : secondaryColor,
                      backgroundColor: "white",
                      border: hoverUploadCVColor
                        ? `2px solid ${primaryColor}`
                        : `2px solid ${secondaryColor}`,
                    }}
                    onMouseEnter={handleUploadCVMouseEnter}
                    onMouseLeave={handleUploadCVMouseLeave}
                  >
                    {t("employerChangePassword.cancelButton")}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ChangePassword;
