import React, { useEffect, useState } from "react";
import APNavBar from "../Elements/APNavBar";
import APSidebar from "../APSidebar/APSidebar";
import axios from "axios";
import BaseApi from "../../api/BaseApi";
import ApiKey from "../../api/ApiKey";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";
import Cookies from "js-cookie";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import APFooter from "../Elements/APFooter";

const APAddBlog = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [checkedData, setCheckedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState([]);
  const tokenKey = Cookies.get("token");
  const adminID = parseInt(Cookies.get("adminID"));

  const [currentPage, setCurrentPage] = useState(1);
  const [jobseekerGraphData, setJobseekerGraphData] = useState([]);
  const [employerGraphData, setEmployerGraphData] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [jobseekersList, setJobseekersList] = useState([]);
  const itemsPerPage = 3;
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userAccess , setUserAccess] = useState({})
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
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  // const data = [
  //   {
  //     name: "Jan",
  //     uv: 40,
  //     Employer: 24,
  //     // amt: 2400,
  //     range: 20,
  //   },
  //   {
  //     name: "Feb",
  //     uv: 30,
  //     Employer: 13,
  //     // amt: 2210,
  //     range: 40,
  //   },
  //   {
  //     name: "Mar",
  //     uv: 20,
  //     Employer: 98,
  //     // amt: 2290,
  //     range: 60,
  //   },
  //   {
  //     name: "Apr",
  //     // uv: 27,
  //     Employer: 39,
  //     // amt: 2000,
  //     range: 80,
  //   },
  //   {
  //     name: "May",
  //     // uv: 18,
  //     Employer: 48,
  //     // amt: 2181,
  //     range: 100,
  //   },
  //   {
  //     name: "Jun",
  //     // uv: 23,
  //     pv: 38,
  //     // amt: 2500,
  //     range: 120,
  //   },
  //   {
  //     name: "Jul",
  //     // uv: 34,
  //     pv: 43,
  //     // amt: 2100,
  //     range: 140,
  //   },
  // ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(BaseApi + "/admin/dashboard", null, {
        headers: {
          "Content-Type": "application/json",
          key: ApiKey,
          token: tokenKey,
          adminid: adminID,
        },
      });
      setLoading(false);
      setUserData(response.data.response);
      setEmployeesList(response.data.response.employees);
      setJobseekersList(response.data.response.jobseekers);
      setJobseekerGraphData(response.data.response.jobseekerchart);
      setEmployerGraphData(response.data.response.employerchart);
      console.log(employeesList);
    } catch (error) {
      console.log("Error at Dashboard at Admin panel");
    }
  };

  // const handleClick = async () => {
  //   try {
  //     // if (!userData.title || !userData.description || !userData.image || userData.meta_title || userData.meta_description || userData.meta_keywords) {
  //     //   Swal.fire({
  //     //     title: "Please fill all the fields!",
  //     //     icon: "warning",
  //     //     confirmButtonText: "Close",
  //     //   });
  //     // } else {
  //     const confirmationResult = await Swal.fire({
  //       title: "Add Blog?",
  //       text: "Do you want to Add this Blog?",
  //       icon: "question",
  //       showCancelButton: true,
  //       confirmButtonText: "Yes",
  //       cancelButtonText: "No",
  //     });

  //     if (confirmationResult.isConfirmed) {
  //       setLoading(true);

  //       const response = await axios.post(
  //         BaseApi + "/admin/blog/admin_addblogs",
  //         userData,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             key: ApiKey,
  //             token: tokenKey,
  //             adminid: adminID,
  //           },
  //         }
  //       );

  //       setLoading(false);

  //       if (response.data.status === 200) {
  //         Swal.fire({
  //           title: "Blog added successfully!",
  //           icon: "success",
  //           confirmButtonText: "Close",
  //         });
  //         navigate("/admin/blogs");
  //         setUserData({
  //           ...userData,
  //           title: "",
  //           description: "",
  //           image: "",
  //           meta_title: "",
  //           meta_keywords: "",
  //           meta_description: "",
  //         });
  //         window.scrollTo(0, 0);
  //       } else {
  //         Swal.fire({
  //           title: response.data.message,
  //           icon: "error",
  //           confirmButtonText: "Close",
  //         });
  //       }
  //     }
  //     // }
  //   } catch (error) {
  //     setLoading(false);
  //     Swal.fire({
  //       title: "Failed",
  //       text: "Could not add Blog. Please try again later!",
  //       icon: "error",
  //       confirmButtonText: "Close",
  //     });
  //     console.log("Could not add blog!", error);
  //   }
  // };

  // const [selectAll, setSelectAll] = useState(true);

  // const handleCheck = (id) => {
  //   // Check if the id is 'selectAll', indicating the "Select All" checkbox
  //   if (id === "selectAll") {
  //     // If it's "Select All", toggle the selectAll state
  //     setSelectAll(!selectAll);

  //     // If selectAll is true, select all checkboxes, else unselect all
  //     const updatedCheckedData = selectAll
  //       ? listData.map((item) => item.id)
  //       : [];
  //     setCheckedData(updatedCheckedData);
  //   } else {
  //     // Individual checkbox handling remains the same
  //     if (checkedData.includes(id)) {
  //       // If the ID is already in the array, remove it
  //       setCheckedData(checkedData.filter((checkedId) => checkedId !== id));
  //     } else {
  //       // If the ID is not in the array, add it
  //       setCheckedData([...checkedData, id]);
  //     }
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
  const handleActivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Activate",
        text: "Do you want to Activate?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);
        const response = await axios.post(
          BaseApi + `/admin/users/activateuser/${slug}`,
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
            title: "Activated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          getData();
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
        // getData();
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed. Please try after some time!",
        text: "Could not Activate",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't activate the record!", error.message);
    }
  };
  const handleDeactivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Deactivate",
        text: "Do you want to Deactivate?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);
        const response = await axios.post(
          BaseApi + `/admin/users/deactivateuser/${slug}`,
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
            title: "Deactivated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          getData();
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
        // getData();
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed. Please try after some time!",
        text: "Could not Deactivate",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't deactivate the record!", error.message);
    }
  };
  const handleDelete = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Delete",
        text: "Do you want to Delete?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);
        const response = await axios.post(
          BaseApi + `/admin/users/deleteusers/${slug}`,
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
            title: "Deleted successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          getData();
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
        // getData();
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed. Please try after some time!",
        text: "Could not Delete",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't delete the record!", error.message);
    }
  };

  const [symbol, setSymbol] = useState("🔺");

  const handleColumnClick = () => {
    console.log("Work");
  };

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
      <div className="APBasic">
        <APSidebar />

        {loading ? (
          <>
            <div className="loader-container"></div>
          </>
        ) : (
          <>
            <div className="site-min-height">
              <div className="dashboardHeader">
                <h2 className="">Dashboard</h2>
                <p>Here is the information about all the records</p>
              </div>
              <div className="dashboardBody">
                <div className="dashboardSection1 row">
                  {(userAccess[0]?.Module === 1 || adminID === 1)&& <>
                  <div className="col-md-3">
                    <Link to="/admin/users">
                      <div className="dashboardCard1">
                        <div className="cardUpperLeft">
                          <p>Employers</p>
                        </div>
                        {/* <div className="cardUpperRight">
                        <input type="checkbox" />
                      </div> */}
                        <div className="cardCenter">
                          <h3>{userData.total_customers}</h3>
                        </div>
                        <div className="cardLower">
                        
                          <div className="cardLowerImg">
                          <img src="/Images/adminpanel/new.png" />
                        </div>
                          {/* <div className="cardLowerTxt">
                          <p>
                            10.2
                            <span className="lowerCardInnerTxt">Increased</span>
                          </p>
                        </div> */}
                        </div>
                      </div>
                    </Link>
                  </div>
                  </>}

                  {(userAccess[2]?.Module === 1 || adminID === 1)&& <>
                  <div className="col-md-3">
                    <Link to="/admin/candidates">
                      <div className="dashboardCard2">
                        <div className="cardUpperLeft">
                          <p>Jobseeker</p>
                        </div>
                        {/* <div className="cardUpperRight">
                        <input type="checkbox" />
                      </div> */}
                        <div className="cardCenter">
                          <h3>{userData.total_candidate}</h3>
                        </div>
                        <div className="cardLower">
                        <div className="cardLowerImg">
                          <img src="/Images/adminpanel/Jobseeker.png" />
                        </div>
                          {/* <div className="cardLowerTxt">
                          <p>
                            10.2
                            <span className="lowerCardInnerTxt">Increased</span>
                          </p>
                        </div> */}
                        </div>
                      </div>
                    </Link>
                  </div>
                  </>}

                  {(userAccess[3]?.Module === 1 || adminID === 1)&& <>
                  <div className="col-md-3">
                    <Link to="/admin/jobs">
                      <div className="dashboardCard3">
                        <div className="cardUpperLeft">
                          <p>Jobs</p>
                        </div>
                        {/* <div className="cardUpperRight">
                        <input type="checkbox" />
                      </div> */}
                        <div className="cardCenter">
                          <h3>{userData.total_job}</h3>
                        </div>
                        <div className="cardLower">
                        <div className="cardLowerImg">
                          <img src="/Images/adminpanel/Jobs.png" />
                        </div>
                          {/* <div className="cardLowerTxt">
                          <p>
                            10.2
                            <span className="lowerCardInnerTxt">Increased</span>
                          </p>
                        </div> */}
                        </div>
                      </div>
                    </Link>
                  </div>
                  </>}

                  {(userAccess[8]?.Module === 1 || adminID === 1)&& <>
                  <div className="col-md-3">
                    <Link to="/admin/skills">
                      <div className="dashboardCard4">
                        <div className="cardUpperLeft">
                          <p>Skills</p>
                        </div>
                        {/* <div className="cardUpperRight">
                        <input type="checkbox" />
                      </div> */}
                        <div className="cardCenter">
                          <h3>{userData.total_skill}</h3>
                        </div>
                        <div className="cardLower">
                        <div className="cardLowerImg">
                          <img src="/Images/adminpanel/Skills.png" />
                        </div>
                          {/* <div className="cardLowerTxt">
                          <p>
                            10.2
                            <span className="lowerCardInnerTxt">Increased</span>
                          </p>
                        </div> */}
                        </div>
                      </div>
                    </Link>
                  </div>
                  </>}
                </div>
                <div className="dashboardSection2 row">
                  {(userAccess[0]?.Module === 1 || adminID === 1)&& <>
                  <div className="col-md-6">
                    <h4>Employer</h4>
                    <div style={{ width: "100%" }}>
                      <LineChart
                        width={600}
                        height={400}
                        data={employerGraphData}
                        margin={{
                          top: 50,
                          right: 30,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis dataKey="range" />

                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="Employer"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                        {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
                      </LineChart>
                    </div>
                  </div>
                  </>}

                  {(userAccess[2]?.Module === 1 || adminID === 1)&& <>
                  <div className="col-md-6">
                    <h4>Jobseeker</h4>
                    <div style={{ width: "100%" }}>
                      <LineChart
                        width={600}
                        height={400}
                        data={jobseekerGraphData}
                        margin={{
                          top: 50,
                          right: 30,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis dataKey="range" />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="Jobseeker"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                        {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
                      </LineChart>
                    </div>
                  </div>
                  </>}

                </div>

                {(userAccess[0]?.Module === 1 || adminID === 1)&& <>
                <div className="dashboardSection3 manageSubadminPart2">
                  <div className="tableHeader">
                    <p>Employer List</p>
                    <button
                      className="tableHeaderButton"
                      onClick={() => navigate("/admin/users")}
                    >
                      View All
                    </button>
                  </div>
                  <table className="table">
                    <thead>
                      <tr>
                        {/* <th className="checkBoxCol checkBxHead">
                            <input
                              type="checkbox"
                              className="tableCheckBox"
                              // checked={selectAll}

                              onClick={() => handleCheck("selectAll")}
                            />
                          </th> */}
                        <th onClick={() => handleColumnClick("company_name")}>
                          Company Name {symbol}
                        </th>
                        <th onClick={() => handleColumnClick("full_name")}>
                          Full Name {symbol}
                        </th>
                        <th onClick={() => handleColumnClick("position")}>
                          Position {symbol}
                        </th>
                        <th onClick={() => handleColumnClick("email")}>
                          Email {symbol}
                        </th>
                        <th onClick={() => handleColumnClick("current_plan")}>
                          Current Plan {symbol}
                        </th>
                        <th onClick={() => handleColumnClick("created")}>
                          Created {symbol}
                        </th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeesList?.map((i) => {
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
                              <td>{i.fullname}</td>
                              <td>{i.position}</td>
                              <td>{i.email_address}</td>
                              <td>{i.current_plan}</td>
                              <td>{i.created}</td>

                              <td className="APActionButton">
                                {i.status === 1 ? (
                                  <button
                                    className="btn-secondary"
                                    onClick={() => handleDeactivate(i.slug)}
                                  >
                                    {/* <Tooltip title="Deactivate"> */}
                                    <CheckIcon />
                                    {/* </Tooltip> */}
                                  </button>
                                ) : (
                                  <button
                                    className="btn-secondary"
                                    onClick={() => handleActivate(i.slug)}
                                  >
                                    {/* <Tooltip title="Activate"> */}
                                    <BlockIcon />
                                    {/* </Tooltip> */}
                                  </button>
                                )}
                                {(userAccess[0]?.Edit === 1 || adminID === 1)&& <>
                                <button
                                  className="btn-primary"
                                  onClick={() =>
                                    navigate(`/admin/users/editusers/${i.slug}`)
                                  }
                                >
                                  {/* <Tooltip title="Edit"> */}
                                  <CreateIcon />
                                  {/* </Tooltip> */}
                                </button>
                                </>}
                                {(userAccess[0]?.Delete === 1 || adminID === 1)&& <>
                                <button
                                  className="btn btn-secondary"
                                  onClick={() => handleDelete(i.slug)}
                                >
                                  {/* <Tooltip title="Delete"> */}
                                  <DeleteIcon />
                                  {/* </Tooltip> */}
                                </button>
                                </>}
                              </td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                </>}
                {(userAccess[2]?.Module === 1 || adminID === 1)&& <>
                <div className="dashboardSection4 manageSubadminPart2">
                  <div className="tableHeader">
                    <p>Jobseeker List</p>
                    <button
                      className="tableHeaderButton"
                      onClick={() => navigate("/admin/candidates")}
                    >
                      View All
                    </button>
                  </div>
                  <table className="table">
                    <thead>
                      <tr>
                        {/* <th className="checkBoxCol checkBxHead">
                            <input
                              type="checkbox"
                              className="tableCheckBox"
                              // checked={selectAll}

                              onClick={() => handleCheck("selectAll")}
                            />
                          </th> */}

                        <th onClick={() => handleColumnClick("full_name")}>
                          Full Name {symbol}
                        </th>

                        <th onClick={() => handleColumnClick("email")}>
                          Email {symbol}
                        </th>
                        <th onClick={() => handleColumnClick("phone")}>
                          Phone {symbol}
                        </th>
                        <th onClick={() => handleColumnClick("location")}>
                          Location {symbol}
                        </th>
                        <th onClick={() => handleColumnClick("created")}>
                          Created {symbol}
                        </th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobseekersList?.map((i) => {
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
                              <td>{i.fullname}</td>
                              <td>{i.email_address}</td>
                              <td>{i.contact}</td>
                              <td>{i.location?.substring(0, 10)}</td>

                              <td>{i.created}</td>

                              <td className="APActionButton">
                                {i.status === 1 ? (
                                  <button
                                    className="btn-secondary"
                                    onClick={() => handleDeactivate(i.slug)}
                                  >
                                    {/* <Tooltip title="Deactivate"> */}
                                    <CheckIcon />
                                    {/* </Tooltip> */}
                                  </button>
                                ) : (
                                  <button
                                    className="btn-secondary"
                                    onClick={() => handleActivate(i.slug)}
                                  >
                                    {/* <Tooltip title="Activate"> */}
                                    <BlockIcon />
                                    {/* </Tooltip> */}
                                  </button>
                                )}
                                {(userAccess[2]?.Edit === 1 || adminID === 1)&& <>
                                <button
                                  className="btn-primary"
                                  onClick={() =>
                                    navigate(
                                      `/admin/candidates/editcandidates/${i.slug}`
                                    )
                                  }
                                >
                                  {/* <Tooltip title="Edit"> */}
                                  <CreateIcon />
                                  {/* </Tooltip> */}
                                </button>
                                </>}
                                {(userAccess[2]?.Delete === 1 || adminID === 1)&& <>
                                <button
                                  className="btn btn-secondary"
                                  onClick={() => handleDelete(i.slug)}
                                >
                                  {/* <Tooltip title="Delete"> */}
                                  <DeleteIcon />
                                  {/* </Tooltip> */}
                                </button>
                                </>}
                              </td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                </>}
              </div>
            </div>
            <APFooter />
          </>
        )}
      </div>
    </>
  );
};

export default APAddBlog;

// function convertToBase64(file) {
//   return new Promise((resolve, reject) => {
//     const fileReader = new FileReader();
//     fileReader.readAsDataURL(file);
//     fileReader.onload = () => {
//       resolve(fileReader.result);
//     };
//     fileReader.onerror = (error) => {
//       reject(error);
//     };
//   });
// }
