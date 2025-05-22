import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CreateIcon from "@mui/icons-material/Create";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Button, IconButton } from "@mui/material";
import Cookies from "js-cookie";
import APFooter from "../Elements/APFooter";

const APHomePageSlider = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [checkedData, setCheckedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");

  const [currentPage, setCurrentPage] = useState(1);
  // const [dataPerPage, setDataPerPage] = useState([]);
  const itemsPerPage = 10;
  const [open, setOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  // const [selectedPlan, setSelectedPlan] = useState(null);

  const [openOrder, setOpenOrder] = useState(false);
  const [orderValue, setOrderValue] = useState(null);

  const [errors, setErrors] = useState({
    orderNumber: "",
  });

  const [orderNumber, setOrderNumber] = useState(1);

  const handleOpen = (plan) => {
    setSelectedPayment(plan);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedPayment(null);
    setOpen(false);
  };

  const handleEditOrder = (order) => {
    setOrderValue(order);
    setOrderNumber(order.display_order);
    setOpenOrder(true);
  };

  const handleEditOrderClose = () => {
    setOrderValue(null);
    setOpenOrder(false);
  };

  const handleChange = (e) => {
    setOrderNumber(e.target.value);
  };

  const handleClick = async () => {
    const confirmationResult = await Swal.fire({
      title: "Update Employer order?",
      text: "Do you want to update the Employer Slider List Order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    try {
      if (confirmationResult.isConfirmed) {
        setLoading(true);

        const response = await axios.post(
          BaseApi + `/admin/users/updateeployerorder`,
          { id: orderValue.id, order: orderNumber },
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

        if (response.data.status === 200) {
          Swal.fire({
            title: "Employer Order updated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });

          window.location.reload();
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
      }
    } catch (error) {
      setLoading(false);
      console.log("Cannot get plans data at APmanageplans");
    }
  };

  const handleReset = () => {
    setOrderValue(null);
    setOpenOrder(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  // const {slug} = useParams();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/admin/users/selectforslider",
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
        title: "Activate Slider?",
        text: "Do you want to Activate this Slider?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);
        const response = await axios.post(
          BaseApi + `/admin/users/activateslider/${slug}`,
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
            title: "Slider Activated successfully!",
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
        text: "Could not Activate Slider",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't activate the record!", error.message);
    }
  };
  const handleDeactivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Deactivate Slider?",
        text: "Do you want to Deactivate this Slider?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);
        const response = await axios.post(
          BaseApi + `/admin/users/deactivateslider/${slug}`,
          null,
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
            title: "Slider Deactivated successfully!",
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
        text: "Could not Deactivate Slider",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't deactivate the record!", error.message);
    }
  };

  const handleDelete = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Delete Slider?",
        text: "Do you want to Delete this Slider?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);
        const response = await axios.post(
          BaseApi + `/admin/deleteadmins/${slug}`,
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
            title: "Slider deleted successfully!",
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
        text: "Could not Delete Slider",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't delete the record!", error.message);
    }
  };

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
          item.email_address?.toLowerCase().includes(query) ||
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
      item.email_address?.toLowerCase().includes(searchString) ||
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
                  <Link
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate("")}
                  >
                    Employers
                  </Link>

                  <Typography color="text.primary">
                    Employers Logo List
                  </Typography>
                </Breadcrumbs>
              </div>
              <div className="ManageSubAdminHeader">
                <h2 className="">Employer Logo List</h2>

                <button
                  className="btn navButton1 APMSbutton"
                  onClick={() => navigate("/admin/users/addhomepageslider")}
                >
                  Add Employer To Slider
                </button>
              </div>
              {listData != "" ? (
                <>
                  <div className="manageSubadminPart1">
                    <form>
                      <div className="manageSubadminPart1Sec1">
                        <h4>
                          Search employer by typing Company name, Email or Name
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
                          {/* <th scope="col"></th> */}
                          <th onClick={() => handleColumnClick("company_name")}>
                            Company Name {symbol}
                          </th>
                          <th onClick={() => handleColumnClick("full_name")}>
                            Full Name {symbol}
                          </th>

                          <th
                            onClick={() => handleColumnClick("email_address")}
                          >
                            Email {symbol}
                          </th>
                          <th>Logo</th>
                          <th>Order Number</th>

                          <th onClick={() => handleColumnClick("created")}>
                            <CalendarMonthIcon /> Created
                          </th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((i) => {
                          return (
                            <>
                              <tr>
                                {/* <td className="checkBoxCol">
                                <input
                                  type="checkbox"
                                  className="tableCheckBox"
                                  checked={checkedData.includes(i.id)} // Check if the current ID is in checkedData
                                  onChange={() => handleCheck(i.id)} // Pass the ID to the handler
                                />
                              </td> */}
                                <td>{i.company_name}</td>
                                <td>{i.full_name}</td>
                                <td>{i.email_address}</td>
                                <td>
                                  {i.profile_image ? (
                                    <img
                                      className="APHomepageSliderImage"
                                      src={i.profile_image}
                                    />
                                  ) : (
                                    <img
                                      src="/Images/adminpanel/demoo.jpg"
                                      alt="Company"
                                    />
                                  )}
                                </td>
                                <td>{i.display_order}</td>
                                <td>{i.created}</td>
                                <td className="APActionButton">
                                  {i.home_slider === 1 ? (
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
                                    onClick={() => handleEditOrder(i)}
                                  >
                                    <Tooltip title="Edit Order">
                                      <CreateIcon />
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
                            open={openOrder}
                            onClose={handleEditOrderClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box className="modal adminModal modal-content">
                              <IconButton
                                onClick={handleEditOrderClose}
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
                                {orderValue && (
                                  <div className="modals ">
                                    <div className="modalHead">
                                      <h1>{orderValue.full_name}</h1>
                                    </div>
                                    <div className="modalBody mt-4">
                                      <div className="row">
                                        <div class="col APBasic">
                                          <div class="mb-5 mt-4 DashBoardInputBx">
                                            <label
                                              for="formFile"
                                              class="form-label"
                                            >
                                              Order Number
                                              <span className="RedStar">*</span>
                                            </label>
                                            <input
                                              type="number"
                                              id="form3Example1"
                                              className={`form-control ${
                                                errors.orderNumber &&
                                                "input-error"
                                              }`}
                                              name="Order_Number"
                                              value={orderNumber}
                                              placeholder="Order Number"
                                              onChange={handleChange}
                                            />
                                            {errors.orderNumber && (
                                              <div className="text-danger">
                                                {errors.orderNumber}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col">
                                          <button
                                            type="button"
                                            className="btn btn-primary button1"
                                            onClick={handleClick}
                                          >
                                            SAVE
                                          </button>
                                          <button
                                            type="button"
                                            className="btn btn-primary button2"
                                            onClick={() => handleReset()}
                                          >
                                            RESET
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Typography>
                            </Box>
                          </Modal>

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
                                  <div className="modals ">
                                    <div className="modalHead">
                                      <h1>{selectedPayment.full_name}</h1>
                                    </div>
                                    <div className="modalBody mt-4">
                                      <div className="row">
                                        <div className="col-md-4 fw-bold m-2 leftData">
                                          Company Name:{" "}
                                        </div>
                                        <div className="col-md-4 m-2 rightData">
                                          {selectedPayment.company_name}
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-md-4 fw-bold m-2 leftData">
                                          Position:{" "}
                                        </div>
                                        <div className="col-md-4 m-2 rightData">
                                          {selectedPayment.position}
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-md-4 fw-bold m-2 leftData">
                                          Name:{" "}
                                        </div>
                                        <div className="col-md-4 m-2 rightData">
                                          {selectedPayment.full_name}
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-md-4 fw-bold m-2 leftData">
                                          Email Address:{" "}
                                        </div>
                                        <div className="col-md-4 m-2 rightData">
                                          {selectedPayment.email_address}
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-md-4 fw-bold m-2 leftData">
                                          Address:{" "}
                                        </div>
                                        <div className="col-md-4 m-2 rightData">
                                          {selectedPayment.address}
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-md-4 fw-bold m-2 leftData">
                                          Location:{" "}
                                        </div>
                                        <div className="col-md-4 m-2 rightData">
                                          {selectedPayment.location}
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-md-4 fw-bold m-2 leftData">
                                          Contact Number:{" "}
                                        </div>
                                        <div className="col-md-4 m-2 rightData">
                                          {selectedPayment.contact}
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-md-4 fw-bold m-2 leftData">
                                          Company Number:{" "}
                                        </div>
                                        <div className="col-md-4 m-2 rightData">
                                          {selectedPayment.contact}
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-md-4 fw-bold m-2 leftData">
                                          Website:{" "}
                                        </div>
                                        <div className="col-md-4 m-2 rightData">
                                          {selectedPayment.url}
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
                <div className="appliedJobListNoData">No Records Found</div>
              )}
            </div>
            <APFooter />
          </>
        )}
      </div>
    </>
  );
};

export default APHomePageSlider;
