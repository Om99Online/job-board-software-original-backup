import React, { useEffect, useState } from "react";
import NavBar from "../element/NavBar";
import Sidebar from "./Sidebar";
import Footer from "../element/Footer";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const MyProfile = () => {
  const [profileData, setProfileData] = useState([]);
  const [profilePage, setProfilePage] = useState([]);
  const [loading, setLoading] = useState(false);
  // const tokenKey = sessionStorage.getItem("token");
  const navigate = useNavigate();
  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");

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
      setProfileData(response.data.response);
      setProfilePage(response.data);
      console.log(profilePage);
    } catch (error) {
      setLoading(false);
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
                  <h3 className="mx-2">My Profile</h3>
                </div>

                <form>
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
                </form>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyProfile;
