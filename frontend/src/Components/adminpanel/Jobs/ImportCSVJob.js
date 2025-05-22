import React, { useEffect, useState } from "react";
import APNavBar from "../Elements/APNavBar";
import APSidebar from "../APSidebar/APSidebar";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axios from "axios";
import BaseApi from "../../api/BaseApi";
import ApiKey from "../../api/ApiKey";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import APFooter from "../Elements/APFooter";

const ImportCSVJob = () => {
  const [userData, setUserData] = useState({
    file: null,
    employer: "",
  });
  const [errors, setErrors] = useState({
    file: "",
    employer: "",
  });

  const [pageData, setPageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employersData, setEmployersData] = useState([]);
  const [csvFileLink, setCsvFileLink] = useState();
  const [xlsFileLink, setXlsFileLink] = useState();

  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value, // Assign file for file input
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/admin/job/admin_import",
        null,
        {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            token: tokenKey,
            adminid: adminID,
          },
        }
      );
      setLoading(false);
      setPageData(response.data.response);
      setCsvFileLink(response.data.response.csvfile);
      setXlsFileLink(response.data.response.xlsxfile);
      setEmployersData(response.data.response.employers);
    } catch (error) {
      setLoading(false);
      console.log("Error at import jobs at Admin panel");
    }
  };

  const handleClick = async () => {
    try {
      const newErrors = {};

      if (!userData.file) {
        newErrors.file = "File is required";
      }

      if (!userData.employer) {
        newErrors.employer = "Please select an employer";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Import?",
          text: "Do you want to import jobs?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (confirmationResult.isConfirmed) {
          setLoading(true);

          // Create form data
          const formData = new FormData();
          formData.append("file", userData.file);
          formData.append("employer", userData.employer);

          const response = await axios.post(
            BaseApi + "/admin/job/admin_import",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                key: ApiKey,
                token: tokenKey,
                adminid: adminID,
              },
            }
          );

          setLoading(false);

          if (response.data.status === 200) {
            Swal.fire({
              title: "Jobs Imported successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });

            navigate("/admin/jobs");
          } else {
            Swal.fire({
              title: response.data.message,
              icon: "error",
              confirmButtonText: "Close",
            });
          }
        }
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not import jobs. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Error importing jobs", error);
    }
  };

  const handleCSVDownload = () => {
    if (csvFileLink) {
      const link = document.createElement("a");
      link.href = csvFileLink;
      link.download = "sample.csv"; // Optional: You can specify the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      Swal.fire({
        title: "Error",
        text: "CSV file link is not available.",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  const handleXlssDownload = () => {
    if (xlsFileLink) {
      const link = document.createElement("a");
      link.href = xlsFileLink;
      link.download = "sample.xlsx"; // Optional: You can specify the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      Swal.fire({
        title: "Error",
        text: "Excel file link is not available.",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  useEffect(() => {
    if (!tokenKey) {
      navigate("/admin");
    } else {
      getData();
      window.scrollTo(0, 0);
    }
  }, [tokenKey, navigate]);

  return (
    <>
      <APNavBar />
      <div className="APBasic">
        <APSidebar />

        {loading ? (
          <div className="loader-container"></div>
        ) : (
          <>
          <div className="site-min-height">
            <div className="breadCumb1" role="presentation">
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<NavigateNextIcon fontSize="small" />}
              >
                <Link
                  underline="hover"
                  color="inherit"
                  onClick={() => navigate("/admin/admins/dashboard")}
                >
                  Dashboard
                </Link>
                <Link
                  underline="hover"
                  color="inherit"
                  onClick={() => navigate("/admin/jobs")}
                >
                  List Jobs
                </Link>
                <Typography color="text.primary">
                  Import Jobs From CSV/XLSX
                </Typography>
              </Breadcrumbs>
            </div>

            <h2 className="adminPageHeading">Import Jobs From CSV/XLSX</h2>
            <div className="sampleDownloadBox">
              <button
                type="button"
                // className="btn navButton1 APMSbutton"
                className="btn csvdownload APMSbutton"

                onClick={handleCSVDownload}
              >
                Download Sample CSV{" "}
                <i className="fa fa-download" aria-hidden="true" />
              </button>
              <button
                type="button"
                // className="btn navButton1 APMSbutton"
                className="btn csvdownload APMSbutton"
                onClick={handleXlssDownload}
              >
                Download Sample XLSX{" "}
                <i className="fa fa-download" aria-hidden="true" />
              </button>
            </div>

            <div className="csvForm">
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <div className="mb-5 DashBoardInputBx">
                    <label className="form-label">
                      Employer<span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.employer && "input-error"
                      }`}
                      name="employer"
                      value={userData.employer}
                      onChange={handleChange}
                    >
                      <option value="">Select Employer</option>
                      {employersData.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.company_name}
                        </option>
                      ))}
                    </select>
                    {errors.employer && (
                      <div className="text-danger">{errors.employer}</div>
                    )}
                  </div>

                  <div className="mb-5 DashBoardInputBx">
                    <label className="form-label">
                      Upload File<span className="RedStar">*</span>
                    </label>
                    <input
                      type="file"
                      className={`form-control ${errors.file && "input-error"}`}
                      name="file"
                      accept=".csv, .xlsx, .xls"
                      onChange={handleChange}
                    />
                    {errors.file && (
                      <div className="text-danger">{errors.file}</div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary button1"
                    onClick={handleClick}
                  >
                    Import
                  </button>
                </div>
              </form>
            </div>
          </div>
          <APFooter />
          </>
        )}
        
      </div>
    </>
  );
};

export default ImportCSVJob;
