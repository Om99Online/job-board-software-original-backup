import React, { useEffect, useState } from "react";
import APNavBar from "../Elements/APNavBar";
import APSidebar from "../APSidebar/APSidebar";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axios from "axios";
import BaseApi from "../../api/BaseApi";
import ApiKey from "../../api/ApiKey";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import APFooter from "../Elements/APFooter";

const APAddSwearWords = () => {
  const [userData, setUserData] = useState({
    s_word: "",
  });
  const [errors, setErrors] = useState({
    s_word: "",
  });
  const [loading, setLoading] = useState(false);
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
  };

  // const getData = async () => {
  //   try {
  //     const response = await axios.post(
  //       BaseApi + "/admin/changeusername",
  //       null,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           key: ApiKey,
  //           token: tokenKey,
  //         },
  //       }
  //     );
  //     setUserData(response.data.response);
  //   } catch (error) {
  //     console.log("Error at chnage username at Admin panel");
  //   }
  // };

  const handleClick = async () => {
    try {
      const newErrors = {};

      if (userData.s_word === "") {
        newErrors.s_word = "Swear Word is required";
        window.scrollTo(0, 0);
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Add Swear Word?",
          text: "Do you want to Add Swear Word?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (confirmationResult.isConfirmed) {
          setLoading(true);

          const response = await axios.post(
            BaseApi + "/admin/swear/admin_add",
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
            Swal.fire({
              title: "Swear Word Added successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            // getData();
            // setUserData({
            //   ...userData,
            //   new_username: "",
            //   conf_username: "",
            // });
            // window.scrollTo(0, 0)
            navigate("/admin/swears");
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
        text: "Could not add Swear Word. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not change username!", error);
    }
  };

  useEffect(() => {
    // Check if tokenKey is not present
    if (!tokenKey) {
      // Redirect to the home page
      navigate("/admin");
    } else {
      // TokenKey is present, fetch data or perform other actions
      // getData();
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
                    to="/admin/admins/dashboard"
                    underline="hover"
                    color="inherit"
                  >
                    Dashboard
                  </Link>
                  <Link to="/admin/swears" underline="hover" color="inherit">
                    Swear Words List
                  </Link>

                  <Typography color="text.primary">Add Swear Words</Typography>
                </Breadcrumbs>
              </div>

              <h2 className="adminPageHeading">Add Swear Words</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Swear Words Name<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.s_word && "input-error"
                      }`}
                      name="s_word"
                      placeholder="Swear Word"
                      value={userData.s_word}
                      onChange={handleChange}
                    />
                    {errors.s_word && (
                      <div className="text-danger">{errors.s_word}</div>
                    )}
                    <p>(comma (,) separated)</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary button1"
                    onClick={handleClick}
                  >
                    SAVE
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary button2"
                    onClick={() => setUserData({...userData, s_word: ""})}
                  >
                    RESET
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

export default APAddSwearWords;
