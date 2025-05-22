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
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import APFooter from "../Elements/APFooter";

const APEditCategory = () => {
  const [userData, setUserData] = useState({
    name: "",
    image: "",
    meta_keywords: "",
    meta_title: "",
    meta_description: "",
    keywords: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    // image: "",
  });
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");

  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

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
        BaseApi + `/admin/category/admin_edit/${slug}`,
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

  const handleClick = async () => {
    try {
      const newErrors = {};

      if (userData.name === "") {
        newErrors.name = "Category Name is required";
        window.scrollTo(0, 0);
      }

      // if (userData.image === "") {
      //   newErrors.image = "Category Image is required";
      //   window.scrollTo(0, 0);
      // }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Update Category?",
          text: "Do you want to update the category?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (confirmationResult.isConfirmed) {
          setLoading(true);

          const response = await axios.post(
            BaseApi + `/admin/category/admin_edit/${slug}`,
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
              title: "Category updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            // getData();
            // setUserData({
            //   ...userData,
            //   new_username: "",
            //   conf_username: "",
            // });
            // window.scrollTo(0, 0);
            navigate("/admin/categories");
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
        text: "Could not update category. Please try again later!",
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
  
        if (width > 100 || height > 100 || width < 40 || height < 40) {
          Swal.fire({
            title: "Image resolution should be greater than 40x40 pixels and less than 100x100 pixels",
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
                  <Link
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate("/admin/categories")}
                  >
                    Categories List
                  </Link>
                  <Typography color="text.primary">Edit Category</Typography>
                </Breadcrumbs>
              </div>

              <h2 className="adminPageHeading">Edit Category</h2>
              <form className="adminForm">
                <div className="mb-5 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Category Name<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${errors.name && "input-error"}`}
                      name="name"
                      value={userData.name}
                      placeholder="Name"
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <div className="text-danger">{errors.name}</div>
                    )}
                  </div>
                  <div className="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Category Image
                    </label>
                    {/* <div className="APACImageArea">
                        {selectedImage && (
                          <img src={selectedImage} alt="Selected" />
                        )}
                      </div> */}
                    <input
                      class={`form-control ${errors.image && "input-error"}`}
                      type="file"
                      id="formFile"
                      lable="Image"
                      name="image"
                      accept=".jpeg, .png, .jpg, .gif"
                      placeholder="Select Image"
                      onChange={(e) => handleFileUpload1(e)}
                    />
                    {errors.image && (
                      <div className="text-danger">{errors.image}</div>
                    )}
                    {/* <button id="formFile">Select Image</button> */}
                    <p>
                      Supported File Types: gif, jpg, jpeg, png (Max. 600 KB). Min
                      file size 40 X 40 pixels. Max file size 100 X 100 pixels.
                    </p>
                    {selectedImage && (
                      <div>
                        <img
                          className="selectedInputImage"
                          src={selectedImage}
                          alt="Selected"
                        />
                        {/* <button className="APButton3" onClick={deleteImage}>
                          Delete
                        </button> */}
                      </div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className="form-control"
                      name="meta_keywords"
                      value={userData.meta_keywords}
                      placeholder="Meta Keywords"
                      onChange={handleChange}
                    />
                    {/* <p>(comma (,) separated)</p> */}
                  </div>
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
                    value={userData.meta_title}
                    placeholder="Meta Title"
                    onChange={handleChange}
                  />
                </div>

                <div class="mb-5 DashBoardInputBx">
                  <label for="formFile" class="form-label">
                    Meta Description
                  </label>
                  <input
                    type="text"
                    id="form3Example1"
                    className="form-control"
                    name="meta_description"
                    value={userData.meta_description}
                    placeholder="Meta Description"
                    onChange={handleChange}
                  />
                  <div id="emailHelp" class="form-text">
                    Note.: Meta details are important please fill these
                    information. If you don't filled it by default information
                    will be show.
                  </div>
                </div>
                <div class="mb-5 DashBoardInputBx">
                  <label for="formFile" class="form-label">
                    Keywords
                  </label>
                  <input
                    type="text"
                    id="form3Example1"
                    className="form-control"
                    name="keywords"
                    value={userData.keywords}
                    placeholder="Meta Title"
                    onChange={handleChange}
                  />
                  <div id="emailHelp" class="form-text">
                    (comma (,) separated)
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
                  onClick={() => navigate("/admin/categories")}
                >
                  CANCEL
                </button>
              </form>
            </div>
            <APFooter />

          </>
        )}
      </div>
    </>
  );
};

export default APEditCategory;
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
