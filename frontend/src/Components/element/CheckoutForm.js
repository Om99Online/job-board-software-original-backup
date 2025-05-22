import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import Cookies from "js-cookie";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  let transactionID = {
    transaction_id: "",
  };
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const { slug } = useParams();
  const userType = Cookies.get("user_type");
  const tokenKey = Cookies.get("tokenClient");


  const handleSuccessApi = async (orderID) => {
    try {
      // console.log(orderID);
      if (orderID) {
        var currentSlug = sessionStorage.getItem("prePaymentSlug");
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
      } else {
        console.log("Failed to generate order ID");
      }
    } catch (error) {
      console.log("Error in handle success api");
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

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          const randomTransactionID = generateRandomID();
          console.log(randomTransactionID);
          handleSuccessApi(randomTransactionID);
          Swal.fire({
            title: "Payment succeeded!",
            icon: "success",
            confirmButtonText: "Close",
          });
          if (userType === "candidate") {
            navigate("/candidates/myaccount");
          }
          if (userType === "recruiter") {
            navigate("/user/myprofile");
          }
          break;
        case "processing":
          setMessage("Your payment is processing.");
          Swal.fire({
            title: "Your payment is processing",
            icon: "warning",
            confirmButtonText: "Close",
          });
          if (userType === "candidate") {
            navigate("/candidates/myaccount");
          }
          if (userType === "recruiter") {
            navigate("/user/myprofile");
          }
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          Swal.fire({
            title: "Your payment was not successful, please try again",
            icon: "error",
            confirmButtonText: "Close",
          });
          if (userType === "candidate") {
            navigate("/candidates/myaccount");
          }
          if (userType === "recruiter") {
            navigate("/user/myprofile");
          }
          break;
        default:
          setMessage("Something went wrong.");
          Swal.fire({
            title: "Something went wrong",
            icon: "error",
            confirmButtonText: "Close",
          });
          if (userType === "candidate") {
            navigate("/candidates/myaccount");
          }
          if (userType === "recruiter") {
            navigate("/user/myprofile");
          }
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url:  `https://job-board-software.logicspice.com/payment/paymentoption/${slug}`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
      Swal.fire({
        title: error.message,
        icon: "warning",
        confirmButtonText: "Close",
      })
    } else {
      console.log(error.message);
      Swal.fire({
        title: error.message,
        icon: "warning",
        confirmButtonText: "Close",
      })
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <>
      <div
        className="stripeFormBox"
        style={{
          padding: "40px",
          margin: "auto",
          marginTop: "200px",
          width: "600px",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          borderRadius: "5px",
          display: `${paymentStatus} && none`,
        }}
      >
        <form id="payment-form" onSubmit={handleSubmit}>
          <PaymentElement
            id="payment-element"
            options={paymentElementOptions}
          />
          <button
            className="payButtonStripe"
            disabled={isLoading || !stripe || !elements}
            id="submit"
          >
            <span id="button-text">
              {isLoading ? (
                <div className="spinner" id="spinner"></div>
              ) : (
                "Pay now"
              )}
            </span>
          </button>
        </form>
      </div>

      {/* Show any error or success messages */}
      {message && (
        <>
          <div id="payment-message" className="stripePaymentMessage"></div>
          <Link to={userType === "candidate" ? "/candidates/myaccount" : "/user/myprofile"} className="navButton1">My Profile</Link>
        </>
      )}
    </>
  );
}
