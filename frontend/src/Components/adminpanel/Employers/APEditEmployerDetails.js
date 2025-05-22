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
import { useNavigate, useParams } from "react-router-dom";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import Cookies from "js-cookie";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles
import APFooter from "../Elements/APFooter";
const APEditEmployerDetails = () => {
  const editor = useRef(null);

  // const [userData, setUserData] = useState({
  //   company_name: "",
  //   company_about: "",
  //   position: "",
  //   first_name: "",
  //   last_name: "",
  //   address: "",
  //   location: "",
  //   contact: "",
  //   company_contact: "",
  //   profile_image: "",
  //   company_website: "",
  //   email_address: "",
  //   new_password: "",
  //   confirm_password: "",
  //   status: "",
  // });
  const [userData, setUserData] = useState([]);
  const [errors, setErrors] = useState({
    company_name: "",
    company_about: "",
    position: "",
    first_name: "",
    last_name: "",
    address: "",
    location: "",
    contact: "",
    company_contact: "",
    url: "",
    email_address: "",
    new_password: "",
    confirm_password: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");
  const mapKey = Cookies.get("mapKey");

  const navigate = useNavigate();

  const { slug } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/admin/users/editusers/${slug}`,
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
      setUserData(response.data.response);
      setSelectedImage(response.data.response.profile_image);

      //   console.log(paymentHistory);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get plans data at APmanageplans");
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateContactNumber = (number) => {
    const numberRegex = /^\+?\d{1,3}-?\d{9,15}$/; // Allow 1 to 15 digits
    return numberRegex.test(number);
  };

  const handleClick = async () => {
    try {
      const newErrors = {};

      if (userData.company_name === "" || userData.company_name === null) {
        newErrors.company_name = "Company Name is required";
        window.scrollTo(0, 0);
      }
      if (userData.company_about === "" || userData.company_about === null) {
        newErrors.company_about = "Company Profile is required";
        window.scrollTo(0, 0);
      }
      if (userData.position === "" || userData.position === null) {
        newErrors.position = "Position is required";
        window.scrollTo(0, 0);
      }
      if (userData.first_name === "") {
        newErrors.first_name = "First Name is required";
        window.scrollTo(0, 0);
      }
      if (userData.last_name === "") {
        newErrors.last_name = "Last Name is required";
        window.scrollTo(0, 0);
      }
      if (userData.address === "" || userData.address === null) {
        newErrors.address = "Address is required";
        window.scrollTo(0, 0);
      }
      if (userData.location === "" || userData.location === null) {
        newErrors.location = "Location is required";
        window.scrollTo(0, 0);
      }
      if (userData.contact === "") {
        newErrors.contact = "Contact Number is required";
        window.scrollTo(0, 0);
      } else if (!validateContactNumber(userData.contact)) {
        newErrors.contact = "Please enter contact number under 15 digits";
      }
      if (userData.company_contact === "") {
        newErrors.company_contact = "Company Contact Number is required";
        window.scrollTo(0, 0);
      } else if (!validateContactNumber(userData.company_contact)) {
        newErrors.company_contact =
          "Please enter contact number under 15 digits";
      }
      if (userData.email_address === "") {
        newErrors.email_address = "Email Address is required";
        // window.scrollTo(0, 0);
      } else if (!isValidEmail(userData.email_address)) {
        newErrors.email_address = "Invalid email format";
        // window.scrollTo(0, 0);
      }
      if (userData.new_password === "") {
        newErrors.new_password = "Password is required";
        // window.scrollTo(0, 0);
      }
      if (userData.confirm_password === "") {
        newErrors.confirm_password = "Confirm Password is required";
        // window.scrollTo(0, 0);
      }
      if (userData.new_password) {
        if (userData.new_password.length < 8) {
          newErrors.new_password = "Please enter atleast 8 characters";
          // window.scrollTo(0, 0);
        }
      }
      if (userData.confirm_password) {
        if (userData.confirm_password.length < 8) {
          newErrors.confirm_password = "Please enter atleast 8 characters";
          // window.scrollTo(0, 0);
        }
      }
      if (userData.new_password && userData.confirm_password) {
        if (userData.new_password !== userData.confirm_password) {
          newErrors.confirm_password =
            "Password and Confirm Password do not match";
          // window.scrollTo(0, 0);
        }
      }
      if (userData.url) {
        const urlFormat =
          /^(https?:\/\/)?(www\.)?[\w.-]+\.[a-z]{2,5}(\/\S*)?$/i;
        if (userData.url && !urlFormat.test(userData.url)) {
          newErrors.url = "Invalid URL format";
        }
      }

      setErrors(newErrors);

      // Function to validate email format
      function isValidEmail(email) {
        // Use a regular expression to validate email format
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
      }

      // const {
      //   company_name,
      //   company_about,
      //   position,
      //   first_name,
      //   last_name,
      //   address,
      //   location,
      //   contact,
      //   company_contact,
      //   company_website,
      //   email_address,
      //   new_password,
      //   confirm_password,
      // } = userData;

      // // Check if email fields are empty
      // if (
      //   !company_name ||
      //   !company_about ||
      //   !position ||
      //   !first_name ||
      //   !last_name ||
      //   !address ||
      //   !location ||
      //   !contact ||
      //   !company_contact ||
      //   !email_address
      // ) {
      //   setErrors({
      //     company_name: company_name ? "" : "Company Name is required",
      //     company_about: company_about ? "" : "Company Profile is required",
      //     position: position ? "" : "Position is required",
      //     first_name: first_name ? "" : "First Name is required",
      //     last_name: last_name ? "" : "Last Name is required",
      //     address: address ? "" : "Address is required",
      //     location: location ? "" : "Location is required",
      //     contact: contact ? "" : "Contact is required",
      //     company_contact: company_contact ? "" : "Company Number is required",
      //     email_address: email_address ? "" : "Email is required",
      //   });
      //   return;
      // }

      // if (new_password) {
      //   if (!new_password || !confirm_password) {
      //     setErrors({
      //       new_password: new_password ? "" : "New Password is required",
      //       confirm_password: confirm_password
      //         ? ""
      //         : "Confirm password is required",
      //     });
      //     return;
      //   }
      //   // Check if new email and confirm email match
      //   if (new_password !== confirm_password) {
      //     setErrors({
      //       confirm_password: "New Password and Confirm Password do not match",
      //     });
      //     return;
      //   }

      //   if (new_password.length < 8 || confirm_password.length < 8) {
      //     setErrors({
      //       new_password: "Please enter atleast 8 characters",
      //       confirm_password: "Please enter atleast 8 characters",
      //     });
      //     return;
      //   }
      // }

      // // Validate email using the validateEmail function
      // if (!validateEmail(email_address)) {
      //   setErrors({
      //     email_address: "Invalid Email Address",
      //   });
      //   return;
      // }

      // // Validate contact using the validateEmail function
      // if (!validateContactNumber(contact)) {
      //   setErrors({
      //     contact: "Please enter 10 digit number",
      //   });
      //   return;
      // }
      // if (!validateContactNumber(company_contact)) {
      //   setErrors({
      //     company_contact: "Please enter 10 digits number",
      //   });
      //   // Scroll to the input element
      //   const inputElement = document.getElementById("company_contact_input");
      //   if (inputElement) {
      //     inputElement.scrollIntoView({ behavior: "smooth" });
      //   }
      //   return;
      // }

      // if (company_website) {
      //   const urlFormat =
      //     /^(https?:\/\/)?(www\.)?[\w.-]+\.[a-z]{2,5}(\/\S*)?$/i;
      //   if (company_website && !urlFormat.test(company_website)) {
      //     setErrors({
      //       company_website: "Invalid URL format",
      //     });
      //     return;
      //   }
      // }

      // Validate password using the validatePassword function
      // if (!validatePassword(new_password)) {
      //   setErrors({
      //     New_password:
      //       "Password must be at least 8 characters long and contain at least one special character, one lowercase character, one uppercase character, and one number.",
      //   });
      //   return;
      // }

      //   if (userData.password === "") {
      //     newErrors.password = "Password is required";
      //     window.scrollTo(0, 0);
      //   }
      //   if (userData.confirm_password === "") {
      //     newErrors.confirm_password = "Confirm Password is required";
      //     window.scrollTo(0, 0);
      //   }

      // setErrors(newErrors);

      // // Function to validate email format
      // function isValidEmail(email) {
      //   // Use a regular expression to validate email format
      //   const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      //   return emailPattern.test(email);
      // }

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Update Employer?",
          text: "Do you want to update the Employer?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (confirmationResult.isConfirmed) {
          setLoading(true);

          const response = await axios.post(
            BaseApi + `/admin/users/editusers/${slug}`,
            userData,
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
            //   setUserData({
            //     ...userData,
            //     new_username: "",
            //     conf_username: "",
            //   });
            //   window.scrollTo(0, 0);
            navigate("/admin/users");
          } else {
            Swal.fire({
              title: response.data.message,
              icon: "error",
              confirmButtonText: "Close",
            });
          }
        }
        // }
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not update employer. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not change username!", error);
    }
  };

  // const handleFileUpload1 = async (e) => {
  //   const file = e.target.files[0];
  //   const base64 = await convertToBase64(file);
  //   setUserData({ ...userData, profile_image: base64 });
  //   setSelectedImage(base64);
  // };
  const handleFileUpload1 = async (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];

    // Check if the file is selected
    if (file) {
      // Check the file size (in bytes)
      const fileSizeInBytes = file.size;
      const maxSizeInBytes = 600 * 1024; // 1MB

      if (fileSizeInBytes > maxSizeInBytes) {
        Swal.fire({
          title: "Image size should be under 600KB",
          icon: "warning",
          confirmButtonText: "Close",
        });
        fileInput.value = ""; // Clear the file input
        return;
      }

      // Check image resolution
      const img = new Image();
      img.src = window.URL.createObjectURL(file);

      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        if (width < 250 || height < 250) {
          Swal.fire({
            title: "Minimum image resolution should be 250x250 pixels",
            icon: "warning",
            confirmButtonText: "Close",
          });
          fileInput.value = ""; // Clear the file input
        } else {
          // Clear the image error
          setErrors({
            ...errors,
            profile_image: "",
          });

          // Convert the image to base64
          convertToBase64(file).then((base64) => {
            setUserData({ ...userData, profile_image: base64 });
            setSelectedImage(base64);
          });
        }
      };
    }
  };

  const deleteImage = () => {
    setSelectedImage(null);
    setUserData({ ...userData, profile_image: "" });

    window.location.reload();
  };

  const handleStatusChange = (e) => {
    e.preventDefault();
    if (userData.status === 1) {
      setUserData({ ...userData, status: 0 });
    }
    if (userData.status === 0) {
      setUserData({ ...userData, status: 1 });
    }
  };

  // Code for loading Location

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
    if (value != "") {
      setErrors({
        location: "",
      });
    }

    setUserData((prevFilter) => ({
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
    if (userData.location === "") {
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
    // console.log(filterItem);
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
                    onClick={() => navigate("/admin/users")}
                  >
                    Employers
                  </Link>

                  <Typography color="text.primary">
                    Edit Employer Details
                  </Typography>
                </Breadcrumbs>
              </div>
              <h2 className="adminPageHeading">Edit Employer</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Company Name<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.company_name && "input-error"
                      }`}
                      name="company_name"
                      placeholder="Company Name"
                      value={userData.company_name}
                      onChange={handleChange}
                      disabled
                    />
                    {errors.company_name && (
                      <div className="text-danger">{errors.company_name}</div>
                    )}
                  </div>
                  <div className=" mb-5 DashBoardInputBx DashBoardCreatBx APJoditEditor">
                    <label className="form-label" htmlFor="form3Example3">
                      Company Profile<span className="RedStar">*</span>
                    </label>
                    {/* <JoditEditor
                      ref={editor}
                      name="company_about"
                      value={userData.company_about}
                      onChange={(company_about) =>
                        handleChange({
                          target: {
                            value: company_about,
                            name: "company_about",
                          },
                        })
                      }
                    /> */}
                    <ReactQuill
                      theme="snow"
                      value={userData.company_about}
                      onChange={(value) =>
                        handleChange({
                          target: { name: "company_about", value },
                        })
                      }
                      style={{ minHeight: "250px", height: "200px" }}
                      placeholder="Add your text here..."
                    />
                    {errors.company_about && (
                      <div className="text-danger">{errors.company_about}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Position<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.position && "input-error"
                      }`}
                      name="position"
                      value={userData.position}
                      placeholder="Position"
                      onChange={handleChange}
                    />
                    {errors.position && (
                      <div className="text-danger">{errors.position}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      First Name<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.first_name && "input-error"
                      }`}
                      name="first_name"
                      value={userData.first_name}
                      placeholder="First Name"
                      onChange={handleChange}
                    />
                    {errors.first_name && (
                      <div className="text-danger">{errors.first_name}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Last Name<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.last_name && "input-error"
                      }`}
                      name="last_name"
                      value={userData.last_name}
                      placeholder="Last Name"
                      onChange={handleChange}
                    />
                    {errors.last_name && (
                      <div className="text-danger">{errors.last_name}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Address<span className="RedStar">*</span>
                    </label>
                    <textarea
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.address && "input-error"
                      }`}
                      name="address"
                      value={userData.address}
                      placeholder="Address"
                      onChange={handleChange}
                    />
                    {errors.address && (
                      <div className="text-danger">{errors.address}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Image
                    </label>
                    <input
                      class="form-control"
                      type="file"
                      id="formFile"
                      label="Image"
                      name="logo"
                      accept=".jpeg, .png, .jpg"
                      onChange={(e) => handleFileUpload1(e)}
                    />
                    {/* {errors.image && (
                    <div className="text-danger">{errors.image}</div>
                  )} */}
                    <div id="emailHelp" class="form-text">
                      Supported File Types: gif, jpg, jpeg, png (Max. 600KB).
                      Min file size 250 X 250 pixels.
                    </div>
                    {selectedImage && (
                      <div>
                        <img
                          className="selectedInputImage"
                          src={selectedImage}
                          alt="Selected"
                        />
                        {userData.profile_image ? (
                          // <button
                          //   className="APButton3"
                          //   type="button"
                          //   //   onClick={() => deleteImageWithSlug(slug)}
                          // >
                          //   Delete
                          // </button>
                          ""
                        ) : (
                          <button className="APButton3" onClick={deleteImage}>
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Location<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.location && "input-error"
                      }`}
                      name="location"
                      value={userData.location}
                      placeholder="Location"
                      onChange={handleLocationChange}
                    />
                    {suggestions.length > 0 && (
                      <div
                        className="suggestionsAdminSide"
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
                                </div>{" "}
                              </li>
                            </div>
                          ))}
                        </ul>
                      </div>
                    )}
                    {errors.location && (
                      <div className="text-danger">{errors.location}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Contact Number<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.contact && "input-error"
                      }`}
                      name="contact"
                      value={userData.contact}
                      placeholder="Contact Number"
                      onChange={handleChange}
                    />
                    {errors.contact && (
                      <div className="text-danger">{errors.contact}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Company Contact Number<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="company_contact_input"
                      className={`form-control ${
                        errors.company_contact && "input-error"
                      }`}
                      name="company_contact"
                      value={userData.company_contact}
                      placeholder="Company Contact Number"
                      onChange={handleChange}
                    />
                    {errors.company_contact && (
                      <div className="text-danger">
                        {errors.company_contact}
                      </div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Company Website
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${errors.url && "input-error"}`}
                      name="url"
                      value={userData.url}
                      placeholder="Company Website"
                      onChange={handleChange}
                    />
                    {errors.url && (
                      <div className="text-danger">{errors.url}</div>
                    )}
                    <div id="emailHelp" className="form-text">
                      Eg: https://www.google.com or https://google.com
                    </div>
                  </div>
                  <hr />
                  <h4 className="mb-4">Login Details</h4>

                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Email Address<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.email_address && "input-error"
                      }`}
                      name="email_address"
                      value={userData.email_address}
                      placeholder="Email Address"
                      onChange={handleChange}
                      disabled
                    />
                    {errors.email_address && (
                      <div className="text-danger">{errors.email_address}</div>
                    )}
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Password<span className="RedStar">*</span>
                    </label>
                    <input
                      type="password"
                      id="form3Example1"
                      className={`form-control ${
                        errors.password && "input-error"
                      }`}
                      name="new_password"
                      value={userData.new_password}
                      placeholder="Password"
                      onChange={handleChange}
                    />
                    {errors.new_password && (
                      <div className="text-danger">{errors.new_password}</div>
                    )}
                    <div id="emailHelp" class="form-text">
                      * Note: If You want to change User's password, only then
                      fill password below otherwise leave it blank.
                    </div>
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Confirm Password<span className="RedStar">*</span>
                    </label>
                    <input
                      type="password"
                      id="form3Example1"
                      className={`form-control ${
                        errors.confirm_password && "input-error"
                      }`}
                      name="confirm_password"
                      value={userData.confirm_password}
                      placeholder="Confirm Password"
                      onChange={handleChange}
                    />
                    {errors.confirm_password && (
                      <div className="text-danger">
                        {errors.confirm_password}
                      </div>
                    )}
                  </div>
                  <hr />
                  <div className="otherSection">
                    <h4 className="">Other Details</h4>
                    <div class="otherSectionBody">
                      <p>Employer Status</p>
                      <div className="activeButtonBox">
                        {userData.status === 1 ? (
                          <button
                            className="activeTrue"
                            onClick={handleStatusChange}
                          >
                            Active
                          </button>
                        ) : (
                          <button
                            className="activeFalse"
                            onClick={handleStatusChange}
                          >
                            Inactive
                          </button>
                        )}
                      </div>
                    </div>

                    <div id="emailHelp" className="form-text">
                      Click above to change Employer's status. Changes will be
                      reflect only after submitting form.
                    </div>
                    <div id="emailHelp" className="text-danger">
                      Changes will be reflect only after submitting form.
                    </div>
                  </div>
                  <div className="adminBottomButtons">
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
                      onClick={() => navigate("/admin/users")}
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
  );
};

export default APEditEmployerDetails;

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
