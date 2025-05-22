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
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import APFooter from "../Elements/APFooter";

const APAddPlan = () => {
  const [userData, setUserData] = useState({
    plan_name: "",
    job_post: "empty",
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

  const { slug } = useParams();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/admin/plan/editPlan/${slug}`,
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
      setUserData(response.data.response.plan);
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
      // if (userData.planuser === "jobseeker" && (!isNumJobApplyCheckboxChecked)) {
      //   newErrors.jobseeker_checkbx = "Please select atleast one feature";
      // }
      // if (
      //   userData.planuser === "employer" &&
      //   (!isNumJobPostCheckboxChecked ||
      //     !isResumeDownloadCheckboxChecked ||
      //     !isCandidateSearchFunctionalityCheckBxChecked ||
      //     !isProfileViewCheckboxChecked)
      // ) {
      //   newErrors.emp_checkbx = "Please select atleast one feature";
      // }else{
      //   newErrors.emp_checkbx = ""
      // }
      // if (userData.planuser === "jobseeker" && isNumJobApplyCheckboxChecked && userData.job_apply === "") {
      //   newErrors.job_apply_input = "Please enter value greater than 0"
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
      console.log(errors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Update Plan",
          text: "Do you want to update this Plan?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (confirmationResult.isConfirmed) {
          setLoading(true);

          const response = await axios.post(
            BaseApi + `/admin/plan/editPlan/${slug}`,
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
              title: "Plan updated successfully!",
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
        text: "Could not update plan. Please try again later!",
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

  // const handleNumJobPostCheckBxChange = (event) => {

  //   if (!event.target.checked) {
  //     setUserData({ ...userData, job_post: "0" });
  //   }
  //   if (!isNumJobPostUnlimitedChecked) {
  //     setNumJobPostInputValue(event.target.value);
  //   }
  // };

  const handleNumJobPostCheckBxChange = (event) => {
    const isChecked = event.target.checked;

    // Update the userData based on the checked state
    if (isChecked) {
      setUserData({ ...userData, job_post: "" }); // Or any other value you prefer
      setIsNumJobPostCheckboxChecked(true);
    } else {
      setUserData({ ...userData, job_post: "empty" });
      setIsNumJobPostCheckboxChecked(false);
    }
    setErrors({
      emp_checkbx: "",
    });
    // Handle other logic if needed
  };
  const handleNumJobPostUnlimitedChange = (event) => {
    setIsNumJobPostUnlimitedChecked(event.target.checked);
    // if(userData.job_post === "50000") {
    //   setIsNumJobPostUnlimitedChecked(true);
    // }

    if (event.target.checked) {
      setNumJobPostInputValue(""); // Reset input value when "Unlimited" is checked
      setUserData({ ...userData, job_post: "50000" });
      setErrors({
        job_post_input: "",
      });
    } else {
      setUserData({ ...userData, job_post: "" });
      setIsNumJobPostUnlimitedChecked(false);
    }

    console.log(userData);
  };

  const handleJobPostInputChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = parseFloat(inputValue);
    // if (numericValue <= 0) {
    //   setErrors({
    //     job_post_input: "Please enter value geater than 0",
    //   });
    //   return;
    // } else {
    //   setErrors({
    //     job_post_input: "",
    //   });
    // }

    if (!isNumJobPostUnlimitedChecked && numericValue > 0) {
      setNumJobPostInputValue(inputValue);
      setUserData({
        ...userData,
        job_post: numericValue,
      });
      setErrors({
        job_post: "",
      });
      console.log(userData);
    }
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
    // setIsResumeDownloadsUnlimitedChecked(e.target.checked);

    // // If "Unlimited" is checked, clear the input value
    // if (e.target.checked) {
    //   setResumeDownloadsInputValue("");
    //   setUserData({ ...userData, resume_download: "1000000" });
    // }
    // console.log(userData);

    setIsResumeDownloadsUnlimitedChecked(e.target.checked);
    // if(userData.job_post === "50000") {
    //   setIsNumJobPostUnlimitedChecked(true);
    // }

    if (e.target.checked) {
      setResumeDownloadsInputValue(""); // Reset input value when "Unlimited" is checked
      setUserData({ ...userData, resume_download: "50000" });
      setErrors({
        resume_download_input: "",
      });
    } else {
      setUserData({ ...userData, resume_download: "" });
      setIsResumeDownloadsUnlimitedChecked(false);
    }

    console.log(userData);
  };
  // Function to handle changes in the "Number of Resume Downloads" input value
  const handleResumeDownloadsCheckBxChange = (e) => {
    // setIsResumeDownloadCheckboxChecked(e.target.checked);
    // if (!e.target.checked) {
    //   setUserData({ ...userData, resume_download: "0" });
    // }
    // if (!isResumeDownloadsUnlimitedChecked) {
    //   setResumeDownloadsInputValue(e.target.value);
    // }
    const isChecked = e.target.checked;
    // Update the userData based on the checked state
    if (isChecked) {
      setUserData({ ...userData, resume_download: "" }); // Or any other value you prefer
      setIsResumeDownloadCheckboxChecked(true);
    } else {
      setUserData({ ...userData, resume_download: "empty" });
      setIsResumeDownloadCheckboxChecked(false);
    }
    setErrors({
      emp_checkbx: "",
    });
  };

  const handleResumeDownloadInputChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = parseFloat(inputValue);
    // if (numericValue <= 0) {
    //   setErrors({
    //     resume_download_input: "Please enter value geater than 0",
    //   });
    //   return;
    // } else {
    //   setErrors({
    //     resume_download_input: "",
    //   });
    // }

    if (!isResumeDownloadsUnlimitedChecked && numericValue > 0) {
      setResumeDownloadsInputValue(inputValue);
      setUserData({
        ...userData,
        resume_download: numericValue,
      });
      setErrors((prev) => ({
        ...prev,
        resume_download: "",
      }));
      console.log(userData);
    }
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
    console.log(userData);
    setErrors({
      emp_checkbx: "",
    });
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
    // setIsProfileViewCheckboxChecked(e.target.checked);
    // if (!e.target.checked) {
    //   setUserData({ ...userData, profile_view: "0" });
    // }
    // if (!isProfileViewsUnlimitedChecked) {
    //   setProfileViewsInputValue(e.target.value);
    // }
    // console.log(userData);

    const isChecked = e.target.checked;
    // Update the userData based on the checked state
    if (isChecked) {
      setUserData({ ...userData, profile_view: "" }); // Or any other value you prefer
      setIsProfileViewCheckboxChecked(true);
    } else {
      setUserData({ ...userData, profile_view: "empty" });
      setIsProfileViewCheckboxChecked(false);
    }
    setErrors({
      emp_checkbx: "",
    });
  };

  // Function to handle changes in the "Unlimited" checkbox for Profile Views
  const handleProfileViewsUnlimitedChange = (e) => {
    // setIsProfileViewsUnlimitedChecked(e.target.checked);

    // // If "Unlimited" is checked, clear the input value
    // if (e.target.checked) {
    //   setProfileViewsInputValue("");
    //   setUserData({ ...userData, profile_view: "1000000" });
    // }

    setIsProfileViewsUnlimitedChecked(e.target.checked);
    // if(userData.job_post === "50000") {
    //   setIsNumJobPostUnlimitedChecked(true);
    // }

    if (e.target.checked) {
      setProfileViewsInputValue(""); // Reset input value when "Unlimited" is checked
      setUserData({ ...userData, profile_view: "1000000" });
      setErrors({
        profile_view_input: "",
      });
    } else {
      setUserData({ ...userData, profile_view: "" });
      setIsProfileViewsUnlimitedChecked(false);
    }

    console.log(userData);
  };

  const handleProfileViewInputChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = parseFloat(inputValue);
    // if (numericValue <= 0) {
    //   setErrors({
    //     profile_view_input: "Please enter value geater than 0",
    //   });
    //   return;
    // } else {
    //   setErrors({
    //     profile_view_input: "",
    //   });
    // }

    if (!isProfileViewsUnlimitedChecked && numericValue > 0) {
      setProfileViewsInputValue(inputValue);
      setUserData({
        ...userData,
        profile_view: numericValue,
      });
      setErrors((prev) => ({
        ...prev,
        profile_view: "",
      }));
      console.log(userData);
    }
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
  const [jobApplyUnlimitedCheck, setJobApplyUnlimitedCheck] = useState(false);

  const handleNumJobApplyCheckBxChange = (event) => {
    const isChecked = event.target.checked;

    // Update the userData based on the checked state
    if (isChecked) {
      setUserData({ ...userData, job_apply: "" }); // Or any other value you prefer
      setIsNumJobApplyCheckboxChecked(true);
    } else {
      setUserData({ ...userData, job_apply: "empty" });
      setIsNumJobApplyCheckboxChecked(false);
      setIsNumJobApplyUnlimitedChecked(false);
    }
    setErrors((prev) => ({
      ...prev,
      job_apply_checkbx: "",
    }));
  };

  const handleJobseekerUnlimitedChange = (event) => {
    setIsNumJobApplyUnlimitedChecked(event.target.checked);
    // if(userData.job_post === "50000") {
    //   setIsNumJobPostUnlimitedChecked(true);
    // }

    if (event.target.checked) {
      setNumJobApplyInputValue(""); // Reset input value when "Unlimited" is checked
      setUserData({ ...userData, job_apply: "1000000" });
      setErrors((prev) => ({
        ...prev,
        job_apply_input: "",
      }));
      setIsNumJobApplyUnlimitedChecked(true);
    } else {
      setUserData({ ...userData, job_apply: "" });
      setIsNumJobApplyUnlimitedChecked(false);
    }
    setErrors((prev) => ({
      ...prev,
      job_apply_input: "",
    }));
  };

  const handleJobApplyInputChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = parseFloat(inputValue);
    // if (numericValue <= 0) {
    //   setErrors({
    //     job_post_input: "Please enter value geater than 0",
    //   });
    //   return;
    // } else {
    //   setErrors({
    //     job_apply_input: "",
    //   });
    // }

    if (!isNumJobApplyUnlimitedChecked && numericValue > 0) {
      setNumJobApplyInputValue(inputValue);
      setUserData({
        ...userData,
        job_apply: numericValue,
      });
      setErrors((prev) => ({
        ...prev,
        job_apply_input: "",
      }));
      console.log(userData);
    }
  };
  useEffect(() => {
    // Check if userData.job_apply is greater than 0

    // Job Apply(Jobseeker)
    if (userData.job_apply != "empty") {
      setIsNumJobApplyCheckboxChecked(true);
    } else {
      setIsNumJobApplyCheckboxChecked(false);
    }
    if (userData.job_apply === "1000000") {
      setIsNumJobApplyUnlimitedChecked(true);
    }

    // Job Post
    if (userData.job_post != "empty") {
      setIsNumJobPostCheckboxChecked(true);
    } else {
      setIsNumJobPostCheckboxChecked(false);
    }
    if (userData.job_post === "50000") {
      setIsNumJobPostUnlimitedChecked(true);
    }

    // Resume download
    if (userData.resume_download != "empty") {
      setIsResumeDownloadCheckboxChecked(true);
    } else {
      setIsResumeDownloadCheckboxChecked(false);
    }
    if (userData.resume_download === "1000000") {
      setIsResumeDownloadsUnlimitedChecked(true);
    }

    // Profile view
    if (userData.profile_view != "empty") {
      setIsProfileViewCheckboxChecked(true);
    } else {
      setIsProfileViewCheckboxChecked(false);
    }
    if (userData.profile_view === "1000000") {
      setIsProfileViewsUnlimitedChecked(true);
    }

    console.log(isNumJobApplyCheckboxChecked);
  }, [userData]);

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
                  <Typography color="text.primary">Edit Plan</Typography>
                </Breadcrumbs>
              </div>

              <h2 className="adminPageHeading">Edit Plan</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Plan Name<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className="form-control"
                      name="plan_name"
                      placeholder="Plan Name"
                      value={userData.plan_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Type<span className="RedStar">*</span>
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      name="type"
                      value={userData.type}
                      onChange={handleChange}
                    >
                      <option selected>Select Plan Type</option>
                      {Object.entries(planType).map(([key, value]) => {
                        return <option value={key}>{value}</option>;
                      })}
                    </select>
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      User Plan<span className="RedStar">*</span>
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      name="planuser"
                      value={userData.planuser}
                      onChange={handleChange}
                    >
                      <option selected>Select User Plan</option>
                      {Object.entries(typeofUser).map(([key, value]) => {
                        return <option value={key}>{value}</option>;
                      })}
                    </select>
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
                      className="form-control"
                      name="type_value"
                      placeholder="Time Period"
                      value={userData.type_value}
                      onChange={handleChange}
                    />
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Plan Amount<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className="form-control"
                      name="amount"
                      placeholder="Plan Amount"
                      value={userData.amount}
                      onChange={handleChange}
                    />
                  </div>

                  {/* ****************************** Code for Employer ************************ */}

                  {userData.planuser === "employer" && (
                    <>
                      {errors.emp_checkbx && (
                        <div className="text-danger mb-3">
                          {errors.emp_checkbx}
                        </div>
                      )}
                      <div className="mb-4 DashBoardInputBx checkBoxDiv">
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
                            name="job_post"
                            // value={userData.feature_ids}
                            checked={
                              userData.planuser === "employer" &&
                              // userData.job_post > 0
                              userData.job_post != "empty"
                            }
                            onChange={handleNumJobPostCheckBxChange}
                          />

                          <label>Number of Job Post</label>
                        </div>

                        <div className="NumberCheck">
                          <input
                            type="checkbox"
                            id="resumeDownloadsCheckbox"
                            className=""
                            name="resume_download"
                            // value={userData}
                            checked={
                              userData.planuser === "employer" &&
                              // userData.job_post > 0
                              userData.resume_download != "empty"
                            }
                            onChange={handleResumeDownloadsCheckBxChange}
                          />
                          <label>Number of resume download</label>
                        </div>
                      </div>
                      <div className="mb-4 DashBoardInputBx checkBoxDiv">
                        <div className="NumberCheck">
                          <input
                            type="checkbox"
                            id="jobPostCheckbox"
                            className=""
                            label="Number of Job Post"
                            // className="form-select"
                            // aria-label="Default select example"
                            name="candidate_search"
                            checked={
                              userData.planuser === "employer" &&
                              // userData.job_post > 0
                              userData.candidate_search != "empty"
                            }
                            // value={userData.candidate_search}
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
                            name="profile_view"
                            checked={
                              userData.planuser === "employer" &&
                              // userData.job_post > 0
                              userData.profile_view != "empty"
                            }
                            // value={userData.profile_view}
                            onChange={handleProfileViewsCheckBxChange}
                          />
                          <label>Number of Candidate Profile Views</label>
                        </div>
                      </div>
                    </>
                  )}
                  {userData.planuser === "employer" &&
                    (isNumJobPostCheckboxChecked ||
                      userData.job_post != "empty") && (
                      <>
                        <div className="mb-4 DashBoardInputBx">
                          <label htmlFor="jobApplyInput" className="form-label">
                            Number of Job Post:
                          </label>
                          <input
                            type="text"
                            id="jobPostInput"
                            className={`form-control ${
                              errors.job_post_input && "input-error"
                            }`}
                            name="job_post"
                            // value={userData.job_post}
                            value={
                              isNumJobPostUnlimitedChecked
                                ? ""
                                : userData.job_post
                            }
                            onChange={handleJobPostInputChange}
                            disabled={
                              isNumJobPostUnlimitedChecked ||
                              userData.job_post === "50000"
                            }
                          />

                          <div className="mb-4 DashBoardInputBx checkBoxDiv">
                            <input
                              type="checkbox"
                              id="unlimitedCheckbox"
                              className="unlimitedCheckbx"
                              name="job_post"
                              checked={
                                isNumJobPostUnlimitedChecked ||
                                userData.job_post === "50000"
                              }
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
                    (isResumeDownloadCheckboxChecked ||
                      userData.resume_download != "empty") && (
                      <>
                        <div className="mb-4 DashBoardInputBx">
                          <label
                            htmlFor="resumeDownloadsInput"
                            className="form-label"
                          >
                            Number of Resume Downloads:
                          </label>
                          <input
                            type="text"
                            id="jobPostInput"
                            className={`form-control ${
                              errors.resume_download && "input-error"
                            }`}
                            name="resume_download"
                            value={
                              isResumeDownloadsUnlimitedChecked
                                ? ""
                                : userData.resume_download
                            }
                            onChange={handleResumeDownloadInputChange}
                            disabled={
                              isResumeDownloadsUnlimitedChecked ||
                              userData.resume_download === "1000000"
                            }
                          />

                          <div className="mb-4 DashBoardInputBx checkBoxDiv">
                            <input
                              type="checkbox"
                              id="resumeDownloadsUnlimitedCheckbox"
                              className="unlimitedCheckbx"
                              name="resumeDownloadsUnlimited"
                              checked={
                                isResumeDownloadsUnlimitedChecked ||
                                userData.resume_download === "1000000"
                              }
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
                    (isProfileViewCheckboxChecked ||
                      userData.profile_view != "empty") && (
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
                            className={`form-control ${
                              errors.profile_view && "input-error"
                            }`}
                            name="profile_view"
                            value={
                              isProfileViewsUnlimitedChecked
                                ? ""
                                : userData.profile_view
                            }
                            onChange={handleProfileViewInputChange}
                            disabled={
                              isProfileViewsUnlimitedChecked ||
                              userData.profile_view === "1000000"
                            }
                          />

                          <div className="mb-2 DashBoardInputBx checkBoxDiv">
                            <input
                              type="checkbox"
                              id="profileViewsUnlimitedCheckbox"
                              className="unlimitedCheckbx"
                              name="profileViewsUnlimited"
                              checked={
                                isProfileViewsUnlimitedChecked ||
                                userData.profile_view === "1000000"
                              }
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
                          className="m-4"
                          label="Number of Job Post"
                          // className="form-select"
                          // aria-label="Default select example"
                          name="job_apply"
                          // value={userData.feature_ids}
                          checked={
                            userData.planuser === "jobseeker" &&
                            userData.job_apply != "empty"
                          }
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
                    (isNumJobApplyCheckboxChecked ||
                      userData.job_apply != "empty") && (
                      <div className="mb-4 DashBoardInputBx">
                        <label htmlFor="jobApplyInput" className="form-label">
                          Number of Job Apply:
                        </label>
                        <input
                          type="text"
                          id="jobPostInput"
                          className={`form-control ${
                            errors.job_apply_input && "input-error"
                          }`}
                          name="job_apply"
                          value={
                            isNumJobApplyUnlimitedChecked
                              ? ""
                              : userData.job_apply
                          }
                          onChange={handleJobApplyInputChange}
                          disabled={
                            isNumJobApplyUnlimitedChecked ||
                            userData.job_apply === "1000000"
                          }
                        />

                        <div className="mb-5 DashBoardInputBx checkBoxDiv">
                          <input
                            type="checkbox"
                            id="unlimitedCheckbox"
                            className="unlimitedCheckbx"
                            name="job_apply"
                            checked={
                              jobApplyUnlimitedCheck ||
                              userData.job_apply === "1000000"
                            }
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
                  // onClick={() => handleReset()}
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
