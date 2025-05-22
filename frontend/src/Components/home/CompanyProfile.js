import axios from "axios";
import React, { useEffect, useState } from "react";
import NavBar from "../element/NavBar";
import Footer from "../element/Footer";
import { Link, useParams } from "react-router-dom";
import ApiKey from "../api/ApiKey";
import HTMLReactParser from "html-react-parser";
import Cookies from "js-cookie";
import BaseApi from "../api/BaseApi";
import { useTranslation } from "react-i18next";

const CompanyProfile = () => {
  const [companyDetails, setCompanyDetails] = useState([]);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();
  const slugData = slug;
  const [t, i18n] = useTranslation("global");
  let curr = Cookies.get("curr");
  const tokenKey = Cookies.get("tokenClient");
  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  let captchaKey = Cookies.get("captchaKey");

  const [hoverColor, setHoverColor] = useState(false);

  const handleMouseEnter = () => {
    setHoverColor(true);
  };

  const handleMouseLeave = () => {
    setHoverColor(false);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          BaseApi + `/candidates/companyprofile/${slugData}`,
          null,
          {
            headers: {
              "Content-Type": "application/json",
              key: ApiKey,
              token: tokenKey,
            },
          }
        );
        console.log(response);
        setCompanyDetails(response.data.response.userDetails);
        setCompanyJobs(response.data.response.jobDetails);
        setLoading(false);
      } catch (error) {
        console.log("Error getting company profile");
        setLoading(false);
      }
    };
    getData();
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <NavBar />
      <div className="blogPageSection1 text-center">
        <h1>{t("companyProfile.companyProfile")}</h1>
        <h6 className="text-muted mt-2">
          {" "}
          <Link to="/" style={{ color: "grey" }}>
            {t("navHeaders.home")}
          </Link>{" "}
          /{t("companyProfile.companyProfile")}
        </h6>
      </div>
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <div className="blogPageSection2 container">
            <div className="row">
              <div className="row">
                <h2 className="m-3">{companyDetails.company_name}</h2>
                <div className="col-md-9 col-lg-9">
                  <div className="card-body companyProfileCardLeft">
                    <div className="row">
                      <h5>
                        {companyDetails.company_about
                          ? HTMLReactParser(companyDetails.company_about)
                          : ""}
                      </h5>
                    </div>
                    <div className="card-footer companyProfileCardFooter">
                      <h5 className="companyProfileLocation text-muted">
                        <i class="fa-sharp fa-solid fa-location-dot"></i>{" "}
                        {t("companyProfile.location")}: {companyDetails.address}
                      </h5>
                      <h5 className="companyProfileContact text-muted">
                        <i class="fa-sharp fa-solid fa-phone"></i>{" "}
                        {t("companyProfile.contact")}:{" "}
                        {companyDetails.company_contact}
                      </h5>
                    </div>
                  </div>

                  {companyJobs
                    ? companyJobs.map((i) => {
                        return (
                          <>
                            <h2 className="ms-3 mb-3 mt-5">
                              {t("companyProfile.jobPostedBy")}{" "}
                              {companyDetails.company_name}
                            </h2>
                            <div className="card-body companyProfileCardLeft">
                              <div className="d-flex justify-content-between">
                                <h4>{i.title}</h4>
                                <Link
                                  to={`/jobdescription/${i.jslug}/${i.cslug}`}
                                  className="btn btn-primary button1"
                                  style={{
                                    backgroundColor: `${
                                      secondaryColor &&
                                      (hoverColor
                                        ? secondaryColor
                                        : primaryColor)
                                    }`,
                                    border: `${
                                      secondaryColor &&
                                      (hoverColor
                                        ? secondaryColor
                                        : primaryColor)
                                    }`,
                                  }}
                                  // onMouseEnter={handleMouseEnter}
                                  // onMouseLeave={handleMouseLeave}
                                >
                                  {t("companyProfile.detailsButton")}
                                </Link>
                              </div>
                              <h4 className="mt-4 text-muted">
                                {i.company_name}
                              </h4>
                              <div className="col-md-4 CPFourthSection">
                                <h6 className="text-muted CPTPart1">
                                  {t("companyProfile.experience")}:
                                </h6>
                                <h6 className="text-muted CPTPart2">
                                  <i class="fa-solid fa-suitcase"></i>{" "}
                                  {i.min_exp} - {i.max_exp}{" "}
                                  {t("companyProfile.years")}
                                </h6>
                              </div>
                              <div className="col-md-4 CPFourthSection">
                                <h6 className="text-muted CPFPart1">
                                  {t("companyProfile.location")}:
                                </h6>
                                <h6 className="text-muted CPTPart2">
                                  <i class="fa-sharp fa-solid fa-location-dot"></i>{" "}
                                  {i.job_city}
                                </h6>
                              </div>
                              <div className="col-md-4 CPFourthSection">
                                <h6 className="text-muted CPFPart1">
                                  {t("companyProfile.keySkills")}:
                                </h6>
                                <h6 className="text-muted CPFPart2">
                                  {i.skill}
                                </h6>
                              </div>
                              <div className="col-md-4 CPFifthSection">
                                <h6 className="text-muted CPFifthPart1">
                                  {t("companyProfile.designation")}:
                                </h6>
                                <h6 className="text-muted CPFifthPart2">
                                  {i.Designation}
                                </h6>
                              </div>
                              <div className="CPSixthSection">
                                <h4 className="text-muted CPSPart1">
                                  {t("companyProfile.description")}
                                </h4>
                                <h6 className="text-muted CPSPart2">
                                  {i.description
                                    ? HTMLReactParser(
                                        i.description.substring(0, 200)
                                      )
                                    : ""}
                                </h6>
                              </div>
                              <hr />
                              <div className="card-footer d-flex justify-content-evenly pb-3 CPFooter">
                                <h6 className="mt-4 text-muted">
                                  {curr} {i.min_salary} - {curr} {i.max_salary}
                                </h6>
                                <h6 className="mt-4 text-muted">
                                  <i class="fa-solid fa-suitcase"></i>{" "}
                                  {i.work_type}
                                </h6>
                                <h6 className="mt-4 text-muted">
                                  <i class="fa-solid fa-calendar-days"></i>{" "}
                                  {i.created}
                                </h6>
                                <h6 className="onlyLink mt-4">
                                  <Link className="mt-4 text-muted">
                                    <i class="fa-regular fa-star"></i>{" "}
                                    {t("companyProfile.saveJob")}
                                  </Link>
                                </h6>

                                <h6 className="mt-4 text-muted">
                                  <i class="fa-solid fa-share-from-square"></i>{" "}
                                  {t("companyProfile.sharetoFriend")}
                                </h6>
                              </div>
                            </div>
                          </>
                        );
                      })
                    : ""}
                </div>
                <div className="col-md-3 col-lg-3">
                  <div className="card-body companyProfileCardRight">
                    <div className="row">
                      <img
                        className="companyProfileCardRightImage"
                        src={companyDetails.profile_image}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default CompanyProfile;
