import React, { useState, useEffect } from "react";
// import { SidebarData } from "./SidebarData";
import DashboardIcon from "@mui/icons-material/Dashboard";
// import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import BadgeIcon from "@mui/icons-material/Badge";
import CategoryIcon from "@mui/icons-material/Category";
// import { Cookie, Dashboard } from "@mui/icons-material";
import { NavLink, useLocation, useParams } from "react-router-dom";
import PermDataSettingIcon from "@mui/icons-material/PermDataSetting";
import GroupIcon from "@mui/icons-material/Group";
import AbcIcon from "@mui/icons-material/Abc";
import AddchartIcon from "@mui/icons-material/Addchart";
// import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import PaymentIcon from "@mui/icons-material/Payment";
import PaidIcon from "@mui/icons-material/Paid";
import UnsubscribeIcon from "@mui/icons-material/Unsubscribe";
import FeaturedVideoIcon from "@mui/icons-material/FeaturedVideo";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MonitorIcon from "@mui/icons-material/Monitor";
import EmailIcon from "@mui/icons-material/Email";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import CampaignIcon from "@mui/icons-material/Campaign";
import SchoolIcon from "@mui/icons-material/School";
import RateReviewIcon from "@mui/icons-material/RateReview";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Cookies from "js-cookie";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const APSidebar = () => {
  // const [userCheck, setUserCheck] = useState();
  const [showConfigurationDropdown, setShowConfigurationDropdown] =
    useState(false);
  const [showSettingDropdown, setShowSettingDropdown] = useState(false);
  const [showEmployerDropdown, setShowEmployerDropdown] = useState(false);
  const [showJobseekerDropdown, setShowJobseekerDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showSwearwordsDropdown, setShowSwearwordsDropdown] = useState(false);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [showDesignationsDropdown, setShowDesignationsDropdown] =
    useState(false);
  const [showJobsDropdown, setShowJobsDropdown] = useState(false);
  const [showPaymentHistoryDropdown, setShowPaymentHistoryDropdown] =
    useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showNewsletterDropdown, setShowNewsletterDropdown] = useState(false);
  const [showBannerAdvertisementDropdown, setShowBannerAdvertisementDropdown] =
    useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showContentDropdown, setShowContentDropdown] = useState(false);
  const [showEmailTemplateDropdown, setShowEmailTemplateDropdown] =
    useState(false);
  const [showBlogsDropdown, setShowBlogsDropdown] = useState(false);
  const [showSlidersDropdown, setShowSlidersDropdown] = useState(false);
  const [showAnnouncementDropdown, setShowAnnouncementDropdown] =
    useState(false);
  const [showKeywordsDropdown, setShowKeywordsDropdown] = useState(false);
  const [showManagePlansDropdown, setShowManagePlansDropdown] = useState(false);

  const [isJobseekerNavLinksVisible, setIsJobseekerNavLinksVisible] =
    useState(false);

  const toggle1 = () => {
    setIsJobseekerNavLinksVisible(!isJobseekerNavLinksVisible);
  };

  const location = useLocation();

  const [userAccess , setUserAccess] = useState({})
  // const [userType, SetUserType] = useState(Cookies.get('adminID'))

  useEffect(() => {
    // Determine the active NavLink based on the current location.
    const activeNavLink = document.querySelector(".SidebarList li.active");
    if (activeNavLink) {
      // Open the parent dropdown of the active NavLink.
      const parentDropdown = activeNavLink.closest(".dropdown");
      if (parentDropdown) {
        parentDropdown.classList.add("open");
      }

      // Scroll the sidebar to the active dropdown if necessary.
      if (parentDropdown && parentDropdown.offsetTop > window.innerHeight) {
        parentDropdown.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const access = Cookies.get("access")

    if(typeof(access) !== null  || access !==  "" || access !==  undefined){

        console.log(JSON.parse(access))

        setUserAccess(JSON.parse(access))
    }else{
        setUserAccess({})
    }

  }, [])

  const adminID = Cookies.get("adminID");

  // console.log(adminID);

  // const checkUserLogin = () => {
  //   adminID = ;
  // };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        // Reload the page when the screen size is less than 768
        // window.location.reload();
      }
    };

    // Attach the event listener
    window.addEventListener("resize", handleResize);

    // Remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // useEffect(() => {
  //   // checkUserLogin();
  //   const handleWindowResize = () => {
  //     if (window.innerWidth < 768) {
  //       setIsJobseekerNavLinksVisible(false);
  //     } else {
  //       setIsJobseekerNavLinksVisible(true);
  //     }
  //   };

  //   // Call the function on component mount
  //   handleWindowResize();

  //   // Attach event listener for window resize
  //   window.addEventListener("resize", handleWindowResize);

  //   // Clean up event listener on component unmount
  //   return () => {
  //     window.removeEventListener("resize", handleWindowResize);
  //   };
  // }, []);

  let screenWidth = window.innerWidth;

  const handleTest = () => {
    // e.preventDefault();
    setShowSettingDropdown(true);
  };

  const { slug } = useParams();
  const { slug1, slug2 } = useParams();

  return (
    <>
      {screenWidth > 768 ? (
        <>
          {adminID != 1 ? (
            <div className="Sidebar">
              <ul className="SidebarList">
                <NavLink to="/admin/admins/dashboard">
                  <li
                    className={`row ${
                      location.pathname === "/admin/admins/dashboard"
                        ? "active"
                        : ""
                    }`}
                  >
                    <div id="icon">
                      <DashboardIcon />
                    </div>
                    <p id="title">Dashboard</p>
                  </li>
                </NavLink>

                <li
                  className="row"
                  onClick={() =>
                    setShowConfigurationDropdown(!showConfigurationDropdown)
                  }
                >
                  <div id="icon">
                    <PermDataSettingIcon />
                  </div>
                  <p id="title">Configurations</p>
                  {/* {showConfigurationDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showConfigurationDropdown && ( */}
                <div
                  className={`dropdown ${
                    showConfigurationDropdown ? "open" : ""
                  }`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/admins/changeusername">
                        <li
                          className={`row ${
                            location.pathname === "/admin/admins/changeusername"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/admins/changeusername"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Change Username
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changepassword">
                        <li
                          className={`row ${
                            location.pathname === "/admin/admins/changepassword"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/admins/changepassword"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Change Password
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changeemail">
                        <li
                          className={`row ${
                            location.pathname === "/admin/admins/changeemail"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/admins/changeemail"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Change Email
                          </p>
                        </li>
                      </NavLink>
                      {/* <NavLink to="/admin/admins/securityQuestions">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Security Questions</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/plans/index">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Manage Plans</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/settings">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Set Contact Us Address</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changeSlogan">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Slogan Text</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/uploadLogo">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Logo</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changePaymentdetail">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Payment Detail</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changeFavicon">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Favicon</p>
                        </li>
                      </NavLink> */}
                      {/* <NavLink to="/admin/admins/changecolorscheme">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Color Theme</p>
                        </li>
                      </NavLink> */}
                      {/* <NavLink>
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Color Theme</p>
                        </li>
                      </NavLink> */}
                      {/* <NavLink to="/admin/admins/metaManagement">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Meta Management</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/manage">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Manage Sub Admins</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/smtpsettings/configuration">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">SMTP Setting</p>
                        </li>
                      </NavLink> */}
                    </ul>
                  </div>
                </div>
                {/* )} */}

                {/* <li
              className="row"
              onClick={() => setShowSettingDropdown(!showSettingDropdown)}
            >
              <div id="icon">
                <SettingsApplicationsIcon />
              </div>
              <p id="title">Settings</p>
              {showSettingDropdown ? (
                <div id="icon2">
                  <RemoveIcon />
                </div>
              ) : (
                <div id="icon2">
                  <AddIcon />
                </div>
              )}
            </li> */}
                {/* {showSettingDropdown && ( */}
                {/* <div className={`dropdown ${showSettingDropdown ? "open" : ""}`}>
              <div className="dropdown-item">
                <ul className="SidebarListInternal">
                  <NavLink to="/admin/settings/siteSettings">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Site Setting</p>
                    </li>
                  </NavLink>
                  <NavLink to="/admin/settings/manageMails">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Manage Email Setting</p>
                    </li>
                  </NavLink>
                </ul>
              </div>
            </div> */}
                {/* )} */}

                { userAccess[0]?.Module === 1 && 
                <>

                <li
                  className="row"
                  onClick={() => setShowEmployerDropdown(!showEmployerDropdown)}
                >
                  <div id="icon">
                    <BadgeIcon />
                  </div>
                  <p id="title">Employers</p>
                  {/* {showEmployerDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showEmployerDropdown && ( */}
                <div
                  className={`dropdown ${showEmployerDropdown ? "open" : ""}`}
                >
                  <div
                    className="dropdown-item"
                    onClick={() => console.log("Change Username clicked")}
                  >
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/users">
                        <li
                          className={`row ${
                            location.pathname === "/admin/users" ||
                            location.pathname ===
                              `/admin/users/editusers/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/users" ||
                                location.pathname ===
                                  `/admin/users/editusers/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Employer List
                          </p>
                        </li>
                      </NavLink>
                      { userAccess[0]?.Add === 1 && (
                      <>
                      <NavLink to="/admin/users/addusers">
                        <li
                          className={`row ${
                            location.pathname === "/admin/users/addusers"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/users/addusers"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Add Employer
                          </p>
                        </li>
                      </NavLink>
                      </>
                      )}
                      <NavLink to="/admin/users/selectforslider">
                        <li
                          className={`row ${
                            location.pathname === "/admin/users/selectforslider"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/users/selectforslider"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Home Page Slider
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                </>
                }


                {/* )} */}

                { userAccess[2]?.Module === 1 && 
                <>
              
                <li
                  className="row"
                  onClick={() =>
                    setShowJobseekerDropdown(!showJobseekerDropdown)
                  }
                >
                  <div id="icon">
                    <GroupIcon />
                  </div>
                  <p id="title">Jobseekers</p>
                  
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showJobseekerDropdown && ( */}
                <div
                  className={`dropdown ${showJobseekerDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/candidates">
                        <li
                          className={`row ${
                            location.pathname === "/admin/candidates" ||
                            location.pathname ===
                              `/admin/candidates/editcandidates/${slug}` ||
                            location.pathname ===
                              `/admin/candidates/certificates/${slug}` ||
                            location.pathname === `/admin/jobs/applied/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/candidates" ||
                                location.pathname ===
                                  `/admin/candidates/editcandidates/${slug}` ||
                                location.pathname ===
                                  `/admin/candidates/certificates/${slug}` ||
                                location.pathname ===
                                  `/admin/jobs/applied/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Jobseekers List
                          </p>
                        </li>
                      </NavLink>

                      { userAccess[2]?.Add === 1 && (
                        <>
                      <NavLink to="/admin/candidates/addcandidates">
                        <li
                          className={`row ${
                            location.pathname ===
                            "/admin/candidates/addcandidates"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/candidates/addcandidates"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Add Jobseekers
                          </p>
                        </li>
                      </NavLink>
                      </>
                      )}
                    </ul>
                  </div>
                </div>

                </>
                }

                {/* )} */}

                { userAccess[7]?.Module === 1 &&
                <>
                <li
              className="row"
              onClick={() =>
                setShowCategoriesDropdown(!showCategoriesDropdown)
              }
            >
              <div id="icon">
                <CategoryIcon />
              </div>
              <p id="title">Categories</p>
              <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
            </li>
                {/* {showCategoriesDropdown && ( */}
                <div
              className={`dropdown ${showCategoriesDropdown ? "open" : ""}`}
            >
              <div className="dropdown-item">
                <ul className="SidebarListInternal">
                  <NavLink to="/admin/categories">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Categories List</p>
                    </li>
                  </NavLink>
                  { userAccess[7]?.Add === 1 &&
                  <NavLink to="/admin/categories/addcategory">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Add Category</p>
                    </li>
                  </NavLink>
                  }
                </ul>
              </div>
            </div>

            </>}

                {/* )} */}

                {/* <li
              className="row"
              onClick={() =>
                setShowSwearwordsDropdown(!showSwearwordsDropdown)
              }
            >
              <div id="icon">
                <AbcIcon />
              </div>
              <p id="title">Swear Words</p>
              {showSwearwordsDropdown ? (
                <div id="icon2">
                  <RemoveIcon />
                </div>
              ) : (
                <div id="icon2">
                  <AddIcon />
                </div>
              )}
            </li> */}
                {/* {showSwearwordsDropdown && ( */}
                {/* <div
              className={`dropdown ${showSwearwordsDropdown ? "open" : ""}`}
            >
              <div className="dropdown-item">
                <ul className="SidebarListInternal">
                  <NavLink to="/admin/swears">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Swear Words List</p>
                    </li>
                  </NavLink>
                  <NavLink to="/admin/swears/addswears">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Add Swear Words</p>
                    </li>
                  </NavLink>
                </ul>
              </div>
            </div> */}
                {/* )} */}

                {userAccess[8]?.Module === 1 && <>
                <li
              className="row"
              onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
            >
              <div id="icon">
                <AddchartIcon />
              </div>
              <p id="title">Skills</p>
              {/* {showSkillsDropdown ? (
                <div id="icon2">
                  <RemoveIcon />
                </div>
              ) : (
                <div id="icon2">
                  <AddIcon />
                </div>
              )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
            </li>
                {/* {showSkillsDropdown && ( */}
                <div className={`dropdown ${showSkillsDropdown ? "open" : ""}`}>
              <div className="dropdown-item">
                <ul className="SidebarListInternal">
                  <NavLink to="/admin/skills">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Skills List</p>
                    </li>
                  </NavLink>
                  {userAccess[8]?.Add === 1 && <>
                  <NavLink to="/admin/skills/addskills">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Add Skills</p>
                    </li>
                  </NavLink>
                  </>}
                </ul>
              </div>
            </div>

            </>}
                {/* )} */}

                {userAccess[1]?.Module === 1 &&
                <>
              
                <li
              className="row"
              onClick={() =>
                setShowDesignationsDropdown(!showDesignationsDropdown)
              }
            >
              <div id="icon">
                <SchoolIcon />
              </div>
              <p id="title">Designations</p>
              <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
            </li>
                {/* {showDesignationsDropdown && ( */}
                <div
              className={`dropdown ${showDesignationsDropdown ? "open" : ""}`}
            >
              <div className="dropdown-item">
                <ul className="SidebarListInternal">
                  <NavLink to="/admin/designations">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Designations List</p>
                    </li>
                  </NavLink>
                  {userAccess[1]?.Module === 1 && (
                    <>
                  <NavLink to="/admin/designations/adddesignations">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Add Designations</p>
                    </li>
                  </NavLink>
                  </>
                  )}
                </ul>
              </div>
            </div>

            </>
                }

                {/* )} */}


                {userAccess[3]?.Module === 1 &&
                <>

                <li
                  className="row"
                  onClick={() => setShowJobsDropdown(!showJobsDropdown)}
                >
                  <div id="icon">
                    <WorkIcon />
                  </div>
                  <p id="title">Jobs</p>
                  {/* {showJobsDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showJobsDropdown && ( */}
                <div className={`dropdown ${showJobsDropdown ? "open" : ""}`}>
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/jobs">
                        <li
                          className={`row ${
                            location.pathname === "/admin/jobs" ||
                            location.pathname ===
                              `/admin/jobs/editjob/${slug}` ||
                            location.pathname ===
                              `/admin/jobs/candidates/${slug}` ||
                            location.pathname === `/admin/jobs/addjob/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/jobs" ||
                                location.pathname ===
                                  `/admin/jobs/editjob/${slug}` ||
                                location.pathname ===
                                  `/admin/jobs/candidates/${slug}` ||
                                location.pathname ===
                                  `/admin/jobs/addjob/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Jobs List
                          </p>
                        </li>
                      </NavLink>

                      {userAccess[3]?.Add === 1 &&(
                        <>
                          
                      <NavLink to="/admin/jobs/addjob">
                        <li
                          className={`row ${
                            location.pathname === "/admin/jobs/addjob"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/jobs/addjob"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Add Job
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/jobs/import">
                        <li
                          className={`row ${
                            location.pathname === "/admin/jobs/import"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/jobs/import"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Import Job
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/jobs/csv-upload">
                        <li
                          className={`row ${
                            location.pathname === "/admin/jobs/csv-upload"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/jobs/csv-upload"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Import Job From CSV/XLSX
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/jobs/importlist">
                        <li
                          className={`row ${
                            location.pathname === "/admin/jobs/importlist"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/jobs/importlist"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Auto Job Import List
                          </p>
                        </li>
                      </NavLink>

                      </>
                      )}

                    </ul>
                  </div>
                </div>

                </>
                }

                {/* )} */}
                {/* <li
              className="row"
              onClick={() =>
                setShowPaymentHistoryDropdown(!showPaymentHistoryDropdown)
              }
            >
              <div id="icon">
                <PaymentIcon />
              </div>
              <p id="title">Payment History</p>
              {showPaymentHistoryDropdown ? (
                <div id="icon2">
                  <RemoveIcon />
                </div>
              ) : (
                <div id="icon2">
                  <AddIcon />
                </div>
              )}
            </li> */}
                {/* {showPaymentHistoryDropdown && ( */}
                {/* <div
              className={`dropdown ${
                showPaymentHistoryDropdown ? "open" : ""
              }`}
            >
              <div className="dropdown-item">
                <ul className="SidebarListInternal">
                  <NavLink to="/admin/payments/history">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Transaction List</p>
                    </li>
                  </NavLink>
                </ul>
              </div>
            </div> */}
                {/* )} */}

                {userAccess[4]?.Module === 1 && 
                 <>
                 
                <li
                  className="row"
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                >
                  <div id="icon">
                    <PaidIcon />
                  </div>
                  <p id="title">Currency</p>
                  {/* {showCurrencyDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showCurrencyDropdown && ( */}
                <div
                  className={`dropdown ${showCurrencyDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/currencies">
                        <li
                          className={`row ${
                            location.pathname === "/admin/currencies" ||
                            location.pathname ===
                              `/admin/currencies/edit/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/currencies" ||
                                location.pathname ===
                                  `/admin/currencies/edit/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Currency List
                          </p>
                        </li>
                      </NavLink>

                      {userAccess[4]?.Add === 1 && <>
                      <NavLink to="/admin/currencies/add">
                        <li
                          className={`row ${
                            location.pathname === "/admin/currencies/add"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/currencies/add"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Add Currency
                          </p>
                        </li>
                      </NavLink>
                      </>}
                    </ul>
                  </div>
                </div>

                </>}

                {/* )} */}
                {/* <li
              className="row"
              onClick={() =>
                setShowNewsletterDropdown(!showNewsletterDropdown)
              }
            >
              <div id="icon">
                <UnsubscribeIcon />
              </div>
              <p id="title">Manage Newsletter</p>
              {showNewsletterDropdown ? (
                <div id="icon2">
                  <RemoveIcon />
                </div>
              ) : (
                <div id="icon2">
                  <AddIcon />
                </div>
              )}
            </li> */}
                {/* {showNewsletterDropdown && ( */}
                {/* <div
              className={`dropdown ${showNewsletterDropdown ? "open" : ""}`}
            >
              <div className="dropdown-item">
                <ul className="SidebarListInternal">
                  <NavLink to="/admin/newsletters/index">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">List Newsletter</p>
                    </li>
                  </NavLink>
                  <NavLink to="/admin/newsletters/sendNewsletter">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Send Newsletter Email</p>
                    </li>
                  </NavLink>
                  <NavLink to="/admin/newsletters/sentMail">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Email Logs</p>
                    </li>
                  </NavLink>
                  <NavLink to="/admin/newsletters/unsubscriberlist">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Unsubscribe User List</p>
                    </li>
                  </NavLink>
                </ul>
              </div>
            </div> */}
                {/* )} */}
                {/* <li
              className="row"
              onClick={() =>
                setShowBannerAdvertisementDropdown(
                  !showBannerAdvertisementDropdown
                )
              }
            >
              <div id="icon">
                <FeaturedVideoIcon />
              </div>
              <p id="title">Banner Advertisement</p>
              {showBannerAdvertisementDropdown ? (
                <div id="icon2">
                  <RemoveIcon />
                </div>
              ) : (
                <div id="icon2">
                  <AddIcon />
                </div>
              )}
            </li> */}
                {/* {showBannerAdvertisementDropdown && ( */}
                {/* <div
              className={`dropdown ${
                showBannerAdvertisementDropdown ? "open" : ""
              }`}
            >
              <div className="dropdown-item">
                <ul className="SidebarListInternal">
                  <NavLink to="/admin/banneradvertisements">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Banner List</p>
                    </li>
                  </NavLink>
                  <NavLink to="/admin/banneradvertisements/addBanneradvertisement">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Add Banner</p>
                    </li>
                  </NavLink>
                </ul>
              </div>
            </div> */}
                {/* )} */}

                {userAccess[5]?.Module === 1 && 
                <>
                <li
              className="row"
              onClick={() => setShowCourseDropdown(!showCourseDropdown)}
            >
              <div id="icon">
                <LibraryBooksIcon />
              </div>
              <p id="title">Course</p>
              {/* {showCourseDropdown ? (
                <div id="icon2">
                  <RemoveIcon />
                </div>
              ) : (
                <div id="icon2">
                  <AddIcon />
                </div>
              )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
            </li>
                {/* {showCourseDropdown && ( */}
                <div className={`dropdown ${showCourseDropdown ? "open" : ""}`}>
              <div className="dropdown-item">
                <ul className="SidebarListInternal">
                  <NavLink to="/admin/courses">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Course List</p>
                    </li>
                  </NavLink>
                  {userAccess[5]?.Add === 1 && <>
                  <NavLink to="/admin/courses/addcourse">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Add Course</p>
                    </li>
                  </NavLink>
                  </>}
                </ul>
              </div>
            </div>

            </>}

                {/* )} */}

                {userAccess[9]?.Module === 1 && <>
                
                <li
                  className="row"
                  onClick={() => setShowContentDropdown(!showContentDropdown)}
                >
                  <div id="icon">
                    <MonitorIcon />
                  </div>
                  <p id="title">Contents</p>
                  {/* {showContentDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showContentDropdown && ( */}
                <div
                  className={`dropdown ${showContentDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/pages/index">
                        <li
                          className={`row ${
                            location.pathname === "/admin/pages/index" ||
                            location.pathname ===
                              `/admin/pages/editPage/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/pages/index" ||
                                location.pathname ===
                                  `/admin/pages/editPage/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Pages List
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>

                </>}

                {/* )} */}

                { userAccess[10]?.Module === 1 && <>
                

                <li
              className="row"
              onClick={() =>
                setShowEmailTemplateDropdown(!showEmailTemplateDropdown)
              }
            >
              <div id="icon">
                <EmailIcon />
              </div>
              <p id="title">Email Templates</p>
              {/* {showEmailTemplateDropdown ? (
                <div id="icon2">
                  <RemoveIcon />
                </div>
              ) : (
                <div id="icon2">
                  <AddIcon />
                </div>
              )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
            </li>
                {/* {showEmailTemplateDropdown && ( */}
                <div
              className={`dropdown ${
                showEmailTemplateDropdown ? "open" : ""
              }`}
            >
              <div className="dropdown-item">
                <ul className="SidebarListInternal">
                  <NavLink to="/admin/emailtemplates">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Email Template Setting</p>
                    </li>
                  </NavLink>
                </ul>
              </div>
            </div>

            </>}

                {/* )} */}

                { userAccess[6]?.Module === 1 && <>
                
                <li
                  className="row"
                  onClick={() => setShowBlogsDropdown(!showBlogsDropdown)}
                >
                  <div id="icon">
                    <RateReviewIcon />
                  </div>
                  <p id="title">Blogs</p>
                  {/* {showBlogsDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showBlogsDropdown && ( */}
                <div className={`dropdown ${showBlogsDropdown ? "open" : ""}`}>
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/blogs">
                        <li
                          className={`row ${
                            location.pathname === "/admin/blogs" ||
                            location.pathname ===
                              `/admin/blogs/editblogs/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/blogs" ||
                                location.pathname ===
                                  `/admin/blogs/editblogs/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Blog List
                          </p>
                        </li>
                      </NavLink>

                      {userAccess[6]?.Add === 1 && <>
                      <NavLink to="/admin/blogs/addblogs">
                        <li
                          className={`row ${
                            location.pathname === "/admin/blogs/addblogs"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/blogs/addblogs"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Add Blog
                          </p>
                        </li>
                      </NavLink>
                       </>}
                    </ul>
                  </div>
                </div>

                </>}

                {/* )} */}
                {/* <li
                  className="row"
                  onClick={() => setShowSlidersDropdown(!showSlidersDropdown)}
                >
                  <div id="icon">
                    <ViewCarouselIcon />
                  </div>
                  <p id="title">Sliders</p>
                  {showSlidersDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li> */}
                {/* {showSlidersDropdown && ( */}
                {/* <div
                  className={`dropdown ${showSlidersDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/sliders">
                        <li
                          className={`row ${
                            location.pathname === "/admin/sliders" ||
                            location.pathname === `/admin/sliders/edit/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/sliders" ||
                                location.pathname ===
                                  `/admin/sliders/edit/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Slider List
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/sliders/add">
                        <li
                          className={`row ${
                            location.pathname === "/admin/sliders/add"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/sliders/add"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Add Slider
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div> */}
                {/* )} */}

                {/* <li
                  className="row"
                  onClick={() =>
                    setShowAnnouncementDropdown(!showAnnouncementDropdown)
                  }
                >
                  <div id="icon">
                    <CampaignIcon />
                  </div>
                  <p id="title">Announcement</p>
                  {showAnnouncementDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li> */}
                {/* {showAnnouncementDropdown && ( */}
                {/* <div
                  className={`dropdown ${
                    showAnnouncementDropdown ? "open" : ""
                  }`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/announcements">
                        <li
                          className={`row ${
                            location.pathname === "/admin/announcements" ||
                            location.pathname ===
                              `/admin/announcements/edit/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/announcements" ||
                                location.pathname ===
                                  `/admin/announcements/edit/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Announcement List
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/announcements/add">
                        <li
                          className={`row ${
                            location.pathname === "/admin/announcements/add"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/announcements/add"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Add Announcement
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div> */}
                {/* )} */}

                {/* <li
                  className="row"
                  onClick={() => setShowKeywordsDropdown(!showKeywordsDropdown)}
                >
                  <div id="icon">
                    <FindInPageIcon />
                  </div>
                  <p id="title">Keywords</p>
                  {showKeywordsDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li> */}
                {/* {showKeywordsDropdown && ( */}
                {/* <div
                  className={`dropdown ${showKeywordsDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/keywords">
                        <li
                          className={`row ${
                            location.pathname === "/admin/keywords" ||
                            location.pathname === "/admin/keywords/add" ||
                            location.pathname === `/admin/keywords/edit/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/keywords" ||
                                location.pathname === "/admin/keywords/add" ||
                                location.pathname ===
                                  `/admin/keywords/edit/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Search Keywords
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/keywords/jobs">
                        <li
                          className={`row ${
                            location.pathname === "/admin/keywords/jobs" ||
                            location.pathname === "/admin/keywords/addjobs" ||
                            location.pathname ===
                              `/admin/keywords/editjobs/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/keywords/jobs" ||
                                location.pathname ===
                                  "/admin/keywords/addjobs" ||
                                location.pathname ===
                                  `/admin/keywords/editjobs/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Job Keywords
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/keywords/requests">
                        <li
                          className={`row ${
                            location.pathname === "/admin/keywords/requests"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/keywords/requests"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Requested Keywords
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div> */}
                {/* )} */}
              </ul>
            </div>
          ) : (
            <div className="Sidebar">
              <ul className="SidebarList">
                <NavLink to="/admin/admins/dashboard">
                  <li
                    className={`row ${
                      location.pathname === "/admin/admins/dashboard"
                        ? "active"
                        : ""
                    }`}
                  >
                    <div id="icon">
                      <DashboardIcon />
                    </div>
                    <p id="title">Dashboard</p>
                  </li>
                </NavLink>

                <li
                  className="row"
                  onClick={() =>
                    setShowConfigurationDropdown(!showConfigurationDropdown)
                  }
                >
                  <div id="icon">
                    <PermDataSettingIcon />
                  </div>
                  <p id="title">Configurations</p>
                  {/* {showConfigurationDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showConfigurationDropdown && ( */}
                <div
                  className={`dropdown ${
                    showConfigurationDropdown ? "open" : ""
                  }`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/admins/changeusername">
                        <li
                          className={`row ${
                            location.pathname === "/admin/admins/changeusername"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/admins/changeusername"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Change Username
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changepassword">
                        <li
                          className={`row ${
                            location.pathname === "/admin/admins/changepassword"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/admins/changepassword"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Change Password
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changeemail">
                        <li
                          className={`row ${
                            location.pathname === "/admin/admins/changeemail"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/admins/changeemail"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Change Email
                          </p>
                        </li>
                      </NavLink>

                      <NavLink to="/admin/admins/securityQuestions">
                        <li
                          className={`row ${
                            location.pathname ===
                            "/admin/admins/securityQuestions"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/admins/securityQuestions"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Security Questions
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/plans/index">
                        <li
                          className={`row ${
                            location.pathname === "/admin/plans/index" ||
                            location.pathname === "/admin/plans/addplan" ||
                            location.pathname ===
                              `/admin/plans/editPlan/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/plans/index" ||
                                location.pathname === "/admin/plans/addplan" ||
                                location.pathname ===
                                  `/admin/plans/editPlan/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Manage Plans
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/settings">
                        <li
                          className={`row ${
                            location.pathname === "/admin/admins/settings"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/admins/settings"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Set Contact Us Address
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changeSlogan">
                        <li
                          className={`row ${
                            location.pathname === "/admin/admins/changeSlogan"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/admins/changeSlogan"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Slogan Text
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/uploadLogo">
                        <li
                          className={`row ${
                            location.pathname === "/admin/admins/uploadLogo"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/admins/uploadLogo"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Change Logo
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changeFavicon">
                        <li
                          className={`row ${
                            location.pathname === "/admin/admins/changeFavicon"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/admins/changeFavicon"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Change Favicon
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changecolorscheme">
                        <li
                          className={`row ${
                            location.pathname === "/admin/admins/changecolorscheme"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/admins/changecolorscheme"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Change Color Theme
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changePaymentdetail">
                        <li
                          className={`row ${
                            location.pathname ===
                            "/admin/admins/changePaymentdetail"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/admins/changePaymentdetail"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Change Payment Details
                          </p>
                        </li>
                      </NavLink>

                      {/* <NavLink>
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Color Theme</p>
                        </li>
                      </NavLink> */}
                      <NavLink to="/admin/admins/metaManagement">
                        <li
                          className={`row ${
                            location.pathname === "/admin/admins/metaManagement"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/admins/metaManagement"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Meta Management
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/manage">
                        <li
                          className={`row ${
                            location.pathname === "/admin/admins/manage" ||
                            location.pathname === "/admin/admins/addsubadmin" ||
                            location.pathname ===
                              `/admin/admins/editadmins/${slug}` ||
                            location.pathname ===
                              `/admin/admins/managerole/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/admins/manage" ||
                                location.pathname ===
                                  "/admin/admins/addsubadmin" ||
                                location.pathname ===
                                  `/admin/admins/editadmins/${slug}` ||
                                location.pathname ===
                                  `/admin/admins/managerole/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Manage Sub Admins
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/smtpsettings/configuration">
                        <li
                          className={`row ${
                            location.pathname ===
                            "/admin/smtpsettings/configuration"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/smtpsettings/configuration"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            SMTP Setting
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}

                <li
                  className="row"
                  onClick={() => setShowSettingDropdown(!showSettingDropdown)}
                >
                  <div id="icon">
                    <SettingsApplicationsIcon />
                  </div>
                  <p id="title">Settings</p>
                  
                  {/* {showSettingDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showSettingDropdown && ( */}
                <div
                  className={`dropdown ${showSettingDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/settings/siteSettings">
                        <li
                          className={`row ${
                            location.pathname === "/admin/settings/siteSettings"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/settings/siteSettings"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Site Setting
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/settings/manageMails">
                        <li
                          className={`row ${
                            location.pathname ===
                              "/admin/settings/manageMails" ||
                            location.pathname ===
                              `/admin/settings/editMails/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                  "/admin/settings/manageMails" ||
                                location.pathname ===
                                  `/admin/settings/editMails/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Manage Email Setting
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() => setShowEmployerDropdown(!showEmployerDropdown)}
                >
                  <div id="icon">
                    <BadgeIcon />
                  </div>
                  <p id="title">Employers</p>
                  {/* {showEmployerDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showEmployerDropdown && ( */}
                <div
                  className={`dropdown ${showEmployerDropdown ? "open" : ""}`}
                >
                  <div
                    className="dropdown-item"
                    // onClick={() => console.log("Change Username clicked")}
                  >
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/users">
                        <li
                          className={`row ${
                            location.pathname === "/admin/users" ||
                            location.pathname ===
                              `/admin/users/editusers/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/users" ||
                                location.pathname ===
                                  `/admin/users/editusers/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Employer List
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/users/addusers">
                        <li
                          className={`row ${
                            location.pathname === "/admin/users/addusers"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/users/addusers"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Add Employer
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/users/selectforslider">
                        <li
                          className={`row ${
                            location.pathname === "/admin/users/selectforslider"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/users/selectforslider"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Home Page Slider
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() =>
                    setShowJobseekerDropdown(!showJobseekerDropdown)
                  }
                >
                  <div id="icon">
                    <GroupIcon />
                  </div>
                  <p id="title">Jobseekers</p>
                  {/* {showJobseekerDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showJobseekerDropdown && ( */}
                <div
                  className={`dropdown ${showJobseekerDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/candidates">
                        <li
                          className={`row ${
                            location.pathname === "/admin/candidates" ||
                            location.pathname ===
                              `/admin/candidates/editcandidates/${slug}` ||
                            location.pathname ===
                              `/admin/candidates/certificates/${slug}` ||
                            location.pathname === `/admin/jobs/applied/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/candidates" ||
                                location.pathname ===
                                  `/admin/candidates/editcandidates/${slug}` ||
                                location.pathname ===
                                  `/admin/candidates/certificates/${slug}` ||
                                location.pathname ===
                                  `/admin/jobs/applied/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Jobseekers List
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/candidates/addcandidates">
                        <li
                          className={`row ${
                            location.pathname ===
                            "/admin/candidates/addcandidates"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/candidates/addcandidates"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Add Jobseekers
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() =>
                    setShowCategoriesDropdown(!showCategoriesDropdown)
                  }
                >
                  <div id="icon">
                    <CategoryIcon />
                  </div>
                  <p id="title">Categories</p>
                  {/* {showCategoriesDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showCategoriesDropdown && ( */}
                <div
                  className={`dropdown ${showCategoriesDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/categories">
                        <li
                          className={`row ${
                            location.pathname === "/admin/categories" ||
                            location.pathname ===
                              `/admin/categories/editcategory/${slug}` ||
                            location.pathname ===
                              `/admin/categories/subindex/${slug}` ||
                            location.pathname ===
                              `/admin/categories/editsubcat/${slug1}/${slug2}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/categories" ||
                                location.pathname ===
                                  `/admin/categories/editcategory/${slug}` ||
                                location.pathname ===
                                  `/admin/categories/subindex/${slug}` ||
                                location.pathname ===
                                  `/admin/categories/editsubcat/${slug1}/${slug2}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Categories List
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/categories/addcategory">
                        <li
                          className={`row ${
                            location.pathname ===
                            "/admin/categories/addcategory"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/categories/addcategory"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Add Category
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() =>
                    setShowSwearwordsDropdown(!showSwearwordsDropdown)
                  }
                >
                  <div id="icon">
                    <AbcIcon />
                  </div>
                  <p id="title">Swear Words</p>
                  {/* {showSwearwordsDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showSwearwordsDropdown && ( */}
                <div
                  className={`dropdown ${showSwearwordsDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/swears">
                        <li
                          className={`row ${
                            location.pathname === "/admin/swears" ||
                            location.pathname ===
                              `/admin/swears/editswear/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/swears" ||
                                location.pathname ===
                                  `/admin/swears/editswear/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Swear Words List
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/swears/addswears">
                        <li
                          className={`row ${
                            location.pathname === "/admin/swears/addswears"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/swears/addswears"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Add Swear Words
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
                >
                  <div id="icon">
                    <AddchartIcon />
                  </div>
                  <p id="title">Skills</p>
                  {/* {showSkillsDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showSkillsDropdown && ( */}
                <div className={`dropdown ${showSkillsDropdown ? "open" : ""}`}>
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/skills">
                        <li
                          className={`row ${
                            location.pathname === "/admin/skills" ||
                            location.pathname ===
                              `/admin/skills/editskill/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/skills" ||
                                location.pathname ===
                                  `/admin/skills/editskill/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Skills List
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/skills/addskills">
                        <li
                          className={`row ${
                            location.pathname === "/admin/skills/addskills"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/skills/addskills"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Add Skills
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() =>
                    setShowDesignationsDropdown(!showDesignationsDropdown)
                  }
                >
                  <div id="icon">
                    <SchoolIcon />
                  </div>
                  <p id="title">Designations</p>
                  {/* {showDesignationsDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showDesignationsDropdown && ( */}
                <div
                  className={`dropdown ${
                    showDesignationsDropdown ? "open" : ""
                  }`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/designations">
                        <li
                          className={`row ${
                            location.pathname === "/admin/designations" ||
                            location.pathname ===
                              `/admin/designations/editdesignation/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/designations" ||
                                location.pathname ===
                                  `/admin/designations/editdesignation/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Designations List
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/designations/adddesignations">
                        <li
                          className={`row ${
                            location.pathname ===
                            "/admin/designations/adddesignations"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/designations/adddesignations"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Add Designations
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() => setShowJobsDropdown(!showJobsDropdown)}
                >
                  <div id="icon">
                    <WorkIcon />
                  </div>
                  <p id="title">Jobs</p>
                  {/* {showJobsDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showJobsDropdown && ( */}
                <div className={`dropdown ${showJobsDropdown ? "open" : ""}`}>
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/jobs">
                        <li
                          className={`row ${
                            location.pathname === "/admin/jobs" ||
                            location.pathname ===
                              `/admin/jobs/editjob/${slug}` ||
                            location.pathname ===
                              `/admin/jobs/candidates/${slug}` ||
                            location.pathname === `/admin/jobs/addjob/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/jobs" ||
                                location.pathname ===
                                  `/admin/jobs/editjob/${slug}` ||
                                location.pathname ===
                                  `/admin/jobs/candidates/${slug}` ||
                                location.pathname ===
                                  `/admin/jobs/addjob/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Jobs List
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/jobs/addjob">
                        <li
                          className={`row ${
                            location.pathname === "/admin/jobs/addjob"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/jobs/addjob"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Add Job
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/jobs/import">
                        <li
                          className={`row ${
                            location.pathname === "/admin/jobs/import"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/jobs/import"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Import Job
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/jobs/csv-upload">
                        <li
                          className={`row ${
                            location.pathname === "/admin/jobs/csv-upload"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/jobs/csv-upload"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Import Job From CSV/XLSX
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/jobs/importlist">
                        <li
                          className={`row ${
                            location.pathname === "/admin/jobs/importlist"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/jobs/importlist"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Auto Job Import List
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() =>
                    setShowPaymentHistoryDropdown(!showPaymentHistoryDropdown)
                  }
                >
                  <div id="icon">
                    <PaymentIcon />
                  </div>
                  <p id="title">Payment History</p>
                  {/* {showPaymentHistoryDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showPaymentHistoryDropdown && ( */}
                <div
                  className={`dropdown ${
                    showPaymentHistoryDropdown ? "open" : ""
                  }`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/payments/history">
                        <li
                          className={`row ${
                            location.pathname === "/admin/payments/history"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/payments/history"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Transaction List
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                >
                  <div id="icon">
                    <PaidIcon />
                  </div>
                  <p id="title">Currency</p>
                  {/* {showCurrencyDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showCurrencyDropdown && ( */}
                <div
                  className={`dropdown ${showCurrencyDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/currencies">
                        <li
                          className={`row ${
                            location.pathname === "/admin/currencies" ||
                            location.pathname ===
                              `/admin/currencies/edit/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/currencies" ||
                                location.pathname ===
                                  `/admin/currencies/edit/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Currency List
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/currencies/add">
                        <li
                          className={`row ${
                            location.pathname === "/admin/currencies/add"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/currencies/add"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Add Currency
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() =>
                    setShowNewsletterDropdown(!showNewsletterDropdown)
                  }
                >
                  <div id="icon">
                    <UnsubscribeIcon />
                  </div>
                  <p id="title">Manage Newsletter</p>
                  {/* {showNewsletterDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showNewsletterDropdown && ( */}
                <div
                  className={`dropdown ${showNewsletterDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/newsletters/index">
                        <li
                          className={`row ${
                            location.pathname === "/admin/newsletters/index" ||
                            location.pathname ===
                              "/admin/newsletters/addNewsletter" ||
                            location.pathname ===
                              `/admin/newsletters/editNewsletter/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                  "/admin/newsletters/index" ||
                                location.pathname ===
                                  "/admin/newsletters/addNewsletter" ||
                                location.pathname ===
                                  `/admin/newsletters/editNewsletter/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Newsletter List
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/newsletters/sendNewsletter">
                        <li
                          className={`row ${
                            location.pathname ===
                            "/admin/newsletters/sendNewsletter"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/newsletters/sendNewsletter"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Send Newsletter Email
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/newsletters/sentMail">
                        <li
                          className={`row ${
                            location.pathname === "/admin/newsletters/sentMail"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/newsletters/sentMail"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Email Logs
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/newsletters/unsubscriberlist">
                        <li
                          className={`row ${
                            location.pathname ===
                            "/admin/newsletters/unsubscriberlist"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/newsletters/unsubscriberlist"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Unsubscribe User List
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() =>
                    setShowBannerAdvertisementDropdown(
                      !showBannerAdvertisementDropdown
                    )
                  }
                >
                  <div id="icon">
                    <FeaturedVideoIcon />
                  </div>
                  <p id="title">Banner Advertisement</p>
                  {/* {showBannerAdvertisementDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showBannerAdvertisementDropdown && ( */}
                <div
                  className={`dropdown ${
                    showBannerAdvertisementDropdown ? "open" : ""
                  }`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/banneradvertisements">
                        <li
                          className={`row ${
                            location.pathname ===
                              "/admin/banneradvertisements" ||
                            location.pathname ===
                              `/admin/banneradvertisements/editBanneradvertisement/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                  "/admin/banneradvertisements" ||
                                location.pathname ===
                                  `/admin/banneradvertisements/editBanneradvertisement/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Banner List
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/banneradvertisements/addBanneradvertisement">
                        <li
                          className={`row ${
                            location.pathname ===
                            "/admin/banneradvertisements/addBanneradvertisement"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname ===
                                "/admin/banneradvertisements/addBanneradvertisement"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Add Banner
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                >
                  <div id="icon">
                    <LibraryBooksIcon />
                  </div>
                  <p id="title">Course</p>
                  {/* {showCourseDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showCourseDropdown && ( */}
                <div className={`dropdown ${showCourseDropdown ? "open" : ""}`}>
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/courses">
                        <li
                          className={`row ${
                            location.pathname === "/admin/courses" ||
                            location.pathname ===
                              `/admin/courses/editcourse/${slug}` ||
                            location.pathname ===
                              `/admin/specializations/index/${slug}` ||
                            location.pathname ===
                              `/admin/specializations/addspecialization/${slug}` ||
                            location.pathname ===
                              `/admin/specializations/editspecialization/${slug1}/${slug2}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/courses" ||
                                location.pathname ===
                                  `/admin/courses/editcourse/${slug}` ||
                                location.pathname ===
                                  `/admin/specializations/index/${slug}` ||
                                location.pathname ===
                                  `/admin/specializations/addspecialization/${slug}` ||
                                location.pathname ===
                                  `/admin/specializations/editspecialization/${slug1}/${slug2}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Course List
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/courses/addcourse">
                        <li
                          className={`row ${
                            location.pathname === "/admin/courses/addcourse"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/courses/addcourse"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Add Course
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() => setShowContentDropdown(!showContentDropdown)}
                >
                  <div id="icon">
                    <MonitorIcon />
                  </div>
                  <p id="title">Contents</p>
                  {/* {showContentDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showContentDropdown && ( */}
                <div
                  className={`dropdown ${showContentDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/pages/index">
                        <li
                          className={`row ${
                            location.pathname === "/admin/pages/index" ||
                            location.pathname ===
                              `/admin/pages/editPage/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/pages/index" ||
                                location.pathname ===
                                  `/admin/pages/editPage/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Pages List
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() =>
                    setShowEmailTemplateDropdown(!showEmailTemplateDropdown)
                  }
                >
                  <div id="icon">
                    <EmailIcon />
                  </div>
                  <p id="title">Email Templates</p>
                  {/* {showEmailTemplateDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showEmailTemplateDropdown && ( */}
                <div
                  className={`dropdown ${
                    showEmailTemplateDropdown ? "open" : ""
                  }`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/emailtemplates">
                        <li
                          className={`row ${
                            location.pathname === "/admin/emailtemplates" ||
                            location.pathname ===
                              `/admin/pages/editPage/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/emailtemplates" ||
                                location.pathname ===
                                  `/admin/pages/editPage/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Email Template Setting
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() => setShowBlogsDropdown(!showBlogsDropdown)}
                >
                  <div id="icon">
                    <RateReviewIcon />
                  </div>
                  <p id="title">Blogs</p>
                  {/* {showBlogsDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showBlogsDropdown && ( */}
                <div className={`dropdown ${showBlogsDropdown ? "open" : ""}`}>
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/blogs">
                        <li
                          className={`row ${
                            location.pathname === "/admin/blogs" ||
                            location.pathname ===
                              `/admin/blogs/editblogs/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/blogs" ||
                                location.pathname ===
                                  `/admin/blogs/editblogs/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Blog List
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/blogs/addblogs">
                        <li
                          className={`row ${
                            location.pathname === "/admin/blogs/addblogs"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/blogs/addblogs"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Add Blog
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() => setShowSlidersDropdown(!showSlidersDropdown)}
                >
                  <div id="icon">
                    <ViewCarouselIcon />
                  </div>
                  <p id="title">Sliders</p>
                  {/* {showSlidersDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showSlidersDropdown && ( */}
                <div
                  className={`dropdown ${showSlidersDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/sliders">
                        <li
                          className={`row ${
                            location.pathname === "/admin/sliders" ||
                            location.pathname === `/admin/sliders/edit/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/sliders" ||
                                location.pathname ===
                                  `/admin/sliders/edit/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Slider List
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/sliders/add">
                        <li
                          className={`row ${
                            location.pathname === "/admin/sliders/add"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/sliders/add"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Add Slider
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() =>
                    setShowAnnouncementDropdown(!showAnnouncementDropdown)
                  }
                >
                  <div id="icon">
                    <CampaignIcon />
                  </div>
                  <p id="title">Announcement</p>
                  {/* {showAnnouncementDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showAnnouncementDropdown && ( */}
                <div
                  className={`dropdown ${
                    showAnnouncementDropdown ? "open" : ""
                  }`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/announcements">
                        <li
                          className={`row ${
                            location.pathname === "/admin/announcements" ||
                            location.pathname ===
                              `/admin/announcements/edit/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/announcements" ||
                                location.pathname ===
                                  `/admin/announcements/edit/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Announcement List
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/announcements/add">
                        <li
                          className={`row ${
                            location.pathname === "/admin/announcements/add"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/announcements/add"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Add Announcement
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() => setShowKeywordsDropdown(!showKeywordsDropdown)}
                >
                  <div id="icon">
                    <FindInPageIcon />
                  </div>
                  <p id="title">Keywords</p>
                  {/* {showKeywordsDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )} */}
                  <div id="icon2">
                    <ExpandMoreIcon />
                  </div>
                </li>
                {/* {showKeywordsDropdown && ( */}
                <div
                  className={`dropdown ${showKeywordsDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/keywords">
                        <li
                          className={`row ${
                            location.pathname === "/admin/keywords" ||
                            location.pathname === "/admin/keywords/add" ||
                            location.pathname === `/admin/keywords/edit/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/keywords" ||
                                location.pathname === "/admin/keywords/add" ||
                                location.pathname ===
                                  `/admin/keywords/edit/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Search Keywords
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/keywords/jobs">
                        <li
                          className={`row ${
                            location.pathname === "/admin/keywords/jobs" ||
                            location.pathname === "/admin/keywords/addjobs" ||
                            location.pathname ===
                              `/admin/keywords/editjobs/${slug}`
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/keywords/jobs" ||
                                location.pathname ===
                                  "/admin/keywords/addjobs" ||
                                location.pathname ===
                                  `/admin/keywords/editjobs/${slug}`
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Job Keywords
                          </p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/keywords/requests">
                        <li
                          className={`row ${
                            location.pathname === "/admin/keywords/requests"
                              ? "active"
                              : ""
                          }`}
                        >
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p
                            id="innerTitle"
                            style={{
                              color:
                                location.pathname === "/admin/keywords/requests"
                                  ? "#f3734c"
                                  : "inherit",
                            }}
                          >
                            Requested Keywords
                          </p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
              </ul>
            </div>
          )}
        </>
      ) : (
        <>
          {adminID != 1 ? (
            <div className="Sidebar adminSidebarNavLinks">
              <div className="sidebarEachHeader">
                <h3>Menu</h3>
                <NavLink className="adminSidebarPlusNavLink" onClick={toggle1}>
                  {isJobseekerNavLinksVisible ? (
                    <i class="fa-solid fa-circle-minus"></i>
                  ) : (
                    <i class="fa-solid fa-circle-plus"></i>
                  )}
                </NavLink>
              </div>
              <ul
                className="SidebarList"
                style={{
                  display: isJobseekerNavLinksVisible ? "block" : "none",
                }}
              >
                <NavLink to="/admin/admins/dashboard">
                  <li className="row">
                    <div id="icon">
                      <DashboardIcon />
                    </div>
                    <p id="title">Dashboard</p>
                  </li>
                </NavLink>

                <li
                  className="row"
                  onClick={() =>
                    setShowConfigurationDropdown(!showConfigurationDropdown)
                  }
                >
                  <div id="icon">
                    <PermDataSettingIcon />
                  </div>
                  <p id="title">Configuration</p>
                  {showConfigurationDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showConfigurationDropdown && ( */}
                <div
                  className={`dropdown ${
                    showConfigurationDropdown ? "open" : ""
                  }`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/admins/changeusername">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Username</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changepassword">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Password</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changeemail">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Email</p>
                        </li>
                      </NavLink>
                      {/* <NavLink to="/admin/admins/securityQuestions">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Security Questions</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/plans/index">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Manage Plans</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/settings">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Set Contact Us Address</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changeSlogan">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Slogan Text</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/uploadLogo">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Logo</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changePaymentdetail">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Payment Detail</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changeFavicon">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Favicon</p>
                        </li>
                      </NavLink> */}
                      {/* <NavLink>
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Color Theme</p>
                        </li>
                      </NavLink> */}
                      {/* <NavLink to="/admin/admins/metaManagement">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Meta Management</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/manage">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Manage Sub Admins</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/smtpsettings/configuration">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">SMTP Setting</p>
                        </li>
                      </NavLink> */}
                    </ul>
                  </div>
                </div>
                {/* )} */}

                {/* <li
              className="row"
              onClick={() => setShowSettingDropdown(!showSettingDropdown)}
            >
              <div id="icon">
                <SettingsApplicationsIcon />
              </div>
              <p id="title">Setting</p>
              {showSettingDropdown ? (
                <div id="icon2">
                  <RemoveIcon />
                </div>
              ) : (
                <div id="icon2">
                  <AddIcon />
                </div>
              )}
            </li> */}
                {/* {showSettingDropdown && ( */}
                {/* <div className={`dropdown ${showSettingDropdown ? "open" : ""}`}>
              <div className="dropdown-item">
                <ul className="SidebarListInternal">
                  <NavLink to="/admin/settings/siteSettings">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Site Setting</p>
                    </li>
                  </NavLink>
                  <NavLink to="/admin/settings/manageMails">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Manage Email Setting</p>
                    </li>
                  </NavLink>
                </ul>
              </div>
            </div> */}
                {/* )} */}

                { userAccess[0]?.Module === 1 && 
                <>

                <li
                  className="row"
                  onClick={() => setShowEmployerDropdown(!showEmployerDropdown)}
                >
                  <div id="icon">
                    <BadgeIcon />
                  </div>
                  <p id="title">Employers</p>
                  {showEmployerDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showEmployerDropdown && ( */}
                <div
                  className={`dropdown ${showEmployerDropdown ? "open" : ""}`}
                >
                  <div
                    className="dropdown-item"
                    onClick={() => console.log("Change Username clicked")}
                  >
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/users">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Employer List</p>
                        </li>
                      </NavLink>
                      { userAccess[0]?.Add === 1 && (
                      <>
                      <NavLink to="/admin/users/addusers">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Add Employer</p>
                        </li>
                      </NavLink>
                      </>
                      )}
                      <NavLink to="/admin/users/selectforslider">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Home Page Slider</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                </>
                }

                {/* )} */}
                { userAccess[2]?.Module === 1 && 
                <>
                <li
                  className="row"
                  onClick={() =>
                    setShowJobseekerDropdown(!showJobseekerDropdown)
                  }
                >
                  <div id="icon">
                    <GroupIcon />
                  </div>
                  <p id="title">Jobseeker</p>
                  {showJobseekerDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showJobseekerDropdown && ( */}
                <div
                  className={`dropdown ${showJobseekerDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/candidates">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Jobseekers List</p>
                        </li>
                      </NavLink>
                      { userAccess[2]?.Add === 1 && (
                        <>
                      <NavLink to="/admin/candidates/addcandidates">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Add Jobseekers</p>
                        </li>
                      </NavLink>
                      </>
                      )}
                    </ul>
                  </div>
                </div>

                </>
                }

                {/* )} */}

                { userAccess[7]?.Module === 1 &&
                <>

                <li
              className="row"
              onClick={() =>
                setShowCategoriesDropdown(!showCategoriesDropdown)
              }
            >
              <div id="icon">
                <CategoryIcon />
              </div>
              <p id="title">Categories</p>
              {showCategoriesDropdown ? (
                <div id="icon2">
                  <RemoveIcon />
                </div>
              ) : (
                <div id="icon2">
                  <AddIcon />
                </div>
              )}
            </li>
                {/* {showCategoriesDropdown && ( */}
                <div
              className={`dropdown ${showCategoriesDropdown ? "open" : ""}`}
            >
              <div className="dropdown-item">
                <ul className="SidebarListInternal">
                  <NavLink to="/admin/categories">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Categories List</p>
                    </li>
                  </NavLink>
                  { userAccess[7]?.Add === 1 &&
                  <NavLink to="/admin/categories/addcategory">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Add Category</p>
                    </li>
                  </NavLink>
                  }
                </ul>
              </div>
            </div>

            </>}

                {/* )} */}
                {/* <li
              className="row"
              onClick={() =>
                setShowSwearwordsDropdown(!showSwearwordsDropdown)
              }
            >
              <div id="icon">
                <AbcIcon />
              </div>
              <p id="title">Swear Words</p>
              {showSwearwordsDropdown ? (
                <div id="icon2">
                  <RemoveIcon />
                </div>
              ) : (
                <div id="icon2">
                  <AddIcon />
                </div>
              )}
            </li> */}
                {/* {showSwearwordsDropdown && ( */}
                {/* <div
              className={`dropdown ${showSwearwordsDropdown ? "open" : ""}`}
            >
              <div className="dropdown-item">
                <ul className="SidebarListInternal">
                  <NavLink to="/admin/swears">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Swear Words List</p>
                    </li>
                  </NavLink>
                  <NavLink to="/admin/swears/addswears">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Add Swear Words</p>
                    </li>
                  </NavLink>
                </ul>
              </div>
            </div> */}
                {/* )} */}
                {userAccess[8]?.Module === 1 && <>
                <li
              className="row"
              onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
            >
              <div id="icon">
                <AddchartIcon />
              </div>
              <p id="title">Skills</p>
              {showSkillsDropdown ? (
                <div id="icon2">
                  <RemoveIcon />
                </div>
              ) : (
                <div id="icon2">
                  <AddIcon />
                </div>
              )}
            </li>
                {/* {showSkillsDropdown && ( */}
                <div className={`dropdown ${showSkillsDropdown ? "open" : ""}`}>
              <div className="dropdown-item">
                <ul className="SidebarListInternal">
                  <NavLink to="/admin/skills">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Skills List</p>
                    </li>
                  </NavLink>
                  {userAccess[8]?.Add === 1 && <>
                  <NavLink to="/admin/skills/addskills">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Add Skills</p>
                    </li>
                  </NavLink>
                  </>}
                </ul>
              </div>
            </div>

            </>}

                {/* )} */}

                {userAccess[1]?.Module === 1 &&
                <>
                <li
              className="row"
              onClick={() =>
                setShowDesignationsDropdown(!showDesignationsDropdown)
              }
            >
              <div id="icon">
                <SchoolIcon />
              </div>
              <p id="title">Designations</p>
              {showDesignationsDropdown ? (
                <div id="icon2">
                  <RemoveIcon />
                </div>
              ) : (
                <div id="icon2">
                  <AddIcon />
                </div>
              )}
            </li>
                {/* {showDesignationsDropdown && ( */}

                <div
              className={`dropdown ${showDesignationsDropdown ? "open" : ""}`}
            >
              <div className="dropdown-item">
                <ul className="SidebarListInternal">
                  <NavLink to="/admin/designations">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Designations List</p>
                    </li>
                  </NavLink>
                  {userAccess[1]?.Module === 1 && (
                    <>
                  <NavLink to="/admin/designations/adddesignations">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Add Designations</p>
                    </li>
                  </NavLink>
                  </>
                  )}
                </ul>
              </div>
            </div>
            </>
                }

                {/* )} */}

                {userAccess[3]?.Module === 1 &&
                <>
                <li
                  className="row"
                  onClick={() => setShowJobsDropdown(!showJobsDropdown)}
                >
                  <div id="icon">
                    <WorkIcon />
                  </div>
                  <p id="title">Jobs</p>
                  {showJobsDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showJobsDropdown && ( */}
                <div className={`dropdown ${showJobsDropdown ? "open" : ""}`}>
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/jobs">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Jobs List</p>
                        </li>
                      </NavLink>
                      {userAccess[3]?.Add === 1 && (
                        <>
                      <NavLink to="/admin/jobs/addjob">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Add Job</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/jobs/import">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Import Job</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/jobs/importlist">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Auto Job Import List</p>
                        </li>
                      </NavLink>
                      </>
                      )}
                    </ul>
                  </div>
                </div>

                </>
                }
                {/* )} */}
                {/* <li
              className="row"
              onClick={() =>
                setShowPaymentHistoryDropdown(!showPaymentHistoryDropdown)
              }
            >
              <div id="icon">
                <PaymentIcon />
              </div>
              <p id="title">Payment History</p>
              {showPaymentHistoryDropdown ? (
                <div id="icon2">
                  <RemoveIcon />
                </div>
              ) : (
                <div id="icon2">
                  <AddIcon />
                </div>
              )}
            </li> */}
                {/* {showPaymentHistoryDropdown && ( */}
                {/* <div
              className={`dropdown ${
                showPaymentHistoryDropdown ? "open" : ""
              }`}
            >
              <div className="dropdown-item">
                <ul className="SidebarListInternal">
                  <NavLink to="/admin/payments/history">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Transaction List</p>
                    </li>
                  </NavLink>
                </ul>
              </div>
            </div> */}
                {/* )} */}

                {userAccess[4]?.Module === 1 && 
                 <>

                <li
                  className="row"
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                >
                  <div id="icon">
                    <PaidIcon />
                  </div>
                  <p id="title">Currency</p>
                  {showCurrencyDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showCurrencyDropdown && ( */}
                <div
                  className={`dropdown ${showCurrencyDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/currencies">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Currency List</p>
                        </li>
                      </NavLink>
                      {userAccess[4]?.Add === 1 && <>
                      <NavLink to="/admin/currencies/add">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Add Currency</p>
                        </li>
                      </NavLink>
                      </>}
                    </ul>
                  </div>
                </div>

                </>}
                {/* )} */}
                {/* <li
              className="row"
              onClick={() =>
                setShowNewsletterDropdown(!showNewsletterDropdown)
              }
            >
              <div id="icon">
                <UnsubscribeIcon />
              </div>
              <p id="title">Manage Newsletter</p>
              {showNewsletterDropdown ? (
                <div id="icon2">
                  <RemoveIcon />
                </div>
              ) : (
                <div id="icon2">
                  <AddIcon />
                </div>
              )}
            </li> */}
                {/* {showNewsletterDropdown && ( */}
                {/* <div
              className={`dropdown ${showNewsletterDropdown ? "open" : ""}`}
            >
              <div className="dropdown-item">
                <ul className="SidebarListInternal">
                  <NavLink to="/admin/newsletters/index">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">List Newsletter</p>
                    </li>
                  </NavLink>
                  <NavLink to="/admin/newsletters/sendNewsletter">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Send Newsletter Email</p>
                    </li>
                  </NavLink>
                  <NavLink to="/admin/newsletters/sentMail">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Email Logs</p>
                    </li>
                  </NavLink>
                  <NavLink to="/admin/newsletters/unsubscriberlist">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Unsubscribe User List</p>
                    </li>
                  </NavLink>
                </ul>
              </div>
            </div> */}
                {/* )} */}
                {/* <li
              className="row"
              onClick={() =>
                setShowBannerAdvertisementDropdown(
                  !showBannerAdvertisementDropdown
                )
              }
            >
              <div id="icon">
                <FeaturedVideoIcon />
              </div>
              <p id="title">Banner Advertisement</p>
              {showBannerAdvertisementDropdown ? (
                <div id="icon2">
                  <RemoveIcon />
                </div>
              ) : (
                <div id="icon2">
                  <AddIcon />
                </div>
              )}
            </li> */}
                {/* {showBannerAdvertisementDropdown && ( */}
                {/* <div
              className={`dropdown ${
                showBannerAdvertisementDropdown ? "open" : ""
              }`}
            >
              <div className="dropdown-item">
                <ul className="SidebarListInternal">
                  <NavLink to="/admin/banneradvertisements">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Banner List</p>
                    </li>
                  </NavLink>
                  <NavLink to="/admin/banneradvertisements/addBanneradvertisement">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Add Banner</p>
                    </li>
                  </NavLink>
                </ul>
              </div>
            </div> */}
                {/* )} */}

                {userAccess[5]?.Module === 1 && 
                <>
                <li
              className="row"
              onClick={() => setShowCourseDropdown(!showCourseDropdown)}
            >
              <div id="icon">
                <LibraryBooksIcon />
              </div>
              <p id="title">Course</p>
              {showCourseDropdown ? (
                <div id="icon2">
                  <RemoveIcon />
                </div>
              ) : (
                <div id="icon2">
                  <AddIcon />
                </div>
              )}
            </li>
                {/* {showCourseDropdown && ( */}
                <div className={`dropdown ${showCourseDropdown ? "open" : ""}`}>
              <div className="dropdown-item">
                <ul className="SidebarListInternal">
                  <NavLink to="/admin/courses">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Course List</p>
                    </li>
                  </NavLink>
                  {userAccess[5]?.Add === 1 && <>
                  <NavLink to="/admin/courses/addcourse">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Add Course</p>
                    </li>
                  </NavLink>
                  </>}
                </ul>
              </div>
            </div>

            </>}

                {/* )} */}

                {userAccess[9]?.Module === 1 && <>

                <li
                  className="row"
                  onClick={() => setShowContentDropdown(!showContentDropdown)}
                >
                  <div id="icon">
                    <MonitorIcon />
                  </div>
                  <p id="title">Contents</p>
                  {showContentDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showContentDropdown && ( */}
                <div
                  className={`dropdown ${showContentDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/pages/index">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Pages List</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>

                </>}

                {/* )} */}
                { userAccess[10]?.Module === 1 && <>

                <li
              className="row"
              onClick={() =>
                setShowEmailTemplateDropdown(!showEmailTemplateDropdown)
              }
            >
              <div id="icon">
                <EmailIcon />
              </div>
              <p id="title">Email Templates</p>
              {showEmailTemplateDropdown ? (
                <div id="icon2">
                  <RemoveIcon />
                </div>
              ) : (
                <div id="icon2">
                  <AddIcon />
                </div>
              )}
            </li>
                {/* {showEmailTemplateDropdown && ( */}
                <div
              className={`dropdown ${
                showEmailTemplateDropdown ? "open" : ""
              }`}
            >
              <div className="dropdown-item">
                <ul className="SidebarListInternal">
                  <NavLink to="/admin/emailtemplates">
                    <li className="row">
                      <div id="innerIcon">
                        <RadioButtonCheckedIcon />
                      </div>
                      <p id="innerTitle">Email Template Setting</p>
                    </li>
                  </NavLink>
                </ul>
              </div>
            </div>

            </>}

                {/* )} */}

                { userAccess[6]?.Module === 1 && <>

                <li
                  className="row"
                  onClick={() => setShowBlogsDropdown(!showBlogsDropdown)}
                >
                  <div id="icon">
                    <RateReviewIcon />
                  </div>
                  <p id="title">Blogs</p>
                  {showBlogsDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showBlogsDropdown && ( */}
                <div className={`dropdown ${showBlogsDropdown ? "open" : ""}`}>
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/blogs">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Blog List</p>
                        </li>
                      </NavLink>
                      {userAccess[6]?.Add === 1 && <>
                      <NavLink to="/admin/blogs/addblogs">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Add Blog</p>
                        </li>
                      </NavLink>
                      </>}
                    </ul>
                  </div>
                </div>

                </>}

                {/* )} */}
                {/* <li
                  className="row"
                  onClick={() => setShowSlidersDropdown(!showSlidersDropdown)}
                >
                  <div id="icon">
                    <ViewCarouselIcon />
                  </div>
                  <p id="title">Sliders</p>
                  {showSlidersDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li> */}
                {/* {showSlidersDropdown && ( */}
                {/* <div
                  className={`dropdown ${showSlidersDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/sliders">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Slider List</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/sliders/add">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Add Slider</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div> */}
                {/* )} */}
                {/* <li
                  className="row"
                  onClick={() =>
                    setShowAnnouncementDropdown(!showAnnouncementDropdown)
                  }
                >
                  <div id="icon">
                    <CampaignIcon />
                  </div>
                  <p id="title">Announcement</p>
                  {showAnnouncementDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li> */}
                {/* {showAnnouncementDropdown && ( */}
                {/* <div
                  className={`dropdown ${
                    showAnnouncementDropdown ? "open" : ""
                  }`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/announcements">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Announcement List</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/announcements/add">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Add Announcement</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div> */}
                {/* )} */}
                {/* <li
                  className="row"
                  onClick={() => setShowKeywordsDropdown(!showKeywordsDropdown)}
                >
                  <div id="icon">
                    <FindInPageIcon />
                  </div>
                  <p id="title">Keywords</p>
                  {showKeywordsDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li> */}
                {/* {showKeywordsDropdown && ( */}
                {/* <div
                  className={`dropdown ${showKeywordsDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/keywords">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Search Keywords</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/keywords/jobs">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Job Keywords</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/keywords/requests">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Requested Keywords</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div> */}
                {/* )} */}
              </ul>
            </div>
          ) : (
            <div className="Sidebar adminSidebarNavLinks">
              <div className="sidebarEachHeader">
                <h3>Menu</h3>
                <NavLink className="adminSidebarPlusNavLink" onClick={toggle1}>
                  {isJobseekerNavLinksVisible ? (
                    <i class="fa-solid fa-circle-minus"></i>
                  ) : (
                    <i class="fa-solid fa-circle-plus"></i>
                  )}
                </NavLink>
              </div>
              <ul
                className="SidebarList"
                style={{
                  display: isJobseekerNavLinksVisible ? "block" : "none",
                }}
              >
                <NavLink to="/admin/admins/dashboard">
                  <li className="row">
                    <div id="icon">
                      <DashboardIcon />
                    </div>
                    <p id="title">Dashboard</p>
                  </li>
                </NavLink>

                <li
                  className="row"
                  onClick={() =>
                    setShowConfigurationDropdown(!showConfigurationDropdown)
                  }
                >
                  <div id="icon">
                    <PermDataSettingIcon />
                  </div>
                  <p id="title">Configuration</p>
                  {showConfigurationDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showConfigurationDropdown && ( */}
                <div
                  className={`dropdown ${
                    showConfigurationDropdown ? "open" : ""
                  }`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/admins/changeusername">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Username</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changepassword">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Password</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changeemail">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Email</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/securityQuestions">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Security Questions</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/plans/index">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Manage Plans</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/settings">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Set Contact Us Address</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changeSlogan">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Slogan Text</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/uploadLogo">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Logo</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changeFavicon">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Favicon</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changecolorscheme">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Color Theme</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/changePaymentdetail">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Payment Details</p>
                        </li>
                      </NavLink>

                      <NavLink>
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Change Color Theme</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/metaManagement">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Meta Management</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/admins/manage">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Manage Sub Admins</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/smtpsettings/configuration">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">SMTP Setting</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}

                <li
                  className="row"
                  onClick={() => setShowSettingDropdown(!showSettingDropdown)}
                >
                  <div id="icon">
                    <SettingsApplicationsIcon />
                  </div>
                  <p id="title">Setting</p>
                  {showSettingDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showSettingDropdown && ( */}
                <div
                  className={`dropdown ${showSettingDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/settings/siteSettings">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Site Setting</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/settings/manageMails">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Manage Email Setting</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() => setShowEmployerDropdown(!showEmployerDropdown)}
                >
                  <div id="icon">
                    <BadgeIcon />
                  </div>
                  <p id="title">Employers</p>
                  {showEmployerDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showEmployerDropdown && ( */}
                <div
                  className={`dropdown ${showEmployerDropdown ? "open" : ""}`}
                >
                  <div
                    className="dropdown-item"
                    onClick={() => console.log("Change Username clicked")}
                  >
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/users">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Employer List</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/users/addusers">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Add Employer</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/users/selectforslider">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Home Page Slider</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() =>
                    setShowJobseekerDropdown(!showJobseekerDropdown)
                  }
                >
                  <div id="icon">
                    <GroupIcon />
                  </div>
                  <p id="title">Jobseeker</p>
                  {showJobseekerDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showJobseekerDropdown && ( */}
                <div
                  className={`dropdown ${showJobseekerDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/candidates">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Jobseekers List</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/candidates/addcandidates">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Add Jobseekers</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() =>
                    setShowCategoriesDropdown(!showCategoriesDropdown)
                  }
                >
                  <div id="icon">
                    <CategoryIcon />
                  </div>
                  <p id="title">Categories</p>
                  {showCategoriesDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showCategoriesDropdown && ( */}
                <div
                  className={`dropdown ${showCategoriesDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/categories">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Categories List</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/categories/addcategory">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Add Category</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() =>
                    setShowSwearwordsDropdown(!showSwearwordsDropdown)
                  }
                >
                  <div id="icon">
                    <AbcIcon />
                  </div>
                  <p id="title">Swear Words</p>
                  {showSwearwordsDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showSwearwordsDropdown && ( */}
                <div
                  className={`dropdown ${showSwearwordsDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/swears">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Swear Words List</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/swears/addswears">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Add Swear Words</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
                >
                  <div id="icon">
                    <AddchartIcon />
                  </div>
                  <p id="title">Skills</p>
                  {showSkillsDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showSkillsDropdown && ( */}
                <div className={`dropdown ${showSkillsDropdown ? "open" : ""}`}>
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/skills">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Skills List</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/skills/addskills">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Add Skills</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() =>
                    setShowDesignationsDropdown(!showDesignationsDropdown)
                  }
                >
                  <div id="icon">
                    <SchoolIcon />
                  </div>
                  <p id="title">Designations</p>
                  {showDesignationsDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showDesignationsDropdown && ( */}
                <div
                  className={`dropdown ${
                    showDesignationsDropdown ? "open" : ""
                  }`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/designations">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Designations List</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/designations/adddesignations">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Add Designations</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() => setShowJobsDropdown(!showJobsDropdown)}
                >
                  <div id="icon">
                    <WorkIcon />
                  </div>
                  <p id="title">Jobs</p>
                  {showJobsDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showJobsDropdown && ( */}
                <div className={`dropdown ${showJobsDropdown ? "open" : ""}`}>
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/jobs">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Jobs List</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/jobs/addjob">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Add Job</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/jobs/import">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Import Job</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/jobs/importlist">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Auto Job Import List</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() =>
                    setShowPaymentHistoryDropdown(!showPaymentHistoryDropdown)
                  }
                >
                  <div id="icon">
                    <PaymentIcon />
                  </div>
                  <p id="title">Payment History</p>
                  {showPaymentHistoryDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showPaymentHistoryDropdown && ( */}
                <div
                  className={`dropdown ${
                    showPaymentHistoryDropdown ? "open" : ""
                  }`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/payments/history">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Transaction List</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                >
                  <div id="icon">
                    <PaidIcon />
                  </div>
                  <p id="title">Currency</p>
                  {showCurrencyDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showCurrencyDropdown && ( */}
                <div
                  className={`dropdown ${showCurrencyDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/currencies">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Currency List</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/currencies/add">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Add Currency</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() =>
                    setShowNewsletterDropdown(!showNewsletterDropdown)
                  }
                >
                  <div id="icon">
                    <UnsubscribeIcon />
                  </div>
                  <p id="title">Manage Newsletter</p>
                  {showNewsletterDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showNewsletterDropdown && ( */}
                <div
                  className={`dropdown ${showNewsletterDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/newsletters/index">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Newsletter List</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/newsletters/sendNewsletter">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Send Newsletter Email</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/newsletters/sentMail">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Email Logs</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/newsletters/unsubscriberlist">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Unsubscribe User List</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() =>
                    setShowBannerAdvertisementDropdown(
                      !showBannerAdvertisementDropdown
                    )
                  }
                >
                  <div id="icon">
                    <FeaturedVideoIcon />
                  </div>
                  <p id="title">Banner Advertisement</p>
                  {showBannerAdvertisementDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showBannerAdvertisementDropdown && ( */}
                <div
                  className={`dropdown ${
                    showBannerAdvertisementDropdown ? "open" : ""
                  }`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/banneradvertisements">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Banner List</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/banneradvertisements/addBanneradvertisement">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Add Banner</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                >
                  <div id="icon">
                    <LibraryBooksIcon />
                  </div>
                  <p id="title">Course</p>
                  {showCourseDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showCourseDropdown && ( */}
                <div className={`dropdown ${showCourseDropdown ? "open" : ""}`}>
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/courses">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Course List</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/courses/addcourse">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Add Course</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() => setShowContentDropdown(!showContentDropdown)}
                >
                  <div id="icon">
                    <MonitorIcon />
                  </div>
                  <p id="title">Contents</p>
                  {showContentDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showContentDropdown && ( */}
                <div
                  className={`dropdown ${showContentDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/pages/index">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Pages List</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() =>
                    setShowEmailTemplateDropdown(!showEmailTemplateDropdown)
                  }
                >
                  <div id="icon">
                    <EmailIcon />
                  </div>
                  <p id="title">Email Templates</p>
                  {showEmailTemplateDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showEmailTemplateDropdown && ( */}
                <div
                  className={`dropdown ${
                    showEmailTemplateDropdown ? "open" : ""
                  }`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/emailtemplates">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Email Template Setting</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() => setShowBlogsDropdown(!showBlogsDropdown)}
                >
                  <div id="icon">
                    <RateReviewIcon />
                  </div>
                  <p id="title">Blogs</p>
                  {showBlogsDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showBlogsDropdown && ( */}
                <div className={`dropdown ${showBlogsDropdown ? "open" : ""}`}>
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/blogs">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Blog List</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/blogs/addblogs">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Add Blog</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() => setShowSlidersDropdown(!showSlidersDropdown)}
                >
                  <div id="icon">
                    <ViewCarouselIcon />
                  </div>
                  <p id="title">Sliders</p>
                  {showSlidersDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showSlidersDropdown && ( */}
                <div
                  className={`dropdown ${showSlidersDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/sliders">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Slider List</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/sliders/add">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Add Slider</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() =>
                    setShowAnnouncementDropdown(!showAnnouncementDropdown)
                  }
                >
                  <div id="icon">
                    <CampaignIcon />
                  </div>
                  <p id="title">Announcement</p>
                  {showAnnouncementDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showAnnouncementDropdown && ( */}
                <div
                  className={`dropdown ${
                    showAnnouncementDropdown ? "open" : ""
                  }`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/announcements">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Announcement List</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/announcements/add">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Add Announcement</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
                <li
                  className="row"
                  onClick={() => setShowKeywordsDropdown(!showKeywordsDropdown)}
                >
                  <div id="icon">
                    <FindInPageIcon />
                  </div>
                  <p id="title">Keywords</p>
                  {showKeywordsDropdown ? (
                    <div id="icon2">
                      <RemoveIcon />
                    </div>
                  ) : (
                    <div id="icon2">
                      <AddIcon />
                    </div>
                  )}
                </li>
                {/* {showKeywordsDropdown && ( */}
                <div
                  className={`dropdown ${showKeywordsDropdown ? "open" : ""}`}
                >
                  <div className="dropdown-item">
                    <ul className="SidebarListInternal">
                      <NavLink to="/admin/keywords">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Search Keywords</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/keywords/jobs">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Job Keywords</p>
                        </li>
                      </NavLink>
                      <NavLink to="/admin/keywords/requests">
                        <li className="row">
                          <div id="innerIcon">
                            <RadioButtonCheckedIcon />
                          </div>
                          <p id="innerTitle">Requested Keywords</p>
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                </div>
                {/* )} */}
              </ul>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default APSidebar;
