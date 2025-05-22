import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import NavBar from "../element/NavBar";
import JoditEditor from "jodit-react";
import Footer from "../element/Footer";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles
const EditProfile = () => {
  const editor = useRef(null);
  const [profileData, setProfileData] = useState([]);
  const [establishmentPhoto, setEstablishmentPhoto] = useState("");
  const [t, i18n] = useTranslation("global");

  const [errors, setErrors] = useState({
    company_name: "",
    company_about: "",
    position: "",
    first_name: "",
    last_name: "",
    address: "",
    location: "",
    contact: "",
    company_contact: "",
    url: "",
  });
  const [loading, setLoading] = useState(false);

  const tokenKey = Cookies.get("tokenClient");
  const navigate = useNavigate();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(BaseApi + "/users/editProfile", null, {
        headers: {
          "Content-Type": "application/json",
          key: ApiKey,
          token: tokenKey,
        },
      });
      setLoading(false);
      if (response.data.status === 200) {
        setProfileData(response.data.response);
        setEstablishmentPhoto(response.data.response.profile_image);
      } else {
        Swal.fire({
          text: response.data.message,
          icon: "error",
          confirmButtonText: t("employerCreateJob.close"),
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
      console.log("User details not received!");
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    // console.log(profileData);
  };

  const scrollToElement = (element) => {
    let ele = document.getElementById(element);
    if (ele) {
      ele.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
        blockOffset: 20,
      });
    } else {
      // console.log("element not found");
    }
  };

  const handleClick = async () => {
    try {
      const newErrors = {};

      if (profileData.company_name === "") {
        newErrors.company_name = t("employerEditProfile.companyNameRequired");
        scrollToElement("form3Example1");
      }

      if (
        profileData.company_about === "" ||
        profileData.company_about === null
      ) {
        newErrors.company_about = t(
          "employerEditProfile.companyProfileRequired"
        );
        scrollToElement("company_about");
      }
      if (profileData.position === "" || profileData.position === null) {
        newErrors.position = t("employerEditProfile.positionRequired");
        scrollToElement("form3Example3");
      }
      if (profileData.first_name === "") {
        newErrors.first_name = t("employerEditProfile.firstNameRequired");
        scrollToElement("form3Example4");
      }
      if (profileData.last_name === "") {
        newErrors.last_name = t("employerEditProfile.lastNameRequired");
        scrollToElement("form3Example5");
      }
      if (profileData.address === "" || profileData.address === null) {
        newErrors.address = t("employerEditProfile.addressRequired");
        scrollToElement("form3Example6");
      }
      if (profileData.location === "" || profileData.location === null) {
        newErrors.location = t("employerEditProfile.locationRequired");
        scrollToElement("form3Example7");
      }
      if (profileData.contact === "") {
        newErrors.contact = t("employerEditProfile.contactNumberRequired");
        scrollToElement("form3Example8");
      } else if (!/^\+?\d{1,3}-?\d{9,15}$/.test(profileData.contact)) {
        newErrors.contact = t("employerEditProfile.contactNumberLength");
        scrollToElement("form3Example8");
      }
      if (profileData.company_contact === "") {
        newErrors.company_contact = t(
          "employerEditProfile.companyContactRequired"
        );
        scrollToElement("form3Example8");
      } else if (!/^\+?\d{1,3}-?\d{9,15}$/.test(profileData.company_contact)) {
        newErrors.company_contact = t(
          "employerEditProfile.contactNumberLength"
        );
        scrollToElement("form3Example8");
      }
      if (profileData.url) {
        const urlFormat = /^https:\/\/(www\.)?[\w.-]+\.[a-z]{2,5}$/i;
        if (profileData.url && !urlFormat.test(profileData.url)) {
          newErrors.url = t("employerCreateJob.urlInvalid");
          // window.scrollTo(0, 0);
        }
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: t("employerEditProfile.editConfirmTitle"),
          text: t("employerEditProfile.editConfirmTxt"),
          icon: "question",
          showCancelButton: true,
          confirmButtonText: t("employerEditProfile.yes"),
          cancelButtonText: t("employerEditProfile.no"),
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseApi + "/users/editProfile",
            profileData,
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
              title: t("employerEditProfile.successTitle"),
              icon: "success",
              confirmButtonText: t("employerEditProfile.close"),
            });
            navigate("/user/myprofile");
          } else {
            Swal.fire({
              title: t("employerCreateJob.createJobFailedTitle"),
              text: response.data.message,
              icon: "error",
              confirmButtonText: t("employerCreateJob.close"),
            });
          }
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
        title: t("employerEditProfile.failedTitle"),
        icon: "error",
        confirmButtonText: t("employerEditProfile.close"),
      });
      console.log("Could not submit edit data!");
    }
  };

  //working
  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   const base64 = await convertToBase64(file);
  //   // console.log(base64);
  //   setProfileData({ ...profileData, profile_image: base64 });
  // };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const fileSizeInBytes = file.size;
    const maxSizeInBytes = 500 * 1024; // 500kb
    if (fileSizeInBytes > maxSizeInBytes) {
      // File size exceeds 500kb, show an error message or take appropriate action
      Swal.fire({
        title: t("employerEditProfile.fileSizeExceed"),
        icon: "warning",
        confirmButtonText: t("employerCreateJob.close"),
      });
      e.target.value = "";
      // console.log("File size exceeds 500kb. Please choose a smaller file.");
      return;
    }

    const base64 = await convertToBase64(file);
    // console.log(base64);
    setProfileData({ ...profileData, profile_image: base64 });
  };

  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  const mapKey = Cookies.get("mapKey");

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

  useEffect(() => {
    // Check if tokenKey is not present
    if (!tokenKey) {
      // Redirect to the home page
      navigate("/user/employerlogin");
    } else {
      // TokenKey is present, fetch data or perform other actions
      getData();
      window.scrollTo(0, 0);
    }
  }, [tokenKey, navigate]);

  // Code for loading Location

  const [autocompleteService, setAutocompleteService] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Load Google Maps AutocompleteService after component mounts
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapKey}&libraries=places`;
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

    setProfileData((prevFilter) => ({
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
    if (profileData.location === "") {
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
          <div className="container editProfile">
            <div className="row">
              <div className="col-lg-3">
                <Sidebar />
              </div>

              <div
                className="col-lg-9 mb-5 CLPanelRight"
                style={{
                  borderLeft: "2px solid #e6e8e7",
                  borderRight: "2px solid #e6e8e7",
                }}
              >
                <div className="d-flex PageHeader">
                  <img src="/Images/employerSide/icon8color.png" alt="" />
                  <h3 className="mx-2">
                    {" "}
                    {t("employerEditProfile.editProfileInfo")}
                  </h3>
                </div>
                <form className="">
                  <div className="mb-5 mt-5">
                    <div className="form-outline mb-4 DashBoardInputBx">
                      <label className="form-label" htmlFor="form3Example1">
                        {t("employerEditProfile.companyName")}
                        <span className="RedStar">*</span>
                      </label>
                      <input
                        type="text"
                        id="form3Example1"
                        className={`form-control ${
                          errors.company_name && "input-error"
                        }`}
                        placeholder={t("employerEditProfile.companyName")}
                        name="company_name"
                        value={profileData.company_name}
                        onChange={handleChange}
                      />
                      {errors.company_name && (
                        <div className="text-danger">{errors.company_name}</div>
                      )}
                    </div>
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx">
                    <label className="form-label" htmlFor="form3Example3">
                      {t("employerEditProfile.companyProfile")}
                      <span className="RedStar">*</span>
                    </label>
                    {/* <JoditEditor
                      ref={editor}
                      name="company_about"
                      id="company_about"
                      value={profileData.company_about}
                      onChange={(company_about) =>
                        handleChange({
                          target: {
                            value: company_about,
                            name: "company_about",
                          },
                        })
                      }
                    /> */}
                    <ReactQuill
                      theme="snow"
                      value={profileData.company_about}
                      onChange={(value) =>
                        handleChange({
                          target: { name: "company_about", value },
                        })
                      }
                      style={{ minHeight: "250px", height: "200px" }}
                      placeholder={t("reactQuill.placeholder")}
                    />
                    {errors.company_about && (
                      <div className="text-danger">{errors.company_about}</div>
                    )}
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx">
                    <label className="form-label" htmlFor="form3Example3">
                      {t("employerEditProfile.position")}
                      <span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example3"
                      className={`form-control ${
                        errors.position && "input-error"
                      }`}
                      name="position"
                      placeholder={t("employerEditProfile.position")}
                      value={profileData.position}
                      onChange={handleChange}
                    />
                    {errors.position && (
                      <div className="text-danger">{errors.position}</div>
                    )}
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx">
                    <label className="form-label" htmlFor="form3Example4">
                      {t("employerEditProfile.firstName")}
                      <span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example4"
                      className={`form-control ${
                        errors.first_name && "input-error"
                      }`}
                      placeholder={t("employerEditProfile.firstName")}
                      name="first_name"
                      value={profileData.first_name}
                      onChange={handleChange}
                    />
                    {errors.first_name && (
                      <div className="text-danger">{errors.first_name}</div>
                    )}
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx">
                    <label className="form-label" htmlFor="form3Example5">
                      {t("employerEditProfile.lastName")}
                      <span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example5"
                      className={`form-control ${
                        errors.last_name && "input-error"
                      }`}
                      placeholder={t("employerEditProfile.lastName")}
                      name="last_name"
                      value={profileData.last_name}
                      onChange={handleChange}
                    />
                    {errors.last_name && (
                      <div className="text-danger">{errors.last_name}</div>
                    )}
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx">
                    <label className="form-label" htmlFor="form3Example6">
                      {t("employerEditProfile.address")}
                      <span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example6"
                      className={`form-control ${
                        errors.address && "input-error"
                      }`}
                      placeholder={t("employerEditProfile.address")}
                      name="address"
                      value={profileData.address}
                      onChange={handleChange}
                    />
                    {errors.address && (
                      <div className="text-danger">{errors.address}</div>
                    )}
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx">
                    <label className="form-label" htmlFor="form3Example7">
                      {t("employerEditProfile.location")}
                      <span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example7"
                      className={`form-control ${
                        errors.location && "input-error"
                      }`}
                      placeholder={t("employerEditProfile.location")}
                      name="location"
                      value={profileData.location}
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
                  <div className="form-outline mb-5 DashBoardInputBx">
                    <label className="form-label" htmlFor="form3Example8">
                      {t("employerEditProfile.contactNumber")}
                      <span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example8"
                      className={`form-control ${
                        errors.contact && "input-error"
                      }`}
                      placeholder={t("employerEditProfile.contactNumber")}
                      name="contact"
                      value={profileData.contact}
                      onChange={handleChange}
                    />
                    {errors.contact && (
                      <div className="text-danger">{errors.contact}</div>
                    )}
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx">
                    <label className="form-label" htmlFor="form3Example8">
                      {t("employerEditProfile.companyContactNumber")}
                      <span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example8"
                      className={`form-control ${
                        errors.company_contact && "input-error"
                      }`}
                      placeholder={t(
                        "employerEditProfile.companyContactNumber"
                      )}
                      name="company_contact"
                      value={profileData.company_contact}
                      onChange={handleChange}
                    />
                    {errors.company_contact && (
                      <div className="text-danger">
                        {errors.company_contact}
                      </div>
                    )}
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx">
                    <label className="form-label" htmlFor="form3Example9">
                      {t("employerEditProfile.companyWebsite")}
                    </label>
                    <input
                      type="text"
                      id="form3Example9"
                      className="form-control"
                      placeholder={t("employerEditProfile.companyWebsite")}
                      name="url"
                      value={profileData.url}
                      onChange={handleChange}
                    />
                    {errors.url && (
                      <div className="text-danger">{errors.url}</div>
                    )}
                    <div id="emailHelp" className="form-text">
                      {t("employerEditProfile.belowTxt1")}
                    </div>
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx">
                    <label htmlFor="formFile" className="form-label">
                      {t("employerEditProfile.uploadEstablishmentPhoto")}
                    </label>
                    <input
                      id="formFile"
                      className="form-select"
                      aria-label="Default select example"
                      type="file"
                      lable="Image"
                      name="photo"
                      accept=".jpeg, .png, .jpg, .gif"
                      onChange={(e) => handleFileUpload(e)}
                    />
                    <div id="emailHelp" className="form-text">
                      {t("employerEditProfile.belowTxt2")}{" "}
                    </div>
                    <div className="ChangePhotoEmployers mb-4 mt-5">
                      {establishmentPhoto ? (
                        <img src={establishmentPhoto} alt="profile" />
                      ) : (
                        <img
                          src="/Images/jobseekerSide/dummy-profile.png"
                          alt=""
                        />
                      )}
                    </div>
                  </div>
                  <div className="bottomButtons">
                    <button
                      type="button"
                      className="btn btn-primary button1"
                      onClick={handleClick}
                      style={{
                        backgroundColor: hoverSearchColor
                          ? secondaryColor
                          : primaryColor,
                        border: hoverSearchColor
                          ? secondaryColor
                          : primaryColor,
                      }}
                      onMouseEnter={handleSearchMouseEnter}
                      onMouseLeave={handleSearchMouseLeave}
                    >
                      {t("employerEditProfile.updateButton")}
                    </button>
                    <Link
                      to="/user/myprofile"
                      type="button"
                      className="btn btn-primary button2"
                      style={{
                        color: hoverUploadCVColor
                          ? primaryColor
                          : secondaryColor,
                        backgroundColor: "white",
                        border: hoverUploadCVColor
                          ? `2px solid ${primaryColor}`
                          : `2px solid ${secondaryColor}`,
                      }}
                      onMouseEnter={handleUploadCVMouseEnter}
                      onMouseLeave={handleUploadCVMouseLeave}
                    >
                      {t("employerEditProfile.cancelButton")}
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

export default EditProfile;

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
