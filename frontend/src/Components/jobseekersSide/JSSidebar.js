import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const JSSidebar = () => {
  // const [isActive, setIsActive] = useState(false);

  const tokenKey = Cookies.get("tokenClient");
  const navigate = useNavigate();

  const [isMyprofileLinksVisible, setIsMyprofileLinksVisible] = useState(false);
  const [isQuickLinksVisible, setIsQuickLinksVisible] = useState(false);
  const [isSettingLinksVisible, setIsSettingLinksVisible] = useState(false);

  const toggle1 = () => {
    setIsMyprofileLinksVisible(!isMyprofileLinksVisible);
  };
  const toggle2 = () => {
    setIsQuickLinksVisible(!isQuickLinksVisible);
  };
  const toggle3 = () => {
    setIsSettingLinksVisible(!isSettingLinksVisible);
  };
  const [t, i18n] = useTranslation("global");

  useEffect(() => {
    // const handleWindowResize = () => {
    //   if (window.innerWidth < 768) {
    //     setIsQuickLinksVisible(false);
    //     setIsMyprofileLinksVisible(false);
    //     setIsSettingLinksVisible(false);
    //   } else {
    //     setIsQuickLinksVisible(false);
    //     setIsMyprofileLinksVisible(false);
    //     setIsSettingLinksVisible(true);
    //   }
    // };

    const handleWindowResize = () => {
      if (window.innerWidth > 768) {
        // Reload the page when the screen size is less than 768
        window.location.reload();
      }
    };

    // Call the function on component mount
    // handleWindowResize();

    // Attach event listener for window resize
    window.addEventListener("resize", handleWindowResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  let screenWidth = window.innerWidth;

  const handleLogOut = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: t("jobseekerSidebar.confirmTitle"),
        text: t("jobseekerSidebar.confirmTxt"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("jobseekerSidebar.yes"),
        cancelButtonText: t("jobseekerSidebar.no"),
      });
      if (confirmationResult.isConfirmed) {
        const response = await axios.post(BaseApi + "/users/logout", null, {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            token: tokenKey,
          },
        });

        // sessionStorage.clear();
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
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
          icon: "success",
          title: t("jobseekerSidebar.successTitle"),
        });
      }
    } catch (error) {
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
        title: t("jobseekerSidebar.failedTitle"),
        icon: "error",
        confirmButtonText: t("jobseekerSidebar.close"),
      });
      console.log("Cannot log out!");
    }
  };

  const handleDeleteAc = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Delete Account",
        text: "Do you want to delete this account?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        const response = await axios.post(
          BaseApi + "/users/deleteAccount",
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
          sessionStorage.clear();
          navigate("/");
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
            icon: "success",
            title: "Account deleted successfully!",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Could not delete account!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Cannot delete account!");
    }
  };

  // const handleButtonClick = () => {
  //   setIsActive(true); // Set the active state to true on button click
  //   console.log("");
  // };
  return (
    <>
      {screenWidth > 768 ? (
        <>
          <div className="SidebarSection1 pe-4">
            <div className="SBHeader">
              <h3>{t("jobseekerSidebar.myProfile")}</h3>
              <hr style={{ border: "1px solid rgb(211 209 209)" }} />
            </div>
            <div className="SBBody">
              <NavLink
                to="/candidates/myaccount"
                className="bodyItem SidebarCreatJob"
              >
                <div className="SidebarImages SidebarCreatJobBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon7color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">
                  {" "}
                  {t("jobseekerSidebar.myProfile")}
                </div>
              </NavLink>
              <NavLink
                to="/candidates/editprofile"
                className="bodyItem SidebarManageJob"
              >
                <div className="SidebarImages SidebarManageJobBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon8color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">
                  {t("jobseekerSidebar.editProfile")}
                </div>
              </NavLink>
              <NavLink
                to="/candidates/editEducation"
                className="bodyItem SidebarPaymentJob"
              >
                <div className="SidebarImages SidebarPaymentJobBg">
                  <img
                    className=""
                    src="/Images/jobseekerSide/Education-black.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">
                  {" "}
                  {t("jobseekerSidebar.education")}
                </div>
              </NavLink>
              <NavLink
                to="/candidates/editExperience"
                className="bodyItem SidebarFavouriteJob"
              >
                <div className="SidebarImages SidebarFavouriteJobBg">
                  <img
                    className=""
                    src="/Images/jobseekerSide/Experience-Black.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">
                  {t("jobseekerSidebar.experience")}
                </div>
              </NavLink>
              <NavLink
                to="/candidates/editProfessional"
                className="bodyItem SidebarImportJob"
              >
                <div className="SidebarImages SidebarImportJobBg">
                  <img
                    className=""
                    src="/Images/jobseekerSide/Professional-Registration-Black.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">
                  {t("jobseekerSidebar.professionalRegistration")}
                </div>
              </NavLink>
              <NavLink
                to="/candidates/addvideocv"
                className="bodyItem SidebarMailHistory"
              >
                <div className="SidebarImages SidebarMailHistoryBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon5color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">{t("jobseekerSidebar.videoCV")}</div>
              </NavLink>
              <NavLink
                to="/candidates/makecv"
                className="bodyItem SidebarChangeLogo"
              >
                <div className="SidebarImages SidebarChangeLogoBg">
                  <img
                    className=""
                    src="/Images/jobseekerSide/Make-A-CV-black.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">{t("jobseekerSidebar.makeCV")}</div>
              </NavLink>
              <NavLink
                to="/candidates/addcvdocuments"
                className="bodyItem SidebarChangeLogo"
              >
                <div className="SidebarImages SidebarChangeLogoBg">
                  <img
                    className=""
                    src="/Images/jobseekerSide/Make-A-CV-black.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">
                  {t("jobseekerSidebar.addCvDocuments")}
                </div>
              </NavLink>
            </div>
          </div>
          <div className="SidebarSection2 pe-4">
            <div className="SBHeader mt-3">
              <h3>{t("jobseekerSidebar.quickLinks")}</h3>
              <hr style={{ border: "1px solid rgb(211 209 209)" }} />
            </div>
            <div className="body">
              <NavLink
                to="/payments/history"
                activeClassName="active"
                className="bodyItem SidebarPaymentJob"
              >
                <div className="SidebarImages SidebarPaymentJobBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon3color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">
                  {t("jobseekerSidebar.paymentHistory")}
                </div>
              </NavLink>
              <NavLink
                to="/alerts/index"
                className="bodyItem SidebarMyProfile"
                activeClassName="active"
              >
                <div className="SidebarImages SidebarMyProfileBg">
                  <img
                    className=""
                    src="/Images/jobseekerSide/Manage-Alerts.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">
                  {t("jobseekerSidebar.manageAlerts")}
                </div>
              </NavLink>
              <NavLink
                to="/jobs/savedjobs"
                activeClassName="active"
                className="bodyItem SidebarFavouriteJob"
              >
                <div className="SidebarImages SidebarFavouriteJobBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon4color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">
                  {t("jobseekerSidebar.savedJobs")}
                </div>
              </NavLink>
              <NavLink
                to="/jobs/applied"
                activeClassName="active"
                className="bodyItem SidebarChangePass"
              >
                <div className="SidebarImages SidebarChangePassBg">
                  <img
                    className=""
                    src="/Images/jobseekerSide/Applied-Jobs-black.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">
                  {" "}
                  {t("jobseekerSidebar.appliedJobs")}
                </div>
              </NavLink>
              <NavLink
                to="/searchjob"
                activeClassName="Active"
                className="bodyItem SidebarChangeLogo"
              >
                <div className="SidebarImages SidebarChangeLogoBg">
                  <img
                    className=""
                    src="/Images/jobseekerSide/search-icon.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">{t("jobseekerSidebar.searchJobs")}</div>
              </NavLink>
            </div>
          </div>
          <div className="SidebarSection3 pe-4">
            <div className="SBHeader mt-3">
              <h3 className="text-black">{t("jobseekerSidebar.setting")}</h3>
              <hr style={{ border: "1px solid rgb(211 209 209)" }} />
            </div>
            <div className="body">
              <NavLink
                to="/candidates/mailhistory"
                activeClassName="Active"
                className="bodyItem SidebarMailHistory"
              >
                <div className="SidebarImages SidebarMailHistoryBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon6color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">{t("jobseekerSidebar.mailHistory")}</div>
              </NavLink>
              <NavLink
                to="/candidates/changepassword"
                activeClassName="Active"
                className="bodyItem SidebarChangePass"
              >
                <div className="SidebarImages SidebarChangePassBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon9color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">{t("jobseekerSidebar.changePassword")}</div>
              </NavLink>
              <NavLink
                to="/candidates/uploadPhoto"
                activeClassName="active"
                className="bodyItem SidebarChangeLogo"
              >
                <div className="SidebarImages SidebarChangeLogoBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon10color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">{t("jobseekerSidebar.changePhoto")}</div>
              </NavLink>
              <NavLink
                to=""
                activeClassName="active"
                className="bodyItem SidebarImportJob"
              >
                <div className="SidebarImages SidebarImportJobBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon11color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle" onClick={handleLogOut}>
                {t("jobseekerSidebar.logOut")}
                </div>
              </NavLink>
              <NavLink
                to="/candidates/deleteAccount"
                activeClassName="Active"
                className="bodyItem SidebarEditProfile"
              >
                <div className="SidebarImages SidebarEditProfileBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon12color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">{t("jobseekerSidebar.deleteAccount")}</div>
              </NavLink>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="SidebarSection1 mt-3 pe-4">
            <div className="SBHeader">
              <div className="sidebarEachHeader">
                <h3>{t("jobseekerSidebar.myProfile")}</h3>
                <Link className="sidebarPlusLink" onClick={toggle1}>
                  {isMyprofileLinksVisible ? (
                    <i class="fa-solid fa-circle-minus"></i>
                  ) : (
                    <i class="fa-solid fa-circle-plus"></i>
                  )}
                </Link>
              </div>

              <hr style={{ border: "1px solid rgb(211 209 209)" }} />
            </div>
            <div className={`SBBody ${isMyprofileLinksVisible ? "open" : ""}`}>
              <ul
                style={{
                  display: isMyprofileLinksVisible ? "block" : "none",
                }}
              >
                <li>
                  <NavLink
                    to="/candidates/myaccount"
                    className="bodyItem SidebarCreatJob"
                  >
                    <div className="SidebarImages SidebarCreatJobBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon7color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("jobseekerSidebar.myProfile")}</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/candidates/editprofile"
                    className="bodyItem SidebarManageJob"
                  >
                    <div className="SidebarImages SidebarManageJobBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon8color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("jobseekerSidebar.editProfile")}</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/candidates/editEducation"
                    className="bodyItem SidebarPaymentJob"
                  >
                    <div className="SidebarImages SidebarPaymentJobBg">
                      <img
                        className=""
                        src="/Images/jobseekerSide/Education-black.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("jobseekerSidebar.education")}</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/candidates/editExperience"
                    className="bodyItem SidebarFavouriteJob"
                  >
                    <div className="SidebarImages SidebarFavouriteJobBg">
                      <img
                        className=""
                        src="/Images/jobseekerSide/Experience-Black.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("jobseekerSidebar.experience")}</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/candidates/editProfessional"
                    className="bodyItem SidebarImportJob"
                  >
                    <div className="SidebarImages SidebarImportJobBg">
                      <img
                        className=""
                        src="/Images/jobseekerSide/Professional-Registration-Black.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("jobseekerSidebar.professionalRegistration")}</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/candidates/addvideocv"
                    className="bodyItem SidebarMailHistory"
                  >
                    <div className="SidebarImages SidebarMailHistoryBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon5color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("jobseekerSidebar.videoCV")}</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/candidates/makecv"
                    className="bodyItem SidebarChangeLogo"
                  >
                    <div className="SidebarImages SidebarChangeLogoBg">
                      <img
                        className=""
                        src="/Images/jobseekerSide/Make-A-CV-black.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("jobseekerSidebar.makeCV")}</div>
                  </NavLink>
                  <NavLink
                    to="/candidates/addcvdocuments"
                    className="bodyItem SidebarChangeLogo sidebarSection1"
                  >
                    <div className="SidebarImages backgroundImagesItem1">
                      <img
                        className=""
                        src="/Images/jobseekerSide/Make-A-CV-black.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">
                    {t("jobseekerSidebar.addCvDocuments")}
                    </div>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
          <div className="SidebarSection2 pe-4">
            <div className="SBHeader mt-3">
              <div className="sidebarEachHeader">
                <h3>{t("jobseekerSidebar.quickLinks")}</h3>
                <Link className="sidebarPlusLink" onClick={toggle2}>
                  {isQuickLinksVisible ? (
                    <i class="fa-solid fa-circle-minus"></i>
                  ) : (
                    <i class="fa-solid fa-circle-plus"></i>
                  )}
                </Link>
              </div>
              <hr style={{ border: "1px solid rgb(211 209 209)" }} />
            </div>
            <div className={`SBBody ${isQuickLinksVisible ? "open" : ""}`}>
              <ul
                style={{
                  display: isQuickLinksVisible ? "block" : "none",
                }}
              >
                <li>
                  <NavLink
                    to="/payments/history"
                    activeClassName="active"
                    className="bodyItem SidebarPaymentJob"
                  >
                    <div className="SidebarImages SidebarPaymentJobBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon3color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("jobseekerSidebar.paymentHistory")}</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/alerts/index"
                    className="bodyItem SidebarMyProfile"
                    activeClassName="active"
                  >
                    <div className="SidebarImages SidebarMyProfileBg">
                      <img
                        className=""
                        src="/Images/jobseekerSide/Manage-Alerts.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("jobseekerSidebar.manageAlerts")}</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/jobs/savedjobs"
                    activeClassName="active"
                    className="bodyItem SidebarFavouriteJob"
                  >
                    <div className="SidebarImages SidebarFavouriteJobBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon4color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("jobseekerSidebar.savedJobs")}</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/jobs/applied"
                    activeClassName="active"
                    className="bodyItem SidebarChangePass"
                  >
                    <div className="SidebarImages SidebarChangePassBg">
                      <img
                        className=""
                        src="/Images/jobseekerSide/Applied-Jobs-black.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("jobseekerSidebar.appliedJobs")}</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/searchjob"
                    activeClassName="Active"
                    className="bodyItem SidebarChangeLogo"
                  >
                    <div className="SidebarImages SidebarChangeLogoBg">
                      <img
                        className=""
                        src="/Images/jobseekerSide/search-icon.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("jobseekerSidebar.searchJobs")}</div>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
          <div className="SidebarSection3 pe-4">
            <div className="SBHeader mt-3">
              <div className="sidebarEachHeader">
                <h3 className="text-black">Setting</h3>
                <Link className="sidebarPlusLink" onClick={toggle3}>
                  {isSettingLinksVisible ? (
                    <i class="fa-solid fa-circle-minus"></i>
                  ) : (
                    <i class="fa-solid fa-circle-plus"></i>
                  )}
                </Link>
              </div>
              <hr style={{ border: "1px solid rgb(211 209 209)" }} />
            </div>
            <div className={`SBBody ${isSettingLinksVisible ? "open" : ""}`}>
              <ul
                style={{
                  display: isSettingLinksVisible ? "block" : "none",
                }}
              >
                <li>
                  <NavLink
                    to="/candidates/mailhistory"
                    activeClassName="Active"
                    className="bodyItem SidebarMailHistory"
                  >
                    <div className="SidebarImages SidebarMailHistoryBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon6color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("jobseekerSidebar.mailHistory")}</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/candidates/changepassword"
                    activeClassName="Active"
                    className="bodyItem SidebarChangePass"
                  >
                    <div className="SidebarImages SidebarChangePassBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon9color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("jobseekerSidebar.changePassword")}</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/candidates/uploadPhoto"
                    activeClassName="active"
                    className="bodyItem SidebarChangeLogo"
                  >
                    <div className="SidebarImages SidebarChangeLogoBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon10color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("jobseekerSidebar.changePhoto")}</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to=""
                    activeClassName="active"
                    className="bodyItem SidebarImportJob"
                  >
                    <div className="SidebarImages SidebarImportJobBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon11color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle" onClick={handleLogOut}>
                    {t("jobseekerSidebar.logOut")}
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to=""
                    activeClassName="Active"
                    className="bodyItem SidebarEditProfile"
                  >
                    <div className="SidebarImages SidebarEditProfileBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon12color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">
                    {t("jobseekerSidebar.deleteAccount")}
                    </div>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default JSSidebar;
