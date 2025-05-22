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

const APSMTPsettings = () => {
  const [userData, setUserData] = useState({
    is_smtp: "",
    smtp_host: "",
    smtp_username: "",
    smtp_password: "",
    smtp_port: "",
    smtp_timeout: "",
  });
  const [errors, setErrors] = useState({
    smtp_host: "",
    smtp_username: "",
    smtp_password: "",
    smtp_port: "",
    smtp_timeout: "",
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
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/admin/smtpsettings/configuration",
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
      setUserData(response.data.response.smtpsetting);
    } catch (error) {
      setLoading(false);
      console.log("Error at SMTP data fetching");
    }
  };

  const handleClick = async () => {
    try {
      const {
        smtp_host,
        smtp_username,
        smtp_password,
        smtp_port,
        smtp_timeout,
      } = userData;

      // Check if email fields are empty
      if (
        !smtp_host ||
        !smtp_username ||
        !smtp_password ||
        !smtp_port ||
        !smtp_timeout
      ) {
        setErrors({
          smtp_host: smtp_host ? "" : "Host is required",
          smtp_username: smtp_username ? "" : "Username is required",
          smtp_password: smtp_password ? "" : "Password is required",
          smtp_port: smtp_port ? "" : "Port is required",
          smtp_timeout: smtp_timeout ? "" : "Timeout is required",
        });
        return;
      }
      const confirmationResult = await Swal.fire({
        title: "Update?",
        text: "Do you want to update the SMTP Settings?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (confirmationResult.isConfirmed) {
        // setLoading(true);

        const response = await axios.post(
          BaseApi + "/admin/smtpsettings/configuration",
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

        // setLoading(false);

        if (response.data.status === 200) {
          Swal.fire({
            title: "SMTP Settings updated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          getData();

          window.scrollTo(0, 0);
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
      }
    } catch (error) {
      // setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not update SMTP Settings. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not update SMTP Settings!", error);
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

                  <Typography color="text.primary">SMTP Setting</Typography>
                </Breadcrumbs>
              </div>
              <h2 className="adminPageHeading">SMTP Settings</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <h4 className="mb-5">SMTP Setting Details:</h4>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Send Email Using<span className="RedStar">*</span>
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      name="is_smtp"
                      value={userData.is_smtp}
                      onChange={handleChange}
                    >
                      <option value="0">Normal Email</option>
                      <option value="1">SMTP Configuration</option>
                    </select>
                    {userData.is_smtp === "1" ? (
                      <>
                        <div class="mb-5 mt-5 DashBoardInputBx">
                          <label for="formFile" class="form-label">
                            SMTP Host Name<span className="RedStar">*</span>
                          </label>
                          <input
                            type="text"
                            id="form3Example1"
                            className={`form-control ${
                              errors.smtp_host && "input-error"
                            }`}
                            name="smtp_host"
                            placeholder="SMTP Host"
                            value={userData.smtp_host}
                            onChange={handleChange}
                          />
                          {errors.smtp_host && (
                            <div className="text-danger">
                              {errors.smtp_host}
                            </div>
                          )}
                        </div>
                        <div class="mb-5 DashBoardInputBx">
                          <label for="formFile" class="form-label">
                            SMTP Username<span className="RedStar">*</span>
                          </label>
                          <input
                            type="text"
                            id="form3Example1"
                            className={`form-control ${
                              errors.smtp_username && "input-error"
                            }`}
                            name="smtp_username"
                            placeholder="SMTP Username"
                            value={userData.smtp_username}
                            onChange={handleChange}
                          />
                          {errors.smtp_username && (
                            <div className="text-danger">
                              {errors.smtp_username}
                            </div>
                          )}
                        </div>
                        <div class="mb-5 DashBoardInputBx">
                          <label for="formFile" class="form-label">
                            SMTP Password<span className="RedStar">*</span>
                          </label>
                          <input
                            type="text"
                            id="form3Example1"
                            className={`form-control ${
                              errors.smtp_password && "input-error"
                            }`}
                            name="smtp_password"
                            placeholder="SMTP Password"
                            value={userData.smtp_password}
                            onChange={handleChange}
                          />
                          {errors.smtp_password && (
                            <div className="text-danger">
                              {errors.smtp_password}
                            </div>
                          )}
                        </div>
                        <div class="mb-5 DashBoardInputBx">
                          <label for="formFile" class="form-label">
                            SMTP Port Number<span className="RedStar">*</span>
                          </label>
                          <input
                            type="text"
                            id="form3Example1"
                            className={`form-control ${
                              errors.smtp_port && "input-error"
                            }`}
                            name="smtp_port"
                            placeholder="SMTP Port"
                            value={userData.smtp_port}
                            onChange={handleChange}
                          />
                          {errors.smtp_port && (
                            <div className="text-danger">
                              {errors.smtp_port}
                            </div>
                          )}
                          <div id="emailHelp" class="form-text">
                            Example: 465, 25, 587, 2525 etc, Please check your
                            SMTP detail
                          </div>
                        </div>
                        <div class="mb-5 DashBoardInputBx">
                          <label for="formFile" class="form-label">
                            SMTP Timeout<span className="RedStar">*</span>
                          </label>
                          <input
                            type="text"
                            id="form3Example1"
                            className={`form-control ${
                              errors.smtp_timeout && "input-error"
                            }`}
                            name="smtp_timeout"
                            placeholder="SMTP Timeout"
                            value={userData.smtp_timeout}
                            onChange={handleChange}
                          />
                          {errors.smtp_timeout && (
                            <div className="text-danger">
                              {errors.smtp_timeout}
                            </div>
                          )}
                          <div id="emailHelp" class="form-text">
                            Example: 30, 50
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary button1"
                    onClick={handleClick}
                  >
                    SAVE
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

export default APSMTPsettings;
