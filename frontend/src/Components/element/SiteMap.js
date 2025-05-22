import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../element/Footer";
import NavBar from "../element/NavBar";
import BaseApi from "../api/BaseApi";
import { useTranslation } from "react-i18next";

const SiteMap = () => {
  const [loading, setLoading] = useState(false);
  const [siteMapData, setSiteMapData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [jobData, setJobData] = useState([]);
  const [t, i18n] = useTranslation("global");

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(BaseApi + "/sitemap", null);
      setLoading(false);
      setSiteMapData(response);
      setCategoryData(response.data.response.category);
      setJobData(response.data.response.jobs);
      // console.log(siteMapData);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get site map data");
    }
  };
  const handleClick = (id) => {
    sessionStorage.setItem("catId", id);
  };

  useEffect(() => {
    getData();
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <NavBar />
      <div className="blogPageSection1 text-center">
        <h1>{t("siteMap.sitemap")}</h1>
        <h6 className="text-muted mt-2">
          {" "}
          <Link to="/" style={{ color: "grey" }}>
            {t("resetPassword.home")}
          </Link>{" "}
          /{t("siteMap.sitemap")}
        </h6>
      </div>
      <div className="allCategorySection2 container">
        <div className="row">
          {/* {loading ? (
            <div className="loader-container"></div>
          ) : (
            <> */}
          <div className="">
            <div className="card-body Jcard">
              <h4>
                <u>{t("siteMap.mainPages")}</u>
              </h4>
              <div className="row">
                <Link to="/" className="col-md-3 eachLink">
                  {t("siteMap.home")}
                </Link>
                <Link
                  to="/user/register/jobseeker"
                  className="col-md-3 eachLink"
                >
                  {t("siteMap.jobseekerRegister")}
                </Link>
                <Link
                  to="/user/register/employer"
                  className="col-md-3 eachLink"
                >
                  {t("siteMap.employerRegister")}
                </Link>
                <Link to="/blog" className="col-md-3 eachLink">
                  {t("siteMap.blog")}
                </Link>
                <Link to="/contact" className="col-md-3 eachLink">
                  {t("siteMap.contactus")}
                </Link>
                <Link to="/how-it-works" className="col-md-3 eachLink">
                  {t("siteMap.howitworks")}
                </Link>
                <Link to="/aboutus" className="col-md-3 eachLink">
                  {t("siteMap.aboutUs")}
                </Link>
                <Link to="/career-tools" className="col-md-3 eachLink">
                  {t("siteMap.careerTools")}
                </Link>
                <Link to="/career-resources" className="col-md-3 eachLink">
                  {t("siteMap.careerResources")}
                </Link>
                <Link to="/faq" className="col-md-3 eachLink">
                  {t("siteMap.Faq")}
                </Link>
                <Link to="/benefits" className="col-md-3 eachLink">
                  {t("siteMap.benefits")}
                </Link>
                <Link to="/terms-and-conditions" className="col-md-3 eachLink">
                  {t("siteMap.terms&condition")}
                </Link>
                <Link to="/privacy-policy" className="col-md-3 eachLink">
                  {t("siteMap.privacyPolicy")}
                </Link>
              </div>
              <h4 className="mt-5">
                <u>{t("siteMap.categories")}</u>
              </h4>
              <div className="row">
                {categoryData.map((i) => {
                  return (
                    <>
                      <Link
                        to="/searchjob"
                        onClick={() => handleClick(i.id)}
                        className="col-md-3 eachLink"
                      >
                        {i.name}
                      </Link>
                    </>
                  );
                })}
              </div>
              <h4 className="mt-5">
                <u>{t("siteMap.latestJobs")}</u>
              </h4>
              <div className="row">
                {jobData.map((i) => {
                  return (
                    <>
                      <Link
                        to={`/jobdescription/${i.job_slug}/${i.cat_slug}`}
                        className="col-md-3 eachLink"
                      >
                        {i.title}
                      </Link>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
          {/* </>
          )} */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SiteMap;
