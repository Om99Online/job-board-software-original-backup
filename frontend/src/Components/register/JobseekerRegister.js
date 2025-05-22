import React, { useEffect, useState } from "react";
import NavBar from "../element/NavBar";
import Footer from "../element/Footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BaseApi from "../api/BaseApi";
// import Multiselect from "multiselect-react-dropdown";
import ReCAPTCHA from "react-google-recaptcha";
import Swal from "sweetalert2";
import Select from "react-select";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Tooltip } from "@mui/material";
import PasswordStrengthBar from "react-password-strength-bar";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const JobseekerRegister = () => {
  const [registerData, setRegisterData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    user_type: "candidate",
    interest_categories: [],
  });

  const [errors, setErrors] = useState({
    first_name: "",
    captcha: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    interest_categories: [],
  });

  const userType = Cookies.get("user_type");
  const tokenClient = Cookies.get("tokenClient");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [t, i18n] = useTranslation("global");
  const currentLanguage = Cookies.get("selectedLanguage") || "en";

  // const [pageChanges, setPageChanges] = useState();
  const [hoverSubmitColor, setHoverSubmitColor] = useState(false);
  // const [constantData, setConstantData] = useState([]);

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

  // const getSiteData = async () => {
  //   try {
  //     const response = await axios.get(BaseApi + "/getconstant");
  //     setPageChanges(response.data.response.site_logo);
  //     setConstantData(response.data.response);
  //   } catch (error) {
  //     console.log("Error getting navbar logo information!");
  //   }
  // };
  // useEffect(() => {
  //   // getSiteData();
  //   // window.scrollTo(0, 0);
  // }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(BaseApi + "/users/registration", null);

      setCategoriesData(response.data.response.categories);
      setLoading(false);
      console.log("Jobseeker registration interest categories data received.");
    } catch (error) {
      setLoading(false);
      console.log("Error getting register page data on jobseeker registration");
    }
  };

  const handleClick = async (e) => {
    var interest_categories = document.getElementsByName("interest_categories");

    var categoryArray = [];

    interest_categories.forEach((element) => {
      categoryArray.push(element.value);
    });
    console.log(categoryArray);

    e.preventDefault();
    try {
      const newErrors = {};

      if (registerData.interest_categories === "") {
        newErrors.interest_categories = "Interest Categories are required";
        window.scrollTo(0, 0);
      }
      if (registerData.first_name === "") {
        newErrors.first_name = t("jobseekerRegister.firstNameRequired");
        window.scrollTo(0, 0);
      }
      if (registerData.last_name === "") {
        newErrors.last_name = t("jobseekerRegister.lastNameRequired");
        window.scrollTo(0, 0);
      }
      if (registerData.email === "") {
        newErrors.email = t("jobseekerRegister.emailRequired");
        window.scrollTo(0, 0);
      } else if (!isValidEmail(registerData.email)) {
        newErrors.email = t("jobseekerRegister.invalidEmail");
        window.scrollTo(0, 0);
      }
      if (registerData.password === "") {
        newErrors.password = t("jobseekerRegister.passwordRequired");
        window.scrollTo(0, 0);
      }
      if (registerData.confirm_password === "") {
        newErrors.confirm_password = t(
          "jobseekerRegister.confirmPasswordRequired"
        );
        window.scrollTo(0, 0);
      }
      if (registerData.password) {
        if (registerData.password.length < 8) {
          newErrors.password = t("jobseekerRegister.passwordLengthError");
          window.scrollTo(0, 0);
        }
      }
      if (registerData.confirm_password) {
        if (registerData.confirm_password.length < 8) {
          newErrors.confirm_password = t(
            "jobseekerRegister.passwordLengthError"
          );
          window.scrollTo(0, 0);
        }
      }
      if (registerData.confirm_password && registerData.confirm_password) {
        if (registerData.password != registerData.confirm_password) {
          newErrors.confirm_password = t(
            "jobseekerRegister.passwordMatchError"
          );
          window.scrollTo(0, 0);
        }
      }

      if (!isCaptchaVerified) {
        newErrors.captcha = t("jobseekerRegister.captchaRequired");
      }

      setErrors(newErrors);

      // Function to validate email format
      function isValidEmail(email) {
        // Use a regular expression to validate email format
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
      }

      // if (registerData.password.length < 8) {
      //   setErrors({
      //     password: "Please enter atleast 8 characters",
      //   });
      //   return;
      // }
      // if (registerData.confirm_password.length < 8) {
      //   setErrors({
      //     confirm_password: "Please enter atleast 8 characters",
      //   });
      //   return;
      // }
      // if (registerData.password != registerData.confirm_password) {
      //   setErrors({
      //     confirm_password: "Password and confirm password do not match",
      //   });
      //   return;
      // }

      if (Object.keys(newErrors).length === 0) {
        if (isCaptchaVerified) {
          const updatedProfile = {
            ...registerData,
            interest_categories: categoryArray,
            language: currentLanguage
          };

          setLoading(true);
          const response = await axios.post(
            BaseApi + "/users/registration",
            updatedProfile
          );
          console.log(response.data);
          let status = response.data.status;

          if (status === 200) {
            Swal.fire({
              title: t("jobseekerRegister.creationSuccessMessage"),
              icon: "success",
              confirmButtonText: t("jobseekerRegister.close"),
            });
            setIsCaptchaVerified(false);
            navigate("/user/jobseekerlogin");
          } else {
            Swal.fire({
              title: response.data.message,
              confirmButtonText: t("jobseekerRegister.close"),
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
        title: t("jobseekerRegister.failedTitle"),
        text: t("jobseekerRegister.failedMessage"),
        icon: "error",
        confirmButtonText: t("jobseekerRegister.close"),
      });
      setIsCaptchaVerified(false);
      console.log("Error sending register credentails");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "interest_categories") {
      setRegisterData((prevData) => ({
        ...prevData,
        interest_categories: [...prevData.interest_categories, value],
      }));
    } else {
      setRegisterData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // const handleSkillChange = (selectedOptions) => {
  //   // Update the jobData state with the selected skills
  //   setRegisterData((prevData) => ({
  //     ...prevData,
  //     interest_categories: selectedOptions.map((option) => option.id),
  //   }));
  // };

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const [showPassword, setShowPassword] = useState(false); // New state variable

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state variable

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    if (isCaptchaVerified) {
      setErrors({
        captcha: "",
      });
    }
    getData();
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
        title: t("jobseekerRegister.alreadyLoggedIn"),
      });
    }
  }, []);

  const handleReset = (e) => {
    e.preventDefault();
    setRegisterData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      interest_categories: [],
    });
  };

  return (
    <>
      <NavBar />
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <div className="container employerLogin">
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
                  <div className="text-center card-title h3 pt-5">
                    {t("jobseekerRegister.jobseekAcRegistration")}
                  </div>
                  <div className="card-body">
                    <form className="border border-light">
                      <div className="mb-4">
                        <input
                          type="text"
                          id="defaultLoginFormEmail"
                          className={`form-control ${
                            errors.first_name && "input-error"
                          }`}
                          value={registerData.first_name}
                          name="first_name"
                          placeholder={t("jobseekerRegister.firstName")}
                          onChange={handleChange}
                        />
                        {errors.first_name && (
                          <div className="text-danger">{errors.first_name}</div>
                        )}
                      </div>
                      <div className="mb-4">
                        <input
                          type="text"
                          id="defaultLoginFormLastName"
                          className={`form-control ${
                            errors.last_name && "input-error"
                          }`}
                          value={registerData.last_name}
                          name="last_name"
                          placeholder={t("jobseekerRegister.lastName")}
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
                          placeholder={t("jobseekerRegister.email")}
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
                          placeholder={t("jobseekerRegister.password")}
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
                          placeholder={t("jobseekerRegister.confirmPassword")}
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

                      <div className="DashBoardInputBx DashBoardCreatBx skillPackage">
                        <Select
                          //defaultValue={selectedCat}
                          isMulti
                          isSearchable
                          name="interest_categories"
                          options={categoriesData.map((i) => ({
                            value: i.id,
                            label: i.name,
                          }))}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          placeholder={t("jobseekerRegister.selectCategory")}
                        />
                      </div>

                      <div className="reCaptchaLogin">
                        <ReCAPTCHA
                          sitekey={captchaKey}
                          // sitekey="6Ld8bV8nAAAAAEp24xWlKsVFhVDYlBctFF50MI1x"
                          onChange={(value) => setIsCaptchaVerified(value)}
                        />
                        {errors.captcha && (
                          <div className="text-danger CaptchaVerify">
                            {errors.captcha}
                          </div>
                        )}
                      </div>

                      <div className="d-flex justify-content-evenly">
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
                          {t("jobseekerRegister.submitButton")}
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
                          {t("jobseekerRegister.resetButton")}
                        </button>
                      </div>
                      <div className="text-center">
                        <p>
                          {t("jobseekerRegister.bottomTxt1")} {siteTitle}{" "}
                          <Link to="/terms_and_conditions">
                            {t("jobseekerRegister.bottomTxt2")}
                          </Link>
                        </p>
                        <p className="mt-2 float-left">
                          {t("jobseekerRegister.bottomTxt3")}{" "}
                          <Link to="/user/jobseekerlogin">
                            {t("jobseekerRegister.bottomTxt4")}
                          </Link>
                        </p>
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

export default JobseekerRegister;
