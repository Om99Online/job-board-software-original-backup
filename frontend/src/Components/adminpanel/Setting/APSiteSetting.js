import React, { useEffect, useState } from "react";
import APNavBar from "../Elements/APNavBar";
import APSidebar from "../APSidebar/APSidebar";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import BaseApi from "../../api/BaseApi";
import ApiKey from "../../api/ApiKey";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import APFooter from "../Elements/APFooter";

const APSiteSetting = () => {
  const [userData, setUserData] = useState({
    title: "",
    url: "",
    tagline: "",
    phone: "",
    max_size: "",
    facebook_link: "",
    linkedin_link: "",
    instagram_link: "",
    pinterest: "",
    jobs_count: "",
    app_payment: "",
    top_emp_text: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    url: "",
    tagline: "",
    phone: "",
    max_size: "",
    facebook_link: "",
    linkedin_link: "",
    instagram_link: "",
    pinterest: "",
  });
  const [maxSize, setMaxSize] = useState([]);
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");

  const navigate = useNavigate();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/admin/settings/siteSettings",
        null, // Pass null as the request body if not required
        {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            token: tokenKey,
            adminid: adminID,
          },
        }
      );
      if (response.data.status === 200) {
        setLoading(false);
        setUserData(response.data.response);
        setMaxSize(response.data.response.max_size_array);
        console.log(maxSize);
      } 
    } catch (error) {
      setLoading(false);
      console.log("Cannot get plans data at APmanageplans");
    }
  };

  const validatePhoneNumber = (number) => {
    const numberRegex = /^\+?\d{1,3}-?\d{9,15}$/;
    return numberRegex.test(number);
  };

  const handleClick = async () => {
    try {
      const {
        title,
        url,
        tagline,
        phone,
        max_size,
        facebook_link,
        linkedin_link,
        instagram_link,
        pinterest,
      } = userData;

      if (
        !title ||
        !url ||
        !tagline ||
        !phone ||
        !max_size ||
        !facebook_link ||
        !instagram_link ||
        !linkedin_link ||
        !pinterest
      ) {
        setErrors({
          title: title ? "" : "Title is required",
          url: url ? "" : "URL is required",
          tagline: tagline ? "" : "Tagline is required",
          phone: phone ? "" : "Phone is required",
          max_size: max_size ? "" : "Max Size is required",
          facebook_link: facebook_link ? "" : "Facebook link is required",
          instagram_link: instagram_link ? "" : "Instagram Link is required",
          linkedin_link: linkedin_link ? "" : "LinkedIn Link is required",
          pinterest: pinterest ? "" : "Pinterest Link is required",
        });
        return;
      }
      
      const urlFormat = /^(https?:\/\/)?(www\.)?[\w.-]+\.[a-z]{2,5}(\/\S*)?$/i;

      if (!urlFormat.test(userData.url)) {
        setErrors({
          url: "Invalid URL format",
        });
        window.scrollTo(0, 0);
        return;
      }

      const numberFormat = /^\+?\d{1,3}-?\d{9,15}$/;
      
      if (!numberFormat.test(userData.phone)) {
        // console.log("ha");
        setErrors({
          phone: "Please enter contact number under 15 digits",
        });
        // window.scrollTo(0, 0);
        return;
      }
      
      const confirmationResult = await Swal.fire({
        title: "Update Setting?",
        text: "Do you want to update the site setting?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (confirmationResult.isConfirmed) {
        setLoading(true);

        const response = await axios.post(
          BaseApi + "/admin/settings/siteSettings",
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
            title: "Site setting updated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });

          window.scrollTo(0, 0);
        } 
      }
      // }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not update setting. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not change username!", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "app_payment") {
      setUserData((prev) => ({
        ...prev,
        [name]: checked ? 1 : 0,
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Check if the input is empty and set an error message accordingly
      if (value.trim() === "") {
        setErrors((prev) => ({
          ...prev,
          [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required`,
        }));
      } else {
        // If the input is not empty, clear the error message
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }
  };

  // const handleChange = (e) => {
  //   const { name, value} = e.target;

  //   setUserData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  //   // setErrors((prev) => ({
  //   //   ...prev,
  //   //   [name]: "",
  //   // }));
  // };

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

                  <Typography color="text.primary">Site Settings</Typography>
                </Breadcrumbs>
              </div>
              <h2 className="adminPageHeading">Edit Site Settings</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Site Title<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.title && "input-error"
                      }`}
                      name="title"
                      placeholder="Site Title"
                      value={userData.title}
                      onChange={handleChange}
                    />
                    {errors.title && (
                      <div className="text-danger">{errors.title}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Site URL<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${errors.url && "input-error"}`}
                      name="url"
                      value={userData.url}
                      placeholder="Site URl"
                      onChange={handleChange}
                    />
                    {errors.url && (
                      <div className="text-danger">{errors.url}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Site Tagline<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.tagline && "input-error"
                      }`}
                      name="tagline"
                      value={userData.tagline}
                      placeholder="Site Tagline"
                      onChange={handleChange}
                    />
                    {errors.tagline && (
                      <div className="text-danger">{errors.tagline}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Facebook Link<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.facebook_link && "input-error"
                      }`}
                      name="facebook_link"
                      value={userData.facebook_link}
                      placeholder="Facebook Link"
                      onChange={handleChange}
                    />
                    {errors.facebook_link && (
                      <div className="text-danger">{errors.facebook_link}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      LinkedIn Link<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.linkedin_link && "input-error"
                      }`}
                      name="linkedin_link"
                      value={userData.linkedin_link}
                      placeholder="LinkedIn Link"
                      onChange={handleChange}
                    />
                    {errors.linkedin_link && (
                      <div className="text-danger">{errors.linkedin_link}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Instagram Link<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.instagram_link && "input-error"
                      }`}
                      name="instagram_link"
                      value={userData.instagram_link}
                      placeholder="Instagram Link"
                      onChange={handleChange}
                    />
                    {errors.instagram_link && (
                      <div className="text-danger">{errors.instagram_link}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Pinterest Link<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.pinterest && "input-error"
                      }`}
                      name="pinterest"
                      value={userData.pinterest}
                      placeholder="Pinterest Link"
                      onChange={handleChange}
                    />
                    {errors.pinterest && (
                      <div className="text-danger">{errors.pinterest}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Contact Number<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className="form-control"
                      name="phone"
                      value={userData.phone}
                      placeholder="Contact Number"
                      onChange={handleChange}
                    />
                    {errors.phone && (
                      <div className="text-danger">{errors.phone}</div>
                    )}
                  </div>
                  <div className="mb-5 DashBoardInputBx">
                    <label className="form-label" htmlFor="form3Example1">
                      Max Image Upload Size (in MB)
                      <span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.max_size && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="max_size"
                      value={userData.max_size}
                      onChange={handleChange}
                    >
                      <option value="">Choose Size</option>
                      {Object.entries(maxSize).map(([key, value]) => (
                        <option value={key}>{value}</option>
                      ))}
                    </select>
                    {errors.max_size && (
                      <div className="text-danger">{errors.max_size}</div>
                    )}
                  </div>
                  <div class="mb-5 siteSettingPaymentInfo checkBoxCol">
                    <label for="formFile" class="form-label">
                      Payment Through App
                    </label>
                    <input
                      type="checkbox"
                      className="tableCheckBox"
                      checked={userData.app_payment === 1}
                      onChange={handleChange}
                      name="app_payment" // Set the name to app_payment
                    />
                  </div>
                  {/* <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Number of Jobs
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className="form-control"
                      name="jobs_count"
                      value={userData.jobs_count}
                      placeholder="No of Jobs"
                      onChange={handleChange}
                    />
                  </div> */}
                  {/* <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Top Employer Text
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className="form-control"
                      name="top_emp_text"
                      value={userData.top_emp_text}
                      placeholder="Employer Text"
                      onChange={handleChange}
                    />
                  </div> */}
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

export default APSiteSetting;
