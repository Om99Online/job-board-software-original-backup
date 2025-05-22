import React, { useEffect, useRef, useState } from "react";
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

const JSAddDocuments = () => {
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState("");
  const tokenKey = Cookies.get("tokenClient");
  const [t, i18n] = useTranslation("global");

  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");

  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const [totalData, setTotalData] = useState([]);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/candidates/editcvdocuments",
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
      setTotalData(response.data.response);
      setDocuments(response.data.response.showOldDocs);
      setCertificates(response.data.response.showOldImages);
      console.log(documents, "documents");
    } catch (error) {
      setLoading(false);
      console.log("Cannot get video data");
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
    }
  };

  const handleVideoRemove = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Delete Video CV?",
        text: "Do you want to delete this video CV?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
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
          title: "Video CV deleted successfully!",
          icon: "success",
          confirmButtonText: t("jobseekerAddDocuments.close"),
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Could not delete video. Please try after some time!",
        icon: "error",
        confirmButtonText: t("jobseekerAddDocuments.close"),
      });
    }
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

      formData.append(`selectedCV[]`, files[i]);
    }

    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/candidates/editcvdocuments",
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
      getData();
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
          confirmButtonText: t("jobseekerAddDocuments.close"),
        });
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      }
      Swal.fire({
        title: t("jobseekerAddDocuments.documentUploadFailedTitle"),
        icon: "error",
        confirmButtonText: t("jobseekerAddDocuments.close"),
      });
    }
  };

  // Document Download Code
  const [docDownloadPath, setDocDownloadPath] = useState();
  const [downloadActive, setDownloadActive] = useState(false);
  const handleDocDownload = async (path, doc) => {
    setDocDownloadPath(path + doc);
    setDownloadActive(true);
    // console.log(docDownloadPath);
  };
  useEffect(() => {
    // console.log(downloadActive, DOCDownloadURL)
    if (downloadActive && docDownloadPath) {
      // Create a hidden link element
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = docDownloadPath;
      link.download = "generated-cv.doc";
      document.body.appendChild(link);

      // Trigger a click on the link
      link.click();

      // Clean up
      document.body.removeChild(link);
      setDownloadActive(false);
    }
  }, [downloadActive, docDownloadPath]);

  // Image Download Code
  const [imagePath, setImagePath] = useState();
  const [imageDownloadActive, setImageDownloadActive] = useState(false);

  const handleImageDownload = async (path) => {
    setImagePath(path);
    setImageDownloadActive(true);
  };
  useEffect(() => {
    // console.log(downloadActive, DOCDownloadURL)
    if (imageDownloadActive && imagePath) {
      // Create a hidden link element
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = imagePath;
      link.download = "generated-img.jpeg";
      document.body.appendChild(link);

      // Trigger a click on the link
      link.click();

      // Clean up
      document.body.removeChild(link);
      setImageDownloadActive(false);
    }
  }, [imageDownloadActive, imagePath]);

  // Code for certificate and document delete
  const handleDocumentsRemove = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: t("jobseekerAddDocuments.deleteDocumentConfirmTitle"),
        text: t("jobseekerAddDocuments.deleteDocumentConfirmTxt"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("jobseekerAddDocuments.yes"),
        cancelButtonText: t("jobseekerAddDocuments.no"),
      });
      if (confirmationResult.isConfirmed) {
        const response = await axios.post(
          BaseApi + `/candidates/deleteCertificate/${slug}`,
          null, // Pass null as the request body if not required
          {
            headers: {
              "Content-Type": "application/json",
              key: ApiKey,
              token: tokenKey,
            },
          }
        );
        if (response.data.status === 200) {
          getData();
          Swal.fire({
            title: t("jobseekerAddDocuments.deleteDocumentSuccessTitle"),
            icon: "success",
            confirmButtonText: t("jobseekerAddDocuments.close"),
          });
        } else if (response.data.status === 400) {
          Cookies.remove("tokenClient");
          Cookies.remove("user_type");
          Cookies.remove("fname");
          navigate("/");
          Swal.fire({
            title: response.data.message,
            icon: "warning",
            confirmButtonText: t("jobseekerAddDocuments.close"),
          });
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: t("jobseekerAddDocuments.close"),
          });
        }
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
          confirmButtonText: t("jobseekerAddDocuments.close"),
        });
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      }
      Swal.fire({
        title: t("jobseekerAddDocuments.deleteDocumentFailedTitle"),
        icon: "error",
        confirmButtonText: t("jobseekerAddDocuments.close"),
      });
      console.log("Cannot delete certificate");
    }
  };

  const handleCertificateRemove = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: t("jobseekerAddDocuments.deleteCertificateConfirmTitle"),
        text: t("jobseekerAddDocuments.deleteCertificateConfirmTxt"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("jobseekerAddDocuments.yes"),
        cancelButtonText: t("jobseekerAddDocuments.no"),
      });
      if (confirmationResult.isConfirmed) {
        const response = await axios.post(
          BaseApi + `/candidates/deleteCertificate/${slug}`,
          null, // Pass null as the request body if not required
          {
            headers: {
              "Content-Type": "application/json",
              key: ApiKey,
              token: tokenKey,
            },
          }
        );
        if (response.data.status === 200) {
          getData();
          Swal.fire({
            title: t("jobseekerAddDocuments.deleteCertificateSuccessTitle"),
            icon: "success",
            confirmButtonText: t("jobseekerAddDocuments.close"),
          });
        } else if (response.data.status === 400) {
          Cookies.remove("tokenClient");
          Cookies.remove("user_type");
          Cookies.remove("fname");
          navigate("/");
          Swal.fire({
            title: response.data.message,
            icon: "warning",
            confirmButtonText: t("jobseekerAddDocuments.close"),
          });
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: t("jobseekerAddDocuments.close"),
          });
        }
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
          confirmButtonText: t("jobseekerAddDocuments.close"),
        });
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      }
      Swal.fire({
        title: t("jobseekerAddDocuments.deleteCertificateFailedTitle"),
        icon: "error",
        confirmButtonText: t("jobseekerAddDocuments.close"),
      });
      console.log("Cannot delete certificate");
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
          <div className="container editProfile JSAddDocuments">
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
                  <h3 className="">
                    {t("jobseekerAddDocuments.addCvDocuments")}
                  </h3>
                </div>
                <form>
                  <div className="mb-5 mt-5 mx-4">
                    <div className="form-outline mb-4 DashBoardInputBx">
                      <label className="form-label" htmlFor="form3Example3">
                        {t("jobseekerAddDocuments.addCvDocuments")}
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="formFile"
                        name="files"
                        multiple
                        onChange={(e) => handleFileUpload(e)}
                      />

                      <div id="emailHelp" className="form-text">
                        {t("jobseekerAddDocuments.belowTxt1")}
                      </div>
                    </div>
                    <div class="JobseekerCertificatesDetails ">
                      <p className="existingUploadsHeading">
                        {t("jobseekerAddDocuments.existingUploads")}
                      </p>
                      <hr />
                      <ul className="certificatesSection">
                        <p>{t("jobseekerMyProfile.certificates")}: </p>
                        {certificates.length > 0
                          ? certificates.map((i, index) => {
                              return (
                                <>
                                  <li className="eachCertificateMyprofile">
                                    <img
                                      src="/Images/jobseekerSide/cancel.png"
                                      alt=""
                                      class="jsprofileCross"
                                      onClick={() =>
                                        handleCertificateRemove(i.slug)
                                      }
                                    />
                                    <i
                                      onClick={() =>
                                        handleImageDownload(i.image)
                                      }
                                    >
                                      <img
                                        className="JSmyProfileCertificateImage"
                                        src={i.image}
                                        alt="icon"
                                      />
                                    </i>
                                    <span>
                                      {/* {t("jobseekerMyProfile.certificate")}{" "}
                                      {index + 1} */}
                                      {i.image_name}
                                    </span>
                                  </li>
                                </>
                              );
                            })
                          : t("jobseekerMyProfile.notAvailable")}
                      </ul>

                      <ul className="certificatesSection">
                        <p>{t("jobseekerMyProfile.documents")}: </p>
                        {documents.length > 0
                          ? documents.map((i, index) => {
                              return (
                                <>
                                  <li className="eachDocumentMyprofile">
                                    {/* <i
                                      class="fa-regular fa-circle-xmark jsprofileCross"
                                      onClick={() =>
                                        handleDocumentsRemove(i.slug)
                                      }
                                    ></i> */}
                                    <img
                                      src="/Images/jobseekerSide/cancel.png"
                                      alt=""
                                      class="jsprofileCross"
                                      onClick={() =>
                                        handleDocumentsRemove(i.slug)
                                      }
                                    />
                                    <i
                                      class="fa-solid fa-file"
                                      onClick={() =>
                                        handleDocDownload(i.path, i.doc)
                                      }
                                    ></i>
                                    {i.doc?.substring(0, 14)}..
                                    {/* {t("jobseekerAddDocuments.document")}{" "}
                                    {index + 1} */}
                                  </li>
                                </>
                              );
                            })
                          : t("jobseekerMyProfile.notAvailable")}
                      </ul>
                    </div>
                    <div id="emailHelp" className="form-text">
                      {t("jobseekerAddDocuments.belowTxt2")}
                    </div>
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

export default JSAddDocuments;
