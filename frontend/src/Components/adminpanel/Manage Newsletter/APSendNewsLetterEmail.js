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
import Select from "react-select";
import APFooter from "../Elements/APFooter";

const APSendNewsLetterEmail = () => {
  const [userData, setUserData] = useState({
    usertype: "",
    template_id: "",
    jobseekstatus: 1,
    empstatus: 1,
    jobseekers: 1,
    employers: 1,
  });
  const [errors, setErrors] = useState({
    usertype: "",
    template_id: "",
    jobseekstatus: "",
    empstatus: "",
    jobseekers: "",
    employers: "",
  });
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [employersList, setEmployersList] = useState([]);
  const [jobseekersList, setJobseekersList] = useState([]);
  const [toggleEmployers, setToggleEmployers] = useState(false);
  const [toggleJobseekers, setToggleJobseekers] = useState(false);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");
  const [usertype, setUserType] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "usertype") {
      const selectedUserType = e.target.value;
      setUserType(selectedUserType);

      // Determine whether to show/hide select boxes based on user type and email status
      if (selectedUserType === "recruiter" && value === "2") {
        setToggleEmployers(true);
        setToggleJobseekers(false);
      } else if (selectedUserType === "candidate" && value === "2") {
        setToggleEmployers(false);
        setToggleJobseekers(true);
      } else {
        setToggleEmployers(false);
        setToggleJobseekers(false);
      }
    }
    if (name === "empstatus") {
      const selectedStatus = e.target.value;

      if (selectedStatus === "2") {
        setToggleEmployers(true);
        setToggleJobseekers(false);
      }
    }
    if (name === "jobseekstatus") {
      const selectedStatus = e.target.value;

      if (selectedStatus === "2") {
        setToggleJobseekers(true);
        setToggleEmployers(false);
      }
    }
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    // console.log(userData.template_id);
    // console.log(userData.usertype);
    // console.log(userData.empstatus, userData.jobseekstatus);
    console.log(userData);
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/admin/newsletter/admin_sendNewsletter",
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
      setUserData(response.data.response);
      setTemplates(response.data.response.templates);
      setEmployersList(response.data.response.employerUserList);
      setJobseekersList(response.data.response.jobseekerUserList);
    } catch (error) {
      console.log("Error at SMTP data fetching");
    }
  };

  const handleClick = async () => {
    var employers = document.getElementsByName("employers");
    var jobseekers = document.getElementsByName("jobseekers");
    var employersArray = [];
    var jobseekersArray = [];

    employers.forEach((element) => {
      employersArray.push(element.value);
    });
    jobseekers.forEach((element) => {
      jobseekersArray.push(element.value);
    });
    console.log(employersArray);
    setUserData({
      ...userData,
      employers: employersArray,
      jobseekers: jobseekersArray,
    });
    try {
      const {
        usertype,
        template_id,
        jobseekstatus,
        empstatus,
        jobseekers,
        employers,
      } = userData;
      if (!usertype || !template_id) {
        setErrors({
          usertype: usertype ? "" : "Usertype is required",
          template_id: template_id ? "" : "Newsletter template is required",
          // jobseekstatus: jobseekstatus ? "" : "Email type is required",
          // empstatus: empstatus ? "" : "Email type is required",
        });
        return;
      }
      if(usertype === "recruiter") {
        if(!empstatus) {
          setErrors({
            empstatus: empstatus ? "" : "Email type is required"
          })
          return;
        }
      }
      if(usertype === "candidate") {
        if(!jobseekstatus) {
          setErrors({
            jobseekstatus: jobseekstatus ? "" : "Email type is required"
          })
          return;
        }
      }
      if (usertype === "recruiter" && userData.empstatus === "2" && selectedEmployers.length === 0) {
        // Show an error message for the "employers" field
        console.log("here")
        setErrors({
          employers: "Please select employers" });
        return;
      }
      if (usertype === "candidate" && jobseekstatus === "2" && selectedJobseekers.length === 0) {
        // if (!jobseekers || jobseekers.length == 0 || jobseekers.length == null) {
          setErrors({
            jobseekers:  "Jobseekers is required",
          });
          return;
        // }
      }
      if (
        errors.length > 0
      ) {
        // If any validation errors exist, return early
        return;
      }
      
      const confirmationResult = await Swal.fire({
        title: "Send?",
        text: "Do you want to send newsletter to subscribers?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (confirmationResult.isConfirmed) {
        const updatedData = {
          ...userData,
          employers: employersArray,
          jobseekers: jobseekersArray,
        };
        // setLoading(true);

        const response = await axios.post(
          BaseApi + "/admin/newsletter/admin_sendNewsletter",
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

        // setLoading(false);

        if (response.data.status === 200) {
          Swal.fire({
            title: "Newsletter sent successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          getData();

          window.scrollTo(0, 0);
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
      }
      // }
    } catch (error) {
      // setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not send newsletter. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not update SMTP Settings!", error);
    }
  };
  // const handleEmployerClick = () => {
  //   setToggleEmployers(true);
  //   setToggleJobseekers(false);
  // };
  // const handleJobseekerClick = () => {
  //   setToggleEmployers(false);
  //   setToggleJobseekers(true);
  // };

  // const renderDropdown = () => {
  //   if (userData.empstatus === "2") {
  //     // Display the dropdown when "Select Employers to Send a Newsletter" is selected
  //     return (
  //       <div>
  //         <label htmlFor="employerList">Select Employers:</label>
  //         <select id="employerList" name="employerList">
  //           {/* Add options for employer selection */}
  //           <option value="employer1">Employer 1</option>
  //           <option value="employer2">Employer 2</option>
  //           {/* Add more options as needed */}
  //         </select>
  //       </div>
  //     );
  //   }
  //   // Return null when "Send Mail to all Employers" is selected or by default
  //   return null;
  // };

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

  const [selectedEmployers, setSelectedEmployers] = useState([]);

  const handleEmployersChange = (selectedOptions) => {
    setSelectedEmployers(selectedOptions); // Update selected skills
    // Check if selectedOptions is not empty
    if (selectedOptions.length > 0) {
      // If not empty, clear the error message
      setErrors((prev) => ({
        ...prev,
        skill: "",
      }));
    }
    // If it is empty, leave the error message as is
  };

  const [selectedJobseekers, setSelectedJobseekers] = useState([]);

  const handleJobseekersChange = (selectedOptions) => {
    setSelectedJobseekers(selectedOptions); // Update selected skills
    // Check if selectedOptions is not empty
    if (selectedOptions.length > 0) {
      // If not empty, clear the error message
      setErrors((prev) => ({
        ...prev,
        skill: "",
      }));
    }
    // If it is empty, leave the error message as is
  };

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
                    onClick={() => navigate("/admin/newsletters/index")}
                  >
                    Newsletter
                  </Link>

                  <Typography color="text.primary">
                    Send Newsletter to Newsletter Subscribers
                  </Typography>
                </Breadcrumbs>
              </div>
              <h2 className="adminPageHeading">
                Send Newsletter to Newsletter Subscribers
              </h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Select Newsletter Template<span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.template_id && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="template_id"
                      value={userData.template_id}
                      onChange={handleChange}
                    >
                      <option value="">Select Newsletter Template</option>
                      {templates.map((i) => {
                        return <option value={i.id}>{i.subject}</option>;
                      })}
                    </select>
                    {errors.template_id && (
                      <div className="text-danger">{errors.template_id}</div>
                    )}
                  </div>
                  <div className="mb-5 DashBoardInputBx">
                    <label className="form-label" htmlFor="userTypeSelect">
                      Select User Type<span className="RedStar">*</span>
                    </label>
                    <div className="APPaymentDetailsRadio">
                      <select
                        id="userTypeSelect"
                        className={`form-select ${
                          errors.usertype ? "input-error" : ""
                        }`}
                        name="usertype"
                        value={userData.usertype}
                        onChange={handleChange}
                      >
                        <option selected value="">
                          Select User Type
                        </option>
                        <option value="recruiter">Employer</option>
                        <option value="candidate">Jobseeker</option>
                      </select>
                      {errors.usertype && (
                      <div className="text-danger">{errors.usertype}</div>
                    )}
                    </div>
                  </div>

                  {userData.usertype === "recruiter" && (
                    <>
                      <div className="mb-5 DashBoardInputBx">
                        <label className="form-label" htmlFor="emailTypeSelect">
                          Select Sharing Option<span className="RedStar">*</span>
                        </label>
                        <div className="APPaymentDetailsRadio">
                          <select
                            id="emailTypeSelect"
                            className={`form-select ${
                              errors.empstatus ? "input-error" : ""
                            }`}
                            name="empstatus"
                            value={userData.empstatus}
                            onChange={handleChange}
                          >
                            <option selected value="">
                              Select sharing option
                            </option>
                            <option value="1">
                              Send Newsletter to all Employers
                            </option>
                            <option value="2">
                              Select Employers to Send a Newsletter
                            </option>
                          </select>
                          {errors.empstatus && (
                            <div className="text-danger">
                              {errors.empstatus}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* {renderDropdown()}{" "} */}
                    </>
                  )}
                  {userData.usertype === "candidate" && (
                    <>
                      <div className="mb-5 DashBoardInputBx">
                        <label className="form-label" htmlFor="emailTypeSelect">
                          Select Sharing Option<span className="RedStar">*</span>
                        </label>
                        <div className="APPaymentDetailsRadio">
                          <select
                            id="emailTypeSelect"
                            className={`form-select ${
                              errors.jobseekstatus ? "input-error" : ""
                            }`}
                            name="jobseekstatus"
                            value={userData.jobseekstatus}
                            onChange={handleChange}
                          >
                            <option selected value="">
                              Select sharing option
                            </option>
                            <option value="1">
                              Send Newsletter to all Jobseekers
                            </option>
                            <option value="2">
                              Select Jobseekers to send a Newsletter
                            </option>
                          </select>
                          {errors.jobseekstatus && (
                            <div className="text-danger">
                              {errors.jobseekstatus}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  {userData.empstatus === "2" && toggleEmployers && (
                    <>
                      <div class="mb-5 DashBoardInputBx DashBoardCreatBx skillPackage APJoditEditor">
                        <label for="formFile" class="form-label">
                          Select Employers<span className="RedStar">*</span>
                        </label>
                        {/* <select
                          className="form-select"
                          aria-label="Default select example"
                          name="employers"
                          value={userData.employers}
                          onChange={handleChange}
                        >
                          {employersList.map((i) => {
                            return (
                              <option value={i.id}>
                                {i.first_name} {i.last_name}
                              </option>
                            );
                          })}
                        </select> */}

                        <Select
                          // defaultValue={[colourOptions[2], colouptions[3]]}
                          isMulti
                          isSearchable
                          name="employers"
                          options={employersList.map((i) => ({
                            value: i.email_address,
                            label: i.email_address,
                          }))}
                          className="basic-multi-select"
                          value={selectedEmployers}
                          classNamePrefix="select"
                          onChange={handleEmployersChange}
                        />
                        {errors.employers && (
                          <div className="text-danger">{errors.employers}</div>
                        )}
                      </div>
                    </>
                  )}
                  {userData.jobseekstatus === "2" && toggleJobseekers && (
                    <>
                      <div class="mb-5 DashBoardInputBx DashBoardCreatBx skillPackage APJoditEditor">
                        <label for="formFile" class="form-label">
                          Select Jobseekers <span className="RedStar">*</span>
                        </label>
                        {/* <select
                          className="form-select"
                          aria-label="Default select example"
                          name="jobseekers"
                          value={userData.jobseekers}
                          onChange={handleChange}
                        >
                          <option value="">Select Jobseekers</option>
                          {jobseekersList.map((i) => {
                            return (
                              <option value={i.id}>
                                {i.first_name} {i.last_name}
                              </option>
                            );
                          })}
                        </select> */}

                        <Select
                          // defaultValue={[colourOptions[2], colouptions[3]]}
                          isMulti
                          isSearchable
                          name="jobseekers"
                          options={jobseekersList.map((i) => ({
                            value: i.email_address,
                            label: i.first_name + " " + i.last_name,
                          }))}
                          className="basic-multi-select"
                          value={selectedJobseekers}
                          classNamePrefix="select"
                          onChange={handleJobseekersChange}
                        />
                        {errors.jobseekers && (
                          <div className="text-danger">{errors.jobseekers}</div>
                        )}
                      </div>
                    </>
                  )}

                  <button
                    type="button"
                    className="btn btn-primary button1"
                    onClick={handleClick}
                  >
                    SEND
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary button2"
                    onClick={() => navigate("/admin/newsletters/index")}
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

export default APSendNewsLetterEmail;
