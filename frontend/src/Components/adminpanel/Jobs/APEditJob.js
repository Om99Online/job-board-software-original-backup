import React, { useEffect, useState } from "react";
import APNavBar from "../Elements/APNavBar";
import APSidebar from "../APSidebar/APSidebar";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import axios from "axios";
import BaseApi from "../../api/BaseApi";
import ApiKey from "../../api/ApiKey";
import { useNavigate, useParams, Link } from "react-router-dom";
// import HTMLReactParser from "html-react-parser";
import Select from "react-select";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles
import APFooter from "../Elements/APFooter";
const APEditJob = () => {

  const [errors, setErrors] = useState({
    user_id: "",
    job_title: "",
    category: "",
    jobDescription: "",
    company_name: "",
    work_type: "",
    contact_name: "",
    skill: "",
    contact_number: "",
    company_website: "",
    companyProfile: "",
    designation: "",
    location: "",
    last_date: "",
    experience: "",
    annual_salary: "",
    logo: "",
    subCategory: "",
  });
  const [jobData, setJobData] = useState({
    job_title: "",
    category: "",
    subCategory: [],
    jobDescription: "",
    company_name: "",
    created: "",
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
    user_id: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const { slug } = useParams();
  // From create job section

  const editor = useRef(null);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");
  const mapKey = Cookies.get("mapKey");

  const navigate = useNavigate();

  const [totalData, setTotalData] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [skillList, setSkillList] = useState([]);
  const [experience, setExperience] = useState([]);
  const [salary, setSalary] = useState([]);
  const [workType, setWorkType] = useState([]);
  const [existingSkill, setExistingSkill] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employersList, setEmployersList] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillValidationError, setSkillValidationError] = useState("");
  const [selectedCategories, setSelectedSubCategories] = useState([]);
  const [selectedcategories, setSelectedCategories] = useState([]);

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

  const handleCategory = (selectedOption) => {
    // console.log(selectedOption, "param");

    setSelectedCategories(selectedOption);
    // console.log(selectedcategories, "state");

    const ids = selectedOption.value;
    // console.log(ids);

    getSubCategories(selectedOption.value);

    setJobData((prevJobData) => ({
      ...prevJobData,
      category: ids,
    }));
  };

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

  const getSkillNameById = (skillId) => {
    const selectedSkill = skillList.find((skill) => skill.id === skillId);
    return selectedSkill ? selectedSkill.name : "";
  };

  // const handleSkillChange = (selectedOptions) => {
  //   // Update the jobData state with the selected skills
  //   setJobData((prevJobData) => ({
  //     ...prevJobData,
  //     skill: selectedOptions.map((option) => option.id),
  //   }));
  // };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/admin/job/admin_edit/${slug}`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            token: tokenKey,
            adminid: adminID,
          },
        }
      );
      setLoading(false);

      // console.log(response);

      // For fetching categories

      var categoryList = response.data.response.categories;
      var categorySelected = response.data.response.job.category;
      var selectedCategory = [];

      // categorySelected.forEach((element) => {
      categoryList.forEach((listElement) => {
        if (parseInt(categorySelected) == parseInt(listElement.id)) {
          let obj = {
            value: listElement.id,
            label: listElement.name,
          };
          selectedCategory.push(obj);
        }
      });
      // });

      // console.log(selectedCategory);

      // For fetching subcategories
      var subCategoryList = response.data.response.subcategories;

      var subCategoriesSelected = response.data.response.job.subcategory_id;

      if(subCategoriesSelected !== null){
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
        setSelectedSubCategories(selectedSubCategories);

      }

      
      console.log("Yha")

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
      setSelectedImage(response.data.response.job.logo_path);

      setJobData(response.data.response.job);
      setSelectedSkills(SelectSkills);
      setSelectedCategories(selectedCategory);
      setSubCategories(subCategoryList);

      setTotalData(response.data.response);
      setJobCategories(response.data.response.categories);
      setDesignationList(response.data.response.designationlList);
      setSkillList(response.data.response.skillList);
      setExperience(response.data.response.experience);
      setSalary(response.data.response.sallery);
      setWorkType(response.data.response.worktype);
      setEmployersList(response.data.response.employers);
      setExistingSkill(response.data.response.job.skill);
      // console.log("hi")
      // skillGetter(existingSkill, skillList);
      // console.log(arary1);
      // console.log(skillList)

      // console.log(existingSkill);
    } catch (error) {
      console.log("No data received");
    }
  };

  // const [extractedSkills, setExtractedSkills] = useState([]);

  // const skillGetter = (skills, skillList) => {

  //   for (let i = 0; i < skills.length; i++) {
  //     let found = false;

  //     for (let j = 0; j < skillList.length; j++) {
  //       if (skills[i] == skillList[j].id) {
  //         found = true;

  //         // Check if the skill is already in extractedSkills
  //         const duplicateSkill = extractedSkills.find(
  //           (skill) => skill.value === skillList[j].id.toString()
  //         );

  //         if (!duplicateSkill) {
  //           extractedSkills.push({
  //             value: skillList[j].id.toString(),
  //             label: skillList[j].name,
  //           });
  //         }

  //         break;
  //       }
  //     }

  //     if (!found) {
  //       console.log("false");
  //       // Handle the case when the skill is not found in skillList, if needed.
  //     }
  //   }

  //   console.log(extractedSkills, "Data");

  //   return extractedSkills;

  // };

  useEffect(() => {
    // Check if tokenKey is not present
    if (!tokenKey) {
      // Redirect to the home page
      navigate("/admin");
    } else {
      // TokenKey is present, fetch data or perform other actions

      getData();
      // skillGetter(existingSkill, skillList);
      getSubCategories();
      window.scrollTo(0, 0);
    }
  }, [tokenKey, navigate]);

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
            adminid: adminID,
          },
        }
      );
      setSubCategories(subCatData.data.response);
    } catch (error) {
      console.log("Couldn't get Sub category data!");
    }
  };

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
      const {
        job_title,
        category,
        company_name,
        work_type,
        contact_name,
        skill,
        contact_number,
        companyProfile,
        designation,
        location,
        last_date,
        experience,
        annual_salary,
        company_website,
      } = jobData;

      if (
        !job_title ||
        !category ||
        !company_name ||
        !work_type ||
        !contact_name ||
        // !skillArray ||
        !contact_number ||
        !companyProfile ||
        !designation ||
        !location ||
        !last_date ||
        !experience ||
        !annual_salary
      ) {
        setErrors({
          job_title: job_title ? "" : "Job Title is required",
          category: category ? "" : "Category is required",
          company_name: company_name ? "" : "Company Name is required",
          work_type: work_type ? "" : "Work Type is required",
          contact_name: contact_name ? "" : "Contact Name is required",
          // skillArray: skillArray ? "" : "Skill is required",
          contact_number: contact_number ? "" : "Contact Number is required",
          companyProfile: companyProfile ? "" : "Company Profile is required",
          designation: designation ? "" : "Designation is required",
          location: location ? "" : "Location is required",
          last_date: last_date ? "" : "Last Date is required",
          experience: experience ? "" : "Experience is required",
          annual_salary: annual_salary ? "" : "Annual Salary is required",
        });
        return;
      }

      const contactFormat = /^\+?\d{1,3}-?\d{9,15}$/;
      if (contact_number && !contactFormat.test(contact_number)) {
        setErrors({
          contact_number: "Please enter contact number under 15 digits",
        });
        return;
      }

      if (company_website) {
        const urlFormat =
          /^(https?:\/\/)?(www\.)?[\w.-]+\.[a-z]{2,5}(\/\S*)?$/i;
        if (company_website && !urlFormat.test(company_website)) {
          setErrors({
            company_website: "Invalid URL format",
          });
          return;
        }
      }

      if (skillValidationError) {
        return;
      }

      // if (Object.keys(newErrors).length === 0) {
      const confirmationResult = await Swal.fire({
        title: "Update Job?",
        text: "Do you want to update this job?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        const updatedProfile = {
          ...jobData,
          skill: skillArray,
        };

        setLoading(true);
        const response = await axios.post(
          BaseApi + `/admin/job/admin_edit/${slug}`,
          updatedProfile,
          {
            headers: {
              "Content-Type": "application/json",
              key: ApiKey,
              token: tokenKey,
              adminid: adminID,
            },
          }
        );
        if (response.data.status === 200) {
          setLoading(false);
          Swal.fire({
            title: "Job Updated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          navigate("/admin/jobs");
        } else {
          setLoading(false);
          Swal.fire({
            title: "Failed",
            text: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
      }
      // }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Could not update this job. Please try after some time!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not submit job data");
    }
  };

  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   const base64 = await convertToBase64(file);
  //   console.log(base64);
  //   setJobData({ ...jobData, logo: base64 });
  // };

  const jobType = (value) => {
    sessionStorage.setItem("jobtype", "value");
  };

  // const handleFileUpload1 = async (e) => {
  //   const file = e.target.files[0];
  //   const base64 = await convertToBase64(file);
  //   setJobData({ ...jobData, logo: base64 });
  //   setSelectedImage(base64);

  //   // Clear the image error
  //   setErrors({
  //     ...errors,
  //     logo: "",
  //   });
  // };

  const handleFileUpload1 = async (e) => {
    const fileInput = e.target;
    const file = e.target.files[0];
    if (file) {
      // Check the file size (in bytes)
      const fileSizeInBytes = file.size;
      const maxSizeInBytes = 600 * 1024; // 600 KB
      if (fileSizeInBytes > maxSizeInBytes) {
        Swal.fire({
          title: "Image size should be under 600 KB",
          icon: "warning",
          confirmButtonText: "Close",
        });
        fileInput.value = ""; // This clears the input
        return;
      }
      // Convert the image to base64
      convertToBase64(file).then((base64) => {
        setJobData({ ...jobData, logo: base64 });
        setSelectedImage(base64);
      });
      setErrors({
        ...errors,
        logo: "",
      });
    }
  };

  const deleteImage = () => {
    setSelectedImage(null);
    setJobData({ ...jobData, profile_image: "" });

    window.location.reload();
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

  // Ends here

  return (
    <>
      <APNavBar />
      <div className="APBasic">
        <APSidebar />

        {loading ? (
          <>
            <div className="loader-container"></div>
          </>
        ) : (
          <>
            <div className="site-min-height">
              <div className="breadCumb1" role="presentation">
                <Breadcrumbs
                  aria-label="breadcrumb"
                  separator={<NavigateNextIcon fontSize="small" />}
                >
                  <Link
                    to="/admin/admins/dashboard"
                    underline="hover"
                    color="inherit"
                  >
                    Dashboard
                  </Link>
                  <Link to="/admin/jobs" underline="hover" color="inherit">
                    Jobs
                  </Link>

                  <Typography color="text.primary">Edit Jobs</Typography>
                </Breadcrumbs>
              </div>

              <h2 className="adminPageHeading">Edit Job</h2>
              <form className="adminForm">
                <div className="mb-5 mt-4">
                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example1">
                      Select Employer
                    </label>

                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.company_name && "input-error"
                      }`}
                      name="company_name"
                      value={jobData.company_name}
                      placeholder="Company Name"
                      onChange={handleChange}
                      disabled
                    />
                    {errors.company_name && (
                      <div className="text-danger">{errors.company_name}</div>
                    )}
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example1">
                      Job title<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.job_title && "input-error"
                      }`}
                      name="job_title"
                      value={jobData.job_title}
                      placeholder="Job Title"
                      onChange={handleChange}
                    />
                    {errors.job_title && (
                      <div className="text-danger">{errors.job_title}</div>
                    )}
                  </div>

                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx skillPackageCategory APJoditEditor">
                    <label className="form-label" htmlFor="form3Example1">
                      Category<span className="RedStar">*</span>
                    </label>
                    {/* <select
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
                      <option value="">Select Job Category</option>
                      {jobCategories.map((i, index) => (
                        <option value={i.id} key={index}>
                          {i.name}
                        </option>
                      ))}
                    </select> */}

                    <Select
                      // defaultValue={[colourOptions[2], colouptions[3]]}
                      // isMulti
                      isSearchable
                      name="category"
                      options={jobCategories.map((i) => ({
                        value: i.id,
                        label: i.name,
                      }))}
                      className="basic-multi-select"
                      value={selectedcategories}
                      classNamePrefix="select"
                      onChange={(e) => {
                        handleCategory(e);
                        // getSubCategories(e.target.value);
                      }}
                    />
                    {errors.category && (
                      <div className="text-danger">{errors.category}</div>
                    )}
                  </div>
                </div>
                {/* {jobData.category && subCategories ? (
                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example1">
                      Sub Category
                    </label>
                    <select
                      className={`form-select ${
                        errors.subCategory && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="subCategory"
                      value={jobData.subCategory}
                      onChange={handleChange}
                      multiple
                    >
                      <option selected>Select Sub Category</option>
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
                )} */}

                {jobData.category && subCategories ? (
                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx skillPackageSubcategory APJoditEditor">
                    <label className="form-label" htmlFor="form3Example1">
                      Sub Category
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
                      classNamePrefix="select"
                      onChange={handleSubcategory}
                    />
                  </div>
                ) : (
                  ""
                )}

                <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx APJoditEditor">
                  <label className="form-label" htmlFor="form3Example3">
                    Job Description
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
                    placeholder="Add your text here..."
                  />
                  {errors.jobDescription && (
                    <div className="text-danger">{errors.jobDescription}</div>
                  )}
                </div>
                <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                  <label className="form-label" htmlFor="form3Example3">
                    Company Name<span className="RedStar">*</span>
                  </label>
                  <input
                    type="text"
                    id="form3Example3"
                    className={`form-control ${
                      errors.company_name && "input-error"
                    }`}
                    name="company_name"
                    value={jobData.company_name}
                    placeholder="Company Name"
                    onChange={handleChange}
                  />
                  {errors.company_name && (
                    <div className="text-danger">{errors.company_name}</div>
                  )}
                </div>
                <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                  <label className="form-label" htmlFor="form3Example1">
                    Work Type<span className="RedStar">*</span>
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
                    <option selected>Select Work Type</option>
                    {Object.entries(workType).map(([key, value]) => {
                      return (
                        <>
                          <option
                            key={key}
                            value={key}
                            onChange={() => jobType(value)}
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
                    Contact Name<span className="RedStar">*</span>
                  </label>
                  <input
                    type="text"
                    id="form3Example3"
                    className={`form-control ${
                      errors.contact_name && "input-error"
                    }`}
                    name="contact_name"
                    value={jobData.contact_name}
                    placeholder="Contact Name"
                    onChange={handleChange}
                  />
                  {errors.contact_name && (
                    <div className="text-danger">{errors.contact_name}</div>
                  )}
                </div>
                <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx  APJoditEditor">
                  <label className="form-label" htmlFor="form3Example3">
                    Company Profile<span className="RedStar">*</span>
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
                    onChange={(value) =>
                      handleChange({
                        target: { name: "companyProfile", value },
                      })
                    }
                    style={{ minHeight: "250px", height: "200px" }}
                      placeholder="Add your text here..."
                  />
                  {errors.companyProfile && (
                    <div className="text-danger">{errors.companyProfile}</div>
                  )}
                </div>

                <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                  <label className="form-label" htmlFor="form3Example3">
                    Contact Number<span className="RedStar">*</span>
                  </label>
                  <input
                    type="text"
                    id="form3Example3"
                    className={`form-control ${
                      errors.contact_number && "input-error"
                    }`}
                    name="contact_number"
                    value={jobData.contact_number}
                    placeholder="Contact Number"
                    onChange={handleChange}
                  />
                  {errors.contact_number && (
                    <div className="text-danger">{errors.contact_number}</div>
                  )}
                </div>
                <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                  <label className="form-label" htmlFor="form3Example3">
                    Company Website
                  </label>
                  <input
                    type="text"
                    id="form3Example3"
                    className={`form-control ${
                      errors.company_website && "input-error"
                    }`}
                    name="company_website"
                    value={jobData.company_website}
                    placeholder="Company Website"
                    onChange={handleChange}
                  />
                  {errors.company_website && (
                    <div className="text-danger">{errors.company_website}</div>
                  )}
                  <div id="emailHelp" className="form-text">
                    Eg: https://www.google.com or www.google.com
                  </div>
                </div>

                <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                  <label className="form-label" htmlFor="form3Example1">
                    Experience (In Years)<span className="RedStar">*</span>
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
                    <option selected>Choose Experience</option>
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
                    Annual Salary<span className="RedStar">*</span>
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
                    <option selected>Select Salary</option>
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

                <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx skillPackage  APJoditEditor">
                  <label className="form-label" htmlFor="form3Example1">
                    Skills
                  </label>

                  <Select
                    // defaultValue={[
                    //   extractedSkills?.[0],
                    //   extractedSkills?.[1],
                    //   extractedSkills?.[2],

                    // ]}

                    defaultValue={selectedSkills}
                    isMulti
                    isSearchable
                    name="skill"
                    options={skillList.map((i) => ({
                      value: i.id,
                      label: i.name,
                    }))}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={selectedSkills}
                    onChange={handleSkillChange}
                  />
                  {skillValidationError && (
                    <div className="text-danger">{skillValidationError}</div>
                  )}
                </div>
                <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                  <label className="form-label" htmlFor="form3Example1">
                    Designation<span className="RedStar">*</span>
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
                      Choose Designation
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
                    Location<span className="RedStar">*</span>
                  </label>
                  <input
                    type="text"
                    id="form3Example3"
                    className={`form-control ${
                      errors.location && "input-error"
                    }`}
                    name="location"
                    value={jobData.location}
                    placeholder="Location"
                    onChange={handleLocationChange}
                  />
                  {suggestions.length > 0 && (
                    <div
                      className="suggestionsAdminSide"
                      style={{ display: suggestionTaken ? "none" : "" }}
                    >
                      <ul className="locationDropdown">
                        {suggestions.map((suggestion, index) => (
                          <div key={index} className="suggestion-item">
                            <li
                              onClick={() => handleSuggestionClick(suggestion)}
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
                  <label className="form-label" htmlFor="form3Example3">
                    Last Date<span className="RedStar">*</span>
                  </label>
                  <input
                    type="date"
                    id="form3Example3"
                    className={`form-control ${
                      errors.last_date && "input-error"
                    }`}
                    name="last_date"
                    value={jobData.last_date}
                    placeholder="Last Date"
                    onChange={handleChange}
                  />
                  {errors.last_date && (
                    <div className="text-danger">{errors.last_date}</div>
                  )}
                </div>
                <div class="mb-5 DashBoardInputBx">
                  <label for="formFile" class="form-label">
                    Company Logo
                  </label>
                  <input
                    class="form-control"
                    type="file"
                    id="formFile"
                    label="profile_image"
                    name="logo"
                    accept=".jpeg, .png, .jpg, .gif"
                    onChange={(e) => handleFileUpload1(e)}
                  />

                  <div id="emailHelp" class="form-text">
                    Supported File Types: gif, jpg, jpeg, png (Max. 600 KB).
                  </div>
                  {selectedImage && (
                    <div>
                      <div className="">
                        <img
                          className="selectedInputImage"
                          src={selectedImage}
                          alt="Selected"
                        />
                      </div>

                      {/* <button className="APButton3" onClick={deleteImage}>
                        Delete
                      </button> */}
                    </div>
                  )}
                </div>

                <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                  <label className="form-label" htmlFor="form3Example3">
                    Job Posted Date<span className="RedStar">*</span>
                  </label>
                  <input
                    type="date"
                    id="form3Example3"
                    className="form-control"
                    name="last_date"
                    value={jobData.created}
                    placeholder="Last Date"
                    onChange={handleChange}
                  />
                </div>
                <div className="APAddJobBottomButtons">
                  <button
                    type="button"
                    className="btn btn-primary button1"
                    onClick={handleClick}
                  >
                    SAVE
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary button2"
                    onClick={() => navigate("/admin/jobs")}
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
            <APFooter />
          </>
        )}
      </div>
    </>
  );
};

export default APEditJob;

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
