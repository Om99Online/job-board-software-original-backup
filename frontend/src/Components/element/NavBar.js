import axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import Swal from "sweetalert2";
import PersonIcon from "@mui/icons-material/Person";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
// import PersonIcon from '@mui/icons-material/Person';

const NavBar = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [dynamicBlogActive, setDynamicBlogActive] = useState(false);

  const [login, setLogin] = useState(false);
  const [userName, setUserName] = useState();
  const [userType, setUserType] = useState();
  const [t, i18n] = useTranslation("global");

  const isUkrainian = () => {
    return i18n.language === "ukr";
  };

  const isGreek = () => {
    return i18n.language === "el";
  }

  // Use the isUkrainian function to conditionally add padding to navitems class
  const getNavItemsClass = () => {
    if(isGreek()){
      return "navitemsUkr";
    }
    if(isUkrainian()){
      return "navitemsUkr";
    }
    return "navitems";
  };

  // const [navLogo, setNavLogo] = useState();
  const [hoverLoginColor, setHoverLoginColor] = useState(false);

  const handleLoginMouseEnter = () => {
    setHoverLoginColor(true);
  };

  const handleLoginMouseLeave = () => {
    setHoverLoginColor(false);
  };

  const [hoverRegisterColor, setHoverRegisterColor] = useState(false);

  const handleRegisterMouseEnter = () => {
    setHoverRegisterColor(true);
  };

  const handleRegisterMouseLeave = () => {
    setHoverRegisterColor(false);
  };

  const [hoverNavLink1Color, setHoverNavLink1Color] = useState(false);
  const [hoverNavLink2Color, setHoverNavLink2Color] = useState(false);

  const [hoverNavLink3Color, setHoverNavLink3Color] = useState(false);

  const [hoverNavLink4Color, setHoverNavLink4Color] = useState(false);
  const [hoverNavLink5Color, setHoverNavLink5Color] = useState(false);
  const [hoverNavLink6Color, setHoverNavLink6Color] = useState(false);
  const [hoverNavLink7Color, setHoverNavLink7Color] = useState(false);

  const handleNavLink1MouseEnter = () => {
    setHoverNavLink1Color(true);
  };

  const handleNavLink1MouseLeave = () => {
    setHoverNavLink1Color(false);
  };
  const handleNavLink2MouseEnter = () => {
    setHoverNavLink2Color(true);
  };

  const handleNavLink2MouseLeave = () => {
    setHoverNavLink2Color(false);
  };
  const handleNavLink3MouseEnter = () => {
    setHoverNavLink3Color(true);
  };

  const handleNavLink3MouseLeave = () => {
    setHoverNavLink3Color(false);
  };
  const handleNavLink4MouseEnter = () => {
    setHoverNavLink4Color(true);
  };

  const handleNavLink4MouseLeave = () => {
    setHoverNavLink4Color(false);
  };
  const handleNavLink5MouseEnter = () => {
    setHoverNavLink5Color(true);
  };

  const handleNavLink5MouseLeave = () => {
    setHoverNavLink5Color(false);
  };
  const handleNavLink6MouseEnter = () => {
    setHoverNavLink6Color(true);
  };

  const handleNavLink6MouseLeave = () => {
    setHoverNavLink6Color(false);
  };
  const handleNavLink7MouseEnter = () => {
    setHoverNavLink7Color(true);
  };

  const handleNavLink7MouseLeave = () => {
    setHoverNavLink7Color(false);
  };

  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  let siteLogo = Cookies.get("siteLogo");
  const adminID = Cookies.get("adminID");

  // const getData = async () => {
  //   try {
  //     const response = await axios.get(BaseApi + "/getconstant");
  //     setNavLogo(response.data.response.site_logo);
  //     setConstantData(response.data.response);

  //   } catch (error) {
  //     console.log("Error getting navbar logo information!");
  //   }
  // };
  useEffect(() => {
    // getData();
    // window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const url = window.location.href;

    if (url.includes("dynamicblogpage")) {
      // console.log("The URL contains 'dynamicblogpage'.");
      setDynamicBlogActive(true);
      // You can add your logic here if the condition is met.
    } else {
      setDynamicBlogActive(false);
      // console.log("The URL does not contain 'dynamicblogpage'.");
      // You can add an alternative logic here if the condition is not met.
    }
  }, []);

  // const tokenKey = sessionStorage.getItem("token");
  const navSetter = () => {
    if (tokenKey) {
      setUserName(Cookies.get("fname"));
      setUserType(Cookies.get("user_type"));
      setLogin(true);
    }
  };

  let fname = Cookies.get("fname");

  const tokenKey = Cookies.get("tokenClient");

  useEffect(() => {
    navSetter();
  }, []);

  const handleLogOut = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: t("navHeaders.logout"),
        text: t("navHeaders.logoutConfirmTxt"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("navHeaders.yes"),
        cancelButtonText: t("navHeaders.no"),
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
        window.location.reload();
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
          title: t("navHeaders.successTitle"),
        });
      }
    } catch (error) {
      Swal.fire({
        title: t("navHeaders.failedTitle"),
        icon: "error",
        confirmButtonText: t("navHeaders.close"),
      });
      // console.log("Cannot log out!");
    }
  };

  const handleClick = (navItem) => {
    setActiveItem(navItem);
  };

  return (
    <Navbar expand="lg" className="defaultnavbar">
      <Container className="">
        <NavLink to="/">
          <Navbar.Brand>
            {siteLogo && (
              <img className="frontendNavLogo" src={siteLogo} alt="Logo" />
            )}
            {!siteLogo && (
              <img
                className="frontendNavLogo"
                src="/Images/logo.png"
                alt="Logo"
              />
            )}
          </Navbar.Brand>
        </NavLink>

        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="navbardefault">
          <Nav
            className="ms-auto my-2 my-lg-0 navigation"
            navbarScroll
            style={{ fontSize: "18px" }}
          >
            <NavLink
              to="/"
              exact
              activeClassName="active" // Add the "active" class when the link is active
              className={getNavItemsClass()}
              style={{
                color: hoverNavLink1Color ? primaryColor : "",
              }}
              onMouseEnter={handleNavLink1MouseEnter}
              onMouseLeave={handleNavLink1MouseLeave}
            >
              {t("navHeaders.home")}
            </NavLink>
            <NavLink
              to="/aboutus"
              activeClassName="active" // Add the "active" class when the link is active
              className={getNavItemsClass()}
              style={{
                color: hoverNavLink2Color ? primaryColor : "",
              }}
              onMouseEnter={handleNavLink2MouseEnter}
              onMouseLeave={handleNavLink2MouseLeave}
            >
              {t("navHeaders.aboutus")}
            </NavLink>
            {userType === "recruiter" && (
              <NavLink
                to="/candidates/listing"
                activeClassName="active" // Add the "active" class when the link is active
                className={getNavItemsClass()}
                style={{
                  color: hoverNavLink3Color ? primaryColor : "",
                }}
                onMouseEnter={handleNavLink3MouseEnter}
                onMouseLeave={handleNavLink3MouseLeave}
              >
                {t("navHeaders.jobseekers")}
              </NavLink>
            )}

            <NavLink
              to="/how-it-works"
              activeClassName="active" // Add the "active" class when the link is active
              className={getNavItemsClass()}
              style={{
                color: hoverNavLink4Color ? primaryColor : "",
              }}
              onMouseEnter={handleNavLink4MouseEnter}
              onMouseLeave={handleNavLink4MouseLeave}
            >
              {t("navHeaders.howitworks")}
            </NavLink>

            <NavLink
              to="/blog"
              activeClassName="active"
              className={`${getNavItemsClass()} ${
                dynamicBlogActive && "navbardefault active"
              }`}
              style={{
                color: hoverNavLink5Color ? primaryColor : "",
              }}
              onMouseEnter={handleNavLink5MouseEnter}
              onMouseLeave={handleNavLink5MouseLeave}
            >
              {t("navHeaders.blog")}
            </NavLink>

            <NavLink
              to="/faq"
              activeClassName="active" // Add the "active" class when the link is active
              className={getNavItemsClass()}
              style={{
                color: hoverNavLink6Color ? primaryColor : "",
              }}
              onMouseEnter={handleNavLink6MouseEnter}
              onMouseLeave={handleNavLink6MouseLeave}
            >
              {t("navHeaders.faq")}
            </NavLink>
            <NavLink
              to="/contact"
              activeClassName="active" // Add the "active" class when the link is active
              className={getNavItemsClass()}
              style={{
                color: hoverNavLink7Color ? primaryColor : "",
              }}
              onMouseEnter={handleNavLink7MouseEnter}
              onMouseLeave={handleNavLink7MouseLeave}
            >
              {t("navHeaders.contactus")}
            </NavLink>
            <NavLink
              to="/searchjob"
              activeClassName="active"
              onClick={() => setSearchActive(true)} // Set the active state manually
              className="SearchIcon"
            >
              <i>
                <img
                  className="ms-3 me-2"
                  src="/Images/searchnavicon.png"
                  alt="Logo"
                />
              </i>
            </NavLink>

            {login ? (
              <>
                {userType === "recruiter" && (
                  <>
                    <NavLink
                      to="/user/myprofile"
                      activeClassName="active" // Add the "active" class when the link is active
                      className={getNavItemsClass()}
                    >
                      {/* <i className="fa-solid fa-user me-2"></i> */}
                      <PersonIcon className="me-1 pb-1" />
                      {userName}
                    </NavLink>
                    <Link
                      onClick={handleLogOut}
                      activeClassName="" // Add the "active" class when the link is active
                      className={getNavItemsClass()}
                    >
                      {t("navHeaders.logout")}
                    </Link>
                  </>
                )}
                {userType === "candidate" && (
                  <>
                    <NavLink
                      to="/candidates/myaccount"
                      activeClassName="active" // Add the "active" class when the link is active
                      className="navitems navUsername"
                    >
                      {/* <i className="fa-solid fa-user me-2"></i> */}
                      <PersonIcon className="me-1 pb-1" />
                      {userName}
                    </NavLink>
                    <Link
                      onClick={handleLogOut}
                      activeClassName="active" // Add the "active" class when the link is active
                      className="navitems"
                    >
                      {t("navHeaders.logout")}
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="dropdown">
                  <button
                    className="btn navButton1 dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      backgroundColor: hoverLoginColor
                        ? secondaryColor
                        : primaryColor,
                      border: hoverLoginColor ? secondaryColor : primaryColor,
                      fontWeight: "500",
                      fontSize: "16px",
                      padding: "11px 25px",
                      borderRadius: "3px",
                      marginLeft: "15px",
                      minWidth: "135px",
                      color: "white",
                    }}
                    onMouseEnter={handleLoginMouseEnter}
                    onMouseLeave={handleLoginMouseLeave}
                  >
                    {t("navHeaders.login")}
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/user/employerlogin" className="dropdown-item">
                        {t("navHeaders.employerLogin")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/user/jobseekerlogin" className="dropdown-item">
                        {t("navHeaders.jobseekerLogin")}
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="dropdown mx-2">
                  <button
                    className="btn navButton2 dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      color: hoverRegisterColor ? primaryColor : secondaryColor,
                      backgroundColor: "white",
                      border: hoverRegisterColor
                        ? `2px solid ${primaryColor}`
                        : `2px solid ${secondaryColor}`,
                      fontSize: "16px",
                      padding: "9px 25px",
                      borderRadius: "3px",
                      marginLeft: "15px",
                      fontWeight: "500",
                    }}
                    onMouseEnter={handleRegisterMouseEnter}
                    onMouseLeave={handleRegisterMouseLeave}
                  >
                    {t("navHeaders.register")}
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        to="/user/register/employer"
                        className="dropdown-item"
                      >
                        {t("navHeaders.employerRegister")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/user/register/jobseeker"
                        className="dropdown-item"
                      >
                        {t("navHeaders.jobseekerRegister")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
