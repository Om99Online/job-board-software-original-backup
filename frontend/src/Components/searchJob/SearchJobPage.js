import React, { useEffect, useState } from "react";
import NavBar from "../element/NavBar";
import Footer from "../element/Footer";
import JobCard from "../element/JobCard";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BaseApi from "../api/BaseApi";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const SearchJobPage = () => {
  const { slug } = useParams();
  // const initialKeyword = sessionStorage.getItem("keywordTitle") || "";
  let keyWord = sessionStorage.getItem("keywordTitle");

  const initialKeyword = keyWord || slug || "";

  const initialCategory = sessionStorage.getItem("catId") || "";
  const [filterItem, setFilterItem] = useState({
    keyword: initialKeyword,
    category_id: initialCategory,
    subcategory_id: "",
    location: "",
  });

  const navigate = useNavigate();

  const [searchData, setSearchData] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [searchButton, setSearchButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subCatData, setSubCatData] = useState([]);
  // console.log(initialCategory);
  const [t, i18n] = useTranslation("global");
  const [itemSearched, setItemSearched] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      let response;

      if (initialKeyword) {
        // If a keyword is available in the slug, make the API request with the keyword directly.
        response = await axios.post(BaseApi + "/job/listing", {
          keyword: initialKeyword,
        });
      } else if (initialCategory) {
        fetchJobListingsByCategory();
        response = await axios.post(BaseApi + "/job/listing", {
          category_id: initialCategory,
        });
      } else {
        // If no keyword is available, fetch all job listings.
        response = await axios.post(BaseApi + "/job/listing");
      }

      setCategoryList(response.data.response.category);
      setCategoryData(response.data.response.jobs);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error fetching list of categories");
    }
  };
  const tokenKey = Cookies.get("tokenClient");
  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  const mapKey = Cookies.get("mapKey");

  const [hoverColor, setHoverColor] = useState(false);

  const handleMouseEnter = () => {
    setHoverColor(true);
  };

  const handleMouseLeave = () => {
    setHoverColor(false);
  };

  const [clearColor, setClearColor] = useState(false);

  const handleClearMouseEnter = () => {
    setClearColor(true);
  };

  const handleClearMouseLeave = () => {
    setClearColor(false);
  };

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
    // if(!tokenKey){
    //   navigate("/user/jobseekerlogin");
    // }else{
    getData();
    if (initialCategory) {
      fetchJobListingsByCategory(initialCategory);
    }
    // }
  }, [initialKeyword]);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    // Check if the category_id is being changed
    setFilterItem((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
    if (name === "category_id") {
      // Call the API with the selected category_id
      fetchJobListingsByCategory(value);
    }
    if (filterItem.category_id === "Any Category") {
      // Include the category_id in the API request
      setFilterItem({ ...filterItem, category_id: "" }); // Convert to the desired data type if needed
    }
    console.log(filterItem);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (
      filterItem.keyword === "" &&
      filterItem.category_id === "" &&
      filterItem.location === ""
    ) {
      return;
    }
    sessionStorage.setItem("jobSearched", "1");
    setSearchButton(true);
    setLoading(true);
    try {
      const response = await axios.post(BaseApi + "/job/listing", filterItem);
      setSearchData(response.data.response.jobs);
      setLoading(false);
      console.log("Search filter data sent successfully");
    } catch (error) {
      setLoading(false);
      console.log("Couldn't send the search filter data!");
    }
  };

  const fetchJobListingsByCategory = async (categoryId) => {
    // setLoading(true);
    try {
      const response = await axios.post(
        BaseApi + `/categories/getSubCategory/${categoryId}`
      );
      setSubCatData(response.data.response);
      setLoading(false);
      console.log(subCatData);
    } catch (error) {
      setLoading(false);
      console.log("Couldn't get sub category data at listing page");
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    setSearchButton(false);
    setSearchData([]);
    setSubCatData([]);
    setFilterItem({
      keyword: "",
      category_id: "",
      subcategory_id: "",
      location: "",
    });
  };

  useEffect(() => {
    setTimeout(() => {
      sessionStorage.clear();
    }, 7000);
    window.scrollTo(0, 0);
  }, []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  // Get current jobs to display based on pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = searchButton
    ? searchData.slice(indexOfFirstJob, indexOfLastJob)
    : categoryData.slice(indexOfFirstJob, indexOfLastJob);

  // Function to handle pagination page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const [autocompleteService, setAutocompleteService] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Load Google Maps AutocompleteService after component mounts
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapKey}&libraries=places`;
    script.onload = () => {
      setAutocompleteService(
        new window.google.maps.places.AutocompleteService()
      );
      console.log(autocompleteService);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLocationChange = (e) => {
    const { value } = e.target;
    setSuggestionTaken(false);
    if (value == "") {
      setSuggestionTaken(true);
    }

    setFilterItem((prevFilter) => ({
      ...prevFilter,
      location: value,
    }));

    if (autocompleteService) {
      // Call Google Maps Autocomplete API
      autocompleteService.getPlacePredictions(
        {
          input: value,
          types: ["(cities)"], // Restrict to cities if needed
        },
        (predictions, status) => {
          if (status === "OK" && predictions) {
            setSuggestions(
              predictions.map((prediction) => prediction.description)
            );
          } else {
            setSuggestions([]);
          }
        }
      );
    }
    if (filterItem.location === "") {
      setSuggestions([]);
    }
  };
  const [suggestionTaken, setSuggestionTaken] = useState(false);

  const handleSuggestionClick = (suggestion) => {
    // Update the input value with the clicked suggestion
    handleLocationChange({ target: { name: "location", value: suggestion } });

    setSuggestionTaken(true);
    // Clear the suggestions
    setSuggestions([]);
    console.log(filterItem);
  };

  return (
    <>
      <NavBar />
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <div className="SJPSection1">
            <form>
              <div className="formItems">
                <div className="searchItems me-2">
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    value={filterItem.keyword}
                    name="keyword"
                    placeholder={t("searchJobPage.keyword")}
                    onChange={handleChange}
                  />
                </div>
                <div className="searchItems me-2">
                  <select
                    className="form-select text-muted"
                    aria-label="Default select example"
                    value={filterItem.category_id}
                    name="category_id"
                    onChange={handleChange}
                  >
                    <option value={""}>{t("searchJobPage.anyCategory")}</option>
                    {categoryList.map((i, id) => {
                      return (
                        <option key={i.id} value={i.id}>
                          {i.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="searchItems me-2">
                  <select
                    className="form-select text-muted"
                    aria-label="Default select example"
                    value={filterItem.subcategory_id}
                    name="subcategory_id"
                    onChange={handleChange}
                  >
                    <option value={""}>{t("searchJobPage.subCategory")}</option>
                    {subCatData.map((i, id) => {
                      return (
                        <option key={i.id} value={i.id}>
                          {i.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="searchItems me-2">
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder={t("searchJobPage.enterLocation")}
                    name="location"
                    value={filterItem.location}
                    onChange={handleLocationChange}
                  />
                  {suggestions.length > 0 && (
                    <div
                      className="suggestionsSmall"
                      style={{ display: suggestionTaken ? "none" : "" }}
                    >
                      <ul className="locationDropdown">
                        {suggestions.map((suggestion, index) => (
                          <div key={index} className="suggestion-item">
                            <li
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <div className="eachLocation">
                                <div className="locationIcon">
                                  <LocationOnIcon fontSize="small" />
                                </div>{" "}
                                <div className="locationSuggestion">
                                  {suggestion}
                                </div>
                              </div>
                            </li>
                          </div>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="searchItems me-2 btn searchButtons"
                  onClick={handleClick}
                  style={{
                    backgroundColor: `${
                      secondaryColor &&
                      (hoverColor ? secondaryColor : primaryColor)
                    }`,
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {t("searchJobPage.findJobs")}
                </button>
                <button
                  type="submit"
                  className="searchItems me-2 btn searchButtons"
                  onClick={handleReset}
                  style={{
                    backgroundColor: `${
                      secondaryColor &&
                      (clearColor ? secondaryColor : primaryColor)
                    }`,
                  }}
                  onMouseEnter={handleClearMouseEnter}
                  onMouseLeave={handleClearMouseLeave}
                >
                  {/* {t("searchJobPage.findJobs")} */}
                  {t("searchJobPage.clear")}
                </button>
              </div>
            </form>
          </div>
          <div className="blogPagination">
            <p className="text-muted paginationDetail">
              {t("pagination.NoofRecords")} {indexOfFirstJob + 1}-
              {Math.min(
                indexOfLastJob,
                searchButton ? searchData.length : categoryData.length
              )}{" "}
              of {searchButton ? searchData.length : categoryData.length}
            </p>
            <div className="blogPaginationButtons">
              <button
                className="navButton1 me-2"
                style={{
                  backgroundColor: hoverPrevColor
                    ? secondaryColor
                    : primaryColor,
                  border: hoverPrevColor ? secondaryColor : primaryColor,
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
                  backgroundColor: hoverNextColor
                    ? secondaryColor
                    : primaryColor,
                  border: hoverNextColor ? secondaryColor : primaryColor,
                }}
                onMouseEnter={handleNextEnter}
                onMouseLeave={handleNextLeave}
                disabled={
                  searchButton
                    ? indexOfLastJob >= searchData.length
                    : indexOfLastJob >= categoryData.length
                }
                onClick={() => handlePageChange(currentPage + 1)}
              >
                {t("pagination.Next")}
              </button>
            </div>
          </div>
          <div className="SJPSection2 container">
            <div className="FBitem">
              <div className="row">
                {searchButton ? (
                  currentJobs.length > 0 ? (
                    currentJobs.map((i) => (
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
                          desc={i.description}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-12">
                      <h3 className="text-center">
                        {t("searchJobPage.noJobsTxt1")}{" "}
                      </h3>
                      <h6 className="text-muted text-center mb-5 mt-3">
                        {t("searchJobPage.noJobsTxt2")}
                      </h6>
                    </div>
                  )
                ) : categoryData.length > 0 ? (
                  currentJobs.map((i) => (
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
                        slug={i.slug}
                        cat_slug={i.cat_slug}
                        job_city={i.job_city}
                        desc={i.description}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <h3 className="text-center">
                      {t("searchJobPage.noJobsTxt1")}{" "}
                    </h3>
                    <h6 className="text-muted text-center mb-5 mt-3">
                      {t("searchJobPage.noJobsTxt2")}{" "}
                    </h6>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Pagination */}
          </div>
          <div className="blogPagination">
            <p className="text-muted paginationDetail">
              {t("pagination.NoofRecords")} {indexOfFirstJob + 1}-
              {Math.min(
                indexOfLastJob,
                searchButton ? searchData.length : categoryData.length
              )}{" "}
              of {searchButton ? searchData.length : categoryData.length}
            </p>
            <div className="blogPaginationButtons">
              <button
                className="navButton1 me-2"
                style={{
                  backgroundColor: hoverPrevColor
                    ? secondaryColor
                    : primaryColor,
                  border: hoverPrevColor ? secondaryColor : primaryColor,
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
                  backgroundColor: hoverNextColor
                    ? secondaryColor
                    : primaryColor,
                  border: hoverNextColor ? secondaryColor : primaryColor,
                }}
                onMouseEnter={handleNextEnter}
                onMouseLeave={handleNextLeave}
                disabled={
                  searchButton
                    ? indexOfLastJob >= searchData.length
                    : indexOfLastJob >= categoryData.length
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

export default SearchJobPage;
