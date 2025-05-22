import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import NavBar from "../element/NavBar";
import Footer from "../element/Footer";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import { useNavigate, useParams } from "react-router-dom";
import HTMLReactParser from "html-react-parser";
import Select from "react-select";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles
const CopyJob = () => {
  const editor = useRef(null);
  const tokenKey = Cookies.get("tokenClient");
  const navigate = useNavigate();
  const { slug } = useParams();
  const [t, i18n] = useTranslation("global");

  const [open, setOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const handleOpen = (plan) => {
    console.log(plan);
    setSelectedPayment(plan);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedPayment(null);
    setOpen(false);
  };

  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");

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
      // getData();
      window.scrollTo(0, 0);
    }
  }, [tokenKey, navigate]);

  const [jobData, setJobData] = useState({
    job_title: "",
    category: "",
    subCategory: [],
    jobDescription: "",
    company_name: "",
    companyProfile: "",
    work_type: "",
    contact_name: "",
    contact_number: "",
    company_website: "",
    skill: "",
    designation: "",
    location: "",
    experience: "",
    annual_salary: "",
    logo: "",
    last_date: "",
  });

  const [errors, setErrors] = useState({
    job_title: "",
    category: "",
    subCategory: [],
    jobDescription: "",
    company_name: "",
    companyProfile: "",
    work_type: "",
    contact_name: "",
    contact_number: "",
    skill: "",
    designation: "",
    location: "",
    experience: "",
    annual_salary: "",
    last_date: "",
  });

  const [totalData, setTotalData] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [skillList, setSkillList] = useState([]);
  const [experience, setExperience] = useState([]);
  const [salary, setSalary] = useState([]);
  const [workType, setWorkType] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // const [selectedSkills, setSelectedSkills] = useState([]);

  const [skillValidationError, setSkillValidationError] = useState("");

  const handleSkillChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions); // Update selected skills

    // console.log(selectedOptions);

    // Check if selectedOptions is not empty
    // if (selectedOptions.length > 0) {
    //   setSkillValidationError(""); // Clear the error message
    // } else {
    //   setSkillValidationError("Skill is required");
    // }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "skill") {
      setJobData((prevJobData) => ({
        ...prevJobData,
        skill: [...prevJobData.skill, value],
      }));
    } else if (name === "subCategory") {
      setJobData((prevJobData) => ({
        ...prevJobData,
        subCategory: [...prevJobData.subCategory, value],
      }));
    } else {
      setJobData((prevJobData) => ({
        ...prevJobData,
        [name]: value,
      }));
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/job/createJob/${slug}`,
        null,
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
        // console.log(response);

        var skillList = response.data.response.skillList;
        var selectedSkillsName = response.data.response.job_details.skill;
        var SelectSkills = [];

        skillList.forEach((element) => {
          for (let i = 0; i < selectedSkillsName.length; i++) {
            if (parseInt(selectedSkillsName[i]) == element.id) {
              let obj = {
                value: element.id,
                label: element.name,
              };
              SelectSkills.push(obj);
            }
          }
        });
        // console.log(SelectSkills);
        setSelectedSkills(SelectSkills);
        setJobData(response.data.response.job_details);
        setTotalData(response.data);
        setJobCategories(response.data.response.categories);
        setDesignationList(response.data.response.designationlList);
        setSkillList(response.data.response.skillList);
        setExperience(response.data.response.experience);
        setSalary(response.data.response.sallery);
        setWorkType(response.data.response.worktype);
        // console.log(totalData);
      } else if (response.data.status === 400) {
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: t("employerCreateJob.close"),
        });
      } else {
        Swal.fire({
          title: response.data.message,
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
      console.log("No data received");
    }
  };

  const getSubCategories = async (id) => {
    try {
      const subCatData = await axios.post(
        BaseApi + `/categories/getSubCategory/${id}`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            token: tokenKey,
          },
        }
      );
      setSubCategories(subCatData.data.response);
    } catch (error) {
      console.log("Couldn't get Sub category data!");
    }
  };

  useEffect(() => {
    getData();
    getSubCategories();
    window.scrollTo(0, 0);
  }, []);

  const handleClick = async () => {
    var skills = document.getElementsByName("skill");
    var skillArray = [];

    skills.forEach((element) => {
      skillList.forEach((skill) => {
        if (skill.id == element.value) {
          skillArray.push(skill.id);
        }
      });
    });

    // Check initial skill validation
    // if (selectedSkills.length === 0) {
    //   setSkillValidationError("Skill is required");
    // }

    try {
      const newErrors = {};

      if (jobData.annual_salary === "") {
        newErrors.annual_salary = t("employerCreateJob.annualSalaryRequired");
        window.scrollTo(0, 0);
      }

      if (jobData.category === "") {
        newErrors.category = t("employerCreateJob.categoryRequired");
        window.scrollTo(0, 0);
      }
      if (jobData.companyProfile === "") {
        newErrors.companyProfile = t(
          "employerCreateJob.companyProfileRequired"
        );
        window.scrollTo(0, 0);
      }
      if (jobData.company_name === "") {
        newErrors.company_name = t("employerCreateJob.companyNameRequired");
        window.scrollTo(0, 0);
      }
      if (jobData.contact_name === "") {
        newErrors.contact_name = t("employerCreateJob.contactNameRequired");
        window.scrollTo(0, 0);
      }

      if (jobData.contact_number === "") {
        newErrors.contact_number = t("employerCreateJob.contactNumberRequired");
        window.scrollTo(0, 0);
      }
      // else if (!/^\+?\d{1,3}-?\d{9,15}$/.test(jobData.company_contact)) {
      //   newErrors.contact_number =
      //     "Contact Number under 15 digits and contain only digits.";
      //   window.scrollTo(0, 0);
      // }

      if (jobData.designation === "") {
        newErrors.designation = t("employerCreateJob.workingRelationRequired");
        window.scrollTo(0, 0);
      }
      if (jobData.experience === "") {
        newErrors.experience = t("employerCreateJob.experienceRequired");
        window.scrollTo(0, 0);
      }
      if (jobData.jobDescription === "") {
        newErrors.jobDescription = t(
          "employerCreateJob.jobDescriptionRequired"
        );
        window.scrollTo(0, 0);
      }
      if (jobData.job_title === "") {
        newErrors.job_title = t("employerCreateJob.jobTitleRequired");
        window.scrollTo(0, 0);
      }
      if (jobData.last_date === "") {
        newErrors.last_date = t("employerCreateJob.lastDateRequired");
        window.scrollTo(0, 0);
      }
      if (jobData.location === "") {
        newErrors.location = t("employerCreateJob.locationRequired");
        window.scrollTo(0, 0);
      }
      // if (jobData.skill === "") {
      //   newErrors.skill = "Skill is required";
      //   window.scrollTo(0, 0);
      // }
      // if (jobData.subCategory === "") {
      //   newErrors.subCategory = "Sub Category is required";
      //   window.scrollTo(0, 0);
      // }
      if (jobData.work_type === "") {
        newErrors.work_type = t("employerCreateJob.workTypeRequired");
        window.scrollTo(0, 0);
      }

      if (jobData.company_website) {
        const urlFormat = /^https:\/\/(www\.)?[\w.-]+\.[a-z]{2,5}$/i;
        if (
          jobData.company_website &&
          !urlFormat.test(jobData.company_website)
        ) {
          newErrors.company_website = t("employerCreateJob.urlInvalid");
          window.scrollTo(0, 0);
        }
      }

      setErrors(newErrors);

      if (skillValidationError) {
        return;
      }

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: t("employerCreateJob.copyJobConfirmTitle"),
          text: t("employerCreateJob.copyJobConfirmTxt"),
          icon: "question",
          showCancelButton: true,
          confirmButtonText: t("employerCreateJob.yes"),
          cancelButtonText: t("employerCreateJob.no"),
        });
        if (confirmationResult.isConfirmed) {
          console.log(jobData);

          const updatedProfile = {
            ...jobData,
            skill: skillArray,
          };

          setLoading(true);
          const response = await axios.post(
            BaseApi + "/job/createJob",
            updatedProfile,
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
            Swal.fire({
              title: t("employerCreateJob.copyJobSuccessTitle"),
              icon: "success",
              confirmButtonText: t("employerCreateJob.close"),
            });
            navigate("/user/managejob");
          } else if (response.data.status === 400) {
            Cookies.remove("tokenClient");
            Cookies.remove("user_type");
            Cookies.remove("fname");
            navigate("/");
            Swal.fire({
              title: response.data.message,
              icon: "warning",
              confirmButtonText: t("employerCreateJob.close"),
            });
          } else {
            setLoading(false);
            Swal.fire({
              title: t("employerCreateJob.copyJobFailedTitle"),
              text: HTMLReactParser(response.data.message),
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
        title: t("employerCreateJob.copyJobFailedTxt"),
        icon: "error",
        confirmButtonText: t("employerCreateJob.close"),
      });
      console.log(jobData);
      console.log("Could not submit job data");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    // console.log(base64);
    setJobData({ ...jobData, logo: base64 });
  };

  const getWorkType = (id) => {
    // console.log(id, "work");
    if (id == 1) {
      return "Full Time";
    }
    if (id == 2) {
      return "Part Time";
    }
    if (id == 3) {
      return "Casual";
    }
    if (id == 4) {
      return "Seasonal";
    }
    if (id == 5) {
      return "Fixed Term";
    }
  };

  const getCategoryName = (catId) => {
    for (let i = 0; i < jobCategories.length; i++) {
      if (jobCategories[i].id == catId) {
        return jobCategories[i].name;
      }
    }
  };

  const getDesignationName = (designationId) => {
    for (let i = 0; i < designationList.length; i++) {
      if (designationList[i].id == designationId) {
        return designationList[i].name;
      }
    }
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
      // console.log(autocompleteService);
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

    setJobData((prevFilter) => ({
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
    if (jobData.location === "") {
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

  function handleLastDateChange(event) {
    const { name, value } = event.target;
    let currentDate = new Date();
    let selectedDate = new Date(value);

    if (name === "last_date" && selectedDate < currentDate) {
      // If the selected date is older than the current date, reset the value to current date
      const formattedCurrentDate = currentDate.toISOString().split("T")[0];
      // Update the state with the current date
      setJobData({ ...jobData, [name]: formattedCurrentDate });
    } else {
      // Update the state with the selected value
      setJobData({ ...jobData, [name]: value });
    }
  }

  return (
    <>
      <NavBar />
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <div className="container createJob">
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
                  <img src="/Images/employerSide/icon1color.png" alt="" />
                  <h3 className="mx-2">{t("employerCreateJob.copyJob")}</h3>
                </div>
                <form>
                  <div className="mb-5 mt-4">
                    <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                      <label className="form-label" htmlFor="form3Example1">
                        {t("employerCreateJob.jobTitle")}
                        <span className="RedStar">*</span>
                      </label>
                      <input
                        type="text"
                        id="form3Example1"
                        className={`form-control ${
                          errors.job_title && "input-error"
                        }`}
                        name="job_title"
                        value={jobData.job_title}
                        placeholder={t("employerCreateJob.jobTitle")}
                        onChange={handleChange}
                      />
                      {errors.job_title && (
                        <div className="text-danger">{errors.job_title}</div>
                      )}
                    </div>

                    <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                      <label className="form-label" htmlFor="form3Example1">
                        {t("employerCreateJob.category")}
                        <span className="RedStar">*</span>
                      </label>
                      <select
                        className={`form-select ${
                          errors.category && "input-error"
                        }`}
                        aria-label="Default select example"
                        name="category"
                        value={jobData.category}
                        onChange={(e) => {
                          handleChange(e);
                          getSubCategories(e.target.value);
                        }}
                      >
                        <option value="">
                          {t("employerCreateJob.selectJobCategory")}
                        </option>
                        {jobCategories.map((i, index) => (
                          <option value={i.id} key={index}>
                            {i.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <div className="text-danger">{errors.category}</div>
                      )}
                    </div>
                  </div>
                  {jobData.category && subCategories ? (
                    <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                      <label className="form-label" htmlFor="form3Example1">
                        {t("employerCreateJob.subCategory")}
                        <span className="RedStar">*</span>
                      </label>
                      <select
                        className={`form-select ${
                          errors.subCategory && "input-error"
                        }`}
                        aria-label="Default select example"
                        name="subCategory"
                        value={jobData.subCategory}
                        onChange={handleChange}
                      >
                        <option selected value="">
                          {t("employerCreateJob.selectSubCategory")}
                        </option>
                        {subCategories?.map((i, index) => {
                          return (
                            <option key={index} value={i.id}>
                              {i.name}
                            </option>
                          );
                        })}
                      </select>
                      {errors.subCategory && (
                        <div className="text-danger">{errors.subCategory}</div>
                      )}
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example3">
                      {t("employerCreateJob.jobDescription")}
                      <span className="RedStar">*</span>
                    </label>
                    {/* <JoditEditor
                      ref={editor}
                      name="jobDescription"
                      value={jobData.jobDescription}
                      onChange={(jobDescription) =>
                        handleChange({
                          target: {
                            value: jobDescription,
                            name: "jobDescription",
                          },
                        })
                      }
                    /> */}

                    <ReactQuill
                      theme="snow"
                      value={jobData.jobDescription}
                      onChange={(value) =>
                        handleChange({
                          target: { name: "jobDescription", value },
                        })
                      }
                      style={{ minHeight: "250px", height: "200px" }}
                      placeholder={t("reactQuill.placeholder")}
                    />
                    {errors.jobDescription && (
                      <div className="text-danger">{errors.jobDescription}</div>
                    )}
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example3">
                      {t("employerCreateJob.companyName")}
                      <span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example3"
                      className={`form-control ${
                        errors.company_name && "input-error"
                      }`}
                      name="company_name"
                      value={jobData.company_name}
                      placeholder={t("employerCreateJob.companyName")}
                      onChange={handleChange}
                    />
                    {errors.company_name && (
                      <div className="text-danger">{errors.company_name}</div>
                    )}
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example3">
                      {t("employerCreateJob.companyProfile")}
                      <span className="RedStar">*</span>
                    </label>
                    {/* <JoditEditor
                      ref={editor}
                      name="companyProfile"
                      value={jobData.companyProfile}
                      onChange={(companyProfile) =>
                        handleChange({
                          target: {
                            value: companyProfile,
                            name: "companyProfile",
                          },
                        })
                      }
                    /> */}
                    <ReactQuill
                      theme="snow"
                      value={jobData.companyProfile}
                      onChange={(companyProfile) =>
                        handleChange({
                          target: {
                            name: "companyProfile",
                            value: companyProfile,
                          },
                        })
                      }
                      style={{ minHeight: "250px", height: "200px" }}
                      placeholder={t("reactQuill.placeholder")}
                    />
                    {errors.companyProfile && (
                      <div className="text-danger">{errors.companyProfile}</div>
                    )}
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example1">
                      {t("employerCreateJob.workType")}
                      <span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.work_type && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="work_type"
                      value={jobData.work_type}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        {t("employerCreateJob.selectWorkType")}
                      </option>
                      {Object.entries(workType).map(([key, value]) => {
                        return (
                          <>
                            <option key={key} value={key}>
                              {value}
                            </option>
                          </>
                        );
                      })}
                    </select>
                    {errors.work_type && (
                      <div className="text-danger">{errors.work_type}</div>
                    )}
                  </div>

                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example3">
                      {t("employerCreateJob.contactName")}
                      <span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example3"
                      className={`form-control ${
                        errors.contact_name && "input-error"
                      }`}
                      name="contact_name"
                      value={jobData.contact_name}
                      placeholder={t("employerCreateJob.contactName")}
                      onChange={handleChange}
                    />
                    {errors.contact_name && (
                      <div className="text-danger">{errors.contact_name}</div>
                    )}
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example3">
                      {t("employerCreateJob.contactNumber")}
                      <span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example3"
                      className={`form-control ${
                        errors.contact_number && "input-error"
                      }`}
                      name="contact_number"
                      value={jobData.contact_number}
                      placeholder={t("employerCreateJob.contactNumber")}
                      onChange={handleChange}
                    />
                    {errors.contact_number && (
                      <div className="text-danger">{errors.contact_number}</div>
                    )}
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example3">
                      {t("employerCreateJob.companyWebsite")}
                    </label>
                    <input
                      type="text"
                      id="form3Example3"
                      className="form-control"
                      name="company_website"
                      value={jobData.company_website}
                      placeholder={t("employerCreateJob.companyWebsite")}
                      onChange={handleChange}
                    />
                    {errors.company_website && (
                      <div className="text-danger">
                        {errors.company_website}
                      </div>
                    )}
                    <div id="emailHelp" className="form-text">
                      Eg: https://www.google.com or http://google.com
                    </div>
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx skillPackage">
                    <label className="form-label" htmlFor="form3Example1">
                      {t("employerCreateJob.skills")}
                    </label>
                    <Select
                      defaultValue={selectedSkills}
                      isMulti
                      isSearchable
                      name="skill"
                      options={skillList.map((i) => ({
                        value: i.id,
                        label: i.name,
                      }))}
                      className="basic-multi-select"
                      classNamePrefix={t("employerCreateJob.selectSkills")}
                      value={selectedSkills}
                      onChange={handleSkillChange}
                    />
                    {skillValidationError && (
                      <div className="text-danger">{skillValidationError}</div>
                    )}
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example1">
                      {t("employerCreateJob.workingRelation")}
                      <span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.designation && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="designation"
                      value={jobData.designation}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        {t("employerCreateJob.chooseWorkingRelation")}
                      </option>
                      {designationList.map((i, index) => {
                        return (
                          <>
                            <option value={i.id} key={index}>
                              {i.name}
                            </option>
                          </>
                        );
                      })}
                    </select>
                    {errors.designation && (
                      <div className="text-danger">{errors.designation}</div>
                    )}
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example3">
                      {t("employerCreateJob.location")}
                      <span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example3"
                      className={`form-control ${
                        errors.location && "input-error"
                      }`}
                      name="location"
                      value={jobData.location}
                      placeholder={t("employerCreateJob.location")}
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
                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example1">
                      {t("employerCreateJob.experience(inYears)")}
                      <span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.experience && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="experience"
                      value={jobData.experience}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        {t("employerCreateJob.chooseExp")}
                      </option>
                      {Object.entries(experience).map(([key, value]) => {
                        return (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        );
                      })}
                    </select>
                    {errors.experience && (
                      <div className="text-danger">{errors.experience}</div>
                    )}
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example1">
                      {t("employerCreateJob.annualSalary")}
                      <span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.annual_salary && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="annual_salary"
                      value={jobData.annual_salary}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        {t("employerCreateJob.selectSalary")}
                      </option>
                      {Object.entries(salary).map(([key, value]) => {
                        return (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        );
                      })}
                    </select>
                    {errors.annual_salary && (
                      <div className="text-danger">{errors.annual_salary}</div>
                    )}
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label htmlFor="formFile" className="form-label">
                      {t("employerCreateJob.companyLogo")}
                    </label>
                    <input
                      className="form-select"
                      aria-label="Default select example"
                      type="file"
                      lable="Image"
                      name="logo"
                      id="file-upload"
                      accept=".jpeg, .png, .jpg"
                      onChange={(e) => handleFileUpload(e)}
                    />
                    <div id="emailHelp" className="form-text">
                      {t("employerCreateJob.belowTxt1")}
                    </div>
                    <div className="EPEJimageViewer">
                      <img
                        src={
                          jobData.logo_path
                            ? jobData.logo_path
                            : "/Images/jobseekerSide/dummy-profile.png"
                        }
                        alt=""
                        
                      />
                      {jobData.logo ? (
                        <button
                          className="btn-sm btn-outline-dark button1 ml-3"
                          style={{}}
                          onClick={() => setJobData({ ...jobData, logo: "" })}
                        >
                          {t("employerCreateJob.deleteButton")}
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example3">
                      {t("employerCreateJob.lastDate")}
                      <span className="RedStar">*</span>
                    </label>
                    <input
                      type="date"
                      id="form3Example3"
                      className={`form-control ${
                        errors.last_date && "input-error"
                      }`}
                      name="last_date"
                      value={jobData.last_date}
                      placeholder={t("employerCreateJob.lastDate")}
                      onChange={handleLastDateChange}
                    />
                    {errors.last_date && (
                      <div className="text-danger">{errors.last_date}</div>
                    )}
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
                      {t("employerCreateJob.copyJobButton")}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary button2"
                      onClick={() => handleOpen(jobData)}
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
                      {t("employerCreateJob.previewButton")}
                    </button>
                    <div>
                      <Modal
                        className="modalMain"
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box className="modal adminModal modal-content">
                          <IconButton
                            onClick={handleClose}
                            className="close-button"
                            style={{
                              position: "absolute",
                              top: 10,
                              right: 10,
                            }}
                          >
                            &times;
                          </IconButton>

                          <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                          ></Typography>
                          <Typography
                            id="modal-modal-description"
                            sx={{ mt: 3 }}
                          >
                            {selectedPayment && (
                              <div className="modals ">
                                <div className="modalHead">
                                  <h1
                                    style={{
                                      color: secondaryColor,
                                    }}
                                  >
                                    {selectedPayment.job_title}
                                  </h1>
                                </div>
                                <div className="modalBody mt-4">
                                  <div className="modalParent">
                                    <div className="modalLeft">
                                      {t("employerCreateJob.workType")}:{" "}
                                    </div>
                                    <div className="modalRight">
                                      {getWorkType(selectedPayment.work_type)}
                                    </div>
                                  </div>

                                  <div className="modalParent">
                                    <div className="modalLeft">
                                      {t("employerCreateJob.location")}:{" "}
                                    </div>
                                    <div className="modalRight">
                                      {selectedPayment.location}
                                    </div>
                                  </div>

                                  <div className="modalParent">
                                    <div className="modalLeft">
                                      {t("employerCreateJob.companyName")}:{" "}
                                    </div>
                                    <div className="modalRight">
                                      {jobData.company_name}
                                    </div>
                                  </div>
                                  <div className="modalParent">
                                    <div className="modalLeft">
                                      {t("employerCreateJob.companyWebsite")}:{" "}
                                    </div>
                                    <div className="modalRight">
                                      {selectedPayment.company_website}
                                    </div>
                                  </div>

                                  <div className="modalParent">
                                    <div className="modalLeft">
                                      {t("employerCreateJob.jobType")}:{" "}
                                    </div>
                                    <div className="modalRight">
                                      {getWorkType(selectedPayment.work_type)}
                                    </div>
                                  </div>

                                  <div className="modalParent">
                                    <div className="modalLeft">
                                      {t("employerCreateJob.category")}:{" "}
                                    </div>
                                    <div className="modalRight">
                                      {getCategoryName(
                                        selectedPayment.category
                                      )}
                                    </div>
                                  </div>
                                  <div className="modalParent">
                                    <div className="modalLeft">
                                      {t(
                                        "employerCreateJob.experience(inYears)"
                                      )}
                                      :{" "}
                                    </div>
                                    <div className="modalRight">
                                      {Object.entries(experience).map(
                                        ([key, value]) => {
                                          if (
                                            key == selectedPayment.experience
                                          ) {
                                            return value;
                                          }
                                        }
                                      )}
                                    </div>
                                  </div>
                                  <div className="modalParent">
                                    <div className="modalLeft">
                                      {t("employerCreateJob.annualSalary")}:{" "}
                                    </div>
                                    <div className="modalRight">
                                      {Object.entries(salary).map(
                                        ([key, value]) => {
                                          if (
                                            key == selectedPayment.annual_salary
                                          ) {
                                            return value;
                                          }
                                        }
                                      )}
                                    </div>
                                  </div>
                                  <div className="modalParent">
                                    <div className="modalLeft">
                                      {t("employerCreateJob.skills")}:{" "}
                                    </div>
                                    <div className="modalRight">
                                      {selectedSkills.map((i) => {
                                        return i.label + " ";
                                      })}
                                    </div>
                                  </div>
                                  <div className="modalParent">
                                    <div className="modalLeft">
                                      {t("employerCreateJob.workingRelation")}:{" "}
                                    </div>
                                    <div className="modalRight">
                                      {getDesignationName(
                                        selectedPayment.designation
                                      )}
                                    </div>
                                  </div>
                                  <div className="modalParent">
                                    <div className="modalLeft">
                                      {t("employerCreateJob.jobDescription")}:{" "}
                                    </div>
                                    <div className="modalRight">
                                      {selectedPayment.jobDescription
                                        ? HTMLReactParser(
                                            selectedPayment.jobDescription
                                          )
                                        : ""}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Typography>
                        </Box>
                      </Modal>
                    </div>
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

export default CopyJob;

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
