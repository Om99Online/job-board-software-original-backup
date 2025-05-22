import React, { useRef } from "react";
import NavBar from "../element/NavBar";
import CategoryCard from "../element/CategoryCard";
import BrowseJobToggler from "../element/BrowseJobToggler";
import JobCard from "../element/JobCard";
import MembershipCard from "../element/MembershipCard";
import Footer from "../element/Footer";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import Marquee from "react-fast-marquee";
import Cookies from "js-cookie";
import Slider from "../element/Slider";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
// import Box from "@mui/material/Box";
// import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

const UserPage = () => {
  const [homePageSloganTxt, setHomePageSloganTxt] = useState();
  const [homePageSloganTitle, setHomePageSloganTitle] = useState();
  const [categoryListing, setCategoryListing] = useState([]);
  const [jobCardData, setJobCardData] = useState([]);
  const [membershipData, setMembershipData] = useState([]);
  const [topEmployer, setTopEmployer] = useState([]);
  const [bannerDetails, setBannerDetails] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [base64Code, setBase64Code] = useState();
  const [announcementDetails, setAnnouncementDetails] = useState([]);
  const [slider, setSlider] = useState([]);
  const [totalPageData, setTotalPageData] = useState([]);
  const [t, i18n] = useTranslation("global");
  const [skills, setSkills] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [job_title, setJob_title] = useState([]);

  const [secondSectionRender, setSecondSectionRender] = useState(false);

  const tokenKey = Cookies.get("tokenClient");
  const userType = Cookies.get("user_type");

  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");

  const [hoverSearchColor, setHoverSearchColor] = useState(false);

  const handleSearchMouseEnter = () => {
    setHoverSearchColor(true);
  };

  const handleSearchMouseLeave = () => {
    setHoverSearchColor(false);
  };

  const [hoverUploadCVColor, setHoverUploadCVColor] = useState(false);

  const handleUploadCVMouseEnter = () => {
    setHoverUploadCVColor(true);
  };

  const handleUploadCVMouseLeave = () => {
    setHoverUploadCVColor(false);
  };

  // Explore all Categories button
  const [hoverExploreCategoriesColor, setHoverExploreCategoriesColor] =
    useState(false);

  const handleExploreCategoriesEnter = () => {
    setHoverExploreCategoriesColor(true);
  };

  const handleExploreCategoriesLeave = () => {
    setHoverExploreCategoriesColor(false);
  };

  // View Job Button
  const [hoverViewJobColor, setHoverViewJobColor] = useState(false);

  const handleViewJobEnter = () => {
    setHoverViewJobColor(true);
  };

  const handleViewJobLeave = () => {
    setHoverViewJobColor(false);
  };

  const getInitialSectionData = async () => {
    try {
      const response = await axios.get(BaseApi + "/homeslider", {
        headers: {
          "Content-Type": "application/json",
          key: ApiKey,
        },
      });
      // setLoading(false);
      setSlider(response.data.response.sliderList);
      setHomePageSloganTxt(response.data.response.site_setting.slogan_text);
      setHomePageSloganTitle(response.data.response.site_setting.slogan_title);
    } catch (error) {
      // setLoading(false);
      console.log("Cannot get home page data!");
    }
  };

  const getData = async () => {
    try {
      setLoading2(true);
      const response = await axios.get(BaseApi + `/home`, {
        headers: {
          "Content-Type": "application/json",
          key: ApiKey,
          token: tokenKey,
        },
      });
      setLoading2(false);
            setTotalPageData(response.data.response);

      setSkills(response.data.response.skillList);
      setCategoryData(response.data.response.categories);
      setPopularSearches(response.data.response.keywords);
      setJob_title(response.data.response.job_title);
      // setHomePageSloganTxt(response.data.response.site_setting.slogan_text);
      // setHomePageSloganTitle(response.data.response.site_setting.slogan_title);
      setCategoryListing(response.data.response.categories_listing);
      setJobCardData(response.data.response.latestJobList);
      setMembershipData(response.data.response.plans_details);
      setTopEmployer(response.data.response.top_employer);
      setBannerDetails(response.data.response.bannerDetails);
      setAnnouncementDetails(response.data.response.announcementList);
      // setSlider(response.data.response.sliderList);

      Cookies.set("fbLink", response.data.response.site_setting.facebook_link);
      Cookies.set(
        "instaLink",
        response.data.response.site_setting.instagram_link
      );
      Cookies.set(
        "linkedInLink",
        response.data.response.site_setting.linkedin_link
      );
      Cookies.set(
        "pinterestLink",
        response.data.response.site_setting.pinterest
      );
      Cookies.set(
        "twitterLink",
        response.data.response.site_setting.twitter_link
      );
      // console.log(jobCardData);
    } catch (error) {
      setLoading2(false);
      console.log("Cannot get home page data!");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight
      ) {
        setSecondSectionRender(true);
        getData();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Check if the selected file is a .doc file
    if (file) {
      if (file.type === "application/msword" || file.name.endsWith(".doc")) {
        // Read the file using FileReader to get Base64 data
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result;
          setSelectedFile(file);
          setBase64Code(base64Data); // Assuming you have a state variable 'base64Code' to store the Base64 data
        };
        reader.readAsDataURL(file);
      } else {
        // Display an error message for file types other than .doc
        alert("Please select a .doc file (Microsoft Word document).");
      }
    }
  };

  useEffect(() => {
    // getData();
    getInitialSectionData();
  }, []);

  const handleEmpUploadCVClick = async () => {
    Swal.fire({
      title:
        "You are logged in as an employer. Please login as a jobseeker to upload your CV.",
      icon: "warning",
      confirmButtonText: "Close",
    });
  };

  return (
    <>
      <NavBar />
      {/* {loading ? (
        <>
          <div className="loader-container"></div>
        </>
      ) : (
        <> */}
      {/* First block of the home page */}

      <div className="sliderbody">
        {slider.length > 0 ? (
          <>
            <div className="">
              <Slider />
              <div className="upperSlider">
                <div className="container">
                  <div className="row">
                    <div className="col-md-10 col-lg-8">
                      <div className="slidertext">
                        <h1>{homePageSloganTitle}</h1>
                        <p>{homePageSloganTxt}</p>
                      </div>
                      <div className="searcharea">
                        <i>
                          <img src="/Images/searchicon.png" alt="" />
                        </i>
                        <div className="inputGrp">
                          <input
                            type="search"
                            className="form-control"
                            placeholder={t("userpage.jobTitleKeyword")}
                            aria-label="Search"
                            aria-describedby="search-addon"
                            value={keyword}
                            name="keyword"
                            onChange={(e) => {
                              setKeyword(e.target.value);
                            }}
                          />
                        </div>
                        {keyword ? (
                          <Link
                            to={`/jobs/searchjob/${keyword}`}
                            type="button"
                            className="btn btn-primary button1"
                            style={{
                              backgroundColor: hoverSearchColor
                                ? secondaryColor
                                : primaryColor,
                              border: hoverSearchColor
                                ? secondaryColor
                                : primaryColor,
                            }}
                            onMouseEnter={handleSearchMouseEnter}
                            onMouseLeave={handleSearchMouseLeave}
                          >
                            {t("userpage.searchButton")}
                          </Link>
                        ) : (
                          <Link
                            to="/searchjob"
                            type="button"
                            className="btn btn-primary button1"
                            style={{
                              backgroundColor: hoverSearchColor
                                ? secondaryColor
                                : primaryColor,
                              border: hoverSearchColor
                                ? secondaryColor
                                : primaryColor,
                            }}
                            onMouseEnter={handleSearchMouseEnter}
                            onMouseLeave={handleSearchMouseLeave}
                          >
                            {t("userpage.searchButton")}
                          </Link>
                        )}

                        {tokenKey && userType === "candidate" && (
                          <Link
                            to="/candidates/addcvdocuments"
                            type="button"
                            className="btn btn-primary uploadCvButton"
                            style={{
                              color: hoverUploadCVColor
                                ? primaryColor
                                : secondaryColor,
                              backgroundColor: "white",
                              border: hoverUploadCVColor
                                ? `2px solid ${primaryColor}`
                                : `2px solid ${secondaryColor}`,
                            }}
                            onMouseEnter={handleUploadCVMouseEnter}
                            onMouseLeave={handleUploadCVMouseLeave}
                          >
                            {t("userpage.uploadCVButton")}
                          </Link>
                        )}
                        {tokenKey && userType === "recruiter" && (
                          <Link
                            to=""
                            type="button"
                            className="btn btn-primary uploadCvButton"
                            style={{
                              color: hoverUploadCVColor
                                ? primaryColor
                                : secondaryColor,
                              backgroundColor: "white",
                              border: hoverUploadCVColor
                                ? `2px solid ${primaryColor}`
                                : `2px solid ${secondaryColor}`,
                            }}
                            onClick={handleEmpUploadCVClick}
                            onMouseEnter={handleUploadCVMouseEnter}
                            onMouseLeave={handleUploadCVMouseLeave}
                          >
                            {t("userpage.uploadCVButton")}
                          </Link>
                        )}
                        {!tokenKey && (
                          <Link
                            to="/user/jobseekerlogin"
                            type="button"
                            className="btn btn-primary uploadCvButton"
                            style={{
                              color: hoverUploadCVColor
                                ? primaryColor
                                : secondaryColor,
                              backgroundColor: "white",
                              border: hoverUploadCVColor
                                ? `2px solid ${primaryColor}`
                                : `2px solid ${secondaryColor}`,
                            }}
                            onMouseEnter={handleUploadCVMouseEnter}
                            onMouseLeave={handleUploadCVMouseLeave}
                          >
                            {t("userpage.uploadCVButton")}
                          </Link>
                        )}

                        {/* <button
                                type="button"
                                onClick={handleFileUpload}
                                className="btn btn-primary uploadCvButton"
                                style={{
                                  color: hoverUploadCVColor
                                    ? primaryColor
                                    : secondaryColor,
                                  backgroundColor: "white",
                                  border: hoverUploadCVColor
                                    ? `2px solid ${primaryColor}`
                                    : `2px solid ${secondaryColor}`,
                                }}
                                onMouseEnter={handleUploadCVMouseEnter}
                                onMouseLeave={handleUploadCVMouseLeave}
                              >
                               {t("userpage.uploadCVButton")} 
                              </button>*/}
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept=".doc"
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />
                      </div>
                      {selectedFile && (
                        <>
                          <div className="mt-3 d-flex">
                            <p className="pt-2">
                              Selected File: {selectedFile.name}
                            </p>
                            {/* You can use the selectedFile here or show additional file information */}
                            <button
                              className="btn btn-outline-dark ms-2"
                              onClick={() => setSelectedFile()}
                            >
                              {t("userpage.deleteButton")}
                            </button>
                          </div>
                        </>
                      )}
                      <div className="slidertext2">
                        <div className="jobs-clients-posted">
                          <h3>{totalPageData.jobscount}</h3>
                          <h6 className="text-muted">
                            {t("userpage.jobsPosted")}
                          </h6>
                        </div>
                        <div className="jobs-clients-posted">
                          <h3>{totalPageData.freelancers}</h3>
                          <h6 className="text-muted">
                            {t("userpage.employers")}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="lowerSlider">
              <div className="container container">
                <div className="row">
                  <div className="col-md-10 col-lg-8">
                    <div className="slidertext">
                      <h1>{homePageSloganTitle}</h1>
                      <p>{homePageSloganTxt}</p>
                    </div>
                    <div className="searcharea">
                      <i>
                        <img src="/Images/searchicon.png" alt="" />
                      </i>
                      <div className="inputGrp">
                        <input
                          type="search"
                          className="form-control"
                          placeholder="Job title or keyword"
                          aria-label="Search"
                          aria-describedby="search-addon"
                          value={keyword}
                          name="keyword"
                          onChange={(e) => {
                            setKeyword(e.target.value);
                          }}
                        />
                      </div>
                      {keyword ? (
                        <Link
                          to={`/jobs/searchjob/${keyword}`}
                          type="button"
                          className="btn btn-primary button1"
                          style={{
                            backgroundColor: hoverSearchColor
                              ? secondaryColor
                              : primaryColor,
                            border: hoverSearchColor
                              ? secondaryColor
                              : primaryColor,
                          }}
                          onMouseEnter={handleSearchMouseEnter}
                          onMouseLeave={handleSearchMouseLeave}
                        >
                          {t("userpage.searchButton")}
                        </Link>
                      ) : (
                        <Link
                          to="/searchjob"
                          type="button"
                          className="btn btn-primary button1"
                          style={{
                            backgroundColor: hoverSearchColor
                              ? secondaryColor
                              : primaryColor,
                            border: hoverSearchColor
                              ? secondaryColor
                              : primaryColor,
                          }}
                          onMouseEnter={handleSearchMouseEnter}
                          onMouseLeave={handleSearchMouseLeave}
                        >
                          {t("userpage.searchButton")}
                        </Link>
                      )}

                      {tokenKey ? (
                        <Link
                          to="/candidates/addcvdocuments"
                          type="button"
                          className="btn btn-primary uploadCvButton"
                          style={{
                            color: hoverUploadCVColor
                              ? primaryColor
                              : secondaryColor,
                            backgroundColor: "white",
                            border: hoverUploadCVColor
                              ? `2px solid ${primaryColor}`
                              : `2px solid ${secondaryColor}`,
                          }}
                          onMouseEnter={handleUploadCVMouseEnter}
                          onMouseLeave={handleUploadCVMouseLeave}
                        >
                          {t("userpage.uploadCVButton")}
                        </Link>
                      ) : (
                        <Link
                          to="/user/jobseekerlogin"
                          type="button"
                          className="btn btn-primary uploadCvButton"
                          style={{
                            color: hoverUploadCVColor
                              ? primaryColor
                              : secondaryColor,
                            backgroundColor: "white",
                            border: hoverUploadCVColor
                              ? `2px solid ${primaryColor}`
                              : `2px solid ${secondaryColor}`,
                          }}
                          onMouseEnter={handleUploadCVMouseEnter}
                          onMouseLeave={handleUploadCVMouseLeave}
                        >
                          {t("userpage.uploadCVButton")}
                        </Link>
                      )}

                      {/* <button
                              type="button"
                              onClick={handleFileUpload}
                              className="btn btn-primary uploadCvButton"
                              style={{
                                color: hoverUploadCVColor
                                  ? primaryColor
                                  : secondaryColor,
                                backgroundColor: "white",
                                border: hoverUploadCVColor
                                  ? `2px solid ${primaryColor}`
                                  : `2px solid ${secondaryColor}`,
                              }}
                              onMouseEnter={handleUploadCVMouseEnter}
                              onMouseLeave={handleUploadCVMouseLeave}
                            >
                              {t("userpage.uploadCVButton")}
                            </button> */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".doc"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                    </div>
                    {selectedFile && (
                      <>
                        <div className="mt-3 d-flex">
                          <p className="pt-2">
                            Selected File: {selectedFile.name}
                          </p>
                          {/* You can use the selectedFile here or show additional file information */}
                          <button
                            className="btn btn-outline-dark ms-2"
                            onClick={() => setSelectedFile()}
                          >
                            {t("userpage.deleteButton")}
                          </button>
                        </div>
                      </>
                    )}
                    <div className="slidertext2">
                      <div className="jobs-clients-posted">
                        <h3>{totalPageData.jobscount}</h3>
                        <h6 className="text-muted">
                          {t("userpage.jobsPosted")}
                        </h6>
                      </div>
                      <div className="jobs-clients-posted">
                        <h3>{totalPageData.freelancers}</h3>
                        <h6 className="text-muted">
                          {t("userpage.employers")}
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div className="BannerImg">
                    <img
                      className="layer"
                      data-speed="-20"
                      src="/Images/banner-img.png"
                      alt=""
                    />
                    <div className="BannerImg1 layer" data-speed="-8">
                      <img src="/Images/banner-userimg1.png" alt="" />
                    </div>
                    <div className="BannerImg3 layer" data-speed="8">
                      <img src="/Images/bannerimg1.png" alt="" />
                    </div>
                    <div className="BannerImg4 layer" data-speed="10">
                      <img src="/Images/bannerimg2.png" alt="" />
                    </div>
                    <div className="BannerImg2 layer" data-speed="-5">
                      <img src="/Images/banner-userimg2.png" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <section className="infoSection">
        <div className="CategorySection">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-4 col-lg-4">
                <Link to="/user/register/jobseeker">
                  <div className="CategoryBx">
                    <img src="/Images/CreateAnAccount.jpg" alt="" />
                    <h5 className="">{t("userpage.createAnAcount")}</h5>
                    <p>{t("userpage.belowTxt1")}</p>
                  </div>
                </Link>
              </div>
              <div className="col-xs-12 col-md-4 col-lg-4">
                <Link to="/searchjob">
                  <div className="CategoryBx">
                    <img src="/Images/SearchDesiredJob.jpg" alt="" />
                    <h5 className="">{t("userpage.searchDesiredJob")}</h5>
                    <p>{t("userpage.belowTxt2")}</p>
                  </div>
                </Link>
              </div>
              <div className="col-xs-12 col-md-4 col-lg-4">
                <Link to="/user/jobseekerlogin">
                  <div className="CategoryBx">
                    <img src="/Images/SendYourResume.jpg" alt="" />
                    <h5 className="">{t("userpage.sendResume")}</h5>
                    <p>{t("userpage.belowTxt3")}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {secondSectionRender && (
        <>
          {loading2 && (
            <>
              {/* <div className="container">
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Skeleton
                        sx={{ flex: 1, height: 300 }}
                        animation="wave"
                      />
                      <Skeleton
                        sx={{ flex: 1, height: 300 }}
                        animation="wave"
                      />
                      <Skeleton
                        sx={{ flex: 1, height: 300 }}
                        animation="wave"
                      />
                    </Box>
                  </div>
                  <div className="container">
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Skeleton
                        sx={{ flex: 1, height: 300 }}
                        animation="wave"
                      />
                      <Skeleton
                        sx={{ flex: 1, height: 300 }}
                        animation="wave"
                      />
                      <Skeleton
                        sx={{ flex: 1, height: 300 }}
                        animation="wave"
                      />
                    </Box>
                  </div> */}
              <div className="container">
                <Stack spacing={2} direction="row" alignItems="center" sx={{ justifyContent: "center" }}>
                 
                  <CircularProgress size="5rem" />
                </Stack>
              </div>
            </>
          )}
          {/* Second block of the home page */}
          <section className="CategorySection">
            <div className="container">
              {/* <div className="row">
                    <div className="col-xs-12 col-md-4 col-lg-4">
                      <Link to="/user/register/jobseeker">
                        <div className="CategoryBx">
                          <img src="/Images/CreateAnAccount.jpg" alt="" />
                          <h5 className="">{t("userpage.createAnAcount")}</h5>
                          <p>{t("userpage.belowTxt1")}</p>
                        </div>
                      </Link>
                    </div>
                    <div className="col-xs-12 col-md-4 col-lg-4">
                      <Link to="/searchjob">
                        <div className="CategoryBx">
                          <img src="/Images/SearchDesiredJob.jpg" alt="" />
                          <h5 className="">{t("userpage.searchDesiredJob")}</h5>
                          <p>{t("userpage.belowTxt2")}</p>
                        </div>
                      </Link>
                    </div>
                    <div className="col-xs-12 col-md-4 col-lg-4">
                      <Link to="/user/jobseekerlogin">
                        <div className="CategoryBx">
                          <img src="/Images/SendYourResume.jpg" alt="" />
                          <h5 className="">{t("userpage.sendResume")}</h5>
                          <p>{t("userpage.belowTxt3")}</p>
                        </div>
                      </Link>
                    </div>
                  </div> */}
              {categoryListing != "" && (
                <>
                  <div className="subsecondblock">
                    <div className="LeftDotImg">
                      <img src="/Images/dotimg.png" alt="" />
                    </div>
                    <div className="RightDotImg">
                      <img src="/Images/dotimg.png" alt="" />
                    </div>
                    <h3 className="subsecondblockHeading">
                      {t("userpage.explore")}
                      <span className="textGradient">
                        {" "}
                        <span className="SubHaddingTxt">
                          {t("userpage.categories")}{" "}
                        </span>
                      </span>
                    </h3>

                    <div className="ExploreCategory">
                      <div className="row">
                        {categoryListing.map((i) => {
                          return (
                            <>
                              <div className="col-md-6 col-lg-3 HomeCategorysCardBx">
                                <CategoryCard
                                  title={i.name}
                                  image1="/Images/Back-1.png"
                                  image2={i.image}
                                  footer={i.sub_cat}
                                  slug={i.slug}
                                  id={i.id}
                                />
                              </div>
                            </>
                          );
                        })}
                      </div>
                      <Link
                        to="/allcategory"
                        type="button"
                        className="btn btn-primary button1"
                        style={{
                          backgroundColor: hoverExploreCategoriesColor
                            ? secondaryColor
                            : primaryColor,
                          border: hoverExploreCategoriesColor
                            ? secondaryColor
                            : primaryColor,
                        }}
                        onMouseEnter={handleExploreCategoriesEnter}
                        onMouseLeave={handleExploreCategoriesLeave}
                      >
                        {t("userpage.exploreAllCategories")}
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* third block of the home page */}
          {skills.length > 0 && (
            <div className="thirdBlock">
              <div className="container">
                <div className="thirdBlockData">
                  <h3 className="BrowseJobsHadding">
                    {t("userpage.browseJobs")}
                  </h3>
                  <BrowseJobToggler
                    skills={skills}
                    categoryData={categoryData}
                    popularSearches={popularSearches}
                    jobTitle={job_title}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Fourth block of the home page */}
          {jobCardData != "" && (
            <>
              <section className="FeaturedJobsSection">
                <div className="container fourthBlock text-center">
                  <h3 className="subsecondblockHeading">
                    {t("userpage.featured")}
                    <span className="textGradient">
                      {" "}
                      <span className="SubHaddingTxt">
                        {t("userpage.jobs")}
                      </span>
                    </span>
                  </h3>
                  <div className="FBitem">
                    <div className="row">
                      {jobCardData.slice(0, 6).map((i) => {
                        return (
                          <>
                            <div className="col-md-6 col-lg-4">
                              <JobCard
                                title={i.title}
                                min_salary={i.min_salary}
                                max_salary={i.max_salary}
                                min_exp={i.min_exp}
                                created={i.created}
                                logo={i.logo}
                                company_name={i.company_name}
                                work_type={i.work_type}
                                job_city={i.job_city}
                                slug={i.slug}
                                cat_slug={i.cat_slug}
                                desc={i.brief_abtcomp}
                              />
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                  <Link to="/searchjob">
                    <button
                      className="btn btn-primary"
                      style={{
                        backgroundColor: hoverViewJobColor
                          ? secondaryColor
                          : primaryColor,
                        border: hoverViewJobColor
                          ? secondaryColor
                          : primaryColor,
                      }}
                      onMouseEnter={handleViewJobEnter}
                      onMouseLeave={handleViewJobLeave}
                    >
                      {t("userpage.viewAllJobsButton")}
                    </button>
                  </Link>
                </div>
              </section>
            </>
          )}

          {/* Fifth block of the home page */}
          {membershipData != "" && (
            <>
              <section className="MembershipSection">
                <div className="container text-center">
                  <h3 className="subsecondblockHeading">
                    {t("userpage.membership")}
                    <span className="textGradient">
                      {" "}
                      <span className="SubHaddingTxt">
                        {t("userpage.plan")}
                      </span>{" "}
                    </span>
                  </h3>
                  <div className="MembershipMainBx">
                    <MembershipCard />
                  </div>
                </div>
              </section>
            </>
          )}
          {topEmployer != "" && (
            <>
              <section className="TopEmployersSection">
                <div className="container text-center">
                  <h3 className="subsecondblockHeading">
                    {t("userpage.top")}
                    <span className="textGradient">
                      {" "}
                      <span className="SubHaddingTxt">
                        {t("userpage.employer")}
                      </span>{" "}
                    </span>
                  </h3>
                  <div className="TopEmployersBx">
                    <div className="row m-0">
                      {topEmployer.map((i) => {
                        return (
                          <>
                            <div className="col-xs-12 col-md-3 col-lg-3 p-0 TopEmployersBxCardBx">
                              <div className="EmployersLogoBx BorderRight BorderBottom">
                                <Link to={`/companyprofile/${i.slug}`}>
                                  <img
                                    className="employersLogo"
                                    src={i.profile_image}
                                    alt=""
                                  />
                                </Link>
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* {totalPageData && (
            <> */}
              {/* Sixth block of the home page */}

              <div className="sixthBlock">
                <section className="DownloadAppSection">
                  <div className="container">
                    <div className="row">
                      <div className="col-xs-12 col-md-6 col-lg-6">
                        <div className="section1text ">
                          <h2 className="">{t("userpage.downloadApp")}</h2>
                          <h3>{t("userpage.belowTxt4")}</h3>

                          <div className="section1button">
                            <Link
                              to="https://play.google.com/store/apps/details?id=ls.lsjobseeker"
                              target="_blank"
                            >
                              <img
                                className=""
                                src="/Images/googlePlayButtton.png"
                                alt=""
                              />
                            </Link>
                            <Link
                              to="https://apps.apple.com/us/app/ls-job-seeker-candidate/id1403773426?ls=1"
                              target="_blank"
                            >
                              <img
                                className=""
                                src="/Images/appleStoreButton.png"
                                alt=""
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-xs-12 col-md-6 col-lg-6">
                        <div className="DownloadRightImg">
                          <img
                            className="phoneImage"
                            src="/Images/Phone.png"
                            alt=""
                          />
                          <img
                            className="girlImage"
                            src="/Images/girl.png"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                {bannerDetails.length > 0  && (
                  <>
                    <div className="section2">
                      <div className="row">
                        {bannerDetails.map((i) => {
                          return (
                            <>
                              <div className="col-md-6 col-sm-12">
                                <Link to={i.url}>
                                  <img
                                    className="flexImage"
                                    src={i.image}
                                    alt=""
                                  />
                                </Link>
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            {/* </>
          )} */}
          {announcementDetails != "" && (
            <Marquee
              className="marqueeText"
              pauseOnHover={true}
              style={{
                backgroundColor: primaryColor,
              }}
            >
              {announcementDetails.map((i) => {
                return (
                  <Link to={i.url} className="marqueeLink" target="_blank">
                    | {i.name + " "} |
                  </Link>
                );
              })}
            </Marquee>
          )}

          <Footer />
        </>
      )}
      {/* </>
      )} */}
    </>
  );
};

export default UserPage;
document.addEventListener("mousemove", parallax);

function parallax(e) {
  this.querySelectorAll(".layer").forEach((layer) => {
    let speed = layer.getAttribute("data-speed");
    let x = (window.innerWidth - e.pageX * speed) / 900;
    let y = (window.innerWidth - e.pageY * speed) / 900;
    layer.style.transform = `translate(${x}px, ${y}px)`;
  });
}
