import React, { useEffect, useState } from "react";
import Footer from "../element/Footer";
import JSSidebar from "./JSSidebar";
import NavBar from "../element/NavBar";
import axios from "axios";
import ApiKey from "../api/ApiKey";
import BaseApi from "../api/BaseApi";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useTranslation } from "react-i18next";

const JSAddAlert = () => {
  const [loading, setLoading] = useState(false);
  const [addAlert, setAddAlert] = useState({
    location: "",
    designation: "",
  });
  const [errors, setErrors] = useState({
    location: "",
    designation: "",
  });
  const [designationList, setDesignationList] = useState([]);
  const tokenKey = Cookies.get("tokenClient");
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
        BaseApi + "/alerts/add",
        null, // Pass null as the request body if not required
        {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            token: tokenKey,
          },
        }
      );
      if (response.data.status === 200) {
        setLoading(false);
        setDesignationList(response.data.response.designationlList);
      }
      if (response.data.status === 400) {
        setLoading(false);
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: t("searchJobPage.close"),
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
      console.log("Cannot get designation list of add alert page");
    }
  };

  useEffect(() => {
    getData();
    window.scrollTo(0, 0);
  }, []);

  const handleClick = async () => {
    try {
      const newErrors = {};

      if (addAlert.location === "") {
        newErrors.location = t("jobseekerAddAlert.locationRequired");
        window.scrollTo(0, 0);
      }

      if (addAlert.designation === "") {
        newErrors.designation = t("jobseekerAddAlert.workingRelationRequired");
        window.scrollTo(0, 0);
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: t("jobseekerAddAlert.confirmTitle"),
          text: t("jobseekerAddAlert.confirmTxt"),
          icon: "question",
          showCancelButton: true,
          confirmButtonText: t("jobseekerAddAlert.yes"),
          cancelButtonText: t("jobseekerAddAlert.no"),
        });
        if (confirmationResult.isConfirmed) {
          const response = await axios.post(
            BaseApi + "/alerts/add",
            addAlert, // Pass null as the request body if not required
            {
              headers: {
                "Content-Type": "application/json",
                key: ApiKey,
                token: tokenKey,
              },
            }
          );
          if (response.data.status === 200) {
            Swal.fire({
              title: t("jobseekerAddAlert.successTxt"),
              icon: "success",
              confirmButtonText: t("jobseekerAddAlert.close"),
            });
            navigate("/alerts/index");
          } else if (response.data.status === 400) {
            setLoading(false);
            Cookies.remove("tokenClient");
            Cookies.remove("user_type");
            Cookies.remove("fname");
            navigate("/");
            Swal.fire({
              title: response.data.message,
              icon: "warning",
              confirmButtonText: t("searchJobPage.close"),
            });
          } else {
            Swal.fire({
              title: response.data.message,
              icon: "warning",
              confirmButtonText: t("searchJobPage.close"),
            });
          }
        }
      }
    } catch (error) {
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
        title: t("jobseekerAddAlert.failedTxt"),
        icon: "error",
        confirmButtonText: t("jobseekerAddAlert.close"),
      });
      console.log("Cannot add alert!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddAlert((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Code for loading Location

  const [autocompleteService, setAutocompleteService] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Load Google Maps AutocompleteService after component mounts
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAfLv-IdHZm0Xy3kYlAm3TypjjqeUjra9Q&libraries=places`;
    script.onload = () => {
      setAutocompleteService(
        new window.google.maps.places.AutocompleteService()
      );
      console.log(autocompleteService);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLocationChange = (e) => {
    const { value } = e.target;
    setSuggestionTaken(false);
    if (value == "") {
      setSuggestionTaken(true);
    }
    if (value != "") {
      setErrors({
        location: "",
      });
    }

    setAddAlert((prevFilter) => ({
      ...prevFilter,
      location: value,
    }));

    if (autocompleteService) {
      // Call Google Maps Autocomplete API
      autocompleteService.getPlacePredictions(
        {
          input: value,
          types: ["(cities)"], // Restrict to cities if needed
        },
        (predictions, status) => {
          if (status === "OK" && predictions) {
            setSuggestions(
              predictions.map((prediction) => prediction.description)
            );
          } else {
            setSuggestions([]);
          }
        }
      );
    }
    if (addAlert.location === "") {
      setSuggestions([]);
    }
  };
  const [suggestionTaken, setSuggestionTaken] = useState(false);

  const handleSuggestionClick = (suggestion) => {
    // Update the input value with the clicked suggestion
    handleLocationChange({ target: { name: "location", value: suggestion } });

    setSuggestionTaken(true);
    // Clear the suggestions
    setSuggestions([]);
    // console.log(filterItem);
  };

  return (
    <>
      <NavBar />
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <div className="container changePassword JSEditAlert createJob">
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
                <div className="d-flex mx-3 PageHeader">
                  <img src="/Images/employerSide/icon9color.png" alt="" />
                  <h3 className="mx-2">{t("jobseekerAddAlert.addAlert")}</h3>
                </div>
                <form>
                  <div className="mb-5 mt-5">
                    <div class="form-outline mb-5 DashBoardInputBx">
                      <label class="form-label" for="form3Example1">
                        {t("jobseekerAddAlert.location")}{" "}
                        <span className="RedStar">*</span>
                      </label>
                      <input
                        type="text"
                        id="form3Example1"
                        className={`form-control ${
                          errors.location && "input-error"
                        }`}
                        placeholder={t("jobseekerAddAlert.location")}
                        value={addAlert.location}
                        name="location"
                        onChange={handleLocationChange}
                      />
                      {suggestions.length > 0 && (
                        <div
                          className="suggestions"
                          style={{ display: suggestionTaken ? "none" : "" }}
                        >
                          <ul className="locationDropdown">
                            {suggestions.map((suggestion, index) => (
                              <div key={index} className="suggestion-item">
                                <li
                                  onClick={() =>
                                    handleSuggestionClick(suggestion)
                                  }
                                >
                                  <div className="eachLocation">
                                    <div className="locationIcon">
                                      <LocationOnIcon fontSize="small" />
                                    </div>{" "}
                                    <div className="locationSuggestion">
                                      {suggestion}
                                    </div>
                                  </div>{" "}
                                </li>
                              </div>
                            ))}
                          </ul>
                        </div>
                      )}
                      {errors.location && (
                        <div className="text-danger">{errors.location}</div>
                      )}
                    </div>
                    <div class="form-outline mb-5 DashBoardInputBx">
                      <label className="form-label" htmlFor="form3Example3">
                        {t("jobseekerAddAlert.workingRelation")}
                        <span className="RedStar">*</span>
                      </label>
                      <select
                        className={`form-select ${
                          errors.designation && "input-error"
                        }`}
                        aria-label="Default select example"
                        name="designation"
                        value={addAlert.designation}
                        onChange={handleChange}
                      >
                        <option selected value="">
                          {t("jobseekerAddAlert.selectWorkingRelation")}
                        </option>
                        {designationList.map((i) => {
                          return <option value={i.id}>{i.name}</option>;
                        })}
                      </select>
                      {errors.designation && (
                        <div className="text-danger">{errors.designation}</div>
                      )}
                    </div>
                  </div>
                  <div className="bottomButtons EditAlertButtons">
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
                      {t("jobseekerAddAlert.submitButton")}
                    </button>
                    <Link
                      to="/alerts/index"
                      type="button"
                      className="btn btn-primary button2"
                      style={{
                        color: hoverSecondButtonColor
                          ? primaryColor
                          : secondaryColor,
                        backgroundColor: "white",
                        border: hoverSecondButtonColor
                          ? `2px solid ${primaryColor}`
                          : `2px solid ${secondaryColor}`,
                      }}
                      onMouseEnter={handleSecondButtonMouseEnter}
                      onMouseLeave={handleSecondButtonMouseLeave}
                    >
                      {t("jobseekerAddAlert.backButton")}
                    </Link>
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

export default JSAddAlert;
