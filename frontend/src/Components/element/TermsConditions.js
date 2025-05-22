import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";
import HTMLReactParser from "html-react-parser";
import { useTranslation } from "react-i18next";

const TermsConditions = () => {
  const [pageContent, setPageContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentLanguage = Cookies.get("selectedLanguage") || "en";
  const [t, i18n] = useTranslation("global");

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/page/staticpage/terms-and-conditions`,
        { language: currentLanguage }
      );
      setLoading(false);
      setPageContent(response.data.response);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get data of terms and condition page");
    }
  };

  useEffect(() => {
    getData();
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <NavBar />
      <div className="privacyPolicy">
        <div className="text-center PPSection1">
          <h1 className="">{pageContent.page_title}</h1>
          <h6 className="text-muted fw-normal">
            {" "}
            <Link to="/" style={{ color: "grey" }}>
              {t("navHeaders.home")}
            </Link>{" "}
            /{pageContent.page_title}
          </h6>
        </div>
        <div className="container">
          <div className="row">
            <div className="">
              <div className="upperPart">
                <p>
                  {pageContent.page_description &&
                    HTMLReactParser(pageContent.page_description)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsConditions;
