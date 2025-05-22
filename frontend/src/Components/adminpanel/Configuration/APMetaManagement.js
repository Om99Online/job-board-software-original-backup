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

const APMetaManagement = () => {
  const [userData, setUserData] = useState({
    default_title: "",
    default_keyword: "",
    default_description: "",
    meta_jobtitle: "",
    meta_jobkeywords: "",
    meta_jobdescription: "",
    meta_catetitle: "",
    meta_catekeywords: "",
    meta_catedescription: "",
  });
  const [errors, setErrors] = useState({
    default_title: "",
    default_keyword: "",
    default_description: "",
    meta_jobtitle: "",
    meta_jobkeywords: "",
    meta_jobdescription: "",
    meta_catetitle: "",
    meta_catekeywords: "",
    meta_catedescription: "",
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
        BaseApi + "/admin/metaManagement",
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
      const newErrors = {};

      if (userData.default_title === "") {
        newErrors.default_title = "Default title is required";
      }
      if (userData.default_keyword === "") {
        newErrors.default_keyword = "Default keyword is required";
      }
      if (userData.default_description === "") {
        newErrors.default_description = "Default description is required";
      }
      if (userData.meta_jobtitle === "") {
        newErrors.meta_jobtitle = "Meta title is required";
      }
      if (userData.meta_jobkeywords === "") {
        newErrors.meta_jobkeywords = "Meta keyword is required";
      }

      if (userData.meta_jobdescription === "") {
        newErrors.meta_jobdescription = "Meta job description is required";
      }
      if (userData.meta_catetitle === "") {
        newErrors.meta_catetitle = "Category meta title is required";
      }
      if (userData.meta_catekeywords === "") {
        newErrors.meta_catekeywords = "Category meta keyword is required";
      }

      if (userData.meta_catedescription === "") {
        newErrors.meta_catedescription =
          "Category meta description is required";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Update?",
          text: "Do you want to update the Meta Details?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (confirmationResult.isConfirmed) {
          setLoading(true);

          const response = await axios.post(
            BaseApi + "/admin/metaManagement",
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
              title: "Meta Details updated successfully!",
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
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not update Meta Details. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not update Meta Details!", error);
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

                  <Typography color="text.primary">Meta Management</Typography>
                </Breadcrumbs>
              </div>
              <h2 className="adminPageHeading">Default Meta Management</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <h4 className="mb-5">Home Page Meta Management</h4>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Home Meta Title<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.default_title && "input-error"
                      }`}
                      name="default_title"
                      placeholder="Default Title"
                      value={userData.default_title}
                      onChange={handleChange}
                    />
                    {errors.default_title && (
                      <div className="text-danger">{errors.default_title}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Home Meta Keywords<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.default_keyword && "input-error"
                      }`}
                      name="default_keyword"
                      value={userData.default_keyword}
                      placeholder="Default Keyword"
                      onChange={handleChange}
                    />
                    {errors.default_keyword && (
                      <div className="text-danger">
                        {errors.default_keyword}
                      </div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Home Meta Description<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.default_description && "input-error"
                      }`}
                      name="default_description"
                      value={userData.default_description}
                      placeholder="Default Description"
                      onChange={handleChange}
                    />
                    {errors.default_description && (
                      <div className="text-danger">
                        {errors.default_description}
                      </div>
                    )}
                  </div>
                  <h4 className="mt-5 mb-5">Job Meta Management</h4>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Job Meta Title<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.meta_jobtitle && "input-error"
                      }`}
                      name="meta_jobtitle"
                      value={userData.meta_jobtitle}
                      placeholder="Meta Job Title"
                      onChange={handleChange}
                    />
                    {errors.meta_jobtitle && (
                      <div className="text-danger">{errors.meta_jobtitle}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Job Meta Keywords<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.meta_jobkeywords && "input-error"
                      }`}
                      name="meta_jobkeywords"
                      value={userData.meta_jobkeywords}
                      placeholder="Meta Job Keyword"
                      onChange={handleChange}
                    />
                    {errors.meta_jobkeywords && (
                      <div className="text-danger">
                        {errors.meta_jobkeywords}
                      </div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Job Meta Description<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.meta_jobdescription && "input-error"
                      }`}
                      name="meta_jobdescription"
                      value={userData.meta_jobdescription}
                      placeholder="Meta Job Description"
                      onChange={handleChange}
                    />
                    {errors.meta_jobdescription && (
                      <div className="text-danger">
                        {errors.meta_jobdescription}
                      </div>
                    )}
                  </div>
                  <h4 className="mt-5 mb-5">Category Meta Management</h4>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Category Meta Title<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.meta_catetitle && "input-error"
                      }`}
                      name="meta_catetitle"
                      value={userData.meta_catetitle}
                      placeholder="Meta Category Title"
                      onChange={handleChange}
                    />
                    {errors.meta_catetitle && (
                      <div className="text-danger">{errors.meta_catetitle}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Category Meta Keywords<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.meta_catekeywords && "input-error"
                      }`}
                      name="meta_catekeywords"
                      value={userData.meta_catekeywords}
                      placeholder="Meta Category Keyword"
                      onChange={handleChange}
                    />
                    {errors.meta_catekeywords && (
                      <div className="text-danger">
                        {errors.meta_catekeywords}
                      </div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Category Meta Description
                      <span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.meta_catedescription && "input-error"
                      }`}
                      name="meta_catedescription"
                      value={userData.meta_catedescription}
                      placeholder="Meta Category Description"
                      onChange={handleChange}
                    />
                    {errors.meta_catedescription && (
                      <div className="text-danger">
                        {errors.meta_catedescription}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary button1"
                    onClick={handleClick}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary button2"
                    onClick={() => navigate("/admin/admins/dashboard")}
                  >
                    Cancel
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

export default APMetaManagement;
