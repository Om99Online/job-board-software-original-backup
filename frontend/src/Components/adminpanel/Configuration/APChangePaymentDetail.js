import React, { useEffect, useState } from "react";
import APNavBar from "../Elements/APNavBar";
import APSidebar from "../APSidebar/APSidebar";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BaseApi from "../../api/BaseApi";
import ApiKey from "../../api/ApiKey";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import APFooter from "../Elements/APFooter";

const APChangePaymentDetail = () => {
  const [userData, setUserData] = useState({
    paypal_email: "",
    stripe_secret_key: "",
    paypal_url: "",
    stripe_pk: "",
  });
  const [errors, setErrors] = useState({
    paypal_email: "",
    stripe_secret_key: "",
    paypal_url: "",
    stripe_pk: "",
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

  let paypalMethod = "";

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/admin/changePaymentdetail",
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
      setUserData(response.data.response);
      paypalMethod = response.data.response.paypal_url;
      console.log(paypalMethod);
    } catch (error) {
      setLoading(false);
      console.log("Error at change payment details at Admin panel");
    }
  };

  const handleClick = async () => {
    try {
      const { paypal_email, stripe_secret_key, stripe_pk } = userData;

      // Check if email fields are empty
      if (!paypal_email || !stripe_secret_key || !stripe_pk) {
        setErrors({
          paypal_email: paypal_email ? "" : "Email is required",
          stripe_secret_key: stripe_secret_key
            ? ""
            : "Stripe Secret key is required",
          stripe_pk: stripe_pk ? "" : "Stripe Private key is required",
        });
        return;
      }

      // Check for valid email format
      const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailFormat.test(paypal_email)) {
        setErrors({
          paypal_email: "Invalid Email Address",
        });
        return;
      }
      const confirmationResult = await Swal.fire({
        title: "Update?",
        text: "Do you want to update Payment Details?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (confirmationResult.isConfirmed) {
        setLoading(true);

        const response = await axios.post(
          BaseApi + "/admin/changePaymentdetail",
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
            title: "Payment Details updated successfully!",
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
        title: "Failed",
        text: "Could not update Payment Details. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not update Payment Details", error);
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

                  <Typography color="text.primary">
                    Change Payment Details
                  </Typography>
                </Breadcrumbs>
              </div>
              <h2 className="adminPageHeading">Update Payment Details</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Paypal Email<span className="RedStar">*</span>
                    </label>
                    <input
                      type="email"
                      id="form3Example1"
                      className={`form-control ${
                        errors.paypal_email && "input-error"
                      }`}
                      name="paypal_email"
                      value={userData.paypal_email}
                      placeholder="Paypal Email"
                      onChange={handleChange}
                    />
                    {errors.paypal_email && (
                      <div className="text-danger">{errors.paypal_email}</div>
                    )}
                  </div>
                  <div className="APRadioInput mb-5 DashBoardInputBx">
                    <label className="form-label" htmlFor="form3Example3">
                      Paypal Method<span className="RedStar">*</span>
                    </label>
                    <div className="APPaymentDetailsRadio">
                      <input
                        type="radio"
                        id="production"
                        name="paypal_url"
                        value="https://www.paypal.com/cgi-bin/webscr"
                        checked={
                          userData.paypal_url ===
                          "https://www.paypal.com/cgi-bin/webscr"
                        }
                        onChange={handleChange}
                      />
                      <label
                        className="labelProduction"
                        htmlFor="https://www.paypal.com/cgi-bin/webscr"
                      >
                        Production
                      </label>
                      <input
                        type="radio"
                        id="development"
                        name="paypal_url"
                        value="https://www.sandbox.paypal.com/cgi-bin/webscr"
                        checked={
                          userData.paypal_url ===
                          "https://www.sandbox.paypal.com/cgi-bin/webscr"
                        }
                        onChange={handleChange}
                      />
                      <label htmlFor="https://www.sandbox.paypal.com/cgi-bin/webscr">
                        Development
                      </label>
                    </div>
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Stripe Secret Key<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.stripe_secret_key && "input-error"
                      }`}
                      name="stripe_secret_key"
                      value={userData.stripe_secret_key}
                      placeholder="Stripe Secret Key"
                      onChange={handleChange}
                    />
                    {errors.stripe_secret_key && (
                      <div className="text-danger">
                        {errors.stripe_secret_key}
                      </div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Stripe Publishable Key<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.stripe_pk && "input-error"
                      }`}
                      name="stripe_pk"
                      value={userData.stripe_pk}
                      placeholder="Stripe Publishable Key"
                      onChange={handleChange}
                    />
                    {errors.stripe_pk && (
                      <div className="text-danger">{errors.stripe_pk}</div>
                    )}
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

export default APChangePaymentDetail;
