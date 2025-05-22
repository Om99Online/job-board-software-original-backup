import React, { useEffect, useState } from "react";
import APNavBar from "../Elements/APNavBar";
import APSidebar from "../APSidebar/APSidebar";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axios from "axios";
import BaseApi from "../../api/BaseApi";
import ApiKey from "../../api/ApiKey";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import APFooter from "../Elements/APFooter";

const APImportJobElements = () => {
  const [userData, setUserData] = useState({
    xml_url: "",
    employer_id: "",
    job_title: "",
    job_discription: "",
    job_category: "",
    job_skills: "",
    job_designation: "",
    job_location: "",
    work_type: "",
    expirydate: "",
    comapany_name: "",
    comapany_website: "",
    contact_person: "",
    tagNames: "",
    // company_name: ""
  });

  const [xmlData, setXmlData] = useState({
    xml_url: "",
  });
  const [errors, setErrors] = useState({
    xml_url: "",
    employer_id: "",
    job_title: "",
    job_discription: "",
    job_category: "",
    job_skills: "",
    job_designation: "",
    job_location: "",
    work_type: "",
    expirydate: "",
    comapany_name: "",
    comapany_website: "",
    contact_person: "",
    // company_name: ""
  });
  const [loading, setLoading] = useState(false);
  const [employersData, setEmployersData] = useState([]);
  const [tagData, setTagData] = useState([]);

  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");

  const existingXml = Cookies.get("xml_url");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    console.log(userData);
  };

  // function to get the employer data
  const getData = async () => {
    try {
    //   setXmlData((prev) => ({
    //     ...prev,
    //     xml_url: existingXml,
    //   }));
    //   xmlData && 

      console.log("xmlData", existingXml);
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/admin/job/admin_jobimportdata",
        {xml_url : existingXml},
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
      setEmployersData(response.data.response.employer_id);
      setTagData(response.data.response.tagNames);
    } catch (error) {
      setLoading(false);
      console.log("Error at import jobs at Admin panel");
    }
  };

  // Function to sumbit the data on API
  const handleClick = async () => {
    try {
      const newErrors = {};

    //   if (userData.xml_url === "") {
    //     newErrors.xml_url = "URL is required";
    //     window.scrollTo(0, 0);
    //   } else {
    //     // Regular expression pattern to match a valid URL
    //     const urlPattern = /^(https:\/\/)(www\.)?[\w.-]+\.[a-z]{2,5}(\/\S*)?$/i;

    //     if (!urlPattern.test(userData.xml_url)) {
    //       newErrors.xml_url = "Invalid URL format";
    //       // window.scrollTo(0, 0);
    //     }
    //   }
      if (userData.employer_id === "") {
        newErrors.employer_id = "Please select a company";
        // window.scrollTo(0, 0);
      }
      if (userData.job_title === "") {
        newErrors.job_title = "Job title is required";
      }
      if (userData.job_discription === "") {
        newErrors.job_discription = "Job discription is required";
      }
      if (userData.job_category === "") {
        newErrors.job_category = "Job category is required";
      }
      if (userData.job_skills === "") {
        newErrors.job_skills = "Job skills is required";
      }
      if (userData.job_designation === "") {
        newErrors.job_designation = "Job designation is required";
      }
      if (userData.job_location === "") {
        newErrors.job_location = "Job location is required";
      }
      if (userData.work_type === "") {
        newErrors.work_type = "Work type is required";
      }
      if (userData.expirydate === "") {
        newErrors.expirydate = "Expiry date is required";
      }

      if (userData.comapany_name === "") {
        newErrors.comapany_name = "Company name is required";
      }

      if (userData.comapany_website === "") {
        newErrors.comapany_website = "Company website is required";
      }

      if (userData.contact_person === "") {
        newErrors.contact_person = "Contact person is required";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Import?",
          text: "Do you want to Import Jobs?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (confirmationResult.isConfirmed) {
          setLoading(true);

          const updatedData = {
            ...userData,
            tagNames: tagData,
            xml_url: existingXml,
          };

          const response = await axios.post(
            BaseApi + "/admin/job/admin_jobimportnew",
            updatedData,
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

          if (response.data.status === 200) {
            Swal.fire({
              title: "Jobs Imported successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            // getData();
            // setUserData({
            //   ...userData,
            //   xml_url: "",
            //   employer_id: "",
            // });
            // window.scrollTo(0, 0);
            navigate("/admin/jobs/importlist");
          } else {
            Swal.fire({
              title: response.data.message,
              icon: "error",
              confirmButtonText: "Close",
            });
          }
        }
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not Import Jobs. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not change username!", error);
    }
  };

  useEffect(() => {
    // Check if tokenKey is not present
    if (!tokenKey) {
      // Redirect to the login page
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
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate("/admin/admins/dashboard")}
                  >
                    Dashboard
                  </Link>
                  <Link
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate("/admin/candidates")}
                  >
                    List Jobs
                  </Link>

                  <Typography color="text.primary">New Import Jobs</Typography>
                </Breadcrumbs>
              </div>

              <h2 className="adminPageHeading">New Import Jobs</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  {/* <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      XML Feed URL<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.xml_url && "input-error"
                      }`}
                      name="xml_url"
                      placeholder="XML URL"
                      value={userData.xml_url}
                      onChange={handleChange}
                    />
                    {errors.xml_url && (
                      <div className="text-danger">{errors.xml_url}</div>
                    )}
                  </div> */}
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Company Name<span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.employer_id && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="employer_id"
                      value={userData.employer_id}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        Select Company
                      </option>
                      {employersData.map((i) => {
                        return (
                          <option value={i.id}>
                            {i.company_name ? i.company_name : i.first_name}
                          </option>
                        );
                      })}
                    </select>
                    {errors.employer_id && (
                      <div className="text-danger">{errors.employer_id}</div>
                    )}
                  </div>

                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Job Title<span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.job_title && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="job_title"
                      value={userData.job_title}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        Select Tag
                      </option>
                      {Object.entries(tagData).map(([key, values]) => {
                        return <option value={values}>{values}</option>;
                      })}
                    </select>
                    {errors.job_title && (
                      <div className="text-danger">{errors.job_title}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Job Description<span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.job_discription && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="job_discription"
                      value={userData.job_discription}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        Select Tag
                      </option>
                      {Object.entries(tagData).map(([key, values]) => {
                        return <option value={values}>{values}</option>;
                      })}
                    </select>
                    {errors.job_discription && (
                      <div className="text-danger">
                        {errors.job_discription}
                      </div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Job Category<span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.job_category && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="job_category"
                      value={userData.job_category}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        Select Tag
                      </option>
                      {Object.entries(tagData).map(([key, values]) => {
                        return <option value={values}>{values}</option>;
                      })}
                    </select>
                    {errors.job_category && (
                      <div className="text-danger">{errors.job_category}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Job Skills<span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.job_skills && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="job_skills"
                      value={userData.job_skills}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        Select Tag
                      </option>
                      {Object.entries(tagData).map(([key, values]) => {
                        return <option value={values}>{values}</option>;
                      })}
                    </select>
                    {errors.job_skills && (
                      <div className="text-danger">{errors.job_skills}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Job Designation<span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.job_designation && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="job_designation"
                      value={userData.job_designation}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        Select Tag
                      </option>
                      {Object.entries(tagData).map(([key, values]) => {
                        return <option value={values}>{values}</option>;
                      })}
                    </select>
                    {errors.job_designation && (
                      <div className="text-danger">
                        {errors.job_designation}
                      </div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Job Location<span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.job_location && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="job_location"
                      value={userData.job_location}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        Select Tag
                      </option>
                      {Object.entries(tagData).map(([key, values]) => {
                        return <option value={values}>{values}</option>;
                      })}
                    </select>
                    {errors.job_location && (
                      <div className="text-danger">{errors.job_location}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Work Type<span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.work_type && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="work_type"
                      value={userData.work_type}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        Select Tag
                      </option>
                      {Object.entries(tagData).map(([key, values]) => {
                        return <option value={values}>{values}</option>;
                      })}
                    </select>
                    {errors.work_type && (
                      <div className="text-danger">{errors.work_type}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Expiry Date<span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.expirydate && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="expirydate"
                      value={userData.expirydate}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        Select Tag
                      </option>
                      {Object.entries(tagData).map(([key, values]) => {
                        return <option value={values}>{values}</option>;
                      })}
                    </select>
                    {errors.expirydate && (
                      <div className="text-danger">{errors.expirydate}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Company Name<span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.comapany_name && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="comapany_name"
                      value={userData.comapany_name}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        Select Tag
                      </option>
                      {Object.entries(tagData).map(([key, values]) => {
                        return <option value={values}>{values}</option>;
                      })}
                    </select>
                    {errors.comapany_name && (
                      <div className="text-danger">{errors.comapany_name}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Company Website<span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.comapany_website && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="comapany_website"
                      value={userData.comapany_website}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        Select Tag
                      </option>
                      {Object.entries(tagData).map(([key, values]) => {
                        return <option value={values}>{values}</option>;
                      })}
                    </select>
                    {errors.comapany_website && (
                      <div className="text-danger">
                        {errors.comapany_website}
                      </div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Contact Person<span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.contact_person && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="contact_person"
                      value={userData.contact_person}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        Select Tag
                      </option>
                      {Object.entries(tagData).map(([key, values]) => {
                        return <option value={values}>{values}</option>;
                      })}
                    </select>
                    {errors.contact_person && (
                      <div className="text-danger">{errors.contact_person}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary button1"
                    onClick={handleClick}
                  >
                    NEXT
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

export default APImportJobElements;
