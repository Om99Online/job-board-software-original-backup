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
import Tooltip from "@mui/material/Tooltip";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button, IconButton } from "@mui/material";
import HTMLReactParser from "html-react-parser";
import Cookies from "js-cookie";
import APFooter from "../Elements/APFooter";

const APManageEmailSetting = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [checkedData, setCheckedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // const [userData, setUserData] = useState([]);

  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");

  const [currentPage, setCurrentPage] = useState(1);
  // const [dataPerPage, setDataPerPage] = useState([]);
  const itemsPerPage = 20;

  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const handleOpen = (plan) => {
    setSelectedPlan(plan);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedPlan(null);
    setOpen(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%", // Adjusted width for mobile responsiveness
    maxWidth: "400px",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/admin/settings/manageMails",
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
      setListData(response.data.response.email);
      //   console.log(paymentHistory);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get plans data at APmanageplans");
    }
  };
  // const handleActivate = async (slug) => {
  //   try {
  //     const confirmationResult = await Swal.fire({
  //       title: "Activate Sub-Admin",
  //       text: "Do you want to Activate this Sub-Admin?",
  //       icon: "question",
  //       showCancelButton: true,
  //       confirmButtonText: "Yes",
  //       cancelButtonText: "No",
  //     });
  //     if (confirmationResult.isConfirmed) {
  //       // setLoading(true);
  //       const response = await axios.post(
  //         BaseApi + `/admin/activateuser/${slug}`,
  //         null, // Pass null as the request body if not required
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             key: ApiKey,
  //             token: tokenKey,
  //           },
  //         }
  //       );
  //       // setLoading(false);
  //       if (response.data.status === 200) {
  //         Swal.fire({
  //           title: "Sub-Admin Activated successfully!",
  //           icon: "success",
  //           confirmButtonText: "Close",
  //         });
  //       } else {
  //         Swal.fire({
  //           title: response.data.message,
  //           icon: "error",
  //           confirmButtonText: "Close",
  //         });
  //       }
  //       getData();
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     Swal.fire({
  //       title: "Failed. Please try after some time!",
  //       text: "Could not Activate Sub-Admin",
  //       icon: "error",
  //       confirmButtonText: "Close",
  //     });
  //     console.log("Couldn't activate the record!", error.message);
  //   }
  // };
  // const handleDeactivate = async (slug) => {
  //   try {
  //     const confirmationResult = await Swal.fire({
  //       title: "Deactivate Sub-Admin",
  //       text: "Do you want to Deactivate this Sub-Admin?",
  //       icon: "question",
  //       showCancelButton: true,
  //       confirmButtonText: "Yes",
  //       cancelButtonText: "No",
  //     });
  //     if (confirmationResult.isConfirmed) {
  //       // setLoading(true);
  //       const response = await axios.post(
  //         BaseApi + `/admin/deactivateuser/${slug}`,
  //         null, // Pass null as the request body if not required
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             key: ApiKey,
  //             token: tokenKey,
  //           },
  //         }
  //       );
  //       // setLoading(false);
  //       if (response.data.status === 200) {
  //         Swal.fire({
  //           title: "Sub-Admin Deactivated successfully!",
  //           icon: "success",
  //           confirmButtonText: "Close",
  //         });
  //       } else {
  //         Swal.fire({
  //           title: response.data.message,
  //           icon: "error",
  //           confirmButtonText: "Close",
  //         });
  //       }
  //       getData();
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     Swal.fire({
  //       title: "Failed. Please try after some time!",
  //       text: "Could not Deactivate Sub-Admin",
  //       icon: "error",
  //       confirmButtonText: "Close",
  //     });
  //     console.log("Couldn't deactivate the record!", error.message);
  //   }
  // };

  // const handleDelete = async (slug) => {
  //   try {
  //     const confirmationResult = await Swal.fire({
  //       title: "Delete Sub-Admin",
  //       text: "Do you want to Delete this Sub-Admin?",
  //       icon: "question",
  //       showCancelButton: true,
  //       confirmButtonText: "Yes",
  //       cancelButtonText: "No",
  //     });
  //     if (confirmationResult.isConfirmed) {
  //       // setLoading(true);
  //       const response = await axios.post(
  //         BaseApi + `/admin/deleteadmins/${slug}`,
  //         null, // Pass null as the request body if not required
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             key: ApiKey,
  //             token: tokenKey,
  //           },
  //         }
  //       );
  //       // setLoading(false);
  //       if (response.data.status === 200) {
  //         Swal.fire({
  //           title: "Sub-Admin deleted successfully!",
  //           icon: "success",
  //           confirmButtonText: "Close",
  //         });
  //       } else {
  //         Swal.fire({
  //           title: response.data.message,
  //           icon: "error",
  //           confirmButtonText: "Close",
  //         });
  //       }
  //       getData();
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     Swal.fire({
  //       title: "Failed. Please try after some time!",
  //       text: "Could not Delete Sub-Admin",
  //       icon: "error",
  //       confirmButtonText: "Close",
  //     });
  //     console.log("Couldn't delete the record!", error.message);
  //   }
  // };

  // const handleCheck = (id) => {
  //   if (checkedData.includes(id)) {
  //     // If the ID is already in the array, remove it
  //     setCheckedData(checkedData.filter((checkedId) => checkedId !== id));
  //   } else {
  //     // If the ID is not in the array, add it
  //     setCheckedData([...checkedData, id]);
  //   }
  // };

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

  const handleMultipleDeactivate = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Deactivate Sub-Admins",
        text: "Do you want to Deactivate Sub-Admins?",
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
          BaseApi + "/admin/manage",
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
            title: "Sub-Admins Deactivated successfully!",
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
        text: "Could not Deactivate Sub-Admins",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't deactivate the record!", error.message);
    }
  };
  const handleMultipleActivate = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Activate Sub-Admins",
        text: "Do you want to Activate Sub-Admins?",
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
          BaseApi + "/admin/manage",
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
            title: "Sub-Admins Activated successfully!",
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
        text: "Could not Activate Sub-Admins",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't activate the record!", error.message);
    }
  };
  // const handleMultipleDelete = async () => {
  //   try {
  //     const confirmationResult = await Swal.fire({
  //       title: "Delete Sub-Admins",
  //       text: "Do you want to Delete Sub-Admins?",
  //       icon: "question",
  //       showCancelButton: true,
  //       confirmButtonText: "Yes",
  //       cancelButtonText: "No",
  //     });
  //     if (confirmationResult.isConfirmed) {
  //       let ids = checkedData.toString();
  //       console.log(ids);
  //       // setLoading(true);
  //       const response = await axios.post(
  //         BaseApi + "/admin/manage",
  //         {
  //           idList: ids,
  //           action: "delete",
  //         }, // Pass null as the request body if not required
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             key: ApiKey,
  //             token: tokenKey,
  //           },
  //         }
  //       );
  //       // setLoading(false);
  //       if (response.data.status === 200) {
  //         Swal.fire({
  //           title: "Sub-Admins Delete successfully!",
  //           icon: "success",
  //           confirmButtonText: "Close",
  //         });
  //       } else {
  //         Swal.fire({
  //           title: "Couldn't Delete!",
  //           icon: "error",
  //           confirmButtonText: "Close",
  //         });
  //       }
  //       getData();
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     Swal.fire({
  //       title: "Failed. Please try after some time!",
  //       text: "Could not Delete Sub-Admins",
  //       icon: "error",
  //       confirmButtonText: "Close",
  //     });
  //     console.log("Couldn't Delete the record!", error.message);
  //   }
  // };

  const sortAndFilterData = (array, key, direction, query) => {
    const sortedAndFilteredArray = [...array]
      .filter(
        (item) =>
          item.email_name?.toLowerCase().includes(query) ||
          item.mail_value?.toLowerCase().includes(query)
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
      item.email_name?.toLowerCase().includes(searchString) ||
      item.mail_value?.toLowerCase().includes(searchString)
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
      <div className="APBasic APManageSubadmin">
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
                  aria-label="breadcrumb1"
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
                    Settings
                  </Link>

                  <Typography color="text.primary">
                    Manage Email Settings
                  </Typography>
                </Breadcrumbs>
              </div>
              <div className="ManageSubAdminHeader">
                <h2 className="">Email List</h2>
              </div>
              <div className="manageSubadminPart1">
                <form>
                  <div className="manageSubadminPart1Sec1">
                    <h4>Search Mail by typing email type, email address</h4>
                    <div class="APDashboardSearchBx ">
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
                      <th onClick={() => handleColumnClick("email_name")}>
                        Email Name {symbol}
                      </th>
                      <th onClick={() => handleColumnClick("mail_value")}>
                        Email Address {symbol}
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
                            <td>{i.email_name}</td>
                            <td>{i.mail_value}</td>
                            <td className="APActionButton">
                              <button
                                className="btn-primary"
                                onClick={() =>
                                  navigate(
                                    `/admin/settings/editMails/${i.slug}`
                                  )
                                }
                              >
                                <Tooltip title="Edit">
                                  <CreateIcon />
                                </Tooltip>
                              </button>
                              <button
                                className="btn btn-secondary"
                                onClick={() => handleOpen(i)}
                              >
                                <Tooltip title="Read">
                                  <RemoveRedEyeIcon />
                                </Tooltip>
                              </button>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                    <div>
                      <Modal
                        className="modalMain"
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box className="modal adminModal modal-content">
                          <IconButton
                            onClick={handleClose}
                            className="close-button"
                            style={{ position: "absolute", top: 10, right: 10 }}
                          >
                            &times;
                          </IconButton>

                          <Typography
                            id="modal-modal-title"
                            variant="h4"
                            component="h2"
                          >
                            {/* Email Details */}
                          </Typography>
                          {/* <hr /> */}
                          {/* <Typography
                            id="modal-modal-description"
                            sx={{ mt: 3 }}
                          >
                            <span className="fw-bold">Email Name:</span>{" "}
                            {selectedPlan &&
                              HTMLReactParser(selectedPlan.email_name)}
                          </Typography> */}
                          <Typography
                            id="modal-modal-description"
                            sx={{ mt: 3 }}
                          >
                            {/* <span className="fw-bold">Email Address:</span>{" "}
                            {selectedPlan &&
                              HTMLReactParser(selectedPlan.mail_value)} */}

                            {selectedPlan && (
                              <div className="modals ">
                                <div className="modalHead">
                                  <h1>Email Details</h1>
                                </div>
                                <div className="modalBody mt-4">
                                  <div className="row">
                                    <div className="col-md-4 fw-bold m-2 leftData">
                                      Email Name:{" "}
                                    </div>
                                    <div className="col-md-4 m-2 rightData">
                                      {selectedPlan.email_name}
                                    </div>
                                  </div>

                                  <div className="row">
                                    <div className="col-md-4 fw-bold m-2 leftData">
                                      Email Address:{" "}
                                    </div>
                                    <div className="col-md-4 m-2 rightData">
                                      {selectedPlan.mail_value}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Typography>
                        </Box>
                      </Modal>
                    </div>
                  </tbody>
                </table>
              </div>
              <div className="manageSubadminpart3">
                {/* <div className="functionalityButton">
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
                  </div> */}
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
            </div>
            <APFooter />
          </>
        )}
      </div>
    </>
  );
};

export default APManageEmailSetting;
