import React, { useEffect, useState } from "react";
import Footer from "../element/Footer";
import JSSidebar from "./JSSidebar";
import NavBar from "../element/NavBar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ApiKey from "../api/ApiKey";
import BaseApi from "../api/BaseApi";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { FaEye } from "react-icons/fa";

const JSMailHistory = () => {
  const [loading, setLoading] = useState(false);
  const [mailHistory, setMailHistory] = useState([]);

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

  const navigate = useNavigate();

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
        BaseApi + "/candidates/mailhistory",
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
        setMailHistory(response.data.response);
        console.log(mailHistory);
      } else if (response.data.status === 400) {
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: t("jobseekerExperience.close"),
        });
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: t("jobseekerExperience.close"),
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
      console.log("Cannot get mail history of job seeker");
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const mailPerPage = 10;

  // Get current jobs to display based on pagination
  const indexOfLastMail = currentPage * mailPerPage;
  const indexOfFirstMail = indexOfLastMail - mailPerPage;
  const currentData = mailHistory
    ? mailHistory.slice(indexOfFirstMail, indexOfLastMail)
    : mailHistory.slice(indexOfFirstMail, indexOfLastMail);

  // Function to handle pagination page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
                    <img src="/Images/employerSide/icon6color.png" alt="" />
                    <h3 className="ms-1" style={{ color: "#4464ac" }}>
                      {t("jobseekerMailHistory.mailHistory")}
                    </h3>
                  </div>

                  <div className="PHBody mt-5">
                    <table className="table">
                      <thead>
                        <tr className="table-active TrFirst">
                          <th className="" scope="col p-3">
                            {t("jobseekerMailHistory.username")}
                          </th>
                          <th className="" scope="col p-3">
                            {t("jobseekerMailHistory.companyName")}
                          </th>
                          <th className="" scope="col p-3">
                            {t("jobseekerMailHistory.subject")}
                          </th>
                          <th className="" scope="col p-3">
                            {t("jobseekerMailHistory.created")}
                          </th>
                          <th className="" scope="col p-3">
                            {t("jobseekerMailHistory.action")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData &&
                          currentData.map((i, index) => {
                            return (
                              <tr className="TrDefoult">
                                <td className="">{i.user_name}</td>
                                <td className="">{i.company_name}</td>
                                <td className="">
                                  <Link to={`/candidates/maildetail/${i.slug}`}>
                                    {i.subject}
                                  </Link>
                                </td>
                                <td className="">
                                  {i.created.substring(0, 10)}
                                </td>
                                <td className="TrActions">
                                  <Link
                                    to={`/candidates/maildetail/${i.slug}`}
                                    className="btn btn-primary"
                                    style={{
                                      backgroundColor: hoverFirstButtonColor
                                        ? secondaryColor
                                        : primaryColor,
                                      border: hoverFirstButtonColor
                                        ? secondaryColor
                                        : primaryColor,
                                    }}
                                    // onMouseEnter={handleFirstButtonMouseEnter}
                                    // onMouseLeave={handleFirstButtonMouseLeave}
                                  >
                                    {/* <i class="fa-solid fa-eye"></i> */}
                                    <FaEye />
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="JSMailHistoryPagination">
                  <p className="text-muted empPaginationData">
                    {t("pagination.NoofRecords")}{" "}
                    {mailHistory.length > 0
                      ? indexOfFirstMail + 1
                      : indexOfFirstMail}
                    -{Math.min(indexOfLastMail, mailHistory.length)} of{" "}
                    {mailHistory ? mailHistory.length : mailHistory.length}
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
                        mailHistory
                          ? indexOfLastMail >= mailHistory.length
                          : indexOfLastMail >= mailHistory.length
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

export default JSMailHistory;
