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

const APChangePassword = () => {
  const [userData, setUserData] = useState({
    old_password: "",
    new_password: "",
    conf_password: "",
  });
  const [errors, setErrors] = useState({
    old_password: "",
    new_password: "",
    conf_password: "",
  });
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("token");
  const userType = Cookies.get("usertype");
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

  const handleClick = async () => {
    try {
      const newErrors = {};

      if (userData.old_password === "") {
        newErrors.old_password = "Old password is required";
      }
      if (userData.new_password === "") {
        newErrors.new_password = "New password is required";
      } else if (userData.new_password.length < 8) {
        newErrors.new_password = "Please enter atleast 8 characters";
      }
      if (userData.conf_password === "") {
        newErrors.conf_password = "Confirm password is required";
      } else if (userData.conf_password.length < 8) {
        newErrors.conf_password = "Please enter atleast 8 characters";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Update Password",
          text: "Do you want to update the password?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (confirmationResult.isConfirmed) {
          setLoading(true);

          const response = await axios.post(
            BaseApi + "/admin/changePassword",
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
              title: "Password updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            setUserData({
              ...userData,
              old_password: "",
              new_password: "",
              conf_password: "",
            });
            window.scrollTo(0, 0);
          } else if (response.data.status === 500) {
            Swal.fire({
              title: response.data.message,
              icon: "error",
              confirmButtonText: "Close",
            });
          } else {
            Swal.fire({
              title: response.data.message,
              icon: "error",
              confirmButtonText: "Close",
            });
          }
        }
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not update password. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not change password!", error);
    }
  };

  useEffect(() => {
    // Check if tokenKey is not present
    if (!tokenKey) {
      // Redirect to the home page
      navigate("/admin");
    } else {
      // TokenKey is present, fetch data or perform other actions
      // getData();
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

                  <Typography color="text.primary">Change Password</Typography>
                </Breadcrumbs>
              </div>
              <h2 className="adminPageHeading">Change Admin Password</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Current Password<span className="RedStar">*</span>
                    </label>
                    <input
                      type="password"
                      id="form3Example1"
                      className={`form-control ${
                        errors.old_password && "input-error"
                      }`}
                      name="old_password"
                      placeholder="Current Password"
                      value={userData.old_password}
                      onChange={handleChange}
                    />
                    {errors.old_password && (
                      <div className="text-danger">{errors.old_password}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      New Password<span className="RedStar">*</span>
                    </label>
                    <input
                      type="password"
                      id="form3Example1"
                      className={`form-control ${
                        errors.new_password && "input-error"
                      }`}
                      name="new_password"
                      placeholder="New Password"
                      value={userData.new_password}
                      onChange={handleChange}
                    />
                    {errors.new_password && (
                      <div className="text-danger">{errors.new_password}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Confirm Password<span className="RedStar">*</span>
                    </label>
                    <input
                      type="password"
                      id="form3Example1"
                      className={`form-control ${
                        errors.conf_password && "input-error"
                      }`}
                      name="conf_password"
                      placeholder="Confirm Password"
                      value={userData.conf_password}
                      onChange={handleChange}
                    />
                    {errors.conf_password && (
                      <div className="text-danger">{errors.conf_password}</div>
                    )}
                  </div>
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
              </form>
            </div>
            <APFooter />
          </>
        )}
      </div>
    </>
  );
};

export default APChangePassword;
