import React, { useEffect, useState } from "react";
import Footer from "../element/Footer";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../element/NavBar";
import JSSidebar from "./JSSidebar";
import axios from "axios";
import ApiKey from "../api/ApiKey";
import BaseApi from "../api/BaseApi";
import Cookies from "js-cookie";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

const JSPaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("tokenClient");
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState(null); // Track the selected payment
  const [DownloadURL, setDownloadURL] = useState("");
  const [downloadActive, setDownloadActive] = useState();
  const [open, setOpen] = useState(false);

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

  const handleOpen = (plan) => {
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
    width: "90%", // Adjusted width for mobile responsiveness
    maxWidth: "400px",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
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
      if (response.data.status === 200) {
        setPaymentHistory(response.data.response);
      } else if (response.data.status === 400) {
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: t("jobseekerManageAlert.close"),
        });
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: t("jobseekerManageAlert.close"),
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
      if (response.data.status === 200) {
        setDownloadURL(response.data.response.invoice);
        setDownloadActive(id);
      } else if (response.data.status === 400) {
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: t("jobseekerManageAlert.close"),
        });
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: t("jobseekerManageAlert.close"),
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

  const handleModalOpen = (payment) => {
    setSelectedPayment(payment); // Set the selected payment when the modal opens
    // handleModalClose()
  };

  const handleModalClose = () => {
    setSelectedPayment(null); // Reset the selected payment when the modal closes
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const paymentPerPage = 10;

  // Get current jobs to display based on pagination
  const indexOfLastPayment = currentPage * paymentPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentPerPage;
  const currentData = paymentHistory
    ? paymentHistory.slice(indexOfFirstPayment, indexOfLastPayment)
    : paymentHistory.slice(indexOfFirstPayment, indexOfLastPayment);

  // Function to handle pagination page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <div className="container paymentHistory">
            <div className="row">
              <div className="col-lg-3 col-md-3">
                <JSSidebar />
              </div>

              <div
                className="col-lg-9 col-md-9 mb-5"
                style={{
                  borderLeft: "2px solid #e6e8e7",
                  borderRight: "2px solid #e6e8e7",
                }}
              >
                <div className="PHHeader">
                  <div className="d-flex PageHeader">
                    <img src="/Images/employerSide/icon3color.png" alt="" />
                    <h3 className="">
                      {t("jobseekerPaymentHistory.paymentHistory")}
                    </h3>
                  </div>

                  {/* Plan Modal */}
                  {selectedPayment && (
                    <div
                      class="modal fade"
                      id="PlanModal"
                      tabindex="-1"
                      role="dialog"
                      aria-labelledby="PlanModalLabel"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h1 class="modal-title fs-5">
                              {selectedPayment.transaction_id}
                            </h1>
                            <button
                              type="button"
                              class="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                              onClick={handleModalClose}
                            ></button>
                          </div>
                          <div className="modal-body">
                            <p>
                              {t("jobseekerPaymentHistory.planName")}:{" "}
                              {selectedPayment.plan_name}
                            </p>
                            <p>
                              {t("jobseekerPaymentHistory.amount")}:{" "}
                              {selectedPayment.amount}
                            </p>
                            <p>
                              {t("jobseekerPaymentHistory.transactionId")}:{" "}
                              {selectedPayment.transaction_id}
                            </p>
                            <p>
                              {t("jobseekerPaymentHistory.startDate")}:{" "}
                              {selectedPayment.formated_start_date}
                            </p>
                            <p>
                              {t("jobseekerPaymentHistory.endDate")}:{" "}
                              {selectedPayment.formated_end_date}
                            </p>
                            <p>
                              {t("jobseekerPaymentHistory.features")}: Number of
                              Job Apply - 5
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <Modal
                      className="modalMain"
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box className="modal adminModal modal-content">
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
                        <Typography id="modal-modal-description" sx={{ mt: 6 }}>
                          {selectedPayment && (
                            <div className="modals ">
                              <div className="modalHead">
                                <h1>
                                  {t("jobseekerPaymentHistory.id")} -{" "}
                                  {selectedPayment.transaction_id}
                                </h1>
                              </div>
                              <div className="modalBody mt-4">
                                <div className="row">
                                  <div className="col-md-4 fw-bold m-2">
                                    {t("jobseekerPaymentHistory.invoiceNo")}:{" "}
                                  </div>
                                  <div className="col-md-4 m-2">
                                    {selectedPayment.invoice_no}
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-md-4 fw-bold m-2">
                                    {t("jobseekerPaymentHistory.firstName")}:{" "}
                                  </div>
                                  <div className="col-md-4 m-2">
                                    {selectedPayment.first_name}
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-md-4 fw-bold m-2">
                                    {t("jobseekerPaymentHistory.lastName")}:{" "}
                                  </div>
                                  <div className="col-md-4 m-2">
                                    {selectedPayment.last_name}
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-md-4 fw-bold m-2">
                                    {t("jobseekerPaymentHistory.contactNumber")}
                                    :{" "}
                                  </div>
                                  <div className="col-md-4 m-2">
                                    {selectedPayment.contact}
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-md-4 fw-bold m-2">
                                    {t("jobseekerPaymentHistory.emailAddress")}:{" "}
                                  </div>
                                  <div className="col-md-4 m-2">
                                    {selectedPayment.email_address}
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-4 fw-bold m-2">
                                    {t("jobseekerPaymentHistory.address")}:{" "}
                                  </div>
                                  <div className="col-md-4 m-2">
                                    {selectedPayment.address}
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-4 fw-bold m-2">
                                    {t("jobseekerPaymentHistory.planName")}:{" "}
                                  </div>
                                  <div className="col-md-4 m-2">
                                    {selectedPayment.plan_name}
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-4 fw-bold m-2">
                                    {t("jobseekerPaymentHistory.amount")}:{" "}
                                  </div>
                                  <div className="col-md-4 m-2">
                                    {selectedPayment.amount}
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-4 fw-bold m-2">
                                    {t("jobseekerPaymentHistory.transactionId")}
                                    :{" "}
                                  </div>
                                  <div className="col-md-4 m-2">
                                    {selectedPayment.transaction_id}
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-4 fw-bold m-2">
                                    {t("jobseekerPaymentHistory.startDate")}:{" "}
                                  </div>
                                  <div className="col-md-4 m-2">
                                    {selectedPayment.formated_start_date}
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-4 fw-bold m-2">
                                    {t("jobseekerPaymentHistory.endDate")}:{" "}
                                  </div>
                                  <div className="col-md-4 m-2">
                                    {selectedPayment.formated_end_date}
                                  </div>
                                </div>

                                {/* <div className="row"> */}
                                <div className="col-md-4 fw-bold m-2">
                                  {t("jobseekerPaymentHistory.features")}:{" "}
                                </div>
                                <div className="col-md-12 m-2">
                                  {Object.values(selectedPayment.features).map(
                                    (value, index, key) => {
                                      return (
                                        <>
                                          {index + 1}. {value}
                                          <br />
                                        </>
                                      );
                                    }
                                  )}
                                </div>
                                {/* </div> */}
                              </div>
                            </div>
                          )}
                        </Typography>
                      </Box>
                    </Modal>
                  </div>
                  {/* Total Detail Modal */}
                  {/* {selectedPayment && (
                    <div
                      class="modal fade"
                      id="DetailModal"
                      tabindex="-1"
                      aria-labelledby="DetailModalLabel"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h1 class="modal-title fs-5">
                              {selectedPayment.transaction_id}
                            </h1>
                            <button
                              type="button"
                              class="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                              onClick={handleModalClose}
                            ></button>
                          </div>
                          <div class="modal-body">
                            <h3>INVOICE NO: {selectedPayment.invoice_no}</h3>
                            <p>First Name: {selectedPayment.first_name}</p>
                            <p>Last Name: {selectedPayment.last_name}</p>
                            <p>Contact Number: {selectedPayment.contact}</p>
                            <p>
                              Email Address: {selectedPayment.email_address}
                            </p>
                            <p>Address: {selectedPayment.address}</p>
                            <p>Plan Name: {selectedPayment.plan_name}</p>
                            <p>Amount: {selectedPayment.amount}</p>
                            <p>
                              Transaction ID: {selectedPayment.transaction_id}
                            </p>
                            <p>
                              Start Date: {selectedPayment.formated_start_date}
                            </p>
                            <p>End Date: {selectedPayment.formated_end_date}</p>
                            <p>Features: Number of Job Apply - 5 </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )} */}

                  <div className="PHBody mt-5">
                    <table className="table">
                      <thead>
                        <tr className="table-active TrFirst">
                          <th className="JSPHFirstCol" scope="col p-3">
                            {t("jobseekerPaymentHistory.SNo.")}
                          </th>
                          <th className="JSPHSecondCol" scope="col p-3">
                            {t("jobseekerPaymentHistory.planName")}
                          </th>
                          <th className="JSPHEachCol" scope="col p-3">
                            {t("jobseekerPaymentHistory.amount")}
                          </th>
                          <th className="JSPHEachCol" scope="col p-3">
                            {t("jobseekerPaymentHistory.transactionId")}
                          </th>
                          <th className="JSPHEachCol" scope="col p-3">
                            {t("jobseekerPaymentHistory.startDate")}
                          </th>
                          <th className="JSPHEachCol" scope="col p-3">
                            {t("jobseekerPaymentHistory.endDate")}
                          </th>
                          <th className="JSPHEachCol" scope="col p-3">
                            {t("jobseekerPaymentHistory.paidOn")}
                          </th>
                          <th className="JSPHEachCol" scope="col p-3">
                            {t("jobseekerPaymentHistory.action")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.map((i, index) => {
                          return (
                            <>
                              <tr className="TrDefoult" key={index}>
                                <td className="JSPHFirstCol">{index + 1}</td>
                                <td className="JSPHSecondCol">
                                  <Link
                                    type="button"
                                    // class="btn btn-primary button1"
                                    // data-bs-toggle="modal"
                                    // data-bs-target="#PlanModal"
                                    onClick={() => handleOpen(i)}
                                  >
                                    {i.plan_name}
                                  </Link>
                                </td>
                                <td className="JSPHEachCol">{i.amount}</td>
                                <td className="JSPHEachCol">
                                  {i.transaction_id}
                                </td>
                                <td className="JSPHEachCol">
                                  {i.formated_start_date}
                                </td>
                                <td className="JSPHEachCol">
                                  {i.formated_end_date}
                                </td>
                                <td className="JSPHEachCol">{i.created}</td>
                                <td className="TrActions">
                                  <Link
                                    className="btn btn-primary"
                                    // data-bs-toggle="modal"
                                    // data-bs-target="#DetailModal"
                                    onClick={() => handleOpen(i)}
                                  >
                                    <i className="fa fa-eye"></i>
                                  </Link>
                                  <Link
                                    onClick={() => generateDownload(i.id)}
                                    className="btn btn-secondary"
                                  >
                                    <i className="fa fa-download"></i>
                                  </Link>
                                </td>
                              </tr>
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="JSPaymentHistoryPagination">
                  <p className="text-muted empPaginationData">
                    {t("pagination.NoofRecords")}{" "}
                    {paymentHistory.length > 0
                      ? indexOfFirstPayment + 1
                      : indexOfFirstPayment}
                    -{Math.min(indexOfLastPayment, paymentHistory.length)} of{" "}
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
                        backgroundColor: hoverFourthButtonColor
                          ? secondaryColor
                          : primaryColor,
                        border: hoverFourthButtonColor
                          ? secondaryColor
                          : primaryColor,
                      }}
                      onMouseEnter={handleFourthButtonMouseEnter}
                      onMouseLeave={handleFourthButtonMouseLeave}
                    >
                      {t("pagination.Next")}
                    </button>
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

export default JSPaymentHistory;
