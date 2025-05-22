import React, { useEffect, useState } from "react";
import Footer from "../element/Footer";
import JSSidebar from "./JSSidebar";
import NavBar from "../element/NavBar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import HTMLReactParser from "html-react-parser";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const JSMyProfile = () => {
  const [loading, setLoading] = useState(false);
  const [myProfile, setMyProfile] = useState([]);
  const [userDetail, setUserDetail] = useState([]);
  const [profileEducation, setProfileEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  // const [photo, setPhoto] = useState({
  //   profile_image: "",
  // });
  const [oldCertificates, setOldCertificates] = useState([]);
  const [oldDocs, setOldDocs] = useState([]);
  const [skill, setSkill] = useState([]);
  const [normalPlanFeatures, setNormalPlanFeatures] = useState([]);
  const [partnershipPlanFeatures, setPartnershipPlanFeatures] = useState([]);

  const tokenKey = Cookies.get("tokenClient");

  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  const [t, i18n] = useTranslation("global");

  const [docDownloadPath, setDocDownloadPath] = useState();
  const [downloadActive, setDownloadActive] = useState(false);

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
  const [hoverFifthButtonColor, setHoverFifthButtonColor] = useState(false);

  const handleFifthButtonMouseEnter = () => {
    setHoverFifthButtonColor(true);
  };

  const handleFifthButtonMouseLeave = () => {
    setHoverFifthButtonColor(false);
  };

  const [hoverSixthButtonColor, setHoverSixthButtonColor] = useState(false);

  const handleSixthButtonMouseEnter = () => {
    setHoverSixthButtonColor(true);
  };

  const handleSixthButtonMouseLeave = () => {
    setHoverSixthButtonColor(false);
  };

  const navigate = useNavigate();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/candidates/myaccount",
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
        // console.log(response.data.response);
        setPartnershipPlanFeatures(
          response.data.response.getRemainingFeaturesPartnership
        );
        setNormalPlanFeatures(response.data.response.getRemainingFeatures);
        setMyProfile(response.data.response);
        setUserDetail(response.data.response.userdetail);
        setSkill(response.data.response.userdetail.skill);
        setProfileEducation(response.data.response.education);
        setExperience(response.data.response.experience);
        setOldCertificates(response.data.response.showOldImages);
        setOldDocs(response.data.response.showOldDocs);
        // console.log(oldCertificates);
      } else if (response.data.status === 400) {
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: t("jobseekerManageAlert.close"),
        });
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: t("jobseekerManageAlert.close"),
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
      console.log("Cannot get profile data");
    }
  };

  let extension = "";
  let name = "";

  const handleDocDownload = async (path, doc) => {
    name = doc.substring(0, doc.lastIndexOf("."));
    extension = doc.substring(doc.lastIndexOf("."));

    setDocDownloadPath(path + doc);
    setDownloadActive(true);
    // console.log(docDownloadPath);
  };
  useEffect(() => {
    // console.log(downloadActive, DOCDownloadURL)
    if (downloadActive && docDownloadPath) {
      // Create a hidden link element
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = docDownloadPath;
      link.download = name + extension;
      document.body.appendChild(link);

      // Trigger a click on the link
      link.click();

      // Clean up
      document.body.removeChild(link);
      setDownloadActive(false);
    }
  }, [downloadActive, docDownloadPath]);

  // const handleDocumentsRemove = async (slug) => {
  //   try {
  //     const confirmationResult = await Swal.fire({
  //       title: t("jobseekerEditProfile.documentRemoveConfirmTitle"),
  //       text: t("jobseekerEditProfile.documentRemoveConfirmTxt"),
  //       icon: "question",
  //       showCancelButton: true,
  //       confirmButtonText: t("jobseekerEditProfile.yes"),
  //       cancelButtonText: t("jobseekerEditProfile.no"),
  //     });
  //     if (confirmationResult.isConfirmed) {
  //       const response = await axios.post(
  //         BaseApi + `/candidates/deleteCertificate/${slug}`,
  //         null, // Pass null as the request body if not required
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             key: ApiKey,
  //             token: tokenKey,
  //           },
  //         }
  //       );
  //       if (response.data.status === 200) {
  //         getData();
  //         Swal.fire({
  //           title: t("jobseekerEditProfile.documentRemoveSuccessTitle"),
  //           icon: "success",
  //           confirmButtonText: t("jobseekerEditProfile.close"),
  //         });
  //       } else if (response.data.status === 400) {
  //         Cookies.remove("tokenClient");
  //         Cookies.remove("user_type");
  //         Cookies.remove("fname");
  //         navigate("/");
  //         Swal.fire({
  //           title: response.data.message,
  //           icon: "warning",
  //           confirmButtonText: t("searchJobPage.close"),
  //         });
  //       } else {
  //         Swal.fire({
  //           title: response.data.message,
  //           icon: "error",
  //           confirmButtonText: t("searchJobPage.close"),
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     Swal.fire({
  //       title: t("jobseekerEditProfile.documentRemoveFailedTitle"),
  //       icon: "error",
  //       confirmButtonText: t("jobseekerEditProfile.close"),
  //     });
  //     console.log("Cannot delete certificate");
  //   }
  // };

  // const handleCertificateRemove = async (slug) => {
  //   try {
  //     const confirmationResult = await Swal.fire({
  //       title: "Delete Certificate?",
  //       text: "Do you want to delete this certificate?",
  //       icon: "question",
  //       showCancelButton: true,
  //       confirmButtonText: "Yes",
  //       cancelButtonText: "No",
  //     });
  //     if (confirmationResult.isConfirmed) {
  //       const response = await axios.post(
  //         BaseApi + `/candidates/deleteCertificate/${slug}`,
  //         null, // Pass null as the request body if not required
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             key: ApiKey,
  //             token: tokenKey,
  //           },
  //         }
  //       );
  //       getData();
  //       Swal.fire({
  //         title: "Certificate deleted successfully!",
  //         icon: "success",
  //         confirmButtonText: "Close",
  //       });
  //       console.log(response);
  //     }
  //   } catch (error) {
  //     Swal.fire({
  //       title: "Could not delete certificate. Please try after some time!",
  //       icon: "error",
  //       confirmButtonText: "Close",
  //     });
  //     console.log("Cannot delete certificate");
  //   }
  // };

  // Image Download Code
  const [imagePath, setImagePath] = useState();
  const [imageDownloadActive, setImageDownloadActive] = useState(false);

  const handleImageDownload = async (path) => {
    setImagePath(path);
    setImageDownloadActive(true);
  };
  useEffect(() => {
    // console.log(downloadActive, DOCDownloadURL)
    if (imageDownloadActive && imagePath) {
      // Create a hidden link element
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = imagePath;
      link.download = "generated-img.jpeg";
      document.body.appendChild(link);

      // Trigger a click on the link
      link.click();

      // Clean up
      document.body.removeChild(link);
      setImageDownloadActive(false);
    }
  }, [imageDownloadActive, imagePath]);

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

  return (
    <>
      <NavBar />
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <div className="container changeLogo">
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
                <div class="mx-3 PageHeader">
                  <div class="TopHadding">
                    <h3>
                      <i>
                        <img
                          src="/Images/jobseekerSide/user-icon.png"
                          alt="img"
                        />{" "}
                      </i>
                      {t("jobseekerMyProfile.myProfile")}
                    </h3>
                  </div>
                  <div class="JobseekerProfileBx">
                    <div class="JobseekerProfileTopBx">
                      <h3>
                        <i>
                          <img
                            src="/Images/jobseekerSide/profile-icon.png"
                            alt="icon"
                          />
                        </i>
                        <span>{t("jobseekerMyProfile.profile")}</span>
                      </h3>
                      <span class="EditProfileTag">
                        <Link to="/candidates/editprofile">
                          <i class="fa fa-pencil" aria-hidden="true"></i>{" "}
                          {t("jobseekerMyProfile.edit")}
                        </Link>
                      </span>
                    </div>

                    <div class="JobseekerProfileDetails">
                      <div class="JobseekerProfileBxDetailTop">
                        <div class="JobseekerProfileImg">
                          {userDetail.profile_image && (
                            <img src={userDetail.profile_image} alt="img" />
                          )}
                          {!userDetail.profile_image && (
                            <img
                              src="/Images/jobseekerSide/dummy-profile.png"
                              alt="img"
                            />
                          )}
                        </div>
                        <h3>
                          {userDetail.first_name} {userDetail.last_name}
                        </h3>
                      </div>
                      <div class="ProfileDetails">
                        <ul>
                          <li>
                            <i class="fa fa-phone" aria-hidden="true"></i>
                            <span>
                              {userDetail.contact ? userDetail.contact : "N/A"}
                            </span>
                          </li>
                          <li class="">
                            <i class="fa fa-envelope-o" aria-hidden="true"></i>
                            <span>{userDetail.email_address}</span>
                          </li>
                          <li class="full-width">
                            <i class="fa fa-map-marker" aria-hidden="true"></i>
                            <span>
                              {userDetail.location
                                ? userDetail.location
                                : t("jobseekerMyProfile.notAvailable")}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div class="JobseekerProfileBx">
                    <div class="JobseekerProfileTopBx">
                      <h3>
                        <i>
                          <img
                            src="/Images/jobseekerSide/Education-icon.png"
                            alt="icon"
                          />
                        </i>
                        <span> {t("jobseekerMyProfile.education")}</span>
                      </h3>
                      <span class="EditProfileTag">
                        <Link to="/candidates/editeducation">
                          <i class="fa fa-pencil" aria-hidden="true"></i>{" "}
                          {t("jobseekerMyProfile.edit")}
                        </Link>
                      </span>
                    </div>

                    <div class="JobseekerEducationDetails">
                      {profileEducation.length > 0
                        ? profileEducation.map((i) => {
                            return (
                              <>
                                <ul>
                                  <li>
                                    {t("jobseekerMyProfile.educationTxt1")}{" "}
                                    {i.course_name}{" "}
                                    {t("jobseekerMyProfile.educationTxt2")}{" "}
                                    {i.basic_year}{" "}
                                    {t("jobseekerMyProfile.educationTxt3")}{" "}
                                    {i.basic_university}.
                                  </li>
                                </ul>
                              </>
                            );
                          })
                        : t("jobseekerMyProfile.notAvailable")}
                    </div>
                  </div>

                  <div class="JobseekerProfileBx">
                    <div class="JobseekerProfileTopBx">
                      <h3>
                        <i>
                          <img
                            src="/Images/jobseekerSide/Experience-icon.png"
                            alt="icon"
                          />
                        </i>
                        <span> {t("jobseekerMyProfile.experience")}</span>
                      </h3>
                      <span class="EditProfileTag">
                        <Link to="/candidates/editExperience">
                          <i class="fa fa-pencil" aria-hidden="true"></i>{" "}
                          {t("jobseekerMyProfile.edit")}
                        </Link>
                      </span>
                    </div>

                    <div class="JobseekerEducationDetails">
                      {experience.length > 0
                        ? experience.map((i) => {
                            return (
                              <>
                                <ul>
                                  <li>
                                    {t("jobseekerMyProfile.experienceTxt1")}{" "}
                                    {i.role}{" "}
                                    {t("jobseekerMyProfile.experienceTxt2")}{" "}
                                    {i.company_name}{" "}
                                    {t("jobseekerMyProfile.experienceTxt3")}{" "}
                                    {i.from_year}{" "}
                                    {t("jobseekerMyProfile.experienceTxt4")}{" "}
                                    {i.to_year}{" "}
                                  </li>
                                  <li>
                                    {t("jobseekerMyProfile.experienceTxt5")}{" "}
                                    {i.industry}
                                  </li>
                                  <li>
                                    {t("jobseekerMyProfile.experienceTxt6")}{" "}
                                    {i.functional_area}
                                  </li>
                                  <li>
                                    {t("jobseekerMyProfile.experienceTxt7")}{" "}
                                    {i.role}
                                  </li>
                                </ul>
                                -----------------------------------------------
                              </>
                            );
                          })
                        : t("jobseekerMyProfile.notAvailable")}
                    </div>
                  </div>

                  <div class="JobseekerProfileBx">
                    <div class="JobseekerProfileTopBx">
                      <h3>
                        <i>
                          <img
                            src="/Images/jobseekerSide/Skills-icon.png"
                            alt="icon"
                          />
                        </i>
                        <span>{t("jobseekerMyProfile.skill")}</span>
                      </h3>
                      <div class="AddProfileTag">
                        <Link to="/candidates/editprofile">
                          <i>
                            <img
                              src="/Images/jobseekerSide/AddIcon.png"
                              alt="icon"
                            />
                          </i>
                          <span>{t("jobseekerMyProfile.add")}</span>
                        </Link>
                      </div>
                    </div>

                    <div class="JobseekerSkillsAdd">
                      <div class="SkillsAddBxMain m-2">
                        <ul>
                          {skill.length !== 0
                            ? Object.values(skill).map((value) => {
                                return (
                                  <>
                                    <li>
                                      <span>{value}</span>
                                      {/* <Link class="RemoveSkills">
                                      <img
                                        src="/Images/jobseekerSide/RemoveIcon.png"
                                        alt="icon"
                                      />
                                    </Link> */}
                                    </li>
                                    {/* <li>
                              <span>HR, Production Engineer</span>
                              <Link class="RemoveSkills">
                                <img
                                  src="/Images/jobseekerSide/RemoveIcon.png"
                                  alt="icon"
                                />
                              </Link>
                            </li> */}
                                  </>
                                );
                              })
                            : t("jobseekerMyProfile.noSkill")}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* <div class="JobseekerProfileBx">
                    <div class="JobseekerProfileTopBx">
                      <h3>
                        <i>
                          <img
                            src="/Images/jobseekerSide/Sertifications-icon.png"
                            alt="icon"
                          />
                        </i>
                        <span>Licenses & Certifications</span>
                      </h3>
                      <div class="AddProfileTag">
                        <Link>
                          <i>
                            <img
                              src="/Images/jobseekerSide/AddIcon.png"
                              alt="icon"
                            />
                          </i>
                          <span> ADD</span>
                        </Link>
                      </div>
                    </div>

                    <div class="JobseekerSkillsAdd">
                      <div class="SkillsAddBxMain">
                        <ul>
                          <li>
                            <span>Best Developer</span>
                            <Link class="RemoveSkills">
                              <img
                                src="/Images/jobseekerSide/RemoveIcon.png"
                                alt="icon"
                              />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div> */}

                  <div class="JobseekerProfileBx">
                    <div class="JobseekerProfileTopBx">
                      <h3>
                        <i>
                          <img
                            src="/Images/jobseekerSide/profile-icon.png"
                            alt="icon"
                          />
                        </i>
                        <span>{t("jobseekerMyProfile.aboutYourself")}</span>
                      </h3>
                      <span class="EditProfileTag">
                        <Link to="/candidates/editprofile">
                          <i class="fa fa-pencil" aria-hidden="true"></i>{" "}
                          {t("jobseekerMyProfile.edit")}
                        </Link>
                      </span>
                    </div>

                    <div class="JobseekerEducationDetails">
                      <p>
                        {userDetail.company_about
                          ? HTMLReactParser(userDetail.company_about)
                          : t("jobseekerMyProfile.notAvailable")}
                      </p>
                    </div>
                  </div>

                  <div class="JobseekerProfileBx">
                    <div class="JobseekerProfileTopBx">
                      <h3>
                        <i>
                          <img
                            src="/Images/jobseekerSide/CurrentPlan-icon.png"
                            alt="icon"
                          />
                        </i>
                        <span>{t("jobseekerMyProfile.currentPlan")}</span>
                      </h3>
                    </div>

                    <div class="JobseekerEducationDetails">
                      <div class="CurrentPlanBx">
                        <label>
                          {myProfile.plan_name
                            ? myProfile.plan_name
                            : t("jobseekerMyProfile.noPlan")}
                        </label>
                        <Link
                          to="/plans/purchase"
                          class="btn btn-primary"
                          style={{
                            backgroundColor: hoverFirstButtonColor
                              ? secondaryColor
                              : primaryColor,
                            border: hoverFirstButtonColor
                              ? secondaryColor
                              : primaryColor,
                          }}
                        >
                          {t("jobseekerMyProfile.upgradePlan")}
                        </Link>
                      </div>
                      <hr />
                      {normalPlanFeatures && (
                        <div className="planDetailsJobseeker">
                          <div className="parent">
                            <div className="child1">
                              {t("jobseekerMyProfile.totalJobApplyCount")}:
                            </div>
                            <div className="child2">
                              {normalPlanFeatures.maxAppliedCount === "1000000"
                                ? "Unlimited"
                                : normalPlanFeatures.maxAppliedCount}
                            </div>
                          </div>
                          {/* <div className="parent">
                            <div className="child1">{t("jobseekerMyProfile.numberOfJobAppliedCount")}:</div>
                            <div className="child2">
                              {normalPlanFeatures.appliedCount}
                            </div>
                          </div> */}
                          <div className="parent">
                            <div className="child1">
                              {t("jobseekerMyProfile.remainingJobApplyCount")}:
                            </div>
                            <div className="child2">
                              {normalPlanFeatures.availableAppliedCount ===
                              "1000000"
                                ? "Unlimited"
                                : normalPlanFeatures.availableAppliedCount}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* {myProfile.is_plan_active === 1 &&
                        myProfile.AvailbleplanFeature && (
                          <div className="form-outline mb-5 DashBoardInputBx">
                            <label className="form-label" for="form3Example3">
                              Available Plan Features
                            </label>
                            <div className="AvailablePlanBx">
                              <span>
                                {myProfile.AvailbleplanFeature
                                  .availableDownloadCount != null && (
                                  <p>
                                    <span className="availablePlanFeaturesKey">
                                      Resume Download:{" "}
                                    </span>
                                    {myProfile.AvailbleplanFeature
                                      .availableDownloadCount === "1000000"
                                      ? "Unlimited"
                                      : myProfile.AvailbleplanFeature
                                          .availableDownloadCount}
                                  </p>
                                )}

                                {myProfile.AvailbleplanFeature
                                  .availableJobpost != null && (
                                  <p>
                                    <span className="availablePlanFeaturesKey">
                                      Job Post:{" "}
                                    </span>
                                    {myProfile.AvailbleplanFeature
                                      .availableJobpost === "1000000"
                                      ? "Unlimited"
                                      : myProfile.AvailbleplanFeature
                                          .availableJobpost}
                                  </p>
                                )}
                                {myProfile.AvailbleplanFeature
                                  .availableProfileView != null && (
                                  <p>
                                    <span className="availablePlanFeaturesKey">
                                      Profile View:{" "}
                                    </span>
                                    {myProfile.AvailbleplanFeature
                                      .availableProfileView === "1000000"
                                      ? "Unlimited"
                                      : myProfile.AvailbleplanFeature
                                          .availableProfileView}
                                  </p>
                                )}
                                {myProfile.AvailbleplanFeature
                                  .searchCandidate && (
                                  <p>
                                    <span className="availablePlanFeaturesKey">
                                      Search Candidate:{" "}
                                    </span>
                                    {
                                      myProfile.AvailbleplanFeature
                                        .searchCandidate
                                    }
                                  </p>
                                )}
                              </span>
                            </div>
                          </div>
                        )} */}
                    </div>
                  </div>

                  {/* partnership plan */}
                  {/* <div class="JobseekerProfileBx">
                    <div class="JobseekerProfileTopBx">
                      <h3>
                        <i>
                          <img
                            src="/Images/jobseekerSide/CurrentPlan-icon.png"
                            alt="icon"
                          />
                        </i>
                        <span>
                          {t("jobseekerMyProfile.currentPartnershipPlan")}
                        </span>
                      </h3>
                    </div>

                    <div class="JobseekerEducationDetails">
                      <div class="CurrentPlanBx">
                        <label>
                          {myProfile.partnership_plan_name
                            ? myProfile.partnership_plan_name
                            : t("jobseekerMyProfile.noPlan")}
                        </label>
                        <Link
                          to="/partnershipplans/purchase"
                          class="btn btn-primary"
                          style={{
                            backgroundColor: hoverSixthButtonColor
                              ? secondaryColor
                              : primaryColor,
                            border: hoverSixthButtonColor
                              ? secondaryColor
                              : primaryColor,
                          }}
                        >
                          {t("jobseekerMyProfile.upgradePlan")}
                        </Link>
                      </div>
                      <hr />
                      {partnershipPlanFeatures && (
                        <div className="planDetailsJobseeker">
                          <div className="parent">
                            <div className="child1">
                              {t("jobseekerMyProfile.totalBusinessApplyCount")}:
                            </div>
                            <div className="child2">
                              {partnershipPlanFeatures.maxAppliedCount}
                            </div>
                          </div>
                          
                          <div className="parent">
                            <div className="child1">
                              {t(
                                "jobseekerMyProfile.remainingBusinessApplyCount"
                              )}
                              :
                            </div>
                            <div className="child2">
                              {partnershipPlanFeatures.availableAppliedCount}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div> */}

                  <div class="JobseekerProfileBx">
                    <div class="JobseekerProfileTopBx">
                      <h3>
                        <i>
                          <img
                            src="/Images/jobseekerSide/Certificates-icon.png"
                            alt="icon"
                          />
                        </i>
                        <span>
                          {t("jobseekerMyProfile.CVDocuments/Certificates")}
                        </span>
                      </h3>
                    </div>

                    <div class="JobseekerCertificatesDetails">
                      <ul className="certificatesSection">
                        <p>{t("jobseekerMyProfile.certificates")}: </p>
                        {oldCertificates.length > 0
                          ? oldCertificates.map((i, index) => {
                              return (
                                <>
                                  <li className="eachCertificateMyprofile">
                                    <i
                                      onClick={() =>
                                        handleImageDownload(i.image)
                                      }
                                    >
                                      <img
                                        className="JSmyProfileCertificateImage"
                                        src={i.image}
                                        alt="icon"
                                      />
                                    </i>
                                    <span>
                                      {/* {t("jobseekerMyProfile.certificate")}{" "}
                                      {index + 1} */}

                                      {i.image_name}
                                    </span>
                                  </li>
                                </>
                              );
                            })
                          : t("jobseekerMyProfile.notAvailable")}
                      </ul>
                      <ul className="certificatesSection">
                        <p>{t("jobseekerMyProfile.documents")}: </p>
                        {oldDocs.length > 0
                          ? oldDocs.map((i, index) => {
                              return (
                                <>
                                  <li
                                    className="eachDocumentMyprofile"
                                    onClick={() =>
                                      handleDocDownload(i.path, i.doc)
                                    }
                                  >
                                    <i class="fa-solid fa-file"></i>
                                    {/* {i.doc_sub?.substring(0, 18)} */}
                                    {/* {t("jobseekerAddDocuments.document")}{" "}
                                    {index + 1} */}
                                    {i.doc?.substring(0, 14)}..
                                  </li>
                                </>
                              );
                            })
                          : t("jobseekerMyProfile.notAvailable")}
                      </ul>
                    </div>
                  </div>
                  <div className="myProfileLinks">
                    <Link
                      to="/candidates/deleteAccount"
                      className="myProfileEachButton button1"
                      style={{
                        backgroundColor: hoverThirdButtonColor
                          ? secondaryColor
                          : primaryColor,
                        border: hoverThirdButtonColor
                          ? secondaryColor
                          : primaryColor,
                      }}
                      onMouseEnter={handleThirdButtonMouseEnter}
                      onMouseLeave={handleThirdButtonMouseLeave}
                    >
                      {t("jobseekerMyProfile.deleteAccount")}
                    </Link>
                    <Link
                      className="myProfileEachButton button1"
                      to="/candidates/changepassword"
                      style={{
                        backgroundColor: hoverFourthButtonColor
                          ? secondaryColor
                          : primaryColor,
                        border: hoverFourthButtonColor
                          ? secondaryColor
                          : primaryColor,
                      }}
                      onMouseEnter={handleFourthButtonMouseEnter}
                      onMouseLeave={handleFourthButtonMouseLeave}
                    >
                      {t("jobseekerMyProfile.changePassword")}
                    </Link>
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

export default JSMyProfile;
