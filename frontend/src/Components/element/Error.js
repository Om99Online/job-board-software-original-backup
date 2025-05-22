import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const Error = () => {
  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  const [t, i18n] = useTranslation("global");

  const [hoverColor, setHoverColor] = useState(false);

  const handleMouseEnter = () => {
    setHoverColor(true);
  };

  const handleMouseLeave = () => {
    setHoverColor(false);
  };

  return (
    <div className="errorPage">
      <img className="errorImage" src="/Images/errorPage.jpg" alt="Error" />
      <br />
      <Link
        to=""
        className="navButton1"
        style={{
          backgroundColor: `${
            secondaryColor && (hoverColor ? secondaryColor : primaryColor)
          }`,
          border: `${
            secondaryColor && (hoverColor ? secondaryColor : primaryColor)
          }`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => window.history.back()}
      >
        {t("errorPage.goBackButton")}
      </Link>
    </div>
  );
};

export default Error;
