import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckoutForm";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
let stripe_pk = Cookies.get("stripe_pk");

// This is your test publishable API key.
const stripePromise = loadStripe(stripe_pk);

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState("");
  const tokenKey = Cookies.get("tokenClient");

  const {id} = useParams();


  //   // API from nodejs server
  //   useEffect(() => {
  //     // Create PaymentIntent as soon as the page loads
  //     fetch("/create-payment-intent", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => setClientSecret(data.clientSecret));
  //   }, []);

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
        plan_id: id,
        payment_option: "stripe",
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  // API from laravel server
  // useEffect(() => {
  //   // Create PaymentIntent as soon as the page loads
  //   fetch("https://job-board-software.logicspice.com/job-board-script/api/payments/PayWithStripe", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setClientSecret(data.clientSecret));
  // }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App container mt-5">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
