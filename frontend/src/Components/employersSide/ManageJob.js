import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import NavBar from "../element/NavBar";
import Footer from "../element/Footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ApiKey from "../api/ApiKey";
import BaseApi from "../api/BaseApi";
import Swal from "sweetalert2";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";
import Tooltip from "@mui/material/Tooltip";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const ManageJob = () => {
  const [manageJobData, setManageJobData] = useState([]);
  const [manageJob, setManageJob] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activated, setActivated] = useState(false);
  const [deactivated, setDeactivated] = useState(false);
  const [t, i18n] = useTranslation("global");

  const tokenKey = Cookies.get("tokenClient");
  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  const [hoverCreateColor, setHoverCreateColor] = useState(false);

  const handleCreateMouseEnter = () => {
    setHoverCreateColor(true);
  };

  const handleCreateMouseLeave = () => {
    setHoverCreateColor(false);
  };

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

  const navigate = useNavigate();

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
      const response = await axios.post(BaseApi + "/job/management", null, {
        headers: {
          "Content-Type": "application/json",
          key: ApiKey,
          token: tokenKey,
        },
      });
      setLoading(false);
      const updatedManageJob = response.data.response.map((job) => ({
        ...job,
        activated: false, // Set initial state for each job
      }));
      setManageJob(updatedManageJob);
      setManageJobData(updatedManageJob);
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
      console.log("Cannot get manage job data");
    }
  };

  const handleActivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: t("employerManageJobs.activateConfirmTitle"),
        text: t("employerManageJobs.activateConfirmTxt"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("employerManageJobs.yes"),
        cancelButtonText: t("employerManageJobs.no"),
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
        if (response.data.status === 200) {
          Swal.fire({
            title: t("employerManageJobs.activateSuccessTitle"),
            icon: "success",
            confirmButtonText: t("membershipPlan.close"),
          });
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: t("membershipPlan.close"),
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
        title: t("employerManageJobs.activateFailedTitle"),
        icon: "error",
        confirmButtonText: t("membershipPlan.close"),
      });
      console.log("Error activating job:", error);
    }
  };

  const handleDeactivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: t("employerManageJobs.deactivateConfirmTitle"),
        text: t("employerManageJobs.deactivateConfirmTxt"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("employerManageJobs.yes"),
        cancelButtonText: t("employerManageJobs.no"),
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
            title: t("employerManageJobs.deactivateSuccessTitle"),
            icon: "success",
            confirmButtonText: t("employerManageJobs.close"),
          });
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: t("employerManageJobs.close"),
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
        title: "Could not deactivate job. Please try again!",
        icon: "error",
        confirmButtonText: t("employerManageJobs.close"),
      });
      console.log("Error deactivating job:", error);
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  // Get current jobs to display based on pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = manageJobData
    ? manageJobData.slice(indexOfFirstJob, indexOfLastJob)
    : manageJobData.slice(indexOfFirstJob, indexOfLastJob);

  // Function to handle pagination page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <NavBar />
      <div className="container manageJob">
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
                <div className="MJHeader PageHeader">
                  <div className="TopHaddingTitle">
                    <h3 className="">
                      <i>
                        <img src="/Images/employerSide/icon2color.png" alt="" />
                      </i>
                      <span>{t("employerManageJobs.manageJobs")}</span>
                    </h3>

                    <Link to="/user/createjob">
                      <button
                        type="button"
                        className="btn btn-primary button1"
                        style={{
                          backgroundColor: hoverCreateColor
                            ? secondaryColor
                            : primaryColor,
                          border: hoverCreateColor
                            ? secondaryColor
                            : primaryColor,
                        }}
                        onMouseEnter={handleCreateMouseEnter}
                        onMouseLeave={handleCreateMouseLeave}
                      >
                        {t("employerManageJobs.createJob")}
                      </button>
                    </Link>

                    <div className="MJBody mt-5">
                      <table className="table">
                        <thead>
                          <tr className="table-active TrFirst">
                            <th className="" scope="col p-3">
                              {t("employerManageJobs.jobs")}
                            </th>
                            <th className="" scope="col p-3">
                              {t("employerManageJobs.postedOn")}
                            </th>
                            <th className="" scope="col p-3">
                              {t("employerManageJobs.jobseeker")}
                            </th>
                            <th className="" scope="col p-3">
                              {t("employerManageJobs.notifiedJobseekers")}
                            </th>
                            <th className="" scope="col p-3">
                              {t("employerManageJobs.status")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentJobs.map((i, index) => {
                            return (
                              <tr className="TrDefoult" key={index}>
                                <td className="">
                                  <Link
                                    to={`/user/managejob/accdetail/${i.Job.slug}`}
                                  >
                                    {i.Job.title}
                                  </Link>
                                </td>
                                <td className="">
                                  {i.Job.created.substring(0, 10).split("-").reverse().join("-")}
                                </td>
                                <td className="">
                                  {t("employerManageJobs.all")} :
                                  {i.totalCandidate}{" "}
                                  {t("employerManageJobs.new")} :{" "}
                                  {i.newApplicationCount}
                                </td>
                                <td className="">{i.jobAlert}</td>
                                <td className="manageJobActionButton">
                                  {i.Job.status === 1 ? (
                                    <button
                                      className="btn-primary"
                                      onClick={() =>
                                        handleDeactivate(i.Job.slug)
                                      }
                                    >
                                      <Tooltip title="Deactivate">
                                        <CheckIcon />
                                      </Tooltip>
                                    </button>
                                  ) : (
                                    <button
                                      className="btn-secondary"
                                      onClick={() => handleActivate(i.Job.slug)}
                                    >
                                      <Tooltip title="Activate">
                                        <BlockIcon />
                                      </Tooltip>
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="manageJobPagination">
                  <p className="text-muted empPaginationData">
                    {t("pagination.NoofRecords")}{" "}
                    {manageJobData.length > 0
                      ? indexOfFirstJob + 1
                      : indexOfFirstJob}
                    -{Math.min(indexOfLastJob, manageJobData.length)} of{" "}
                    {manageJobData
                      ? manageJobData.length
                      : manageJobData.length}
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
                        manageJobData
                          ? indexOfLastJob >= manageJobData.length
                          : indexOfLastJob >= manageJobData.length
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

export default ManageJob;
