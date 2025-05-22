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

const APChangeFavicon = () => {
  const [logo, setLogo] = useState({
    favicon: "",
    // favicon_path: "",
  });
  const [errors, setErrors] = useState({
    favicon: "",
  });
  // const [logoData, setLogoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/admin/changeFavicon",
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
      setSelectedImage(response.data.response.favicon_path);
      // setLogo(response.data.response);
      // setLogoData(response.data.response.favicon_path);
      console.log(response.data.response.favicon_path);
    } catch (error) {
      // setLoading(false);
      console.log("Cannot get profile photo data");
    }
  };

  const handleClick = async () => {
    try {
      if (!logo.favicon || logo.favicon === null) {
        Swal.fire({
          title: "Please select a Favicon!",
          icon: "warning",
          confirmButtonText: "Close",
        });
      } else {
        const confirmationResult = await Swal.fire({
          title: "Upload Favicon",
          text: "Do you want to upload this Favicon?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          // setLoading(true);
          const response = await axios.post(
            BaseApi + "/admin/changeFavicon",
            logo,
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
              title: "Favicon updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            // setSelectedImage(logo.favicon_path)
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
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Could not update Favicon. Please try after some time!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not update photo!");
    }
  };

  // const handleFileUpload1 = async (e) => {
  //   const file = e.target.files[0];
  //   const base64 = await convertToBase64(file);
  //   setLogo({ ...logo, favicon: base64 });
  //   setSelectedImage(base64);
  // };

  const handleFileUpload1 = async (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];
  
    // Check if the file is selected
    if (file) {
      // Check the file size (in bytes)
      const fileSizeInBytes = file.size;
      const maxSizeInBytes = 500 * 1024; // 500 KB
      if (fileSizeInBytes > maxSizeInBytes) {
        Swal.fire({
          title: "Image size should be under 500 KB",
          icon: "warning",
          confirmButtonText: "Close",
        });
        // Clear the file input
        fileInput.value = "";
        setSelectedImage("");
        setLogo((prevLogo) => ({
          ...prevLogo,
          favicon: "",
        }));
        return;
      }
  
      // Check image resolution
      const img = new Image();
      img.src = window.URL.createObjectURL(file);
  
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
  
        if (width < 10 || height < 10 || width > 100 || height > 100) {
          Swal.fire({
            title: "Image resolution should be between 10x10 and 100x100 pixels",
            icon: "warning",
            confirmButtonText: "Close",
          });
          // Clear the file input
          fileInput.value = "";
          setSelectedImage("");
          setLogo((prevLogo) => ({
            ...prevLogo,
            favicon: "",
          }));
        } else {
          // Convert the image to base64
          convertToBase64(file).then((base64) => {
            setLogo((prevLogo) => ({
              ...prevLogo,
              favicon: base64,
            }));
            setSelectedImage(base64);
          });
        }
      };
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

                  <Typography color="text.primary">Change Favicon</Typography>
                </Breadcrumbs>
              </div>
              <h2 className="adminPageHeading">Change Favicon</h2>
              <form className="adminForm">
                <div className="mb-5 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    <div className="adminFavicon mb-4 mt-4">
                      {selectedImage && (
                        <img
                          className="adminFaviconImage"
                          src={selectedImage}
                          alt="Selected"
                        />
                      )}
                    </div>
                    <form>
                      <div className="mt-5">
                        <div class="DashBoardInputBx">
                          <label for="formFile" class="form-label">
                            New Favicon<span className="RedStar">*</span>
                          </label>
                          <input
                            class="form-control"
                            type="file"
                            id="formFile"
                            lable="Image"
                            name="favicon"
                            accept=".ico"
                            onChange={(e) => handleFileUpload1(e)}
                          />
                          <div id="emailHelp" class="form-text">
                            Supported File Types: ico (Max. 500 KB). Min file size
                            16 X 16 pixels.
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
                    UPDATE
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary button2"
                    onClick={() => navigate("/admin/admins/dashboard")}
                  >
                    CANCEL
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

export default APChangeFavicon;

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
