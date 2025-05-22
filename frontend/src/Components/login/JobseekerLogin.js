import React, { useEffect, useState } from "react";
import NavBar from "../element/NavBar";
import Footer from "../element/Footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

const JobseekerLogin = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const userType = Cookies.get("user_type");
  const tokenClient = Cookies.get("tokenClient");
  const [t, i18n] = useTranslation("global");
  const recaptchaLanguage = Cookies.get("selectedLanguage");
  // const [pageChanges, setPageChanges] = useState();
  const [hoverLoginColor, setHoverLoginColor] = useState(false);
  const currentLanguage = Cookies.get("selectedLanguage") || "en";

  const handleLoginEnter = () => {
    setHoverLoginColor(true);
    // console.log(hoverColor)
  };

  const handleLoginLeave = () => {
    setHoverLoginColor(false);
  };

  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  let siteLogo = Cookies.get("siteLogo");
  let captchaKey = Cookies.get("captchaKey");

  // const getSiteData = async () => {
  //   try {
  //     const response = await axios.get(BaseApi + "/getconstant");
  //     setPageChanges(response.data.response.site_logo);
  //   } catch (error) {
  //     console.log("Error getting navbar logo information!");
  //   }
  // };
  // useEffect(() => {
  //   getSiteData();
  //   // window.scrollTo(0, 0);
  // }, []);

  const getData = async (e) => {
    e.preventDefault();
    try {
      const newErrors = {};

      if (loginData.email === "") {
        newErrors.email = t("jobseekerLogin.emailRequired");
        window.scrollTo(0, 0);
      } else if (!isValidEmail(loginData.email)) {
        newErrors.email = t("jobseekerLogin.invalidEmail");
        window.scrollTo(0, 0);
      }
      if (loginData.password === "") {
        newErrors.password = t("jobseekerLogin.passwordRequired");
        window.scrollTo(0, 0);
      }
      if (!isCaptchaVerified) {
        newErrors.captcha = t("jobseekerLogin.captchaRequired");
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
          const updatedData = {
            ...loginData,
            language: currentLanguage,
          };

          const response = await axios.post(
            BaseApi + "/users/login",
            updatedData
          );
          // console.log(response.data);
          let status = response.data.status;

          setLoading(false);
          // console.log("Request sent successfully");
          if (status === 200 && response.data.response.user.token !== "") {
            let userType = response.data.response.user.user_type;
            if (userType !== "candidate") {
              Swal.fire({
                title: t("jobseekerLogin.wrongCredentials"),
                icon: "error",
                confirmButtonText: t("jobseekerLogin.close"),
              });
              setIsCaptchaVerified(false);
            } else {
              let tokenFetch = response.data.response.user.token;
              let fnameFetch = response.data.response.user.first_name;
              let usertypeFetch = response.data.response.user.user_type;
              Cookies.set("tokenClient", tokenFetch);
              Cookies.set("fname", fnameFetch);
              Cookies.set("user_type", usertypeFetch);
              navigate("/candidates/myaccount");
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
                icon: "success",
                title: t("jobseekerLogin.welcome") + " " + fnameFetch,
              });
              setIsCaptchaVerified(false);
            }
          } else if (status === 500) {
            Swal.fire({
              title: response.data.message,
              icon: "error",
              // confirmButtonText: "Close",
              timer: 3000,
              timerProgressBar: true,
            });
            setIsCaptchaVerified(false);
            // console.log("Error with credentials!");
            // const Toast = Swal.mixin({
            //   toast: true,
            //   position: "top-end",
            //   showConfirmButton: false,
            //   timer: 3000,
            //   timerProgressBar: true,
            //   didOpen: (toast) => {
            //     toast.addEventListener("mouseenter", Swal.stopTimer);
            //     toast.addEventListener("mouseleave", Swal.resumeTimer);
            //   },
            // });

            // Toast.fire({
            //   icon: "error",
            //   title: response.data.message,
            // });
          } else {
            console.log("Nothing works");
          }
        }
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: t("jobseekerLogin.failedTitle"),
        icon: "error",
        confirmButtonText: t("jobseekerLogin.close"),
      });
      setIsCaptchaVerified(false);
      // console.log("Error sending login credentails");
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    console.log(setShowPassword);
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
        title: t("jobseekerLogin.alreadyLoggedIn"),
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
          <div className="container jobseekerLogin employerLogin">
            <div className="card rounded">
              <div className="row">
                <div className="col-md-6 leftSection">
                  <img src="/Images/jobseekerLogin.jpg" alt="" />
                </div>
                <div className="col-md-6 mt-5">
                  <div className="text-center">
                    {siteLogo && <img src={siteLogo} alt="logo" />}
                    {!siteLogo && <img src="/Images/logo.png" alt="" />}
                    {/* <img src="/Images/logo.png" alt="" /> */}
                  </div>

                  <div className="card-title text-center h3 pt-5">
                    {t("jobseekerLogin.jobseekerLogin")}
                  </div>
                  <div className="card-body">
                    <form className="border border-light" action="#!">
                      <div className="mb-4">
                        <input
                          type="email"
                          id="defaultLoginFormEmail"
                          className={`form-control ${
                            errors.email && "input-error"
                          }`}
                          value={loginData.email}
                          placeholder={t("jobseekerLogin.email")}
                          name="email"
                          onChange={handleChange}
                        />
                        {errors.email && (
                          <div className="text-danger">{errors.email}</div>
                        )}
                      </div>

                      <div className="passwordBox">
                        <input
                          type={showPassword ? "text" : "password"} // Use the showPassword state variable to toggle the input type
                          id="defaultLoginFormPassword"
                          className={`form-control ${
                            errors.password && "input-error"
                          }`}
                          value={loginData.password}
                          name="password"
                          placeholder={t("jobseekerLogin.password")}
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

                      <div className="reCaptchaLogin">
                        <ReCAPTCHA
                          sitekey={captchaKey}
                          // hl={recaptchaLanguage}
                          onChange={(value) => setIsCaptchaVerified(value)}
                        />
                        {errors.captcha && (
                          <div className="text-danger CaptchaVerify">
                            {errors.captcha}
                          </div>
                        )}
                      </div>
                      <div className="forgotPassword">
                        <Link to="/users/forgotpassword">
                          {t("jobseekerLogin.forgotPassword")}
                        </Link>
                      </div>
                      <div className="text-center">
                        <button
                          onClick={getData}
                          className="btn button1 my-4"
                          type="submit"
                          style={{
                            backgroundColor: hoverLoginColor
                              ? secondaryColor
                              : primaryColor,
                            border: hoverLoginColor
                              ? secondaryColor
                              : primaryColor,
                          }}
                          onMouseEnter={handleLoginEnter}
                          onMouseLeave={handleLoginLeave}
                        >
                          {t("jobseekerLogin.login")}
                        </button>
                      </div>
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

export default JobseekerLogin;
