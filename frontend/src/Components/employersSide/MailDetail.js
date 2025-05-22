import React, { useEffect, useState } from "react";
import Footer from "../element/Footer";
import NavBar from "../element/NavBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ApiKey from "../api/ApiKey";
import BaseApi from "../api/BaseApi";
import Sidebar from "./Sidebar";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

const MailDetail = () => {
  const [loading, setLoading] = useState(false);
  const [mailDetail, setMailDetail] = useState([]);
  const [mailReceiver, setMailReceiver] = useState([]);
  const [mailSender, setMailSender] = useState([]);

  const [mailImages, setMailImages] = useState([]);

  const { slug } = useParams();

  const navigate = useNavigate();
  const [t, i18n] = useTranslation("global");

  const tokenKey = Cookies.get("tokenClient");

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

  let displayPath = "";
  let filesData = "";

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/users/maildetail/${slug}`,
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
        displayPath = response.data.response.display_path;
        filesData = response.data.response.mails.files;

        fileEndPathFetcher(filesData);
        setMailDetail(response.data.response.mails);
        if (response.data.response.mails.reciever !== null){
          setMailReceiver(response.data.response.mails.reciever);
          
        }
        setMailImages(response.data.response.mailImagePaths);
        if (response.data.response.mails.sender !== null) {
          setMailSender(response.data.response.mails.sender);
        }
        // setMailReceiver(response.data.response.mails.reciever);

        console.log(mailDetail);
      } else if (response.data.status === 400) {
        // setLoading(false);
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: t("membershipPlan.close"),
        });
      } else {
        Swal.fire({
          title: t("employerFavouriteListProfile.addFavFailedTitle"),
          text: response.data.message,
          icon: "error",
          confirmButtonText: t("membershipPlan.close"),
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
      console.log(
        "Cannot get mail detail of mail history page at employer side"
      );
    }
  };

  const [totalPath, setTotalPath] = useState([]);
  let totalData = [];

  const fileEndPathFetcher = (filesData) => {
    if (filesData.length > 0) {
      let eachPath = filesData.split(",");
      console.log(eachPath, "eachPath");

      for (let i = 0; i < eachPath.length; i++) {
        let eachIndividualPath = displayPath + eachPath[i].trim(); // Remove whitespace using trim()
        console.log(eachIndividualPath, "individualPath");
        // setTotalPath([...totalPath, eachIndividualPath]);
        totalData[i] = eachIndividualPath;
      }
      console.log(totalData, "totalData");
      setTotalPath(totalData);
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
                  Reply Mail
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
                    Subject <span className="RedStar">*</span>
                  </label>
                  <input
                    type="text"
                    id="form3Example3"
                    class="form-control"
                    placeholder="Subject"
                    // value={password.new_password}
                    // name="new_password"
                    // onChange={handleChange}
                  />
                </div>
                <div class="form-outline mb-5 DashBoardInputBx">
                  <label class="form-label" for="form3Example3">
                    Message <span className="RedStar">*</span>
                  </label>
                  <input
                    type="text"
                    id="form3Example3"
                    class="form-control"
                    placeholder="Message"
                    // value={password.new_password}
                    // name="new_password"
                    // onChange={handleChange}
                  />
                </div>
                <div class="form-outline mb-3 DashBoardInputBx">
                  <label for="formFile" class="form-label">
                    Multiple Images
                  </label>
                  <input class="form-control" type="file" id="formFile" />
                  <div id="emailHelp" class="form-text mt-2">
                    Select multiple file with Ctrl press, Supported File Types:
                    gif, jpg, jpeg, png, pdf, doc, docx (Max 5 images and Max.
                    10MB).
                  </div>
                </div>
                <button type="button" className="btn btn-primary button1">
                  SUBMIT
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-3">
            <Sidebar />
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
                  <h3 className="">{t("employerMailDetail.mailDetail")}</h3>
                </div>
                <div className="mx-4 mb-5 mailDetailBx">
                  {mailReceiver !== "" || mailReceiver !== null ? (
                    <>
                      <h5>
                        {t("employerMailDetail.dear")}{" "}
                        {mailReceiver.first_name
                          ? mailReceiver.first_name
                          : "N/A"}{" "}
                        {mailReceiver.last_name
                          ? mailReceiver.last_name
                          : "N/A"}
                        ,
                      </h5>
                    </>
                  ) : (
                    ""
                  )}

                  {mailSender !== "" || mailSender !== null ? (
                    <>
                      <p>
                        {t("employerMailDetail.line1")} <br />
                        {t("employerMailDetail.companyName")} :{" "}
                        {mailSender.company_name
                          ? mailSender.company_name
                          : "N/A"}
                        <br />
                        {t("employerMailDetail.emailAddress")} :{" "}
                        {mailSender.email_address
                          ? mailSender.email_address
                          : "N/A"}
                        <br />
                        {t("employerMailDetail.subject")} :{" "}
                        {mailDetail.subject ? mailDetail.subject : "N/A"}
                        <br />
                        {t("employerMailDetail.message")} :{" "}
                        {mailDetail.message ? mailDetail.message : "N/A"}
                      </p>
                      <h5 className="mt-2">
                        {t("employerMailDetail.attachments")}
                      </h5>
                    </>
                  ) : (
                    ""
                  )}
                  {/* <div className="emailImageAttachments">
                    {Object.entries(totalPath).map(([index, path]) => {
                      return (
                        <div className="mailAttachment" key={index}>
                          <img src={path} />
                        </div>
                      );
                    })}
                  </div> */}
                  <div className="emailImageAttachments">
                    {Object.entries(mailImages).map(([index, path]) => {
                      return (
                        <div className="mailAttachment" key={index}>
                          <img src={path} />
                        </div>
                      );
                    })}
                  </div>
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

export default MailDetail;
