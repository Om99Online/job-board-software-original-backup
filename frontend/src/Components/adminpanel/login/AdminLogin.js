import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BaseApi from "../../api/BaseApi";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Tooltip } from "@mui/material";

const AdminLogin = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    rememberMe: false, // State for "Remember Me"
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [siteKey, setSiteKey] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const getSiteData = async () => {
      try {
        const response = await axios.get(BaseApi + "/getconstant");
        setSiteKey(response.data.response.captcha_public_key);
      } catch (error) {
        console.log("Error getting navbar logo information!");
      }
    };

    getSiteData();

    const storedCredentials = localStorage.getItem("adminCredentials");
    if (storedCredentials) {
      setLoginData(JSON.parse(storedCredentials));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const getData = async (e) => {
    e.preventDefault();

    try {
      const newErrors = {};

      if (loginData.username === "") {
        newErrors.username = "Username is required";
      }
      if (loginData.password === "") {
        newErrors.password = "Password is required";
      }
      if (!isCaptchaVerified) {
        newErrors.captcha = "Please verify captcha";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        if (isCaptchaVerified) {
          setLoading(true);
          const response = await axios.post(
            BaseApi + "/admin/login",
            loginData
          );

          if (loginData.rememberMe) {
            localStorage.setItem("adminCredentials", JSON.stringify(loginData));
          } else {
            localStorage.removeItem("adminCredentials");
          }

          const { status, response: resp } = response.data;
          const { token, first_name, user_type, adminid, access } = resp;

          setLoading(false);

          if (status === 200 && token) {
            Cookies.set("token", token);
            Cookies.set("adminName", first_name);
            Cookies.set("adminuser_type", user_type);
            Cookies.set("adminID", adminid);
            Cookies.set("access", JSON.stringify(access));
            navigate("/admin/admins/dashboard");
            window.location.reload();

            Swal.fire({
              icon: "success",
              title: `Welcome ${first_name}`,
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          } else if (status === 500) {
            Swal.fire({
              icon: "error",
              title: response.data.message,
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          }
        }
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Could not log you in!",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <div className="container centerContainer">
          <div className="card rounded loginCardStyles">
            <div className="row">
              <div className="text-center mt-2">
                <img
                  src={Cookies.get("siteLogo") || "/Images/logo.png"}
                  alt="logo"
                />
                <div className="card-title h3 pt-5">ADMINISTRATION LOGIN</div>
                <div className="card-body">
                  <form
                    className="text-center border border-light"
                    onSubmit={getData}
                  >
                    <div className="mb-4">
                      <input
                        type="text"
                        id="defaultLoginFormEmail"
                        className={`form-control ${
                          errors.username ? "input-error" : ""
                        }`}
                        name="username"
                        value={loginData.username}
                        placeholder="Username"
                        onChange={handleChange}
                      />
                      {errors.username && (
                        <div className="text-danger adminValidation">
                          {errors.username}
                        </div>
                      )}
                    </div>

                    <div className="mb-4 passwordBox">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="defaultLoginFormPassword"
                        className={`form-control ${
                          errors.password ? "input-error" : ""
                        }`}
                        name="password"
                        value={loginData.password}
                        placeholder="Password"
                        onChange={handleChange}
                      />
                      <div className="passwordVisibilityAdmin">
                        <p
                          className="btn-primary"
                          type="button"
                          onClick={togglePasswordVisibility}
                        >
                          <Tooltip
                            title={
                              showPassword ? "Hide Password" : "View Password"
                            }
                          >
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </Tooltip>
                        </p>
                      </div>
                      {errors.password && (
                        <div className="text-danger adminValidation">
                          {errors.password}
                        </div>
                      )}
                    </div>

                    <div className="checkbox-wrapper-46">
                      <input
                        className="inp-cbx"
                        id="cbx-46"
                        type="checkbox"
                        name="rememberMe"
                        checked={loginData.rememberMe}
                        onChange={handleChange}
                      />
                      <label className="cbx" htmlFor="cbx-46">
                        <span>
                          <svg width="12px" height="10px" viewBox="0 0 12 10">
                            <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                          </svg>
                        </span>
                        <span>Remember Me</span>
                      </label>
                    </div>

                    {siteKey && (
                      <div className="reCaptchaLogin">
                        <ReCAPTCHA
                          sitekey={siteKey}
                          onChange={(value) => setIsCaptchaVerified(!!value)}
                        />
                        {errors.captcha && (
                          <div className="text-danger adminValidation">
                            {errors.captcha}
                          </div>
                        )}
                      </div>
                    )}

                    <button className="btn button1 my-2" type="submit">
                      Login
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      )}
    </>
  );
};

export default AdminLogin;
