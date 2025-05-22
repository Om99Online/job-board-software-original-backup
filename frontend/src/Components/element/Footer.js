import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
const Footer = () => {
  const [isQuickLinksVisible, setIsQuickLinksVisible] = useState(false);
  const [isAboutusLinksVisible, setIsAboutusLinksVisible] = useState(false);
  const [isJobseekerLinksVisible, setIsJobseekerLinksVisible] = useState(false);

  let siteTitle = Cookies.get("siteTitle");
  let siteLink = Cookies.get("siteLink");
  let faceboookLink = Cookies.get("fbLink");
  let instagramLink = Cookies.get("instaLink");
  let twitterLink = Cookies.get("twitterLink");
  let pinterestLink = Cookies.get("pinterestLink");
  let linkedInLink = Cookies.get("linkedInLink");
  const [t, i18n] = useTranslation("global");

  const [selectedLanguage, setSelectedLanguage] = useState(
    Cookies.get("selectedLanguage") || "en"
  );

  const currentLanguage = Cookies.get("selectedLanguage") || "";

  const handleChangeLanguage = (selectedValue) => {
    if (selectedValue) {
      i18n.changeLanguage(selectedValue);
      window.scrollTo(0, 0);
    } else {
      i18n.changeLanguage(currentLanguage);
      window.scrollTo(0, 0);
    }
    window.location.reload();
    setSelectedLanguage(selectedValue);
    Cookies.set("selectedLanguage", selectedValue, { expires: 365 });
  };
  useEffect(() => {
    if (currentLanguage) {
      i18n.changeLanguage(currentLanguage);
      window.scrollTo(0, 0);
    }
  }, []);

  // const [footerName, setFooterName] = useState();
  // const [footerLink, setFooterLink] = useState();

  // const getData = async () => {
  //   try {
  //     const response = await axios.get(BaseApi + "/getconstant");
  //     setFooterLink(response.data.response.site_link);
  //     setFooterName(response.data.response.site_title);
  //   } catch (error) {
  //     console.log("Error getting navbar logo information!");
  //   }
  // };
  useEffect(() => {
    // getData();
    // window.scrollTo(0, 0);
  }, []);

  const toggle3 = () => {
    setIsQuickLinksVisible(!isQuickLinksVisible);
  };
  const toggle2 = () => {
    setIsAboutusLinksVisible(!isAboutusLinksVisible);
  };
  const toggle1 = () => {
    setIsJobseekerLinksVisible(!isJobseekerLinksVisible);
  };

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth < 768) {
        setIsQuickLinksVisible(false);
        setIsAboutusLinksVisible(false);
        setIsJobseekerLinksVisible(false);
      } else {
        setIsQuickLinksVisible(false);
        setIsAboutusLinksVisible(false);
        setIsJobseekerLinksVisible(true);
      }
    };

    // Call the function on component mount
    handleWindowResize();

    // Attach event listener for window resize
    window.addEventListener("resize", handleWindowResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
    // getData();
  }, []);

  let screenWidth = window.innerWidth;

  return (
    <>
      {screenWidth > 768 ? (
        <>
          <div className="footer">
            <div className="container">
              <div className="row footerHeadersRow">
                <div className="col-xs-12 col-md-3 col-lg-3">
                  <div className="FooterLinks">
                    <h3>{t("footer.jobseekers")}</h3>
                    <ul>
                      <li>
                        <Link to="/searchjob" className="">
                          {t("footer.searchJob")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/user/jobseekerlogin" className="">
                          {t("footer.jobseekerLogin")}{" "}
                        </Link>
                      </li>
                      <li>
                        <Link to="/alerts/add" className="">
                          {t("footer.createJobAlert")}{" "}
                        </Link>
                      </li>
                      <li>
                        <Link to="/candidates/editExperience" className="">
                          {t("footer.experience")}{" "}
                        </Link>
                      </li>
                      <li>
                        <Link to="/candidates/editEducation" className="">
                          {t("footer.education")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 col-lg-3">
                  <div className="FooterLinks">
                    <h3>{t("footer.aboutus")}</h3>
                    <ul>
                      <li>
                        <Link to="/aboutus" className="">
                          {t("footer.aboutus")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/faq" className="">
                          {t("footer.faq")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/privacy-policy" className="">
                          {t("footer.privacyPolicy")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/contact" className="">
                          {t("footer.contactus")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/sitemap" className="">
                          {t("footer.siteMap")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 col-lg-3">
                  <div className="FooterLinks">
                    <h3>{t("footer.quickLinks")}</h3>
                    <ul>
                      <li>
                        {" "}
                        <Link to="/jobs/savedjobs" className="">
                          {t("footer.savedJobs")}
                        </Link>
                      </li>
                      <li>
                        {" "}
                        <Link to="/companies" className="">
                          {t("footer.companies")}
                        </Link>
                      </li>
                      <li>
                        {" "}
                        <Link to="/career-tools" className="">
                          {t("footer.careerTools")}
                        </Link>
                      </li>
                      <li>
                        {" "}
                        <Link to="/career-resources" className="">
                          {t("footer.careerResources")}
                        </Link>
                      </li>
                      <li>
                        {" "}
                        <Link to="/benefits" className="">
                          {t("footer.benefits")}
                        </Link>
                      </li>
                      <li>
                        {" "}
                        <Link to="/user/myprofile" className="">
                          {t("footer.postJob")}
                        </Link>
                      </li>
                      <li>
                        {" "}
                        <Link to="/searchjob" className="">
                          {t("footer.findJob")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 col-lg-3">
                  <div className="FooterLinks">
                    <h3>{t("footer.followUs")}</h3>
                    <div className="SocialIcons">
                      <Link to={faceboookLink} target="_blank">
                        <FacebookIcon />
                      </Link>
                      <Link to={instagramLink} target="_blank">
                        <InstagramIcon />
                      </Link>
                      <Link to={pinterestLink} target="_blank">
                        <PinterestIcon />
                      </Link>
                      <Link to={linkedInLink} target="_blank">
                        <LinkedInIcon />
                      </Link>
                    </div>
                    <div className="LangaugeDropdown">
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        value={selectedLanguage}
                        onChange={(e) => handleChangeLanguage(e.target.value)}
                      >
                        {/* <option defaultValue="">Change Language</option> */}
                        <option value="en">English</option>
                        <option value="el">Greek</option>
                        <option value="ukr">Ukrainian</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="footerFooter">
                <hr />
                <p>
                  &copy; Copyright@2024 | <Link to={siteLink} target="_blank">{siteTitle}</Link>{" "}
                  | All Rights Reserved
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="footer">
            <div className="container">
              <div className="row footerHeadersRow">
                <div className="col-xs-12 col-md-3 col-lg-3">
                  <div className="FooterLinks">
                    <div className="footerEachHeader">
                      <h3>{t("footer.jobseekers")}</h3>
                      <Link className="footerPlusLink" onClick={toggle1}>
                        {isJobseekerLinksVisible ? (
                          <i className="fa-solid fa-circle-minus"></i>
                        ) : (
                          <i className="fa-solid fa-circle-plus"></i>
                        )}
                      </Link>
                    </div>

                    <ul
                      style={{
                        display: isJobseekerLinksVisible ? "block" : "none",
                      }}
                    >
                      <li>
                        <Link to="/searchjob" className="">
                          {t("footer.searchJob")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/user/jobseekerlogin" className="">
                          {t("footer.jobseekerLogin")}{" "}
                        </Link>
                      </li>
                      <li>
                        <Link to="/alerts/add" className="">
                          {t("footer.createJobAlert")}{" "}
                        </Link>
                      </li>
                      <li>
                        <Link to="/candidates/editExperience" className="">
                          {t("footer.experience")}{" "}
                        </Link>
                      </li>
                      <li>
                        <Link to="/candidates/editEducation" className="">
                          {t("footer.education")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 col-lg-3">
                  <div className="FooterLinks">
                    <div className="footerEachHeader">
                      <h3>{t("footer.aboutus")}</h3>
                      <Link className="footerPlusLink" onClick={toggle2}>
                        {isAboutusLinksVisible ? (
                          <i className="fa-solid fa-circle-minus"></i>
                        ) : (
                          <i className="fa-solid fa-circle-plus"></i>
                        )}
                      </Link>
                    </div>

                    <ul
                      style={{
                        display: isAboutusLinksVisible ? "block" : "none",
                      }}
                    >
                      <li>
                        <Link to="/aboutus" className="">
                          {t("footer.aboutus")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/faq" className="">
                          {t("footer.faq")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/privacy-policy" className="">
                          {t("footer.privacyPolicy")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/contact" className="">
                          {t("footer.contactus")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/sitemap" className="">
                          {t("footer.siteMap")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 col-lg-3">
                  <div className="FooterLinks">
                    <div className="footerEachHeader">
                      <h3>{t("footer.quickLinks")}</h3>
                      <Link className="footerPlusLink" onClick={toggle3}>
                        {isQuickLinksVisible ? (
                          <i className="fa-solid fa-circle-minus"></i>
                        ) : (
                          <i className="fa-solid fa-circle-plus"></i>
                        )}
                      </Link>
                    </div>

                    <ul
                      style={{
                        display: isQuickLinksVisible ? "block" : "none",
                      }}
                    >
                      <li>
                        {" "}
                        <Link to="/jobs/savedjobs" className="">
                          {t("footer.savedJobs")}
                        </Link>
                      </li>
                      <li>
                        {" "}
                        <Link to="/companies" className="">
                          {t("footer.companies")}
                        </Link>
                      </li>
                      <li>
                        {" "}
                        <Link to="/career-tools" className="">
                          {t("footer.careerTools")}
                        </Link>
                      </li>
                      <li>
                        {" "}
                        <Link to="/career-resources" className="">
                          {t("footer.careerResources")}
                        </Link>
                      </li>
                      <li>
                        {" "}
                        <Link to="/benefits" className="">
                          {t("footer.benefits")}
                        </Link>
                      </li>
                      <li>
                        {" "}
                        <Link to="/user/myprofile" className="">
                          {t("footer.postJob")}
                        </Link>
                      </li>
                      <li>
                        {" "}
                        <Link to="/searchjob" className="">
                          {t("footer.findJob")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 col-lg-3">
                  <div className="FooterLinks">
                    <h3>{t("footer.followUs")}</h3>
                    <div className="SocialIcons">
                    <Link to={faceboookLink} target="_blank">
                        <FacebookIcon />
                      </Link>
                      <Link to={instagramLink} target="_blank">
                        <InstagramIcon />
                      </Link>
                      <Link to={pinterestLink} target="_blank">
                        <PinterestIcon />
                      </Link>
                      <Link to={linkedInLink} target="_blank">
                        <LinkedInIcon />
                      </Link>
                    </div>
                    <div className="LangaugeDropdown">
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        value={selectedLanguage}
                        onChange={(e) => handleChangeLanguage(e.target.value)}
                      >
                        {/* <option defaultValue="">Change Language</option> */}
                        <option value="en">English</option>
                        <option value="el">Greek</option>
                        <option value="ukr">Ukrainian</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="footerFooter">
                <hr />
                <p>
                  &copy; Copyright@2024 | <Link to={siteLink} target="_blank">{siteTitle}</Link>{" "}
                  | All Rights Reserved
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Footer;
