import React, { useEffect, useState } from "react";
import APNavBar from "../Elements/APNavBar";
import APSidebar from "../APSidebar/APSidebar";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axios from "axios";
import BaseApi from "../../api/BaseApi";
import ApiKey from "../../api/ApiKey";
// import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import APFooter from "../Elements/APFooter";

const APAppliedJobsList = () => {
  const [userData, setUserData] = useState([]);
  const [currentLogo, setCurrentLogo] = useState([]);
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");
  const [listData, setListData] = useState([]);
  const itemsPerPage = 20;
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [candidates, setCandidates] = useState([]);

  const navigate = useNavigate();

  const { slug } = useParams();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/admin/candidates/applied/${slug}`,
        null, // Pass null as the request body if not required
        {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            token: tokenKey,
            adminid: adminID,
          },
        }
      );
      setLoading(false);
      setCandidates(response.data.response.candidates);
      setUserData(response.data.response);
      setListData(response.data.response.candidates);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get profile photo data");
    }
  };

  // const handleClick = async () => {
  //   try {
  //     if (!logo.logo || logo.logo === null) {
  //       Swal.fire({
  //         title: "Please select a Logo!",
  //         icon: "warning",
  //         confirmButtonText: "Close",
  //       });
  //     } else {
  //       const confirmationResult = await Swal.fire({
  //         title: "Upload Logo",
  //         text: "Do you want to upload this Logo?",
  //         icon: "question",
  //         showCancelButton: true,
  //         confirmButtonText: "Yes",
  //         cancelButtonText: "No",
  //       });
  //       if (confirmationResult.isConfirmed) {
  //         // setLoading(true);
  //         const response = await axios.post(
  //           BaseApi + "/admin/uploadLogo",
  //           logo,
  //           {
  //             headers: {
  //               "Content-Type": "application/json",
  //               key: ApiKey,
  //               token: tokenKey,
  //             },
  //           }
  //         );
  //         if (response.data.status === 200) {
  //           Swal.fire({
  //             title: "Logo updated successfully!",
  //             icon: "success",
  //             confirmButtonText: "Close",
  //           });
  //           getData();
  //           setLogo({
  //             ...logo,
  //             logo: "",

  //           });
  //           window.scrollTo(0, 0)
  //         } else {
  //           Swal.fire({
  //             title: response.data.message,
  //             icon: "error",
  //             confirmButtonText: "Close",
  //           });
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     Swal.fire({
  //       title: "Could not update logo. Please try after some time!",
  //       icon: "error",
  //       confirmButtonText: "Close",
  //     });
  //     console.log("Could not update photo!");
  //   }
  // };

  //   const handleFileUpload1 = async (e) => {
  //     const file = e.target.files[0];
  //     const base64 = await convertToBase64(file);
  //     setLogo({ ...logo, logo: base64 });
  //   };

  useEffect(() => {
    // Check if tokenKey is not present
    if (!tokenKey) {
      // Redirect to the home page
      navigate("/admin");
    } else {
      // TokenKey is present, fetch data or perform other actions
      getData();
      window.scrollTo(0, 0);
    }
  }, [tokenKey, navigate]);

  const sortAndFilterData = (array, key, direction, query) => {
    const sortedAndFilteredArray = [...array]
      .filter(
        (item) =>
          item.jobtitle?.toLowerCase().includes(query) ||
          item.created?.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === "ascending" ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    return sortedAndFilteredArray;
  };
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });
  const [symbol, setSymbol] = useState("🔺");

  const sortedAndFilteredData = sortAndFilterData(
    listData,
    sortConfig.key,
    sortConfig.direction,
    searchQuery
  );

  const filteredData = listData.filter((item) => {
    const searchString = searchQuery.toLowerCase();
    return (
      item.jobtitle?.toLowerCase().includes(searchString) ||
      item.created?.toLowerCase().includes(searchString)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAndFilteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  // useEffect(() => {
  //   // Check if tokenKey is not present
  //   if (!tokenKey) {
  //     // Redirect to the home page
  //     navigate("/admin");
  //   } else {
  //     // TokenKey is present, fetch data or perform other actions
  //     getData();
  //     window.scrollTo(0, 0);
  //   }
  // }, [tokenKey, navigate]);

  const handleColumnClick = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
      setSymbol("🔻");
    } else {
      setSymbol("🔺");
    }
    setSortConfig({ key, direction });
  };
  const handleSearchChange = (e) => {
    const newQuery = e.target.value.toLowerCase();
    setSearchQuery(newQuery);
  };

  return (
    <>
      <APNavBar />
      <div className="APBasic">
        <APSidebar />

        {loading ? (
          <>
            <div className="loader-container"></div>
          </>
        ) : (
          <>
            <div className="site-min-height">
              <div className="breadCumb1" role="presentation">
                <Breadcrumbs
                  aria-label="breadcrumb"
                  separator={<NavigateNextIcon fontSize="small" />}
                >
                  <Link
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate("/admin/admins/dashboard")}
                  >
                    Dashboard
                  </Link>
                  <Link
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate("/admin/candidates")}
                  >
                    Jobseekers
                  </Link>
                  <Link
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate("/admin/candidates")}
                  >
                    {userData.first_name} {userData.last_name}
                  </Link>
                  <Typography color="text.primary">
                    Applied Jobs List
                  </Typography>
                </Breadcrumbs>
              </div>
              <h2 className="adminPageHeading mt-4">Applied Jobs List</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    {candidates.length > 0 ? (
                      <>
                        <div className="manageSubadminPart1">
                          <h4>
                            No. of Results {indexOfFirstItem + 1}-
                            {Math.min(
                              indexOfLastItem,
                              filteredData.length || listData.length
                            )}{" "}
                            of {listData.length}
                          </h4>
                        </div>

                        <div className="manageSubadminPart2">
                          <table class="table">
                            <thead>
                              <tr>
                                <th
                                  onClick={() => handleColumnClick("jobtitle")}
                                >
                                  Job Title {symbol}
                                </th>
                                <th>Job Type</th>
                                <th
                                  onClick={() => handleColumnClick("created")}
                                >
                                  Applied Date {symbol}
                                </th>
                                <th>Status</th>

                                {/* <th scope="col">Action</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {currentItems.map((i) => {
                                return (
                                  <>
                                    <tr>
                                      <td>{i.jobtitle}</td>
                                      <td>{i.jobwork_type}</td>
                                      <td>{i.created}</td>
                                      <td>{i.apply_status}</td>
                                    </tr>
                                  </>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <div className="appliedJobListNoData">
                        No Records Found
                      </div>
                    )}
                  </div>
                  {/* <button
                  type="button"
                  className="btn btn-primary button1"
                  onClick={handleClick}
                >
                  UPLOAD
                </button>
                <button type="button" className="btn btn-primary button2" onClick={() => navigate("/admin/candidates/index")}>
                  CANCEL
                </button> */}
                </div>
              </form>
            </div>
            <APFooter />
          </>
        )}
      </div>
    </>
  );
};

export default APAppliedJobsList;
