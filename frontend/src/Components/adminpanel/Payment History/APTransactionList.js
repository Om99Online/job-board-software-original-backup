import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import APNavBar from "../Elements/APNavBar";
import APSidebar from "../APSidebar/APSidebar";
import { Button, IconButton, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axios from "axios";
import BaseApi from "../../api/BaseApi";
import ApiKey from "../../api/ApiKey";
import Swal from "sweetalert2";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import CreateIcon from "@mui/icons-material/Create";
// import DeleteIcon from "@mui/icons-material/Delete";
// import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import BlockIcon from "@mui/icons-material/Block";
// import CheckIcon from "@mui/icons-material/Check";
// import Tooltip from "@mui/material/Tooltip";
// import AddIcon from "@mui/icons-material/Add";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
// import VerifiedIcon from "@mui/icons-material/Verified";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Cookies from "js-cookie";
import APFooter from "../Elements/APFooter";

const APTransactionList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [checkedData, setCheckedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");

  const [currentPage, setCurrentPage] = useState(1);
  // const [dataPerPage, setDataPerPage] = useState([]);
  const itemsPerPage = 20;
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const handleOpen = (plan) => {
    setSelectedPayment(plan);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedPayment(null);
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
        BaseApi + "/admin/payment/index",
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

  const handleCheck = (id) => {
    if (checkedData.includes(id)) {
      // If the ID is already in the array, remove it
      setCheckedData(checkedData.filter((checkedId) => checkedId !== id));
    } else {
      // If the ID is not in the array, add it
      setCheckedData([...checkedData, id]);
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
  const handleMultipleDelete = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Delete Sub-Admins",
        text: "Do you want to Delete Sub-Admins?",
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
        // setLoading(false);
        if (response.data.status === 200) {
          Swal.fire({
            title: "Sub-Admins Delete successfully!",
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
        text: "Could not Delete Sub-Admins",
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
          item.company_name?.toLowerCase().includes(query) ||
          item.full_name?.toLowerCase().includes(query) ||
          item.plan_name?.toLowerCase().includes(query) ||
          item.transaction_id?.toLowerCase().includes(query) ||
          // item.price?.toLowerCase().includes(query) ||
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
      item.company_name?.toLowerCase().includes(searchString) ||
      item.full_name?.toLowerCase().includes(searchString) ||
      item.plan_name?.toLowerCase().includes(searchString) ||
      item.transaction_id?.toLowerCase().includes(searchString) ||
      // item.price?.toLowerCase().includes(searchString) ||
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
            <div className="site-min-height pb-3">
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

                  <Typography color="text.primary">
                    List Transaction History
                  </Typography>
                </Breadcrumbs>
              </div>
              <div className="ManageSubAdminHeader">
                <h2 className="">Transaction List</h2>
              </div>
              {listData != "" ? (
                <>
                  <div className="manageSubadminPart1">
                    <form>
                      <div className="manageSubadminPart1Sec1">
                        <h4>
                          Search Transaction by Company name, transaction id ,
                          title or payment date
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
                          <th onClick={() => handleColumnClick("company_name")}>
                            Company Name{symbol}
                          </th>
                          <th onClick={() => handleColumnClick("full_name")}>
                            Full Name{symbol}
                          </th>
                          <th onClick={() => handleColumnClick("plan_name")}>
                            Plan Name{symbol}
                          </th>
                          <th
                            onClick={() => handleColumnClick("transaction_id")}
                          >
                            Transaction#{symbol}
                          </th>
                          <th onClick={() => handleColumnClick("price")}>
                            Amount{symbol}
                          </th>
                          <th onClick={() => handleColumnClick("created")}>
                            Transaction Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((i) => {
                          return (
                            <>
                              <tr>
                                <td>
                                  <Link to={`/admin/users/editusers/${i.slug}`}>
                                    {i.company_name}
                                  </Link>
                                </td>
                                <td>{i.full_name}</td>
                                <td>
                                  <button
                                    className="APTransactionListButton"
                                    onClick={() => handleOpen(i)}
                                  >
                                    {i.plan_name}
                                  </button>
                                </td>

                                <td>{i.transaction_id}</td>
                                <td>{i.price}</td>
                                <td>{i.created}</td>
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
                                style={{
                                  position: "absolute",
                                  top: 10,
                                  right: 10,
                                }}
                              >
                                &times;
                              </IconButton>

                              <Typography
                                id="modal-modal-title"
                                variant="h6"
                                component="h2"
                              ></Typography>
                              <Typography
                                id="modal-modal-description"
                                sx={{ mt: 3 }}
                              >
                                {selectedPayment && (
                                  <div className="modals">
                                    <div className="modalHead">
                                      <h4>
                                        {" "}
                                        Transaction ID -{" "}
                                        {selectedPayment.transaction_id}
                                      </h4>
                                    </div>
                                    <div className="modalBody mt-4">
                                      <div className="modalParent">
                                        <div className="modalLeft">
                                          Plan Name:{" "}
                                        </div>
                                        <div className="modalRight">
                                          {selectedPayment.plan_name}
                                        </div>
                                      </div>

                                      <div className="modalParent">
                                        <div className="modalLeft">
                                          Amount:{" "}
                                        </div>
                                        <div className="modalRight">
                                          {selectedPayment.price}
                                        </div>
                                      </div>

                                      <div className="modalParent">
                                        <div className="modalLeft">
                                          Transaction ID:{" "}
                                        </div>
                                        <div className="modalRight">
                                          {selectedPayment.transaction_id}
                                        </div>
                                      </div>

                                      <div className="modalParent">
                                        <div className="modalLeft">
                                          Start Date:{" "}
                                        </div>
                                        <div className="modalRight">
                                          {selectedPayment.start_date}
                                        </div>
                                      </div>

                                      <div className="modalParent">
                                        <div className="modalLeft">
                                          End Date:{" "}
                                        </div>
                                        <div className="modalRight">
                                          {selectedPayment.end_date}
                                        </div>
                                      </div>

                                      <div className="modalParent">
                                        <div className="modalLeft">
                                          Features:{" "}
                                        </div>
                                        <div className="modalRight">
                                          {Object.values(
                                            selectedPayment.features
                                          ).map((value, index, key) => {
                                            return (
                                              <>
                                                {index + 1}. {value}
                                                <br />
                                              </>
                                            );
                                          })}
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

export default APTransactionList;
