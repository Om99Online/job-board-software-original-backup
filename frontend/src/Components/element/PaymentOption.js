import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../element/CheckoutForm";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// stripe publishable key

let stripe_pk = Cookies.get("stripe_pk");
// This is your test publishable API key.
const stripePromise = loadStripe(stripe_pk);

const PaymentOption = () => {
  const [clientSecret, setClientSecret] = useState("");
  const tokenKey = Cookies.get("tokenClient");
  const userType = Cookies.get("user_type");
  const navigate = useNavigate();

  const { slug } = useParams();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch(BaseApi + "/payments/PayWithStripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        key: ApiKey,
        token: tokenKey,
      },
      body: JSON.stringify({
        plan_id: slug,
        payment_option: "stripe",
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);


  let PrePaymentSlug = "";

  const paymentButtonClick = async (slug) => {
    // console.log(details);
    try {
      const response = await axios.post(
        BaseApi + "/payments/planpurchase",
        {
          plan_id: slug,
          payment_option: "stripe",
        },
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
      } else{
        if (userType === "candidate") {
          navigate("/candidates/myaccount");
        }
        if (userType === "recruiter") {
          navigate("/user/myprofile");
        }
      }
      sessionStorage.setItem("prePaymentSlug", PrePaymentSlug);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    paymentButtonClick(slug);
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };
  return (
    <div>
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      ) : (
        <>
          <div className="pleaseWaitStripe">
            <img src="/Images/credit-card.gif" alt="payment" />
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentOption;
