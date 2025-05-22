import React, { useEffect, useState } from "react";
import Footer from "../element/Footer";
import JSSidebar from "./JSSidebar";
import NavBar from "../element/NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ApiKey from "../api/ApiKey";
import BaseApi from "../api/BaseApi";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { FaEnvelope } from "react-icons/fa";

const JSMakeCV = () => {
  const [loading, setLoading] = useState(false);
  const [cvUserdetail, setCVUserdetail] = useState([]);
  const [cvEducation, setCVEducation] = useState([]);
  const [cvExperience, setCVExperience] = useState([]);
  const [PDFDownloadURL, setPDFDownloadURL] = useState();
  const [DOCDownloadURL, setDOCDownloadURL] = useState("");
  const [professionalExp, setCVProfessionalExp] = useState([]);

  const [docDownloadActive, setDocDownloadActive] = useState(false);
  const [pdfDownloadActive, setPdfDownloadActive] = useState(false);

  const tokenKey = Cookies.get("tokenClient");
  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  const [t, i18n] = useTranslation("global");

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
        BaseApi + "/candidates/makecv",
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
        setCVUserdetail(response.data.response.userdetail);
        setCVEducation(response.data.response.education);
        setCVExperience(response.data.response.experience);
        setCVProfessionalExp(response.data.response.profReg);

        // console.log(cvEducation);
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
      console.log("Cannot get CV data");
    }
  };

  // Date object
  const date = new Date();

  let currentDay = String(date.getDate()).padStart(2, "0");

  let currentMonth = String(date.getMonth() + 1).padStart(2, "0");

  let currentYear = date.getFullYear();

  // we will display the date as DD-MM-YYYY

  let currentDate = `${currentDay}-${currentMonth}-${currentYear}`;

  const generatePdf = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/candidates/apps_generatecv",
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
        setPDFDownloadURL(response.data.response.resume_path);
        setPdfDownloadActive(true);
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
      console.log("Cannot get CV data pdf format", error.message);
    }
  };

  const generateDoc = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/candidates/generatecvdoc",
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
        setDOCDownloadURL(response.data.response.resume_path);
        // console.log(DOCDownloadURL);
        setDocDownloadActive(true);
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
      console.log("Cannot get CV data in doc format", error.message);
    }
  };
  // useEffect(() => {
  //   // console.log(downloadActive, DOCDownloadURL)
  //   if (docDownloadActive && DOCDownloadURL) {
  //     // Create a hidden link element
  //     const link = document.createElement("a");
  //     link.style.display = "none";
  //     link.href = DOCDownloadURL;
  //     link.download = "generated-cv.docx";
  //     document.body.appendChild(link);

  //     // Trigger a click on the link
  //     link.click();

  //     // Clean up
  //     document.body.removeChild(link);
  //     setDocDownloadActive(false);
  //   }
  // }, [docDownloadActive, DOCDownloadURL]);

  useEffect(() => {
    if (docDownloadActive && DOCDownloadURL) {
      // Extract the file name from the URL
      const urlParts = DOCDownloadURL.split("/");
      const fileName = urlParts[urlParts.length - 1]; // Get the last part of the URL

      // Create a hidden link element
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = DOCDownloadURL;
      link.download = fileName; // Use the extracted file name
      document.body.appendChild(link);

      // Trigger a click on the link
      link.click();

      // Clean up
      document.body.removeChild(link);
      setDocDownloadActive(false);
    }
  }, [docDownloadActive, DOCDownloadURL]);

  // useEffect(() => {
  //   // console.log(downloadActive, DOCDownloadURL)
  //   if (pdfDownloadActive && PDFDownloadURL) {
  //     // Create a hidden link element
  //     const link = document.createElement("a");
  //     link.style.display = "none";
  //     link.href = PDFDownloadURL;
  //     link.download = "generated-cv.pdf";
  //     document.body.appendChild(link);

  //     // Trigger a click on the link
  //     link.click();

  //     // Clean up
  //     document.body.removeChild(link);
  //     setPdfDownloadActive(false);
  //   }
  // }, [pdfDownloadActive, PDFDownloadURL]);

  useEffect(() => {
    if (pdfDownloadActive && PDFDownloadURL) {
      // Extract the file name from the URL
      const urlParts = PDFDownloadURL.split("/");
      const fileName = urlParts[urlParts.length - 1]; // Get the last part of the URL

      // Create a hidden link element
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = PDFDownloadURL;
      link.download = fileName; // Use the extracted file name
      document.body.appendChild(link);

      // Trigger a click on the link
      link.click();

      // Clean up
      document.body.removeChild(link);
      setPdfDownloadActive(false);
    }
  }, [pdfDownloadActive, PDFDownloadURL]);

  return (
    <>
      <NavBar />
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <div className="container makeCV">
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
                <div className="mx-3 d-flex headerMakeCV">
                  <img src="/Images/jobseekerSide/Make-A-CV-color.png" alt="" />
                  <h3 className="ms-1" style={{ color: "#a4bcc4" }}>
                    {t("jobseekerMakeCV.curriculumVitae")}{" "}
                    {cvUserdetail.first_name} {cvUserdetail.last_name}
                  </h3>
                </div>
                <div className="mx-4">
                  <div className="makeCVSeg1">
                    <div className="makeCVUserDetail">
                      <h4 className="makeCVName">
                        {cvUserdetail.first_name} {cvUserdetail.last_name} 
                      </h4><FaEnvelope />
                      <h6 className="makeCVEmail">
                        
                        <i class="fa-solid fa-envelope"></i>{" "}

                        {cvUserdetail.email_address}
                      </h6>
                      {/* <h6 className="makeCVPhone">
                        <i class="fa-solid fa-phone"></i> {cvUserdetail.contact}
                      </h6> */}
                      <h6 className="makeCVAddress">
                        <i class="fa-solid fa-address-card me-1"></i>
                        {t("jobseekerMakeCV.address")}: {cvUserdetail.location}
                      </h6>
                    </div>
                  </div>

                  <h4 className="mt-5">{t("jobseekerMakeCV.education")}</h4>
                  <hr />
                  {cvEducation.map((i) => {
                    return (
                      <>
                        <p>
                          {t("jobseekerMakeCV.eduLine1")} {i.course_name}{" "}
                          {t("jobseekerMakeCV.eduLine2")} {i.basic_year}{" "}
                          {t("jobseekerMakeCV.eduLine3")} {i.basic_university}.{" "}
                          <br />
                        </p>
                      </>
                    );
                  })}

                  <h4 className="mt-5">{t("jobseekerMakeCV.experience")}</h4>
                  <hr />
                  {cvExperience.map((i) => {
                    return (
                      <>
                        <p>
                          {t("jobseekerMakeCV.expLine1")} {i.role}{" "}
                          {i.designation} {t("jobseekerMakeCV.expLine2")}{" "}
                          {i.company_name} {t("jobseekerMakeCV.expLine3")}{" "}
                          {i.from_year} {t("jobseekerMakeCV.expLine4")}{" "}
                          {i.to_year} <br />
                          {t("jobseekerMakeCV.industry")}: {i.industry}
                          <br />
                          {t("jobseekerMakeCV.functionalArea")}:{" "}
                          {i.functional_area} <br />
                          {t("jobseekerMakeCV.role")}: {i.role} <br />
                        </p>
                        -------------------------------------------------
                      </>
                    );
                  })}

                  <h4 className="mt-5">
                    {t("jobseekerMakeCV.professionalRegistration")}
                  </h4>
                  <hr />
                  {professionalExp.map((i, index) => {
                    return (
                      <>
                        <p>
                          {index + 1}. Registration Name: {i.registration_name}{" "}
                          <br />
                        </p>
                      </>
                    );
                  })}

                  <div className="mt-5 d-flex justify-content-between">
                    <p>
                      {t("jobseekerMakeCV.date")}: {currentDate}
                    </p>
                    <p>{t("jobseekerMakeCV.signature")}</p>
                  </div>
                  <div className="makeaCVBottomBotton">
                    <button
                      className="btn btn-primary button1"
                      onClick={() => generatePdf()}
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
                      <img src="/Images/jobseekerSide/pdf-icon.png" alt="" />{" "}
                      {t("jobseekerMakeCV.generatePdf")}
                    </button>

                    <button
                      className="btn btn-primary button2"
                      onClick={() => generateDoc()}
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
                      <img src="/Images/jobseekerSide/DocIcon.png" alt="" />{" "}
                      {t("jobseekerMakeCV.generateDoc")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </>
      )}
    </>
  );
};

export default JSMakeCV;
