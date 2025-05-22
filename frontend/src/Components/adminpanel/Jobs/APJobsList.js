import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import APNavBar from "../Elements/APNavBar";
import APSidebar from "../APSidebar/APSidebar";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axios from "axios";
import BaseApi from "../../api/BaseApi";
import ApiKey from "../../api/ApiKey";
import Swal from "sweetalert2";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";
import Tooltip from "@mui/material/Tooltip";
// import AddIcon from "@mui/icons-material/Add";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Cookies from "js-cookie";
import { Button, IconButton } from "@mui/material";
import HTMLReactParser from "html-react-parser";
import APFooter from "../Elements/APFooter";

const APJobsList = () => {
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
  const [open, setOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  // const [selectedPlan, setSelectedPlan] = useState(null);
  const handleOpen = (plan) => {
    setSelectedPayment(plan);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedPayment(null);
    setOpen(false);
  };

  const [userAccess , setUserAccess] = useState({})

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%", // Adjusted width for mobile responsiveness
    maxWidth: "400px",
    // maxHeight: "800px",
    backgroundColor: "white", // Use a valid color or background image here
    border: "2px solid #000",
    boxShadow: "0 0 24px rgba(0, 0, 0, 0.2)", // Adjust the shadow values as needed
    padding: "4px", // Adjust padding as needed
    // overflowY: "scroll", // Add a vertical scrollbar
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/admin/job/index",
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
      // console.log("list",listData);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get plans data at APmanageplans");
    }
  };
  const handleActivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Activate Job?",
        text: "Do you want to Activate this Job?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);
        const response = await axios.post(
          BaseApi + `/admin/job/admin_activate/${slug}`,
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
            title: "Job Activated successfully!",
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
        text: "Could not Activate Job",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't activate the record!", error.message);
    }
  };
  const handleDeactivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Deactivate Job",
        text: "Do you want to Deactivate this Job?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);
        const response = await axios.post(
          BaseApi + `/admin/job/admin_deactivate/${slug}`,
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
            title: "Job Deactivated successfully!",
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
        text: "Could not Deactivate Job",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't deactivate the record!", error.message);
    }
  };

  const handleDelete = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Delete Job?",
        text: "Do you want to Delete this Job?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);
        const response = await axios.post(
          BaseApi + `/admin/job/admin_delete/${slug}`,
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
            title: "Job deleted successfully!",
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
        text: "Could not Delete job",
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
        title: "Deactivate Jobs?",
        text: "Do you want to Deactivate these Jobs?",
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
          BaseApi + "/admin/job/index",
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
            title: "Jobs Deactivated successfully!",
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
        text: "Could not Deactivate Jobs",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't deactivate the record!", error.message);
    }
  };
  const handleMultipleActivate = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Activate Jobs?",
        text: "Do you want to Activate these Jobs?",
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
          BaseApi + "/admin/job/index",
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
            title: "Jobs Activated successfully!",
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
        text: "Could not Activate Jobs",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't activate the record!", error.message);
    }
  };
  const handleMultipleDelete = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Delete Jobs?",
        text: "Do you want to Delete these Jobs?",
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
          BaseApi + "/admin/job/index",
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
            title: "Jobs Deleted successfully!",
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
        text: "Could not Delete Jobs",
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
          item.emp_name.toLowerCase().includes(query) ||
          item.title.toLowerCase().includes(query) ||
          item.company_name.toLowerCase().includes(query) ||
          item.created.toLowerCase().includes(query)
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
      item.emp_name.toLowerCase().includes(searchString) ||
      item.title.toLowerCase().includes(searchString) ||
      item.company_name.toLowerCase().includes(searchString) ||
      item.created.toLowerCase().includes(searchString)
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

  const getWorkType = (id) => {
    if (id === 1) {
      return "Full Time";
    }
    if (id === 2) {
      return "Part Time";
    }
    if (id === 3) {
      return "Casual";
    }
    if (id === 4) {
      return "Seasonal";
    }
    if (id === 5) {
      return "Fixed Term";
    }
  };

  useEffect(() => {
    const access = Cookies.get("access")

    if(typeof(access) !== null  || access !==  "" || access !==  undefined){

        console.log(JSON.parse(access))

        setUserAccess(JSON.parse(access))
    }else{
        setUserAccess({})
    }

  }, [])

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
                    to={"/admin/admins/dashboard"}
                  >
                    Dashboard
                  </Link>
                  <Link to="" underline="hover" color="inherit">
                    Jobs
                  </Link>

                  <Typography color="text.primary">Job List</Typography>
                </Breadcrumbs>
              </div>
              <div className="ManageSubAdminHeader">
                <h2 className="">Jobs List</h2>
                {(userAccess[3]?.Add === 1 || adminID === "1")&& <>
                <button
                  className="btn navButton1 APMSbutton"
                  onClick={() => navigate("/admin/jobs/addjob")}
                >
                  Add Job
                </button>
                </>}
              </div>
              {listData != "" ? (
                <>
                  <div className="manageSubadminPart1">
                    <form>
                      <div className="manageSubadminPart1Sec1">
                        <h4>
                          Search Job by typing Employer name, title,company name
                          or Created date
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
                          <th onClick={() => handleColumnClick("emp_name")}>
                            Employer Name {symbol}
                          </th>
                          <th onClick={() => handleColumnClick("title")}>
                            Job Title {symbol}
                          </th>

                          <th onClick={() => handleColumnClick("company_name")}>
                            Company Name {symbol}
                          </th>
                          <th>Location</th>
                          <th>Category</th>
                          <th onClick={() => handleColumnClick("created")}>
                            <CalendarMonthIcon /> Date {symbol}
                          </th>
                          <th>Jobseekers</th>

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
                                <td onClick={() => handleOpen(i)}>
                                  {i.emp_name}
                                </td>
                                <td>{i.title}</td>
                                <td>{i.company_name}</td>
                                <td>{i.location}</td>
                                <td>{i.cat_name}</td>
                                <td>{i.created}</td>
                                <td>{i.jobseeker_count}</td>
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

                                  {(userAccess[3]?.Edit === 1 || adminID === "1")&& <>

                                  <button
                                    className="btn-primary"
                                    onClick={() =>
                                      navigate(`/admin/jobs/editjob/${i.slug}`)
                                    }
                                  >
                                    <Tooltip title="Edit">
                                      <CreateIcon />
                                    </Tooltip>
                                  </button>
                                  </>}
                                  {(userAccess[3]?.Delete === 1 || adminID === "1")&& <>
                                  <button
                                    className="btn btn-secondary"
                                    onClick={() => handleDelete(i.slug)}
                                  >
                                    <Tooltip title="Delete">
                                      <DeleteIcon />
                                    </Tooltip>
                                  </button>
                                  </>}

                                  <button
                                    className="btn-primary"
                                    onClick={() => handleOpen(i)}
                                  >
                                    <Tooltip title="View">
                                      <RemoveRedEyeIcon />
                                    </Tooltip>
                                  </button>

                                  <button
                                    className="btn-secondary mt-2"
                                    onClick={() =>
                                      navigate(
                                        `/admin/jobs/candidates/${i.slug}`
                                      )
                                    }
                                  >
                                    <Tooltip title="Jobseeker List">
                                      <FormatListBulletedIcon />
                                    </Tooltip>
                                  </button>
                                  <button
                                    className="btn-primary mt-2"
                                    onClick={() =>
                                      navigate(
                                        `/admin/jobs/addjob/copy/${i.slug}`
                                      )
                                    }
                                  >
                                    <Tooltip title="Copy Details">
                                      <ContentCopyIcon />
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
                                      <h1>{selectedPayment.title}</h1>
                                    </div>
                                    <div className="modalBody mt-4">
                                      <div className="modalParent">
                                        <div className="modalLeft">
                                          Search Count:{" "}
                                        </div>
                                        <div className="modalRight">
                                          {selectedPayment.jobseeker_count}
                                        </div>
                                      </div>

                                      <div className="modalParent">
                                        <div className="modalLeft">
                                          Job View Count:{" "}
                                        </div>
                                        <div className="modalRight">
                                          {/* {selectedPayment.last_name} */}
                                        </div>
                                      </div>

                                      <div className="modalParent">
                                        <div className="modalLeft">
                                          Employer Name:{" "}
                                        </div>
                                        <div className="modalRight">
                                          {selectedPayment.emp_name}
                                        </div>
                                      </div>
                                      <div className="modalParent">
                                        <div className="modalLeft">
                                          Job Title:{" "}
                                        </div>
                                        <div className="modalRight">
                                          {selectedPayment.title}
                                        </div>
                                      </div>

                                      <div className="modalParent">
                                        <div className="modalLeft">
                                          Category:{" "}
                                        </div>
                                        <div className="modalRight">
                                          {selectedPayment.cat_name}
                                        </div>
                                      </div>

                                      <div className="modalParent">
                                        <div className="modalLeft">
                                          Company Name:{" "}
                                        </div>
                                        <div className="modalRight">
                                          {selectedPayment.company_name}
                                        </div>
                                      </div>
                                      <div className="modalParent">
                                        <div className="modalLeft">
                                          Work Type:{" "}
                                        </div>
                                        <div className="modalRight">
                                          {getWorkType(
                                            selectedPayment.work_type
                                          )}
                                        </div>
                                      </div>
                                      <div className="modalParent">
                                        <div className="modalLeft">
                                          Contact Name:{" "}
                                        </div>
                                        <div className="modalRight">
                                          {selectedPayment.contact_name}
                                        </div>
                                      </div>
                                      <div className="modalParent">
                                        <div className="modalLeft">
                                          Contact Number:{" "}
                                        </div>
                                        <div className="modalRight">
                                          {selectedPayment.contact_number}
                                        </div>
                                      </div>
                                      <div className="modalParent">
                                        <div className="modalLeft">
                                          Company Website:{" "}
                                        </div>
                                        <div className="modalRight">
                                          {selectedPayment.url}
                                        </div>
                                      </div>
                                      <div className="modalParent">
                                        <div className="modalLeft">
                                          Job Description:{" "}
                                        </div>
                                        <div className="modalRight">
                                          {selectedPayment.description
                                            ? HTMLReactParser(
                                                selectedPayment.description
                                              )
                                            : ""}
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
                      {(userAccess[3]?.Delete === 1 || adminID === 1)&& <>
                      <button
                        type="button"
                        className="btn btn-primary APButton4"
                        onClick={() => handleMultipleDelete()}
                      >
                        DELETE
                      </button>
                      </>}
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

export default APJobsList;
