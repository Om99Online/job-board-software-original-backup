import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "./Footer";
import JobCard from "./JobCard";
import NavBar from "./NavBar";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import HTMLReactParser from "html-react-parser";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  EmailShareButton,
  InstapaperShareButton,
  TelegramShareButton,
} from "react-share";
import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  EmailIcon,
  PinterestIcon,
  InstapaperIcon,
  TelegramIcon,
} from "react-share";
import { useTranslation } from "react-i18next";


const JobDescription = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [jobDescriptiondata, setJobDescriptionData] = useState([]);
  const [relevantJob, setRelevantJob] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skillData, setSkillData] = useState([]);
  const [error, setError] = useState(false);
  const [coverLetterData, setCoverLetterData] = useState([]);
  const [coverLetterSelected, setCoverLetterSelected] = useState();
  let jobSearched = sessionStorage.getItem("jobSearched");

  const tokenKey = Cookies.get("tokenClient");
  const usertype = Cookies.get("usertype");

  const [open, setOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null); // Track the selected payment
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [t, i18n] = useTranslation("global");
  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  // let captchaKey = Cookies.get("captchaKey");

  const [hoverColor, setHoverColor] = useState(false);

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

  const handleOpen = () => {
    // console.log("Clicked payment:", plan); // Add this line
    // setSelectedPayment(plan);
    setOpen(true);
  };

  const handleClose = () => {
    // setSelectedPayment(null);
    setOpen(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  // useEffect(() => {
  //   if (tokenKey === null || tokenKey === "") {
  //     navigate("/user/jobseekerlogin");
  //   }
  // }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/candidates/apps_jobdetail/${slug}`,
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
        
        setJobDescriptionData(response.data.response);
        const userId = response.data.response.user_id
        jobViewCount(userId);
        if(jobSearched === "1") {
          console.log("inside if", jobSearched);
          jobSearchViewCount(userId);
        }
        sessionStorage.removeItem("jobSearched");
        setRelevantJob(response.data.response.relevantJobList);
        setSkillData(response.data.response.skills_array);
        setCoverLetterData(response.data.response.coverletter);
        // console.log(relevantJob);
      } else {
        Swal.fire({
          text: response.data.message,
          icon: "error",
          confirmButtonText: t("jobDescription.close"),
        });
      }
    } catch (error) {
      setLoading(false);
      if(error.message === "Network Error") {
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
      console.log(
        "Cannot get job description through applied job section at job seeker"
      );
    }
  };

  const jobViewCount = async(userId) => {
    try {
      if(userId){
        const response = await axios.post(
          BaseApi + `/job/view/${slug}`,
          {id: userId},
          {
            headers: {
              "Content-Type": "application/json",
              // key: ApiKey,
              // token: tokenKey,
            },
          }
        )
      }
      
    } catch (error) {
      console.log(error.message)
    }
  }

  const jobSearchViewCount = async(userId) => {
    try {
      if(userId){
        const response = await axios.post(
          BaseApi + `/job/searchView/${slug}`,
          {id: userId},
          {
            headers: {
              "Content-Type": "application/json",
              // key: ApiKey,
              // token: tokenKey,
            },
          }
        )
      }
      
    } catch (error) {
      console.log(error.message)
    }
  }
  const getAppliedData = async (id) => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/job/applypop/${id}`,
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
      // console.log(response);
    } catch (error) {
      setLoading(false);
      console.log("Error at applied button at job description");
    }
  };

  // useEffect(() => {
  //   // Check if tokenKey is not present
  //   if (!tokenKey) {
  //     // Redirect to the home page
  //     navigate("/user/jobseekerlogin");
  //   } else {
  //     // TokenKey is present, fetch data or perform other actions
  //     getAppliedData();
  //     getData();
  //     window.scrollTo(0, 0);
  //   }
  // }, [tokenKey, navigate]);
  useEffect(() => {
    getAppliedData();
    getData();
    window.scrollTo(0, 0);
  }, []);

  const savedJob = async (slug) => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/job/JobSave/${slug}`,
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
        getData();
        Swal.fire({
          title: t("jobDescription.savedJobSuccessTitle"),
          icon: "success",
          confirmButtonText: t("jobDescription.close"),
        });
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: t("jobDescription.close"),
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: t("jobDescription.savedJobFailedTitle"),
        icon: "error",
        confirmButtonText: t("jobDescription.close"),
      });
      console.log("Cannot save job!");
    }
  };

  const handleDeclarationSubmit = async (slug) => {
    if (!isAgreementChecked) {
      setValidationError(t("jobDescription.declarationValidationError"));
      setError(false);
    } else {
      setLoading(true);
      try {
        const response = await axios.post(
          BaseApi + `/job/jobApplyDetail/${slug}`,
          coverLetterSelected,
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
          getData();
          Swal.fire({
            title: t("jobDescription.jobAppliedSuccessTitle"),
            icon: "success",
            confirmButtonText: t("jobDescription.close"),
          });
        } else {
          getData();
          Swal.fire({
            title: response.data.message,
            icon: "warning",
            confirmButtonText: t("jobDescription.close"),
          });
        }
        // window.location.reload();
      } catch (error) {
        setLoading(false);
        if(error.message === "Network Error") {
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
          title: t("jobDescription.jobAppliedFailedTitle"),
          icon: "error",
          confirmButtonText: t("jobDescription.close"),
        });
        console.log("Error on clicking the submit button at apply job modal!");
      }
    }
  };

  const handleClickWithoutLogin = () => {
    navigate("/user/jobseekerlogin");
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "warning",
      title: t("jobDescription.pleaseLogin"),
    });
  };

  const handleAgreementChange = () => {
    if (validationError) {
      setError(true);
      setValidationError(""); // Clear the validation error when the checkbox is checked
    }
    setIsAgreementChecked(!isAgreementChecked);
    setError(!error);
  };

  return (
    <>
      <NavBar />
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <section className="JobDetailTopBx">
            <div className="container">
              <div className="row">
                <div className="col-lg-7 col-md-7">
                  <div className="single-job-detail">
                    <div className="logo-detail">
                      {jobDescriptiondata.logo != "" ? (
                        <>
                          <img
                            className="JDImage"
                            src={jobDescriptiondata.logo}
                            alt="Company"
                          />
                        </>
                      ) : (
                        <>
                          <img
                            className="JDImage"
                            src="/Images/jobseekerSide/dummy-profile.png"
                            alt="Company name"
                          />
                        </>
                      )}
                    </div>
                    <div className="job-meta-detail">
                      <h2>
                        {jobDescriptiondata.title
                          ? HTMLReactParser(jobDescriptiondata.title)
                          : ""}
                      </h2>
                      <p>
                        <i className="fa-sharp fa-solid fa-briefcase"></i>{" "}
                        {jobDescriptiondata.experience}
                      </p>
                      <p>
                        <i className="fa-sharp fa-solid fa-location-dot"></i>{" "}
                        {jobDescriptiondata.location}
                      </p>
                      <p>
                        <i className="fa-solid fa-calendar-days"></i>{" "}
                        {jobDescriptiondata.posted_date}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-5">
                  <div className="JobDetailBtnBx">
                    <div className="ShareBtnDetails">
                      <Link
                        onClick={() => handleOpen()}
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        <img src="/Images/share.png" alt="" />
                      </Link>
                    </div>
                    <div
                      className="modal fade"
                      id="exampleModal"
                      tabIndex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h1
                              className="modal-title fs-5"
                              id="exampleModalLabel"
                            >
                              {t("jobDescription.shareNow")}
                            </h1>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <ul className="shareIconsList">
                              <li className="shareIconsButtons">
                                <FacebookShareButton
                                  url={jobDescriptiondata.job_url}
                                >
                                  <FacebookIcon
                                    logoFillColor="white"
                                    round={true}
                                  ></FacebookIcon>
                                </FacebookShareButton>
                              </li>
                              <li className="shareIconsButtons">
                                <TwitterShareButton
                                  url={jobDescriptiondata.job_url}
                                >
                                  <TwitterIcon
                                    logoFillColor="white"
                                    round={true}
                                  ></TwitterIcon>
                                </TwitterShareButton>
                              </li>
                              <li className="shareIconsButtons">
                                <WhatsappShareButton
                                  url={jobDescriptiondata.job_url}
                                >
                                  <WhatsappIcon
                                    logoFillColor="white"
                                    round={true}
                                  ></WhatsappIcon>
                                </WhatsappShareButton>
                              </li>
                              <li className="shareIconsButtons">
                                <LinkedinShareButton
                                  url={jobDescriptiondata.job_url}
                                >
                                  <LinkedinIcon
                                    logoFillColor="white"
                                    round={true}
                                  ></LinkedinIcon>
                                </LinkedinShareButton>
                              </li>

                              <li className="shareIconsButtons">
                                <EmailShareButton url="www.logicspice.com">
                                  <EmailIcon
                                    logoFillColor="white"
                                    round={true}
                                  ></EmailIcon>
                                </EmailShareButton>
                              </li>
                              <li className="shareIconsButtons">
                                <PinterestShareButton
                                  url={jobDescriptiondata.job_url}
                                >
                                  <PinterestIcon
                                    logoFillColor="white"
                                    round={true}
                                  ></PinterestIcon>
                                </PinterestShareButton>
                              </li>
                              <li className="shareIconsButtons">
                                <InstapaperShareButton
                                  url={jobDescriptiondata.job_url}
                                >
                                  <InstapaperIcon
                                    logoFillColor="white"
                                    round={true}
                                  ></InstapaperIcon>
                                </InstapaperShareButton>
                              </li>
                              <li className="shareIconsButtons">
                                <TelegramShareButton
                                  url={jobDescriptiondata.job_url}
                                >
                                  <TelegramIcon
                                    logoFillColor="white"
                                    round={true}
                                  ></TelegramIcon>
                                </TelegramShareButton>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    {tokenKey != null ? (
                      <div className="ApplyJobBtnBx">
                        {jobDescriptiondata.is_applied === 1 ? (
                          <button
                            className="btn btn-primary"
                            style={{
                              backgroundColor: `${
                                secondaryColor &&
                                (hoverColor ? secondaryColor : primaryColor)
                              }`,
                              border: `${
                                secondaryColor &&
                                (hoverColor ? secondaryColor : primaryColor)
                              }`,
                              minWidth: "115px",
                            }}
                          >
                            {t("jobDescription.applied")}
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#applyModal"
                            style={{
                              backgroundColor: `${
                                secondaryColor &&
                                (hoverColor ? secondaryColor : primaryColor)
                              }`,
                              border: `${
                                secondaryColor &&
                                (hoverColor ? secondaryColor : primaryColor)
                              }`,
                              minWidth: "115px",
                            }}
                          >
                            {t("jobDescription.applyNow")}
                          </button>
                        )}
                        {jobDescriptiondata.is_saved === 1 ? (
                          <button className="btn btn-secondary">
                            <i className="fa fa-light fa-star-o"></i> {t("jobDescription.saved")}
                          </button>
                        ) : (
                          <button
                            className="btn btn-secondary"
                            onClick={() => savedJob(slug)}
                            style={{
                              color: secondaryColor,
                              border: `1px solid ${secondaryColor}`,
                              backgroundColor: "white",
                              borderRadius: "4px",
                            }}
                          >
                            <i className="fa fa-light fa-star-o"></i> {t("jobDescription.saveJob")}
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="ApplyJobBtnBx">
                        <button
                          className="btn btn-primary"
                          style={{
                            backgroundColor: `${
                              secondaryColor &&
                              (hoverColor ? secondaryColor : primaryColor)
                            }`,
                            border: `${
                              secondaryColor &&
                              (hoverColor ? secondaryColor : primaryColor)
                            }`,
                            minWidth: "115px",
                          }}
                          onClick={() => handleClickWithoutLogin()}
                        >
                          {t("jobDescription.applyNow")}
                        </button>

                        <button
                          onClick={() => handleClickWithoutLogin()}
                          className="btn btn-secondary"
                          style={{
                            color: secondaryColor,
                            border: `1px solid ${secondaryColor}`,
                            backgroundColor: "white",
                            borderRadius: "4px",
                          }}
                        >
                          <i className="fa fa-light fa-star-o"></i> {t("jobDescription.saveJob")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="JobDetailsDescriptionSection">
            <div className="container JDSection2">
              <div className="row">
                <div className="col-lg-8 col-md-8">
                  <div className="JobDescriptionBx">
                    <h2 className="mb-4">{t("jobDescription.jobDescription")}</h2>
                    <p>
                      {jobDescriptiondata.description
                        ? HTMLReactParser(jobDescriptiondata.description)
                        : ""}
                    </p>
                    <h2 className="mt-5">{t("jobDescription.skillRequired")}</h2>
                    <div>
                      {skillData.length > 0
                        ? skillData.map((i) => {
                            return (
                              <p className="keySkillitem" key={i.id}>
                                <i class="fa-solid fa-arrow-right"></i> {i.name}
                              </p>
                            );
                          })
                        : t("jobDescription.notAvailable")}
                      {/* <p className="keySkillitem">Computers - Excel</p>
                      <p className="keySkillitem">Computers - iPhone</p>
                      <p className="keySkillitem">Computers - Microsoft</p> */}
                    </div>
                    <h2 className="mt-5">{t("jobDescription.workingRelation")}</h2>
                    <div>
                      <p className="keySkillitem">
                        {jobDescriptiondata.designation
                          ? jobDescriptiondata.designation
                          : t("jobDescription.notAvailable")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="card Jcard JobDetailsCard">
                    <div className="card-title">
                      <h2>{t("jobDescription.jobOverview")}</h2>
                    </div>
                    <div className="card-body JcardBody">
                      <div className="JobDetailsInfo">
                        <ul>
                          <li>
                            <span className="jobDescriptionKeys">
                              <i className="fa-solid fa-calendar-days"></i> {t("jobDescription.datePosted")}:{" "}
                            </span>
                            {jobDescriptiondata.posted_date}
                          </li>
                          <li>
                            <span className="jobDescriptionKeys">
                              <i className="fa-solid fa-sitemap"></i> {t("jobDescription.category")}:{" "}
                            </span>
                            {jobDescriptiondata.category}
                          </li>
                          <li>
                            <span className="jobDescriptionKeys">
                              <i className="fa-solid fa-sitemap"></i> {t("jobDescription.subCategory")}:{" "}
                            </span>
                            {jobDescriptiondata.subcategory}
                          </li>
                          <li>
                            <span className="jobDescriptionKeys">
                              <i className="fa-solid fa-clock"></i> {t("jobDescription.jobType")}:{" "}
                            </span>
                            {jobDescriptiondata.job_type}
                          </li>
                          <li>
                            <span className="jobDescriptionKeys">
                              <i className="fa-solid fa-dollar-sign"></i>{" "}
                              {t("jobDescription.salary")}:{" "}
                            </span>
                            {jobDescriptiondata.salary}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="card Jcard JobDetailsCard">
                    <div className="card-title">
                      <h2>{t("jobDescription.contactInfo")}</h2>
                    </div>
                    <div className="card-body JcardBody">
                      <div className="JobDetailsInfo">
                        <ul>
                          <li>
                            <span className="jobDescriptionKeys">
                              <i className="fa-solid fa-users"></i> {t("jobDescription.companyName")}:{" "}
                            </span>
                            {jobDescriptiondata.company_name}
                          </li>
                          <li>
                            <span className="jobDescriptionKeys">
                              <i className="fa-solid fa-user"></i> {t("jobDescription.recruiterName")}:{" "}
                            </span>
                            {jobDescriptiondata.contact_name}
                          </li>
                          <li>
                            <span className="jobDescriptionKeys">
                              <i className="fa-solid fa-phone"></i> {t("jobDescription.contactCompany")}:{" "}
                            </span>
                            {jobDescriptiondata.contact_number}
                          </li>
                          <li>
                            <span className="jobDescriptionKeys">
                              <i className="fa-solid fa-share"></i> {t("jobDescription.website")}:{" "}
                            </span>
                            {jobDescriptiondata.website}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57381.72856938326!2d-79.52718056240919!3d43.71126210767677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b33b608ca4a0b%3A0xe1069400ad5da8bf!2sLawrence%20Allen%20Centre!5e0!3m2!1sen!2sin!4v1687851288550!5m2!1sen!2sin"
                    width="415"
                    height="300"
                    style={{ borderRadius: "15px" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                {relevantJob.length > 0 && (
                  <div className="relatedJobsSection">
                    <h2 className="mt-5">{t("jobDescription.relatedJobs")}</h2>
                    <div className="row">
                      {relevantJob.map((i) => {
                        return (
                          <>
                            <div
                              className="mt-4 col-lg-4 col-md-4"
                              onClick={() => window.location.reload()}
                            >
                              <JobCard
                                title={i.title}
                                min_salary={i.min_salary}
                                max_salary={i.max_salary}
                                min_exp={i.min_exp}
                                created={i.created}
                                logo={i.logo}
                                company_name={i.company_name}
                                work_type={i.work_type}
                                job_city={i.job_city}
                                slug={i.slug}
                                cat_slug={i.cat_slug}
                              />
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
          <Footer />
          {/* Reply Modal  */}
          <div
            className="modal fade  membershipModal"
            id="applyModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="text-center modal-title fs-5"
                    id="exampleModalLabel"
                  >
                    {t("jobDescription.jobApplicationConfirmation")}
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body text-center">
                  <h5 className="m-2">{t("jobDescription.declaration")}:</h5>
                  <p>
                  {t("jobDescription.declarationTxt")}
                  </p>
                  <div className="m-2">
                    <input
                      type="checkbox"
                      name="agreement"
                      checked={isAgreementChecked}
                      onChange={handleAgreementChange}
                      required
                    />
                    <span className="RedStar">*</span> {t("jobDescription.declarationAgreed")}
                  </div>
                  {validationError && (
                    <p style={{ color: "red" }}>{validationError}</p>
                  )}
                  <h5 className="m-2"> {t("jobDescription.selectCoverLetter")}</h5>
                  {coverLetterData &&
                    coverLetterData.map((i) => {
                      return (
                        <>
                          <input
                            type="radio"
                            id={i.id}
                            name="coverletter"
                            value={i.id}
                            onChange={(e) =>
                              setCoverLetterSelected(e.target.value)
                            }
                          />{" "}
                          {i.title}
                        </>
                      );
                    })}
                  <hr />
                  <div className="d-flex justify-content-evenly">
                    <button
                      type="button"
                      className="btn btn-primary button1"
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
                      data-bs-dismiss={error && `modal`}
                      aria-label={error && `close`}
                      onClick={() => handleDeclarationSubmit(slug)}
                    >
                      {t("jobDescription.submitButton")}
                    </button>
                    <Link
                      to="/candidates/editprofile"
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
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => navigate("/candidates/editprofile")}
                    >
                      {t("jobDescription.addCoverLetter")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default JobDescription;
