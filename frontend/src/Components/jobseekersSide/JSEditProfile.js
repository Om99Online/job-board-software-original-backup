import React, { useEffect, useState } from "react";
import JSSidebar from "./JSSidebar";
import NavBar from "../element/NavBar";
import Footer from "../element/Footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ApiKey from "../api/ApiKey";
import BaseApi from "../api/BaseApi";
// import Multiselect from "multiselect-react-dropdown";
import JoditEditor from "jodit-react";
import Select from "react-select";
import { useRef } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles
const JSEditProfile = () => {
  const [loading, setLoading] = useState(false);
  const [editProfile, setEditProfile] = useState([]);
  const [skillList, setSkillList] = useState([]);
  const [experience, setExperience] = useState([]);
  const [interest_categories, setInterest_categories] = useState([]);
  const [coverLetter, setCoverLetter] = useState([
    {
      title: "",
      description: "",
    },
  ]);
  const [selectedCV, setSelectedCV] = useState([]);
  // const [isCVPicked, setIsCVPicked] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState([]);
  const [oldDocuments, setOldDocuments] = useState([]);
  const [oldCertificates, setOldCertificates] = useState([]);
  const [docDownloadPath, setDocDownloadPath] = useState();
  const [downloadActive, setDownloadActive] = useState(false);

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedCat, setSelectedCat] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  // const [updatedSkills, setUpdatedSkill] = useState([]);
  // const [updatedCat, setUpdatedCat] = useState([]);

  const editor = useRef(null);
  const navigate = useNavigate();
  const tokenKey = Cookies.get("tokenClient");
  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  const mapKey = Cookies.get("mapKey");
  const [t, i18n] = useTranslation("global");

  const [hoverFirstButtonColor, setHoverFirstButtonColor] = useState(false);

  const handleFirstButtonMouseEnter = () => {
    setHoverFirstButtonColor(true);
  };

  const handleFirstButtonMouseLeave = () => {
    setHoverFirstButtonColor(false);
  };

  const [hoverSecondButtonColor, setHoverSecondButtonColor] = useState(false);

  const handleSecondButtonMouseEnter = () => {
    setHoverSecondButtonColor(true);
  };

  const handleSecondButtonMouseLeave = () => {
    setHoverSecondButtonColor(false);
  };

  const [hoverThirdButtonColor, setHoverThirdButtonColor] = useState(false);

  const handleThirdButtonMouseEnter = () => {
    setHoverThirdButtonColor(true);
  };

  const handleThirdButtonMouseLeave = () => {
    setHoverThirdButtonColor(false);
  };

  const [hoverFourthButtonColor, setHoverFourthButtonColor] = useState(false);

  const handleFourthButtonMouseEnter = () => {
    setHoverFourthButtonColor(true);
  };

  const handleFourthButtonMouseLeave = () => {
    setHoverFourthButtonColor(false);
  };

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    location: "",
    contact: "",
    pre_location: "",
    skills: [],
    exp_salary: "",
    total_exp: "",
    company_about: "",
    url: "",
  });

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/candidates/editProfile",
        null, // Pass null as the request body if not required
        {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            token: tokenKey,
          },
        }
      );
      if (response.data.status === 200) {
        var selectedSkillsName = response.data.response.skills;

        if (selectedSkillsName) {
          // code to handel preselected skills
          var skillList = response.data.response.skillList;

          var SelectSkills = [];
          skillList.forEach((element) => {
            for (let i = 0; i < selectedSkillsName.length; i++) {
              if (selectedSkillsName[i] === element.name) {
                let obj = {
                  value: element.id,
                  label: element.name,
                };

                SelectSkills.push(obj);
              }
            }
          });
        }
        // console.log("object");

        console.log(SelectSkills);

        setSelectedSkills(SelectSkills);

        // code to handel pre selected interest category

        var categoryList = response.data.response.categoryList;
        var interestCategory = response.data.response.interest_categories;
        var selectedCat = [];

        categoryList.forEach((element) => {
          for (let i = 0; i < interestCategory.length; i++) {
            if (parseInt(interestCategory[i]) === element.id) {
              let obj = {
                value: element.id,
                label: element.name,
              };
              selectedCat.push(obj);
            }
          }
        });

        setSelectedCat(selectedCat);
        setCategoryList(response.data.response.categoryList);

        setLoading(false);
        setEditProfile(response.data.response);
        setSkillList(response.data.response.skillList);
        setExperience(response.data.response.experienceArray);

        setInterest_categories(response.data.response.interest_categories);
        setCoverLetter(response.data.response.CoverLetter);

        setOldCertificates(response.data.response.showOldImages);
        setOldDocuments(response.data.response.showOldDocs);
        console.log("check");
        // setDesignationList(response.data.response.designationlList);
        // console.log(skillList);
      } else if (response.data.status === 400) {
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: t("searchJobPage.close"),
        });
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: t("searchJobPage.close"),
        });
      }
    } catch (error) {
      setLoading(false);
      if (error.message === "Network Error") {
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: t("tokenExpired.tokenExpired"),
          icon: "warning",
          confirmButtonText: t("jobDescription.close"),
        });
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      }
      console.log("Cannot get data of edit profile page");
    }
  };

  const handleDocDownload = async (path, doc) => {
    setDocDownloadPath(path + doc);
    setDownloadActive(true);
    // console.log(docDownloadPath);
  };
  useEffect(() => {
    // console.log(downloadActive, DOCDownloadURL)
    if (downloadActive && docDownloadPath) {
      // Create a hidden link element
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = docDownloadPath;
      link.download = "generated-cv.doc";
      document.body.appendChild(link);

      // Trigger a click on the link
      link.click();

      // Clean up
      document.body.removeChild(link);
      setDownloadActive(false);
    }
  }, [downloadActive, docDownloadPath]);

  const handleDocumentsRemove = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: t("jobseekerEditProfile.documentRemoveConfirmTitle"),
        text: t("jobseekerEditProfile.documentRemoveConfirmTxt"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("jobseekerEditProfile.yes"),
        cancelButtonText: t("jobseekerEditProfile.no"),
      });
      if (confirmationResult.isConfirmed) {
        const response = await axios.post(
          BaseApi + `/candidates/deleteCertificate/${slug}`,
          null, // Pass null as the request body if not required
          {
            headers: {
              "Content-Type": "application/json",
              key: ApiKey,
              token: tokenKey,
            },
          }
        );
        if (response.data.status === 200) {
          getData();
          Swal.fire({
            title: t("jobseekerEditProfile.documentRemoveSuccessTitle"),
            icon: "success",
            confirmButtonText: t("jobseekerEditProfile.close"),
          });
        } else if (response.data.status === 400) {
          Cookies.remove("tokenClient");
          Cookies.remove("user_type");
          Cookies.remove("fname");
          navigate("/");
          Swal.fire({
            title: response.data.message,
            icon: "warning",
            confirmButtonText: t("searchJobPage.close"),
          });
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: t("searchJobPage.close"),
          });
        }
      }
    } catch (error) {
      if (error.message === "Network Error") {
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: t("tokenExpired.tokenExpired"),
          icon: "warning",
          confirmButtonText: t("jobDescription.close"),
        });
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      }
      Swal.fire({
        title: t("jobseekerEditProfile.documentRemoveFailedTitle"),
        icon: "error",
        confirmButtonText: t("jobseekerEditProfile.close"),
      });
      console.log("Cannot delete certificate");
    }
  };

  const handleCertificateRemove = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: t("jobseekerEditProfile.certificateRemoveConfirmTitle"),
        text: t("jobseekerEditProfile.certificateRemoveConfirmTxt"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("jobseekerEditProfile.yes"),
        cancelButtonText: t("jobseekerEditProfile.no"),
      });
      if (confirmationResult.isConfirmed) {
        const response = await axios.post(
          BaseApi + `/candidates/deleteCertificate/${slug}`,
          null, // Pass null as the request body if not required
          {
            headers: {
              "Content-Type": "application/json",
              key: ApiKey,
              token: tokenKey,
            },
          }
        );
        if (response.data.status === 200) {
          getData();
          Swal.fire({
            title: t("jobseekerEditProfile.certificateRemoveSuccessTitle"),
            icon: "success",
            confirmButtonText: t("jobseekerEditProfile.close"),
          });
        } else if (response.data.status === 400) {
          Cookies.remove("tokenClient");
          Cookies.remove("user_type");
          Cookies.remove("fname");
          navigate("/");
          Swal.fire({
            title: response.data.message,
            icon: "warning",
            confirmButtonText: t("searchJobPage.close"),
          });
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: t("searchJobPage.close"),
          });
        }
      }
    } catch (error) {
      if (error.message === "Network Error") {
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: t("tokenExpired.tokenExpired"),
          icon: "warning",
          confirmButtonText: t("jobDescription.close"),
        });
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      }
      Swal.fire({
        title: t("jobseekerEditProfile.certificateRemoveFailedTitle"),
        icon: "error",
        confirmButtonText: t("jobseekerEditProfile.close"),
      });
      console.log("Cannot delete certificate");
    }
  };

  useEffect(() => {
    // Check if tokenKey is not present
    if (!tokenKey) {
      // Redirect to the home page
      navigate("/user/jobseekerlogin");
    } else {
      // TokenKey is present, fetch data or perform other actions
      getData();
      window.scrollTo(0, 0);
    }
  }, [tokenKey, navigate]);

  const handleSkillChange = (selectedOptions) => {
    // Update the jobData state with the selected skills

    console.log(selectedOptions);

    setEditProfile((prevJobData) => ({
      ...prevJobData,
      skill: selectedOptions.map((option) => option.id),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // if (name === "skill") {
    //   setEditProfile((prevJobData) => ({
    //     ...prevJobData,
    //     skill: [...prevJobData.skill, value],
    //   }));
    // }
    if (name === "gender") {
      // console.log(value);
      if (value === "female") {
        setEditProfile({ ...editProfile, gender: "1" });
      }
      if (value === "male") {
        setEditProfile({ ...editProfile, gender: "0" });
      }
      if (value === null) {
        setEditProfile({ ...editProfile, gender: "0" });
      }
      setErrors((prev) => ({
        ...prev,
        gender: "",
      }));
    } else {
      setEditProfile((prevJobData) => ({
        ...prevJobData,
        [name]: value,
      }));
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    // console.log(editProfile);
  };

  // Handle CV selection
  const handleCVSelection = (e) => {
    const file = e.target.files[0];
    // const formData = new FormData();
    setSelectedCV(file);
    console.log(selectedCV, "from change");
  };

  const handleClick = async () => {
    var skills = document.getElementsByName("skill");
    var skillArray = [];
    skills.forEach((element) => {
      skillList.forEach((skill) => {
        if (skill.id === parseInt(element.value)) {
          skillArray.push(skill.name);
        }
      });
    });

    // console.log(skillArray)
    // return false;

    var interest_categories = document.getElementsByName("interest_categories");

    var categoryArray = [];

    interest_categories.forEach((element) => {
      categoryArray.push(element.value);
    });

    // console.log(skillArray)
    // console.log(categoryArray)

    // setUpdatedSkill(skillArray);
    // setUpdatedCat(categoryArray);

    // console.log(updatedSkills);
    // console.log(updatedCat);

    // return false;

    try {
      const newErrors = {};

      if (editProfile.first_name === "" || editProfile.first_name === null) {
        newErrors.first_name = t("jobseekerEditProfile.firstNameRequired");
        window.scrollTo(0, 0);
      }

      if (editProfile.last_name === "" || editProfile.last_name === null) {
        newErrors.last_name = t("jobseekerEditProfile.lastNameRequired");
        window.scrollTo(0, 0);
      }
      if (editProfile.gender === "" || editProfile.gender === null) {
        newErrors.gender = t("jobseekerEditProfile.genderRequired");
        window.scrollTo(0, 0);
      }
      if (editProfile.location === "" || editProfile.location === null) {
        newErrors.location = t("jobseekerEditProfile.nativeLocationRequired");
        window.scrollTo(0, 0);
      }
      if (editProfile.contact === "" || editProfile.contact === null) {
        newErrors.contact = t("jobseekerEditProfile.contactNumber");
        window.scrollTo(0, 0);
      } else if (!/^\+?\d{1,3}-?\d{9,15}$/.test(editProfile.contact)) {
        newErrors.contact = t("jobseekerEditProfile.contactNumbervalidation");
        window.scrollTo(0, 0);
      }

      if (
        editProfile.pre_location === "" ||
        editProfile.pre_location === null
      ) {
        newErrors.pre_location = t(
          "jobseekerEditProfile.preferredJobLocationRequired"
        );
        window.scrollTo(0, 0);
      }
      if (
        editProfile.company_about === null ||
        editProfile.company_about === " "
      ) {
        newErrors.company_about = t("jobseekerEditProfile.descriptionRequired");
        window.scrollTo(0, 0);
      }
      if (editProfile.skills === "" || editProfile.skills === null) {
        newErrors.skills = t("jobseekerEditProfile.skillRequired");
        window.scrollTo(0, 0);
      }
      if (editProfile.exp_salary === "" || editProfile.exp_salary === null) {
        newErrors.exp_salary = t("jobseekerEditProfile.expectedSalaryRequired");
        window.scrollTo(0, 0);
      }
      if (editProfile.total_exp === "" || editProfile.total_exp === null) {
        newErrors.total_exp = t("jobseekerEditProfile.totalExperienceRequired");
        window.scrollTo(0, 0);
      }
      if (editProfile.url) {
        const urlFormat =
          /^(https?:\/\/)?(www\.)?(youtube\.com\/(channel\/|user\/|c\/)?[a-zA-Z0-9_-]{1,})|(youtu\.be\/[a-zA-Z0-9_-]{1,})$/i;
        if (editProfile.url && !urlFormat.test(editProfile.url)) {
          newErrors.url = t("jobseekerEditProfile.youtubeUrlInvalid");
          window.scrollTo(0, 0);
        }
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: t("jobseekerEditProfile.editConfirmTitle"),
          text: t("jobseekerEditProfile.editConfirmTxt"),
          icon: "question",
          showCancelButton: true,
          confirmButtonText: t("jobseekerEditProfile.yes"),
          cancelButtonText: t("jobseekerEditProfile.no"),
        });
        if (confirmationResult.isConfirmed) {
          // console.log(skillArray, "skillArray");
          // console.log(categoryArray, "categoryArray");
          // console.log(selectedCV, "selectedCV");
          // const formData = new FormData();

          // // Append selected CVs and file names to FormData
          //   formData.append("selectedCV", selectedCV);

          // // Append editProfile as JSON string
          // formData.append("editProfile", editProfile);
          // // Append other data to FormData
          // formData.append("CoverLetter", coverLetter);
          // formData.append("skills", skillArray.join(","));
          // formData.append("interest_categories", categoryArray.join(","));

          // setLoading(true);
          // window.scrollTo(0, 0);

          // console.log(formData, "check formData");

          const formData = new FormData();
          formData.append("selectedCV", selectedCV);
          selectedFileName.forEach((fileName, index) => {
            formData.append(`selectedFileNames[${index}]`, fileName);
          });
          // console.log(formData);

          const updatedProfile = {
            ...editProfile,
            CoverLetter: coverLetter,
            selectedCV: selectedCV, // Include the selected CV here
            selectedFileName: selectedFileName,
            skills: skillArray,
            interest_categories: categoryArray,
          };

          // console.log(updatedProfile, "updated profile");

          const response = await axios.post(
            BaseApi + "/candidates/editProfile",
            updatedProfile,
            {
              headers: {
                "Content-Type": "application/json",
                key: ApiKey,
                token: tokenKey,
              },
            }
          );
          setLoading(false);
          if (response.data.status === 200) {
            Swal.fire({
              title: t("jobseekerEditProfile.editSuccessTitle"),
              icon: "success",
              confirmButtonText: t("jobseekerEditProfile.close"),
            });
            navigate("/candidates/myaccount");
          } else if (response.data.status === 400) {
            Cookies.remove("tokenClient");
            Cookies.remove("user_type");
            Cookies.remove("fname");
            navigate("/");
            Swal.fire({
              title: response.data.message,
              icon: "warning",
              confirmButtonText: t("searchJobPage.close"),
            });
          } else {
            Swal.fire({
              title: response.data.message,
              icon: "error",
              confirmButtonText: t("jobseekerEditProfile.close"),
            });
          }
        }
      }
    } catch (error) {
      setLoading(false);
      if (error.message === "Network Error") {
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: t("tokenExpired.tokenExpired"),
          icon: "warning",
          confirmButtonText: t("jobDescription.close"),
        });
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      }
      Swal.fire({
        title: t("jobseekerEditProfile.editFailedTitle"),
        icon: "error",
        confirmButtonText: t("jobseekerEditProfile.close"),
      });
      console.log("Could not submit edit data!");
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedCV(files[0]);
    const fileNames = files.map((file) => file.name);
    setSelectedFileName(fileNames);
    console.log(selectedCV);
    console.log(selectedFileName);
  };

  const handleCoverDelete = async (id) => {
    try {
      const confirmationResult = await Swal.fire({
        title: t("jobseekerEditProfile.coverDeleteConfirmTitle"),
        text: t("jobseekerEditProfile.coverDeleteConfirmTxt"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("jobseekerEditProfile.yes"),
        cancelButtonText: t("jobseekerEditProfile.no"),
      });
      if (confirmationResult.isConfirmed) {
        const response = await axios.post(
          BaseApi + `/candidates/deleteCover/${id}`,
          null,
          {
            headers: {
              "Content-Type": "application/json",
              key: ApiKey,
              token: tokenKey,
            },
          }
        );
        getData();
        Swal.fire({
          title: t("jobseekerEditProfile.coverDeleteSuccessTitle"),
          icon: "success",
          confirmButtonText: t("jobseekerEditProfile.close"),
        });
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setLoading(false);
      if (error.message === "Network Error") {
        Cookies.remove("tokenClient");
        Cookies.remove("user_type");
        Cookies.remove("fname");
        navigate("/");
        Swal.fire({
          title: t("tokenExpired.tokenExpired"),
          icon: "warning",
          confirmButtonText: t("jobDescription.close"),
        });
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      }
      Swal.fire({
        title: t("jobseekerEditProfile.coverDeleteFailedTitle"),
        text: t("jobseekerEditProfile.coverDeleteFailedTxt"),
        icon: "error",
        confirmButtonText: t("jobseekerEditProfile.close"),
      });
      console.log("Could not delete cover!");
    }
  };

  const handleAddCoverLetter = () => {
    setCoverLetter([...coverLetter, { title: "", description: "" }]);
    window.scrollTo(0, document.body.scrollHeight - 10);
  };

  const handleCoverLetterChange = (e, index, field) => {
    const { value } = e.target;
    const updatedCoverLetter = [...coverLetter];
    updatedCoverLetter[index][field] = value;
    setCoverLetter(updatedCoverLetter);
  };

  const removeCoverLetterWithoutID = (indexToRemove) => {
    const updatedCoverLetter = coverLetter.filter(
      (_, index) => index !== indexToRemove
    );
    setCoverLetter(updatedCoverLetter);
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  // Code for loading Location

  const [autocompleteService, setAutocompleteService] = useState(null);
  const [suggestionsPreferred, setSuggestionsPreferred] = useState([]);
  const [suggestionsNative, setSuggestionsNative] = useState([]);

  useEffect(() => {
    // Load Google Maps AutocompleteService after component mounts
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapKey}&libraries=places`;
    script.onload = () => {
      setAutocompleteService(
        new window.google.maps.places.AutocompleteService()
      );
      // console.log(autocompleteService);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // for preferred location box
  const [suggestionTakenPreferred, setSuggestionTakenPreferred] =
    useState(false);

  const handlePreferredLocationChange = (e) => {
    const { value } = e.target;
    setSuggestionTakenPreferred(false);
    if (value == "") {
      setSuggestionTakenPreferred(true);
    }
    if (value != "") {
      setErrors({
        ...errors,
        pre_location: "",
      });
    }

    setEditProfile((prevFilter) => ({
      ...prevFilter,
      pre_location: value,
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
            setSuggestionsPreferred(
              predictions.map((prediction) => prediction.description)
            );
          } else {
            setSuggestionsPreferred([]);
          }
        }
      );
    }
    if (editProfile.pre_location === "") {
      setSuggestionsPreferred([]);
    }
  };

  const handlePreferredSuggestionClick = (suggestion) => {
    // Update the input value with the clicked suggestion
    handlePreferredLocationChange({
      target: { name: "location", value: suggestion },
    });

    setSuggestionTakenPreferred(true);
    // Clear the suggestions
    setSuggestionsPreferred([]);
    // console.log(filterItem);
  };

  // for native location box
  const [suggestionTakenNative, setSuggestionTakenNative] = useState(false);

  const handleNativeLocationChange = (e) => {
    const { value } = e.target;
    setSuggestionTakenNative(false);
    if (value == "") {
      setSuggestionTakenNative(true);
    }
    if (value != "") {
      setErrors({
        ...errors,
        location: "",
      });
    }

    setEditProfile((prevFilter) => ({
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
            setSuggestionsNative(
              predictions.map((prediction) => prediction.description)
            );
          } else {
            setSuggestionsNative([]);
          }
        }
      );
    }
    if (editProfile.location === "") {
      setSuggestionsNative([]);
    }
  };

  const handleNativeSuggestionClick = (suggestion) => {
    // Update the input value with the clicked suggestion
    handleNativeLocationChange({
      target: { name: "location", value: suggestion },
    });

    setSuggestionTakenNative(true);
    // Clear the suggestions
    setSuggestionsNative([]);
    // console.log(filterItem);
  };

  return (
    <>
      <NavBar />
      {loading ? (
        <div className="loader-container"></div>
      ) : (
        <>
          <div className="container editProfile">
            <div className="row">
              <div className="col-lg-3">
                <JSSidebar />
              </div>

              <div
                className="col-lg-9 mb-5"
                style={{
                  borderLeft: "2px solid #e6e8e7",
                  borderRight: "2px solid #e6e8e7",
                }}
              >
                <div className="mx-3 d-flex PageHeader">
                  <img src="/Images/employerSide/icon8color.png" alt="" />
                  <h3 className="">{t("jobseekerEditProfile.editProfile")}</h3>
                </div>
                <div className="JSEPFirstSegment">
                  {editProfile.profile_image ? (
                    <>
                      <img src={editProfile.profile_image} alt="Profile" />
                      <div className="mt-5">
                        <Link
                          to="/candidates/uploadPhoto"
                          className="btn btn-primary button1 EPChangePhoto"
                          style={{
                            backgroundColor: hoverFirstButtonColor
                              ? secondaryColor
                              : primaryColor,
                            border: hoverFirstButtonColor
                              ? secondaryColor
                              : primaryColor,
                          }}
                          onMouseEnter={handleFirstButtonMouseEnter}
                          onMouseLeave={handleFirstButtonMouseLeave}
                        >
                          {t("jobseekerEditProfile.changePhotoButton")}
                        </Link>
                        {/* <div id="emailHelp" className="form-text">
                          Supported File Types: jpg, jpeg, png (Max. 1MB)
                        </div> */}
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src="/Images/jobseekerSide/dummy-profile.png"
                        alt="Profile"
                      />
                      <div className="mt-5">
                        <Link
                          to="/candidates/uploadPhoto"
                          className="btn btn-primary button1"
                          style={{
                            backgroundColor: hoverFirstButtonColor
                              ? secondaryColor
                              : primaryColor,
                            border: hoverFirstButtonColor
                              ? secondaryColor
                              : primaryColor,
                          }}
                          onMouseEnter={handleFirstButtonMouseEnter}
                          onMouseLeave={handleFirstButtonMouseLeave}
                        >
                          {t("jobseekerEditProfile.changePhotoButton")}
                        </Link>
                      </div>
                    </>
                  )}
                </div>
                <form>
                  <div className="mb-5 mt-4 mx-4">
                    <div className="form-outline mb-5 DashBoardInputBx">
                      <label className="form-label" htmlFor="form3Example1">
                        {t("jobseekerEditProfile.firstName")}
                        <span className="RedStar">*</span>
                      </label>
                      <input
                        type="text"
                        id="form3Example1"
                        className={`form-control ${
                          errors.first_name && "input-error"
                        }`}
                        placeholder={t("jobseekerEditProfile.firstName")}
                        name="first_name"
                        value={editProfile.first_name}
                        onChange={handleChange}
                      />
                      {errors.first_name && (
                        <div className="text-danger">{errors.first_name}</div>
                      )}
                    </div>
                    <div className="form-outline mb-5 DashBoardInputBx">
                      <label className="form-label" htmlFor="form3Example3">
                        {t("jobseekerEditProfile.lastName")}
                        <span className="RedStar">*</span>
                      </label>
                      <input
                        type="text"
                        id="form3Example3"
                        className={`form-control ${
                          errors.last_name && "input-error"
                        }`}
                        placeholder={t("jobseekerEditProfile.lastName")}
                        name="last_name"
                        value={editProfile.last_name}
                        onChange={handleChange}
                      />
                      {errors.last_name && (
                        <div className="text-danger">{errors.last_name}</div>
                      )}
                    </div>
                    <div className=" mb-5">
                      <div className="radioInput form-outline DashBoardInputBx">
                        <label className="form-label" htmlFor="form3Example3">
                          {t("jobseekerEditProfile.gender")}
                          <span className="RedStar">*</span>
                        </label>
                        <div>
                          <input
                            type="radio"
                            id="male"
                            name="gender"
                            value="male"
                            checked={editProfile.gender === "0"}
                            onChange={handleChange}
                          />
                          <label className="labelMale" htmlFor="0">
                            {t("jobseekerEditProfile.male")}
                          </label>
                          <input
                            type="radio"
                            id="female"
                            name="gender"
                            value="female"
                            checked={editProfile.gender === "1"}
                            onChange={handleChange}
                          />
                          <label htmlFor="1">
                            {t("jobseekerEditProfile.female")}
                          </label>
                        </div>
                      </div>
                      {errors.gender && (
                        <div className="text-danger">{errors.gender}</div>
                      )}
                    </div>
                    <div className="form-outline mb-5 DashBoardInputBx">
                      <label className="form-label" htmlFor="form3Example3">
                        {t("jobseekerEditProfile.nativeLocation")}
                        <span className="RedStar">*</span>
                      </label>
                      <input
                        type="text"
                        id="form3Example3"
                        className={`form-control ${
                          errors.location && "input-error"
                        }`}
                        placeholder={t("jobseekerEditProfile.nativeLocation")}
                        name="location"
                        value={editProfile.location}
                        onChange={handleNativeLocationChange}
                      />
                      {suggestionsNative.length > 0 && (
                        <div
                          className="suggestions"
                          style={{
                            display: suggestionTakenNative ? "none" : "",
                          }}
                        >
                          <ul className="locationDropdown">
                            {suggestionsNative.map((suggestion, index) => (
                              <div key={index} className="suggestion-item">
                                <li
                                  onClick={() =>
                                    handleNativeSuggestionClick(suggestion)
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
                    <div className="form-outline mb-5 DashBoardInputBx">
                      <label className="form-label" htmlFor="form3Example3">
                        {t("jobseekerEditProfile.contactNumber")}
                        <span className="RedStar">*</span>
                      </label>
                      <input
                        type="text"
                        id="form3Example3"
                        className={`form-control ${
                          errors.contact && "input-error"
                        }`}
                        placeholder={t("jobseekerEditProfile.contactNumber")}
                        name="contact"
                        value={editProfile.contact}
                        onChange={handleChange}
                      />
                      {errors.contact && (
                        <div className="text-danger">{errors.contact}</div>
                      )}
                    </div>
                    <div className="form-outline mb-5 DashBoardInputBx preferredLocationBx">
                      <label className="form-label" htmlFor="form3Example3">
                        {t("jobseekerEditProfile.preferredJobLocation")}
                        <span className="RedStar">*</span>
                      </label>
                      <input
                        type="text"
                        id="form3Example3"
                        className={`form-control ${
                          errors.pre_location && "input-error"
                        }`}
                        placeholder={t(
                          "jobseekerEditProfile.preferredJobLocation"
                        )}
                        name="location"
                        value={editProfile.pre_location}
                        onChange={handlePreferredLocationChange}
                      />
                      {suggestionsPreferred.length > 0 && (
                        <div
                          className="suggestions"
                          style={{
                            display: suggestionTakenPreferred ? "none" : "",
                          }}
                        >
                          <ul className="locationDropdown">
                            {suggestionsPreferred.map((suggestion, index) => (
                              <div key={index} className="suggestion-item">
                                <li
                                  onClick={() =>
                                    handlePreferredSuggestionClick(suggestion)
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
                      {errors.pre_location && (
                        <div className="text-danger">{errors.pre_location}</div>
                      )}
                    </div>
                    <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx skillPackage">
                      <label className="form-label" htmlFor="form3Example3">
                        {t("jobseekerEditProfile.skills")}
                      </label>
                      <Select
                        defaultValue={selectedSkills}
                        isMulti
                        isSearchable
                        name="skill"
                        options={skillList.map((i) => ({
                          value: i.id,
                          label: i.name,
                        }))}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleSkillChange}
                        placeholder={t("jobseekerEditProfile.skills")}
                      />
                      {errors.skills && (
                        <div className="text-danger">{errors.skills}</div>
                      )}
                    </div>
                    <div className="form-outline mb-5 DashBoardInputBx">
                      <label className="form-label" htmlFor="form3Example3">
                        {t("jobseekerEditProfile.expectedSalary")}
                        <span className="RedStar">*</span>
                      </label>
                      <input
                        type="text"
                        id="form3Example3"
                        className={`form-control ${
                          errors.exp_salary && "input-error"
                        }`}
                        placeholder={t("jobseekerEditProfile.expectedSalary")}
                        name="exp_salary"
                        value={editProfile.exp_salary}
                        onChange={handleChange}
                      />
                      {errors.exp_salary && (
                        <div className="text-danger">{errors.exp_salary}</div>
                      )}
                    </div>
                    <div className="form-outline mb-5 DashBoardInputBx">
                      <label className="form-label" htmlFor="form3Example3">
                        {t("jobseekerEditProfile.totalWorkExperience")}
                        <span className="RedStar">*</span>
                      </label>
                      <select
                        className={`form-select ${
                          errors.total_exp && "input-error"
                        }`}
                        aria-label="Default select example"
                        name="total_exp"
                        value={editProfile.total_exp}
                        onChange={handleChange}
                      >
                        <option selected value="">
                          {t("jobseekerEditProfile.chooseExp")}
                        </option>
                        {Object.entries(experience).map(([key, value]) => {
                          return (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          );
                        })}
                      </select>
                      {errors.total_exp && (
                        <div className="text-danger">{errors.total_exp}</div>
                      )}
                    </div>
                    <div className="form-outline mb-5 DashBoardInputBx">
                      <label className="form-label" htmlFor="form3Example3">
                        {t("jobseekerEditProfile.aboutYourself")}
                        <span className="RedStar">*</span>
                      </label>
                      {/* <JoditEditor
                        ref={editor}
                        name="company_about"
                        value={editProfile.company_about}
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
                        value={editProfile.company_about}
                        onChange={(value) =>
                          handleChange({
                            target: { name: "company_about", value },
                          })
                        }
                        style={{ minHeight: "250px", height: "200px" }}
                        placeholder={t("reactQuill.placeholder")}
                      />
                      {errors.company_about && (
                        <div className="text-danger">
                          {errors.company_about}
                        </div>
                      )}
                    </div>
                    <div className="form-outline mb-5 DashBoardInputBx">
                      <label className="form-label" htmlFor="form3Example3">
                        {t("jobseekerEditProfile.youtubeUrl")}
                      </label>
                      <input
                        type="text"
                        id="form3Example3"
                        className="form-control"
                        placeholder={t("jobseekerEditProfile.youtubeUrl")}
                        name="url"
                        value={editProfile.url}
                        onChange={handleChange}
                      />
                      {errors.url && (
                        <div className="text-danger">{errors.url}</div>
                      )}
                    </div>

                    <div className="form-outline mb-5 DashBoardInputBx DashBoardCreatBx skillPackage">
                      <label className="form-label" htmlFor="form3Example3">
                        {t("jobseekerEditProfile.interestCategories")}
                      </label>
                      <Select
                        defaultValue={selectedCat}
                        isMulti
                        isSearchable
                        name="interest_categories"
                        options={categoryList.map((i) => ({
                          value: i.id,
                          label: i.name,
                        }))}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder={t(
                          "jobseekerEditProfile.interestCategories"
                        )}
                      />
                    </div>
                    {/* <div className="form-outline mb-5 DashBoardInputBx">
                      <label htmlFor="formFile" className="form-label">
                        {t("jobseekerEditProfile.cvDoc/certificate")}
                      </label>
                      <input
                        type="file"
                        id="formFile"
                        className="form-control"
                        name="file"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files);

                          // Capture the selected file names
                          const fileNames = files.map((file) => file.name);
                          setSelectedFileName(fileNames);

                          // Convert each selected file to base64 encoding
                          Promise.all(
                            files.map((file) => convertFileToBase64(file))
                          )
                            .then((base64Array) => {
                              setSelectedCV(base64Array);
                            })
                            .catch((error) => {
                              console.error(
                                "Error converting files to base64:",
                                error
                              );
                            });
                        }}
                      />

                      <input
                        type="file"
                        id="formFile"
                        className="form-control"
                        name="file"
                        multiple
                        onChange={handleCVSelection}
                      />

                      <div id="emailHelp" className="form-text">
                        {t("jobseekerEditProfile.belowTxt1")}
                      </div>
                      <div id="emailHelp" className="form-text">
                        {t("jobseekerEditProfile.belowTxt2")}
                      </div>
                    </div> */}

                    {/* {oldCertificates.length > 0 && (
                      <div className="form-outline mb-5 DashBoardInputBx">
                        <label htmlFor="formFile" className="form-label">
                          {t("jobseekerEditProfile.existingCertificate")}
                        </label>
                        <div className="ChoosPlanBx checkCertificate">
                          <div class="EPJobseekerCertificatesDetails">
                            <ul>
                              {oldCertificates.map((i, index) => {
                                return (
                                  <>
                                    <li>
                                      
                                      <i>
                                        <img
                                          className="JSmyProfileCertificateImage"
                                          src={i.image}
                                          alt="icon"
                                        />
                                      </i>
                                    </li>
                                  </>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                    {oldDocuments.length > 0 && (
                      <>
                        <div className="mb-5">
                          <div className="form-outline DashBoardInputBx">
                            <label htmlFor="formFile" className="form-label">
                              {t("jobseekerEditProfile.existingDocument")}
                            </label>
                            <div className="ChoosPlanBx">
                              <div class="EPJobseekerCertificatesDetails">
                                <ul>
                                  {oldDocuments.map((i, index) => {
                                    return (
                                      <>
                                        <li>
                                          <i
                                            class="fa-regular fa-circle-xmark jsprofileCross"
                                            onClick={() =>
                                              handleDocumentsRemove(i.slug)
                                            }
                                          ></i>
                                          <i
                                            onClick={() =>
                                              handleDocDownload(i.path, i.doc)
                                            }
                                          >
                                            {i.doc_sub?.substring(0, 10)}
                                          </i>
                                        </li>
                                      </>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div id="emailHelp" className="form-text">
                            {t("jobseekerEditProfile.belowTxt3")}
                          </div>
                        </div>
                      </>
                    )} */}

                    <div className="form-outline mb-5 DashBoardInputBx">
                      <label htmlFor="formFile" className="form-label">
                        {t("jobseekerEditProfile.coverLetter")}
                      </label>
                      <div className="ChoosPlanBx">
                        <button
                          type="button"
                          className="btn btn-primary button1"
                          onClick={handleAddCoverLetter}
                          style={{
                            backgroundColor: primaryColor,
                            color: "white",
                          }}
                        >
                          {t("jobseekerEditProfile.addCoverLetter")}
                        </button>
                      </div>
                    </div>

                    {coverLetter.map((coverLetter, index) => (
                      <div
                        className="form-outline mb-5 DashBoardInputBx"
                        key={index}
                      >
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t(
                            "jobseekerEditProfile.coverLetterTitle"
                          )}
                          name={`title_${index}`}
                          value={coverLetter.title}
                          onChange={(e) =>
                            handleCoverLetterChange(e, index, "title")
                          }
                        />
                        <textarea
                          className="form-control mt-2"
                          placeholder={t(
                            "jobseekerEditProfile.coverLetterBody"
                          )}
                          name={`description_${index}`}
                          rows={5}
                          value={coverLetter.description}
                          onChange={(e) =>
                            handleCoverLetterChange(e, index, "description")
                          }
                        />
                        {coverLetter.id ? (
                          <>
                            <button
                              type="button"
                              className="btn navButton2 mt-2"
                              onClick={() => handleCoverDelete(coverLetter.id)}
                              style={{
                                color: hoverFourthButtonColor
                                  ? primaryColor
                                  : secondaryColor,
                                backgroundColor: "white",
                                border: hoverFourthButtonColor
                                  ? `2px solid ${primaryColor}`
                                  : `2px solid ${secondaryColor}`,
                              }}
                              onMouseEnter={handleFourthButtonMouseEnter}
                              onMouseLeave={handleFourthButtonMouseLeave}
                            >
                              {t("jobseekerEditProfile.removeButton")}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="btn navButton2 mt-2"
                              onClick={() => removeCoverLetterWithoutID(index)}
                              style={{
                                color: hoverFourthButtonColor
                                  ? primaryColor
                                  : secondaryColor,
                                backgroundColor: "white",
                                border: hoverFourthButtonColor
                                  ? `2px solid ${primaryColor}`
                                  : `2px solid ${secondaryColor}`,
                              }}
                              onMouseEnter={handleFourthButtonMouseEnter}
                              onMouseLeave={handleFourthButtonMouseLeave}
                            >
                              {t("jobseekerEditProfile.removeButton")}
                            </button>
                          </>
                        )}
                      </div>
                    ))}

                    <div className="JSEPFinalButton">
                      <button
                        type="button"
                        className="btn btn-primary button1"
                        onClick={handleClick}
                        style={{
                          backgroundColor: hoverFirstButtonColor
                            ? secondaryColor
                            : primaryColor,
                          border: hoverFirstButtonColor
                            ? secondaryColor
                            : primaryColor,
                        }}
                        onMouseEnter={handleFirstButtonMouseEnter}
                        onMouseLeave={handleFirstButtonMouseLeave}
                      >
                        {t("jobseekerEditProfile.updateButton")}
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary button2"
                        style={{
                          color: hoverThirdButtonColor
                            ? primaryColor
                            : secondaryColor,
                          backgroundColor: "white",
                          border: hoverThirdButtonColor
                            ? `2px solid ${primaryColor}`
                            : `2px solid ${secondaryColor}`,
                        }}
                        onMouseEnter={handleThirdButtonMouseEnter}
                        onMouseLeave={handleThirdButtonMouseLeave}
                      >
                        {t("jobseekerEditProfile.cancelButton")}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <Footer />
        </>
      )}
    </>
  );
};

export default JSEditProfile;
