import React, { useEffect, useState } from "react";
import Footer from "../element/Footer";
import NavBar from "../element/NavBar";
import Sidebar from "./Sidebar";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

const ImportJobseekers = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    jobseeker_list: "",
  });

  const [file, setFile] = useState(null);

  const tokenKey = Cookies.get("tokenClient");
  const navigate = useNavigate();
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

  const [hoverSampleDownloadColor, setHoverSampleDownloadColor] =
    useState(false);

  const handleSampleDownloadEnter = () => {
    setHoverSampleDownloadColor(true);
  };

  const handleSampleDownloadLeave = () => {
    setHoverSampleDownloadColor(false);
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 5 * 1024 * 1024) {
        Swal.fire({
          title: t("jobseekerAddDocuments.fileSizeValidation"),
          icon: "warning",
          confirmButtonText: t("jobseekerAddDocuments.close"),
        });
        e.target.value = null;

        return;
      }

      formData.append("file", files);
    }

    try {
      setLoading(true);
      const response = await axios.post(BaseApi + "/users/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          key: ApiKey,
          token: tokenKey,
        },
      });
      setLoading(false);
      if (response.data.status == 200) {
        Swal.fire({
          title: t("jobseekerAddDocuments.documentUploadSuccessTitle"),
          icon: "success",
          confirmButtonText: t("jobseekerAddDocuments.close"),
        });
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: t("jobseekerAddDocuments.close"),
        });
      }
      // getData();
    } catch (error) {
      setLoading(false);
      // if (error.message === "Network Error") {
      //   Cookies.remove("tokenClient");
      //   Cookies.remove("user_type");
      //   Cookies.remove("fname");
      //   navigate("/");
      //   Swal.fire({
      //     title: t("tokenExpired.tokenExpired"),
      //     icon: "warning",
      //     confirmButtonText: t("jobseekerAddDocuments.close"),
      //   });
      //   setTimeout(function () {
      //     window.location.reload();
      //   }, 3000);
      // }
      Swal.fire({
        title: t("jobseekerAddDocuments.documentUploadFailedTitle"),
        icon: "error",
        confirmButtonText: t("jobseekerAddDocuments.close"),
      });
    }
  };

  const handleSampleDownload = async () => {
    try {
      const response = await axios.get(BaseApi + "/users/export", {
        headers: {
          key: ApiKey,
          token: tokenKey,
        },
        responseType: 'blob', // Set the response type to blob
      });
  
      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
  
      // Create a link element and trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users.xlsx");
      document.body.appendChild(link);
      link.click();
  
      // Clean up
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading sample file:", error);
    }
  };
  

  useEffect(() => {
    // Check if tokenKey is not present
    if (!tokenKey) {
      // Redirect to the home page
      navigate("/user/employerlogin");
    } else {
      // TokenKey is present, fetch data or perform other actions
      // getData();
      window.scrollTo(0, 0);
    }
  }, [tokenKey, navigate]);

  return (
    <>
      <NavBar />
      <div className="container importJobseeker validation">
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
                  <img src="/Images/employerSide/icon5color.png" alt="" />
                  <h3 className="mx-2">
                    {t("employerImportJobseeker.importJobseeker")}
                  </h3>
                </div>
                <div className="sampleDownload">
                  <p
                    className="download"
                    style={{
                      color: hoverSampleDownloadColor
                        ? secondaryColor
                        : primaryColor,
                    }}
                    onMouseEnter={handleSampleDownloadEnter}
                    onMouseLeave={handleSampleDownloadLeave}
                    onClick={handleSampleDownload}
                  >
                    <i class="fa-solid fa-file-arrow-down"></i> Sample File
                    Download
                  </p>
                </div>
                <form>
                  <div className="mb-5 mt-5">
                    <div className="form-outline mb-5 DashBoardInputBx">
                      <label htmlFor="formFile" className="form-label">
                        {t("employerImportJobseeker.importFile")}
                      </label>
                      <input
                        className={`form-control ${
                          errors.jobseeker_list && "input-error"
                        }`}
                        type="file"
                        id="formFile"
                        lable="Image"
                        name="profile_image"
                        accept=".xls, .xlsx, .csv, .txt"
                        onChange={(e) => handleFileUpload(e)}
                      />
                      {errors.jobseeker_list && (
                        <div className="text-danger">
                          {errors.jobseeker_list}
                        </div>
                      )}
                      <div id="emailHelp" className="form-text">
                        {t("employerImportJobseeker.belowTxt1")}
                      </div>
                    </div>
                  </div>
                  <div className="bottomButtons importJobseekersButtons">
                    <button
                      type="button"
                      className="btn btn-primary button1"
                      // onClick={handleClick}
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
                      {t("employerImportJobseeker.uploadButton")}
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
                      {t("employerImportJobseeker.cancelButton")}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ImportJobseekers;

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
