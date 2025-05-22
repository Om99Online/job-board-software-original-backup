import React, { useEffect, useState } from "react";
import APNavBar from "../Elements/APNavBar";
import APSidebar from "../APSidebar/APSidebar";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
// import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axios from "axios";
import BaseApi from "../../api/BaseApi";
import ApiKey from "../../api/ApiKey";
import Swal from "sweetalert2";
import { useNavigate, useParams, Link } from "react-router-dom";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import Cookies from "js-cookie";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles
import APFooter from "../Elements/APFooter";

const APEditBlog = () => {
  const [userData, setUserData] = useState({
    title: "",
    description: "",
    meta_keyword: "",
    meta_title: "",
    meta_description: "",
    image: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    meta_keyword: "",
    meta_title: "",
    meta_description: "",
    image: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("token");
  const adminID = parseInt(Cookies.get("adminID"));

  const navigate = useNavigate();
  const editor = useRef(null);
  const { slug } = useParams();

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setUserData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/admin/blog/admin_editblogs/${slug}`,
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
      setSelectedImage(response.data.response.image);
    } catch (error) {
      console.log("Error at chnage username at Admin panel");
    }
  };

  const handleChange = (name, value) => {
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClick = async () => {
    try {
      const newErrors = {};

      if (userData.title === "") {
        newErrors.title = "Blog Title is required";
        window.scrollTo(0, 0);
      }

      if (!userData.description.trim()) {
        newErrors.description = "Blog Description is required";
        window.scrollTo(0, 0);
      }
      if (userData.image === "") {
        newErrors.image = "Blog Image is required";
        window.scrollTo(0, 0);
      }
      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Edit Blog?",
          text: "Do you want to Edit this Blog?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (confirmationResult.isConfirmed) {
          setLoading(true);

          const response = await axios.post(
            BaseApi + `/admin/blog/admin_editblogs/${slug}`,
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
              title: "Blog updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            navigate("/admin/blogs");
            setUserData({
              ...userData,
              title: "",
              description: "",
              image: "",
              meta_title: "",
              meta_keyword: "",
              meta_description: "",
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
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not update Blog. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not change username!", error);
    }
  };

  const handleFileUpload1 = async (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];
  
    // Check if the file is selected
    if (file) {
      // Check the file size (in bytes)
      const fileSizeInBytes = file.size;
      const maxSizeInBytes = 600 * 1024; // 600 KB
      if (fileSizeInBytes > maxSizeInBytes) {
        Swal.fire({
          title: "Image size should be under 600 KB",
          icon: "warning",
          confirmButtonText: "Close",
        });
        // setErrors({
        //   ...errors,
        //   image: "Image size should be under 2MB",
        // });
        // Clear the file input
        fileInput.value = ""; // This clears the input
        // setSelectedImage("")
        // setUserData({ ...userData, image: "" });
        return;
      }
  
      // Check image resolution
      const img = new Image();
      img.src = window.URL.createObjectURL(file);
  
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
  
        if (width <250 || height < 250) {
          Swal.fire({
            title: "Minimum image resolution should be 250x250 pixels",
            icon: "warning",
            confirmButtonText: "Close",
          });
          // setErrors({
          //   ...errors,
          //   image: "Image resolution should be 1920x634 pixels",
          // });
          // Clear the file input
          fileInput.value = ""; // This clears the input
          // setSelectedImage("")
          // setUserData({ ...userData, image: "" });
        } else {
          // Clear the image error
          setErrors({
            ...errors,
            image: "",
          });
  
          // Convert the image to base64
          convertToBase64(file).then((base64) => {
            setUserData({ ...userData, image: base64 });
            setSelectedImage(base64);
          });
        }
      };
    }
  };

  // const handleFileUpload1 = async (e) => {
  //   const file = e.target.files[0];
  //   const base64 = await convertToBase64(file);
  //   setUserData({ ...userData, image: base64 });
  //   setSelectedImage(base64);

  //   // Clear the image error
  //   setErrors({
  //     ...errors,
  //     image: "",
  //   });
  // };

  const deleteImage = () => {
    setSelectedImage(null);
    setUserData({ ...userData, image: "" });
    const fileInput = document.getElementById("formFile"); // Replace with the actual ID of your file input
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const deleteImageWithSlug = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Delete Image?",
        text: "Do you want to delete this Image?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (confirmationResult.isConfirmed) {
        const response = await axios.post(
          BaseApi + `/admin/blog/admin_deleteBlogImage/${slug}`,
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
        if (response.data.status === 200) {
          Swal.fire({
            title: "Image Deleted successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          getData();
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
        text: "Could not delete Image. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not delete image!", error);
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
                  <Link to="/admin/blogs" underline="hover" color="inherit">
                    Blogs
                  </Link>

                  <Typography color="text.primary">Edit Blog</Typography>
                </Breadcrumbs>
              </div>

              <h2 className="adminPageHeading">Edit Blog</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Blog Title<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.title && "input-error"
                      }`}
                      name="title"
                      placeholder="Blog Title"
                      value={userData.title}
                      onChange={handleChange}
                    />
                    {errors.title && (
                      <div className="text-danger">{errors.title}</div>
                    )}
                  </div>
                  <div className="mb-5 DashBoardInputBx DashBoardCreatBx APJoditEditor">
                    <label className="form-label" htmlFor="form3Example3">
                      Description<span className="RedStar">*</span>
                    </label>
                    <ReactQuill
                      theme="snow"
                      value={userData.description}
                      onChange={(value) => handleChange("description", value)}
                    />

                    {errors.description && (
                      <div className="text-danger">{errors.description}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Image<span className="RedStar">*</span>
                    </label>
                    <input
                      class={`form-control ${errors.image && "input-error"}`}
                      type="file"
                      id="formFile"
                      label="Image"
                      name="logo"
                      accept=".jpeg, .png, .jpg, .gif"
                      onChange={(e) => handleFileUpload1(e)}
                    />
                    {errors.image && (
                      <div className="text-danger">{errors.image}</div>
                    )}
                    <div id="emailHelp" class="form-text">
                      Supported File Types: gif, jpg, jpeg, png (Max. 10MB). Min
                      file size 250 X 250 pixels.
                    </div>
                    {selectedImage && (
                      <div>
                        <img
                          className="selectedInputImage"
                          src={selectedImage}
                          alt="Selected"
                        />
                        {userData.image ? (
                          <button
                            className="APButton3"
                            type="button"
                            onClick={() => deleteImageWithSlug(slug)}
                          >
                            Delete
                          </button>
                        ) : (
                          <button className="APButton3" onClick={deleteImage}>
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className="form-control"
                      name="meta_title"
                      placeholder="Meta Title"
                      value={userData.meta_title}
                      onChange={handleChange}
                    />
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Meta Keyword
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className="form-control"
                      name="meta_keyword"
                      placeholder="Meta Keyword"
                      value={userData.meta_keyword}
                      onChange={handleChange}
                    />
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Meta Description
                    </label>
                    <textarea
                      type="text"
                      id="form3Example1"
                      className="form-control"
                      name="meta_description"
                      placeholder="Meta Description"
                      value={userData.meta_description}
                      onChange={handleChange}
                    />
                    <div id="emailHelp" class="form-text">
                      Note.: Meta details are important please fill these
                      information. If you don't filled it by default information
                      will be show.
                    </div>
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
                    onClick={() => navigate("/admin/blogs")}
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

export default APEditBlog;

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
