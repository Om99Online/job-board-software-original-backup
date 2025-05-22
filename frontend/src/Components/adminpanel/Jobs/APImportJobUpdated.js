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

const APImportJobUpdated = () => {
  const [userData, setUserData] = useState({
    xml_url: "",
    // employer_id: "",
    // company_name: ""
  });
  const [errors, setErrors] = useState({
    xml_url: "",
    // employer_id: "",
    // company_name: ""
  });
  const [loading, setLoading] = useState(false);
  const [employersData, setEmployersData] = useState([]);

  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    console.log(userData);
  };

  // function to get the employer data
  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/admin/job/admin_jobimportdata",
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
      setEmployersData(response.data.response.employers);
    } catch (error) {
      setLoading(false);
      console.log("Error at import jobs at Admin panel");
    }
  };

  // Function to sumbit the data on API
  const handleClick = async () => {
    try {
      const newErrors = {};

      if (userData.xml_url === "") {
        newErrors.xml_url = "URL is required";
        window.scrollTo(0, 0);
      } else {
        // Regular expression pattern to match a valid URL
        const urlPattern = /^(https:\/\/)(www\.)?[\w.-]+\.[a-z]{2,5}(\/\S*)?$/i;

        if (!urlPattern.test(userData.xml_url)) {
          newErrors.xml_url = "Invalid URL format";
          // window.scrollTo(0, 0);
        }
      }
    //   if (userData.employer_id === "") {
    //     newErrors.employer_id = "Please select a company";
    //     // window.scrollTo(0, 0);
    //   }
      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Import?",
          text: "Do you want to Import Jobs?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (confirmationResult.isConfirmed) {
          setLoading(true);

          Cookies.set("xml_url", userData.xml_url);

          const response = await axios.post(
            BaseApi + "/admin/job/admin_jobimportdata",
            userData,
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

          if (response.data.status === 200) {

            navigate("/admin/jobs/importlistupdated");
            // Swal.fire({
            //   title: "Jobs Imported successfully!",
            //   icon: "success",
            //   confirmButtonText: "Close",
            // });
            // getData();
            // setUserData({
            //   ...userData,
            //   xml_url: "",
            //   employer_id: "",
            // });
            // window.scrollTo(0, 0);
            // navigate("/admin/jobs/importlist");
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
        text: "Could not Import Jobs. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not change username!", error);
    }
  };



  useEffect(() => {
    // Check if tokenKey is not present
    if (!tokenKey) {
      // Redirect to the login page
      navigate("/admin");
    } else {
      // TokenKey is present, fetch data or perform other actions
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
          <>
            <div className="loader-container"></div>
          </>
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
                    onClick={() => navigate("/admin/candidates")}
                  >
                    List Jobs
                  </Link>

                  <Typography color="text.primary">Import Jobs</Typography>
                </Breadcrumbs>
              </div>

              <h2 className="adminPageHeading">Import Jobs</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      XML Feed URL<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.xml_url && "input-error"
                      }`}
                      name="xml_url"
                      placeholder="XML URL"
                      value={userData.xml_url}
                      onChange={handleChange}
                    />
                    {errors.xml_url && (
                      <div className="text-danger">{errors.xml_url}</div>
                    )}
                  </div>
                  {/* <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Company Name<span className="RedStar">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.employer_id && "input-error"
                      }`}
                      aria-label="Default select example"
                      name="employer_id"
                      value={userData.employer_id}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        Select Company
                      </option>
                      {employersData.map((i) => {
                        return (
                          <option value={i.id}>
                            {i.company_name ? i.company_name:i.first_name}
                          </option>
                        );
                      })}
                    </select>
                    {errors.employer_id && (
                      <div className="text-danger">{errors.employer_id}</div>
                    )}
                  </div> */}
                  <button
                    type="button"
                    className="btn btn-primary button1"
                    onClick={handleClick}
                  >
                    NEXT
                  </button>
                </div>
              </form>
            </div>
            <APFooter />
          </>
        )}
      </div>
    </>
  );
};

export default APImportJobUpdated;
