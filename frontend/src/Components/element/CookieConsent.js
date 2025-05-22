import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const CookieConsent = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [t, i18n] = useTranslation("global");

  const handleButtonClick = (event) => {
    const clickedButton = event.target.id;

    // Hide the popup
    setShowPopup(false);

    // Set the cookie if the user accepts
    if (clickedButton === "acceptBtn") {
      // Set cookies for 1 month. 60 = 1 min, 60 = 1 hour, 24 = 1 day, 30 = 30 days
      document.cookie = "cookieConsent=accepted; max-age=" + 60 * 60 * 24 * 30;
      //   setShowPopup(false);
      // Perform any necessary actions here, such as loading scripts or initializing services that rely on cookies
      // For example: loadAnalyticsScript();
    } else if (clickedButton === "declineBtn") {
      // Perform any action you want when the user declines the consent
    }
  };

  useEffect(() => {
    // Check if the cookie consent has already been accepted
    if (document.cookie.includes("cookieConsent=accepted")) {
      // Hide the popup if the consent has been accepted previously
      setShowPopup(false);
    }
  }, []);

  return (
    <>
      {showPopup && (
        <div className={`wrapper ${showPopup ? "show" : ""}`}>
          <header>
            <i className="bx bx-cookie"></i>
            <h2>{t("cookieConsent.consentHeading")}</h2>
          </header>
          <div className="data">
            <p>{t("cookieConsent.consentTxt")}<a href="/privacy-policy"> {t("cookieConsent.readMoreButton")}...</a></p>
          </div>
          <div className="buttons">
            <button
              className="button"
              id="acceptBtn"
              onClick={handleButtonClick}
            >
              {t("cookieConsent.acceptButton")}
            </button>
            <button
              className="button"
              id="declineBtn"
              onClick={handleButtonClick}
            >
              {t("cookieConsent.declineButton")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
