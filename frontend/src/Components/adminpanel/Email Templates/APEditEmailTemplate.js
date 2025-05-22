import React, { useEffect, useState } from "react";
import APNavBar from "../Elements/APNavBar";
import APSidebar from "../APSidebar/APSidebar";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import BaseApi from "../../api/BaseApi";
import ApiKey from "../../api/ApiKey";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import Cookies from "js-cookie";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles
import APFooter from "../Elements/APFooter";
const APEditEmailTemplate = () => {
  const editor = useRef(null);

  const [userData, setUserData] = useState({
    title: "",
    subject: "",
    template: "",
    subject_el: "",
    template_el: "",
    // subject_fra: "",
    // template_fra: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    subject: "",
    template: "",
    subject_el: "",
    template_el: "",
    // subject_fra: "",
    // template_fra: "",
  });
  const [variables, setVariables] = useState([]);
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");
  const[templateId, setTemplateId] = useState({
    id: ""
  });

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
        BaseApi + `/admin/editemailtemplates/${slug}`,
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
      setTemplateId({...templateId, id: response.data.response.id});
      console.log(templateId);
      setUserData(response.data.response);
      setVariables(response.data.response.variables);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get data at edit Page List");
    }
  };

  // var variablesPart = [];

  // variablesPart = variables.split(",");
  // console.log(variablesPart, "variablesPart");

  // const newArray = variablesPart.map((element) => element.trim());
  // console.log(newArray, "newarray");

  const handleVariableClickSubject = (e, value) => {
    e.preventDefault();
    console.log(value);
    // Concatenate value to the subject key in userData state
    setUserData((prevUserData) => ({
      ...prevUserData,
      subject: prevUserData.subject + value,
    }));
  };
  const handleVariableClickTemplate = (e, value) => {
    e.preventDefault();
    console.log(value);
    // Concatenate value to the subject key in userData state
    setUserData((prevUserData) => ({
      ...prevUserData,
      template: prevUserData.template + value,
    }));
  };
  const handleVariableClickSubjectDe = (e, value) => {
    e.preventDefault();
    console.log(value);
    // Concatenate value to the subject key in userData state
    setUserData((prevUserData) => ({
      ...prevUserData,
      subject_de: prevUserData.subject_de + value,
    }));
  };
  const handleVariableClickTemplateDe = (e, value) => {
    e.preventDefault();
    console.log(value);
    // Concatenate value to the subject key in userData state
    setUserData((prevUserData) => ({
      ...prevUserData,
      template_de: prevUserData.template_de + value,
    }));
  };
  const handleVariableClickSubjectFra = (e, value) => {
    e.preventDefault();
    console.log(value);
    // Concatenate value to the subject key in userData state
    setUserData((prevUserData) => ({
      ...prevUserData,
      subject_fra: prevUserData.subject_fra + value,
    }));
  };
  const handleVariableClickTemplateFra = (e, value) => {
    e.preventDefault();
    console.log(value);
    // Concatenate value to the subject key in userData state
    setUserData((prevUserData) => ({
      ...prevUserData,
      template_fra: prevUserData.template_fra + value,
    }));
  };

  const handleClick = async () => {
    try {
      console.log(userData);
      const newErrors = {};

      if (userData.title === "") {
        newErrors.title = "Title is required";
        window.scrollTo(0, 0);
      }
      if (userData.subject === "") {
        newErrors.subject = "Subject is required";
        window.scrollTo(0, 0);
      }
      if (userData.template === "") {
        newErrors.template = "Template is required";
        window.scrollTo(0, 0);
      }
      if (userData.subject_el === "") {
        newErrors.subject_el = "Subject(Greek) is required";
        window.scrollTo(0, 0);
      }
      if (userData.template_el === "") {
        newErrors.template_el = "Template(Greek) is required";
        window.scrollTo(0, 0);
      }
      // if (userData.subject_fra === "") {
      //   newErrors.subject_fra = "Subject(French) is required";
      //   // window.scrollTo(0, 0);
      // }
      // if (userData.template_fra === "") {
      //   newErrors.template_fra = "Template(French) is required";
      //   window.scrollTo(0, 0);
      // }
      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Update Template?",
          text: "Do you want to update this template?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (confirmationResult.isConfirmed) {
          setLoading(true);

          const response = await axios.post(
            BaseApi + `/admin/editemailtemplates/${slug}`,
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
              title: "Template Updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            // setUserData({
            //   ...userData,
            //   new_username: "",
            //   conf_username: "",
            // });
            // window.scrollTo(0, 0);
            navigate("/admin/emailtemplates");
          } else {
            Swal.fire({
              title: response.data.message,
              icon: "error",
              confirmButtonText: "Close",
            });
          }
        }
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not update email template. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not update email template!", error);
    }
  };

  const handleTestMail = async() => {
    try {
      setLoading(true);
      console.log("Sending request with data:",  templateId.id );
      const response = await axios.post(
        BaseApi + `/admin/testmail/${slug}`,
        templateId, // Pass null as the request body if not required
        {
          headers: {
            "Content-Type": "application/json",
            key: ApiKey,
            // token: tokenKey,
            adminid: adminID,
          },
        }
      );
      setLoading(false);
      if(response.data.status === 200){
        Swal.fire({
          title: "Success",
          icon: "success",
          confirmButtonText: "Close",
        });
      }else{
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not test mail. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
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
                    to="/admin/admins/dashboard"
                    underline="hover"
                    color="inherit"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/emailtemplates"
                    underline="hover"
                    color="inherit"
                  >
                    Email Template Management
                  </Link>

                  <Typography color="text.primary">
                    Edit Email Template Detail
                  </Typography>
                </Breadcrumbs>
              </div>
              <div className="ManageSubAdminHeader">
                <h2 className="adminPageHeading">Edit Email Template Detail</h2>

                <button
                  className="btn adminMediumButton1 APMSbutton"
                  onClick={handleTestMail}
                >
                  Test Mail
                </button>
              </div>
              <form>
                <div className="mb-4 mt-5">
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Title<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.title && "input-error"
                      }`}
                      name="title"
                      placeholder="Enter Title"
                      value={userData.title}
                      onChange={handleChange}
                    />
                    {errors.title && (
                      <div className="text-danger">{errors.title}</div>
                    )}
                  </div>
                  <div className="firstBlockEmailTemplate">
                    <div class="mb-5 DashBoardInputBx">
                      <label for="formFile" class="form-label">
                        Variables to use
                      </label>

                      {Object.entries(variables)?.map(([key, value]) => {
                        return (
                          <div className="APEditEmailTemplateButtons">
                            <button
                              className="btn APButton3"
                              onClick={(e) =>
                                handleVariableClickSubject(e, value)
                              }
                            >
                              {value}
                            </button>
                          </div>
                        );
                      })}

                      <div id="emailHelp" class="form-text">
                        Note* : click on above variable buttons to use these in
                        below subject on behalf of dynamic values (like :
                        username: [!username!])
                      </div>
                    </div>
                    <div class="mb-5 DashBoardInputBx">
                      <label for="formFile" class="form-label">
                        Subject<span className="RedStar">*</span>
                      </label>
                      <input
                        type="text"
                        id="form3Example1"
                        className={`form-control ${
                          errors.subject && "input-error"
                        }`}
                        name="subject"
                        placeholder="Subject"
                        value={userData.subject}
                        onChange={handleChange}
                      />
                      {errors.subject && (
                        <div className="text-danger">{errors.subject}</div>
                      )}
                    </div>
                  </div>
                  <div className="secondBlockEmailTemplate">
                    <div class="mb-5 DashBoardInputBx">
                      <label for="formFile" class="form-label">
                        Variables to use
                      </label>
                      {Object.entries(variables)?.map(([key, value]) => {
                        return (
                          <div className="APEditEmailTemplateButtons">
                            <button
                              className="btn APButton3"
                              onClick={(e) =>
                                handleVariableClickTemplate(e, value)
                              }
                            >
                              {value}
                            </button>
                          </div>
                        );
                      })}
                      <div id="emailHelp" class="form-text">
                        Note* : click on above variable buttons to use these in
                        below subject on behalf of dynamic values (like :
                        username: [!username!])
                      </div>
                    </div>
                    <div className="mb-5 DashBoardInputBx DashBoardCreatBx APJoditEditor">
                      <label className="form-label" htmlFor="form3Example3">
                        Body<span className="RedStar">*</span>
                      </label>
                      {/* <JoditEditor
                        ref={editor}
                        name="template"
                        value={userData.template}
                        onChange={(template) =>
                          handleChange({
                            target: {
                              value: template,
                              name: "template",
                            },
                          })
                        }
                      /> */}
                      <ReactQuill
                      theme="snow"
                      value={userData.template}
                      onChange={(value) =>
                        handleChange({
                          target: {
                            name: "template",
                            value,
                          },
                        })
                      }
                      style={{ minHeight: "250px", height: "200px" }}
                      placeholder="Add your text here..."
                    />
                      {errors.template && (
                        <div className="text-danger">{errors.template}</div>
                      )}
                    </div>
                  </div>

                  <div className="thirdBlockEmailTemplate">
                    <div class="mb-5 DashBoardInputBx">
                      <label for="formFile" class="form-label">
                        Variables to use
                      </label>
                      {Object.entries(variables)?.map(([key, value]) => {
                        return (
                          <div className="APEditEmailTemplateButtons">
                            <button
                              className="btn APButton3"
                              onClick={(e) =>
                                handleVariableClickSubjectDe(e, value)
                              }
                            >
                              {value}
                            </button>
                          </div>
                        );
                      })}
                      <div id="emailHelp" class="form-text">
                        Note* : click on above variable buttons to use these in
                        below subject on behalf of dynamic values (like :
                        username: [!username!])
                      </div>
                    </div>
                    <div class="mb-5 DashBoardInputBx">
                      <label for="formFile" class="form-label">
                        Subject (Greek)<span className="RedStar">*</span>
                      </label>
                      <input
                        type="text"
                        id="form3Example1"
                        className={`form-control ${
                          errors.subject_el && "input-error"
                        }`}
                        name="subject_el"
                        placeholder="Subject Greek"
                        value={userData.subject_el}
                        onChange={handleChange}
                      />
                      {errors.subject_el && (
                        <div className="text-danger">{errors.subject_el}</div>
                      )}
                    </div>
                  </div>
                  <div className="fourthBlockEmailTemplate">
                    <div class="mb-5 DashBoardInputBx">
                      <label for="formFile" class="form-label">
                        Variables to use
                      </label>
                      {Object.entries(variables)?.map(([key, value]) => {
                        return (
                          <div className="APEditEmailTemplateButtons">
                            <button
                              className="btn APButton3"
                              onClick={(e) =>
                                handleVariableClickTemplateDe(e, value)
                              }
                            >
                              {value}
                            </button>
                          </div>
                        );
                      })}
                      <div id="emailHelp" class="form-text">
                        Note* : click on above variable buttons to use these in
                        below subject on behalf of dynamic values (like :
                        username: [!username!])
                      </div>
                    </div>
                    <div className="mb-5 DashBoardInputBx DashBoardCreatBx APJoditEditor">
                      <label className="form-label" htmlFor="form3Example3">
                        Body (Greek)<span className="RedStar">*</span>
                      </label>
                      {/* <JoditEditor
                        ref={editor}
                        name="template_el"
                        value={userData.template_el}
                        onChange={(template_el) =>
                          handleChange({
                            target: {
                              value: template_el,
                              name: "template_el",
                            },
                          })
                        }
                      /> */}
                      <ReactQuill
                      theme="snow"
                      value={userData.template_el}
                      onChange={(value) =>
                        handleChange({
                          target: {
                            name: "template_el",
                            value,
                          },
                        })
                      }
                      style={{ minHeight: "250px", height: "200px" }}
                      placeholder="Add your text here..."
                    />
                      {errors.template_el && (
                        <div className="text-danger">{errors.template_el}</div>
                      )}
                    </div>
                  </div>
                  {/* <div className="fifthBlockEmailTemplate">
                    <div class="mb-5 DashBoardInputBx">
                      <label for="formFile" class="form-label">
                        Variables to use
                      </label>
                      {Object.entries(variables)?.map(([key, value]) => {
                        return (
                          <div className="APEditEmailTemplateButtons">
                            <button
                              className="btn APButton3"
                              onClick={(e) =>
                                handleVariableClickSubjectFra(e, value)
                              }
                            >
                              {value}
                            </button>
                          </div>
                        );
                      })}
                      <div id="emailHelp" class="form-text">
                        Note* : click on above variable buttons to use these in
                        below subject on behalf of dynamic values (like :
                        username: [!username!])
                      </div>
                    </div>
                    <div class="mb-5 DashBoardInputBx">
                      <label for="formFile" class="form-label">
                        Subject (French)<span className="RedStar">*</span>
                      </label>
                      <input
                        type="text"
                        id="form3Example1"
                        className={`form-control ${
                          errors.subject_fra && "input-error"
                        }`}
                        name="subject_fra"
                        placeholder="Subject French"
                        value={userData.subject_fra}
                        onChange={handleChange}
                      />
                      {errors.subject_fra && (
                        <div className="text-danger">{errors.subject_fra}</div>
                      )}
                    </div>
                  </div>
                  <div className="sixthBlockEmailTemplate">
                    <div class="mb-5 DashBoardInputBx">
                      <label for="formFile" class="form-label">
                        Variables to use
                      </label>
                      {Object.entries(variables)?.map(([key, value]) => {
                        return (
                          <div className="APEditEmailTemplateButtons">
                            <button
                              className="btn APButton3"
                              onClick={(e) =>
                                handleVariableClickTemplateFra(e, value)
                              }
                            >
                              {value}
                            </button>
                          </div>
                        );
                      })}
                      <div id="emailHelp" class="form-text">
                        Note* : click on above variable buttons to use these in
                        below subject on behalf of dynamic values (like :
                        username: [!username!])
                      </div>
                    </div>
                    <div className="mb-5 DashBoardInputBx DashBoardCreatBx APJoditEditor">
                      <label className="form-label" htmlFor="form3Example3">
                        Body (French)<span className="RedStar">*</span>
                      </label>
                      <JoditEditor
                        ref={editor}
                        name="template_fra"
                        value={userData.template_fra}
                        onChange={(template_fra) =>
                          handleChange({
                            target: {
                              value: template_fra,
                              name: "template_fra",
                            },
                          })
                        }
                      />
                      {errors.template_fra && (
                        <div className="text-danger">{errors.template_fra}</div>
                      )}
                    </div>
                  </div> */}

                  <button
                    type="button"
                    className="btn btn-primary adminLowerButton1"
                    onClick={handleClick}
                  >
                    SAVE
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary adminLowerButton2"
                    onClick={() => navigate("/admin/emailtemplates")}
                  >
                    CANCEL
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

export default APEditEmailTemplate;
