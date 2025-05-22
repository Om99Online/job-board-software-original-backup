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

const APAddPlan = () => {
  const [userData, setUserData] = useState({
    plan_name: "",
    job_post: "",
    resume_download: "",
    candidate_search: "0",
    job_apply: "0",
    profile_view: "0",
    amount: "",
    planuser: "",
    type_value: "",
    type: "",
  });
  const [errors, setErrors] = useState({
    plan_name: "",
    job_post: "",
    resume_download: "",
    candidate_search: "",
    job_apply: "",
    profile_view: "",
    amount: "",
    planuser: "",
    type_value: "",
    type: "",
    job_apply_checkbx: "",
    job_apply_input: "",
    emp_checkbx: "",
  });
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");
  const [planType, setPlanType] = useState([]);
  const [typeofUser, setTypeofUser] = useState([]);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/admin/plan/addPlan",
        null, // Pass null as the request body if not required
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
      setPlanType(response.data.response.planType);
      setTypeofUser(response.data.response.userType);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get plans data at APmanageplans");
    }
  };

  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      const newErrors = {};

      if (userData.plan_name === "") {
        newErrors.plan_name = "Plan Name is required";
      }

      if (userData.amount === "") {
        newErrors.amount = "Amount is required";
      }
      if (userData.planuser === "") {
        newErrors.planuser = "User Plan is required";
      }
      if (userData.type === "") {
        newErrors.type = "Plan Type is required";
      }
      if (userData.type_value === "") {
        newErrors.type_value = "Type is required";
      }
      if (userData.planuser === "jobseeker" && !isNumJobApplyCheckboxChecked) {
        newErrors.job_apply_checkbx = "Please select atleast one feature";
      }
      if (
        userData.planuser === "jobseeker" &&
        isNumJobApplyCheckboxChecked &&
        userData.job_apply === ""
      ) {
        newErrors.job_apply_input = "Please enter a value";
      }
      if (
        userData.planuser === "jobseeker" &&
        isNumJobApplyCheckboxChecked &&
        userData.job_apply <= 0
      ) {
        newErrors.job_apply_input = "Please enter a value greater than 0";
      }
      // if(userData.planuser === "employer"){
      //   if(isNumJobPostCheckboxChecked ||
      //     isResumeDownloadCheckboxChecked ||
      //     isCandidateSearchFunctionalityCheckBxChecked ||
      //     isProfileViewCheckboxChecked){
      //       newErrors.emp_checkbx = ""
      //     }else{
      //       newErrors.emp_checkbx = "Please select atleast one feature"
      //     }
      // }
      // if (
      //   userData.planuser === "employer" &&
      //   !isNumJobPostCheckboxChecked ||
      //     !isResumeDownloadCheckboxChecked ||
      //     !isCandidateSearchFunctionalityCheckBxChecked ||
      //     !isProfileViewCheckboxChecked
      // ){
      //   newErrors.emp_checkbx = "Please select atleast one feature"
      // }

      // Validate that at least one of the checkboxes is checked for employer plan
      if (
        userData.planuser === "employer" &&
        !(
          isNumJobPostCheckboxChecked ||
          isResumeDownloadCheckboxChecked ||
          isCandidateSearchFunctionalityCheckBxChecked ||
          isProfileViewCheckboxChecked
        )
      ) {
        newErrors.emp_checkbx = "Please select at least one feature";
      }

      if (
        userData.planuser === "employer" &&
        isNumJobPostCheckboxChecked &&
        userData.job_post === ""
      ) {
        newErrors.job_post = "Please enter a value";
      }
      if (
        userData.planuser === "employer" &&
        isNumJobPostCheckboxChecked &&
        userData.job_post <= 0
      ) {
        newErrors.job_post = "Please enter a value greater than 0";
      }

      // for employer - resume download
      if (
        userData.planuser === "employer" &&
        isResumeDownloadCheckboxChecked &&
        userData.resume_download === ""
      ) {
        newErrors.resume_download = "Please enter a value";
      }
      if (
        userData.planuser === "employer" &&
        isResumeDownloadCheckboxChecked &&
        userData.resume_download <= 0
      ) {
        newErrors.resume_download = "Please enter a value greater than 0";
      }

      //for employer - profile view
      if (
        userData.planuser === "employer" &&
        isProfileViewCheckboxChecked &&
        userData.profile_view === ""
      ) {
        newErrors.profile_view = "Please enter a value";
      }
      if (
        userData.planuser === "employer" &&
        isProfileViewCheckboxChecked &&
        userData.profile_view <= 0
      ) {
        newErrors.profile_view = "Please enter a value greater than 0";
      }
      setErrors(newErrors);
      console.log(isNumJobPostCheckboxChecked, "jobpost");

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Add Plan",
          text: "Do you want to Add this Plan?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (confirmationResult.isConfirmed) {
          setLoading(true);

          const response = await axios.post(
            BaseApi + "/admin/plan/addPlan",
            userData,
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
              title: "Plan added successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            setUserData({
              ...userData,
              plan_name: "",
              type_value: "",
              type: "",
              amount: "",
              userplan: "",
              feature_ids: "",
            });
            window.scrollTo(0, 0);
            navigate("/admin/plans/index");
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
        text: "Could not add plan. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not add plan!", error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "planuser") {
      const selectedUserType = e.target.value;
      setUserType(selectedUserType);
      if (value === "employer") {
        setUserData({ ...userData, job_apply: "0" });
        setIsNumJobPostCheckboxChecked(false);
        setIsResumeDownloadCheckboxChecked(false);
        setIsProfileViewCheckboxChecked(false);
      }
      if (value === "jobseeker") {
        setUserData({
          ...userData,
          job_post: "0",
          resume_download: "0",
          candidate_search: "0",
          profile_view: "0",
        });
      }

      // If the user type changes, hide the input box and checkbox
      setIsNumJobApplyCheckboxChecked(false);
      setIsProfileViewCheckboxChecked(false);
      setIsResumeDownloadCheckboxChecked(false);
    }
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const [inputValue, setInputValue] = useState("");

  const [usertype, setUserType] = useState("");

  const [isUnlimitedChecked, setIsUnlimitedChecked] = useState(false);

  // Employer
  // Number of job post
  const [isNumJobPostCheckboxChecked, setIsNumJobPostCheckboxChecked] =
    useState(false);
  const [numJobPostInputValue, setNumJobPostInputValue] = useState("");
  const [isNumJobPostUnlimitedChecked, setIsNumJobPostUnlimitedChecked] =
    useState(false);
  const handleNumJobPostUnlimitedChange = (event) => {
    setIsNumJobPostUnlimitedChecked(event.target.checked);
    if (event.target.checked) {
      setNumJobPostInputValue(""); // Reset input value when "Unlimited" is checked
      setUserData({ ...userData, job_post: "50000" });
      setErrors((prev) => ({
        ...prev,
        job_post: "",
      }));
    } else {
      setUserData({ ...userData, job_post: "" });
    }
    setErrors((prev) => ({
      ...prev,
      job_post: "",
    }));
    console.log(userData);
  };
  const handleNumJobPostCheckBxChange = (event) => {
    setIsNumJobPostCheckboxChecked(event.target.checked);
    if (!event.target.checked) {
      setUserData({ ...userData, job_post: "empty" });
    }
    if (event.target.checked) {
      setUserData({ ...userData, job_post: "" });
    }
    if (!isNumJobPostUnlimitedChecked) {
      setNumJobPostInputValue(event.target.value);
    }
    setErrors((prev) => ({
      ...prev,
      emp_checkbx: "",
    }));
  };

  // **********End**********

  // number of resume download
  const [isResumeDownloadCheckboxChecked, setIsResumeDownloadCheckboxChecked] =
    useState(false);
  const [resumeDownloadsInputValue, setResumeDownloadsInputValue] =
    useState("");
  const [
    isResumeDownloadsUnlimitedChecked,
    setIsResumeDownloadsUnlimitedChecked,
  ] = useState(false);
  // Function to handle changes in the "Unlimited" checkbox for Resume Downloads
  const handleResumeDownloadsUnlimitedChange = (e) => {
    setIsResumeDownloadsUnlimitedChecked(e.target.checked);

    // If "Unlimited" is checked, clear the input value
    if (e.target.checked) {
      setResumeDownloadsInputValue("");
      setUserData({ ...userData, resume_download: "1000000" });
      setErrors((prev) => ({
        ...prev,
        resume_download: "",
      }));
    } else {
      setUserData({ ...userData, resume_download: "" });
    }
    setErrors((prev) => ({
      ...prev,
      resume_download: "",
    }));
    console.log(userData);
  };
  // Function to handle changes in the "Number of Resume Downloads" input value
  const handleResumeDownloadsCheckBxChange = (e) => {
    setIsResumeDownloadCheckboxChecked(e.target.checked);
    if (!e.target.checked) {
      setUserData({ ...userData, resume_download: "empty" });
    } else {
      setUserData({ ...userData, resume_download: "" });
    }
    if (!isResumeDownloadsUnlimitedChecked) {
      setResumeDownloadsInputValue(e.target.value);
    }
    setErrors((prev) => ({
      ...prev,
      emp_checkbx: "",
    }));
  };

  // *****************End****************

  // Access candidate search functionality
  const [
    isCandidateSearchFunctionalityCheckBxChecked,
    setIsCandidateSearchFunctionalityCheckBxChecked,
  ] = useState(false);

  const handleCandidateSearchFunctionalityCheckBxChange = (e) => {
    setIsCandidateSearchFunctionalityCheckBxChecked(e.target.checked);
    if (isCandidateSearchFunctionalityCheckBxChecked) {
      setUserData({ ...userData, candidate_search: "1" });
    } else {
      setUserData({ ...userData, candidate_search: "empty" });
    }
    setErrors((prev) => ({
      ...prev,
      emp_checkbx: "",
    }));
    console.log(userData);
  };

  // *************End*************

  // Number of candidate profile view

  const [isProfileViewCheckboxChecked, setIsProfileViewCheckboxChecked] =
    useState(false);
  const [profileViewsInputValue, setProfileViewsInputValue] = useState("");
  const [isProfileViewsUnlimitedChecked, setIsProfileViewsUnlimitedChecked] =
    useState(false);

  // Function to handle changes in the "Number of Candidate Profile Views" input value
  const handleProfileViewsCheckBxChange = (e) => {
    setIsProfileViewCheckboxChecked(e.target.checked);
    if (!e.target.checked) {
      setUserData({ ...userData, profile_view: "empty" });
    } else {
      setUserData({ ...userData, profile_view: "" });
    }
    if (!isProfileViewsUnlimitedChecked) {
      setProfileViewsInputValue(e.target.value);
    }
    setErrors((prev) => ({
      ...prev,
      emp_checkbx: "",
    }));
    console.log(userData);
  };

  // Function to handle changes in the "Unlimited" checkbox for Profile Views
  const handleProfileViewsUnlimitedChange = (e) => {
    setIsProfileViewsUnlimitedChecked(e.target.checked);

    // If "Unlimited" is checked, clear the input value
    if (e.target.checked) {
      setProfileViewsInputValue("");
      setUserData({ ...userData, profile_view: "1000000" });
      setErrors((prev) => ({
        ...prev,
        profile_view: "",
      }));
    } else {
      setUserData({ ...userData, profile_view: "" });
    }
    setErrors((prev) => ({
      ...prev,
      profile_view: "",
    }));
  };

  // ***************End*****************

  //Jobseeker
  // Number of Job Apply
  const [isNumJobApplyCheckboxChecked, setIsNumJobApplyCheckboxChecked] =
    useState(false);
  const [numJobApplyInputValue, setNumJobApplyInputValue] = useState("");
  const [isNumJobApplyUnlimitedChecked, setIsNumJobApplyUnlimitedChecked] =
    useState(false);
  const [jobApplyValidation, setJobApplyValidation] = useState(false);

  const handleNumJobApplyCheckBxChange = (event) => {
    console.log(event.target.checked);
    setIsNumJobApplyCheckboxChecked(event.target.checked);
    if (!event.target.checked) {
      setUserData({ ...userData, job_apply: "empty" });
      setJobApplyValidation(false);
      setIsNumJobApplyUnlimitedChecked(false);
    }
    if (event.target.checked) {
      setNumJobApplyInputValue(""); // Reset input value when "Unlimited" is checked
      setJobApplyValidation(true);
      setUserData({ ...userData, job_apply: "" });
    }
    setErrors((prev) => ({
      ...prev,
      job_apply_checkbx: "",
    }));
  };

  const handleJobseekerUnlimitedChange = (event) => {
    console.log(event.target.checked);
    setIsNumJobApplyUnlimitedChecked(event.target.checked);
    if (event.target.checked) {
      setNumJobApplyInputValue(""); // Reset input value when "Unlimited" is checked
      setUserData({ ...userData, job_apply: "1000000" });
      setErrors((prev) => ({
        ...prev,
        job_apply_input: "",
      }));
    } else {
      setUserData({ ...userData, job_apply: "" });
    }
    setErrors((prev) => ({
      ...prev,
      job_apply_input: "",
    }));
  };

  const handleReset = () => {
    setUserData({
      plan_name: "",
      job_post: "",
      resume_download: "",
      candidate_search: "",
      job_apply: "",
      profile_view: "",
      amount: "",
      planuser: "",
      type_value: "",
      type: "",
    });
  };

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
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate("/admin/admins/dashboard")}
                  >
                    Dashboard
                  </Link>
                  <Link
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate("/admin/plans/index")}
                  >
                    Plan List
                  </Link>
                  <Typography color="text.primary">Add Plan</Typography>
                </Breadcrumbs>
              </div>

              <h2 className="adminPageHeading">Add Plan</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Plan Name<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.plan_name && "input-error"
                      }`}
                      name="plan_name"
                      placeholder="Plan Name"
                      value={userData.plan_name}
                      onChange={handleChange}
                    />
                    {errors.plan_name && (
                      <div className="text-danger">{errors.plan_name}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Type<span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${errors.type && "input-error"}`}
                      aria-label="Default select example"
                      name="type"
                      value={userData.type}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        Select Plan Type
                      </option>
                      {Object.entries(planType).map(([key, value]) => {
                        return <option value={key}>{value}</option>;
                      })}
                    </select>
                    {errors.type && (
                      <div className="text-danger">{errors.type}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      User Plan<span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.planuser && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="planuser"
                      value={userData.planuser}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        Select User Plan
                      </option>
                      {Object.entries(typeofUser).map(([key, value]) => {
                        return <option value={key}>{value}</option>;
                      })}
                    </select>
                    {errors.planuser && (
                      <div className="text-danger">{errors.planuser}</div>
                    )}
                  </div>

                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      {userData.type === "Years"
                        ? "Time Period (In Years)"
                        : userData.type === "Months"
                        ? "Time Period (In Months)"
                        : "Time Period"}

                      <span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.type_value && "input-error"
                      }`}
                      name="type_value"
                      placeholder="Time Period"
                      value={userData.type_value}
                      onChange={handleChange}
                    />
                    {errors.type_value && (
                      <div className="text-danger">{errors.type_value}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Plan Amount<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.amount && "input-error"
                      }`}
                      name="amount"
                      placeholder="Plan Amount"
                      value={userData.amount}
                      onChange={handleChange}
                    />
                    {errors.amount && (
                      <div className="text-danger">{errors.amount}</div>
                    )}
                  </div>

                  {/* ****************************** Code for Employer ************************ */}

                  {userData.planuser === "employer" && (
                    <>
                      {errors.emp_checkbx && (
                        <div className="text-danger mb-3">
                          {errors.emp_checkbx}
                        </div>
                      )}
                      <div className="mb-2 DashBoardInputBx checkBoxDiv">
                        <label htmlFor="formFile" className="form-label">
                          Select Features<span className="RedStar">*</span>
                        </label>
                        <div className="NumberCheck">
                          <input
                            type="checkbox"
                            id="jobPostCheckbox"
                            className=""
                            label="Number of Job Post"
                            // className="form-select"
                            // aria-label="Default select example"
                            // name="feature_ids"
                            // value={userData.feature_ids}
                            onChange={handleNumJobPostCheckBxChange}
                          />

                          <label>Number of Job Post</label>
                        </div>

                        <div className="NumberCheck">
                          <input
                            type="checkbox"
                            id="resumeDownloadsCheckbox"
                            className=""
                            name="resumeDownloads"
                            // value={userData}
                            onChange={handleResumeDownloadsCheckBxChange}
                          />
                          <label>Number of resume download</label>
                        </div>
                      </div>
                      <div className="mb-5 DashBoardInputBx checkBoxDiv">
                        <div className="NumberCheck">
                          <input
                            type="checkbox"
                            id="jobPostCheckbox"
                            className=""
                            label="Number of Job Post"
                            // className="form-select"
                            // aria-label="Default select example"
                            name="feature_ids"
                            value={userData.candidate_search}
                            onChange={
                              handleCandidateSearchFunctionalityCheckBxChange
                            }
                          />
                          <label>Access candidate search functionality</label>
                        </div>
                        <div className="NumberCheck">
                          <input
                            type="checkbox"
                            id="profileViewsCheckbox"
                            className=""
                            name="profileViews"
                            value={userData.profile_view}
                            onChange={handleProfileViewsCheckBxChange}
                          />
                          <label>Number of Candidate Profile Views</label>
                        </div>
                      </div>
                    </>
                  )}
                  {userData.planuser === "employer" &&
                    isNumJobPostCheckboxChecked && (
                      <>
                        <div className="mb-4 DashBoardInputBx jobPost">
                          <label htmlFor="jobApplyInput" className="form-label">
                            Number of Job Post:
                          </label>
                          <input
                            type="text"
                            id="jobPostInput"
                            className="form-control"
                            name="job_post"
                            value={
                              isNumJobPostUnlimitedChecked
                                ? ""
                                : userData.job_post
                            }
                            onChange={(e) => {
                              if (!isNumJobPostUnlimitedChecked) {
                                setNumJobPostInputValue(e.target.value);
                                setUserData({
                                  ...userData,
                                  job_post: e.target.value,
                                });
                                setErrors({
                                  job_post: "",
                                });
                                console.log(userData);
                              }
                            }}
                            disabled={isNumJobPostUnlimitedChecked}
                          />

                          <div className="mb-2 DashBoardInputBx checkBoxDiv">
                            <input
                              type="checkbox"
                              id="unlimitedCheckbox"
                              className="unlimitedCheckbx"
                              name="unlimited"
                              checked={isNumJobPostUnlimitedChecked}
                              onChange={handleNumJobPostUnlimitedChange}
                            />
                            <label className="unlimitedLabel">Unlimited</label>
                          </div>
                          {errors.job_post && (
                            <div className="text-danger">{errors.job_post}</div>
                          )}
                        </div>
                      </>
                    )}
                  {userData.planuser === "employer" &&
                    isResumeDownloadCheckboxChecked && (
                      <>
                        <div className="mb-4 DashBoardInputBx jobPost">
                          <label
                            htmlFor="resumeDownloadsInput"
                            className="form-label"
                          >
                            Number of Resume Downloads:
                          </label>
                          <input
                            type="text"
                            id="jobPostInput"
                            className="form-control"
                            name="resumeDownloadsInput"
                            value={
                              isResumeDownloadsUnlimitedChecked
                                ? ""
                                : userData.resume_download
                            }
                            onChange={(e) => {
                              if (!isResumeDownloadsUnlimitedChecked) {
                                setResumeDownloadsInputValue(e.target.value);
                                setUserData({
                                  ...userData,
                                  resume_download: e.target.value,
                                });
                                setErrors((prev) => ({
                                  ...prev,
                                  resume_download: "",
                                }));
                                console.log(userData);
                              }
                            }}
                            disabled={isResumeDownloadsUnlimitedChecked}
                          />
                          <div className="mb-2 DashBoardInputBx checkBoxDiv">
                            <input
                              type="checkbox"
                              id="resumeDownloadsUnlimitedCheckbox"
                              className="unlimitedCheckbx"
                              name="resumeDownloadsUnlimited"
                              checked={isResumeDownloadsUnlimitedChecked}
                              onChange={handleResumeDownloadsUnlimitedChange}
                            />
                            <label className="unlimitedLabel">Unlimited</label>
                          </div>
                          {errors.resume_download && (
                            <div className="text-danger">
                              {errors.resume_download}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  {userData.planuser === "employer" &&
                    isProfileViewCheckboxChecked && (
                      <>
                        <div className="mb-4 DashBoardInputBx">
                          <label
                            htmlFor="profileViewsInput"
                            className="form-label"
                          >
                            Number of Candidate Profile Views:
                          </label>
                          <input
                            type="text"
                            id="jobPostInput"
                            className="form-control"
                            name="profileViewsInput"
                            value={
                              isProfileViewsUnlimitedChecked
                                ? ""
                                : userData.profile_view
                            }
                            onChange={(e) => {
                              if (!isProfileViewsUnlimitedChecked) {
                                setProfileViewsInputValue(e.target.value);
                                setUserData({
                                  ...userData,
                                  profile_view: e.target.value,
                                });
                                setErrors((prev) => ({
                                  ...prev,
                                  profile_view: "",
                                }));
                              }
                              console.log(userData);
                            }}
                            disabled={isProfileViewsUnlimitedChecked}
                          />
                          <div className="mb-2 DashBoardInputBx checkBoxDiv">
                            <input
                              type="checkbox"
                              id="profileViewsUnlimitedCheckbox"
                              className="unlimitedCheckbx"
                              name="profileViewsUnlimited"
                              checked={isProfileViewsUnlimitedChecked}
                              onChange={handleProfileViewsUnlimitedChange}
                            />
                            <label className="unlimitedLabel">Unlimited</label>
                          </div>
                          {errors.profile_view && (
                            <div className="text-danger">
                              {errors.profile_view}
                            </div>
                          )}
                        </div>
                      </>
                    )}

                  {/* *************************** Code for Jobseeker****************************** */}

                  {userData.planuser === "jobseeker" && (
                    <div className="mb-5 DashBoardInputBx checkBoxDiv">
                      <label htmlFor="formFile" className="form-label">
                        Select Features<span className="RedStar">*</span>
                      </label>
                      <div className="NumberCheck">
                        <input
                          type="checkbox"
                          id="jobPostCheckbox"
                          className=""
                          label="Number of Job Post"
                          // className="form-select"
                          // aria-label="Default select example"
                          name="feature_ids"
                          // value={userData.feature_ids}
                          onChange={handleNumJobApplyCheckBxChange}
                        />

                        <label>Number of Job Apply</label>
                      </div>
                      {errors.job_apply_checkbx && (
                        <div className="text-danger">
                          {errors.job_apply_checkbx}
                        </div>
                      )}
                    </div>
                  )}
                  {userData.planuser === "jobseeker" &&
                    isNumJobApplyCheckboxChecked && (
                      <div className="mb-4 DashBoardInputBx">
                        <label htmlFor="jobApplyInput" className="form-label">
                          Number of Job Apply:
                        </label>
                        <input
                          type="text"
                          id="jobPostInput"
                          className="form-control"
                          name="job_apply"
                          value={
                            isNumJobApplyUnlimitedChecked
                              ? ""
                              : userData.job_apply
                          }
                          onChange={(e) => {
                            if (!isNumJobApplyUnlimitedChecked) {
                              setNumJobApplyInputValue(e.target.value);
                              setUserData({
                                ...userData,
                                job_apply: e.target.value,
                              });
                              setErrors((prev) => ({
                                ...prev,
                                job_apply_input: "",
                              }));
                            }
                          }}
                          disabled={isNumJobApplyUnlimitedChecked}
                        />

                        <div className="mb-2 DashBoardInputBx checkBoxDiv">
                          <input
                            type="checkbox"
                            id="unlimitedCheckbox"
                            className="unlimitedCheckbx"
                            name="unlimited"
                            checked={isNumJobApplyUnlimitedChecked}
                            onChange={handleJobseekerUnlimitedChange}
                          />
                          <label className="unlimitedLabel">Unlimited</label>
                        </div>
                        {errors.job_apply_input && (
                          <div className="text-danger">
                            {errors.job_apply_input}
                          </div>
                        )}
                      </div>
                    )}
                </div>
                <button
                  type="button"
                  className="btn btn-primary adminLowerButton1"
                  onClick={handleClick}
                >
                  SAVE
                </button>
                <button
                  type="button"
                  className="btn btn-primary adminLowerButton2"
                  onClick={handleReset}
                >
                  RESET
                </button>
              </form>
            </div>
            <APFooter />
          </>
        )}
      </div>
    </>
  );
};

export default APAddPlan;
