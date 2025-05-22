import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import ApiKey from "../api/ApiKey";
import CheckoutForm from "./CheckoutForm";
import BaseApi from "../api/BaseApi";
import Cookies from "js-cookie";

const stripePromise = loadStripe("pk_test_dRE4KNR2BxPpRbNsKFa1yRAw");

export default function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState("");

  const tokenKey = Cookies.get("tokenClient");

  let fetchedPlanId = "33";
//   sessionStorage.getItem("planid");
  console.log(fetchedPlanId, "fetched");
  let bodyData = {
    plan_id: fetchedPlanId,
    payment_option: "stripe",
  };

  useEffect(() => {
    // replace this with your own server endpoint
    fetch(BaseApi + "/payments/planpurchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        key: ApiKey,
        token: tokenKey,
      },
      body: JSON.stringify(bodyData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const options = {
    clientSecret,
  };

  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
