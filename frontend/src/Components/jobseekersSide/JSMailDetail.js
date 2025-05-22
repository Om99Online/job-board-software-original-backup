import React, { useEffect, useState } from "react";
import Footer from "../element/Footer";
import JSSidebar from "./JSSidebar";
import NavBar from "../element/NavBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ApiKey from "../api/ApiKey";
import BaseApi from "../api/BaseApi";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const JSMailDetail = () => {
  const [loading, setLoading] = useState(false);
  const [mailDetail, setMailDetail] = useState([]);
  const [mailReceiver, setMailReceiver] = useState([]);
  const [mailSender, setMailSender] = useState([]);
  const [mailImages, setMailImages] = useState([]);

  const [mailReply, setMailReply] = useState({
    subject: "",
    message: "",

    emailFiles: [],
  });

  const [validationMessages, setValidationMessages] = useState({
    subject: "",
    message: "",
  });
  const [t, i18n] = useTranslation("global");

  const [selectedFileName, setSelectedFileName] = useState([]);

  const { slug } = useParams();

  const navigate = useNavigate();

  const tokenKey = Cookies.get("tokenClient");

  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");

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

  const [hoverThirdButtonColor, setHoverThirdButtonColor] = useState(false);

  const handleThirdButtonMouseEnter = () => {
    setHoverThirdButtonColor(true);
  };

  const handleThirdButtonMouseLeave = () => {
    setHoverThirdButtonColor(false);
  };

  const [hoverFourthButtonColor, setHoverFourthButtonColor] = useState(false);

  const handleFourthButtonMouseEnter = () => {
    setHoverFourthButtonColor(true);
  };

  const handleFourthButtonMouseLeave = () => {
    setHoverFourthButtonColor(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMailReply((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationMessages((prev) => ({
      ...prev,
      [name]: "",
    }));
    if (
      !validationMessages.subject == "" ||
      !validationMessages.message == ""
    ) {
      setEmpty(true);
    }
    if (mailReply.subject == "" || mailReply.message == "") {
      setEmpty(true);
    }
  };


  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/candidates/maildetail/${slug}`,
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
        setMailDetail(response.data.response.mails);
        setMailReceiver(response.data.response.mails.reciever);
        if(response.data.response.mails.sender !== null){
        setMailSender(response.data.response.mails.sender);
        }
        setMailImages(response.data.response.images);
      } else if (response.data.status === 400) {
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: t("jobseekerMailDetail.close"),
        });
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: t("jobseekerMailDetail.close"),
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
      console.log("Cannot get mail detail of mail history page at job seeker");
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const [empty, setEmpty] = useState(false);

  const handleReply = async (slug) => {
    try {
      if (!mailReply.subject.trim() || !mailReply.message.trim()) {
        setValidationMessages((prevMessages) => ({
          ...prevMessages,
          subject:
            mailReply.subject.trim() === ""
              ? t("jobseekerMailDetail.subjectRequired")
              : "",
          message:
            mailReply.message.trim() === ""
              ? t("jobseekerMailDetail.messageRequired")
              : "",
        }));
        setEmpty(false);
        return; // Stop further execution
      }
      setEmpty(true);
      const updatedReply = {
        ...mailReply,
        selectedFileName: selectedFileName,
        id: mailDetail.from_id,
      };

      const formData = new FormData();
      selectedFileName.forEach((fileName, index) => {
        formData.append(`selectedFileNames[${index}]`, fileName);
      });

      setLoading(true);
      const response = await axios.post(
        BaseApi + `/candidates/sendmailemployer/${slug}`,
        updatedReply,
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
        Swal.fire({
          title: t("jobseekerMailDetail.replySentSuccess"),
          icon: "success",
          confirmButtonText: t("jobseekerMailDetail.close"),
        });
        // getData();
        // window.location.reload();
        // navigate(`/candidates/profile/${mailDetail.slug}`);
        window.history.back();
      } else if (response.data.status === 400) {
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: t("jobseekerMailDetail.close"),
        });
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: t("jobseekerMailDetail.close"),
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
      Swal.fire({
        title: t("jobseekerMailDetail.failedTitle"),
        text: t("jobseekerMailDetail.failedTxt"),
        icon: "error",
        confirmButtonText: t("jobseekerMailDetail.close"),
      });
    }
  };

  return (
    <>
      <NavBar />
      <div className="container editProfile">
        {/* Reply Modal  */}
        <div
          class="modal fade"
          id="ReplyModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">
                  {t("jobseekerMailDetail.replyMail")}
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div class="form-outline mb-5 mt-4 DashBoardInputBx">
                  <label class="form-label" for="form3Example3">
                    {t("jobseekerMailDetail.subject")}{" "}
                    <span className="RedStar">*</span>
                  </label>
                  <input
                    type="text"
                    id="form3Example3"
                    class="form-control"
                    placeholder={t("jobseekerMailDetail.subject")}
                    value={mailReply.subject}
                    name="subject"
                    onChange={handleChange}
                  />
                  <div className="text-danger mt-2">
                    {validationMessages.subject}
                  </div>
                </div>
                <div class="form-outline mb-5 DashBoardInputBx">
                  <label class="form-label" for="form3Example3">
                    {t("jobseekerMailDetail.message")}
                    <span className="RedStar">*</span>
                  </label>
                  <input
                    type="text"
                    id="form3Example3"
                    class="form-control"
                    placeholder={t("jobseekerMailDetail.message")}
                    value={mailReply.message}
                    name="message"
                    onChange={handleChange}
                  />
                  <div className="text-danger mt-2">
                    {validationMessages.message}
                  </div>
                </div>
                <div class="form-outline mb-3 DashBoardInputBx">
                  <label for="formFile" class="form-label">
                    {t("jobseekerMailDetail.multipleImages")}
                  </label>
                  <input
                    type="file"
                    id="formFile"
                    className="form-control"
                    name="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);

                      // Capture the selected file names
                      const fileNames = files.map((file) => file.name);
                      setSelectedFileName(fileNames);

                      // Convert each selected file to base64 encoding
                      Promise.all(
                        files.map((file) => convertFileToBase64(file))
                      )
                        .then((base64Array) => {
                          setMailReply({
                            ...mailReply,
                            emailFiles: base64Array,
                          });
                        })
                        .catch((error) => {
                          console.error(
                            "Error converting files to base64:",
                            error
                          );
                        });
                    }}
                  />{" "}
                  <div id="emailHelp" class="form-text mt-2">
                    {t("jobseekerMailDetail.belowTxt1")}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary button1"
                  onClick={() => handleReply(mailDetail.slug)}
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
                  data-bs-dismiss={empty && `modal`}
                  aria-label={empty && `close`}
                >
                  {t("jobseekerMailDetail.submitButton")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-3">
            <JSSidebar />
          </div>
          {loading ? (
            <div className="loader-container"></div>
          ) : (
            <>
              <div
                className="col-lg-9 mb-5 mailDetail"
                style={{
                  borderLeft: "2px solid #e6e8e7",
                  borderRight: "2px solid #e6e8e7",
                }}
              >
                <div className="mx-3 d-flex mb-4 PageHeader">
                  <img src="/Images/employerSide/icon8color.png" alt="" />
                  <h3 className="">{t("jobseekerMailDetail.mailDetail")}</h3>
                </div>
                <div className="mx-4 mb-5 mailDetailBx">
                  {mailSender.length != "" && (
                    <div className="MDButtonBx">
                    <button
                      className="replyButton"
                      data-bs-toggle="modal"
                      data-bs-target="#ReplyModal"
                      style={{
                        backgroundColor: hoverThirdButtonColor
                          ? secondaryColor
                          : primaryColor,
                        border: hoverThirdButtonColor
                          ? secondaryColor
                          : primaryColor,
                      }}
                      onMouseEnter={handleThirdButtonMouseEnter}
                      onMouseLeave={handleThirdButtonMouseLeave}
                    >
                      {t("jobseekerMailDetail.replyButton")}
                    </button>
                  </div>
                  )}
                  
                  {mailSender != "" || mailSender != null ? (
                    <>
                    <h5>
                    {t("jobseekerMailDetail.dear")}{" "}
                    {mailReceiver.first_name ? mailReceiver.first_name : ""}{" "}
                    {mailReceiver.last_name ? mailReceiver.last_name : ""},
                  </h5>
                  <p>
                    {t("jobseekerMailDetail.line1")} <br />
                    {t("jobseekerMailDetail.companyName")} :{" "}
                    {mailSender.company_name ? mailSender.company_name : "N/A"}
                    <br />
                    {t("jobseekerMailDetail.emailAddress")} :{" "}
                    {mailSender.email_address ? mailSender.email_address : "N/A"}
                    <br />
                    {t("jobseekerMailDetail.subject")} :{" "}
                    {mailDetail.subject ? mailDetail.subject : ""}
                    <br />
                    {t("jobseekerMailDetail.message")} :{" "}
                    {mailDetail.message ? mailDetail.message : ""}
                  </p>
                  </>
                  ): "Not Available"}

                  
                </div>
                {mailImages && (
                  <>
                    <p className="fw-bold">Attachments:</p>
                    <div className="jobseekerMailImageBox">
                      {mailImages &&
                        Object.entries(mailImages).map(([key, value]) => {
                          return <img src={value} />;
                        })}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default JSMailDetail;
