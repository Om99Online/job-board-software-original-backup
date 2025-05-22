import React, { useEffect, useState } from "react";
import NavBar from "../element/NavBar";
import Sidebar from "./Sidebar";
import Footer from "../element/Footer";
import axios from "axios";
import ApiKey from "../api/ApiKey";
import BaseApi from "../api/BaseApi";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import HTMLReactParser from "html-react-parser";
import { Button, IconButton, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

const PaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("tokenClient");
  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  const [hoverSearchColor, setHoverSearchColor] = useState(false);
  const [t, i18n] = useTranslation("global");

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

  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState(null); // Track the selected payment
  const [DownloadURL, setDownloadURL] = useState("");
  const [downloadActive, setDownloadActive] = useState();

  const [open, setOpen] = useState(false);

  const handleOpen = (plan) => {
    console.log("Clicked payment:", plan); // Add this line
    setSelectedPayment(plan);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedPayment(null);
    setOpen(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
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
        BaseApi + "/payments/history",
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
      if(response.data.status === 200) {
        setPaymentHistory(response.data.response);
        console.log(paymentHistory);
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
      console.log("Cannot get payment data");
    }
  };

  const generateDownload = async (id) => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/users/generateinvoice/${id}`,
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
      if(response.data.status === 200) {
        setDownloadURL(response.data.response.invoice);
        setDownloadActive(id);
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
      console.log("Cannot get CV data pdf format", error.message);
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const paymentDataPerPage = 10;

  // Get current jobs to display based on pagination
  const indexOfLastPayment = currentPage * paymentDataPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentDataPerPage;
  const currentData = paymentHistory
    ? paymentHistory.slice(indexOfFirstPayment, indexOfLastPayment)
    : paymentHistory.slice(indexOfFirstPayment, indexOfLastPayment);

  // Function to handle pagination page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // console.log(downloadActive, DOCDownloadURL)
    if (downloadActive && DownloadURL) {
      // Create a hidden link element
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = DownloadURL;
      link.download = "Membership_Plan_Invoice.pdf";
      document.body.appendChild(link);

      // Trigger a click on the link
      link.click();

      // Clean up
      document.body.removeChild(link);
      setDownloadURL("");
      setDownloadActive(null);
    }
  }, [downloadActive, DownloadURL]);
  return (
    <>
      <NavBar />
      <div className="container paymentHistory">
        <div className="row">
          <div className="col-lg-3 col-md-3">
            <Sidebar />
          </div>
          {loading ? (
            <div className="loader-container"></div>
          ) : (
            <>
              <div
                className="col-lg-9 col-md-9 mb-5"
                style={{
                  borderLeft: "2px solid #e6e8e7",
                  borderRight: "2px solid #e6e8e7",
                }}
              >
                <div className="PHHeader PageHeader">
                  <div className="d-flex">
                    <img src="/Images/employerSide/icon3color.png" alt="" />
                    <h3 className="mx-2">{t("employerPaymentHistory.paymentHistory")}</h3>
                  </div>

                  <div className="PHBody mt-5">
                    <table className="table">
                      <thead>
                        <tr className="table-active TrFirst">
                          <th className="" scope="col p-3">
                          {t("employerPaymentHistory.no")}
                          </th>
                          <th className="" scope="col p-3">
                          {t("employerPaymentHistory.planName")}
                          </th>
                          <th className="" scope="col p-3">
                          {t("employerPaymentHistory.amount")}
                          </th>
                          <th className="" scope="col p-3">
                          {t("employerPaymentHistory.transactionId")}
                          </th>
                          <th className="" scope="col p-3">
                          {t("employerPaymentHistory.startDate")}
                          </th>
                          <th className="" scope="col p-3">
                          {t("employerPaymentHistory.endDate")}
                          </th>
                          <th className="" scope="col p-3">
                          {t("employerPaymentHistory.paidOn")}
                          </th>
                          <th className="" scope="col p-3">
                          {t("employerPaymentHistory.action")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.map((i, index) => {
                          return (
                            <>
                              <tr className="TrDefoult" key={index}>
                                <td className="">{index + 1}</td>
                                <td className="">
                                  <button
                                    type="button"
                                    className="paymentButton"
                                    onClick={() => handleOpen(i)}
                                    style={{
                                      backgroundColor: primaryColor,
                                      border: primaryColor,
                                    }}
                                  >
                                    {i.plan_name}
                                  </button>
                                </td>
                                <td className="">{i.amount}</td>
                                <td className="">{i.transaction_id}</td>
                                <td className="">{i.start_date}</td>
                                <td className="">{i.end_date}</td>
                                <td className="">{i.created}</td>
                                <td className="TrActions">
                                  <Link
                                    className="btn btn-primary"
                                    onClick={() => handleOpen(i)}
                                    style={{
                                      backgroundColor: primaryColor,
                                      color: "white",
                                      border: primaryColor,
                                    }}
                                  >
                                    <i className="fa fa-eye"></i>
                                  </Link>

                                  <Link
                                    onClick={() => generateDownload(i.id)}
                                    className="btn btn-secondary"
                                    style={{
                                      backgroundColor: secondaryColor,
                                      color: "white",
                                      border: secondaryColor,
                                    }}
                                  >
                                    <i className="fa fa-download"></i>
                                  </Link>
                                </td>
                              </tr>
                            </>
                          );
                        })}
                        <div>
                          <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box sx={{ ...style, width: 500 }}>
                              <IconButton
                                onClick={handleClose}
                                className="close-button"
                                style={{
                                  position: "absolute",
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
                                sx={{ mt: 6 }}
                              >
                                {selectedPayment && (
                                  <div className="modals ">
                                    <div className="modalHead">
                                      <h1 style={{ color: secondaryColor }}>
                                        {selectedPayment.transaction_id}
                                      </h1>
                                    </div>
                                    <div className="modalBody mt-4">
                                      <div className="row">
                                        <div className="col-md-4 fw-bold m-2">
                                        {t("employerPaymentHistory.planName")}:{" "}
                                        </div>
                                        <div className="col-md-4 m-2">
                                          {selectedPayment.plan_name}
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-md-4 fw-bold m-2">
                                        {t("employerPaymentHistory.amount")}:{" "}
                                        </div>
                                        <div className="col-md-4 m-2">
                                          {selectedPayment.amount}
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-md-4 fw-bold m-2">
                                        {t(
                                            "employerPaymentHistory.transactionId"
                                          )}:{" "}
                                        </div>
                                        <div className="col-md-4 m-2">
                                          {selectedPayment.transaction_id}
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-md-4 fw-bold m-2">
                                        {t(
                                            "employerPaymentHistory.startDate"
                                          )}:{" "}
                                        </div>
                                        <div className="col-md-4 m-2">
                                          {selectedPayment.start_date}
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-md-4 fw-bold m-2">
                                        {t("employerPaymentHistory.endDate")}:{" "}
                                        </div>
                                        <div className="col-md-4 m-2">
                                          {selectedPayment.end_date}
                                        </div>
                                      </div>

                                      {/* <div className="row"> */}
                                      <div className="col-md-4 fw-bold m-2">
                                      {t("employerPaymentHistory.features")}:{" "}
                                      </div>
                                      <div className="col-md-12 m-2">
                                        {Object.values(
                                          selectedPayment.features
                                        ).map((value, index, key) => {
                                          return (
                                            <>
                                              {index + 1}. {value}
                                              <br />
                                            </>
                                          );
                                        })}
                                      </div>
                                      {/* </div> */}
                                    </div>
                                  </div>
                                )}
                              </Typography>
                            </Box>
                          </Modal>
                        </div>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="paymentHistoryPagination">
                  <p className="text-muted empPaginationData">
                    {t("pagination.NoofRecords")} {paymentHistory.length > 0 ? indexOfFirstPayment + 1 : indexOfFirstPayment}-
                    {Math.min(indexOfLastPayment, paymentHistory.length)} of{" "}
                    {paymentHistory
                      ? paymentHistory.length
                      : paymentHistory.length}
                  </p>
                  {/* Custom Pagination */}
                  <div className="d-flex justify-content-center empPaginationButton">
                    <button
                      className="navButton1 me-2"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
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
                      {t("pagination.Prev")}
                    </button>
                    <button
                      className="navButton1"
                      disabled={
                        paymentHistory
                          ? indexOfLastPayment >= paymentHistory.length
                          : indexOfLastPayment >= paymentHistory.length
                      }
                      onClick={() => handlePageChange(currentPage + 1)}
                      style={{
                        backgroundColor: hoverUploadCVColor
                          ? secondaryColor
                          : primaryColor,

                        border: hoverSearchColor
                          ? secondaryColor
                          : primaryColor,
                      }}
                      onMouseEnter={handleUploadCVMouseEnter}
                      onMouseLeave={handleUploadCVMouseLeave}
                    >
                      {t("pagination.Next")}
                    </button>
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

export default PaymentHistory;
