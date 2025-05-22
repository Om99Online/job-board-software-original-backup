import React, { useEffect, useState } from "react";
import NavBar from "../element/NavBar";
import Sidebar from "./Sidebar";
import Footer from "../element/Footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import "rc-tooltip/assets/bootstrap.css";
import Tooltip from "rc-tooltip";
import HTMLReactParser from "html-react-parser";
import JSSidebar from "../jobseekersSide/JSSidebar";
import { PayPalButtons } from "@paypal/react-paypal-js";
import Cookies from "js-cookie";
import Paypalcheckout from "../element/Paypalcheckout";
import Swal from "sweetalert2";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const InnerMembershipPlan = () => {
  const [loading, setLoading] = useState(false);
  const [membershipData, setMembershipData] = useState([]);
  const [membershipPlan, setMembershipPlan] = useState([]);
  const [sendPlanDetail, setSendPlanDetail] = useState({
    plan_id: "",
    payment_option: "",
  });
  const [prePaymentDetail, setPrePaymentDetail] = useState([]);
  const [membershipFeatures, setMembershipFeatures] = useState([]);
  const [paypalData, setPaypalData] = useState([]);
  const tokenKey = Cookies.get("tokenClient");
  const navigate = useNavigate();
  const userType = Cookies.get("user_type");
  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  let currencyCode = Cookies.get("currency");
  let curr = Cookies.get("curr");

  let paymentMethod = "";
  let PrePaymentSlug = "";

  const product = {
    description: "Testing purchase",
    price: 20.0,
  };

  const [paidFor, setPaidFor] = useState(false);
  const [error, setError] = useState(null);

  const handleApprove = (orderID) => {
    // call backend to fulfill the order

    // if response is success
    setPaidFor(true);

    // Refresh the users account for subscription status. Below

    // If the response is error
    // setError("your payment was processed successfully, however we are unable to fulfill your order. Please contact the support@domain.com");
  };

  if (paidFor) {
    // console.log("paid true");

    // display success message, modal or redirect user to success page.
    Swal.fire({
      title: "Thank you for your purchase!",
      text: "Your plan is activated and you can check it's details in your profle.",
      icon: "success",
      confirmButtonText: "Close",
    });
    if (userType === "candidate") {
      navigate("/candidates/myaccount");
    }
    if (userType === "recruiter") {
      navigate("/user/myprofile");
    }
    setTimeout(function () {
      window.location.reload();
    }, 3000);
    setPaidFor(false);
  }

  if (error) {
    // display an error message, modal or redirewct the user to a error page.
    Swal.fire({
      title: "Failed",
      text: error,
      icon: "error",
      confirmButtonText: "Close",
    });
  }

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(BaseApi + "/plans/purchase", null, {
        headers: {
          "Content-Type": "application/json",
          key: ApiKey,
          token: tokenKey,
        },
      });
      setLoading(false);
      setMembershipData(response.data.response.plan);
      setMembershipPlan(response.data.response.plan);
      setMembershipFeatures(membershipPlan);
      setPaypalData(response.data.response.paypal);
      // console.log(membershipFeatures);
    } catch (error) {
      setLoading(false);
      console.log("Could not get membership plan data!");
    }
  };

  let planDetails = {
    plan_id: "",
    payment_option: "",
  };

  const paymentButtonClick = async (details) => {
    // console.log(details);
    console.log(details, "From payment Button Click");
    try {
      const response = await axios.post(
        BaseApi + "/payments/planpurchase",
        details,
        {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            token: tokenKey,
          },
        }
      );
      if (response.data.status === 200) {
        PrePaymentSlug = response.data.response.slug;
      }
      console.log(PrePaymentSlug);
      // console.log(response,"resp");
      // console.log(response.data.status,"status");
      // console.log(response.data.response.slug,"slug");
    } catch (error) {
      console.log(error);
    }
  };

  function generateRandomID() {
    const characters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const idLength = 17;
    let randomID = "";

    for (let i = 0; i < idLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomID += characters.charAt(randomIndex);
    }

    return randomID;
  }

  const freePlanPurchase = async (details) => {
    // console.log(details);
    console.log(details, "From payment Button Click");
    try {
      const response = await axios.post(
        BaseApi + "/payments/planpurchase",
        details,
        {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            token: tokenKey,
          },
        }
      );
      if (response.data.status === 200) {
        PrePaymentSlug = response.data.response.slug;
        const randomTransactionID = generateRandomID();
        console.log(randomTransactionID);
        handleSuccessApi(randomTransactionID);
        Swal.fire({
          title: "Activated",
          text: "Your plan is activated and you can check it's details in your profle.",
          icon: "success",
          confirmButtonText: "Close",
        });
        if (userType === "candidate") {
          navigate("/candidates/myaccount");
        }
        if (userType === "recruiter") {
          navigate("/user/myprofile");
        }
      }
      console.log(PrePaymentSlug);
      // console.log(response,"resp");
      // console.log(response.data.status,"status");
      // console.log(response.data.response.slug,"slug");
    } catch (error) {
      console.log(error);
    }
  };

  let planId;
  const getPlanId = (id, amount, currency, plan_name) => {
    sessionStorage.setItem("planid", id);
    sessionStorage.setItem("planAmount", amount);
    sessionStorage.setItem("planCurrency", currency);
    sessionStorage.setItem("planName", plan_name);
    planId = id;
    // console.log(sessionStorage.getItem("planAmount"),"session storage")

    console.log(sessionStorage.getItem("planid"), "session storage");
    // console.log(sessionStorage.getItem("planCurrency"),"session storage")
    // console.log(sessionStorage.getItem("planName"),"session storage")
  };

  const activateFreePlan = (id, amount, currency, plan_name) => {
    planDetails.plan_id = id;
    planDetails.payment_option = "paypal";
    freePlanPurchase(planDetails);
  };

  const [postPaymentDetail, setPostPaymentDetail] = useState({
    transaction_id: "",
  });
  let transactionID = {
    transaction_id: "",
  };
  const [postPaymentResponse, setPostpaymentResponse] = useState([]);
  const handleSuccessApi = async (orderID) => {
    try {
      // console.log(orderID);
      if (orderID) {
        var currentSlug = PrePaymentSlug;
        transactionID.transaction_id = orderID;
        // setPostPaymentDetail({ ...postPaymentDetail, transaction_id: orderID });
        const response = await axios.post(
          BaseApi + `/payments/checkoutSuccess/${currentSlug}`,
          transactionID,
          {
            headers: {
              "Content-Type": "application/json",
              key: ApiKey,
              token: tokenKey,
            },
          }
        );
        setPostpaymentResponse(response.data.response);
      } else {
        console.log("Failed to generate order ID");
      }
    } catch (error) {
      console.log("Error in handle success api");
    }
  };

  const handleFailureApi = async () => {
    console.log("handleFailure api");
  };

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

  return (
    <>
      <NavBar />

      <div className="container membershipPlan">
        {/* Payment modal */}

        <div
          class="modal fade membershipModal"
          id="PaymentModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">
                  Select Payment Method
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <h6 className="text-center">
                  This plan will apply from today and any remaining feature of
                  the current plan will not carry forward.
                </h6>
                <div className="radioInput form-outline mb-5 DashBoardInputBx mt-5">
                  <label className="form-label" htmlFor="form3Example3">
                    Payment Method<span className="RedStar">*</span>
                  </label>
                  <div className="paymentOptionsAvailable">
                    <button
                      className="btn stripePaymentButton"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() =>
                        navigate(`/payment/paymentoption/${planId}`)
                      }
                    >
                      Stripe
                    </button>
                    <button
                      id="paypal-button"
                      type="submit"
                      className="paypal-button-container"
                    >
                      <PayPalScriptProvider
                        options={{
                          "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
                          currency: currencyCode,
                        }}
                      >
                        <PayPalButtons
                          style={{
                            color: "silver",
                            layout: "horizontal",
                            height: 48,
                            tagline: false,
                            shape: "pill",
                          }}
                          onClick={(data, actions) => {
                            planDetails.plan_id =
                              sessionStorage.getItem("planid");
                            planDetails.payment_option = "paypal";
                            paymentButtonClick(planDetails);
                            // Validate on button click, either on client or server side.
                            const hasAlreadyBoughtPlan = false;

                            if (hasAlreadyBoughtPlan) {
                              setError(
                                "You already have this plan, Go to your profile to view the active plan."
                              );
                              return actions.reject();
                            } else {
                              return actions.resolve();
                            }
                          }}
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [
                                {
                                  description:
                                    sessionStorage.getItem("planName"),
                                  amount: {
                                    currency_code: currencyCode,
                                    value: sessionStorage.getItem("planAmount"),
                                  },
                                },
                              ],
                            });
                          }}
                          onApprove={async (data, actions) => {
                            const order = await actions.order.capture();
                            console.log(order, "Order");
                            if (order.status === "COMPLETED") {
                              handleSuccessApi(order.id);
                            } else {
                              handleFailureApi();
                            }

                            handleApprove(data.orderID);
                          }}
                          onCancel={() => {
                            // Display the cancel message, modal or redirect the user to the cancel page or back to the cart.
                            alert("Payment cancelled.");
                            handleFailureApi();
                          }}
                          onError={(err) => {
                            setError(err);
                            console.error("Paypal checkout error", err);
                          }}
                        />
                      </PayPalScriptProvider>
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-3">
            {userType == "candidate" ? <JSSidebar /> : <Sidebar />}
          </div>
          {loading ? (
            <div className="loader-container"></div>
          ) : (
            <>
              <div
                className="col-lg-9 mb-5 CLPanelRight"
                style={{
                  borderLeft: "2px solid #e6e8e7",
                  borderRight: "2px solid #e6e8e7",
                }}
              >
                <div className="d-flex PageHeader">
                  <img src="/Images/employerSide/icon3color.png" alt="" />
                  <h3 className="mx-2">Purchase Membership Plan</h3>
                </div>

                <div className="row">
                  {membershipData.map((i) => {
                    return (
                      <>
                        <div className="col-md-4 mt-5">
                          <div className="card text-center membershipCardMain">
                            <div className="item">
                              <div className="MembershipCardAuth">
                                <div className="membershipCardAuthUpperPart">
                                  <h4>{i.plan_name}</h4>
                                  <h2
                                    style={{
                                      color: primaryColor,
                                    }}
                                  >
                                    {curr} {i.amount}
                                  </h2>
                                  <h6 className="mt-3">{i.plan_type}</h6>
                                </div>

                                {i.is_plan_active === 1 && (
                                  <Link
                                    className="btn btn-secondary"
                                    style={{
                                      backgroundColor: secondaryColor,
                                      border: secondaryColor,
                                    }}
                                    // data-bs-toggle="modal"
                                    // data-bs-target="#PaymentModal"
                                    // onClick={() => getPlanId(i.plan_id)}
                                  >
                                    CURRENT PLAN
                                  </Link>
                                )}
                                {
                                  i.is_plan_active === 0 &&
                                    (i.amount <= 0 ? (
                                      <>
                                        <Link
                                          className="btn btn-primary"
                                          style={{
                                            backgroundColor: primaryColor,
                                            border: primaryColor,
                                          }}
                                          // data-bs-toggle="modal"
                                          // data-bs-target="#PaymentModal"
                                          onClick={() =>
                                            activateFreePlan(
                                              i.plan_id,
                                              i.amount,
                                              i.currency,
                                              i.plan_name
                                            )
                                          }
                                        >
                                          BUY THIS PLAN
                                        </Link>
                                      </>
                                    ) : (
                                      <>
                                        <Link
                                          className="btn btn-primary"
                                          data-bs-toggle="modal"
                                          data-bs-target="#PaymentModal"
                                          style={{
                                            backgroundColor: primaryColor,
                                            border: primaryColor,
                                          }}
                                          onClick={() =>
                                            getPlanId(
                                              i.plan_id,
                                              i.amount,
                                              i.currency,
                                              i.plan_name
                                            )
                                          }
                                        >
                                          BUY THIS PLAN
                                        </Link>
                                      </>
                                    ))
                                  // <Link
                                  //   className="btn btn-primary"
                                  //   data-bs-toggle="modal"
                                  //   data-bs-target="#PaymentModal"
                                  //   onClick={() => getPlanId(i.plan_id,i.amount,i.currency,i.plan_name)}
                                  // >
                                  //   BUY THIS PLAN
                                  // </Link>
                                }

                                <div className="ApplyAllAuth text-center mb-4">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="applyimmediately"
                                  />
                                  <label
                                    className="form-check-label"
                                    for="applyimmediately"
                                  >
                                    Apply Immediately
                                  </label>
                                  <Tooltip
                                    placement="top"
                                    overlay={
                                      <span>
                                        If you select this option plan will{" "}
                                        <br />
                                        be applied from today and any
                                        <br /> remaining feature of your current
                                        <br /> plan will not be carry forwarded.
                                      </span>
                                    }
                                  >
                                    <span>
                                      <i class="fa-solid fa-circle-info ms-2"></i>
                                    </span>
                                  </Tooltip>
                                </div>
                                <hr />
                                <ul className="applyoptionAuth">
                                  {i.features.map((j) => {
                                    return (
                                      <>
                                        <li>
                                          {j.outer
                                            ? HTMLReactParser(j.outer)
                                            : ""}
                                          <Tooltip
                                            placement="top"
                                            overlay={
                                              <span>
                                                {j.inner
                                                  ? HTMLReactParser(j.inner)
                                                  : ""}
                                              </span>
                                            }
                                          >
                                            <span>
                                              <i class="fa-solid fa-circle-info ms-2"></i>
                                            </span>
                                          </Tooltip>
                                        </li>
                                      </>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
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

export default InnerMembershipPlan;
