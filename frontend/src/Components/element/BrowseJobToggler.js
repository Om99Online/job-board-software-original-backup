import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import { useTranslation } from "react-i18next";

const BrowseJobToggler = (props) => {

  console.log(props.skills,"yaha")
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(false);
  const [toggle4, setToggle4] = useState(false);
  const [byTitle, setByTitle] = useState(props.jobTitle);
  const [byCategory, setByCategory] = useState(props.categoryData);
  const [bySkill, setBySkill] = useState(props.skills);
  const [popularSearch, setPopularSearch] = useState(props.popularSearches);
  const [titleActive, setTitleActive] = useState(true);
  const [skillActive, setSkillActive] = useState(false);
  const [categoryActive, setCategoryActive] = useState(false);
  const [popularSearchActive, setPopularSearchActive] = useState(false);
  const [t, i18n] = useTranslation("global");

  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const response = await axios.get(BaseApi + `/home`, {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       setByTitle(response.data.response.job_title);
  //       setByCategory(response.data.response.categories);
  //       setBySkill(response.data.response.skillList);
  //       setPopularSearch(response.data.response.keywords);
  //       console.log(bySkill);
  //     } catch (error) {
  //       console.log("Cannot get home page data!");
  //     }
  //   };
  //   getData();
  //   window.scrollTo(0, 0);
  // }, []);

  const Title = () => {
    setTitleActive(true);
    setSkillActive(false);
    setCategoryActive(false);
    setPopularSearchActive(false);
    setToggle1(true);
    setToggle2(false);
    setToggle3(false);
    setToggle4(false);
  };
  const Skill = () => {
    setSkillActive(true);
    setTitleActive(false);
    setCategoryActive(false);
    setPopularSearchActive(false);
    setToggle1(false);
    setToggle2(true);
    setToggle3(false);
    setToggle4(false);
  };
  const Category = () => {
    setSkillActive(false);
    setTitleActive(false);
    setCategoryActive(true);
    setPopularSearchActive(false);
    setToggle1(false);
    setToggle2(false);
    setToggle3(true);
    setToggle4(false);
  };
  const popularSearches = () => {
    setSkillActive(false);
    setTitleActive(false);
    setCategoryActive(false);
    setPopularSearchActive(true);
    setToggle1(false);
    setToggle2(false);
    setToggle3(false);
    setToggle4(true);
  };

  const handleClickTitle = (title) => {
    sessionStorage.setItem("keywordTitle", title);
  };

  const handleClick = (id) => {
    sessionStorage.setItem("catId", id);
  };

  return (
    <>
      <div className="buttons BrowseJobstab">
        <button
          onClick={() => Title()}
          className={`btn ${titleActive === true && "active"}`}
        >
          {t("userpage.byTitle")}
        </button>
        <button
          onClick={() => Skill()}
          className={`btn ${skillActive === true && "active"}`}
        >
          {t("userpage.bySkills")}
        </button>
        <button
          onClick={() => Category()}
          className={`btn ${categoryActive === true && "active"}`}
        >
          {t("userpage.byCategory")}
        </button>
        <button
          onClick={() => popularSearches()}
          className={`btn ${popularSearchActive === true && "active"}`}
        >
          {t("userpage.popularSearches")}
        </button>
      </div>
      <div className="BrowseJobstabs toggledata">
        {toggle1 && (
          <div className="first">
            <div className="row">
              {byTitle.map((i) => {
                return (
                  <>
                    <div className="col-md-3 col-lg-3">
                      <Link
                        to={`/jobs/searchjob/${i.slug}`}
                        onClick={() => handleClickTitle(i.title)}
                        className="list"
                      >
                        <p key={i.id}>{i.title}</p>
                      </Link>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        )}
        {toggle2 && (
          <div className="first">
            <div className="row">
              {bySkill.map((i) => {
                return (
                  <>
                    <div className="col-md-3 col-lg-3">
                      <Link to={`/jobs/searchjob/${i.slug}`} className="list">
                        <p key={i.id}>{i.name}</p>
                      </Link>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        )}
        {toggle3 && (
          <div className="first">
            <div className="row">
              {byCategory.map((i) => {
                return (
                  <>
                    <div className="col-md-3 col-lg-3">
                      <Link
                        to="/searchjob"
                        onClick={() => handleClick(i.id)}
                        className="list"
                      >
                        <p key={i.id}>{i.name}</p>
                      </Link>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        )}
        {toggle4 && (
          <div className="first">
            <div className="row">
              {popularSearch.map((i) => {
                return (
                  <>
                    <div className="col-md-3 col-lg-3">
                      <Link to={`/jobs/searchjob/${i.name}`} className="list">
                        <p key={i.id}>{i.name}</p>
                      </Link>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BrowseJobToggler;
