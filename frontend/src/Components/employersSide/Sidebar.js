import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const tokenKey = Cookies.get("tokenClient");
  const navigate = useNavigate();
  const [t, i18n] = useTranslation("global");

  const [isQuickLinksVisible, setIsQuickLinksVisible] = useState(false);
  const [isDashboardLinksVisible, setIsDashboardLinksVisible] = useState(false);

  const toggle1 = () => {
    setIsQuickLinksVisible(!isQuickLinksVisible);
  };
  const toggle2 = () => {
    setIsDashboardLinksVisible(!isDashboardLinksVisible);
  };

  useEffect(() => {
    // const handleWindowResize = () => {
    //   if (window.innerWidth < 768) {
    //     setIsQuickLinksVisible(false);
    //     setIsDashboardLinksVisible(false);
    //   } else {
    //     setIsQuickLinksVisible(false);
    //     setIsDashboardLinksVisible(true);
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
        title: t("employerSidebar.confirmTitle"),
        text: t("employerSidebar.confirmTxt"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("employerSidebar.yes"),
        cancelButtonText: t("employerSidebar.no"),
      });
      if (confirmationResult.isConfirmed) {
        const response = await axios.post(BaseApi + "/users/logout", null, {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            token: tokenKey,
          },
        });
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        // sessionStorage.clear();
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
          title: t("employerSidebar.successTitle"),
        });
      }
    } catch (error) {
      Swal.fire({
        title: t("employerSidebar.failedTitle"),
        icon: "error",
        confirmButtonText: t("employerSidebar.close"),
      });
      console.log("Cannot logout!");
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
    } catch (error) {
      Swal.fire({
        title: "Could not delete account!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Cannot delete account!");
    }
  };
  return (
    <>
      {screenWidth > 768 ? (
        <>
          <div className="SidebarSection1 pe-4">
            <div className="SBHeader">
              <h3>{t("employerSidebar.quickLinks")}</h3>
              <hr style={{ border: "1px solid rgb(211 209 209)" }} />
            </div>
            <div className="SBBody">
              <Link to="/user/createjob" className="bodyItem SidebarCreatJob">
                <div className="SidebarImages SidebarCreatJobBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon1color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">{t("employerSidebar.createJob")}</div>
              </Link>
              <Link to="/user/managejob" className="bodyItem SidebarManageJob">
                <div className="SidebarImages SidebarManageJobBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon2color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">{t("employerSidebar.manageJobs")}</div>
              </Link>
              <Link
                to="/user/paymenthistory"
                className="bodyItem SidebarPaymentJob"
              >
                <div className="SidebarImages SidebarPaymentJobBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon3color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">{t("employerSidebar.paymentHistory")}</div>
              </Link>
              <Link
                to="/user/favouritelist"
                className="bodyItem SidebarFavouriteJob"
              >
                <div className="SidebarImages SidebarFavouriteJobBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon4color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">{t("employerSidebar.favouriteList")}</div>
              </Link>
              <Link
                to="/user/importjobseekers"
                className="bodyItem SidebarImportJob"
              >
                <div className="SidebarImages SidebarImportJobBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon5color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">{t("employerSidebar.importJobseekers")}</div>
              </Link>
            </div>
          </div>
          <div className="SidebarSection2 pe-4">
            <div className="SBHeader mt-5">
              <h3>{t("employerSidebar.myDashboard")}</h3>
              <hr style={{ border: "1px solid rgb(211 209 209)" }} />
            </div>
            <div className="body">
              <Link
                to="/user/mailhistory"
                className="bodyItem SidebarMailHistory"
              >
                <div className="SidebarImages SidebarMailHistoryBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon6color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">{t("employerSidebar.mailHistory")}</div>
              </Link>
              <Link to="/user/myprofile" className="bodyItem SidebarMyProfile">
                <div className="SidebarImages SidebarMyProfileBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon7color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">{t("employerSidebar.myProfile")}</div>
              </Link>
              <Link
                to="/user/editprofile"
                className="bodyItem SidebarEditProfile"
              >
                <div className="SidebarImages SidebarEditProfileBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon8color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">{t("employerSidebar.editProfile")}</div>
              </Link>
              <Link
                to="/user/changepassword"
                className="bodyItem SidebarChangePass"
              >
                <div className="SidebarImages SidebarChangePassBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon9color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">{t("employerSidebar.changePassword")}</div>
              </Link>
              <Link
                to="/user/changelogo"
                className="bodyItem SidebarChangeLogo"
              >
                <div className="SidebarImages SidebarChangeLogoBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon10color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">{t("employerSidebar.changeLogo")}</div>
              </Link>
              <Link className="bodyItem SidebarLogOut">
                <div className="SidebarImages SidebarLogOutBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon11color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle" onClick={handleLogOut}>
                {t("employerSidebar.logout")}
                </div>
              </Link>
              <Link to="/user/deleteaccount" className="bodyItem SidebarDeleteAcc">
                <div className="SidebarImages SidebarDeleteAccBg">
                  <img
                    className=""
                    src="/Images/employerSide/icon12color.png"
                    alt=""
                  />
                </div>
                <div className="menuTitle">{t("employerSidebar.deleteAccount")}</div>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="SidebarSection1 pe-4">
            <div className="SBHeader">
              <div className="sidebarEachHeader">
                <h3>{t("employerSidebar.quickLinks")}</h3>
                <Link className="sidebarPlusLink" onClick={toggle1}>
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
                  <Link
                    to="/user/createjob"
                    className="bodyItem SidebarCreatJob"
                  >
                    <div className="SidebarImages SidebarCreatJobBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon1color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("employerSidebar.createJob")}</div>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/managejob"
                    className="bodyItem SidebarManageJob"
                  >
                    <div className="SidebarImages SidebarManageJobBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon2color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("employerSidebar.manageJobs")}</div>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/paymenthistory"
                    className="bodyItem SidebarPaymentJob"
                  >
                    <div className="SidebarImages SidebarPaymentJobBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon3color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("employerSidebar.paymentHistory")}</div>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/favouritelist"
                    className="bodyItem SidebarFavouriteJob"
                  >
                    <div className="SidebarImages SidebarFavouriteJobBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon4color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("employerSidebar.favouriteList")}</div>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/importjobseekers"
                    className="bodyItem SidebarImportJob"
                  >
                    <div className="SidebarImages SidebarImportJobBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon5color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("employerSidebar.importJobseekers")}</div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="SidebarSection2 pe-4">
            <div className="SBHeader mt-3">
              <div className="sidebarEachHeader">
                <h3>{t("employerSidebar.myDashboard")}</h3>
                <Link className="sidebarPlusLink" onClick={toggle2}>
                  {isDashboardLinksVisible ? (
                    <i class="fa-solid fa-circle-minus"></i>
                  ) : (
                    <i class="fa-solid fa-circle-plus"></i>
                  )}
                </Link>
              </div>
              <hr style={{ border: "1px solid rgb(211 209 209)" }} />
            </div>
            <div className={`SBBody ${isDashboardLinksVisible ? "open" : ""}`}>
              <ul
                style={{
                  display: isDashboardLinksVisible ? "block" : "none",
                }}
              >
                <li>
                  <Link
                    to="/user/mailhistory"
                    className="bodyItem SidebarMailHistory"
                  >
                    <div className="SidebarImages SidebarMailHistoryBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon6color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("employerSidebar.mailHistory")}</div>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/myprofile"
                    className="bodyItem SidebarMyProfile"
                  >
                    <div className="SidebarImages SidebarMyProfileBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon7color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("employerSidebar.myProfile")}</div>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/editprofile"
                    className="bodyItem SidebarEditProfile"
                  >
                    <div className="SidebarImages SidebarEditProfileBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon8color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("employerSidebar.editProfile")}</div>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/changepassword"
                    className="bodyItem SidebarChangePass"
                  >
                    <div className="SidebarImages SidebarChangePassBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon9color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("employerSidebar.changePassword")}</div>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/changelogo"
                    className="bodyItem SidebarChangeLogo"
                  >
                    <div className="SidebarImages SidebarChangeLogoBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon10color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">{t("employerSidebar.changeLogo")}</div>
                  </Link>
                </li>
                <li>
                  <Link className="bodyItem SidebarLogOut">
                    <div className="SidebarImages SidebarLogOutBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon11color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle" onClick={handleLogOut}>
                    {t("employerSidebar.logout")}
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/user/deleteaccount" className="bodyItem SidebarDeleteAcc">
                    <div className="SidebarImages SidebarDeleteAccBg">
                      <img
                        className=""
                        src="/Images/employerSide/icon12color.png"
                        alt=""
                      />
                    </div>
                    <div className="menuTitle">
                    {t("employerSidebar.deleteAccount")}
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
