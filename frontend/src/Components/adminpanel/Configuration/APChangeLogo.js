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

const APChangeLogo = () => {
  const [logo, setLogo] = useState({
    logo: "",
    // logo_path: "",
  });
  const [logoData, setLogoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/admin/uploadLogo",
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
      setSelectedImage(response.data.response.logo_path);
      setLogo(response.data.response.logo_path);
      setLogoData(response.data.response.logo_path);
    } catch (error) {
      // setLoading(false);
      console.log("Cannot get profile photo data");
    }
  };

  const handleClick = async () => {
    try {
      if (!logo.logo || logo.logo === null) {
        Swal.fire({
          title: "Please select a Logo!",
          icon: "warning",
          confirmButtonText: "Close",
        });
      } else {
        const confirmationResult = await Swal.fire({
          title: "Upload Logo",
          text: "Do you want to upload this Logo?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          // setLoading(true);
          const response = await axios.post(
            BaseApi + "/admin/uploadLogo",
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
              title: "Logo updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            getData();

            // Set the updated logo path in the state
            // setLogo((prevLogo) => ({
            //   ...prevLogo,
            //   logo: response.data.response.logo_path,
            // }));

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
        title: "Could not update logo. Please try after some time!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not update photo!");
    }
  };

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
        fileInput.value = ""; // This clears the input
        setSelectedImage("");
        setLogo((prevLogo) => ({
          ...prevLogo,
          logo: "",
        }));
        return;
      }

      // Check image resolution
      const img = new Image();
      img.src = window.URL.createObjectURL(file);

      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        if (width < 150 || height < 40 || width > 265 || height > 100) {
          Swal.fire({
            title: "Image resolution should be 151*48 pixels",
            icon: "warning",
            confirmButtonText: "Close",
          });
          // Clear the file input
          fileInput.value = ""; // This clears the input
          // setSelectedImage("");
          setLogo((prevLogo) => ({
            ...prevLogo,
            logo: "",
          }));
        } else {
          // Convert the image to base64
          convertToBase64(file).then((base64) => {
            setLogo((prevLogo) => ({
              ...prevLogo,
              logo: base64,
            }));
            setSelectedImage(base64);
          });
        }
      };
    }
  };

  // const handleFileUpload1 = async (e) => {
  //   const file = e.target.files[0];
  //   const base64 = await convertToBase64(file);

  //   // Set the selected image in the state
  //   setLogo((prevLogo) => ({
  //     ...prevLogo,
  //     logo: base64,
  //   }));

  //   setLogo({ ...logo, logo: base64 });
  //   setSelectedImage(base64);
  // };

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
                  <Typography color="text.primary">Change Logo</Typography>
                </Breadcrumbs>
              </div>
              <h2 className="adminPageHeading">Change Logo</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    <div className="AdminChangeLogoBx mb-4 mt-5">
                      {selectedImage ? (
                        <img src={selectedImage} alt="selected logo" />
                      ) : (
                        <img
                          src="/Images/jobseekerSide/dummy-profile.png"
                          alt=""
                        />
                      )}
                    </div>

                    <form>
                      <div className="mb-4 mt-5">
                        <div class="mb-5 DashBoardInputBx">
                          <label for="formFile" class="form-label">
                            New Logo<span className="RedStar">*</span>
                          </label>
                          <input
                            class="form-control"
                            type="file"
                            id="formFile"
                            lable="Image"
                            name="logo"
                            accept=".jpeg, .png, .jpg, .gif"
                            onChange={(e) => handleFileUpload1(e)}
                          />
                          <div id="emailHelp" class="form-text">
                            Supported File Types: gif, jpg, jpeg, png (Max.
                            500 KB). Best visible size: logo size 151 X 48 pixels.
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

export default APChangeLogo;

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
