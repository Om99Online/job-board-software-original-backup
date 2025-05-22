import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import NavBar from "../element/NavBar";
import Footer from "../element/Footer";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

const MailHistory = () => {
  const tokenKey = Cookies.get("tokenClient");
  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  const [t, i18n] = useTranslation("global");

  const navigate = useNavigate();
  const [mailData, setMailData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(BaseApi + "/users/mailhistory", null, {
        headers: {
          "Content-Type": "application/json",
          key: ApiKey,
          token: tokenKey,
        },
      });
      setLoading(false);
      if (response.data.status === 200) {
        setMailData(response.data.response);
      }
      // console.log(mailData);
      // console.log("Mail data received!");
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
      console.log("Cannot get mail data!");
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const mailPerPage = 10;

  // Get current jobs to display based on pagination
  const indexOfLastMail = currentPage * mailPerPage;
  const indexOfFirstMail = indexOfLastMail - mailPerPage;
  const currentData = mailData
    ? mailData.slice(indexOfFirstMail, indexOfLastMail)
    : mailData.slice(indexOfFirstMail, indexOfLastMail);

  // Function to handle pagination page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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

  return (
    <>
      <NavBar />
      <div className="container mailHistory">
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
                <div className="d-flex PageHeader">
                  <img src="/Images/employerSide/icon6color.png" alt="" />
                  <h3 className="mx-2" style={{ color: "#4864ac" }}>
                    {t("employerMailHistory.mailHistory")}
                  </h3>
                </div>

                <div className="MHBody PHBody mt-5">
                  <table className="table">
                    <thead>
                      <tr className="table-active TrFirst">
                        <th className="" scope="col p-3">
                          {t("employerMailHistory.username")}
                        </th>
                        <th className="" scope="col p-3">
                          {t("employerMailHistory.companyName")}
                        </th>
                        <th className="" scope="col p-3">
                          {t("employerMailHistory.subject")}
                        </th>
                        <th className="" scope="col p-3">
                          {t("employerMailHistory.created")}
                        </th>
                        <th className="" scope="col p-3">
                          {t("employerMailHistory.action")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.map((i, index) => {
                        return (
                          <tr className="TrDefoult">
                            <td className="">{i.user_name}</td>
                            <td className="">{i.company_name}</td>
                            <td className="pt-4 pb-4">
                              <Link
                                to={`/user/maildetail/${i.slug}`}
                                style={{ color: primaryColor }}
                              >
                                {i.subject}
                              </Link>
                            </td>{" "}
                            <td className="">{i.created.substring(0, 10)}</td>
                            <td className="pt-4 pb-4">
                              <Link
                                to={`/user/maildetail/${i.slug}`}
                                style={{ color: primaryColor }}
                              >
                                <i class="fa-solid fa-eye"></i>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mailHistoryPagination">
                  <p className="text-muted empPaginationData">
                    {t("pagination.NoofRecords")}{" "}
                    {mailData.length > 0
                      ? indexOfFirstMail + 1
                      : indexOfFirstMail}
                    -{Math.min(indexOfLastMail, mailData.length)} of{" "}
                    {mailData ? mailData.length : mailData.length}
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
                        mailData
                          ? indexOfLastMail >= mailData.length
                          : indexOfLastMail >= mailData.length
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

export default MailHistory;
