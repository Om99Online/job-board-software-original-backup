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

const APChangeEmail = () => {
  const [userData, setUserData] = useState({
    old_email: "",
    new_email: "",
    conf_email: "",
  });
  const [errors, setErrors] = useState({
    new_email: "",
    conf_email: "",
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
      const response = await axios.post(BaseApi + "/admin/changeemail", null, {
        headers: {
          "Content-Type": "application/json",
          key: ApiKey,
          token: tokenKey,
          adminid: adminID,
        },
      });
      setLoading(false);
      setUserData(response.data.response);
    } catch (error) {
      console.log("Error at change username at Admin panel");
    }
  };

  const handleClick = async () => {
    try {
      const { new_email, conf_email } = userData;

      // Check if email fields are empty
      if (!new_email || !conf_email) {
        setErrors({
          new_email: new_email ? "" : "New Email is required",
          conf_email: conf_email ? "" : "Confirm Email is required",
        });
        return;
      }

      // Check if new email and confirm email match
      if (new_email !== conf_email) {
        setErrors({
          conf_email: "New Email and Confirm Email do not match",
        });
        return;
      }

      // Check for valid email format
      const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailFormat.test(new_email) || !emailFormat.test(conf_email)) {
        setErrors({
          new_email: "Invalid Email Address",
          conf_email: "Invalid Email Address",
        });
        return;
      }

      const confirmationResult = await Swal.fire({
        title: "Update Email",
        text: "Do you want to update the email?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (confirmationResult.isConfirmed) {
        setLoading(true);

        const response = await axios.post(
          BaseApi + "/admin/changeemail",
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
            title: "Email updated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          getData();
          // setUserData({
          //   ...userData,
          //   old_email: "",
          //   new_email: "",
          //   conf_email: "",
          // });
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
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not update email. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not change email!", error);
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

                  <Typography color="text.primary">Change Email</Typography>
                </Breadcrumbs>
              </div>
              <h2 className="adminPageHeading">Change Admin Email</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Current Email<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className="form-control"
                      name="old_email"
                      placeholder="Current Email"
                      value={userData.old_email}
                      disabled
                    />
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      New Email<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.new_email && "input-error"
                      }`}
                      name="new_email"
                      placeholder="New Email"
                      value={userData.new_email}
                      onChange={handleChange}
                    />
                    {errors.new_email && (
                      <div className="text-danger">{errors.new_email}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Confirm Email<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.conf_email && "input-error"
                      }`}
                      name="conf_email"
                      placeholder="Confirm Email"
                      value={userData.conf_email}
                      onChange={handleChange}
                    />
                    {<errors className="conf"></errors> && (
                      <div className="text-danger">{errors.conf_email}</div>
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

export default APChangeEmail;
