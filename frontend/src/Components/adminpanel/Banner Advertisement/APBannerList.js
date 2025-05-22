import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import APNavBar from "../Elements/APNavBar";
import APSidebar from "../APSidebar/APSidebar";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axios from "axios";
import BaseApi from "../../api/BaseApi";
import ApiKey from "../../api/ApiKey";
import Swal from "sweetalert2";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";
import Tooltip from "@mui/material/Tooltip";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Cookies from "js-cookie";
import APFooter from "../Elements/APFooter";

const APBannerList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [checkedData, setCheckedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");

  const [currentPage, setCurrentPage] = useState(1);
  // const [dataPerPage, setDataPerPage] = useState([]);
  const itemsPerPage = 20;
  // const [open, setOpen] = useState(false);
  // const [selectedPlan, setSelectedPlan] = useState(null);
  // const handleOpen = (plan) => {
  //   setSelectedPlan(plan);
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setSelectedPlan(null);
  //   setOpen(false);
  // };

  // const style = {
  //   position: "absolute",
  //   top: "50%",
  //   left: "50%",
  //   transform: "translate(-50%, -50%)",
  //   width: 400,
  //   bgcolor: "background.paper",
  //   border: "2px solid #000",
  //   boxShadow: 24,
  //   p: 4,
  // };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/admin/banner/index",
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
      setListData(response.data.response);
      //   console.log(paymentHistory);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get plans data at APmanageplans");
    }
  };
  const handleActivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Activate Banner?",
        text: "Do you want to Activate this Banner?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);
        const response = await axios.post(
          BaseApi + `/admin/banner/admin_activate/${slug}`,
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
        // setLoading(false);
        if (response.data.status === 200) {
          Swal.fire({
            title: "Banner Activated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
        getData();
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed. Please try after some time!",
        text: "Could not Activate Banner",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't activate the record!", error.message);
    }
  };
  const handleDeactivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Deactivate Banner?",
        text: "Do you want to Deactivate this Banner?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);
        const response = await axios.post(
          BaseApi + `/admin/banner/admin_deactivate/${slug}`,
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
        // setLoading(false);
        if (response.data.status === 200) {
          Swal.fire({
            title: "Banner Deactivated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
        getData();
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed. Please try after some time!",
        text: "Could not Deactivate Banner",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't deactivate the record!", error.message);
    }
  };

  const handleDelete = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Delete Banner?",
        text: "Do you want to Delete this Banner?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);
        const response = await axios.post(
          BaseApi + `/admin/banner/admin_delete/${slug}`,
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
        // setLoading(false);
        if (response.data.status === 200) {
          Swal.fire({
            title: "Banner deleted successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
        getData();
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed. Please try after some time!",
        text: "Could not Delete Banner",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't delete the record!", error.message);
    }
  };

  const [selectAll, setSelectAll] = useState(true);

  const handleCheck = (id) => {
    // Check if the id is 'selectAll', indicating the "Select All" checkbox
    if (id === "selectAll") {
      // If it's "Select All", toggle the selectAll state
      setSelectAll(!selectAll);

      // If selectAll is true, select all checkboxes, else unselect all
      const updatedCheckedData = selectAll
        ? listData.map((item) => item.id)
        : [];
      setCheckedData(updatedCheckedData);
    } else {
      // Individual checkbox handling remains the same
      if (checkedData.includes(id)) {
        // If the ID is already in the array, remove it
        setCheckedData(checkedData.filter((checkedId) => checkedId !== id));
      } else {
        // If the ID is not in the array, add it
        setCheckedData([...checkedData, id]);
      }
    }
  };

  // const handleCheck = (id) => {
  //   if (checkedData.includes(id)) {
  //     // If the ID is already in the array, remove it
  //     setCheckedData(checkedData.filter((checkedId) => checkedId !== id));
  //   } else {
  //     // If the ID is not in the array, add it
  //     setCheckedData([...checkedData, id]);
  //   }
  // };

  const handleMultipleDeactivate = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Deactivate Banners?",
        text: "Do you want to Deactivate Banners?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        const ids = checkedData.join(",");
        console.log(ids);
        // setLoading(true);
        const response = await axios.post(
          BaseApi + "/admin/banner/index",
          {
            idList: ids,
            action: "deactivate",
          }, // Pass null as the request body if not required
          {
            headers: {
              "Content-Type": "application/json",
              key: ApiKey,
              token: tokenKey,
              adminid: adminID,
            },
          }
        );
        setSelectAll(true);
        setCheckedData("");
        // setLoading(false);
        if (response.data.status === 200) {
          Swal.fire({
            title: "Banners Deactivated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
        } else {
          Swal.fire({
            title: "Couldn't Deactivate!",
            icon: "error",
            confirmButtonText: "Close",
          });
        }
        getData();
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed. Please try after some time!",
        text: "Could not Deactivate Banners",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't deactivate the record!", error.message);
    }
  };
  const handleMultipleActivate = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Activate Banners?",
        text: "Do you want to Activate Banners?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        let ids = checkedData.toString();
        console.log(ids);
        // setLoading(true);
        const response = await axios.post(
          BaseApi + "/admin/banner/index",
          {
            idList: ids,
            action: "activate",
          }, // Pass null as the request body if not required
          {
            headers: {
              "Content-Type": "application/json",
              key: ApiKey,
              token: tokenKey,
              adminid: adminID,
            },
          }
        );
        setSelectAll(true);
        setCheckedData("");
        // setLoading(false);
        if (response.data.status === 200) {
          Swal.fire({
            title: "Banners Activated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
        } else {
          Swal.fire({
            title: "Couldn't Activate!",
            icon: "error",
            confirmButtonText: "Close",
          });
        }
        getData();
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed. Please try after some time!",
        text: "Could not Activate Banners",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't activate the record!", error.message);
    }
  };
  const handleMultipleDelete = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Delete Banners?",
        text: "Do you want to Delete Banners?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        let ids = checkedData.toString();
        console.log(ids);
        // setLoading(true);
        const response = await axios.post(
          BaseApi + "/admin/banner/index",
          {
            idList: ids,
            action: "delete",
          }, // Pass null as the request body if not required
          {
            headers: {
              "Content-Type": "application/json",
              key: ApiKey,
              token: tokenKey,
              adminid: adminID,
            },
          }
        );
        setSelectAll(true);
        setCheckedData("");
        // setLoading(false);
        if (response.data.status === 200) {
          Swal.fire({
            title: "Banners Delete successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
        } else {
          Swal.fire({
            title: "Couldn't Delete!",
            icon: "error",
            confirmButtonText: "Close",
          });
        }
        getData();
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed. Please try after some time!",
        text: "Could not Delete Banners",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't Delete the record!", error.message);
    }
  };

  const sortAndFilterData = (array, key, direction, query) => {
    const sortedAndFilteredArray = [...array]
      .filter(
        (item) =>
          item.title?.toLowerCase().includes(query) ||
          item.url?.toLowerCase().includes(query) ||
          item.place?.toLowerCase().includes(query) ||
          item.posteddate?.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        if (key === "posteddate") {
          // Convert date strings to Date objects for sorting
          const dateA = new Date(a[key]);
          const dateB = new Date(b[key]);

          if (dateA < dateB) {
            return direction === "ascending" ? -1 : 1;
          }
          if (dateA > dateB) {
            return direction === "ascending" ? 1 : -1;
          }
          return 0;
        } else {
          // For other columns, use the default sorting logic
          if (a[key] < b[key]) {
            return direction === "ascending" ? -1 : 1;
          }
          if (a[key] > b[key]) {
            return direction === "ascending" ? 1 : -1;
          }
          return 0;
        }
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
      item.title?.toLowerCase().includes(searchString) ||
      item.url?.toLowerCase().includes(searchString) ||
      item.place?.toLowerCase().includes(searchString) ||
      item.posteddate?.toLowerCase().includes(searchString)
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

  useEffect(() => {
    setCurrentPage(1); // Reset currentPage to 1 when searchQuery changes
  }, [searchQuery]);

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
      <div className="APBasic APManageSubadmin BannerList">
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
                    onClick={() => navigate("")}
                  >
                    Banner Advertisements
                  </Link>

                  <Typography color="text.primary">
                    Banner Advertisements List
                  </Typography>
                </Breadcrumbs>
              </div>
              <div className="ManageSubAdminHeader">
                <h2 className="">Banner Advertisements List</h2>

                <button
                  className="btn navButton1 APMSbutton"
                  onClick={() =>
                    navigate(
                      "/admin/banneradvertisements/addBanneradvertisement"
                    )
                  }
                >
                  Add Banner
                </button>
              </div>
              {listData != "" ? (
                <>
                  <div className="manageSubadminPart1">
                    <form>
                      <div className="manageSubadminPart1Sec1">
                        <h4>
                          Search Banner Advertisements by typing title or
                          Created date
                        </h4>
                        <div class="APDashboardSearchBx ">
                          {/* <label for="formFile" class="form-label">
                          Search By Keyword
                        </label> */}

                          <input
                            type="text"
                            id="form3Example1"
                            className="form-control"
                            name="searchQuery"
                            placeholder="Search.."
                            value={searchQuery}
                            onChange={handleSearchChange}
                          />
                        </div>
                      </div>
                    </form>
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
                          <td className="checkBoxCol checkBxHead">
                            <input
                              type="checkbox"
                              className="tableCheckBox"
                              // checked={selectAll}

                              onClick={() => handleCheck("selectAll")}
                            />
                          </td>
                          <th onClick={() => handleColumnClick("title")}>
                            AD Title{symbol}
                          </th>
                          <th onClick={() => handleColumnClick("url")}>
                            URL{symbol}
                          </th>
                          <th onClick={() => handleColumnClick("place")}>
                            AD Place{symbol}
                          </th>
                          <th>Image Adverts/Google Adverts</th>
                          <th onClick={() => handleColumnClick("posteddate")}>
                            Posted Date{symbol}
                          </th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((i) => {
                          return (
                            <>
                              <tr>
                                <td className="checkBoxCol">
                                  <input
                                    type="checkbox"
                                    className="tableCheckBox"
                                    checked={checkedData.includes(i.id)} // Check if the current ID is in checkedData
                                    onChange={() => handleCheck(i.id)} // Pass the ID to the handler
                                  />
                                </td>
                                <td>{i.title}</td>
                                <td>{i.url}</td>
                                <td>{i.advertisement_place}</td>
                                <td>
                                  <img
                                    className="BLAdvertisementImage"
                                    src={i.image}
                                    alt="advertisement"
                                  />
                                </td>
                                <td>{i.created}</td>

                                <td className="APActionButton">
                                  {i.status === 1 ? (
                                    <button
                                      className="btn-secondary"
                                      onClick={() => handleDeactivate(i.slug)}
                                    >
                                      <Tooltip title="Deactivate">
                                        <CheckIcon />
                                      </Tooltip>
                                    </button>
                                  ) : (
                                    <button
                                      className="btn-secondary"
                                      onClick={() => handleActivate(i.slug)}
                                    >
                                      <Tooltip title="Activate">
                                        <BlockIcon />
                                      </Tooltip>
                                    </button>
                                  )}
                                  <button
                                    className="btn-primary"
                                    onClick={() =>
                                      navigate(
                                        `/admin/banneradvertisements/editBanneradvertisement/${i.slug}`
                                      )
                                    }
                                  >
                                    <Tooltip title="Edit">
                                      <CreateIcon />
                                    </Tooltip>
                                  </button>
                                  <button
                                    className="btn btn-secondary"
                                    onClick={() => handleDelete(i.slug)}
                                  >
                                    <Tooltip title="Delete">
                                      <DeleteIcon />
                                    </Tooltip>
                                  </button>
                                </td>
                              </tr>
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="manageSubadminpart3">
                    <div className="functionalityButton">
                      <button
                        type="button"
                        className="btn btn-primary APButton3"
                        onClick={() => handleMultipleActivate()}
                      >
                        ACTIVATE
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary APButton3"
                        onClick={() => handleMultipleDeactivate()}
                      >
                        DEACTIVATE
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary APButton4"
                        onClick={() => handleMultipleDelete()}
                      >
                        DELETE
                      </button>
                    </div>

                    <div className="pagination">
                      <Stack spacing={2}>
                        <Pagination
                          count={totalPages}
                          color="primary"
                          page={currentPage}
                          onChange={(event, page) => setCurrentPage(page)}
                        />
                      </Stack>
                    </div>
                  </div>
                </>
              ) : (
                <div className="appliedJobListNoData mt-5">
                  No Records Found
                </div>
              )}
            </div>
            <APFooter />

          </>
        )}
      </div>
    </>
  );
};

export default APBannerList;
