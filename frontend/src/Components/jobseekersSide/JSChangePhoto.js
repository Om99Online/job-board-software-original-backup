import React, { useEffect, useState } from "react";
import Footer from "../element/Footer";
import JSSidebar from "./JSSidebar";
import NavBar from "../element/NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const JSChangePhoto = () => {
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState({
    profile_image: "",
  });

  const [picture, setPicture] = useState("");
  const tokenKey = Cookies.get("tokenClient");
  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  const [t, i18n] = useTranslation("global");

  const [hoverFirstButtonColor, setHoverFirstButtonColor] = useState(false);

  const handleFirstButtonMouseEnter = () => {
    setHoverFirstButtonColor(true);
  };

  const handleFirstButtonMouseLeave = () => {
    setHoverFirstButtonColor(false);
  };

  const [hoverSecondButtonColor, setHoverSecondButtonColor] = useState(false);

  const handleSecondButtonMouseEnter = () => {
    setHoverSecondButtonColor(true);
  };

  const handleSecondButtonMouseLeave = () => {
    setHoverSecondButtonColor(false);
  };

  const navigate = useNavigate();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/candidates/uploadPhoto",
        null, // Pass null as the request body if not required
        {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            token: tokenKey,
          },
        }
      );
      setLoading(false);
      if (response.data.status === 200) {
        setPhoto(response.data.response.profile_image);
        setPicture(response.data.response.profile_image);
        console.log(photo);
      }
      if (response.data.status === 400) {
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: t("searchJobPage.close"),
        });
      }
    } catch (error) {
      setLoading(false);
      if (error.message === "Network Error") {
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: t("tokenExpired.tokenExpired"),
          icon: "warning",
          confirmButtonText: t("jobDescription.close"),
        });
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      }
      console.log("Cannot get profile photo data");
    }
  };

  useEffect(() => {
    // Check if tokenKey is not present
    if (!tokenKey) {
      // Redirect to the home page
      navigate("/user/jobseekerlogin");
    } else {
      // TokenKey is present, fetch data or perform other actions
      getData();
      window.scrollTo(0, 0);
    }
  }, [tokenKey, navigate]);

  const handleClick = async () => {
    try {
      if (!photo.profile_image || photo.profile_image === null) {
        Swal.fire({
          title: t("jobseekerChangePhoto.imageRequired"),
          icon: "warning",
          confirmButtonText: t("jobseekerChangePhoto.close"),
        });
      } else {
        const confirmationResult = await Swal.fire({
          title: t("jobseekerChangePhoto.confirmTitle"),
          text: t("jobseekerChangePhoto.confirmText"),
          icon: "question",
          showCancelButton: true,
          confirmButtonText: t("jobseekerChangePhoto.yes"),
          cancelButtonText: t("jobseekerChangePhoto.no"),
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseApi + "/candidates/uploadPhoto",
            photo,
            {
              headers: {
                "Content-Type": "application/json",
                key: ApiKey,
                token: tokenKey,
              },
            }
          );
          setLoading(false);
          if (response.data.status === 200) {
            getData();
            Swal.fire({
              title: t("jobseekerChangePhoto.successTxt"),
              icon: "success",
              confirmButtonText: t("jobseekerChangePhoto.close"),
            });
            window.scrollTo(0, 0);
          } else if (response.data.status === 400) {
            Cookies.remove("tokenClient");
            Cookies.remove("user_type");
            Cookies.remove("fname");
            navigate("/");
            Swal.fire({
              title: response.data.message,
              icon: "warning",
              confirmButtonText: t("searchJobPage.close"),
            });
          } else if (response.data.status === 500) {
            Swal.fire({
              title: response.data.message,
              icon: "warning",
              confirmButtonText: t("searchJobPage.close"),
            });
          } else {
            Swal.fire({
              title: response.data.message,
              icon: "error",
              confirmButtonText: t("searchJobPage.close"),
            });
          }
        }
      }
    } catch (error) {
      setLoading(false);
      if (error.message === "Network Error") {
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: t("tokenExpired.tokenExpired"),
          icon: "warning",
          confirmButtonText: t("jobDescription.close"),
        });
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      }
      Swal.fire({
        title: t("jobseekerChangePhoto.failedTxt"),
        icon: "error",
        confirmButtonText: t("jobseekerChangePhoto.close"),
      });
      console.log("Could not update photo!");
    }
  };

  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   const base64 = await convertToBase64(file);
  //   console.log(base64);
  //   setPhoto({ ...photo, profile_image: base64 });
  // };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    // Check if file size exceeds 500KB
    if (file.size > 500 * 1024) {
      Swal.fire({
        title: t("jobseekerChangePhoto.fileSizeExceed"),
        icon: "warning",
        confirmButtonText: t("jobseekerChangePhoto.close"),
      });
      e.target.value = "";

      return; // Exit function
    }

    // Create an object URL to get the image dimensions
    const objectURL = URL.createObjectURL(file);
    const image = new Image();

    // Set up a promise to get image dimensions
    const imageSizePromise = new Promise((resolve) => {
      image.onload = () => {
        resolve({
          width: image.width,
          height: image.height,
        });
      };
    });

    image.src = objectURL;

    const dimensions = await imageSizePromise;

    // Check if minimum dimensions are met
    if (dimensions.width < 250 || dimensions.height < 250) {
      Swal.fire({
        title: t("jobseekerChangePhoto.minFileSize"),
        icon: "warning",
        confirmButtonText: t("jobseekerChangePhoto.close"),
      });
      e.target.value = "";
      return; // Exit function
    }

    // Convert the file to base64
    const base64 = await convertToBase64(file);

    // Set the photo state
    setPhoto({ ...photo, profile_image: base64 });
  };

  return (
    <>
      <NavBar />
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <div className="container changeLogo">
            <div className="row">
              <div className="col-lg-3">
                <JSSidebar />
              </div>

              <div
                className="col-lg-9 mb-5"
                style={{
                  borderLeft: "2px solid #e6e8e7",
                  borderRight: "2px solid #e6e8e7",
                }}
              >
                <div className="d-flex mx-3 PageHeader">
                  <img src="/Images/employerSide/icon10color.png" alt="" />
                  <h3 className="mx-2">
                    {t("jobseekerChangePhoto.changeProfilePicture")}
                  </h3>
                </div>
                <div className="JSChangePhoto jobseekerChangePhoto mb-4 mt-5 mx-3">
                  {picture ? (
                    <img src={picture} alt="profile" />
                  ) : (
                    <img src="/Images/jobseekerSide/dummy-profile.png" alt="" />
                  )}
                </div>
                <form>
                  <div className="mb-4 mt-5 mx-3">
                    <div class="mb-5 DashBoardInputBx">
                      <label for="formFile" class="form-label">
                        {t("jobseekerChangePhoto.newImage")}
                        <span className="RedStar">*</span>
                      </label>
                      <input
                        class="form-control"
                        type="file"
                        id="formFile"
                        lable="Image"
                        name="profile_image"
                        accept=".jpeg, .png, .jpg, .webp, .svg, .gif"
                        onChange={(e) => handleFileUpload(e)}
                      />
                      <div id="emailHelp" class="form-text">
                        {t("jobseekerChangePhoto.belowTxt")}
                      </div>
                    </div>
                  </div>
                  <div className="buttonsSec">
                    <button
                      type="button"
                      className="btn btn-primary button1 mx-3"
                      onClick={handleClick}
                      style={{
                        backgroundColor: hoverFirstButtonColor
                          ? secondaryColor
                          : primaryColor,
                        border: hoverFirstButtonColor
                          ? secondaryColor
                          : primaryColor,
                      }}
                      onMouseEnter={handleFirstButtonMouseEnter}
                      onMouseLeave={handleFirstButtonMouseLeave}
                    >
                      {t("jobseekerChangePhoto.uploadButton")}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary button2"
                      onClick={() => navigate("/candidates/myaccount")}
                      style={{
                        color: hoverSecondButtonColor
                          ? primaryColor
                          : secondaryColor,
                        backgroundColor: "white",
                        border: hoverSecondButtonColor
                          ? `2px solid ${primaryColor}`
                          : `2px solid ${secondaryColor}`,
                      }}
                      onMouseEnter={handleSecondButtonMouseEnter}
                      onMouseLeave={handleSecondButtonMouseLeave}
                    >
                      {t("jobseekerChangePhoto.cancelButton")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <Footer />
        </>
      )}
    </>
  );
};

export default JSChangePhoto;

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
