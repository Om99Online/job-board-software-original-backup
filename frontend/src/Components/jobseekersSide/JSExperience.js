import React, { useEffect, useState } from "react";
import Footer from "../element/Footer";
import JSSidebar from "./JSSidebar";
import NavBar from "../element/NavBar";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const JSExperience = () => {
  const [loading, setLoading] = useState(false);
  const [experience, setExperience] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [yearsList, setYearsList] = useState([]);

  const tokenKey = Cookies.get("tokenClient");
  const [t, i18n] = useTranslation("global");
  const currentLanguage = Cookies.get("selectedLanguage") || "en";

  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");

  const [hoverFirstButtonColor, setHoverFirstButtonColor] = useState(false);

  const handleFirstButtonMouseEnter = () => {
    setHoverFirstButtonColor(true);
  };

  const handleFirstButtonMouseLeave = () => {
    setHoverFirstButtonColor(false);
  };

  const [hoverSecondButtonColor, setHoverSecondButtonColor] = useState(false);

  const handleSecondButtonMouseEnter = () => {
    setHoverSecondButtonColor(true);
  };

  const handleSecondButtonMouseLeave = () => {
    setHoverSecondButtonColor(false);
  };

  const [hoverThirdButtonColor, setHoverThirdButtonColor] = useState(false);

  const handleThirdButtonMouseEnter = () => {
    setHoverThirdButtonColor(true);
  };

  const handleThirdButtonMouseLeave = () => {
    setHoverThirdButtonColor(false);
  };

  const [hoverFourthButtonColor, setHoverFourthButtonColor] = useState(false);

  const handleFourthButtonMouseEnter = () => {
    setHoverFourthButtonColor(true);
  };

  const handleFourthButtonMouseLeave = () => {
    setHoverFourthButtonColor(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    // Check if tokenKey is not present
    if (!tokenKey) {
      // Redirect to the home page
      navigate("/user/jobseekerlogin");
    } else {
      // TokenKey is present, fetch data or perform other actions
      getData();
      window.scrollTo(0, 0);
    }
  }, [tokenKey, navigate]);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/candidates/editExperience",
        null, // Pass null as the request body if not required
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
        setExperience(response.data.response.expDetails);
        setYearsList(response.data.response.yearList);

        // console.log(experience);
      } else if (response.data.status === 400) {
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: t("jobseekerExperience.close"),
        });
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: t("jobseekerExperience.close"),
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
      console.log(error.message);
    }
  };

  const validateFields = () => {
    const errors = experience.map((exp, index) => ({
      industry: exp.industry.trim() === "",
      role: exp.role.trim() === "",
      // functional_area: exp.functional_area.trim() === "",
      designation: exp.designation.trim() === "",
      company_name: exp.company_name.trim() === "",
      from_month: exp.from_month === "",
      from_year: exp.from_year === "",
      to_month: exp.to_month === "",
      to_year: exp.to_year === "",

      // Add more validation checks for other required fields
    }));

    setValidationErrors(errors);
    return errors.every(
      (error) =>
        !error.industry &&
        !error.role &&
        !error.designation &&
        !error.company_name &&
        !error.from_month &&
        !error.from_year &&
        !error.to_month &&
        !error.to_year
    );
  };

  // const handleChange = (e, index) => {
  //   const { name, value } = e.target;
  //   setExperience((prevExperience) => {
  //     const updatedDetails = [...prevExperience]; // Create a shallow copy of the array
  //     updatedDetails[index] = {
  //       ...updatedDetails[index], // Create a shallow copy of the specific education detail
  //       [name]: value, // Update the specific field with the new value
  //     };
  //     return updatedDetails; // Return the updated array
  //   });
  // };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setExperience((prevExperience) => {
      const updatedDetails = [...prevExperience];
      updatedDetails[index] = {
        ...updatedDetails[index],
        [name]: value,
      };

      // Update validation errors dynamically
      const errors = updatedDetails.map((exp, i) => ({
        industry:
          i === index
            ? exp.industry.trim() === ""
            : validationErrors[i]?.industry,
        role: i === index ? exp.role.trim() === "" : validationErrors[i]?.role,
        designation:
          i === index
            ? exp.designation.trim() === ""
            : validationErrors[i]?.designation,
        company_name:
          i === index
            ? exp.company_name.trim() === ""
            : validationErrors[i]?.company_name,
        from_month:
          i === index ? exp.from_month === "" : validationErrors[i]?.from_month,
        from_year:
          i === index ? exp.from_year === "" : validationErrors[i]?.from_year,
        to_month:
          i === index ? exp.to_month === "" : validationErrors[i]?.to_month,
        to_year:
          i === index ? exp.to_year === "" : validationErrors[i]?.to_year,
      }));

      setValidationErrors(errors);
      return updatedDetails;
    });
  };

  const formattedYearList = yearsList.map((year, index) => ({
    id: index,
    value: year,
  }));

  const handleClick = async () => {
    if (!validateFields()) {
      window.scrollTo(0, 0);
      return;
    }
    try {
      const confirmationResult = await Swal.fire({
        title: t("jobseekerExperience.experienceConfirmTitle"),
        text: t("jobseekerExperience.experienceConfirmTxt"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("jobseekerExperience.yes"),
        cancelButtonText: t("jobseekerExperience.no"),
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseApi + "/candidates/editExperience",
          { Experience: experience, language: currentLanguage }, // Pass null as the request body if not required
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
            title: t("jobseekerExperience.experienceSuccessTitle"),
            text: t("jobseekerExperience.experienceSuccessTxt"),
            icon: "success",
            confirmButtonText: t("jobseekerExperience.close"),
          });
          // window.location.reload();
          setExperience([]);
          getData();
        } else if (response.data.status === 400) {
          Cookies.remove("tokenClient");
          Cookies.remove("user_type");
          Cookies.remove("fname");
          navigate("/");
          Swal.fire({
            title: response.data.message,
            icon: "warning",
            confirmButtonText: t("jobseekerExperience.close"),
          });
        } else if (response.data.status === 500) {
          Swal.fire({
            title: response.data.mesasge,
            icon: "warning",
            confirmButtonText: t("jobseekerExperience.close"),
          });
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: t("jobseekerExperience.close"),
          });
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
        title: t("jobseekerExperience.experienceFailedTitle"),
        text: t("jobseekerExperience.experienceFailedTxt"),
        icon: "error",
        confirmButtonText: t("jobseekerExperience.close"),
      });
    }
  };

  const handleAdd = () => {
    const newExperience = {
      industry: "", // Set default values for the new block
      company_name: "",
      role: "",
      designation: "",
      from_month: "",
      to_month: "",
      from_year: "",
      to_year: "",
      job_profile: "",
    };

    setExperience((prevExperience) => [...prevExperience, newExperience]);
  };

  const handleRemove = async (id) => {
    try {
      const confirmationResult = await Swal.fire({
        title: t("jobseekerExperience.removeConfirmTitle"),
        text: t("jobseekerExperience.removeConfirmTxt"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("jobseekerExperience.yes"),
        cancelButtonText: t("jobseekerExperience.no"),
      });
      if (id !== null && confirmationResult.isConfirmed) {
        const response = await axios.post(
          BaseApi + `/candidates/deleteexperience/${id}`,
          null,
          {
            headers: {
              "Content-Type": "application/json",
              key: ApiKey,
              token: tokenKey,
            },
          }
        );
        if (response.data.status === 200) {
          getData();
          Swal.fire({
            title: t("jobseekerExperience.removeSuccessTitle"),
            icon: "success",
            confirmButtonText: t("jobseekerExperience.close"),
          });
          window.scrollTo(0, 0);
        } else if (response.data.status === 400) {
          Cookies.remove("tokenClient");
          Cookies.remove("user_type");
          Cookies.remove("fname");
          navigate("/");
          Swal.fire({
            title: response.data.message,
            icon: "warning",
            confirmButtonText: t("jobseekerExperience.close"),
          });
        } else if (response.data.status === 500) {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: t("jobseekerExperience.close"),
          });
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: t("jobseekerExperience.close"),
          });
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
        title: t("jobseekerExperience.removeFailedTitle"),
        text: t("jobseekerExperience.removeFailedTxt"),
        icon: "error",
        confirmButtonText: t("jobseekerExperience.close"),
      });
    }
  };
  const handleRemoveWithoutId = (indexToRemove) => {
    setExperience((prevExperience) =>
      prevExperience.filter((_, index) => index !== indexToRemove)
    );
    window.scrollTo(0, 0);
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
                <JSSidebar />
              </div>

              <div
                className="col-lg-9 mb-5"
                style={{
                  borderLeft: "2px solid #e6e8e7",
                  borderRight: "2px solid #e6e8e7",
                }}
              >
                <div className="mx-3 d-flex PageHeader">
                  <img
                    className="pb-2"
                    src="/Images/jobseekerSide/Experience-Color.png"
                    alt=""
                  />
                  <h3 className="ms-1 pt-1" style={{ color: "#f46484" }}>
                    {t("jobseekerExperience.experienceInfo")}
                  </h3>
                </div>
                <form>
                  <div className="mt-4 mx-4">
                    {experience.map((i, index) => {
                      return (
                        <>
                          <h4 className="mt-4 mb-5">
                            {t("jobseekerExperience.experience")} {index + 1}
                          </h4>
                          <div className="form-outline mb-4 DashBoardInputBx">
                            <label
                              className="form-label"
                              htmlFor="form3Example3"
                            >
                              {t("jobseekerExperience.industry")}
                              <span className="RedStar">*</span>
                            </label>
                            <input
                              type="text"
                              id="form3Example3"
                              className="form-control"
                              placeholder={t("jobseekerExperience.industry")}
                              name="industry"
                              value={i.industry}
                              onChange={(e) => handleChange(e, index)}
                            />
                            <div className="mt-0">
                              {validationErrors[index]?.industry && (
                                <small className="text-danger">
                                  {t("jobseekerExperience.industryRequired")}
                                </small>
                              )}
                            </div>
                            <div id="emailHelp" className="form-text">
                              {t("jobseekerExperience.belowTxt1")}
                            </div>
                          </div>
                          <div className="form-outline mb-4 DashBoardInputBx">
                            <label
                              className="form-label"
                              htmlFor="form3Example3"
                            >
                              {t("jobseekerExperience.functionalArea")}
                            </label>
                            <input
                              type="text"
                              id="form3Example3"
                              className="form-control"
                              placeholder={t(
                                "jobseekerExperience.functionalArea"
                              )}
                              name="functional_area"
                              value={i.functional_area}
                              onChange={(e) => handleChange(e, index)}
                            />
                            {/* <div className="mt-2">
                              {validationErrors[index]?.functional_area && (
                                <small className="text-danger">
                                  Functional Area is required.
                                </small>
                              )}
                            </div> */}
                            <div id="emailHelp" className="form-text">
                              {t("jobseekerExperience.belowTxt1")}
                            </div>
                          </div>
                          <div className="form-outline mb-4 DashBoardInputBx">
                            <label
                              className="form-label"
                              htmlFor="form3Example3"
                            >
                              {t("jobseekerExperience.role")}
                              <span className="RedStar">*</span>
                            </label>
                            <input
                              type="text"
                              id="form3Example3"
                              className="form-control"
                              placeholder={t("jobseekerExperience.role")}
                              name="role"
                              value={i.role}
                              onChange={(e) => handleChange(e, index)}
                            />
                            <div className="mt-0">
                              {validationErrors[index]?.role && (
                                <small className="text-danger">
                                  {t("jobseekerExperience.roleRequired")}
                                </small>
                              )}{" "}
                            </div>
                          </div>
                          <div className="form-outline mb-4 DashBoardInputBx">
                            <label
                              className="form-label"
                              htmlFor="form3Example3"
                            >
                              {t("jobseekerExperience.companyName")}
                              <span className="RedStar">*</span>
                            </label>
                            <input
                              type="text"
                              id="form3Example3"
                              className="form-control"
                              placeholder={t("jobseekerExperience.companyName")}
                              name="company_name"
                              value={i.company_name}
                              onChange={(e) => handleChange(e, index)}
                            />
                            <div className="mt-0">
                              {validationErrors[index]?.company_name && (
                                <small className="text-danger">
                                  {t("jobseekerExperience.companyNameRequired")}
                                </small>
                              )}
                            </div>
                          </div>
                          <div className="form-outline mb-4 DashBoardInputBx">
                            <label
                              className="form-label"
                              htmlFor="form3Example3"
                            >
                              {t("jobseekerExperience.workingRelation")}
                              <span className="RedStar">*</span>
                            </label>
                            <input
                              type="text"
                              id="form3Example3"
                              className="form-control"
                              placeholder={t(
                                "jobseekerExperience.workingRelation"
                              )}
                              name="designation"
                              value={i.designation}
                              onChange={(e) => handleChange(e, index)}
                            />
                            <div className="mt-0">
                              {validationErrors[index]?.designation && (
                                <small className="text-danger">
                                  {t(
                                    "jobseekerExperience.workingRelationRequired"
                                  )}
                                </small>
                              )}
                            </div>
                          </div>
                          <p className="mb-4">
                            {t("jobseekerExperience.duration")}
                          </p>
                          <div className="row mb-2">
                            <div className="col">
                              <div className="form-outline mb-4 DashBoardInputBx">
                                <label
                                  className="form-label"
                                  htmlFor="form3Example3"
                                >
                                  {t("jobseekerExperience.startMonth")}
                                  <span className="RedStar">*</span>
                                </label>
                                <select
                                  class="form-select"
                                  aria-label="Default select example"
                                  value={i.from_month}
                                  name="from_month"
                                  onChange={(e) => handleChange(e, index)}
                                >
                                  <option selected value="">
                                    {t("jobseekerExperience.selectMonth")}
                                  </option>
                                  <option value="1">January</option>
                                  <option value="2">February</option>
                                  <option value="3">March</option>
                                  <option value="4">April</option>
                                  <option value="5">May</option>
                                  <option value="6">June</option>
                                  <option value="7">July</option>
                                  <option value="8">August</option>
                                  <option value="9">September</option>
                                  <option value="10">October</option>
                                  <option value="11">November</option>
                                  <option value="12">December</option>
                                </select>
                                <div className="mt-0">
                                  {validationErrors[index]?.from_month && (
                                    <small className="text-danger">
                                      {t(
                                        "jobseekerExperience.startMonthRequired"
                                      )}
                                    </small>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-outline mb-4 DashBoardInputBx">
                                <label
                                  className="form-label"
                                  htmlFor="form3Example3"
                                >
                                  {t("jobseekerExperience.startYear")}
                                  <span className="RedStar">*</span>
                                </label>
                                <select
                                  class="form-select"
                                  aria-label="Default select example"
                                  value={i.from_year}
                                  name="from_year"
                                  onChange={(e) => handleChange(e, index)}
                                >
                                  <option selected value="">
                                    {t("jobseekerExperience.selectYear")}
                                  </option>
                                  {Object.entries(yearsList).map(
                                    ([index, value]) => {
                                      return (
                                        <option value={value}>{value}</option>
                                      );
                                    }
                                  )}
                                  {/* <option value="2023">2023</option>
                                  <option value="2022">2022</option>
                                  <option value="2021">2021</option>
                                  <option value="2020">2020</option>
                                  <option value="2019">2019</option>
                                  <option value="2018">2018</option>
                                  <option value="2017">2017</option>
                                  <option value="2016">2016</option>
                                  <option value="2015">2015</option>
                                  <option value="2014">2014</option>
                                  <option value="2013">2013</option>
                                  <option value="2012">2012</option> */}
                                </select>
                                <div className="mt-0">
                                  {validationErrors[index]?.from_year && (
                                    <small className="text-danger">
                                      {t(
                                        "jobseekerExperience.startYearRequired"
                                      )}
                                    </small>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="mb-4 text-center pe-4">
                            {t("jobseekerExperience.to")}
                          </p>
                          <div className="row mb-4">
                            <div className="col">
                              <div className="form-outline mb-4 DashBoardInputBx">
                                <label
                                  className="form-label"
                                  htmlFor="form3Example3"
                                >
                                  {t("jobseekerExperience.endMonth")}
                                  <span className="RedStar">*</span>
                                </label>
                                <select
                                  class="form-select"
                                  aria-label="Default select example"
                                  value={i.to_month}
                                  name="to_month"
                                  onChange={(e) => handleChange(e, index)}
                                >
                                  <option selected value="">
                                    {t("jobseekerExperience.selectMonth")}
                                  </option>
                                  <option value="1">January</option>
                                  <option value="2">February</option>
                                  <option value="3">March</option>
                                  <option value="4">April</option>
                                  <option value="5">May</option>
                                  <option value="6">June</option>
                                  <option value="7">July</option>
                                  <option value="8">August</option>
                                  <option value="9">September</option>
                                  <option value="10">October</option>
                                  <option value="11">November</option>
                                  <option value="12">December</option>
                                </select>
                                <div className="mt-0">
                                  {validationErrors[index]?.to_month && (
                                    <small className="text-danger">
                                      {t(
                                        "jobseekerExperience.endMonthRequired"
                                      )}
                                    </small>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-outline mb-4 DashBoardInputBx">
                                <label
                                  className="form-label"
                                  htmlFor="form3Example3"
                                >
                                  {t("jobseekerExperience.endYear")}
                                  <span className="RedStar">*</span>
                                </label>
                                <select
                                  class="form-select"
                                  aria-label="Default select example"
                                  value={i.to_year}
                                  name="to_year"
                                  onChange={(e) => handleChange(e, index)}
                                >
                                  <option selected value="">
                                    {t("jobseekerExperience.selectYear")}
                                  </option>
                                  {Object.entries(yearsList).map(
                                    ([index, value]) => {
                                      return (
                                        <option value={value}>{value}</option>
                                      );
                                    }
                                  )}
                                  {/* <option value="2023">2023</option>
                                  <option value="2022">2022</option>
                                  <option value="2021">2021</option>
                                  <option value="2020">2020</option>
                                  <option value="2019">2019</option>
                                  <option value="2018">2018</option>
                                  <option value="2017">2017</option>
                                  <option value="2016">2016</option>
                                  <option value="2015">2015</option>
                                  <option value="2014">2014</option>
                                  <option value="2013">2013</option>
                                  <option value="2012">2012</option> */}
                                </select>
                                <div className="mt-0">
                                  {validationErrors[index]?.to_year && (
                                    <small className="text-danger">
                                      {t("jobseekerExperience.endYearRequired")}
                                    </small>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="form-outline mb-4 DashBoardInputBx">
                            <label
                              className="form-label"
                              htmlFor="form3Example3"
                            >
                              {t("jobseekerExperience.jobProfile")}
                            </label>
                            <input
                              type="text"
                              id="form3Example3"
                              className="form-control"
                              placeholder={t("jobseekerExperience.jobProfile")}
                              name="job_profile"
                              value={i.job_profile}
                              onChange={(e) => handleChange(e, index)}
                            />
                            <div className="removeButtonJobseeker mt-4">
                              {i.id ? (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-primary button2"
                                    onClick={() => handleRemove(i.id)}
                                    style={{
                                      color: hoverFourthButtonColor
                                        ? primaryColor
                                        : secondaryColor,
                                      backgroundColor: "white",
                                      border: hoverFourthButtonColor
                                        ? `2px solid ${primaryColor}`
                                        : `2px solid ${secondaryColor}`,
                                    }}
                                  >
                                    {t("jobseekerExperience.removeButton")}
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-primary button2"
                                    onClick={() => handleRemoveWithoutId(index)}
                                    style={{
                                      color: hoverFourthButtonColor
                                        ? primaryColor
                                        : secondaryColor,
                                      backgroundColor: "white",
                                      border: hoverFourthButtonColor
                                        ? `2px solid ${primaryColor}`
                                        : `2px solid ${secondaryColor}`,
                                    }}
                                  >
                                    {t("jobseekerExperience.removeButton")}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      );
                    })}
                    {experience.length <= 0 && (
                      <>
                        <div className="noData">
                          {t("jobseekerEducation.noInfoAvl")}
                        </div>
                      </>
                    )}
                    {experience.length > 0 && (
                      <div className="removeButtonJobseeker mb-4 mt-3 PRAddMore">
                        <button
                          type="button"
                          className="btn btn-primary button1"
                          onClick={handleAdd}
                          style={{
                            backgroundColor: primaryColor,
                            color: "white",
                            border: primaryColor,
                          }}
                        >
                          {t("jobseekerExperience.addMoreButton")}
                        </button>
                      </div>
                    )}
                    {experience.length <= 0 && (
                      <div className="mb-4 mt-3 PRAddMore jobseekerAddDetailsButton">
                        <button
                          type="button"
                          className="btn btn-primary button1"
                          onClick={handleAdd}
                          style={{
                            backgroundColor: primaryColor,
                            color: "white",
                            border: primaryColor,
                          }}
                        >
                          {t("jobseekerExperience.addDetails")}
                        </button>
                      </div>
                    )}
                    {experience.length > 0 && (
                      <>
                        <div className="bottomButtonsExperience">
                          <button
                            type="button"
                            className="btn btn-primary button1"
                            onClick={handleClick}
                            style={{
                              backgroundColor: hoverFirstButtonColor
                                ? secondaryColor
                                : primaryColor,
                              border: hoverFirstButtonColor
                                ? secondaryColor
                                : primaryColor,
                            }}
                            onMouseEnter={handleFirstButtonMouseEnter}
                            onMouseLeave={handleFirstButtonMouseLeave}
                          >
                            {t("jobseekerExperience.updateButton")}
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary button2"
                            style={{
                              color: hoverThirdButtonColor
                                ? primaryColor
                                : secondaryColor,
                              backgroundColor: "white",
                              border: hoverThirdButtonColor
                                ? `2px solid ${primaryColor}`
                                : `2px solid ${secondaryColor}`,
                            }}
                            onMouseEnter={handleThirdButtonMouseEnter}
                            onMouseLeave={handleThirdButtonMouseLeave}
                            onClick={() => navigate("/candidates/myaccount")}
                          >
                            {t("jobseekerExperience.cancelButton")}
                          </button>
                        </div>
                      </>
                    )}
                    {/* <div className="mb-4 jobseekerAddMore">
                      <button
                        type="button"
                        className="btn btn-primary me-3 button1"
                        onClick={handleAdd}
                        style={{
                          backgroundColor: primaryColor,
                          color: "white",
                          border: primaryColor,
                        }}
                      >
                        {t("jobseekerExperience.addMoreButton")}
                      </button>
                    </div>
                    <div className="bottomButtonsExperience">
                      <button
                        type="button"
                        className="btn btn-primary button1"
                        onClick={handleClick}
                        style={{
                          backgroundColor: hoverFirstButtonColor
                            ? secondaryColor
                            : primaryColor,
                          border: hoverFirstButtonColor
                            ? secondaryColor
                            : primaryColor,
                        }}
                        onMouseEnter={handleFirstButtonMouseEnter}
                        onMouseLeave={handleFirstButtonMouseLeave}
                      >
                        {t("jobseekerExperience.updateButton")}
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary button2"
                        style={{
                          color: hoverThirdButtonColor
                            ? primaryColor
                            : secondaryColor,
                          backgroundColor: "white",
                          border: hoverThirdButtonColor
                            ? `2px solid ${primaryColor}`
                            : `2px solid ${secondaryColor}`,
                        }}
                        onMouseEnter={handleThirdButtonMouseEnter}
                        onMouseLeave={handleThirdButtonMouseLeave}
                      >
                        {t("jobseekerExperience.cancelButton")}
                      </button>
                    </div> */}
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

export default JSExperience;
