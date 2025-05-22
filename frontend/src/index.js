import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import global_en from "./Translations/en/global.json";
import global_ukr from "./Translations/ukr/global.json";
import global_el from "./Translations/el/global.json";
import global_de from "./Translations/de/global.json";

import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
// import { BrowserRouter } from "react-router-dom";

i18next.init({
  interpolation: { escapeValue: false },
  lng: "en",
  resources: {
    en: {
      global: global_en,
    },
    ukr: {
      global: global_ukr,
    },
    el: {
      global: global_el,
    },
    de: {
      global: global_de,
    },
    
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
// const clientId = "AQ2ncd-tirVNTRaXZsP4don_jFO168OiSeLtTiqaE-iPQkflvoS5hznzXUME12i8_AxkzWZrtBmBFEmD";
root.render(
  // <React.StrictMode>
    <PayPalScriptProvider
      options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}
    >
      <I18nextProvider i18n={i18next}>
        {/* <BrowserRouter> */}
        <App />
        {/* </BrowserRouter> */}
      </I18nextProvider>
    </PayPalScriptProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
