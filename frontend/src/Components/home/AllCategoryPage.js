import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../element/Footer";
import NavBar from "../element/NavBar";
import BaseApi from "../api/BaseApi";
import { useTranslation } from "react-i18next";

const AllCategoryPage = () => {
  const [allCategoryData, setAllCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [t, i18n] = useTranslation("global");

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(BaseApi + "/categories/allcategories");
        setAllCategoryData(response.data.response.categories);
        setLoading(false);
      } catch (error) {
        console.log("Error getting all categories");
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleClick = (id) => {
    sessionStorage.setItem("catId", id);
  };
  return (
    <>
      <NavBar />
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <div className="blogPageSection1 text-center">
            <h1>{t("allCategoryPage.allCategories")}</h1>
            <h6 className="text-muted mt-2">
              {" "}
              <Link to="/" style={{ color: "grey" }}>
                {t("navHeaders.home")}
              </Link>{" "}
              /{t("allCategoryPage.allCategories")}
            </h6>
          </div>
          <div className="allCategorySection2 container">
            <div className="row">
              <div className="">
                <div className="card-body Jcard">
                  <div className="row">
                    {allCategoryData.map((i) => {
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

export default AllCategoryPage;
