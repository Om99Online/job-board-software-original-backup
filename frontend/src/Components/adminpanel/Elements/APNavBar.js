import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, Navigate, useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import Cookies from "js-cookie";

const APNavBar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    try {
      
      Cookies.remove("token");
      Cookies.remove("adminName");
      Cookies.remove("adminuser_type");
      Cookies.remove("adminID");

      navigate("/admin");
      window.location.reload();
    } catch (error) {
      console.log("Couldn't log out");
    }
  };

  let siteLogo = Cookies.get("siteLogo");
  let adminID = Cookies.get("adminID");
  let adminName = Cookies.get("adminName");

  return (
    <div className="APNavbar">
      <Navbar expand="lg" className="defaultnavbar">
        {/* <Container className=""> */}
        <div className="APNavSectionLeft">
          <Link to="/admin/admins/dashboard">
            <Navbar.Brand>
              {siteLogo && (
                <img className="adminNavLogo" src={siteLogo} alt="Logo" />
              )}
              {!siteLogo && (
                <img
                  className="adminNavLogo"
                  src="/Images/logo.png"
                  alt="Logo"
                />
              )}
            </Navbar.Brand>
          </Link>
        </div>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="navbardefault">
          <Nav
            className="ms-auto my-2 my-lg-0 navigation"
            navbarScroll
            style={{ fontSize: "18px" }}
          >
            <div className="APNavSectionRight">
              <div className="part1">
                <Link to="/admin/users" className="SearchIcon">
                  <i>
                    <img src="/Images/adminpanel/search.svg" alt="Search" />
                  </i>
                </Link>
                <Link to="" className="bellIndicator">
                  <i>
                    <img
                      className="bell"
                      src="/Images/adminpanel/bell.svg"
                      alt="Bell"
                    />
                  </i>
                  <i>
                    <img
                      className="indicator"
                      src="/Images/adminpanel/indicator.svg"
                      alt="Bell"
                    />
                  </i>
                </Link>
              </div>

              <div className="part2">
                <div className="APNavInner1">
                  <Link to="/admin/admins/dashboard" className="SearchIcon">
                    {/* <i>
                      <img src="/Images/adminpanel/avatar.png" alt="Avatar" />
                    </i> */}
                  </Link>
                </div>
                <div className="APNavInner3">
                  <div class="dropdown">
                    <Link
                      class="dropdown-toggle SearchIcon"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {adminID === "1" && "Admin"}
                      {adminID !== "1" && adminName}
                    </Link>
                    <ul
                      class="dropdown-menu custom-dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <div className="row">
                        <div className="dropdownMenu col-md-4 text-black">
                          <Link to="/admin/admins/changeusername">
                            <PersonIcon />
                            Change Username
                          </Link>
                        </div>
                        <div className="dropdownMenu col-md-4">
                          <Link to="/admin/admins/changepassword">
                            <LockIcon />
                            Change Password
                          </Link>
                        </div>
                        <div className="dropdownMenu col-md-4">
                          <Link to="/admin/admins/changeemail">
                            <EmailIcon />
                            Change Email
                          </Link>
                        </div>
                      </div>
                      <Link onClick={() => handleLogout()}>
                        <div className="dropdownMenuLower row">
                          <div className="col-md-12">
                            <KeyIcon />
                            Logout
                          </div>
                        </div>
                      </Link>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Nav>
        </Navbar.Collapse>
        {/* </Container> */}
      </Navbar>
    </div>
  );
};

export default APNavBar;
