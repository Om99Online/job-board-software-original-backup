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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";
import Tooltip from "@mui/material/Tooltip";
// import AddIcon from "@mui/icons-material/Add";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Cookies from "js-cookie";
import { Button, IconButton } from "@mui/material";
import APFooter from "../Elements/APFooter";

const APManagePlans = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [checkedData, setCheckedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");
  const curr = Cookies.get("curr");


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
        BaseApi + "/admin/plan/index",
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
        title: "Activate Plan",
        text: "Do you want to Activate this Plan?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);
        const response = await axios.post(
          BaseApi + `/admin/plan/activateplans/${slug}`,
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
            title: "Plan Activated successfully!",
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
        text: "Could not Activate Plan",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't activate the Plan!", error.message);
    }
  };
  const handleDeactivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Deactivate Plan",
        text: "Do you want to Deactivate this Plan?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);
        const response = await axios.post(
          BaseApi + `/admin/plan/deactivateplans/${slug}`,
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
            title: "Plan Deactivated successfully!",
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
        text: "Could not Deactivate Plan",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't deactivate the plan!", error.message);
    }
  };

  const handleDelete = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Delete Plan",
        text: "Do you want to Delete this Plan?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);
        const response = await axios.post(
          BaseApi + `/admin/plan/deletePlan/${slug}`,
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
            title: "Plan deleted successfully!",
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
        text: "Could not Delete Plan",
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
        title: "Deactivate Plans?",
        text: "Do you want to Deactivate Plans?",
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
          BaseApi + "/admin/plan/index",
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
            title: "Plans Deactivated successfully!",
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
        text: "Could not Deactivate Plans",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't deactivate the record!", error.message);
    }
  };
  const handleMultipleActivate = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Activate Plans?",
        text: "Do you want to Activate Plans?",
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
          BaseApi + "/admin/plan/index",
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
            title: "Plans Activated successfully!",
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
        text: "Could not Activate Plans",
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
          item.plan_name?.toLowerCase().includes(query) ||
          item.planuser?.toLowerCase().includes(query) ||
          item.type?.toLowerCase().includes(query) ||
          // item.amount?.toLowerCase().includes(query) ||
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
    const searchString = searchQuery?.toLowerCase();
    return (
      item.plan_name?.toLowerCase().includes(searchString) ||
      item.planuser?.toLowerCase().includes(searchString) ||
      // item.amount?.toLowerCase().includes(searchString) ||
      item.type?.toLowerCase().includes(searchString) ||
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

                  <Typography color="text.primary">Plans List</Typography>
                </Breadcrumbs>
              </div>
              <div className="ManageSubAdminHeader">
                <h2 className="">Plans List</h2>
                <button
                  className="btn navButton1 APMSbutton"
                  onClick={() => navigate("/admin/plans/addplan")}
                >
                  Add Plan
                </button>
              </div>
              {listData != "" ? (
                <>
                  <div className="manageSubadminPart1">
                    <form>
                      <div className="manageSubadminPart1Sec1">
                        <h4>Search Plans by typing Plan Name</h4>
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
                          <th className="checkBoxCol checkBxHead">
                            <input
                              type="checkbox"
                              className="tableCheckBox"
                              // checked={selectAll}

                              onClick={() => handleCheck("selectAll")}
                            />
                          </th>
                          <th onClick={() => handleColumnClick("plan_name")}>
                            Plan Name {symbol}
                          </th>
                          <th onClick={() => handleColumnClick("planuser")}>
                            User Plan {symbol}
                          </th>

                          <th onClick={() => handleColumnClick("amount")}>
                            Amount {symbol}
                          </th>
                          <th onClick={() => handleColumnClick("type")}>
                            Plan Type {symbol}
                          </th>
                          <th>Time Period</th>

                          <th onClick={() => handleColumnClick("created")}>
                            <CalendarMonthIcon /> Created {symbol}
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
                                <td>{i.plan_name}</td>
                                <td>{i.planuser}</td>
                                <td>{curr}{" "}{i.amount}</td>
                                <td>{i.type}</td>
                                <td>{i.type_value}{" "}{i.type}</td>
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
                                        `/admin/plans/editPlan/${i.slug}`
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
                                  <button
                                    className="btn-primary"
                                    onClick={() => handleOpen(i)}
                                  >
                                    <Tooltip title="View">
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
                            <Box
                              className="modal adminModal modal-content"
                              // sx={{ ...style, width: 700 }}
                            >
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
                                {selectedPlan && (
                                  <div className="modals ">
                                    <div className="modalHead">
                                      <h1>
                                        Membership Plan -{" "}
                                        {selectedPlan.plan_name}
                                      </h1>
                                    </div>
                                    <div className="modalBody mt-4">
                                      <div className="row">
                                        <div className="col-md-4 fw-bold m-2 leftData">
                                          Amount:{" "}
                                        </div>
                                        <div className="col-md-4 m-2 rightData">
                                          {selectedPlan.amount}
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-md-4 fw-bold m-2 leftData">
                                          Plan Type:{" "}
                                        </div>
                                        <div className="col-md-4 m-2 rightData">
                                          {selectedPlan.type}
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-md-4 fw-bold m-2 leftData">
                                          Time Period:{" "}
                                        </div>
                                        <div className="col-md-4 m-2 rightData">
                                          {selectedPlan.type_value}
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="fw-bold m-2 leftData">
                                          Features:{" "}
                                        </div>
                                        <div className="m-2 rightData">
                                          {Object.values(
                                            selectedPlan.features
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

export default APManagePlans;
