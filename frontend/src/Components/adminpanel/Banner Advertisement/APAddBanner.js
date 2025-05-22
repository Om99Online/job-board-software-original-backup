import React, { useEffect, useState } from "react";
import APNavBar from "../Elements/APNavBar";
import APSidebar from "../APSidebar/APSidebar";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axios from "axios";
import BaseApi from "../../api/BaseApi";
import ApiKey from "../../api/ApiKey";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import APFooter from "../Elements/APFooter";

const APAddBanner = () => {
  const [userData, setUserData] = useState({
    title: "",
    type: "",
    advertisement_place: "",
    url: "",
    image: "",
    text: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    type: "",
    advertisement_place: "",
    url: "",
    image: "",
    text: "",
  });
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");

  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

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

  // const getData = async () => {
  //   try {
  //     const response = await axios.post(
  //       BaseApi + "/admin/changeusername",
  //       null,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           key: ApiKey,
  //           token: tokenKey,
  //         },
  //       }
  //     );
  //     setUserData(response.data.response);
  //   } catch (error) {
  //     console.log("Error at chnage username at Admin panel");
  //   }
  // };

  const handleClick = async () => {
    try {
      const newErrors = {};

      if (userData.title === "") {
        newErrors.title = "Banner Title is required";
        window.scrollTo(0, 0);
      }

      if (userData.type === "") {
        newErrors.type = "Advertisement Type is required";
        window.scrollTo(0, 0);
      }
      if (userData.advertisement_place === "") {
        newErrors.advertisement_place = "Advertisement Place is required";
        window.scrollTo(0, 0);
      }
      if (userData.url === "") {
        newErrors.url = "URL is required";
        window.scrollTo(0, 0);
      } else {
        // Regular expression pattern to match a valid URL

        const urlFormat = /^(https?:\/\/)?(www\.)?[\w.-]+\.[a-z]{2,5}(\/\S*)?$/i;


        if (!urlFormat.test(userData.url)) {
          newErrors.url = "Invalid URL format";
          window.scrollTo(0, 0);
        }
      }
      if (userData.image === "") {
        newErrors.image = "Advertisement Image is required";
        window.scrollTo(0, 0);
      }
      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Add Banner?",
          text: "Do you want to Add this Banner?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (confirmationResult.isConfirmed) {
          setLoading(true);

          const response = await axios.post(
            BaseApi + "/admin/banner/admin_add",
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
              title: "Banner Added successfully!",
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
            navigate("/admin/banneradvertisements");
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
        text: "Could not Add Banner. Please try again later!",
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
      const maxSizeInBytes = 600 * 1024; // 2MB
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
        setSelectedImage("");
        setUserData({ ...userData, image: "" });
        return;
      }

      // Check image resolution
      const img = new Image();
      img.src = window.URL.createObjectURL(file);

      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        if (width !== 720 || height !== 320) {
          Swal.fire({
            title: "Image resolution should be 720x320 pixels",
            icon: "warning",
            confirmButtonText: "Close",
          });
          // setErrors({
          //   ...errors,
          //   image: "Image resolution should be 1920x634 pixels",
          // });
          // Clear the file input
          fileInput.value = ""; // This clears the input
          setSelectedImage("");
          setUserData({ ...userData, image: "" });
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
    // window.location.reload();
  };

  const handleReset = () => {
    setUserData({
      title: "",
      // type: "",
      advertisement_place: "",
      url: "",
      image: "",
      text: "",
    });
    window.location.reload();
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
                    to="/admin/admins/dashboard"
                    underline="hover"
                    color="inherit"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/banneradvertisements"
                    underline="hover"
                    color="inherit"
                  >
                    Banner Advertisements
                  </Link>

                  <Typography color="text.primary">
                    Add Banner Advertisement
                  </Typography>
                </Breadcrumbs>
              </div>

              <h2 className="adminPageHeading">Add Banner</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Place Of Advertisement<span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.advertisement_place && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="advertisement_place"
                      value={userData.advertisement_place}
                      onChange={handleChange}
                    >
                      <option selected>Select Place of Advertisement</option>
                      <option value="home_ad1">
                        Home Page Bopx Advertisement Box1 (Width:377px,
                        Height:387px)
                      </option>
                      <option value="home_ad2">
                        Home Page Bopx Advertisement Box2 (Width:377px,
                        Height:387px)
                      </option>
                    </select>
                    {errors.advertisement_place && (
                      <div className="text-danger">
                        {errors.advertisement_place}
                      </div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Title<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.title && "input-error"
                      }`}
                      name="title"
                      placeholder="Banner Title"
                      value={userData.title}
                      onChange={handleChange}
                    />
                    {errors.title && (
                      <div className="text-danger">{errors.title}</div>
                    )}
                  </div>
                  <div className="mb-5">
                    <div className="APRadioInput DashBoardInputBx">
                      <label className="form-label" htmlFor="form3Example3">
                        Advertisement Type<span className="RedStar">*</span>
                      </label>
                      <div className="APPaymentDetailsRadio">
                        <input
                          type="radio"
                          id="pictureAdverts"
                          name="type"
                          value="1"
                          checked={userData.type.toString() === "1"}
                          onChange={handleChange}
                        />
                        <label className="LabelpictureAdverts" htmlFor="1">
                          Picture Adverts
                        </label>
                        <input
                          type="radio"
                          id="googleAdverts"
                          name="type"
                          value="2"
                          checked={userData.type.toString() === "2"}
                          onChange={handleChange}
                        />
                        <label htmlFor="2">Google Adverts</label>
                      </div>
                    </div>
                    {errors.type && (
                      <div className="text-danger">{errors.type}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      URL<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${errors.url && "input-error"}`}
                      name="url"
                      placeholder="URL"
                      value={userData.url}
                      onChange={handleChange}
                    />
                    {errors.url && (
                      <div className="text-danger">{errors.url}</div>
                    )}
                    <div id="emailHelp" class="form-text">
                      (Enter URL Like https://www.google.com)
                    </div>
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Image<span className="RedStar">*</span>
                    </label>
                    <input
                      className={`form-control ${
                        errors.image && "input-error"
                      }`}
                      type="file"
                      id="formFile"
                      lable="Image"
                      name="logo"
                      accept=".gif, .jpeg, .png, .jpg"
                      onChange={(e) => handleFileUpload1(e)}
                    />
                    {errors.image && (
                      <div className="text-danger">{errors.image}</div>
                    )}
                    <div id="emailHelp" class="form-text">
                      Supported File Types: gif, jpg, jpeg, png (Max. 600 KB).
                      Standard size of Advertisement images <br />
                      1) Job Selection Page (Width:720px, Height:320px)
                    </div>
                    {selectedImage && (
                      <div>
                        <img
                          className="selectedInputImage selectedBannerImage"
                          src={selectedImage}
                          alt="Selected"
                        />

                        <button className="APButton3" onClick={deleteImage}>
                          Delete
                        </button>
                      </div>
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
                    onClick={() => handleReset()}
                  >
                    RESET
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

export default APAddBanner;

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
