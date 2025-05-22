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
import { useRef } from "react";
import Cookies from "js-cookie";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import APFooter from "../Elements/APFooter";

const APAddEmployer = () => {
  const editor = useRef(null);

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    contact: "",
    location: "",
    profile_image: "",
    email_address: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    contact: "",
    location: "",
    email_address: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");
  const mapKey = Cookies.get("mapKey");

  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateContactNumber = (number) => {
    const numberRegex = /^\+?\d{1,3}-?\d{9,15}$/;
    return numberRegex.test(number);
  };

  const handleClick = async () => {
    try {
      // const newErrors = {};

      // if (userData.first_name === "") {
      //   newErrors.first_name = "First Name is required";
      //   window.scrollTo(0, 0);
      // }
      // if (userData.last_name === "") {
      //   newErrors.last_name = "Last Name is required";
      //   window.scrollTo(0, 0);
      // }
      // if (userData.contact === "") {
      //   newErrors.contact = "Contact is required";
      //   window.scrollTo(0, 0);
      // }
      // if (userData.location === "") {
      //   newErrors.location = "Location is required";
      //   window.scrollTo(0, 0);
      // }
      // if (userData.email_address === "") {
      //   newErrors.email_address = "Email Address is required";
      //   window.scrollTo(0, 0);
      // } else if (!isValidEmail(userData.email_address)) {
      //   newErrors.email_address = "Invalid email format";
      //   window.scrollTo(0, 0);
      // }
      // if (userData.password === "") {
      //   newErrors.password = "Password is required";
      //   window.scrollTo(0, 0);
      // }
      // if (userData.confirm_password === "") {
      //   newErrors.confirm_password = "Confirm Password is required";
      //   window.scrollTo(0, 0);
      // }
      // if (userData.password !== userData.confirm_password) {
      //   newErrors.confirm_password =
      //     "Password and Confirm Password do not match";
      //   window.scrollTo(0, 0);
      // }

      // setErrors(newErrors);

      // // Function to validate email format
      // function isValidEmail(email) {
      //   // Use a regular expression to validate email format
      //   const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      //   return emailPattern.test(email);
      // }

      const {
        first_name,
        last_name,
        contact,
        location,
        email_address,
        password,
        confirm_password,
      } = userData;

      if (
        !first_name ||
        !last_name ||
        !contact ||
        !location ||
        !email_address ||
        !password ||
        !confirm_password
      ) {
        setErrors({
          first_name: first_name ? "" : "First Name is required",
          last_name: last_name ? "" : "Last Name is required",
          contact: contact ? "" : "Contact Number is required",
          location: location ? "" : "Location is required",
          email_address: email_address ? "" : "Email is required",
          password: password ? "" : "Password is required",
          confirm_password: confirm_password
            ? ""
            : "Confirm password is required",
        });
        return;
      }

      if (password !== confirm_password) {
        setErrors({
          confirm_password: "Password and Confirm Password do not match",
        });
        return;
      }

      if (password.length < 8 || confirm_password.length < 8) {
        setErrors({
          password: "Please enter atleast 8 characters",
          confirm_password: "Please enter atleast 8 characters",
        });
        return;
      }

      // Validate email using the validateEmail function
      if (!validateEmail(email_address)) {
        setErrors({
          email_address: "Invalid Email Address",
        });
        return;
      }

      // Validate contact using the validateEmail function
      if (!validateContactNumber(contact)) {
        setErrors({
          contact: "Please enter contact number under 15 digits",
        });
        return;
      }
      // if (Object.keys(newErrors).length === 0) {

      const confirmationResult = await Swal.fire({
        title: "Add Jobseeker?",
        text: "Do you want to Add this Jobseeker?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (confirmationResult.isConfirmed) {
        setLoading(true);

        const response = await axios.post(
          BaseApi + "/admin/candidates/addusers",
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
            title: "Jobseeker added successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          // setUserData({
          //   ...userData,
          //   new_username: "",
          //   conf_username: "",
          // });
          // window.scrollTo(0, 0);
          navigate("/admin/candidates");
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
      }
      // }
      // }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not add jobseeker. Please try again later!",
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

  //   // Clear the image error
  //   setErrors({
  //     ...errors,
  //     profile_image: "",
  //   });
  // };

  const handleFileUpload1 = async (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];

    // Check if the file is selected
    if (file) {
      // Check the file size (in bytes)
      const fileSizeInBytes = file.size;
      const maxSizeInBytes = 600 * 1024; // 2MB
      if (fileSizeInBytes > maxSizeInBytes) {
        Swal.fire({
          title: "Image size should be under 600 KB",
          icon: "warning",
          confirmButtonText: "Close",
        });
        // setErrors({
        //   ...errors,
        //   image: "Image size should be under 2MB",
        // });
        // Clear the file input
        fileInput.value = ""; // This clears the input
        // setSelectedImage("")
        // setUserData({ ...userData, image: "" });
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
          // setErrors({
          //   ...errors,
          //   image: "Image resolution should be 1920x634 pixels",
          // });
          // Clear the file input
          fileInput.value = ""; // This clears the input
          // setSelectedImage("")
          // setUserData({ ...userData, image: "" });
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

    // window.location.reload();
  };

  const handleReset = () => {
    setUserData({
      first_name: "",
      last_name: "",
      contact: "",
      location: "",
      profile_image: "",
      email_address: "",
      password: "",
      confirm_password: "",
    });
    window.location.reload();
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
      // getData();
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
              <div className="breadCumb" role="presentation">
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
                    Jobseeker
                  </Link>

                  <Typography color="text.primary">
                    Add Jobseeker Details
                  </Typography>
                </Breadcrumbs>
              </div>
              <h2 className="adminPageHeading">Add Jobseeker</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5">
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
                      Profile Image
                    </label>
                    <input
                      class="form-control"
                      type="file"
                      id="formFile"
                      label="profile_image"
                      name="logo"
                      accept=".jpeg, .png, .jpg"
                      onChange={(e) => handleFileUpload1(e)}
                    />

                    <div id="emailHelp" class="form-text">
                      Supported File Types: gif, jpg, jpeg, png (Max. 600 KB).
                      Min file size 250 X 250 pixels.
                    </div>
                    {selectedImage && (
                      <div>
                        <img
                          className="selectedInputImage"
                          src={selectedImage}
                          alt="Selected"
                        />
                        <button className="APButton3" onClick={deleteImage}>
                          Remove
                        </button>
                      </div>
                    )}
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
                      name="password"
                      value={userData.password}
                      placeholder="Password"
                      onChange={handleChange}
                    />
                    {errors.password && (
                      <div className="text-danger">{errors.password}</div>
                    )}
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
              </form>
            </div>
            <APFooter />
          </>
        )}
      </div>
    </>
  );
};

export default APAddEmployer;

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
