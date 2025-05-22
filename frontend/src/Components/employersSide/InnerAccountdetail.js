import React, { useEffect, useState } from "react";
import Footer from "../element/Footer";
import Sidebar from "./Sidebar";
import NavBar from "../element/NavBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import HTMLReactParser from "html-react-parser";
import Swal from "sweetalert2";
import $ from "jquery";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";
import Tooltip from "@mui/material/Tooltip";
import Cookies from "js-cookie";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { IconButton, Button, Typography } from "@mui/material";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  EmailShareButton,
  InstapaperShareButton,
  TelegramShareButton,
} from "react-share";
import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  EmailIcon,
  PinterestIcon,
  InstapaperIcon,
  TelegramIcon,
} from "react-share";
import { useTranslation } from "react-i18next";

const InnerAccountdetail = () => {
  const [loading, setLoading] = useState(false);
  const [accDetail, setAccDetail] = useState([]);
  const [userDetail, setUserDetail] = useState([]);
  const [jobDetail, setJobDetail] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [activeOptions, setActiveOptions] = useState([]);
  const tokenKey = Cookies.get("tokenClient");
  const navigate = useNavigate();
  const [t, i18n] = useTranslation("global");
  let curr = Cookies.get("curr");

  const [mailUsers, setMailUsers] = useState({
    // email_address: [],
    job_id: "",
    subject: "",
    message: "",
  });

  const [mailReplyError, setMailReplyError] = useState({
    subject: "",
    message: "",
  });

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/job/accdetail/${slug}`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            token: tokenKey,
          },
        }
      );
      if (response.data.status === 200) {
        // console.log(response);

        setLoading(false);
        setAccDetail(response.data.response);
        setUserDetail(response.data.response.userDetails);
        setJobDetail(response.data.response.jobInfo);
        setCandidates(response.data.response.candidates);
        setActiveOptions(response.data.response.active_option);
        // console.log(activeOptions);
      } 
      else if (response.data.status === 400) {
        // setLoading(false);
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: t("employerFavouriteListProfile.close"),
        });
      } else {
        Swal.fire({
          title: t("employerFavouriteListProfile.addFavFailedTitle"),
          text: response.data.message,
          icon: "error",
          confirmButtonText: t("employerFavouriteListProfile.close"),
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
      console.log("Could not get user data in inner account detail page. ");
    }
  };

  const [selectedEmails, setSelectedEmails] = useState([]);

  // ... your existing code ...

  const handleCheckboxChange = (email) => {
    // Check if the email is already in the array
    if (selectedEmails.includes(email)) {
      // If it exists, remove it from the array
      setSelectedEmails((prevSelectedEmails) =>
        prevSelectedEmails.filter((e) => e !== email)
      );
    } else {
      // If it doesn't exist, add it to the array
      setSelectedEmails((prevSelectedEmails) => [...prevSelectedEmails, email]);
    }

    setMailUsers({ ...mailUsers, job_id: jobDetail.job_id });
  };

  const handleGlobalCheckboxChange = () => {
    // Get all email addresses from the candidates
    const allEmails = candidates.map((i) => i.email_address);

    // If all emails are already selected, unselect all; otherwise, select all
    if (selectedEmails.length === allEmails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(allEmails);
    }

    setMailUsers({ ...mailUsers, job_id: jobDetail.job_id });

    console.log(selectedEmails);
  };

  const handleMailReplyChange = (e) => {
    const { name, value } = e.target;
    setMailUsers((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMailReplyError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleMailReply = async (slug) => {
    console.log(mailUsers,"users")
    try {
      const newErrors = {};

      if (mailUsers.subject === "") {
        newErrors.subject = t("employerInnerAccountdetail.sujectRequired");
      }

      if (mailUsers.message === "") {
        newErrors.message = t("employerInnerAccountdetail.messageRequired");
      }

      setMailReplyError(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: t("employerInnerAccountdetail.sendMailConfirmTitle"),
          text: t("employerInnerAccountdetail.sendMailConfirmTxt"),
          icon: "question",
          showCancelButton: true,
          confirmButtonText: t("employerInnerAccountdetail.yes"),
          cancelButtonText: t("employerInnerAccountdetail.no"),
        });
        if (confirmationResult.isConfirmed) {

          // const updatedData = {
          //   ...mailUsers,
          //   email_address: 
          // }
          setLoading(true);
          const response = await axios.post(
            BaseApi + `/candidates/sendmailToalljobseekers`,
            mailUsers,
            {
              headers: {
                "Content-Type": "application/json",
                key: ApiKey,
                token: tokenKey,
              },
            }
          );
          if (response.data.status === 200) {
            setLoading(false);
            Swal.fire({
              title: t("employerInnerAccountdetail.sendMailSuccessTitle"),
              icon: "success",
              confirmButtonText: t("employerInnerAccountdetail.close"),
            });
            setSendMail(false);
            setSelectedEmails("");
            setMailUsers({
              ...mailUsers,
              email_address: [],
              message: "",
              subject: "",
            });
          } else if (response.data.status === 400) {
            // setLoading(false);
            Cookies.remove("tokenClient");
            Cookies.remove("user_type");
            Cookies.remove("fname");
            navigate("/");
            Swal.fire({
              title: response.data.message,
              icon: "warning",
              confirmButtonText: t("employerInnerAccountdetail.close"),
            });
          } else {
            Swal.fire({
              title: t("employerFavouriteListProfile.addFavFailedTitle"),
              text: response.data.message,
              icon: "error",
              confirmButtonText: t("employerInnerAccountdetail.close"),
            });
          }
          getData();
        }
      }
      // }
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
        title: t("employerInnerAccountdetail.sendMailFailedTitle"),
        icon: "error",
        confirmButtonText: t("employerInnerAccountdetail.close"),
      });
      console.log("Could not change password!");
    }
  };

  const handleSendButton = () => {
    if (selectedEmails.length === 0) {
      Swal.fire({
        title: t("employerInnerAccountdetail.selectMailEmptyTitle"),
        icon: "warning",
        confirmButtonText: t("employerInnerAccountdetail.close"),
      });
    } else {
      setSendMail(true);
      setMailUsers({ ...mailUsers, email_address: selectedEmails.join(',') });
    }
  };

  const handleCancelClick = () => {
    setSendMail(false);
    setSelectedEmails("");
  };

  const [open, setOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState([]); // Track the selected payment
  const [sendMail, setSendMail] = useState(false);

  const handleOpen = () => {
    // console.log("Clicked payment:", plan); // Add this line
    // setSelectedPayment(plan);
    setOpen(true);
  };

  const handleClose = () => {
    // setSelectedPayment(null);
    setOpen(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%", // Adjusted width for mobile responsiveness
    maxWidth: "400px",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [openCoverModal, setOpenCoverModal] = useState(false);

  const handleOpenCoverModal = (plan) => {
    console.log("Clicked payment:", plan); // Add this line
      setSelectedPayment(plan);

    console.log(selectedPayment, "cover letter details");
    setOpenCoverModal(true);
  };

  const handleCloseCoverModal = () => {
    // setSelectedPayment();
    setOpenCoverModal(false);
  };

  const { slug } = useParams();

  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");

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

  const handleStatusChange = async (id, value, userId) => {
    console.log(id, value);
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/job/accdetail/${slug}`,
        { candidate_id: id, status_change: value, user_id: userId},
        {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            token: tokenKey,
          },
        }
      );
      getData();
      setLoading(false);
      console.log(
        "Status changed of inner account details page of employer side"
      );
    } catch (error) {
      setLoading(false);
      console.log(
        "Could not change status of user in inner account detail page. "
      );
    }
  };

  const handleDelete = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: t("employerInnerAccountdetail.deleteJobConfirmTitle"),
        text: t("employerInnerAccountdetail.deleteJobConfirmTxt"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("employerInnerAccountdetail.yes"),
        cancelButtonText: t("employerInnerAccountdetail.no"),
      });
      if (confirmationResult.isConfirmed) {
        const response = await axios.post(
          BaseApi + `/job/delete/${slug}`,
          null,
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
          navigate("/user/managejob");
          Swal.fire({
            title: t("employerInnerAccountdetail.deleteJobSuccessTitle"),
            icon: "success",
            confirmButtonText: t("employerInnerAccountdetail.close"),
          });
        } else if (response.data.status === 400) {
          // setLoading(false);
          Cookies.remove("tokenClient");
          Cookies.remove("user_type");
          Cookies.remove("fname");
          navigate("/");
          Swal.fire({
            title: response.data.message,
            icon: "warning",
            confirmButtonText: t("employerInnerAccountdetail.close"),
          });
        } else {
          Swal.fire({
            title: t("employerFavouriteListProfile.addFavFailedTitle"),
            text: response.data.message,
            icon: "error",
            confirmButtonText: t("employerInnerAccountdetail.close"),
          });
        }

        console.log("Inner account details page of employer side deleted");
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
        title: t("employerInnerAccountdetail.deleteJobFailedTitle"),
        icon: "error",
        confirmButtonText: t("employerInnerAccountdetail.close"),
      });
      console.log("Could not delete the user in inner account detail page.");
    }
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

  const updateRating = async (val, id) => {
    // /job/updateRating/{id}/{rating}

    try {
      // setLoading(true);
      const response = await axios.post(
        BaseApi + `/job/updateRating/${id}/${val}`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            token: tokenKey,
          },
        }
      );
      console.log(response);
      // getData();
      // setLoading(false);
      console.log("user rating updated successfully");
    } catch (error) {
      // setLoading(false);
      console.log("Could not change user rating.");
    }

    console.log(val);
    console.log(id);
  };

  const handleStarClick = (event, val, id) => {
    console.log(val);
    console.log(event.target);

    var node = event.target;
    var allStarElement = node.parentNode.childNodes;

    allStarElement.forEach((element, index) => {
      if (index <= val) {
        $(element).removeClass("fa-regular");
        $(element).addClass("fa-solid");
        $(element).css("color", "#dde01f");
      } else {
        $(element).removeClass("fa-solid");
        $(element).addClass("fa-regular");
        $(element).css("color", "");
      }
    });

    updateRating(val + 1, id);
  };

  const renderStars = (rating, id) => {
    const stars = [];

    for (let j = 0; j < 5; j++) {
      if (j < rating) {
        const col = {
          color: "#dde01f",
        };
        stars.push(
          <i
            class="fa-solid fa-star"
            style={col}
            onClick={(event) => handleStarClick(event, j, id)}
          ></i>
        );
      } else {
        stars.push(
          <i
            className="fa-regular fa-star"
            onClick={(event) => handleStarClick(event, j, id)}
          ></i>
        );
      }
    }

    return stars;
  };

  const handleActivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: t("employerInnerAccountdetail.activateJobConfirmTitle"),
        text: t("employerInnerAccountdetail.activateJobConfirmTxt"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("employerInnerAccountdetail.yes"),
        cancelButtonText: t("employerInnerAccountdetail.no"),
      });
      if (confirmationResult.isConfirmed) {
        const response = await axios.post(
          BaseApi + `/job/activate/${slug}`,
          null,
          {
            headers: {
              "Content-Type": "application/json",
              key: ApiKey,
              token: tokenKey,
            },
          }
        );
        getData();
        if (response.data.status === 200) {
          Swal.fire({
            title: t("employerInnerAccountdetail.activateJobSucessTitle"),
            icon: "success",
            confirmButtonText: t("employerInnerAccountdetail.close"),
          });
        } else if (response.data.status === 400) {
          // setLoading(false);
          Cookies.remove("tokenClient");
          Cookies.remove("user_type");
          Cookies.remove("fname");
          navigate("/");
          Swal.fire({
            title: response.data.message,
            icon: "warning",
            confirmButtonText: t("employerInnerAccountdetail.close"),
          });
        } else {
          Swal.fire({
            title: t("employerFavouriteListProfile.addFavFailedTitle"),
            text: response.data.message,
            icon: "error",
            confirmButtonText: t("employerInnerAccountdetail.close"),
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
          confirmButtonText: t("jobDescription.close"),
        });
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      }
      Swal.fire({
        title: t("employerInnerAccountdetail.activateJobFailedTitle"),
        icon: "error",
        confirmButtonText: t("employerInnerAccountdetail.close"),
      });
      console.log("Error activating job:", error);
    }
  };

  const handleDeactivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: t("employerInnerAccountdetail.deactivateJobConfirmTitle"),
        text: t("employerInnerAccountdetail.deactivateJobConfirmTxt"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("employerInnerAccountdetail.yes"),
        cancelButtonText: t("employerInnerAccountdetail.no"),
      });
      if (confirmationResult.isConfirmed) {
        const response = await axios.post(
          BaseApi + `/job/deactivate/${slug}`,
          null,
          {
            headers: {
              "Content-Type": "application/json",
              key: ApiKey,
              token: tokenKey,
            },
          }
        );
        if (response.data.status === 200) {
          Swal.fire({
            title: t("employerInnerAccountdetail.deactivateJobSuccessTitle"),
            icon: "success",
            confirmButtonText: t("employerInnerAccountdetail.close"),
          });
        } else if (response.data.status === 400) {
          // setLoading(false);
          Cookies.remove("tokenClient");
          Cookies.remove("user_type");
          Cookies.remove("fname");
          navigate("/");
          Swal.fire({
            title: response.data.message,
            icon: "warning",
            confirmButtonText: t("employerInnerAccountdetail.close"),
          });
        } else {
          Swal.fire({
            title: t("employerFavouriteListProfile.addFavFailedTitle"),
            text: response.data.message,
            icon: "error",
            confirmButtonText: t("employerInnerAccountdetail.close"),
          });
        }
        getData();
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
        title: t("employerInnerAccountdetail.deactivateJobFailedTitle"),
        icon: "error",
        confirmButtonText: t("employerInnerAccountdetail.close"),
      });
      console.log("Error deactivating job:", error);
    }
  };

  return (
    <>
      <NavBar />

      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <section class="MyProfileTopSection">
            <div class="container MYProfileHeader">
              <div class="MyProfileImg">
                <img
                  src={
                    userDetail.company_logo
                      ? userDetail.company_logo
                      : "/Images/jobseekerSide/dummy-profile.png"
                  }
                  alt="img"
                />
              </div>
              <div class="MyProfileDetails">
                <h2>
                  {userDetail.first_name} {userDetail.last_name}
                </h2>
                <h6>({userDetail.user_type})</h6>
                <div class="MyProfileUpgratePlan">
                  <span>{accDetail.planDetails}</span>
                  <Link
                    to="/plans/purchase"
                    class="btn btn-primary ms-4"
                    style={{
                      backgroundColor: secondaryColor,
                      border: secondaryColor,
                    }}
                  >
                    {t("employerInnerAccountdetail.upgradePlan")}
                  </Link>
                </div>
              </div>
            </div>
            <Link
              to="/user/changelogo"
              class="btn btn-primary UploadBackBg"
              style={{
                backgroundColor: primaryColor,
                border: primaryColor,
              }}
            >
              {t("employerInnerAccountdetail.uploadEstablishmentPhoto")}
            </Link>
          </section>
          <div className="container IADsecondSegment">
            <div className="row">
              <div className="col-lg-3 col-md-3 mt-4">
                <Sidebar />
              </div>
              <div
                className="col-lg-9 col-md-9 mb-5 IADMainBx"
                style={{
                  borderLeft: "2px solid #e6e8e7",
                  borderRight: "2px solid #e6e8e7",
                }}
              >
                <div class="JobseekerProfileBx">
                  <div class="JobseekerProfileTopBx">
                    <h3>
                      <span>{jobDetail.title}</span>
                    </h3>
                    <span class="EditJobseekerProfileTag">
                      <Link to={`/job/edit/${jobDetail.slug}`}>
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                      </Link>
                      <Link onClick={() => handleDelete(jobDetail.slug)}>
                        <i class="fa fa-trash" aria-hidden="true"></i>
                      </Link>
                      <Link to={`/jobs/createJob/${jobDetail.slug}`}>
                        <i class="fa fa-file-o" aria-hidden="true"></i>
                      </Link>
                      <Link
                        to={`/jobdescription/${jobDetail.slug}/${jobDetail.cat_slug}`}
                      >
                        <i class="fa fa-eye" aria-hidden="true"></i>
                      </Link>
                      <Link onClick={() => handleOpen()}>
                        <i class="fa fa-share-alt" aria-hidden="true"></i>
                      </Link>
                      <div>
                        <Modal
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={{ ...style, width: 700 }}>
                            <Button
                              onClick={handleClose} // Call handleClose when the button is clicked
                              sx={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                              }} // Position the button
                            >
                              {t("employerInnerAccountdetail.close")}
                            </Button>

                            <Typography
                              id="modal-modal-title"
                              variant="h6"
                              component="h2"
                            ></Typography>
                            <Typography
                              id="modal-modal-description"
                              sx={{ mt: 6 }}
                            >
                              <div className="modals ">
                                <div className="modalHead">
                                  <h3>
                                    {t("employerInnerAccountdetail.shareNow")}
                                  </h3>
                                </div>
                                <div className="modalBody mt-4">
                                  <ul className="shareIconsList">
                                    <li className="shareIconsButtons">
                                      <FacebookShareButton url={userDetail.job_url}>
                                        <FacebookIcon
                                          logoFillColor="white"
                                          round={true}
                                        ></FacebookIcon>
                                      </FacebookShareButton>
                                    </li>
                                    <li className="shareIconsButtons">
                                      <TwitterShareButton url={userDetail.job_url}>
                                        <TwitterIcon
                                          logoFillColor="white"
                                          round={true}
                                        ></TwitterIcon>
                                      </TwitterShareButton>
                                    </li>
                                    <li className="shareIconsButtons">
                                      <WhatsappShareButton url={userDetail.job_url}>
                                        <WhatsappIcon
                                          logoFillColor="white"
                                          round={true}
                                        ></WhatsappIcon>
                                      </WhatsappShareButton>
                                    </li>
                                    <li className="shareIconsButtons">
                                      <LinkedinShareButton url={userDetail.job_url}>
                                        <LinkedinIcon
                                          logoFillColor="white"
                                          round={true}
                                        ></LinkedinIcon>
                                      </LinkedinShareButton>
                                    </li>

                                    <li className="shareIconsButtons">
                                      <EmailShareButton url={userDetail.job_url}>
                                        <EmailIcon
                                          logoFillColor="white"
                                          round={true}
                                        ></EmailIcon>
                                      </EmailShareButton>
                                    </li>
                                    <li className="shareIconsButtons">
                                      <PinterestShareButton url={userDetail.job_url}>
                                        <PinterestIcon
                                          logoFillColor="white"
                                          round={true}
                                        ></PinterestIcon>
                                      </PinterestShareButton>
                                    </li>
                                    <li className="shareIconsButtons">
                                      <InstapaperShareButton url={userDetail.job_url}>
                                        <InstapaperIcon
                                          logoFillColor="white"
                                          round={true}
                                        ></InstapaperIcon>
                                      </InstapaperShareButton>
                                    </li>
                                    <li className="shareIconsButtons">
                                      <TelegramShareButton url={userDetail.job_url}>
                                        <TelegramIcon
                                          logoFillColor="white"
                                          round={true}
                                        ></TelegramIcon>
                                      </TelegramShareButton>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </Typography>
                          </Box>
                        </Modal>
                      </div>
                    </span>
                  </div>

                  <div class="JobseekerProfileDetails">
                    <div class="JobseekerProfileActive manageJobActionButton">
                      {jobDetail.status === 1 ? (
                        <button
                          className="btn-primary"
                          onClick={() => handleDeactivate(jobDetail.slug)}
                        >
                          <Tooltip title="Deactivate">
                            <CheckIcon />
                          </Tooltip>
                        </button>
                      ) : (
                        <button
                          className="btn-secondary"
                          onClick={() => handleActivate(jobDetail.slug)}
                        >
                          <Tooltip title="Activate">
                            <BlockIcon />
                          </Tooltip>
                        </button>
                      )}
                      <div
                        class="CreatedDate"
                        style={{
                          color: primaryColor,
                        }}
                      >
                        {t("employerInnerAccountdetail.created")}{" "}
                        <strong>{jobDetail.created}</strong>
                      </div>
                    </div>
                    <div class="JobseekerProfileSearch">
                      <div class="Calcultn">
                        <div class="LeftSideCalu">
                          <i class="fa fa-search icon_calcultn"></i>
                        </div>
                        <div class="RightSideCalu">
                          <h4>{jobDetail.search_count}</h4>
                          <h6>{t("employerInnerAccountdetail.searchViews")}</h6>
                        </div>
                      </div>
                      <div class="Calcultn">
                        <div class="LeftSideCalu">
                          <i class="fa fa-suitcase icon_calcultn"></i>
                        </div>
                        <div class="RightSideCalu">
                          <h4>{jobDetail.view_count}</h4>
                          <h6>{t("employerInnerAccountdetail.jobViews")}</h6>
                        </div>
                      </div>
                      <div class="Calcultn">
                        <div class="LeftSideCalu">
                          <i class="fa fa-clock-o icon_calcultn"></i>
                        </div>
                        <div class="RightSideCalu">
                          <h4>{accDetail.totalCandidate}</h4>
                          <h6>
                            {t("employerInnerAccountdetail.applications")}
                          </h6>
                        </div>
                      </div>
                    </div>
                    <div class="JobseekersTabsBx">
                      <ul class="nav JobseekersTabs" id="myTab" role="tablist">
                        <li class="nav-item" role="presentation">
                          <button
                            class="nav-link active"
                            id="jobseekers-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#jobseekers-tab-pane"
                            type="button"
                            role="tab"
                            aria-controls="jobseekers-tab-pane"
                            aria-selected="true"
                          >
                            {t("employerInnerAccountdetail.jobseekers")}
                          </button>
                        </li>
                        <li class="nav-item" role="presentation">
                          <button
                            class="nav-link"
                            id="jobdetails-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#jobdetails-tab-pane"
                            type="button"
                            role="tab"
                            aria-controls="jobdetails-tab-pane"
                            aria-selected="false"
                          >
                            {t("employerInnerAccountdetail.jobDetails")}
                          </button>
                        </li>
                      </ul>
                      <div class="tab-content" id="myTabContent">
                        <div
                          class="tab-pane fade show active"
                          id="jobseekers-tab-pane"
                          role="tabpanel"
                          aria-labelledby="jobseekers-tab"
                          tabindex="0"
                        >
                          <div class="JobseekersTabsContent">
                            <div class="JobseekersContentTop">
                              <ul>
                                <li>
                                  <span>
                                    {t("employerInnerAccountdetail.active")}
                                  </span>
                                  <Link>{accDetail.activeJobs}</Link>
                                </li>
                                <li>
                                  <span>
                                    {t("employerInnerAccountdetail.shortlist")}
                                  </span>
                                  <Link>{accDetail.shortList}</Link>
                                </li>
                                <li>
                                  <span>
                                    {t("employerInnerAccountdetail.interview")}
                                  </span>
                                  <Link>{accDetail.interview}</Link>
                                </li>
                                <li>
                                  <span>
                                    {t("employerInnerAccountdetail.offer")}
                                  </span>
                                  <Link>{accDetail.offer}</Link>
                                </li>
                                <li>
                                  <span>
                                    {t("employerInnerAccountdetail.accept")}
                                  </span>
                                  <Link>{accDetail.accept}</Link>
                                </li>
                                <li>
                                  <span>
                                    {t(
                                      "employerInnerAccountdetail.notSuitable"
                                    )}
                                  </span>
                                  <Link>{accDetail.notSuitable}</Link>
                                </li>
                                <li>
                                  <span>
                                    {t("employerInnerAccountdetail.total")}
                                  </span>
                                  <Link>{accDetail.totalCandidate}</Link>
                                </li>
                                <li>
                                  <span>
                                    {t("employerInnerAccountdetail.new")}
                                  </span>
                                  <Link>{accDetail.newApplicationCount}</Link>
                                </li>
                              </ul>
                              {/* <div class="JobseekersContentSearch">
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder="Search"
                                />
                                <span>
                                  <img
                                    src="/Images/jobseekerSide/search-icon.png"
                                    alt="icon"
                                  />
                                </span>
                              </div> */}
                            </div>
                            {!sendMail && (
                              <div class="JobseekersSearchContent">
                                <div class="no_found">
                                  <div className="card">
                                    <table
                                      class="table table-borderless"
                                      style={{ textAlign: "left" }}
                                    >
                                      <thead
                                        style={{
                                          backgroundColor: primaryColor,
                                          color: "white",
                                        }}
                                      >
                                        <tr>
                                          <th scope="col">
                                            <input
                                              name="global"
                                              type="checkbox"
                                              onClick={
                                                handleGlobalCheckboxChange
                                              }
                                            />
                                          </th>
                                          <th scope="col">
                                            <p>
                                              {t(
                                                "employerInnerAccountdetail.name"
                                              )}
                                            </p>
                                          </th>
                                          <th scope="col">
                                            <p>
                                              {t(
                                                "employerInnerAccountdetail.rating"
                                              )}
                                            </p>
                                          </th>
                                          {/* <th scope="col">
                                            <p>
                                              {t(
                                                "employerInnerAccountdetail.contactNo"
                                              )}
                                            </p>
                                          </th> */}
                                          <th scope="col">
                                            <p>
                                              {t(
                                                "employerInnerAccountdetail.status"
                                              )}
                                            </p>
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {candidates.map((i) => {
                                          return (
                                            <>
                                              <tr>
                                                <th scope="row">
                                                  <input
                                                    name="individual"
                                                    type="checkbox"
                                                    checked={selectedEmails.includes(
                                                      i.email_address
                                                    )}
                                                    onChange={() =>
                                                      handleCheckboxChange(
                                                        i.email_address
                                                      )
                                                    }
                                                  />
                                                </th>
                                                <td>
                                                  <div className="d-block usernameInnerAccDetails">
                                                    <Link
                                                      to={`/candidates/profile/${i.slug}`}
                                                    >
                                                      <p
                                                        style={{
                                                          color: primaryColor,
                                                        }}
                                                      >
                                                        {i.name}
                                                      </p>
                                                    </Link>
                                                  </div>
                                                  <div className="d-block">
                                                    <i class="fa-solid fa-calendar-days"></i>{" "}
                                                    {i.created}
                                                  </div>

                                                  <Link
                                                    className="text-primary"
                                                    onClick={() =>
                                                      handleOpenCoverModal(
                                                        i.coverletters
                                                      )
                                                    }
                                                  >
                                                    <i class="fa-solid fa-copy"></i>{" "}
                                                    {t(
                                                      "employerInnerAccountdetail.coverLetter"
                                                    )}
                                                  </Link>
                                                  <div>
                                                    <Modal
                                                      open={openCoverModal}
                                                      onClose={
                                                        handleCloseCoverModal
                                                      }
                                                      aria-labelledby="modal-modal-title"
                                                      aria-describedby="modal-modal-description"
                                                    >
                                                      <Box
                                                        sx={{
                                                          ...style,
                                                          width: 500,
                                                        }}
                                                      >
                                                        <IconButton
                                                          onClick={
                                                            handleCloseCoverModal
                                                          }
                                                          className="close-button"
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            top: 10,
                                                            right: 10,
                                                          }}
                                                        >
                                                          &times;
                                                        </IconButton>

                                                        <Typography
                                                          id="modal-modal-title"
                                                          variant="h6"
                                                          component="h2"
                                                        ></Typography>
                                                        <Typography
                                                          id="modal-modal-description"
                                                          sx={{ mt: 0 }}
                                                        >
                                                          <div className="modals">
                                                            <div className="modalHead">
                                                              <h3
                                                                style={{
                                                                  color:
                                                                    secondaryColor,
                                                                }}
                                                              >
                                                                {t(
                                                                  "employerInnerAccountdetail.coverLetterDetails"
                                                                )}
                                                              </h3>
                                                            </div>
                                                            <div className="modalBody mt-4">
                                                              <div className="modalBody mt-4">
                                                                {selectedPayment?.length > 0 ?
                                                                
                                                                   selectedPayment.map(
                                                                      (j) => {
                                                                        return (
                                                                          <>
                                                                            <div className="row mb-2">
                                                                              <div className="col-md-4 fw-bold">
                                                                                {t(
                                                                                  "employerInnerAccountdetail.coverLetterTitle"
                                                                                )}
                                                                                :
                                                                              </div>
                                                                              <div className="col-md-8">
                                                                                {
                                                                                  j.title
                                                                                }
                                                                              </div>
                                                                            </div>
                                                                            <div className="row">
                                                                              <div className="col-md-4 fw-bold">
                                                                                {t(
                                                                                  "employerInnerAccountdetail.coverLetterDescription"
                                                                                )}
                                                                                :
                                                                              </div>
                                                                              <div className="col-md-8">
                                                                                {
                                                                                  j.description
                                                                                }
                                                                              </div>
                                                                            </div>
                                                                          </>
                                                                        );
                                                                      }
                                                                    )
                                                                  : t(
                                                                      "employerInnerAccountdetail.coverLetterNotAvailable"
                                                                    )}
                                                                <p></p>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </Typography>
                                                      </Box>
                                                    </Modal>
                                                  </div>
                                                </td>
                                                <td>
                                                  {renderStars(i.rating, i.id)}
                                                </td>
                                                {/* <td>{i.contact}</td> */}
                                                <td>
                                                  {i.apply_status ? (
                                                    <>
                                                      <select
                                                        class="selectFormInnerAccDetails form-select"
                                                        aria-label="Default select example"
                                                        value={i.apply_status}
                                                        onChange={(e) =>
                                                          handleStatusChange(
                                                            i.id,
                                                            e.target.value,
                                                            i.user_id
                                                          )
                                                        }
                                                      >
                                                        <option selected>
                                                          {t(
                                                            "employerInnerAccountdetail.selectStatus"
                                                          )}
                                                        </option>
                                                        {Object.entries(
                                                          activeOptions
                                                        ).map(
                                                          ([key, value]) => (
                                                            <option
                                                              key={key}
                                                              value={key}
                                                            >
                                                              {value}
                                                            </option>
                                                          )
                                                        )}
                                                      </select>
                                                    </>
                                                  ) : (
                                                    <select
                                                      class="form-select"
                                                      aria-label="Default select example"
                                                      value={i.apply_status}
                                                    >
                                                      {Object.entries(
                                                        activeOptions
                                                      ).map(([key, value]) => (
                                                        <option
                                                          key={key}
                                                          value={key}
                                                        >
                                                          {value}
                                                        </option>
                                                      ))}
                                                    </select>
                                                  )}
                                                </td>
                                              </tr>
                                            </>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                  {candidates != "" && (
                                    <button
                                      type="button"
                                      className="sendMailManageJobs"
                                      onClick={handleSendButton}
                                      style={{
                                        backgroundColor: primaryColor,
                                        border: primaryColor,
                                      }}
                                    >
                                      {t(
                                        "employerInnerAccountdetail.sendMailButton"
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Send main UI if candidates are present */}
                            {sendMail && (
                              <div className="sendMailComponent">
                                <div class="no_found">
                                  <div className="card">
                                    <div
                                      className="sendMailHeader"
                                      style={{
                                        backgroundColor: primaryColor,
                                      }}
                                    >
                                      {t(
                                        "employerInnerAccountdetail.sendMailButton"
                                      )}
                                    </div>

                                    <div class="form-outline sendMailInputManageJobs DashBoardInputBx">
                                      <label
                                        class="form-label"
                                        for="form3Example3"
                                      >
                                        {t("employerInnerAccountdetail.to")}
                                      </label>
                                      <input
                                        type="text"
                                        id="form3Example3"
                                        className="form-control"
                                        placeholder={t(
                                          "employerInnerAccountdetail.email"
                                        )}
                                        value={mailUsers.email_address}
                                        name="email_address"
                                        disabled
                                        // onChange={handleChange}
                                      />
                                    </div>
                                    <div class="form-outline sendMailInputManageJobs DashBoardInputBx">
                                      <label
                                        class="form-label"
                                        for="form3Example3"
                                      >
                                        {t(
                                          "employerInnerAccountdetail.subject"
                                        )}{" "}
                                        <span className="RedStar">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        id="form3Example3"
                                        className="form-control"
                                        placeholder={t(
                                          "employerInnerAccountdetail.subject"
                                        )}
                                        value={mailUsers.subject}
                                        name="subject"
                                        onChange={handleMailReplyChange}
                                      />
                                      {mailReplyError.subject && (
                                        <div className="text-danger">
                                          {mailReplyError.subject}
                                        </div>
                                      )}
                                    </div>
                                    <div class="form-outline sendMailInputManageJobs DashBoardInputBx">
                                      <label
                                        class="form-label"
                                        for="form3Example3"
                                      >
                                        {t(
                                          "employerInnerAccountdetail.message"
                                        )}{" "}
                                        <span className="RedStar">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        id="form3Example3"
                                        className="form-control"
                                        placeholder={t(
                                          "employerInnerAccountdetail.message"
                                        )}
                                        value={mailUsers.message}
                                        name="message"
                                        onChange={handleMailReplyChange}
                                      />
                                      {mailReplyError.message && (
                                        <div className="text-danger">
                                          {mailReplyError.message}
                                        </div>
                                      )}
                                    </div>
                                    <div className="sendMailManageJobsButtons">
                                      <button
                                        type="button"
                                        className="btn btn-primary button1"
                                        onClick={() =>
                                          handleMailReply(jobDetail.slug)
                                        }
                                        // data-bs-dismiss="modal"
                                        // aria-label="Close"
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
                                        {t(
                                          "employerInnerAccountdetail.sendButton"
                                        )}
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-primary button1"
                                        onClick={handleCancelClick}
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
                                        {t(
                                          "employerInnerAccountdetail.cancelButton"
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          class="tab-pane fade "
                          id="jobdetails-tab-pane"
                          role="tabpanel"
                          aria-labelledby="jobdetails-tab"
                          tabindex="0"
                        >
                          <div class="JobseekersTabsContent">
                            <div class="JobseekersTabsDetails">
                              <div class="JobseekersTabsDetailsList">
                                <label>
                                  {t("employerInnerAccountdetail.category")}
                                </label>
                                <span>
                                  <em>{jobDetail.category}</em>
                                </span>
                              </div>
                              {jobDetail.subcategory ? (
                                <>
                                  <div class="JobseekersTabsDetailsList">
                                    <label>
                                      {t(
                                        "employerInnerAccountdetail.subCategory"
                                      )}
                                    </label>
                                    <span>
                                      <em>{jobDetail.subcategory}</em>
                                    </span>
                                  </div>
                                </>
                              ) : (
                                ""
                              )}

                              <div class="JobseekersTabsDetailsList">
                                <label>
                                  {t("employerInnerAccountdetail.contactName")}
                                </label>
                                <span>
                                  <em>{jobDetail.contact_name}</em>
                                </span>
                              </div>
                              <div class="JobseekersTabsDetailsList">
                                <label>
                                  {t(
                                    "employerInnerAccountdetail.contactNumber"
                                  )}
                                </label>
                                <span>
                                  <em>{jobDetail.contact_number}</em>
                                </span>
                              </div>
                              <div class="JobseekersTabsDetailsList">
                                <label>
                                  {t("employerInnerAccountdetail.skills")}
                                </label>
                                <span>
                                  <em>{jobDetail.skill}</em>{" "}
                                </span>
                              </div>
                              <div class="JobseekersTabsDetailsList">
                                <label>
                                  {t(
                                    "employerInnerAccountdetail.workingRelation"
                                  )}
                                </label>
                                <span>
                                  <em>{jobDetail.designation}</em>
                                </span>
                              </div>
                              <div class="JobseekersTabsDetailsList">
                                <label>
                                  {t("employerInnerAccountdetail.location")}
                                </label>
                                <span>
                                  <em>{jobDetail.location}</em>
                                </span>
                              </div>
                              <div class="JobseekersTabsDetailsList">
                                <label>
                                  {t("employerInnerAccountdetail.workType")}
                                </label>
                                <span>
                                  <em>{jobDetail.work_type}</em>
                                </span>
                              </div>
                              <div class="JobseekersTabsDetailsList">
                                <label>
                                  {t("employerInnerAccountdetail.description")}
                                </label>
                                <span>
                                  <em>
                                    {jobDetail.description
                                      ? HTMLReactParser(jobDetail.description)
                                      : ""}
                                  </em>{" "}
                                </span>
                              </div>
                              <div class="JobseekersTabsDetailsList">
                                <label>
                                  {t("employerInnerAccountdetail.salary")}
                                </label>
                                <span>
                                <em>
                                    {curr}{" "}{jobDetail.min_salary} - {" "}{curr}{" "}
                                    {jobDetail.max_salary}
                                  </em>
                                </span>
                              </div>
                              <div class="JobseekersTabsDetailsList">
                                <label>
                                  {t("employerInnerAccountdetail.experience")}
                                </label>
                                <span>
                                  <em>
                                    {jobDetail.min_exp}-{jobDetail.max_exp}{" "}
                                    {t("employerInnerAccountdetail.year")}
                                  </em>
                                </span>
                              </div>
                              <div class="JobseekersTabsDetailsList">
                                <label>
                                  {t("employerInnerAccountdetail.companyName")}
                                </label>
                                <span>
                                  <em>{jobDetail.company_name}</em>
                                </span>
                              </div>
                              <div class="JobseekersTabsDetailsList">
                                <label>
                                  {t(
                                    "employerInnerAccountdetail.companyProfile"
                                  )}
                                </label>
                                <span>
                                  <em>
                                    {jobDetail.company_profile
                                      ? HTMLReactParser(
                                          jobDetail.company_profile
                                        )
                                      : ""}
                                  </em>
                                </span>
                              </div>
                              <div class="JobseekersTabsDetailsList">
                                <label>
                                  {t(
                                    "employerInnerAccountdetail.companyWebsite"
                                  )}
                                </label>
                                <span>
                                  <em>
                                    <Link className="btn buttonForWeb">
                                      {jobDetail.url}
                                    </Link>
                                  </em>
                                </span>
                              </div>
                              <div class="JobseekersTabsDetailsList">
                                <label>
                                  {t("employerInnerAccountdetail.logo")}
                                </label>
                                <span>
                                  <em>
                                    {jobDetail.logo ? (
                                      <img
                                        className="manageJobInternalpageImage"
                                        src={jobDetail.logo}
                                        alt="img"
                                      />
                                    ) : (
                                      <img
                                        className="manageJobInternalpageImage"
                                        src={
                                          "/Images/jobseekerSide/dummy-profile.png"
                                        }
                                        alt="img"
                                      />
                                    )}
                                  </em>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default InnerAccountdetail;
