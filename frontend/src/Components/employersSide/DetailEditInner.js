import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import NavBar from "../element/NavBar";
import Footer from "../element/Footer";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import { Link, useNavigate, useParams } from "react-router-dom";
import HTMLReactParser from "html-react-parser";
import Select from "react-select";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles
const DetailEditInner = () => {
  const editor = useRef(null);
  const tokenKey = Cookies.get("tokenClient");
  const navigate = useNavigate();
  const { slug } = useParams();

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

  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  const mapKey = Cookies.get("mapKey");
  const [t, i18n] = useTranslation("global");

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

  const [jobData, setJobData] = useState([]);
  // const [job, setJob] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [skillList, setSkillList] = useState([]);
  const [experience, setExperience] = useState([]);
  const [salary, setSalary] = useState([]);
  const [workType, setWorkType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetail, setUserDetail] = useState([]);
  const [accDetail, setAccDetail] = useState([]);

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategories, setSelectedSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // const [selectedSkills, setSelectedSkills] = useState([]);

  const [skillValidationError, setSkillValidationError] = useState("");

  const handleSkillChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions); // Update selected skills

    console.log(selectedOptions);

    // Check if selectedOptions is not empty
    // if (selectedOptions.length > 0) {
    //   setSkillValidationError(""); // Clear the error message
    // } else {
    //   setSkillValidationError("Skill is required");
    // }
  };

  const handleSubcategory = (selectedOption) => {
    setSelectedSubCategories(selectedOption);

    const ids = selectedOption.map((item) => item.value);
    // console.log(ids);

    setJobData((prevJobData) => ({
      ...prevJobData,
      subCategory: ids,
    }));
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "skill") {
      setJobData((prevJobData) => ({
        ...prevJobData,
        skill: [...prevJobData.skill, value],
      }));
    } else if (name === "category") {
      if (value) {
        getSubCategories(value);
      }
      setJobData((prevJobData) => ({
        ...prevJobData,
        category: value,
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
  const getSkillNameById = (skillId) => {
    const selectedSkill = skillList.find((skill) => skill.id === skillId);
    return selectedSkill ? selectedSkill.name : "";
  };

  const [existingSubCategory, setExistingSubCategory] = useState();

  const getData = async () => {
    try {
      const response = await axios.post(BaseApi + `/job/edit/${slug}`, null, {
        headers: {
          "Content-Type": "application/json",
          key: ApiKey,
          token: tokenKey,
        },
      });
      setLoading(false);
      if (response.data.status === 200) {
        // console.log(response);

        var subCategoryList = response.data.response.subcategories;

        var subCategoriesSelected = response.data.response.job.subcategory_id;

        if (subCategoriesSelected !== null) {
          var subCategoriesArray = subCategoriesSelected.split(",");

          var selectedSubCategories = [];

          subCategoriesArray.forEach((element) => {
            subCategoryList.forEach((listElement) => {
              if (parseInt(element) == parseInt(listElement.id)) {
                let obj = {
                  value: listElement.id,
                  label: listElement.name,
                };
                selectedSubCategories.push(obj);
              }
            });
          });

          // console.log(selectedSubCategories);

          setSelectedSubCategories(selectedSubCategories);
          setSubCategories(subCategoryList);
        }

        // code to handel preselected skills
        var skillList = response.data.response.skillList;
        var selectedSkillsName = response.data.response.job.skill;
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

        setSelectedSkills(SelectSkills);
        setExistingSubCategory(response.data.response.job.subcategory_id);
        setSelectedImage(response.data.response.job.logo_path);
        setJobData(response.data.response.job);
        getSubCategories(response.data.response.job.category);
        setJobCategories(response.data.response.categories);
        setTotalData(response.data);
        setDesignationList(response.data.response.designationlList);
        setSkillList(response.data.response.skillList);
        setExperience(response.data.response.experience);
        setSalary(response.data.response.sallery);
        setWorkType(response.data.response.worktype);
        // console.log(totalData);
      } else {
        Swal.fire({
          title: t("employerCreateJob.createJobFailedTitle"),
          text: HTMLReactParser(response.data.message),
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
  const getHeaderData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/job/accdetail/${slug}`,
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
        setUserDetail(response.data.response.userDetails);
        setAccDetail(response.data.response);
        console.log(userDetail);
      } else if (response.data.status === 400) {
        // setLoading(false);
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
          title: t("employerCreateJob.createJobFailedTitle"),
          text: HTMLReactParser(response.data.message),
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
      console.log("Could not get data at iner account detail edit page.");
    }
  };

  const getSubCategories = async (id) => {
    setSelectedSubCategories([]);
    setSubCategories([]);
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
    
    getHeaderData();
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

      if (jobData.annual_salary === "" || jobData.annual_salary === null) {
        newErrors.annual_salary = t("employerCreateJob.annualSalaryRequired");
        // window.scrollTo(0, 0);
      }

      if (jobData.category === "" || jobData.category === null) {
        newErrors.category = t("employerCreateJob.categoryRequired");
        window.scrollTo(0, 0);
      }
      if (jobData.companyProfile === "" || jobData.companyProfile === null) {
        newErrors.companyProfile = t(
          "employerCreateJob.companyProfileRequired"
        );
        window.scrollTo(0, 0);
      }
      if (jobData.company_name === "" || jobData.company_name === null) {
        newErrors.company_name = t("employerCreateJob.companyNameRequired");
        window.scrollTo(0, 0);
      }
      if (jobData.contact_name === "" || jobData.contact_name === null) {
        newErrors.contact_name = t("employerCreateJob.contactNameRequired");
        window.scrollTo(0, 0);
      }
      // if (jobData.contact_number === "") {
      //   newErrors.contact_number = "Contact Number is required";
      //   window.scrollTo(0, 0);
      // } else if (!/^\d{10}$/.test(jobData.contact_number)) {
      //   newErrors.contact_number =
      //     "Contact Number must be 10 digits and contain only digits";
      //   window.scrollTo(0, 0);
      // }

      if (jobData.contact_number === "" || jobData.contact_number === null) {
        newErrors.contact_number = t("employerCreateJob.contactNumberRequired");
        window.scrollTo(0, 0);
      }
      // else if (!/^\+?\d{1,3}-?\d{9,15}$/.test(jobData.contact_number)) {
      //   newErrors.contact_number =
      //     "Contact Number under 15 digits and contain only digits";
      //   window.scrollTo(0, 0);
      // }

      if (jobData.designation === "" || jobData.designation === null) {
        newErrors.designation = t("employerCreateJob.workingRelationRequired");
        // window.scrollTo(0, 0);
      }
      if (jobData.experience === "" || jobData.experience === null) {
        newErrors.experience = t("employerCreateJob.experienceRequired");
        window.scrollTo(0, 0);
      }
      if (jobData.jobDescription === "" || jobData.jobDescription === null) {
        newErrors.jobDescription = t(
          "employerCreateJob.jobDescriptionRequired"
        );
        window.scrollTo(0, 0);
      }
      if (jobData.job_title === "" || jobData.job_title === null) {
        newErrors.job_title = t("employerCreateJob.jobTitleRequired");
        window.scrollTo(0, 0);
      }
      if (!jobData.last_date || jobData.last_date === null) {
        newErrors.last_date = t("employerCreateJob.lastDateRequired");
        // window.scrollTo(0, 0);
      }
      if (jobData.location === "" || jobData.location === null) {
        newErrors.location = t("employerCreateJob.locationRequired");
        // window.scrollTo(0, 0);
      }

      if (jobData.subCategory === "") {
        newErrors.subCategory = "Sub Category is required";
        window.scrollTo(0, 0);
      }
      if (jobData.work_type === "" || jobData.work_type === null) {
        newErrors.work_type = t("employerCreateJob.workTypeRequired");
        window.scrollTo(0, 0);
      }

      if (jobData.company_website) {
        const urlFormat = /^(https:\/\/)?(www\.)?[\w.-]+\.[a-z]{2,5}$/i;
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
          title: t("employerCreateJob.editJobConfirmTitle"),
          text: t("employerCreateJob.editJobConfirmTxt"),
          icon: "question",
          showCancelButton: true,
          confirmButtonText: t("employerCreateJob.yes"),
          cancelButtonText: t("employerCreateJob.no"),
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const ids = selectedCategories.map((item) => item.value);

          const updatedProfile = {
            ...jobData,
            skill: skillArray,
            subCategory: ids,
          };

          const response = await axios.post(
            BaseApi + `/job/edit/${slug}`,
            updatedProfile,
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
              title: t("employerCreateJob.editJobSuccessTitle"),
              icon: "success",
              confirmButtonText: t("employerCreateJob.close"),
            });
            window.history.back();
          } else if (response.data.status === 400) {
            // setLoading(false);
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
              title: t("employerCreateJob.createJobFailedTitle"),
              text: HTMLReactParser(response.data.message),
              icon: "error",
              confirmButtonText: t("employerCreateJob.close"),
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
        title: t("employerCreateJob.editJobFailedTitle"),
        icon: "error",
        confirmButtonText: t("employerCreateJob.close"),
      });
    }
  };

  //working
  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   const base64 = await convertToBase64(file);
  //   setJobData({ ...jobData, logo: base64 });
  //   setSelectedImage(base64);
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

  const deleteImage = () => {
    setSelectedImage(null);
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
          <section class="MyProfileTopSection validation">
            <div class="container">
              <div class="MyProfileImg">
                <img
                  src={
                    userDetail.company_logo
                      ? userDetail.company_logo
                      : "/Images/jobseekerSide/dummy-profile.png"
                  }
                  alt="img"
                />
              </div>
              <div class="MyProfileDetails">
                <h2>
                  {userDetail.first_name} {userDetail.last_name}
                </h2>
                <h6>({userDetail.user_type})</h6>
                <div class="MyProfileUpgratePlan">
                  <span>{accDetail.planDetails}</span>
                  <Link
                    to="/plans/purchase"
                    class="btn btn-primary ms-4"
                    style={{
                      backgroundColor: secondaryColor,
                      border: secondaryColor,
                    }}
                  >
                    {t("employerCreateJob.upgradePlan")}
                  </Link>
                </div>
              </div>
            </div>
            <Link
              to="/user/changelogo"
              class="btn btn-primary UploadBackBg"
              style={{
                backgroundColor: primaryColor,
                border: primaryColor,
              }}
            >
              {t("employerCreateJob.uploadEstablishmentPhoto")}
            </Link>
          </section>

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
                  <h3 className="mx-2">{t("employerCreateJob.editJob")}</h3>
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
                          // getSubCategories(e.target.value);
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
                      {/* <Select
                        className={`form-select ${
                          errors.category && "input-error"
                        }`}
                        aria-label="Default select example"
                        name="category"
                        value={selectedCategory}
                        onChange={(selectedOption) => {
                          setSelectedCategory(selectedOption);
                          handleChange({
                            target: {
                              value: selectedOption
                                ? String(selectedOption.value)
                                : "", // Convert ID to string
                              name: "category",
                              
                            },
                          });
                          if (selectedOption) {
                            getSubCategories(selectedOption.value);
                          }
                        }}
                        options={jobCategories.map((i) => ({
                          value: i.id,
                          label: i.name,
                        }))}
                      /> */}
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
                      {/* <span className="RedStar">*</span> */}
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
                      {t("employerCreateJob.belowTxt1")}{" "}
                    </div>
                    <div className="EPEJimageViewer">
                      {selectedImage && (
                        // <div>
                        <img
                          className="editJobPageImage"
                          src={selectedImage}
                          alt="Selected"
                        />
                        // </div>
                      )}
                    </div>
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
                      {t("employerCreateJob.updateJobButton")}
                    </button>
                    <button
                      onClick={() => window.history.back()}
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
                      {t("employerCreateJob.cancelButton")}
                    </button>
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

export default DetailEditInner;

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
