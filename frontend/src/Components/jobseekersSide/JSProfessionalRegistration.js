import React, { useEffect, useState } from "react";
import Footer from "../element/Footer";
import JSSidebar from "./JSSidebar";
import NavBar from "../element/NavBar";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const JSProfessionalRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [professional, setProfessional] = useState([]);
  const tokenKey = Cookies.get("tokenClient");
  const [validationErrors, setValidationErrors] = useState([]);

  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  const [t, i18n] = useTranslation("global");

  const [hoverFirstButtonColor, setHoverFirstButtonColor] = useState(false);

  const handleFirstButtonMouseEnter = () => {
    setHoverFirstButtonColor(true);
  };

  const handleFirstButtonMouseLeave = () => {
    setHoverFirstButtonColor(false);
  };

  const [hoverSecondButtonColor, setHoverSecondButtonColor] = useState(false);

  const handleSecondButtonMouseEnter = () => {
    setHoverSecondButtonColor(true);
  };

  const handleSecondButtonMouseLeave = () => {
    setHoverSecondButtonColor(false);
  };

  const [hoverThirdButtonColor, setHoverThirdButtonColor] = useState(false);

  const handleThirdButtonMouseEnter = () => {
    setHoverThirdButtonColor(true);
  };

  const handleThirdButtonMouseLeave = () => {
    setHoverThirdButtonColor(false);
  };

  const [hoverFourthButtonColor, setHoverFourthButtonColor] = useState(false);

  const handleFourthButtonMouseEnter = () => {
    setHoverFourthButtonColor(true);
  };

  const handleFourthButtonMouseLeave = () => {
    setHoverFourthButtonColor(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    // Check if tokenKey is not present
    if (!tokenKey) {
      // Redirect to the home page
      navigate("/user/jobseekerlogin");
    } else {
      // TokenKey is present, fetch data or perform other actions
      getData();
      window.scrollTo(0, 0);
    }
  }, [tokenKey, navigate]);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/candidates/editProfessional",
        null, // Pass null as the request body if not required
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
        setProfessional(response.data.response);
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: t("jobseekerProfessionalRegistration.close"),
        });
      }
    } catch (error) {
      setLoading(false);
      if (error.message === "Network Error") {
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
      console.log(error.message);
    }
  };

  const validateFields = () => {
    const errors = professional.map((prof, index) => ({
      registration: prof.registration.trim() === "",
      // Add more validation checks for other fields if needed
    }));

    setValidationErrors(errors);
    return errors.every((error) => !error.registration);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setProfessional((prevProfessionalDetails) => {
      const updatedDetails = [...prevProfessionalDetails]; // Create a shallow copy of the array
      updatedDetails[index] = {
        ...updatedDetails[index], // Create a shallow copy of the specific education detail
        [name]: value, // Update the specific field with the new value
      };
      return updatedDetails; // Return the updated array
    });
  };

  const handleClick = async () => {
    if (!validateFields()) {
      return;
    }
    try {
      const confirmationResult = await Swal.fire({
        title: t("jobseekerProfessionalRegistration.confirmTitle"),
        text: t("jobseekerProfessionalRegistration.confirmTxt"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("jobseekerProfessionalRegistration.yes"),
        cancelButtonText: t("jobseekerProfessionalRegistration.no"),
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseApi + "/candidates/editProfessional",
          { Professional: professional }, // Pass null as the request body if not required
          {
            headers: {
              "Content-Type": "application/json",
              key: ApiKey,
              token: tokenKey,
            },
          }
        );
        setLoading(false);
        if (response.data.status) {
          getData();
          Swal.fire({
            title: t("jobseekerProfessionalRegistration.successTitle"),
            text: t("jobseekerProfessionalRegistration.successTxt"),
            icon: "success",
            confirmButtonText: t("jobseekerProfessionalRegistration.close"),
          });
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: t("jobseekerProfessionalRegistration.close"),
          });
        }
      }
    } catch (error) {
      setLoading(false);
      if (error.message === "Network Error") {
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
        title: t("jobseekerProfessionalRegistration.failedTitle"),
        text: t("jobseekerProfessionalRegistration.failedTxt"),
        icon: "error",
        confirmButtonText: t("jobseekerProfessionalRegistration.close"),
      });
    }
  };

  const handleAdd = () => {
    const newRegistration = {
      registration: "",
    };

    setProfessional((prevProfessional) => [
      ...prevProfessional,
      newRegistration,
    ]);
  };

  const handleRemove = async (id) => {
    try {
      const confirmationResult = await Swal.fire({
        title: t("jobseekerProfessionalRegistration.removeConfirmTitle"),
        text: t("jobseekerProfessionalRegistration.removeConfirmTxt"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("jobseekerProfessionalRegistration.yes"),
        cancelButtonText: t("jobseekerProfessionalRegistration.no"),
      });
      if (confirmationResult.isConfirmed) {
        const response = await axios.post(
          BaseApi + `/candidates/deleteprofessional/${id}`,
          null,
          {
            headers: {
              "Content-Type": "application/json",
              key: ApiKey,
              token: tokenKey,
            },
          }
        );
        if (response.data.status === 200) {
          getData();
          Swal.fire({
            title: t("jobseekerProfessionalRegistration.removeSuccessTitle"),
            icon: "success",
            confirmButtonText: t("jobseekerProfessionalRegistration.close"),
          });
          window.scrollTo(0, 0);
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: t("jobseekerProfessionalRegistration.close"),
          });
        }
      }
    } catch (error) {
      setLoading(false);
      if (error.message === "Network Error") {
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
        title: t("jobseekerProfessionalRegistration.failedTitle"),
        text: t("jobseekerProfessionalRegistration.failedTxt"),
        icon: "error",
        confirmButtonText: t("jobseekerProfessionalRegistration.close"),
      });
    }
  };
  const handleRemoveWithoutId = (indexToRemove) => {
    setProfessional((prevProfessional) =>
      prevProfessional.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <>
      <NavBar />
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <div className="container editProfile">
            <div className="row">
              <div className="col-lg-3">
                <JSSidebar />
              </div>

              <div
                className="col-lg-9 mb-5"
                style={{
                  borderLeft: "2px solid #e6e8e7",
                  borderRight: "2px solid #e6e8e7",
                }}
              >
                <div className="mx-3 d-flex PageHeader">
                  <img
                    src="/Images/jobseekerSide/Professional-Registration-Color.png"
                    alt=""
                  />
                  <h3 className="ms-1" style={{ color: "#ac7ce4" }}>
                    {t(
                      "jobseekerProfessionalRegistration.professionalRegistration"
                    )}
                  </h3>
                </div>
                <form>
                  <div className="mb-5 mt-4 mx-4">
                    {professional.map((i, index) => {
                      return (
                        <>
                          <h4 className="mt-5 mb-5">
                            {t(
                              "jobseekerProfessionalRegistration.professionalRegistration"
                            )}{" "}
                            {index + 1}
                          </h4>
                          <div className="form-outline mb-4 DashBoardInputBx specialJSPR">
                            <label
                              className="form-label"
                              htmlFor="form3Example3"
                            >
                              {t(
                                "jobseekerProfessionalRegistration.professionalGoverningBody"
                              )}
                              <span className="RedStar">*</span>
                            </label>
                            <input
                              type="text"
                              id="form3Example3"
                              className="form-control"
                              name="registration"
                              value={i.registration}
                              placeholder={t(
                                "jobseekerProfessionalRegistration.professionalRegistration"
                              )}
                              onChange={(e) => handleChange(e, index)}
                            />
                            <div className="mt-0">
                              {validationErrors[index]?.registration && (
                                <small className="text-danger">
                                  {t(
                                    "jobseekerProfessionalRegistration.requiredField"
                                  )}
                                </small>
                              )}
                            </div>
                            <div className="removeButtonJobseeker mt-4">
                              {i.id ? (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-primary button2"
                                    onClick={() => handleRemove(i.id)}
                                    style={{
                                      color: hoverFourthButtonColor
                                        ? primaryColor
                                        : secondaryColor,
                                      backgroundColor: "white",
                                      border: hoverFourthButtonColor
                                        ? `2px solid ${primaryColor}`
                                        : `2px solid ${secondaryColor}`,
                                    }}
                                  >
                                    {t(
                                      "jobseekerProfessionalRegistration.removeButton"
                                    )}
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-primary button2"
                                    onClick={() => handleRemoveWithoutId(index)}
                                    style={{
                                      color: hoverFourthButtonColor
                                        ? primaryColor
                                        : secondaryColor,
                                      backgroundColor: "white",
                                      border: hoverFourthButtonColor
                                        ? `2px solid ${primaryColor}`
                                        : `2px solid ${secondaryColor}`,
                                    }}
                                  >
                                    {t(
                                      "jobseekerProfessionalRegistration.removeButton"
                                    )}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      );
                    })}
                    {professional.length <= 0 && (
                      <>
                        <div className="noData">
                          {t("jobseekerEducation.noInfoAvl")}
                        </div>
                      </>
                    )}
                    {professional.length > 0 && (
                      <>
                        <div className="removeButtonJobseeker PRAddMore mb-4">
                          <button
                            type="button"
                            className="btn btn-primary button1"
                            onClick={handleAdd}
                            style={{
                              backgroundColor: primaryColor,
                              color: "white",
                              border: primaryColor,
                            }}
                          >
                            {t(
                              "jobseekerProfessionalRegistration.addMoreButton"
                            )}
                          </button>
                        </div>
                      </>
                    )}
                    {professional.length <= 0 && (
                      <>
                        <div className="PRAddMore mb-4 jobseekerAddDetailsButton">
                          <button
                            type="button"
                            className="btn btn-primary button1"
                            onClick={handleAdd}
                            style={{
                              backgroundColor: primaryColor,
                              color: "white",
                              border: primaryColor,
                            }}
                          >
                            {t("jobseekerExperience.addDetails")}
                          </button>
                        </div>
                      </>
                    )}

                    {professional.length > 0 && (
                      <>
                        <div className="bottomButtons">
                          <button
                            type="button"
                            className="btn btn-primary button1"
                            onClick={handleClick}
                            style={{
                              backgroundColor: hoverFirstButtonColor
                                ? secondaryColor
                                : primaryColor,
                              border: hoverFirstButtonColor
                                ? secondaryColor
                                : primaryColor,
                            }}
                            onMouseEnter={handleFirstButtonMouseEnter}
                            onMouseLeave={handleFirstButtonMouseLeave}
                          >
                            {t(
                              "jobseekerProfessionalRegistration.updateButton"
                            )}
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary button2"
                            style={{
                              color: hoverThirdButtonColor
                                ? primaryColor
                                : secondaryColor,
                              backgroundColor: "white",
                              border: hoverThirdButtonColor
                                ? `2px solid ${primaryColor}`
                                : `2px solid ${secondaryColor}`,
                            }}
                            onMouseEnter={handleThirdButtonMouseEnter}
                            onMouseLeave={handleThirdButtonMouseLeave}
                            onClick={() => navigate("/candidates/myaccount")}
                          >
                            {t(
                              "jobseekerProfessionalRegistration.cancelButton"
                            )}
                          </button>
                        </div>
                      </>
                    )}
                    {/* <div className="jobseekerAddMore mb-4">
                      <button
                        type="button"
                        className="btn btn-primary me-3 button1"
                        onClick={handleAdd}
                        style={{
                          backgroundColor: primaryColor,
                          color: "white",
                          border: primaryColor,
                        }}
                      >
                        {t("jobseekerProfessionalRegistration.addMoreButton")}
                      </button>
                    </div>
                    <div className="bottomButtons">
                      <button
                        type="button"
                        className="btn btn-primary button1"
                        onClick={handleClick}
                        style={{
                          backgroundColor: hoverFirstButtonColor
                            ? secondaryColor
                            : primaryColor,
                          border: hoverFirstButtonColor
                            ? secondaryColor
                            : primaryColor,
                        }}
                        onMouseEnter={handleFirstButtonMouseEnter}
                        onMouseLeave={handleFirstButtonMouseLeave}
                      >
                        {t("jobseekerProfessionalRegistration.updateButton")}
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary button2"
                        style={{
                          color: hoverThirdButtonColor
                            ? primaryColor
                            : secondaryColor,
                          backgroundColor: "white",
                          border: hoverThirdButtonColor
                            ? `2px solid ${primaryColor}`
                            : `2px solid ${secondaryColor}`,
                        }}
                        onMouseEnter={handleThirdButtonMouseEnter}
                        onMouseLeave={handleThirdButtonMouseLeave}
                      >
                        {t("jobseekerProfessionalRegistration.cancelButton")}
                      </button>
                    </div> */}
                  </div>
                </form>
              </div>
            </div>
          </div>

          <Footer />
        </>
      )}
    </>
  );
};

export default JSProfessionalRegistration;
