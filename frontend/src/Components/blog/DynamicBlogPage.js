import React, { useEffect, useState } from "react";
import NavBar from "../element/NavBar";
import Footer from "../element/Footer";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import HTMLReactParser from "html-react-parser";
import BaseApi from "../api/BaseApi";
import { useTranslation } from "react-i18next";

const DynamicBlogPage = () => {
  const { slug } = useParams();
  const slugData = slug;
  const [dynamicBlogData, setdynamicBlogData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [t, i18n] = useTranslation("global");

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(BaseApi + `/blog/${slugData}`);
      setdynamicBlogData(response.data.response.Blog);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error getting blog data");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <NavBar />
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <div className="dynamicBlogPage">
            <div className="DBPSection1 text-center">
              <h1>
                {dynamicBlogData.title
                  ? HTMLReactParser(dynamicBlogData.title)
                  : ""}
              </h1>
              <h6 className="text-muted fw-normal">
                {" "}
                <Link to="/" style={{ color: "grey" }}>
                  {t("navHeaders.home")}
                </Link>
                /
                <Link to="/blog" style={{ color: "grey" }}>
                  {t("blogPage.blog")}
                </Link>
              </h6>
            </div>
            <div className="container DBPSection2">
              <div className="">
                <div className="text-center">
                  {dynamicBlogData.image ? (
                    <img
                      className=""
                      src={dynamicBlogData.image}
                      alt="This is a relevant visual of post"
                    />
                  ) : (
                    <img
                      className=""
                      src="https://mdbootstrap.com/img/Mockups/Lightbox/Thumbnail/img%20(67).webp"
                      alt="This is a relevant visual of post"
                    />
                  )}
                </div>
                <div className="text-left pb-0">
                  <h5 className="blue-text pb-2">
                    <p>
                      {t("blogPage.posted")}: {dynamicBlogData.created}
                    </p>
                  </h5>
                  <hr />
                  <p className="text-justify card-text ">
                    {dynamicBlogData.description
                      ? HTMLReactParser(dynamicBlogData.description)
                      : ""}
                  </p>
                  <div className="text-muted text-center mt-4"></div>
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

export default DynamicBlogPage;
