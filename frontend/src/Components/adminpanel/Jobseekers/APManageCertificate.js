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
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import DeleteIcon from "@mui/icons-material/Delete";
import APFooter from "../Elements/APFooter";

const APManageCertificate = () => {
  const [selectedCV, setSelectedCV] = useState();
  const [selectedFileName, setSelectedFileName] = useState([]);
  const [userData, setUserData] = useState([]);
  const [certificatesData, setCertificatesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");

  const navigate = useNavigate();
  const { slug } = useParams();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/admin/candidates/certificates/${slug}`,
        null, // Pass null as the request body if not required
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
      setCertificatesData(response.data.response.certificates);
      setUserData(response.data.response);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get profile photo data");
    }
  };

  const handleClick = async () => {
    try {
      // if (!logo || logo === null) {
      //   Swal.fire({
      //     title: "Please select a Logo!",
      //     icon: "warning",
      //     confirmButtonText: "Close",
      //   });
      // } else {
      const confirmationResult = await Swal.fire({
        title: "Upload Certificates?",
        text: "Do you want to upload certificates?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);

        const updatedData = {
          ...userData,
          selectedCV: selectedCV, // Include the selected CV here
          selectedFileName: selectedFileName,
        };

        const formData = new FormData();
        formData.append("selectedCV", selectedCV);
        selectedFileName.forEach((fileName, index) => {
          formData.append(`selectedFileNames[${index}]`, fileName);
        });

        const response = await axios.post(
          BaseApi + `/admin/candidates/certificates/${slug}`,
          updatedData,
          {
            headers: {
              "Content-Type": "application/json",
              key: ApiKey,
              token: tokenKey,
              adminid: adminID,
            },
          }
        );
        if (response.data.status === 200) {
          Swal.fire({
            title: "Logo updated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          getData();

          window.scrollTo(0, 0);
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
      }
      // }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Could not update logo. Please try after some time!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not update photo!");
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const deleteCertificate = async (e, id) => {
    e.preventDefault();
    console.log(id);

    try {
      const confirmationResult = await Swal.fire({
        title: "Delete certificate?",
        text: "Do you want to delete this certificate?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        const response = await axios.post(
          BaseApi + `/admin/candidates/deleteCertificate/${id}`,
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
        if (response.data.status === 200) {
          Swal.fire({
            title: "Certificate deleted successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          getData();
          window.scrollTo(0, 0);
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed!",
        text: "Could not delete certificate. Please try after some time!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not delete cover!");
    }
  };

  useEffect(() => {
    // Check if tokenKey is not present
    if (!tokenKey) {
      // Redirect to the home page
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
                    Jobseekers
                  </Link>
                  <Link
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate("/admin/admins/dashboard")}
                  >
                    {userData.first_name} {userData.last_name}
                  </Link>
                  <Typography color="text.primary">Certificates</Typography>
                </Breadcrumbs>
              </div>
              <h2 className="mt-4">Manage Jobseeker Document/Certificates</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    <form>
                      <div className="mb-4 mt-5">
                        <div class="mb-5 DashBoardInputBx">
                          <label for="formFile" class="form-label">
                            CV Document/Certificates
                          </label>
                          <input
                            type="file"
                            id="formFile"
                            className="form-control"
                            name="file"
                            multiple
                            onChange={(e) => {
                              const files = Array.from(e.target.files);

                              // Capture the selected file names
                              const fileNames = files.map((file) => file.name);
                              setSelectedFileName(fileNames);

                              // Convert each selected file to base64 encoding
                              Promise.all(
                                files.map((file) => convertFileToBase64(file))
                              )
                                .then((base64Array) => {
                                  setSelectedCV(base64Array);
                                })
                                .catch((error) => {
                                  console.error(
                                    "Error converting files to base64:",
                                    error
                                  );
                                });
                            }}
                          />

                          <div id="emailHelp" class="form-text">
                            Supported File Types: pdf, doc and docx, gif, jpg,
                            jpeg, png (Max. 4 MB). Min file size 150 X 150
                            pixels for image
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary button1"
                    onClick={handleClick}
                  >
                    UPLOAD
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary button2"
                    onClick={() => navigate("/admin/candidates/index")}
                  >
                    CANCEL
                  </button>
                </div>
              </form>
              <div className="row certificateBoxParent">
                {certificatesData.map((i) => {
                  return (
                    <>
                      <div className="col-md-4 manageCertificateBox APActionButton">
                        <div className="certificateFloatingButton">
                          <button
                            className="btn btn-secondary"
                            onClick={(e) => deleteCertificate(e, i.slug)}
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                        <img src={i.document} alt="Certificate" />
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
            <APFooter />
          </>
        )}
      </div>
    </>
  );
};

export default APManageCertificate;

// function convertToBase64(file) {
//   return new Promise((resolve, reject) => {
//     const fileReader = new FileReader();
//     fileReader.readAsDataURL(file);
//     fileReader.onload = () => {
//       resolve(fileReader.result);
//     };
//     fileReader.onerror = (error) => {
//       reject(error);
//     };
//   });
// }
