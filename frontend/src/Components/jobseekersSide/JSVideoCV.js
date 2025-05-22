import React, { useEffect, useState } from "react";
import Footer from "../element/Footer";
import JSSidebar from "./JSSidebar";
import NavBar from "../element/NavBar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import ApiKey from "../api/ApiKey";
import BaseApi from "../api/BaseApi";
import ReactPlayer from "react-player";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const JSVideoCV = () => {
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState("");
  const tokenKey = Cookies.get("tokenClient");
  const [t, i18n] = useTranslation("global");

  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");

  const navigate = useNavigate();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/candidates/addVideoCv",
        null,
        {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            token: tokenKey,
          },
        }
      );
      setLoading(false);
      setVideo(response.data.response.path);
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
      console.log("Cannot get video data");
    }
  };

  const handleVideoRemove = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: t("jobseekerVideoCV.confirmTitleVideoRemove"),
        text: t("jobseekerVideoCV.confirmTxtVideoRemove"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("jobseekerVideoCV.yes"),
        cancelButtonText: t("jobseekerVideoCV.no"),
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseApi + "/candidates/deleteVideo",
          null,
          {
            headers: {
              "Content-Type": "application/json",
              key: ApiKey,
              token: tokenKey,
            },
          }
        );
        setLoading(false);
        getData();
        Swal.fire({
          title: t("jobseekerVideoCV.successTxtVideoRemove"),
          icon: "success",
          confirmButtonText: t("jobseekerVideoCV.close"),
        });
      }
    } catch (error) {
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
        title: t("jobseekerVideoCV.failedTxtVideoRemove"),
        icon: "error",
        confirmButtonText: t("jobseekerVideoCV.close"),
      });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    // Check if the file size is greater than 20MB
    if (file.size > 20 * 1024 * 1024) {
      // Convert MB to bytes
      Swal.fire({
        title: t("jobseekerVideoCV.fileSizeExceeded"),
        icon: "warning",
        confirmButtonText: t("jobseekerVideoCV.close"),
      });
      e.target.value = "";
      return; // Stop execution
    }
    const formData = new FormData();
    formData.append("video", file);

    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/candidates/addVideoCv",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            key: ApiKey,
            token: tokenKey,
          },
        }
      );
      setLoading(false);
      setVideo(response.data.response.path);
      Swal.fire({
        title: t("jobseekerVideoCV.successTxtVideoUpload"),
        icon: "success",
        confirmButtonText: t("jobseekerVideoCV.close"),
      });
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
        title: t("jobseekerVideoCV.failedTxtVideoUpload"),
        icon: "error",
        confirmButtonText: t("jobseekerVideoCV.close"),
      });
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

  return (
    <>
      <NavBar />
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <div className="container editProfile">
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
                <div className="mx-3 d-flex PageHeader">
                  <img src="/Images/employerSide/icon8color.png" alt="" />
                  <h3 className="">{t("jobseekerVideoCV.videoCV")}</h3>
                </div>
                <form>
                  <div className="mb-5 mt-5 mx-4">
                    <div className="form-outline mb-4 DashBoardInputBx">
                      <label className="form-label" htmlFor="form3Example3">
                        {t("jobseekerVideoCV.addVideoFile")}
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="formFile"
                        name="video"
                        accept=".mp4, .3gp, .avi, .mov"
                        onChange={(e) => handleFileUpload(e)}
                      />
                      <div id="emailHelp" className="form-text">
                        {t("jobseekerVideoCV.belowTxt")}
                      </div>
                    </div>
                    {video && (
                      <div className="form-outline mb-5 DashBoardInputBx">
                        <label htmlFor="formFile" className="form-label">
                          {t("jobseekerVideoCV.uploadedVideo")}
                        </label>
                        <div className="ChoosPlanBx checkCertificate">
                          <div className="EPJobseekerCertificatesDetails EPJobseekerVidio">
                            <ul>
                              <li>
                                <i
                                  className="fa-regular fa-circle-xmark jsprofileCross"
                                  onClick={handleVideoRemove}
                                ></i>
                                <i>
                                  <ReactPlayer
                                    url={video}
                                    controls={true}
                                    width={250}
                                    height={250}
                                    allowfullscreen={true}
                                  />
                                </i>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
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

export default JSVideoCV;
