import React, { useEffect, useState } from "react";
import NavBar from "../element/NavBar";
import Footer from "../element/Footer";
import BlogCard from "./BlogCard";
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import BaseApi from "../api/BaseApi";
import { useTranslation } from "react-i18next";



const BlogPage = () => {
  const [cardData, setcardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [t, i18n] = useTranslation("global")


  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");

  const [hoverPrevColor, setHoverPrevColor] = useState(false);
  const [hoverNextColor, setHoverNextColor] = useState(false);


  const handlePrevEnter = () => {
    setHoverPrevColor(true);
    // console.log(hoverColor)
  };

  const handlePrevLeave = () => {
    setHoverPrevColor(false);
  };
  const handleNextEnter = () => {
    setHoverNextColor(true);
    // console.log(hoverColor)
  };

  const handleNextLeave = () => {
    setHoverNextColor(false);
  };

  useEffect(() => {
    const getCardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          BaseApi + "/blog"
        );
        setcardData(response.data.response.Blog);
        // setcardImage(response.data.response.DISPLAY_FULL_BLOG_PATH);
        setLoading(false);
      } catch (error) {
        console.log("Error getting blog data");
        setLoading(false);
      }
    };
    getCardData();
  
  }, []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Get current jobs to display based on pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = cardData
    ? cardData.slice(indexOfFirstPost, indexOfLastPost)
    : cardData.slice(indexOfFirstPost, indexOfLastPost);

  // Function to handle pagination page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <NavBar />
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <div className="blogPageSection1 text-center">
            <h1>{t("blogPage.blog")}</h1>
            <h6 className="text-muted fw-normal">
              {" "}
              <Link to="/" style={{ color: "grey" }}>
              {t("navHeaders.home")}
              </Link>{" "}
              /{t("blogPage.blog")}
            </h6>
          </div>
          <div className="blogPageSection2 container">
            <div className="row">
              {currentPosts.map((i, index) => {
                return (
                  <div className="col-lg-4 col-md-6 mb-5" key={index}>
                    <BlogCard
                      id={i.id}
                      title={i.title}
                      tag={i.tag}
                      image={i.image}
                      description={i.description}
                      slug={i.slug}
                      status={i.status}
                      meta_title={i.meta_title}
                      meta_keyword={i.meta_keyword}
                      meta_description={i.meta_description}
                      created={i.created}
                      primaryColor={primaryColor}
                      secondaryColor={secondaryColor}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Pagination */}
          <div className="blogPagination">
            <p className="text-muted paginationDetail">
            {t("pagination.NoofRecords")} {indexOfFirstPost + 1}-
              {Math.min(indexOfLastPost, cardData.length)} of{" "}
              {cardData ? cardData.length : cardData.length}
            </p>
            <div className="blogPaginationButtons">
              <button
                className="navButton1"
                style={{
                  backgroundColor: hoverPrevColor ? secondaryColor : primaryColor,
                  border: hoverPrevColor ? secondaryColor : primaryColor
                }}
                onMouseEnter={handlePrevEnter}
                onMouseLeave={handlePrevLeave}
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                {t("pagination.Prev")}
              </button>
              <button
                className="navButton1"
                style={{
                  backgroundColor: hoverNextColor ? secondaryColor : primaryColor,
                  border: hoverNextColor ? secondaryColor : primaryColor
                }}
                onMouseEnter={handleNextEnter}
                onMouseLeave={handleNextLeave}
                disabled={
                  cardData
                    ? indexOfLastPost >= cardData.length
                    : indexOfLastPost >= cardData.length
                }
                onClick={() => handlePageChange(currentPage + 1)}
              >
                {t("pagination.Next")}
              </button>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default BlogPage;
