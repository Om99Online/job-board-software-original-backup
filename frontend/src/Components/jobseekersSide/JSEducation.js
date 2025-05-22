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
import Select from "react-select";

const JSEducation = () => {
  const [loading, setLoading] = useState(false);
  const [basicCourseList, setBasicCourseList] = useState([]);
  const [educationDetails, setEducationDetails] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [specializationList, setSpecializationList] = useState([]);
  const [yearsList, setYearsList] = useState([]);
  const tokenKey = Cookies.get("tokenClient");
  const [t, i18n] = useTranslation("global");

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
      // if(educationDetails.basic_course_id) {
      // getSpecializationList(educationDetails.basic_course_id);
      // }
    }
  }, [tokenKey, navigate]);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/candidates/editEducation",
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
        setBasicCourseList(response.data.response.basicCourseList);
        setEducationDetails(response.data.response.eduDetails);
        setYearsList(response.data.response.yearList);
        setSpecializationList2(response.data.response.specializationList);
        // Fetch specialization data for each saved course
        // response.data.response.eduDetails.forEach((edu) => {
        //   if (edu.basic_course_id) {
        //     getSpecializationList(edu.basic_course_id);
        //   }
        // });
        // console.log(educationDetails);
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: t("jobseekerEducation.close"),
        });
      }
    } catch (error) {
      console.log("token check from catch");
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

  const formattedYearList = yearsList.map((year, index) => ({
    id: index,
    value: year,
  }));

  const handleChange = (e, index, mainID) => {
    const { name, value } = e.target;
    setEducationDetails((prevEducationDetails) => {
      const updatedDetails = [...prevEducationDetails]; // Create a shallow copy of the array
      updatedDetails[index] = {
        ...updatedDetails[index], // Create a shallow copy of the specific education detail
        [name]: value, // Update the specific field with the new value
      };
      return updatedDetails; // Return the updated array
    });

    // console.log(specializationList2, "check");
    if (name === "basic_course_id") {
      getSpecializationList(value, index);
    }
    // getSpecializationList(value, index);
  };

  const [specializationList2, setSpecializationList2] = useState({});

  const getSpecializationList = async (id, index) => {
    // console.log(index, "Got index in start of specilization function");
    try {
      const response = await axios.post(
        BaseApi + `/course/getSpecialization/${id}`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            token: tokenKey,
          },
        }
      );
      // check here to fix
      setSpecializationList(response.data.response);
      // Create a copy of the existing specializationList2 state
      const updatedSpecializationList2 = { ...specializationList2 };
      // Update the copy with the new data for the specific index
      updatedSpecializationList2[index] = response.data.response;
      // Set the updated state
      setSpecializationList2(updatedSpecializationList2);
      // setSpecializationList2({...specializationList2,[0] : response.data.response})
      // setSpecializationList2({...specializationList2,mainID: response.data.response});
      // console.log(specializationList2,"new specialization list");
    } catch (error) {
      console.log("Couldn't get specialization");
    }
  };

  const handleYearChange = (selectedOption, name, index) => {
    setEducationDetails((prevEducationDetails) => {
      const updatedDetails = [...prevEducationDetails];
      updatedDetails[index] = {
        ...updatedDetails[index],
        [name]: selectedOption?.value || "", // Update the selected value
      };
      return updatedDetails;
    });
  };

  const validateFields = () => {
    const errors = educationDetails.map((edu, index) => ({
      basic_course_id: edu.basic_course_id === "",
      basic_university: edu.basic_university.trim() === "",
      basic_year: edu.basic_year === "",
      // graduation_title: edu.graduation_title.trim() === "",
      // graduation_title: edu.specialization_id.trim() === "",
    }));

    setValidationErrors(errors);
    return errors.every(
      (error) =>
        !error.basic_course_id && !error.basic_university && !error.basic_year
      // !error.graduation_title
    );
  };
  const handleClick = async () => {
    if (!validateFields()) {
      window.scrollTo(0, 0);
      return;
    }
    try {
      const confirmationResult = await Swal.fire({
        title: t("jobseekerEducation.educationConfirmTitle"),
        text: t("jobseekerEducation.educationConfirmTxt"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("jobseekerEducation.yes"),
        cancelButtonText: t("jobseekerEducation.no"),
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseApi + "/candidates/editEducation",
          { Education: educationDetails }, // Pass null as the request body if not required
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
            title: t("jobseekerEducation.educationSuccessTitle"),
            text: t("jobseekerEducation.educationSuccessTxt"),
            icon: "success",
            confirmButtonText: t("jobseekerEducation.close"),
          });
          setEducationDetails([]);
          // window.location.reload();
          getData();
        } else if (response.data.status === 400) {
          Cookies.remove("tokenClient");
          Cookies.remove("user_type");
          Cookies.remove("fname");
          navigate("/");
          Swal.fire({
            title: response.data.message,
            icon: "warning",
            confirmButtonText: t("jobseekerEducation.close"),
          });
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: t("jobseekerEducation.close"),
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
        title: t("jobseekerEducation.educationFailedTitle"),
        text: t("jobseekerEducation.educationFailedTxt"),
        icon: "error",
        confirmButtonText: t("jobseekerEducation.close"),
      });
    }
  };
  useEffect(() => {
    if (educationDetails.length > 0) {
      const savedCourseIds = educationDetails.map((edu) => edu.basic_course_id);
      // Fetch specialization for each saved course
      // savedCourseIds.forEach((courseId) => {
      //   getSpecializationList(courseId);
      // });
    }
  }, [educationDetails]);

  const handleRemove = async (id) => {
    try {
      const confirmationResult = await Swal.fire({
        title: t("jobseekerEducation.removeConfirmTitle"),
        text: t("jobseekerEducation.removeConfirmTxt"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("jobseekerEducation.yes"),
        cancelButtonText: t("jobseekerEducation.no"),
      });
      if (confirmationResult.isConfirmed) {
        const response = await axios.post(
          BaseApi + `/candidates/deleteeducation/${id}`,
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
            title: t("jobseekerEducation.removeSuccessTitle"),
            icon: "success",
            confirmButtonText: t("jobseekerEducation.close"),
          });
        } else if (response.data.status === 400) {
          Cookies.remove("tokenClient");
          Cookies.remove("user_type");
          Cookies.remove("fname");
          navigate("/");
          Swal.fire({
            title: response.data.message,
            icon: "warning",
            confirmButtonText: t("jobseekerEducation.close"),
          });
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: t("jobseekerEducation.close"),
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
        title: t("jobseekerEducation.removeFailedTitle"),
        text: t("jobseekerEducation.removeFailedTxt"),
        icon: "error",
        confirmButtonText: t("jobseekerEducation.close"),
      });
    }
  };
  const handleRemoveWithoutId = (indexToRemove) => {
    setEducationDetails((prevEducationDetails) =>
      prevEducationDetails.filter((_, index) => index !== indexToRemove)
    );
  };
  const handleAdd = () => {
    const newQualification = {
      basic_course_id: "", // Set default values for the new block
      basic_university: "",
      basic_year: "",
      // graduation_title: "",
      specialization_id: "", // Include specialization_id in the new education detail
    };

    setEducationDetails((prevEducationDetails) => [
      ...prevEducationDetails,
      newQualification,
    ]);
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
                  <img src="/Images/jobseekerSide/Education-color.png" alt="" />
                  <h3 className="ms-1" style={{ color: "#549cb4" }}>
                    {t("jobseekerEducation.educationInfo")}
                  </h3>
                </div>
                <form>
                  <div className=" mt-4 mx-4">
                    {educationDetails.map((j, index) => {
                      return (
                        <>
                          <h4 className="mt-5 mb-5">
                            {t("jobseekerEducation.qualification")} {index + 1}:
                          </h4>
                          {/* <div className="form-outline mb-4 DashBoardInputBx">
                            <label
                              className="form-label"
                              htmlFor="form3Example3"
                            >
                              {t("jobseekerEducation.graduationTitle")}
                              <span className="RedStar">*</span>
                            </label>
                            <input
                              type="text"
                              id="form3Example3"
                              className="form-control"
                              placeholder={t(
                                "jobseekerEducation.graduationTitle"
                              )}
                              name="graduation_title"
                              value={j.graduation_title}
                              onChange={(e) => handleChange(e, index)}
                            />
                            <div className="mt-0">
                              {validationErrors[index]?.graduation_title && (
                                <small className="text-danger">
                                  {t(
                                    "jobseekerEducation.graduationTitleRequired"
                                  )}
                                </small>
                              )}
                            </div>
                          </div> */}
                          <div className="form-outline mb-4 DashBoardInputBx">
                            <label
                              className="form-label"
                              htmlFor="form3Example3"
                            >
                              {t("jobseekerEducation.courseName")}
                              <span className="RedStar">*</span>
                            </label>
                            <select
                              class="form-select"
                              aria-label="Default select example"
                              value={j.basic_course_id}
                              name="basic_course_id"
                              onChange={(e) => handleChange(e, index, j.id)}
                            >
                              <option selected value="">
                                {t("jobseekerEducation.selectCourse")}
                              </option>
                              {basicCourseList.map((i) => {
                                return <option value={i.id}>{i.name}</option>;
                              })}
                            </select>
                            <div className="mt-0">
                              {validationErrors[index]?.basic_course_id && (
                                <small className="text-danger">
                                  {t("jobseekerEducation.courseNameRequired")}
                                </small>
                              )}
                            </div>
                          </div>
                          <div className="form-outline mb-4 DashBoardInputBx">
                            <label
                              className="form-label"
                              htmlFor="form3Example3"
                            >
                              {t("jobseekerEducation.specialization")}
                            </label>
                            <select
                              className="form-select"
                              aria-label="Default select example"
                              value={j.specialization_id || ""}
                              name="specialization_id"
                              onChange={(e) => handleChange(e, index, j.id)}
                            >
                              <option value="">
                                {t("jobseekerEducation.selectSpecialization")}
                              </option>
                              {specializationList2[index]?.map((i) => (
                                <option key={i.id} value={i.id}>
                                  {i.name}
                                </option>
                              ))}
                            </select>
                            <div className="mt-0">
                              {validationErrors[index]?.basic_course_id && (
                                <small className="text-danger">
                                  {t("jobseekerEducation.courseNameRequired")}
                                </small>
                              )}
                            </div>
                          </div>

                          <div className="form-outline mb-4 DashBoardInputBx">
                            <label
                              className="form-label"
                              htmlFor="form3Example3"
                            >
                              {t("jobseekerEducation.university/institute")}
                              <span className="RedStar">*</span>
                            </label>
                            <input
                              type="text"
                              id="form3Example3"
                              className="form-control"
                              placeholder={t(
                                "jobseekerEducation.university/institute"
                              )}
                              name="basic_university"
                              value={j.basic_university}
                              onChange={(e) => handleChange(e, index)}
                            />
                            <div className="mt-0">
                              {validationErrors[index]?.basic_university && (
                                <small className="text-danger">
                                  {t("jobseekerEducation.universityRequired")}
                                </small>
                              )}
                            </div>
                          </div>

                          <div className="form-outline mb-4 DashBoardInputBx">
                            <label
                              className="form-label"
                              htmlFor="form3Example3"
                            >
                              {t("jobseekerEducation.passedIn")}
                              <span className="RedStar">*</span>
                            </label>
                            <Select
                              options={formattedYearList.map((year) => ({
                                value: year.value,
                                label: year.value,
                              }))}
                              value={{
                                value: j.basic_year,
                                label: j.basic_year
                                  ? j.basic_year
                                  : "Select Year",
                              }}
                              onChange={(selectedOption) =>
                                handleYearChange(
                                  selectedOption,
                                  "basic_year",
                                  index
                                )
                              }
                            />

                            {/* <select
                              class="form-select"
                              aria-label="Default select example"
                              value={j.basic_year}
                              name="basic_year"
                              onChange={(e) => handleChange(e, index)}
                            >
                              <option selected value="">
                                {t("jobseekerEducation.selectYear")}
                              </option>
                              <option value="2023">2023</option>
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
                              <option value="2012">2012</option>
                              <option value="2011">2011</option>
                              <option value="2010">2010</option>
                              <option value="2009">2009</option>
                              <option value="2008">2008</option>
                              <option value="2007">2007</option>
                              <option value="2006">2006</option>
                              <option value="2005">2005</option>
                              <option value="2004">2004</option>
                              <option value="2003">2003</option>
                              <option value="2002">2002</option>
                              <option value="2001">2001</option>
                              <option value="2000">2000</option>
                            </select> */}
                            <div className="mt-0">
                              {validationErrors[index]?.basic_year && (
                                <small className="text-danger">
                                  {t("jobseekerEducation.yearRequired")}
                                </small>
                              )}
                            </div>
                            <div className="removeButtonJobseeker mt-4">
                              {j.id ? (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-primary button2"
                                    onClick={() => handleRemove(j.id)}
                                    style={{
                                      color: hoverFourthButtonColor
                                        ? primaryColor
                                        : secondaryColor,
                                      backgroundColor: "white",
                                      border: hoverFourthButtonColor
                                        ? `2px solid ${primaryColor}`
                                        : `2px solid ${secondaryColor}`,
                                    }}
                                    // onMouseEnter={handleFourthButtonMouseEnter}
                                    // onMouseLeave={handleFourthButtonMouseLeave}
                                  >
                                    {t("jobseekerEducation.removeButton")}
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
                                    // onMouseEnter={handleFourthButtonMouseEnter}
                                    // onMouseLeave={handleFourthButtonMouseLeave}
                                  >
                                    {t("jobseekerEducation.removeButton")}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      );
                    })}
                    {educationDetails.length <= 0 && (
                      <>
                        <div className="noData">
                          {t("jobseekerEducation.noInfoAvl")}
                        </div>
                      </>
                    )}
                  </div>
                </form>
                {educationDetails.length > 0 && (
                  <>
                    <div className="EduAddMore mb-4">
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
                        {t("jobseekerEducation.addMoreButton")}
                      </button>
                    </div>
                  </>
                )}
                {educationDetails.length <= 0 && (
                  <>
                    <div className="EduAddMore mb-4">
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
                        {t("jobseekerEducation.addDetails")}
                      </button>
                    </div>
                  </>
                )}
                {educationDetails.length > 0 && (
                  <>
                    <div className="bottomButtonsEducation">
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
                        {t("jobseekerEducation.updateButton")}
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
                        {t("jobseekerEducation.cancelButton")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <Footer />
        </>
      )}
    </>
  );
};

export default JSEducation;
