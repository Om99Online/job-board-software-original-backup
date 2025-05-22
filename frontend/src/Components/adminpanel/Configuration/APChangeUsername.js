import React, { useEffect, useState } from "react";
import APNavBar from "../Elements/APNavBar";
import APSidebar from "../APSidebar/APSidebar";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axios from "axios";
import BaseApi from "../../api/BaseApi";
import ApiKey from "../../api/ApiKey";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import APFooter from "../Elements/APFooter";

const APChangeUsername = () => {
  const [userData, setUserData] = useState({
    new_username: "",
    conf_username: "",
  });
  const [errors, setErrors] = useState({
    new_username: "",
    conf_username: "",
  });
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/admin/changeusername",
        null,
        {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            token: tokenKey,
            adminid: adminID,
          },
        }
      );
      setLoading(false);
      setUserData(response.data.response);
    } catch (error) {
      console.log("Error at chnage username at Admin panel");
    }
  };

  const handleClick = async () => {
    try {
      const { new_username, conf_username } = userData;

      // Check if email fields are empty
      if (!new_username || !conf_username) {
        setErrors({
          new_username: new_username ? "" : "New Username is required",
          conf_username: conf_username ? "" : "Confirm Username is required",
        });
        return;
      }

      // Check if new email and confirm email match
      if (new_username !== conf_username) {
        setErrors({
          conf_username: "New Username and Confirm Username do not match",
        });
        return;
      }

      // Check for valid email format
      // const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // if (!emailFormat.test(new_email) || !emailFormat.test(conf_email)) {
      //   setErrors({
      //     new_email: 'Invalid Email Address',
      //     conf_email: 'Invalid Email Address',
      //   });
      //   return;
      // }
      const confirmationResult = await Swal.fire({
        title: "Update Username",
        text: "Do you want to update the username?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (confirmationResult.isConfirmed) {
        setLoading(true);

        const response = await axios.post(
          BaseApi + "/admin/changeusername",
          userData,
          {
            headers: {
              "Content-Type": "application/json",
              key: ApiKey,
              token: tokenKey,
              adminid: adminID,
            },
          }
        );

        setLoading(false);

        if (response.data.status === 200) {
          Swal.fire({
            title: "Username updated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          getData();
          setUserData({
            ...userData,
            new_username: "",
            conf_username: "",
          });
          window.scrollTo(0, 0);
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
      }
      // }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not update username. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not change username!", error);
    }
  };

  useEffect(() => {
    // Check if tokenKey is not present
    if (!tokenKey) {
      // Redirect to the home page
      navigate("/admin");
    } else {
      // TokenKey is present, fetch data or perform other actions
      getData();
      window.scrollTo(0, 0);
    }
  }, [tokenKey, navigate]);

  return (
    <>
      <APNavBar />
      <div className="APBasic">
        <APSidebar />

        {loading ? (
          <>
            <div className="loader-container"></div>
          </>
        ) : (
          <>
            <div className="site-min-height">
              <div className="breadCumb1" role="presentation">
                <Breadcrumbs
                  aria-label="breadcrumb"
                  separator={<NavigateNextIcon fontSize="small" />}
                >
                  <Link
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate("/admin/admins/dashboard")}
                  >
                    Dashboard
                  </Link>
                  <Typography color="text.primary">Change Username</Typography>
                </Breadcrumbs>
              </div>

              <h2 className="adminPageHeading">Change Admin Username</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Current Username<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className="form-control"
                      name="username"
                      placeholder="Current Username"
                      value={userData.username}
                      disabled
                    />
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      New Username<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.new_username && "input-error"
                      }`}
                      name="new_username"
                      placeholder="New Username"
                      value={userData.new_username}
                      onChange={handleChange}
                    />
                    {errors.new_username && (
                      <div className="text-danger">{errors.new_username}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Confirm Username<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.conf_username && "input-error"
                      }`}
                      name="conf_username"
                      placeholder="Confirm Username"
                      value={userData.conf_username}
                      onChange={handleChange}
                    />
                    {errors.conf_username && (
                      <div className="text-danger">{errors.conf_username}</div>
                    )}
                  </div>
                  <div className="adminLowerButtons">
                    <button
                      type="button"
                      className="btn btn-primary button1"
                      onClick={handleClick}
                    >
                      UPDATE
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary button2"
                      onClick={() => navigate("/admin/admins/dashboard")}
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <APFooter />
          </>
        )}
      </div>
    </>
  );
};

export default APChangeUsername;
