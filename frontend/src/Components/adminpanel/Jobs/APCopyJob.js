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
import { useNavigate, Link, useParams } from "react-router-dom";
import HTMLReactParser from "html-react-parser";
import Select from "react-select";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import APFooter from "../Elements/APFooter";

const APCopyJob = () => {
  // const [userData, setUserData] = useState({
  //   user_id: "",
  //   job_title: "",
  //   category: "",
  //   jobDescription: "",
  //   company_name: "",
  //   work_type: "",
  //   contact_name: "",
  //   skill: "",
  //   contact_number: "",
  //   company_website: "",
  //   companyProfile: "",
  //   designation: "",
  //   location: "",
  //   last_date: "",
  //   experience: "",
  //   annual_salary: "",
  //   logo: "",
  //   subCategory: "",
  // });
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

  // From create job section

  const editor = useRef(null);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");
  const mapKey = Cookies.get("mapKey");


  const navigate = useNavigate();

  // useEffect(() => {
  //   if (tokenKey === null || tokenKey === "") {
  //     navigate("/user/employerlogin");
  //   }
  // }, []);

  const [totalData, setTotalData] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [skillList, setSkillList] = useState([]);
  const [experience, setExperience] = useState([]);
  const [salary, setSalary] = useState([]);
  const [workType, setWorkType] = useState([]);
  const [employersList, setEmployersList] = useState([]);
  const [loading, setLoading] = useState(false);

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
    // if (value.trim() === "") {
    //   setErrors((prev) => ({
    //     ...prev,
    //     [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required`,
    //   }));
    // } else {
    //   // If the input is not empty, clear the error message
    //   setErrors((prev) => ({
    //     ...prev,
    //     [name]: "",
    //   }));
    // }
  };

  const {slug} = useParams();

  const handleSkillChange = (selectedOptions) => {
    // Update the jobData state with the selected skills
    setJobData((prevJobData) => ({
      ...prevJobData,
      skill: selectedOptions.map((option) => option.id),
    }));
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/admin/job/admin_add/${slug}`,
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

      console.log(response);

      setTotalData(response.data);
      setJobCategories(response.data.response.categories);
      setDesignationList(response.data.response.designationlList);
      setSkillList(response.data.response.skillList);
      setExperience(response.data.response.experience);
      setSalary(response.data.response.sallery);
      setWorkType(response.data.response.worktype);
      setEmployersList(response.data.response.employers);
      console.log(totalData);
    } catch (error) {
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
            adminid: adminID,
          },
        }
      );
      setSubCategories(subCatData.data.response);
    } catch (error) {
      console.log("Couldn't get Sub category data!");
    }
  };

  useEffect(() => {
    if (tokenKey === null || tokenKey === "") {
      navigate("/admin");
    }
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

    try {
      // const newErrors = {};

      // if (jobData.annual_salary === "") {
      //   newErrors.annual_salary = "Annual Salary is required";
      //   window.scrollTo(0, 0);
      // }

      // if (jobData.category === "") {
      //   newErrors.category = "Category is required";
      //   window.scrollTo(0, 0);
      // }
      // if (jobData.companyProfile === "") {
      //   newErrors.companyProfile = "Company Profile is required";
      //   window.scrollTo(0, 0);
      // }
      // if (jobData.company_name === "") {
      //   newErrors.company_name = "Company Name is required";
      //   window.scrollTo(0, 0);
      // }
      // if (jobData.contact_name === "") {
      //   newErrors.contact_name = "Contact Name is required";
      //   window.scrollTo(0, 0);
      // }
      // if (jobData.contact_number === "") {
      //   newErrors.contact_number = "Contact Number is required";
      //   window.scrollTo(0, 0);
      // }
      // if (jobData.designation === "") {
      //   newErrors.designation = "Designation is required";
      //   window.scrollTo(0, 0);
      // }
      // if (jobData.experience === "") {
      //   newErrors.experience = "Experience is required";
      //   window.scrollTo(0, 0);
      // }
      // if (jobData.jobDescription === "") {
      //   newErrors.jobDescription = "Job Description is required";
      //   window.scrollTo(0, 0);
      // }
      // if (jobData.job_title === "") {
      //   newErrors.job_title = "Job Title is required";
      //   window.scrollTo(0, 0);
      // }
      // if (jobData.last_date === "") {
      //   newErrors.last_date = "Last Date is required";
      //   window.scrollTo(0, 0);
      // }
      // if (jobData.location === "") {
      //   newErrors.location = "Location is required";
      //   window.scrollTo(0, 0);
      // }
      // if (jobData.skill === "") {
      //   newErrors.skill = "Skill is required";
      //   window.scrollTo(0, 0);
      // }
      // if (jobData.subCategory === "") {
      //   newErrors.subCategory = "Sub Category is required";
      //   window.scrollTo(0, 0);
      // }
      // if (jobData.work_type === "") {
      //   newErrors.work_type = "Work Type is required";
      //   window.scrollTo(0, 0);
      // }
      // if (jobData.user_id === "") {
      //   newErrors.user_id = "Employer is required";
      //   window.scrollTo(0, 0);
      // }

      // setErrors(newErrors);

      const {
        user_id,
        job_title,
        category,
        company_name,
        work_type,
        contact_name,
        skillArray,
        contact_number,
        companyProfile,
        designation,
        location,
        last_date,
        experience,
        annual_salary,
      } = jobData;

      if (
        !user_id ||
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
          user_id: user_id ? "" : "Select an Employer",
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
      // Validation: Check if contact is exactly 10 digits
      const contactFormat = /^\+?\d{1,3}-?\d{9,15}$/;
      if (contact_number && !contactFormat.test(contact_number)) {
        setErrors({
          contact_number: "Contact must be 10 digits",
        });
        return;
      }

      // if (Object.keys(newErrors).length === 0) {
      const confirmationResult = await Swal.fire({
        title: "Add Job?",
        text: "Do you want to Add this Job?",
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
          BaseApi + "/admin/job/admin_add",
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
            title: "Job added successfully!",
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
        title: "Could not add this job. Please try after some time!",
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

  // Ends here

  useEffect(() => {
    // Check if tokenKey is not present
    if (!tokenKey) {
      // Redirect to the home page
      navigate("/admin");
    } else {
      // TokenKey is present, fetch data or perform other actions
      getData();
      window.scrollTo(0, 0);
    }
  }, [tokenKey, navigate]);

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

                  <Typography color="text.primary">Copy Job</Typography>
                </Breadcrumbs>
              </div>

              <h2 className="adminPageHeading">Copy Job</h2>
              <form className="adminForm">
                <div className="mb-5 mt-5">
                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example1">
                      Select Employer<span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.user_id && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="user_id"
                      value={jobData.user_id}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        Select Employer
                      </option>
                      {employersList.map((i, key) => {
                        return (
                          <>
                            <option
                              key={key}
                              value={i.id}
                              // onChange={() => jobType(value)}
                            >
                              {i.first_name}
                              {i.last_name}
                            </option>
                          </>
                        );
                      })}
                    </select>
                    {errors.user_id && (
                      <div className="text-danger">{errors.user_id}</div>
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

                  <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example1">
                      Category<span className="RedStar">*</span>
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
                      <option value="">Select Job Category</option>
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
                )}

                <div className="mb-5 DashBoardInputBx DashBoardCreatBx APJoditEditor">
                  <label className="form-label" htmlFor="form3Example3">
                    Job Description
                  </label>
                  <JoditEditor
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
                <div className="mb-5 DashBoardInputBx DashBoardCreatBx APJoditEditor">
                  <label className="form-label" htmlFor="form3Example3">
                    Company Profile<span className="RedStar">*</span>
                  </label>
                  <JoditEditor
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
                    className="form-control"
                    name="company_website"
                    value={jobData.company_website}
                    placeholder="Company Website"
                    onChange={handleChange}
                  />
                  <div id="emailHelp" className="form-text">
                    Eg: https://www.google.com or http://google.com
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
                {/* <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label htmlFor="formFile" className="form-label">
                      Company Logo<span className="RedStar">*</span>
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
                        style={{}}
                        onClick={() => setJobData({ ...jobData, logo: "" })}
                      >
                        Delete
                      </button>
                    ) : (
                      ""
                    )}
                    <div id="emailHelp" className="form-text">
                      Supported File Types: gif, jpg, jpeg, png (Max. 10MB)
                    </div>
                  </div> */}
                <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx skillPackage  APJoditEditor">
                  <label className="form-label" htmlFor="form3Example1">
                    Skills<span className="RedStar">*</span>
                  </label>
                  {/* <Multiselect
                      options={skillList}
                      onSelect={(e) => handleSkillChange(e)}
                      onRemove={(e) => handleSkillChange(e)}
                      displayValue="name"
                      className="form-select"
                      aria-label="Default select example"
                    /> */}
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
                    classNamePrefix="select"
                  />
                  {errors.skill && (
                    <div className="text-danger">{errors.skill}</div>
                  )}

                  {/* <select
                  className="form-select"
                  aria-label="Default select example"
                  name="skill"
                  value={jobData.skill}
                  onChange={handleChange}
                >
                  <option selected>Choose Skills</option>
                  {skillList.map((i, index) => {
                    return (
                      <>
                        <option value={i.id} key={index}>
                          {i.name}
                        </option>
                      </>
                    );
                  })}
                </select> */}
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
                    <option selected>Choose Designation</option>
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
                    onChange={handleChange}
                  />
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
                    onClick={() => navigate("/admin/jobs/index")}
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

export default APCopyJob;

// function convertToBase64(file) {
//   return new Promise((resolve, reject) => {
//     const fileReader = new FileReader();
//     fileReader.readAsDataURL(file);
//     fileReader.onload = () => {
//       resolve(fileReader.result);
//     };
//     fileReader.onerror = (error) => {
//       reject(error);
//     };
//   });
// }
