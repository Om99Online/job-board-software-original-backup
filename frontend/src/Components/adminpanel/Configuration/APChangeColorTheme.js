import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  SketchPicker,
  AlphaPicker,
  BlockPicker,
  ChromePicker,
  CirclePicker,
  GithubPicker,
  HuePicker,
  MaterialPicker,
  SliderPicker,
  SwatchesPicker,
  TwitterPicker,
} from "react-color";
import APFooter from "../Elements/APFooter";

const APChangeColorTheme = () => {
  const [colorTheme, setColorTheme] = useState({
    theme_color: "",
    theme_background: "",
    is_default: "",
  });

  const [errors, setErrors] = useState({
    theme_color: "",
    theme_background: "",
  });

  const [defaultCheck, setDefaultCheck] = useState(false);

  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");

  const navigate = useNavigate();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + "/admin/changecolorscheme",
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
      setColorTheme(response.data.response);
      if (
        colorTheme.theme_color === "#294a9c" &&
        colorTheme.theme_background === "#f3734c"
      ) {
        setDefaultCheck(true);
      }
    } catch (error) {
      setLoading(false);
      console.log("Cannot get profile photo data");
    }
  };

  const handleDefaultColorChange = (e) => {
    if (e.target.checked) {
      // setColorTheme({...colorTheme, theme_background: "#f3734c"});
      setColorTheme({
        ...colorTheme,
        theme_color: "#294a9c",
        theme_background: "#f3734c",
        is_default: 1,
      });
      setDefaultCheck(true);
    }
    if (!e.target.checked) {
      setColorTheme({
        ...colorTheme,
        theme_color: "",
        theme_background: "",
        is_default: 0,
      });
      setDefaultCheck(false);
    }
    setErrors((prev) => ({
      ...prev,
      theme_color: "",
      theme_background: "",
    }));
  };

  const handleClick = async () => {
    // console.log(primaryColor, secondaryColor);
    try {
      const newErrors = {};

      if (colorTheme.theme_color === "") {
        newErrors.theme_color = "Please select the theme color";
        // window.scrollTo(0, 0);
      }
      if (colorTheme.theme_background === "") {
        newErrors.theme_background = "Please select the theme background";
        // window.scrollTo(0, 0);
      }
      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Change Theme?",
          text: "Do you want to change the theme?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          console.log(colorTheme, "color");
          setLoading(true);
          const response = await axios.post(
            BaseApi + "/admin/changecolorscheme",
            colorTheme,
            {
              headers: {
                "Content-Type": "application/json",
                key: ApiKey,
                token: tokenKey,
                adminid: adminID,
              },
            }
          );
          if (response.data.status === 200) {
            Swal.fire({
              title: "Theme updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            getData();

            window.scrollTo(0, 0);
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
        title: "Could not update theme. Please try after some time!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not update theme!");
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
      if (
        colorTheme.theme_color === "#294a9c" &&
        colorTheme.theme_background === "#f3734c"
      ) {
        setDefaultCheck(true);
      }
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
                  <Typography color="text.primary">
                    Change Color Theme
                  </Typography>
                </Breadcrumbs>
              </div>
              <h2 className="adminPageHeading">Change Color Theme</h2>
              <form className="adminForm">
                <div className="mb-4 mt-5 colorPickerBody">
                  <div className="color-picker primaryColor">
                    <label>Primary Color:</label>
                    <ChromePicker
                      color={colorTheme.theme_color}
                      onChange={(color) => (
                        setColorTheme({
                          ...colorTheme,
                          theme_color: color.hex,
                          is_default: 0
                        }),
                        setDefaultCheck(false),
                        setErrors({ ...errors, theme_color: "" })
                      )}
                    />
                    {errors.theme_color && (
                      <div className="text-danger">{errors.theme_color}</div>
                    )}
                  </div>

                  <div className="color-picker secondaryColor">
                    <label>Secondary Color:</label>
                    <ChromePicker
                      color={colorTheme.theme_background}
                      onChange={(color) => (
                        setColorTheme({
                          ...colorTheme,
                          theme_background: color.hex,
                          is_default: 0
                        }),
                        setDefaultCheck(false),
                        setErrors({ ...errors, theme_color: "" })
                      )}
                    />
                    {errors.theme_background && (
                      <div className="text-danger">
                        {errors.theme_background}
                      </div>
                    )}
                  </div>
                  <div class="mb-5 siteSettingPaymentInfo checkBoxCol defaultColor">
                    <label htmlFor="formFile" class="form-label">
                      Set default colors
                    </label>
                    <input
                      type="checkbox"
                      className="tableCheckBox"
                      checked={defaultCheck || colorTheme.is_default === 1}
                      onChange={handleDefaultColorChange}
                      name="is_default"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary button1"
                  onClick={handleClick}
                >
                  UPDATE
                </button>
                <button
                  type="button"
                  className="btn btn-primary button2"
                  onClick={() => navigate("/admin/admins/dashboard")}
                >
                  CANCEL
                </button>
              </form>
            </div>
            <APFooter />
          </>
        )}
      </div>
    </>
  );
};

export default APChangeColorTheme;
