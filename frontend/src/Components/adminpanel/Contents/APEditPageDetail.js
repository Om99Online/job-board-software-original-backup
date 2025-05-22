import React, { useEffect, useState } from "react";
import APNavBar from "../Elements/APNavBar";
import APSidebar from "../APSidebar/APSidebar";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import BaseApi from "../../api/BaseApi";
import ApiKey from "../../api/ApiKey";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import Cookies from "js-cookie";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles
import APFooter from "../Elements/APFooter";
const APEditPageDetail = () => {
  const editor = useRef(null);

  const [userData, setUserData] = useState({
    static_page_description: "",
    static_page_description_ukr: "",
    static_page_description_el: "",
    static_page_heading: "",
    static_page_title: "",
    static_page_title_ukr: "",
    static_page_title_el: "",
  });
  const [errors, setErrors] = useState({
    static_page_description: "",
    static_page_description_ukr: "",
    static_page_description_el: "",
    static_page_heading: "",
    static_page_title: "",
    static_page_title_ukr: "",
    static_page_title_el: "",
  });
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");

  const navigate = useNavigate();
  const { slug } = useParams();

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
        BaseApi + `/admin/page/admin_edit/${slug}`,
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
      setLoading(false);
      setUserData(response.data.response);
      //   console.log(paymentHistory);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get data at edit Page List");
    }
  };

  const handleClick = async () => {
    try {
      const newErrors = {};

      if (userData.static_page_title === "") {
        newErrors.static_page_title = "Page Title is required";
        window.scrollTo(0, 0);
      }
      if (userData.static_page_description === "") {
        newErrors.static_page_description = "Page Description is required";
        window.scrollTo(0, 0);
      }
      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Update Page?",
          text: "Do you want to update this Page?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (confirmationResult.isConfirmed) {
          setLoading(true);

          const response = await axios.post(
            BaseApi + `/admin/page/admin_edit/${slug}`,
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
              title: "Page Details Updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            // setUserData({
            //   ...userData,
            //   new_username: "",
            //   conf_username: "",
            // });
            // window.scrollTo(0, 0);
            navigate("/admin/pages/index");
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
        text: "Could not update page details. Please try again later!",
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
                    to="/admin/admins/dashboard"
                    underline="hover"
                    color="inherit"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/pages/index"
                    underline="hover"
                    color="inherit"
                  >
                    Content
                  </Link>

                  <Typography color="text.primary">Edit Page Detail</Typography>
                </Breadcrumbs>
              </div>
              <h2 className="adminPageHeading">Edit Page Detail</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Page Title<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.static_page_title && "input-error"
                      }`}
                      name="static_page_title"
                      placeholder="Page Title"
                      value={userData.static_page_title}
                      onChange={handleChange}
                    />
                    {errors.static_page_title && (
                      <div className="text-danger">
                        {errors.static_page_title}
                      </div>
                    )}
                  </div>
                  <div className=" mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example3">
                      Description<span className="RedStar">*</span>
                    </label>
                    {/* <JoditEditor
                      ref={editor}
                      name="static_page_description"
                      value={userData.static_page_description}
                      onChange={(static_page_description) =>
                        handleChange({
                          target: {
                            value: static_page_description,
                            name: "static_page_description",
                          },
                        })
                      }
                    /> */}

                    <ReactQuill
                      theme="snow"
                      value={userData.static_page_description}
                      onChange={(value) =>
                        handleChange({
                          target: { name: "static_page_description", value },
                        })
                      }
                      style={{ minHeight: "250px", height: "200px" }}
                      placeholder="Add your text here..."
                    />
                    {errors.static_page_description && (
                      <div className="text-danger">
                        {errors.static_page_description}
                      </div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Page Title (Ukrainain)
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className="form-control"
                      name="static_page_title_ukr"
                      placeholder="Page Title (Ukrainain)"
                      value={userData.static_page_title_ukr}
                      onChange={handleChange}
                    />
                  </div>
                  <div className=" mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example3">
                      Description (Ukrainain)
                    </label>
                    {/* <JoditEditor
                      ref={editor}
                      name="static_page_description_ukr"
                      value={userData.static_page_description_ukr}
                      onChange={(static_page_description_ukr) =>
                        handleChange({
                          target: {
                            value: static_page_description_ukr,
                            name: "static_page_description_ukr",
                          },
                        })
                      }
                    /> */}
                    <ReactQuill
                      theme="snow"
                      value={userData.static_page_description_ukr}
                      onChange={(value) =>
                        handleChange({
                          target: {
                            name: "static_page_description_ukr",
                            value,
                          },
                        })
                      }
                      style={{ minHeight: "250px", height: "200px" }}
                      placeholder="Add your text here..."
                    />
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Page Title (Greek)
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className="form-control"
                      name="static_page_title_el"
                      placeholder="Page Title (Greek)"
                      value={userData.static_page_title_el}
                      onChange={handleChange}
                    />
                  </div>
                  <div className=" mb-5 DashBoardInputBx DashBoardCreatBx">
                    <label className="form-label" htmlFor="form3Example3">
                      Description (Greek)
                    </label>
                    {/* <JoditEditor
                      ref={editor}
                      name="static_page_description_el"
                      value={userData.static_page_description_el}
                      onChange={(static_page_description_el) =>
                        handleChange({
                          target: {
                            value: static_page_description_el,
                            name: "static_page_description_el",
                          },
                        })
                      }
                    /> */}
                    <ReactQuill
                      theme="snow"
                      value={userData.static_page_description_el}
                      onChange={(value) =>
                        handleChange({
                          target: {
                            name: "static_page_description_el",
                            value,
                          },
                        })
                      }
                      style={{ minHeight: "250px", height: "200px" }}
                      placeholder="Add your text here..."
                    />
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
                    onClick={() => navigate("/admin/pages/index")}
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

export default APEditPageDetail;
