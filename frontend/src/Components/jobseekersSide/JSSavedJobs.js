import React, { useEffect, useState } from "react";
import Footer from "../element/Footer";
import JSSidebar from "./JSSidebar";
import NavBar from "../element/NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const JSSavedJobs = () => {
  const [loading, setLoading] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const tokenKey = Cookies.get("tokenClient");
  const [t, i18n] = useTranslation("global");

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
  const [hoverFifthButtonColor, setHoverFifthButtonColor] = useState(false);

  const handleFifthButtonMouseEnter = () => {
    setHoverFifthButtonColor(true);
  };

  const handleFifthButtonMouseLeave = () => {
    setHoverFifthButtonColor(false);
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
        BaseApi + "/job/savedjob",
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
        setSavedJobs(response.data.response.ShortLists);
        // console.log(savedJobs);
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: t("jobseekerSavedJobs.close"),
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
      console.log(error.message);
    }
  };

  const handleClick = async (slug1, slug2, id) => {
    navigate(`/jobdescription/${slug1}/${slug2}`);
    sessionStorage.setItem("id", id);
  };

  const handleClick2 = async (id) => {
    try {
      const confirmationResult = await Swal.fire({
        title: t("jobseekerSavedJobs.confirmTitle"),
        text: t("jobseekerSavedJobs.confirmTxt"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("jobseekerSavedJobs.yes"),
        cancelButtonText: t("jobseekerSavedJobs.no"),
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        await axios.post(
          BaseApi + `/job/deleteShortList/${id}`,
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
        Swal.fire({
          title: t("jobseekerSavedJobs.successTxt"),
          icon: "success",
          confirmButtonText: t("jobseekerSavedJobs.close"),
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
        title: t("jobseekerSavedJobs.failedTxt"),
        icon: "error",
        confirmButtonText: t("jobseekerSavedJobs.close"),
      });
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  // Get current jobs to display based on pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentData = savedJobs
    ? savedJobs.slice(indexOfFirstJob, indexOfLastJob)
    : savedJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Function to handle pagination page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <NavBar />
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <div className="container JSSavedJob">
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
                    <img src="/Images/employerSide/icon4color.png" alt="" />
                    <h3 className="mx-2">
                      {t("jobseekerSavedJobs.savedJobs")}
                    </h3>
                  </div>

                  <div className="PHBody mt-5">
                    <table className="table">
                      <thead>
                        <tr className="table-active TrFirst">
                          <th className="" scope="col p-3">
                            {t("jobseekerSavedJobs.SNo.")}
                          </th>
                          <th className="" scope="col p-3">
                            {t("jobseekerSavedJobs.jobTitle")}
                          </th>
                          <th className="" scope="col p-3">
                            {t("jobseekerSavedJobs.jobType")}
                          </th>
                          <th className="" scope="col p-3">
                            {t("jobseekerSavedJobs.lastDate")}
                          </th>
                          <th className="" scope="col p-3">
                            {t("jobseekerSavedJobs.action")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.map((i, index) => {
                          return (
                            <tr className="TrDefoult">
                              <td className="">{index + 1}</td>
                              <td className="">{i.title}</td>
                              <td className="">{i.work_type}</td>
                              <td className="">{i.expire_time}</td>
                              <td className="TrActions">
                                <button
                                  onClick={() =>
                                    handleClick(i.slug, i.cat_slug, i.id)
                                  }
                                  className="btn btn-primary"
                                  style={{
                                    backgroundColor: hoverFirstButtonColor
                                      ? secondaryColor
                                      : primaryColor,
                                    border: hoverFirstButtonColor
                                      ? secondaryColor
                                      : primaryColor,
                                  }}
                                >
                                  <i class="fa-solid fa-circle-info"></i>
                                </button>
                                <button
                                  onClick={() => handleClick2(i.short_lists_id)}
                                  className="btn btn-secondary"
                                  style={{
                                    backgroundColor: hoverSecondButtonColor
                                      ? primaryColor
                                      : secondaryColor,
                                    border: hoverSecondButtonColor
                                      ? primaryColor
                                      : secondaryColor,
                                  }}
                                >
                                  <i class="fa-solid fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="JSsavedJobsPagination">
                  <p className="text-muted empPaginationData">
                    {t("pagination.NoofRecords")}{" "}
                    {savedJobs.length > 0
                      ? indexOfFirstJob + 1
                      : indexOfFirstJob}
                    -{Math.min(indexOfLastJob, savedJobs.length)} of{" "}
                    {savedJobs ? savedJobs.length : savedJobs.length}
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
                        savedJobs
                          ? indexOfLastJob >= savedJobs.length
                          : indexOfLastJob >= savedJobs.length
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

export default JSSavedJobs;
