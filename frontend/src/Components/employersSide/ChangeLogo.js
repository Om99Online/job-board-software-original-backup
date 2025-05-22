import React, { useEffect, useState } from "react";
import NavBar from "../element/NavBar";
import Sidebar from "./Sidebar";
import Footer from "../element/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const ChangeLogo = () => {
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("tokenClient");
  const navigate = useNavigate();
  const [photo, setPhoto] = useState({
    company_logo: "",
    profile_image: "",
  });
  const [errors, setErrors] = useState({
    company_logo: "",
    profile_image: "",
  });
  const [logo, setLogo] = useState("");
  const [establishmentPhoto, setEstablishmentPhoto] = useState("");

  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  const [t, i18n] = useTranslation("global");

  const [hoverSearchColor, setHoverSearchColor] = useState(false);

  const handleSearchMouseEnter = () => {
    setHoverSearchColor(true);
  };

  const handleSearchMouseLeave = () => {
    setHoverSearchColor(false);
  };

  const [hoverUploadCVColor, setHoverUploadCVColor] = useState(false);

  const handleUploadCVMouseEnter = () => {
    setHoverUploadCVColor(true);
  };

  const handleUploadCVMouseLeave = () => {
    setHoverUploadCVColor(false);
  };

  useEffect(() => {
    // Check if tokenKey is not present
    if (!tokenKey) {
      // Redirect to the home page
      navigate("/user/employerlogin");
    } else {
      // TokenKey is present, fetch data or perform other actions
      getData();
      window.scrollTo(0, 0);
    }
  }, [tokenKey, navigate]);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/users/uploadPhoto",
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
        setLogo(response.data.response.profile_image);
        setEstablishmentPhoto(response.data.response.company_logo);
      } else if (response.data.status === 400) {
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: t("employerChangeLogo.close"),
        });
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: t("employerChangeLogo.close"),
        });
      }
    } catch (error) {
      setLoading(false);
      if(error.message === "Network Error") {
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

  const handleClick = async () => {
    try {
      const newErrors = {};

      if (photo.company_logo === "" || photo.company_logo === null) {
        newErrors.company_logo = t("employerChangeLogo.companyLogoRequired");
        window.scrollTo(0, 0);
      }
      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: t("employerChangeLogo.logoConfirmTitle"),
          text: t("employerChangeLogo.logoConfirmTxt"),
          icon: "question",
          showCancelButton: true,
          confirmButtonText: t("employerChangeLogo.yes"),
          cancelButtonText: t("employerChangeLogo.no"),
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseApi + "/users/uploadPhoto",
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
              title: t("employerChangeLogo.successTitle"),
              icon: "success",
              confirmButtonText: t("employerChangeLogo.close"),
            });
            // window.location.reload();
            setPhoto({...photo,
              company_logo: "",
              profile_image: ""
            })
            window.scrollTo(0, 0);
          } else if (response.data.status === 400) {
            Cookies.remove("tokenClient");
            Cookies.remove("user_type");
            Cookies.remove("fname");
            navigate("/");
            Swal.fire({
              title: response.data.message,
              icon: "warning",
              confirmButtonText: t("employerChangeLogo.close"),
            });
          } else {
            Swal.fire({
              title: response.data.message,
              icon: "error",
              confirmButtonText: t("employerChangeLogo.close"),
            });
          }
        }
      }
    } catch (error) {
      setLoading(false);
      if(error.message === "Network Error") {
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
        title: t("employerChangeLogo.failedTitle"),
        icon: "error",
        confirmButtonText: t("employerChangeLogo.close"),
      });
      console.log("Could not update photo!");
    }
  };

  const handleFileUpload1 = async (e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    const fileSizeInBytes = file.size;
    const maxSizeInBytes = 500 * 1024; // 500kb
    if (fileSizeInBytes > maxSizeInBytes) {
      // File size exceeds 500kb, show an error message or take appropriate action
      Swal.fire({
        title: t("employerEditProfile.fileSizeExceed"),
        icon: "warning",
        confirmButtonText: t("employerCreateJob.close"),
      });
      e.target.value = "";
      // console.log("File size exceeds 500kb. Please choose a smaller file.");
      return;
    }


    const base64 = await convertToBase64(file);
    // console.log(base64);
    setPhoto({ ...photo, profile_image: base64 });
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // const handleFileUpload1 = async (e) => {
  //   const { name } = e.target;
  //   const file = e.target.files[0];
  
  //   const fileSizeInBytes = file.size;
  //   const maxSizeInBytes = 500 * 1024; // 500kb
  //   if (fileSizeInBytes > maxSizeInBytes) {
  //     // File size exceeds 500kb, show an error message or take appropriate action
  //     Swal.fire({
  //       title: t("employerEditProfile.fileSizeExceed"),
  //       icon: "warning",
  //       confirmButtonText: t("employerCreateJob.close"),
  //     });
  //     return;
  //   }
  
  //   const image = new Image();
  //   image.src = URL.createObjectURL(file);
  
  //   image.onload = function () {
  //     if (image.width < 250 || image.height < 250) {
  //       // Image dimensions are less than 250x250px, show an error message or take appropriate action
  //       Swal.fire({
  //         title: t("employerChangeLogo.imageSizeError"),
  //         icon: "warning",
  //         confirmButtonText: t("employerCreateJob.close"),
  //       });
  //       return;
  //     }
  
  //     // Image meets all criteria, proceed with processing
  //     const base64 = convertToBase64(file);
  //     setPhoto({ ...photo, profile_image: base64 });
  //     setErrors((prev) => ({
  //       ...prev,
  //       [name]: "",
  //     }));
  //   };
  // };
  

  // const handleFileUpload2 = async (e) => {
  //   const file = e.target.files[0];

  //   const fileSizeInBytes = file.size;
  //   const maxSizeInBytes = 500 * 1024; // 500kb
  //   if (fileSizeInBytes > maxSizeInBytes) {
  //     // File size exceeds 500kb, show an error message or take appropriate action
  //     Swal.fire({
  //       title: t("employerEditProfile.fileSizeExceed"),
  //       icon: "warning",
  //       confirmButtonText: t("employerCreateJob.close"),
  //     });
  //     // console.log("File size exceeds 500kb. Please choose a smaller file.");
  //     return;
  //   }


  //   const base64 = await convertToBase64(file);
  //   // console.log(base64);
  //   setPhoto({ ...photo, company_logo: base64 });
  // };

  const handleFileUpload2 = async (e) => {
    const file = e.target.files[0];
    setErrors((prev) => ({
      company_logo: ""
    }))
  
    const fileSizeInBytes = file.size;
    const maxSizeInBytes = 500 * 1024; // 500kb
    if (fileSizeInBytes > maxSizeInBytes) {
      // File size exceeds 500kb, show an error message or take appropriate action
      Swal.fire({
        title: t("employerEditProfile.fileSizeExceed"),
        icon: "warning",
        confirmButtonText: t("employerCreateJob.close"),
      });
      e.target.value = "";
      return;
    }
  
    const image = new Image();
    image.src = URL.createObjectURL(file);
    
    image.onload = async function() {
      if (image.width < 250 || image.height < 250) {
        // Image dimensions are less than 250px, show an error message or take appropriate action
        Swal.fire({
          title: t("employerChangeLogo.imageSizeError"),
          icon: "warning",
          confirmButtonText: t("employerCreateJob.close"),
        });
        e.target.value = "";

        return;
      }
      
      // Image meets all criteria, proceed with processing
      const base64 = await convertToBase64(file);
      setPhoto({ ...photo, company_logo: base64 });
    };
  };
  

  useEffect(() => {
    getData();
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <NavBar />

      <div className="container changeLogo editProfile">
        <div className="row">
          <div className="col-lg-3">
            <Sidebar />
          </div>
          {loading ? (
            <div className="loader-container"></div>
          ) : (
            <>
              <div
                className="col-lg-9 mb-5 CLPanelRight"
                style={{
                  borderLeft: "2px solid #e6e8e7",
                  borderRight: "2px solid #e6e8e7",
                }}
              >
                <div className="d-flex PageHeader">
                  <img src="/Images/employerSide/icon10color.png" alt="" />
                  <h3 className="mx-2">{t("employerChangeLogo.changeLogo")}</h3>
                </div>
                <div className="ChangePhotoEmployers mb-4 mt-5">
                  {establishmentPhoto ? (
                    <img src={establishmentPhoto} alt="profile" />
                  ) : (
                    <img src="/Images/jobseekerSide/dummy-profile.png" alt="" />
                  )}
                </div>
                <form>
                  <div className="mb-4 mt-5">
                    <div class="mb-5 DashBoardInputBx">
                      <label for="formFile" class="form-label">
                        {t("employerChangeLogo.newLogo")}
                        <span className="RedStar">*</span>
                      </label>
                      <input
                        class="form-control"
                        type="file"
                        id="formFile"
                        lable="Image"
                        name="company_logo"
                        accept=".jpeg, .png, .jpg, .gif, .webp, .svg"
                        onChange={(e) => handleFileUpload2(e)}
                      />
                      {errors.company_logo && (
                        <div className="text-danger">
                          {errors.company_logo}
                        </div>
                      )}
                      <div id="emailHelp" class="form-text">
                        {t("employerChangeLogo.belowTxt1")}
                      </div>
                    </div>
                  </div>
                  
                </form>
                <div className="ChangePhotoEmployers mb-4 mt-5">
                  {logo ? (
                    <img src={logo} alt="profile" />
                  ) : (
                    <img src="/Images/jobseekerSide/dummy-profile.png" alt="" />
                  )}
                </div>
                <form>
                  <div className="mb-4 mt-5">
                    <div class="mb-5 DashBoardInputBx">
                      <label for="formFile" class="form-label">
                        {t("employerChangeLogo.uploadEstablishmentPhoto")}
                      </label>
                      <input
                        className={`form-control ${
                          errors.profile_image && "input-error"
                        }`}
                        type="file"
                        id="formFile"
                        lable="Image"
                        name="profile_image"
                        accept=".jpeg, .png, .jpg, .gif"
                        onChange={(e) => handleFileUpload1(e)}
                      />
                      {errors.profile_image && (
                        <div className="text-danger">
                          {errors.profile_image}
                        </div>
                      )}
                      <div id="emailHelp" class="form-text">
                        {t("employerChangeLogo.belowTxt2")}
                      </div>
                    </div>
                  </div>
                </form>
                <div className="bottomButtons changeLogoButtons">
                    <button
                      type="button"
                      className="btn btn-primary button1"
                      onClick={handleClick}
                      style={{
                        backgroundColor: hoverSearchColor
                          ? secondaryColor
                          : primaryColor,
                        border: hoverSearchColor
                          ? secondaryColor
                          : primaryColor,
                      }}
                      onMouseEnter={handleSearchMouseEnter}
                      onMouseLeave={handleSearchMouseLeave}
                    >
                      {t("employerChangeLogo.uploadButton")}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary button2"
                      style={{
                        color: hoverUploadCVColor
                          ? primaryColor
                          : secondaryColor,
                        backgroundColor: "white",
                        border: hoverUploadCVColor
                          ? `2px solid ${primaryColor}`
                          : `2px solid ${secondaryColor}`,
                      }}
                      onMouseEnter={handleUploadCVMouseEnter}
                      onMouseLeave={handleUploadCVMouseLeave}
                    >
                      {t("employerChangeLogo.cancelButton")}
                    </button>
                  </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ChangeLogo;

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
