import React, { useEffect, useState } from "react";
import APNavBar from "../Elements/APNavBar";
import APSidebar from "../APSidebar/APSidebar";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import BaseApi from "../../api/BaseApi";
import ApiKey from "../../api/ApiKey";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import Cookies from "js-cookie";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Select from "react-select";
import APFooter from "../Elements/APFooter";

const APHomePageSlider = () =>{

    const tokenKey = Cookies.get("token");
    const adminID = Cookies.get("adminID");
    const navigate = useNavigate();
    const [userData, setUserData] = useState([])
    const [loading, setLoading] = useState(false)
    const [employersList , setEmployersList] = useState([])
    const [selectedEmployer , setSelectedEmployer] = useState([])
    const [employerValidationError , setEmployerValidationError] = useState('')

    const handleEmployerChange = (selected) => {
        setSelectedEmployer(selected)
        setEmployerValidationError('')
    }

    const getData = async () => {
        try {
          setLoading(true);
          const response = await axios.post(
            BaseApi + `/admin/users/addemployertoslider`,
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

          console.log(response.data.response)

          setUserData(response.data.response);
          setEmployersList(response.data.response)
          //setSelectedImage(response.data.response.profile_image);
    
          //   console.log(paymentHistory);
        } catch (error) {
          setLoading(false);
          console.log("Cannot get plans data at APmanageplans");
        }
    };

    const handleClick = async () =>{
        if(selectedEmployer.length == 0){
            setEmployerValidationError('Select Employer')
        }

        if(employerValidationError == ""){

            try {
                const confirmationResult = await Swal.fire({
                    title: "Update Employer Slider List?",
                    text: "Do you want to update the Employer Slider List?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                });

                if (confirmationResult.isConfirmed) {
                    setLoading(true);
            
                    const response = await axios.post(
                        BaseApi + `/admin/users/addemployertoslider`,
                        selectedEmployer,
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
                            title: "Employer updated successfully!",
                            icon: "success",
                            confirmButtonText: "Close",
                        });

                        navigate("/admin/users/selectforslider");
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

            console.log(selectedEmployer)
        }
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



      return(
        <>
            <APNavBar />
            <div className="APBasic" style = {{ height: '100vh'}}>
                <APSidebar />
                {loading ?(
                    <>
                        <div className="loader-container"></div>
                    </>
                ):(
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
                                        onClick={() => navigate("/admin/users/selectforslider")}
                                    >
                                        Employers Slider
                                    </Link>

                                    <Typography color="text.primary">
                                        Add Employer To Slider
                                    </Typography>
                                </Breadcrumbs>
                            </div>
                            <h2 className="adminPageHeading">Add Employer To Slider</h2>
                            <form className="adminForm">
                                <div className="mb-4 mt-5">
                                    <div class="form-outline mb-5 DashBoardInputBx DashBoardCreatBx">
                                        <label for="formFile" class="form-label">
                                        Select Employer<span className="RedStar">*</span>
                                        </label>
                                        <Select
                                            isSearchable
                                            name="employer"
                                            options={employersList.map((i) => ({
                                            value: i.id,
                                            label: i.name,
                                            }))}
                                            className="basic-multi-select"
                                            value={selectedEmployer}
                                            classNamePrefix="select"
                                            onChange={handleEmployerChange}
                                        />
                                        {employerValidationError && (
                                            <div className="text-danger">{employerValidationError}</div>
                                        )}
                                    </div>

                                    <div className="APAddJobBottomButtons">
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
                                            onClick={() => navigate("/admin/users/selectforslider")}
                                        >
                                            CANCEL
                                        </button>
                                    </div>

                                </div>
                            </form>
                        </div>
                        <APFooter />
                    </>
                )}
            </div>
        </>
      )

}

export default APHomePageSlider;