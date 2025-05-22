import React, { useEffect, useState } from "react";
import NavBar from "../element/NavBar";
import Sidebar from "./Sidebar";
import Footer from "../element/Footer";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import HTMLReactParser from "html-react-parser";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

const MyProfileNew = () => {
  const [profileData, setProfileData] = useState([]);
  const [profilePage, setProfilePage] = useState([]);
  const [loading, setLoading] = useState(false);
  // const tokenKey = sessionStorage.getItem("token");
  const navigate = useNavigate();
  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  const [t, i18n] = useTranslation("global");

  const [hoverPlanColor, setHoverPlanColor] = useState(false);

  const handlePlanMouseEnter = () => {
    setHoverPlanColor(true);
  };

  const handlePlanMouseLeave = () => {
    setHoverPlanColor(false);
  };

  const tokenKey = Cookies.get("tokenClient");
  // const fname = Cookies.get('fname');
  // const userType = Cookies.get('user_type');

  useEffect(() => {
    // Check if tokenKey is not present
    if (!tokenKey) {
      // Redirect to the home page
      navigate("/user/employerlogin");
    } else {
      // TokenKey is present, fetch data or perform other actions
      getData();
      window.scrollTo(0, 0);
    }
  }, [tokenKey, navigate]);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(BaseApi + "/users/myaccount", null, {
        headers: {
          "Content-Type": "application/json",
          key: ApiKey,
          token: tokenKey,
        },
      });
      setLoading(false);
      if(response.data.status === 200) {
        setProfileData(response.data.response);
        setProfilePage(response.data);
      }
      
      // console.log(profilePage);
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
      console.log("Cannot get profile data!");
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <NavBar />
      <div className="container myProfile">
        <div className="row">
          <div className="col-lg-3">
            <Sidebar />
          </div>
          {loading ? (
            <div className="loader-container"></div>
          ) : (
            <>
              <div
                className="col-lg-9 mb-5"
                style={{
                  borderLeft: "2px solid #e6e8e7",
                  borderRight: "2px solid #e6e8e7",
                }}
              >
                <div className="d-flex mx-3">
                  <img src="/Images/employerSide/icon7color.png" alt="" />
                  <h3 className="mx-2">{t("employerMyProfile.myProfile")}</h3>
                </div>

                <div className="myProfileEmployerBody mx-3">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card cardOne">
                        <div className="card-title">
                          <h4>{t("employerMyProfile.yourProfile")}</h4>
                          <p className="text-muted">
                            {t("employerMyProfile.joined")}:{" "}
                            {profileData.created}
                          </p>
                        </div>
                        <div className="">
                          <div className="profileImageBox">
                            <img
                              className="profileImage"
                              src={profileData.company_logo}
                              alt=""
                            />
                          </div>
                          <div className="nameSection">
                            <p>
                              {profileData.first_name} {profileData.last_name}
                            </p>
                            <Link
                              to="/user/editprofile"
                              className="cardOneEditButton"
                            >
                              <i class="fa-solid fa-pen-to-square"></i>{" "}
                              {t("employerMyProfile.edit")}
                            </Link>
                          </div>
                          <p className="text-muted">
                            {t("employerMyProfile.contact")}:{" "}
                            {profileData.contact}
                          </p>
                        </div>
                      </div>
                      <div className="card cardTwo">
                        <div className="card-title">
                          <h4>{t("employerMyProfile.emailAddress")}</h4>
                        </div>

                        <div className="primaryButton">
                          <button className="cardTwoPrimaryButton">
                            {t("employerMyProfile.primary")}
                          </button>
                        </div>
                        <div className="nameSection">
                          <p className="">{profileData.email_address}</p>

                          <Link
                            to="/user/editprofile"
                            className="cardTwoChangeButton"
                          >
                            <i class="fa-solid fa-pen-to-square"></i>{" "}
                            {t("employerMyProfile.changeEmail")}
                          </Link>
                        </div>
                      </div>
                      <div className="card cardThree">
                        <div className="card-title">
                          <h4>{t("employerMyProfile.phoneNumber")}</h4>
                        </div>
                        <div className="primaryButton">
                          <button className="cardTwoPrimaryButton">
                            {t("employerMyProfile.primary")}
                          </button>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            {t("employerMyProfile.contactNumber")}:
                          </div>
                          <div className="col-md-6 text-muted">
                            {profileData.contact}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            {t("employerMyProfile.companyContactNumber")}:
                          </div>
                          <div className="col-md-6 text-muted">
                            {profileData.company_contact}
                          </div>
                        </div>
                        <div className="nameSection">
                          <Link
                            to="/user/editprofile"
                            className="cardThreeChangeButton"
                          >
                            <i class="fa-solid fa-pen-to-square"></i>{" "}
                            {t("employerMyProfile.changeContactNumber")}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card cardFour">
                        <div className="card-title">
                          <h4>{t("employerMyProfile.address")}</h4>
                        </div>
                        <div className="primaryButton">
                          <button className="cardTwoPrimaryButton">
                            {t("employerMyProfile.primary")}
                          </button>
                        </div>

                        <div className="row">
                          <div className="col-md-4">
                            <p>{t("employerMyProfile.address")}:</p>
                          </div>
                          <div className="col-md-8">
                            <p className="text-muted">{profileData.address}</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-4">
                            <p>{t("employerMyProfile.location")}:</p>
                          </div>
                          <div className="col-md-8">
                            <p className="text-muted">{profileData.location}</p>
                          </div>
                        </div>
                        <div className="nameSection">
                          <Link
                            to="/user/editprofile"
                            className="cardThreeChangeButton"
                          >
                            <i class="fa-solid fa-pen-to-square"></i>{" "}
                            {t("employerMyProfile.changeAddress")}
                          </Link>
                        </div>
                      </div>
                      <div className="card cardFive">
                        <div className="card-title">
                          <h4>{t("employerMyProfile.otherDetails")}</h4>
                        </div>

                        <div className="row">
                          <div className="col-md-4">
                            {t("employerMyProfile.position")}:
                          </div>
                          <div className="col-md-8 text-muted">
                            {profileData.position}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-4">
                            {t("employerMyProfile.companyName")}:
                          </div>
                          <div className="col-md-8 text-muted">
                            {profileData.company_name}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-4">
                            {t("employerMyProfile.aboutCompany")}:
                          </div>
                          <div className="col-md-8 text-muted">
                            {profileData.company_about &&
                              HTMLReactParser(profileData.company_about)}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-4">
                            {t("employerMyProfile.url")}
                          </div>
                          <div className="col-md-8 text-muted">
                            {profileData.url}
                          </div>
                        </div>
                        <div className="nameSection">
                          <Link
                            to="/plans/purchase"
                            className="cardThreeChangeButton"
                          >
                            <i class="fa-solid fa-pen-to-square"></i>{" "}
                            {t("employerMyProfile.changeDetails")}
                          </Link>
                        </div>
                      </div>
                      <div className="card cardSix">
                        <div className="card-title">
                          <h4>{t("employerMyProfile.availablePlanDetails")}</h4>
                        </div>
                        {profileData.is_plan_active === 1 ? (
                          <>
                            <div className="planNameBox">
                              <ul className="">
                                <li className="list1">
                                  {t("employerMyProfile.planName")}:{" "}
                                  <span className="text-muted">
                                    {profileData.plan_name}
                                  </span>
                                </li>
                                <li className="list2">
                                  {" "}
                                  <Link
                                    to="/plans/purchase"
                                    className="changePlanButton"
                                  >
                                    <i class="fa-solid fa-pen-to-square"></i>{" "}
                                    {t("employerMyProfile.changePlan")}
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="planDetailBox">
                              <h5>
                                {t("employerMyProfile.availableFeatures")}
                              </h5>
                              <div className="featuresDescription">
                                <div className="row">
                                  <div className="col-8">
                                    <p>{t("employerMyProfile.noJobPost")}:</p>
                                    <p>
                                      {t("employerMyProfile.noResumeDownload")}:
                                    </p>
                                    <p>
                                      {t("employerMyProfile.noCandidateView")}:
                                    </p>

                                    <p>
                                      {t(
                                        "employerMyProfile.accessCandidateSearch"
                                      )}
                                      :
                                    </p>
                                  </div>
                                  <div className="col-4">
                                    <p className="text-muted">
                                      {profileData.AvailbleplanFeature
                                        .availableJobpost === "1000000"
                                        ? "Unlimited"
                                        : profileData.AvailbleplanFeature
                                            .availableJobpost}
                                    </p>
                                    <p className="text-muted">
                                      {profileData.AvailbleplanFeature
                                        .availableDownloadCount === "1000000"
                                        ? "Unlimited"
                                        : profileData.AvailbleplanFeature
                                            .availableDownloadCount}
                                    </p>
                                    <p className="text-muted">
                                      {profileData.AvailbleplanFeature
                                        .availableProfileView === "1000000"
                                        ? "Unlimited"
                                        : profileData.AvailbleplanFeature
                                            .availableProfileView}
                                    </p>
                                    <p className="text-muted">
                                      {profileData.AvailbleplanFeature
                                        .searchCandidate
                                        ? profileData.AvailbleplanFeature
                                            .searchCandidate
                                        : "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="noPlanAvl">
                              <p>{t("employerMyProfile.noPlanAvailable")}</p>
                              <Link
                                to="/plans/purchase"
                                className="cardThreeChangeButton noPlanAvlLink"
                              >
                                <i class="fa-solid fa-pen-to-square"></i>{" "}
                                {t("employerMyProfile.buyPlan")}
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* <form>
                  <div className="mb-5 mt-5">
                    <div className="form-outline mb-4 DashBoardInputBx">
                      <label className="form-label" htmlFor="form3Example1">
                        Email Address
                      </label>
                      <input
                        type="text"
                        id="form3Example1"
                        className="form-control"
                        placeholder="Email Address"
                        value={profileData.email_address}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="form-outline mb-5 DashBoardInputBx">
                    <label className="form-label" htmlFor="form3Example3">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="form3Example3"
                      className="form-control"
                      placeholder="Company Name"
                      value={profileData.company_name}
                      disabled
                    />
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx">
                    <label className="form-label" htmlFor="form3Example3">
                      Position
                    </label>
                    <input
                      type="text"
                      id="form3Example3"
                      className="form-control"
                      placeholder="Position"
                      value={profileData.position}
                      disabled
                    />
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx">
                    <label className="form-label" htmlFor="form3Example3">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="form3Example3"
                      className="form-control"
                      placeholder="First Name"
                      value={profileData.first_name}
                      disabled
                    />
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx">
                    <label className="form-label" htmlFor="form3Example3">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="form3Example3"
                      className="form-control"
                      placeholder="Last Name"
                      value={profileData.last_name}
                      disabled
                    />
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx">
                    <label className="form-label" htmlFor="form3Example3">
                      Address
                    </label>
                    <input
                      type="text"
                      id="form3Example3"
                      className="form-control"
                      placeholder="Address"
                      value={profileData.address}
                      disabled
                    />
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx">
                    <label className="form-label" htmlFor="form3Example3">
                      Location
                    </label>
                    <input
                      type="text"
                      id="form3Example3"
                      className="form-control"
                      placeholder="Location"
                      value={profileData.location}
                      disabled
                    />
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx">
                    <label className="form-label" htmlFor="form3Example3">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      id="form3Example3"
                      className="form-control"
                      placeholder="Contact Number"
                      value={profileData.contact}
                      disabled
                    />
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx">
                    <label className="form-label" htmlFor="form3Example3">
                      Company Contact Number
                    </label>
                    <input
                      type="text"
                      id="form3Example3"
                      className="form-control"
                      placeholder="Company Contact Number"
                      value={profileData.company_contact}
                      disabled
                    />
                  </div>
                  <div className="form-outline mb-5 DashBoardInputBx">
                    <label className="form-label" for="form3Example3">
                      Current Plan
                    </label>
                    <div className="ChoosPlanBx">
                      <span>Super Free </span>
                      <Link
                        to="/plans/purchase"
                        type="button"
                        className="btn btn-primary button1"
                        style={{
                          backgroundColor: hoverPlanColor
                            ? secondaryColor
                            : primaryColor,
                          border: hoverPlanColor
                            ? secondaryColor
                            : primaryColor,
                        }}
                        onMouseEnter={handlePlanMouseEnter}
                        onMouseLeave={handlePlanMouseLeave}
                      >
                        CHOOSE PLAN
                      </Link>
                    </div>
                  </div>
                  {profileData.is_plan_active === 1 &&
                    profileData.AvailbleplanFeature && (
                      <div className="form-outline mb-5 DashBoardInputBx">
                        <label className="form-label" for="form3Example3">
                          Available Plan Features
                        </label>
                        <div className="AvailablePlanBx">
                          <span>
                            {profileData.AvailbleplanFeature
                              .availableDownloadCount != null && (
                              <p>
                                <span className="availablePlanFeaturesKey">
                                  Resume Download:{" "}
                                </span>
                                {profileData.AvailbleplanFeature
                                  .availableDownloadCount === "1000000"
                                  ? "Unlimited"
                                  : profileData.AvailbleplanFeature
                                      .availableDownloadCount}
                              </p>
                            )}

                            {profileData.AvailbleplanFeature
                              .availableJobpost != null && (
                              <p>
                                <span className="availablePlanFeaturesKey">
                                  Job Post:{" "}
                                </span>
                                {profileData.AvailbleplanFeature
                                  .availableJobpost === "1000000"
                                  ? "Unlimited"
                                  : profileData.AvailbleplanFeature
                                      .availableJobpost}
                              </p>
                            )}
                            {profileData.AvailbleplanFeature
                              .availableProfileView != null && (
                              <p>
                                <span className="availablePlanFeaturesKey">
                                  Profile View:{" "}
                                </span>
                                {profileData.AvailbleplanFeature
                                  .availableProfileView === "1000000"
                                  ? "Unlimited"
                                  : profileData.AvailbleplanFeature
                                      .availableProfileView}
                              </p>
                            )}
                            {profileData.AvailbleplanFeature
                              .searchCandidate && (
                              <p>
                                <span className="availablePlanFeaturesKey">
                                  Search Candidate:{" "}
                                </span>
                                {
                                  profileData.AvailbleplanFeature
                                    .searchCandidate
                                }
                              </p>
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                </form> */}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyProfileNew;
