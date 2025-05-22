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
import { error } from "jquery";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles
import APFooter from "../Elements/APFooter";
const APEditNewsletter = () => {
  const editor = useRef(null);

  const [userData, setUserData] = useState({
    subject: "",
    message: "",
  });
  const [emailData, setEmailData] = useState({
    email_formatting: "",
  });
  const [errors, setErrors] = useState({
    subject: "",
    message: "",
    email_formatting: "",
  });

  const [formError, setFormError] = useState();
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");

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
        BaseApi + `/admin/newsletter/admin_edit/${slug}`,
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
      setLoading(false);
      setUserData(response.data.response);
    } catch (error) {
      console.log("Error at chnage username at Admin panel");
    }
  };

  const formattingMail = async () => {
    try {
      let formErrors = {};

      if (emailData.email_formatting.trim() === "") {
        formErrors.email_formatting = "Email Formatting is required";
      } else {
        const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailFormat.test(emailData.email_formatting)) {
          formErrors.email_formatting = "Invalid email format";
        }
      }

      if (Object.keys(formErrors).length === 0) {
        setLoading(true);

        const updatedData = {
          ...emailData,
          message: userData.message,
        };

        const response = await axios.post(
          BaseApi + `/admin/newsletter/admin_emailtest/${slug}`,
          updatedData,
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
            title: "Test Newsletter Email sent successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });

          // navigate("/admin/newsletters/index");
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
      } else {
        setFormError(formErrors);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async () => {
    try {
      const newErrors = {};

      if (userData.subject === "") {
        newErrors.subject = "Subject is required";
        window.scrollTo(0, 0);
      }
      if (userData.message === "") {
        newErrors.message = "Message is required";
        window.scrollTo(0, 0);
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Update Newsletter?",
          text: "Do you want to update this Newsletter?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (confirmationResult.isConfirmed) {
          setLoading(true);

          const response = await axios.post(
            BaseApi + `/admin/newsletter/admin_edit/${slug}`,
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
              title: "Newsletter updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            // setUserData({
            //   ...userData,
            //   new_username: "",
            //   conf_username: "",
            // });
            // window.scrollTo(0, 0);
            navigate("/admin/newsletters/index");
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
        text: "Could not update newsletter. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not change username!", error);
    }
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
                    onClick={() => navigate("/admin/newsletters/index")}
                  >
                    Newsletter
                  </Link>

                  <Typography color="text.primary">Edit Newsletter</Typography>
                </Breadcrumbs>
              </div>
              <h2 className="adminPageHeading">Edit Newsletter</h2>
              <form className="editNewsletterForm">
                <div className="mb-4 mt-5">
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
                  <div className=" mb-5 DashBoardInputBx DashBoardCreatBx APJoditEditor">
                    <label className="form-label" htmlFor="form3Example3">
                      Message<span className="RedStar">*</span>
                    </label>
                    {/* <JoditEditor
                      ref={editor}
                      name="message"
                      value={userData.message}
                      onChange={(message) =>
                        handleChange({
                          target: {
                            value: message,
                            name: "message",
                          },
                        })
                      }
                    /> */}
                    <ReactQuill
                      theme="snow"
                      value={userData.message}
                      onChange={(value) =>
                        handleChange({
                          target: { name: "message", value },
                        })
                      }
                      style={{ minHeight: "250px", height: "200px" }}
                      placeholder="Add your text here..."
                    />
                    {errors.message && (
                      <div className="text-danger">{errors.message}</div>
                    )}
                  </div>
                  <div className="">
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
                      onClick={() => navigate("/admin/newsletters/index")}
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </form>
              <hr />
              <h4 className="mb-5">Check Newsletter Formatting by test email</h4>
              <div class="mb-4 DashBoardInputBx">
                <label for="formFile" class="form-label">
                  Email Address<span className="RedStar">*</span>
                </label>
                <input
                  type="text"
                  id="form3Example1"
                  className="form-control"
                  name="email_formatting"
                  placeholder="Email Address"
                  value={userData.email_formatting}
                  onChange={(e) =>
                    setEmailData({
                      ...emailData,
                      email_formatting: e.target.value,
                    })
                  }
                />
                {formError?.email_formatting && (
                  <div className="text-danger">
                    {formError.email_formatting}
                  </div>
                )}
              </div>
              <button
                type="button"
                className="btn btn-primary button1"
                onClick={formattingMail}
              >
                SEND
              </button>
            </div>
            <APFooter />
          </>
        )}
      </div>
    </>
  );
};

export default APEditNewsletter;
