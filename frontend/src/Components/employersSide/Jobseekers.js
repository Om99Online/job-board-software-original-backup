import React from "react";
import Select from "react-select";
import Footer from "../element/Footer";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NavBar from "../element/NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import HTMLReactParser from "html-react-parser";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useTranslation } from "react-i18next";

const Jobseekers = () => {
  const [filterItem, setFilterItem] = useState({
    keyword: "",
    location: "",
    skills: "",
    total_exp: "",
    exp_salary: "",
  });
  const [loading, setLoading] = useState(false);
  const [listingData, setListingData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);
  const [skillList, setSkillList] = useState([]);
  // const [locationData, setLocationData] = useState([]);
  const [searchButton, setSearchButton] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [t, i18n] = useTranslation("global");
  const [selectedSkills, setSelectedSkills] = useState([]);

  const { slug } = useParams();
  const tokenKey = Cookies.get("tokenClient");
  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  const mapKey = Cookies.get("mapKey");

  const navigate = useNavigate();

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

  ///////////////////////
  const [hoverPaginationBtn1Color, setHoverPaginationBtn1Color] =
    useState(false);

  const handlePagination1MouseEnter = () => {
    setHoverPaginationBtn1Color(true);
  };

  const handlePagination1MouseLeave = () => {
    setHoverPaginationBtn1Color(false);
  };

  const [hoverPaginationBtn2Color, setPaginationBtn2Color] = useState(false);

  const handlePagination2MouseEnter = () => {
    setPaginationBtn2Color(true);
  };

  const handlePagination2MouseLeave = () => {
    setPaginationBtn2Color(false);
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(BaseApi + "/candidates/listing", null, {
        headers: {
          "Content-Type": "application/json",
          key: ApiKey,
          token: tokenKey,
        },
      });
      setLoading(false);
      setListingData(response.data.response.candidates);
      setSkillList(response.data.response.skills);
      setExperienceData(response.data.response.experience);
      setSalaryData(response.data.response.salary);
      // const storedSkills = sessionStorage.getItem("selectedSkills");
      // console.log(storedSkills);
      // if (storedSkills) {
      //   setSelectedSkills(JSON.parse(storedSkills));
      // }
      // console.log(selectedSkills,"skills")
    } catch (error) {
      setLoading(false);
      console.log("Could not get user data in profile page of favourite list");
    }
  };
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    // Check if the category_id is being changed
    setFilterItem((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));

    console.log(filterItem);
  };
  const handleClick = async (e) => {
    var interest_skills = document.getElementsByName("skill");
    if(filterItem.keyword === "" && filterItem.exp_salary === "" && filterItem.location === "" && filterItem.total_exp === "" && selectedSkills === null){
      return;
    }
    // Reset currentPage to 1
    setCurrentPage(1);
    

    var skillArray = [];

    interest_skills.forEach((element) => {
      skillArray.push(element.value);
    });
    // console.log(skillArray);
    const updatedData = {
      ...filterItem,
      skill: skillArray,
    };

    

    // Storing selected skills in session storage
    sessionStorage.setItem("selectedSkills", JSON.stringify(skillArray));

    e.preventDefault();
    setSearchButton(true);
    setLoading(true);
    try {
      const response = await axios.post(
        BaseApi + "/candidates/listing",
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            token: tokenKey,
          },
        }
      );
      setSearchData(response.data.response.candidates);
      setLoading(false);
      console.log("Search filter data sent successfully");
    } catch (error) {
      setLoading(false);
      console.log("Couldn't send the search filter data!");
    }
  };

  function checkSkills(skills) {
    if (skills && Object.keys(skills).length > 0) {
      // If skills are present and not empty, return them
      return Object.entries(skills).map(([key, value]) => (
        <div key={key}>{value}</div>
      ));
    } else {
      // If skills are not present or empty, return "N/A"
      return <div>N/A</div>;
    }
  }

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  // Get current jobs to display based on pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentData = searchButton
    ? searchData.slice(indexOfFirstJob, indexOfLastJob)
    : listingData.slice(indexOfFirstJob, indexOfLastJob);

  // Function to handle pagination page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    // Check if tokenKey is not present
    if (!tokenKey) {
      // Redirect to the home page
      navigate("/user/employerlogin");
    } else {
      // TokenKey is present, fetch data or perform other actions
      getData();
      window.scrollTo(0, 0);
    }
  }, [tokenKey, navigate]);

  const handleReset = () => {
    setSearchButton(false);
    getData();
    // Clear sessionStorage
    sessionStorage.removeItem("selectedSkills");

    // Clear filterItem state
    setFilterItem({
      keyword: "",
      location: "",
      total_exp: "",
      exp_salary: "",
    });

    // Clear selectedSkills state
    setSelectedSkills([]);

    // Reset currentPage to 1
    setCurrentPage(1);

    // Clear input values using DOM manipulation
    const keywordInput = document.getElementById("formKeyword");
    const locationInput = document.getElementById("formLocation");
    const experienceInput = document.getElementById("formExperience");
    const salaryInput = document.getElementById("formSalary");
    if (keywordInput) keywordInput.value = "";
    if (locationInput) locationInput.value = "";
    if (experienceInput) experienceInput.value = "";
    if (salaryInput) salaryInput.value = "";

    // getData();
  };

  // location code

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

  useEffect(() => {
    const storedSkills = sessionStorage.getItem("selectedSkills");
    if (storedSkills) {
      setSelectedSkills(JSON.parse(storedSkills));
    }
  }, []);

  // Function to handle change in selected skills
  const handleSkillChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions);
  };

  const handleUserProfile = async (slug) => {
    sessionStorage.removeItem("selectedSkills");
    navigate(`/candidates/profile/${slug}`);
  };

  return (
    <>
      <NavBar />
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <div className="privacyPolicy jobseekerListing">
            <div className="text-center PPSection1">
              <h1 className="">{t("jobseekerListing.jobseekers")}</h1>
              <h6 className="text-muted fw-normal">
                {" "}
                <Link to="/" style={{ color: "grey" }}>
                  {t("navHeaders.home")}
                </Link>{" "}
                /{t("jobseekerListing.jobseekers")}
              </h6>
            </div>
            <div className="jobseekerLowerPart container">
              <div className="row">
                <div className="col-md-3">
                  <div className="cardHead">
                    <p>{t("jobseekerListing.jobseekerSearch")}</p>
                  </div>
                  <div className="cardBody">
                    <form className="jobseekerListingForm">
                      <div className="mb-2 mt-2">
                        <div class="mb-3">
                          <input
                            type="text"
                            id="formKeyword"
                            className="form-control"
                            name="keyword"
                            placeholder={t("jobseekerListing.keyword")}
                            value={filterItem.keyword}
                            onChange={handleChange}
                          />
                        </div>

                        <div class="mb-3 position-relative">
                          <input
                            type="text"
                            id="formLocation"
                            className="form-control"
                            name="location"
                            value={filterItem.location}
                            placeholder={t("jobseekerListing.location")}
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
                                      onClick={() =>
                                        handleSuggestionClick(suggestion)
                                      }
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
                        <div class="mb-3">
                          <Select
                            // defaultValue={[colourOptions[2], colouptions[3]]}
                            isMulti
                            isSearchable
                            name="skill"
                            options={skillList.map((i) => ({
                              value: i.name,
                              label: i.name,
                            }))}
                            className="basic-multi-select jobseekerListingSelect"
                            classNamePrefix="select"
                            placeholder={t("jobseekerListing.selectSkills")}
                            value={selectedSkills} // Set selected skills here
                            onChange={handleSkillChange} // Handle skill change event
                          />
                        </div>
                        <div class="mb-3">
                          <select
                            id="formExperience"
                            className="form-select"
                            aria-label="Default select example"
                            name="total_exp"
                            value={filterItem.total_exp}
                            onChange={handleChange}
                          >
                            <option selected value="">
                              {t("jobseekerListing.chooseExp")}
                            </option>
                            {experienceData.map((i) => {
                              return (
                                <option key={i.id} value={i.id}>
                                  {i.val}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div class="mb-3">
                          <select
                            id="formSalary"
                            className="form-select"
                            aria-label="Default select example"
                            name="exp_salary"
                            value={filterItem.exp_salary}
                            onChange={handleChange}
                          >
                            <option selected value="">
                              {t("jobseekerListing.chooseSalary")}
                            </option>
                            {salaryData.map((i) => {
                              return (
                                <option key={i.id} value={i.id}>
                                  {i.val}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <button
                          type="button"
                          className="btn btn-primary button1"
                          onClick={handleClick}
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
                          {t("jobseekerListing.searchButton")}
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary button1"
                          onClick={() => handleReset()}
                          style={{
                            backgroundColor: hoverUploadCVColor
                              ? primaryColor
                              : secondaryColor,

                            border: hoverSearchColor
                              ? primaryColor
                              : secondaryColor,
                          }}
                          onMouseEnter={handleUploadCVMouseEnter}
                          onMouseLeave={handleUploadCVMouseLeave}
                        >
                          {t("jobseekerListing.resetButton")}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                {loading ? (
                  <div className="loader-container"></div>
                ) : (
                  <>
                    <div className="col-md-9">
                      <table class="table">
                        <thead>
                          <tr>
                            <th>{t("jobseekerListing.name")}</th>
                            <th>{t("jobseekerListing.skills")}</th>
                            <th>{t("jobseekerListing.location")}</th>
                            <th>{t("jobseekerListing.preferredlocation")}</th>
                            <th>{t("jobseekerListing.experience")}</th>
                            <th>{t("jobseekerListing.salary")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchButton ? (
                            currentData.length > 0 ? (
                              currentData.map((i) => {
                                return (
                                  <>
                                    <tr>
                                      <td>
                                        {/* <Link
                                          to={`/candidates/profile/${i.slug}`}
                                          style={{
                                            color: secondaryColor,
                                          }}
                                          
                                        > */}
                                        <p
                                          style={{
                                            color: secondaryColor,
                                            cursor: "pointer",
                                          }}
                                          onClick={() =>
                                            handleUserProfile(i.slug)
                                          }
                                        >
                                          {i.first_name} {i.last_name}
                                        </p>
                                        {/* </Link> */}
                                      </td>
                                      <td>
                                        {checkSkills(i.skills)}
                                        {/* {Object.entries(i.skills).map(([key, value]) => {
                                  return { value };
                                })}  */}
                                      </td>
                                      <td>
                                        {i.location != null
                                          ? i.location
                                          : t("jobseekerListing.notAvailable")}
                                      </td>
                                      <td>
                                        {i.pre_location != null
                                          ? i.pre_location
                                          : t("jobseekerListing.notAvailable")}
                                      </td>
                                      <td>
                                        {i.total_exp != ""
                                          ? i.total_exp
                                          : t("jobseekerListing.notAvailable")}
                                      </td>
                                      <td>
                                        {i.exp_salary != null
                                          ? i.exp_salary
                                          : t("jobseekerListing.notAvailable")}
                                      </td>
                                    </tr>{" "}
                                  </>
                                );
                              })
                            ) : (
                              <tr className="col-12">
                                <td colSpan={6}>
                                  <div className="jobseekersListingNoData">
                                    <h3 className="text-center">
                                      {t("jobseekerListing.belowTxt1")}
                                    </h3>
                                    <h6 className="text-muted text-center mb-5 mt-3">
                                      {t("jobseekerListing.belowTxt2")}
                                    </h6>
                                  </div>
                                </td>
                              </tr>
                            )
                          ) : listingData.length > 0 ? (
                            currentData.map((i) => {
                              return (
                                <>
                                  <tr>
                                    <td>
                                      <p
                                        style={{
                                          color: secondaryColor,
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleUserProfile(i.slug)
                                        }
                                      >
                                        {i.first_name} {i.last_name}
                                      </p>
                                    </td>
                                    <td>
                                      {checkSkills(i.skills)}
                                      {/* {Object.entries(i.skills).map(([key, value]) => {
                                return { value };
                              })}  */}
                                    </td>
                                    <td>
                                      {i.location != null
                                        ? i.location
                                        : t("jobseekerListing.notAvailable")}
                                    </td>
                                    <td>
                                      {i.pre_location != null
                                        ? i.pre_location
                                        : t("jobseekerListing.notAvailable")}
                                    </td>
                                    <td>
                                      {i.total_exp != ""
                                        ? i.total_exp
                                        : t("jobseekerListing.notAvailable")}
                                    </td>
                                    <td>
                                      {i.exp_salary != null
                                        ? i.exp_salary
                                        : t("jobseekerListing.notAvailable")}
                                    </td>
                                  </tr>{" "}
                                </>
                              );
                            })
                          ) : (
                            <tr className="col-12">
                              <td colSpan={6}>
                                <div className="jobseekersListingNoData">
                                  <h3 className="text-center">
                                    {t("jobseekerListing.belowTxt1")}
                                  </h3>
                                  <h6 className="text-muted text-center mb-5 mt-3">
                                    {t("jobseekerListing.belowTxt2")}
                                  </h6>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {/* Custom Pagination */}
                    {/* <div className="blogPagination">
                      <p className="text-muted paginationDetail">
                        {t("pagination.NoofRecords")}{" "}
                        {listingData.length > 0
                          ? indexOfFirstJob + 1
                          : indexOfFirstJob}
                        -
                        {Math.min(
                          indexOfLastJob,
                          searchButton ? searchData.length : listingData.length
                        )}{" "}
                        of{" "}
                        {searchButton ? searchData.length : listingData.length}
                      </p>
                      <div className="blogPaginationButtons">
                        <button
                          className="navButton1"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                          style={{
                            backgroundColor: hoverPaginationBtn1Color
                              ? secondaryColor
                              : primaryColor,
                            border: hoverPaginationBtn1Color
                              ? secondaryColor
                              : primaryColor,
                          }}
                          onMouseEnter={handlePagination1MouseEnter}
                          onMouseLeave={handlePagination1MouseLeave}
                        >
                          {t("pagination.Prev")}
                        </button>
                        <button
                          className="navButton1"
                          disabled={
                            searchButton
                              ? indexOfLastJob >= searchData.length
                              : indexOfLastJob >= listingData.length
                          }
                          onClick={() => handlePageChange(currentPage + 1)}
                          style={{
                            backgroundColor: hoverPaginationBtn2Color
                              ? secondaryColor
                              : primaryColor,
                            border: hoverPaginationBtn2Color
                              ? secondaryColor
                              : primaryColor,
                          }}
                          onMouseEnter={handlePagination2MouseEnter}
                          onMouseLeave={handlePagination2MouseLeave}
                        >
                          {t("pagination.Next")}
                        </button>
                      </div>
                    </div> */}

                    <div className="blogPagination">
                      <p className="text-muted paginationDetail">
                        {t("pagination.NoofRecords")}{" "}
                        {searchButton
                          ? searchData.length > 0
                            ? indexOfFirstJob + 1
                            : 0
                          : listingData.length > 0
                          ? indexOfFirstJob + 1
                          : 0}
                        -
                        {/* {listingData.length > 0 ? indexOfFirstJob + 1 : 0}- */}
                        {Math.min(
                          indexOfLastJob,
                          searchButton ? searchData.length : listingData.length
                        )}{" "}
                        of{" "}
                        {searchButton ? searchData.length : listingData.length}
                      </p>
                      <div className="blogPaginationButtons">
                        <button
                          className="navButton1"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                          style={{
                            backgroundColor: hoverPaginationBtn1Color
                              ? secondaryColor
                              : primaryColor,
                            border: hoverPaginationBtn1Color
                              ? secondaryColor
                              : primaryColor,
                          }}
                          onMouseEnter={handlePagination1MouseEnter}
                          onMouseLeave={handlePagination1MouseLeave}
                        >
                          {t("pagination.Prev")}
                        </button>
                        <button
                          className="navButton1"
                          disabled={
                            searchButton
                              ? indexOfLastJob >= searchData.length
                              : indexOfLastJob >= listingData.length
                          }
                          onClick={() => handlePageChange(currentPage + 1)}
                          style={{
                            backgroundColor: hoverPaginationBtn2Color
                              ? secondaryColor
                              : primaryColor,
                            border: hoverPaginationBtn2Color
                              ? secondaryColor
                              : primaryColor,
                          }}
                          onMouseEnter={handlePagination2MouseEnter}
                          onMouseLeave={handlePagination2MouseLeave}
                        >
                          {t("pagination.Next")}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default Jobseekers;
