import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import NavBar from "../element/NavBar";
import Footer from "../element/Footer";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import { useNavigate } from "react-router-dom";
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
const CreateJob = () => {
  const editor = useRef(null);
  const tokenKey = Cookies.get("tokenClient");
  const navigate = useNavigate();
  const [t, i18n] = useTranslation("global");

  const [open, setOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const handleOpen = (plan) => {
    // console.log(plan);
    setSelectedPayment(plan);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedPayment(null);
    setOpen(false);
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

  const [selectedSkills, setSelectedSkills] = useState([]);

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

  const [jobData, setJobData] = useState({
    job_title: "",
    category: "",
    subCategory: [],
    jobDescription: "",
    company_name: "",
    skill: "",
    companyProfile: "",
    work_type: "",
    contact_name: "",
    contact_number: "",
    company_website: "",
    designation: "",
    location: "",
    experience: "",
    annual_salary: "",
    logo: "",
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
  const [selectedCategories, setSelectedSubCategories] = useState([]);

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
    company_website: "",
    skill: "",
    designation: "",
    location: "",
    experience: "",
    annual_salary: "",
    last_date: "",
  });

  const handleSubcategory = (selectedOption) => {
    // console.log(selectedOption);

    setSelectedSubCategories(selectedOption);

    const ids = selectedOption.map((item) => item.value);
    // console.log(ids);

    setJobData((prevJobData) => ({
      ...prevJobData,
      subCategory: ids,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "company_name") {
      setTotalData((prevTotalData) => ({
        ...prevTotalData,
        company_name: value,
      }));
      // console.log(totalData);
    } else if (name === "contact_number") {
      setTotalData((prevTotalData) => ({
        ...prevTotalData,
        contact_number: value,
      }));

      // console.log(totalData);
    } else if (name === "companyProfile") {
      setTotalData((prevTotalData) => ({
        ...prevTotalData,
        companyProfile: value,
      }));
      // console.log(totalData);
    } else if (name === "subCategory") {
      setJobData((prevJobData) => ({
        ...prevJobData,
        subCategory: [value],
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

    // console.log(jobData);
  };

  function handleChange2(date, fieldName) {
    setJobData((prevJobData) => ({
      ...prevJobData,
      [fieldName]: date,
    }));
    // console.log(jobData);
  }
  const getData = async () => {
    try {
      const response = await axios.post(BaseApi + "/job/createJob", null, {
        headers: {
          "Content-Type": "application/json",
          key: ApiKey,
          token: tokenKey,
        },
      });
      if (response.data.status === 200) {
        setTotalData(response.data.response.jobData);
        setJobCategories(response.data.response.categories);
        setDesignationList(response.data.response.designationlList);

        setSkillList(response.data.response.skillList);
        setExperience(response.data.response.experience);
        setSalary(response.data.response.sallery);
        setWorkType(response.data.response.worktype);
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
        navigate("/plans/purchase");
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: t("employerCreateJob.close"),
        });
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
      console.log("No data received");
    }
  };

  const getSubCategories = async (id) => {
    setSelectedSubCategories([]);
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
    // console.log(totalData);
    var skills = document.getElementsByName("skill");
    var skillArray = [];

    skills.forEach((element) => {
      skillArray.push(element.value);
    });
    // console.log(skillArray);

    // console.log(jobData, "after strong skill");

    // console.log(jobData);

    // Check initial skill validation
    if (selectedSkills.length === 0) {
      setSkillValidationError("Skill is required");
    }

    try {
      const newErrors = {};

      if (jobData.annual_salary === "") {
        newErrors.annual_salary = t("employerCreateJob.annualSalaryRequired");
        // window.scrollTo(0, 0);
      }

      if (jobData.category === "") {
        newErrors.category = t("employerCreateJob.categoryRequired");
        window.scrollTo(0, 0);
      }
      if (totalData.companyProfile === "") {
        newErrors.companyProfile = t(
          "employerCreateJob.companyProfileRequired"
        );
        window.scrollTo(0, 0);
      }
      if (totalData.company_name === "") {
        newErrors.company_name = t("employerCreateJob.companyNameRequired");
        window.scrollTo(0, 0);
      }
      if (jobData.contact_name === "") {
        newErrors.contact_name = t("employerCreateJob.contactNameRequired");
        const inputElement = document.getElementById("contact_name_input");
        if (inputElement) {
          inputElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        // window.scrollTo(0, 0);
      }
      if (totalData.contact_number === "") {
        newErrors.contact_number = t("employerCreateJob.contactNumberRequired");
        window.scrollTo(0, 0);
      } else if (!/^\+?\d{1,3}-?\d{9,15}$/.test(totalData.contact_number)) {
        newErrors.contact_number =
          "Contact Number under 15 digits and contain only digits";
        window.scrollTo(0, 0);
      }
      // console.log("all ok")
      if (jobData.designation === "") {
        newErrors.designation = t("employerCreateJob.workingRelationRequired");
        // window.scrollTo(0, 0);
        // Scroll to the input element
        const inputElement = document.getElementById("designation_input");
        if (inputElement) {
          inputElement.scrollIntoView({ behavior: "smooth" });
        }
      }
      if (jobData.experience === "") {
        newErrors.experience = t("employerCreateJob.experienceRequired");
        // window.scrollTo(0, 0);
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
        // window.scrollTo(0, 0);
      }
      if (jobData.location === "") {
        newErrors.location = t("employerCreateJob.locationRequired");
        // window.scrollTo(0, 0);
      }
      // if (jobData.subCategory === "") {
      //   newErrors.subCategory = "Sub Category is required";
      //   // window.scrollTo(0, 0);
      // }
      if (jobData.work_type === "") {
        newErrors.work_type = t("employerCreateJob.workTypeRequired");
        // window.scrollTo(0, 0);
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
      // if (skillValidationError) {
      //   return;
      // }

      if (Object.keys(newErrors).length === 0) {
        // console.log(jobData, "Inside");
        const confirmationResult = await Swal.fire({
          title: t("employerCreateJob.createJobConfirmTitle"),
          text: t("employerCreateJob.createJobConfirmTxt"),
          icon: "question",
          showCancelButton: true,
          confirmButtonText: t("employerCreateJob.yes"),
          cancelButtonText: t("employerCreateJob.no"),
        });
        if (confirmationResult.isConfirmed) {
          const updatedProfile = {
            ...jobData,
            skill: skillArray,
            company_name: totalData.company_name,
            contact_number: totalData.contact_number,
            companyProfile: totalData.companyProfile,
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
              title: t("employerCreateJob.createJobSuccessTitle"),
              icon: "success",
              confirmButtonText: t("employerCreateJob.close"),
            });
            navigate("/user/managejob");
          } else if (response.data.status === 400) {
            setLoading(false);
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
              title: t("employerCreateJob.createJobFailedTitle"),
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
        title: t("employerCreateJob.createJobFailedTitle"),
        icon: "error",
        confirmButtonText: t("employerCreateJob.close"),
      });
      console.log("Could not submit job data");
    }
  };
  // working
  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   const base64 = await convertToBase64(file);
  //   // console.log(base64);
  //   setJobData({ ...jobData, logo: base64 });
  // };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    // Check if file size exceeds 500KB
    if (file.size > 500 * 1024) {
      Swal.fire({
        title: t("jobseekerChangePhoto.fileSizeExceed"),
        icon: "warning",
        confirmButtonText: t("jobseekerChangePhoto.close"),
      });
      e.target.value = "";
      return; // Exit function
    }

    // Create an object URL to get the image dimensions
    const objectURL = URL.createObjectURL(file);
    const image = new Image();

    // Set up a promise to get image dimensions
    const imageSizePromise = new Promise((resolve) => {
      image.onload = () => {
        resolve({
          width: image.width,
          height: image.height,
        });
      };
    });

    image.src = objectURL;

    const dimensions = await imageSizePromise;

    // Check if minimum dimensions are met
    if (dimensions.width < 250 || dimensions.height < 250) {
      Swal.fire({
        title: t("jobseekerChangePhoto.minFileSize"),
        icon: "warning",
        confirmButtonText: t("jobseekerChangePhoto.close"),
      });
      e.target.value = "";
      return; // Exit function
    }

    // Convert the file to base64
    const base64 = await convertToBase64(file);

    // Set the jobData state
    setJobData({ ...jobData, logo: base64 });
  };

  const getWorkType = (id) => {
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

  const handleDelete = () => {
    setJobData({ ...jobData, logo: "" });
  };

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
                  <h3 className="mx-2">{t("employerCreateJob.createJob")}</h3>
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
                    {/* <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                      <label className="form-label" htmlFor="form3Example1">
                        Job Type<span className="RedStar">*</span>
                      </label>
                      <select
                        className={`form-select ${
                          errors.job_type && "input-error"
                        }`}
                        aria-label="Default select example"
                        name="job_type"
                        value={jobData.job_type}
                        onChange={handleChange}
                      >
                        <option selected value="">
                          Select Job Type
                        </option>

                        <option value="1">Normal Job</option>
                        <option value="2">Partnership Job</option>
                      </select>
                      {errors.job_type && (
                        <div className="text-danger">{errors.job_type}</div>
                      )}
                    </div> */}
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
                    <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx skillPackage  APJoditEditor">
                      <label className="form-label" htmlFor="form3Example1">
                        {t("employerCreateJob.subCategory")}
                      </label>

                      <Select
                        // defaultValue={[colourOptions[2], colouptions[3]]}
                        isMulti
                        isSearchable
                        name="Subcategory"
                        options={subCategories.map((i) => ({
                          value: i.id,
                          label: i.name,
                        }))}
                        className="basic-multi-select"
                        value={selectedCategories}
                        classNamePrefix={t(
                          "employerCreateJob.selectSubCategory"
                        )}
                        onChange={handleSubcategory}
                      />
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
                      placeholder={t("employerCreateJob.jobDescription")}
                      // className={`form-control ${errors.jobDescription && 'input-error'}`}
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
                      value={totalData.company_name}
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
                      // className={`form-control ${errors.companyProfile && 'input-error'}`}
                      value={totalData.companyProfile}
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
                      value={totalData.companyProfile}
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
                            <option
                              key={key}
                              value={key}
                              // onChange={() => jobType(value)}
                            >
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
                      id="contact_name_input"
                      className={`form-control ${
                        errors.contact_number && "input-error"
                      }`}
                      name="contact_number"
                      value={totalData.contact_number}
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
                      className={`form-control ${
                        errors.company_website && "input-error"
                      }`}
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
                      Eg: https://www.google.com or https://google.com
                    </div>
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx skillPackage">
                    <label className="form-label" htmlFor="form3Example1">
                      {t("employerCreateJob.skills")}
                      {/* <span className="RedStar">*</span> */}
                    </label>

                    <Select
                      // defaultValue={[colourOptions[2], colouptions[3]]}
                      isMulti
                      isSearchable
                      name="skill"
                      options={skillList.map((i) => ({
                        value: i.id,
                        label: i.name,
                      }))}
                      className="basic-multi-select"
                      value={selectedSkills}
                      classNamePrefix={t("employerCreateJob.selectSkills")}
                      onChange={handleSkillChange}
                    />
                    {/* {skillValidationError && (
                      <div className="text-danger">{skillValidationError}</div>
                    )} */}
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example1">
                      {t("employerCreateJob.workingRelation")}
                      <span className="RedStar">*</span>
                    </label>
                    <select
                      id="designation_input"
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
                      accept=".jpeg, .png, .jpg, .gif"
                      onChange={(e) => handleFileUpload(e)}
                    />
                    <div id="emailHelp" className="form-text">
                      {t("employerCreateJob.belowTxt1")}
                    </div>
                    <img
                      src={jobData.logo || ""}
                      alt=""
                      style={{
                        width: "150px",
                        marginTop: "10px",
                        marginRight: "10px",
                      }}
                    />
                    {jobData.logo ? (
                      <button
                        className="btn-sm btn-outline-dark button1 ml-3"
                        onClick={() => handleDelete()}
                      >
                        {t("employerCreateJob.deleteButton")}
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example3">
                      {t("employerCreateJob.lastDate")}
                      <span className="RedStar">*</span>
                    </label>
                    <div className="date-picker-wrapper">
                      <input
                        type="date"
                        id="formLastDate"
                        className={`form-control ${
                          errors.last_date && "input-error"
                        }`}
                        name="last_date"
                        value={jobData.last_date}
                        placeholder={t("employerCreateJob.lastDate")}
                        onChange={handleLastDateChange}
                      />
                    </div>
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
                      {t("employerCreateJob.postButton")}
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
                                      {totalData.company_name}
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

export default CreateJob;

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
