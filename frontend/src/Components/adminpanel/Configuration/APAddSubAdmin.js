import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import Cookies from "js-cookie";
import APFooter from "../Elements/APFooter";

const APAddSubAdmin = () => {
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");

  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    // Update user data
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Email validation
    // if (name === "email") {
    //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //   if (!emailRegex.test(value)) {
    //     newErrors = {
    //       ...newErrors,
    //       [name]: "Enter a valid email address",
    //     };
    //   } else {
    //     delete newErrors[name];
    //   }
    // } else {
    //   delete newErrors[name];
    // }

    // Password validation
    if (name === "password") {
      if (!validatePassword(value)) {
        newErrors = {
          ...newErrors,
          [name]:
            "Password must be at least 8 characters long and contain at least one special character, one lowercase character, one uppercase character, and one number.",
        };
        
      } else {
        delete newErrors[name];
      }
    } else {
      delete newErrors[name];
    }

    // Update errors
    setErrors(newErrors);
  };

  const handleClick = async () => {
    try {
      const {
        first_name,
        last_name,
        username,
        email,
        password,
        confirm_password,
      } = userData;

      // Check if email fields are empty
      if (
        !first_name ||
        !last_name ||
        !username ||
        !email ||
        !password ||
        !confirm_password
      ) {
        setErrors({
          first_name: first_name ? "" : "First Name is required",
          last_name: last_name ? "" : "Last Name is required",
          username: username ? "" : "Username is required",
          email: email ? "" : "Email is required",
          password: password ? "" : "Password is required",
          confirm_password: confirm_password
            ? ""
            : "Confirm password is required",
        });
        return;
      }

      // Check if new email and confirm email match
      if (password !== confirm_password) {
        setErrors({
          confirm_password: "Password and Confirm Password do not match",
        });
        return;
      }

      if (password.length < 8 || confirm_password.length < 8) {
        setErrors({
          password: "Please enter atleast 8 characters",
          confirm_password: "Please enter atleast 8 characters",
        });
        return;
      }

      // Validate email using the validateEmail function
      if (!validateEmail(email)) {
        setErrors({
          email: "Invalid Email Address",
        });
        return;
      }

      // Validate password using the validatePassword function
      if (!validatePassword(password)) {
        setErrors({
          password:
            "Password must be at least 8 characters long and contain at least one special character, one lowercase character, one uppercase character, and one number.",
        });
        return;
      }
      const confirmationResult = await Swal.fire({
        title: "Add Sub Admin?",
        text: "Do you want to Add Sub Admin?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (confirmationResult.isConfirmed) {
        //   setLoading(true);

        const response = await axios.post(
          BaseApi + "/admin/addsubadmin",
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
        //   setLoading(false);
        if (response.data.status === 200) {
          Swal.fire({
            title: "Sub Admin account created successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });

          // setUserData({
          //   ...userData,
          //   first_name: "",
          //   last_name: "",
          //   username: "",
          //   email: "",
          //   password: "",
          //   confirm_password: "",
          // });
          // window.scrollTo(0, 0);
          navigate("/admin/admins/manage");
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
        title: "Failed",
        text: "Could not add Sub Admin. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not add sub admin!", error);
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
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate("/admin/admins/dashboard")}
                  >
                    Dashboard
                  </Link>
                  <Link
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate("/admin/admins/manage")}
                  >
                    Sub Admins
                  </Link>
                  <Typography color="text.primary">Add Sub Admin</Typography>
                </Breadcrumbs>
              </div>

              <h2 className="adminPageHeading">Add Sub Admin</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      First Name<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.first_name && "input-error"
                      }`}
                      name="first_name"
                      placeholder="First Name"
                      value={userData.first_name}
                      onChange={handleChange}
                    />
                    {errors.first_name && (
                      <div className="text-danger">{errors.first_name}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Last Name<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.last_name && "input-error"
                      }`}
                      name="last_name"
                      placeholder="Last Name"
                      value={userData.last_name}
                      onChange={handleChange}
                    />
                    {errors.last_name && (
                      <div className="text-danger">{errors.last_name}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Username<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.username && "input-error"
                      }`}
                      name="username"
                      placeholder="Username"
                      value={userData.username}
                      onChange={handleChange}
                    />
                    {errors.username && (
                      <div className="text-danger">{errors.username}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Email Address<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.email && "input-error"
                      }`}
                      name="email"
                      placeholder="Email Address"
                      value={userData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <div className="text-danger">{errors.email}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Password<span className="RedStar">*</span>
                    </label>
                    <input
                      type="password"
                      id="form3Example1"
                      className={`form-control ${
                        errors.password && "input-error"
                      }`}
                      name="password"
                      placeholder="Password"
                      value={userData.password}
                      onChange={handleChange}
                    />
                    {errors.password && (
                      <div className="text-danger">{errors.password}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Confirm Password<span className="RedStar">*</span>
                    </label>
                    <input
                      type="password"
                      id="form3Example1"
                      className={`form-control ${
                        errors.confirm_password && "input-error"
                      }`}
                      name="confirm_password"
                      placeholder="Confirm Password"
                      value={userData.confirm_password}
                      onChange={handleChange}
                    />
                    {errors.confirm_password && (
                      <div className="text-danger">
                        {errors.confirm_password}
                      </div>
                    )}
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
                    onClick={() => setUserData({...userData, first_name: "", last_name: "", username: "", email: "", password: "", confirm_password: ""})}
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

export default APAddSubAdmin;
