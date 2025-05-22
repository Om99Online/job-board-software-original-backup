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
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import APFooter from "../Elements/APFooter";

const APManageRoles = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("token");
  const adminID = Cookies.get("adminID");

  const navigate = useNavigate();
  const { slug } = useParams();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/admin/managerole/${slug}`,
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

      console.log(response.data.response.accesscontrol);

      setUserData(response.data.response.accesscontrol);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get profile photo data");
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

  //// new code

  const update = (event, i) => {
    console.log(event.target.checked);

    if (event.target.checked) {
      setUserData((prevListData) =>
        prevListData.map((item) =>
          item.name === i.name
            ? { ...item, Add: 1, Edit: 1, Delete: 1, Module: 1 }
            : item
        )
      );
    } else {
      setUserData((prevListData) =>
        prevListData.map((item) =>
          item.name === i.name
            ? { ...item, Add: 0, Edit: 0, Delete: 0, Module: 0 }
            : item
        )
      );
    }
  };

  const handleAdd = (i) => {
    setUserData((prevListData) =>
      prevListData.map((item) =>
        item.name === i.name ? { ...item, Add: item.Add === 1 ? 0 : 1 } : item
      )
    );
  };

  const handleEdit = (i) => {
    setUserData((prevListData) =>
      prevListData.map((item) =>
        item.name === i.name ? { ...item, Edit: item.Edit === 1 ? 0 : 1 } : item
      )
    );
  };

  const handleDelete = (i) => {
    setUserData((prevListData) =>
      prevListData.map((item) =>
        item.name === i.name
          ? { ...item, Delete: item.Delete === 1 ? 0 : 1 }
          : item
      )
    );
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    console.log(userData);

    const formdata = {
      access: userData,
    };
    //return;

    try {
      setLoading(true);
      const response = await axios.post(
        BaseApi + `/admin/managerole/${slug}`,
        formdata,
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

      if (response.status === 200) {
        Swal.fire({
          title: "Roles updated successfully",
          icon: "success",
          confirmButtonText: "Close",
        });
        navigate("/admin/admins/manage");
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      Swal.fire({
        title: "An error occurred",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  return (
    <>
      <APNavBar />
      <div className="APBasic">
        <APSidebar />

        {loading ? (
          <div className="loader-container"></div>
        ) : (
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
                  onClick={() => navigate("/admin/admins/manage")}
                >
                  Subadmin List
                </Link>

                <Typography color="text.primary">Manage Roles</Typography>
              </Breadcrumbs>
            </div>
            <h2 className="mt-4">Manage Roles</h2>
            <form className="adminForm" onSubmit={handelSubmit}>
              <div className="mb-4 mt-5">
                <div className="h4">Select Roles:</div>

                {/* <div className="row manageRoleBody">
                  
                  {userData.map((i, index) => (
                    <div key={index} className="col-6">
                      <div className="MainTitleChack">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name={`checkbox[${index}][Module]`}
                          id={`checkbox-${index}`}
                          checked={i.Module === 1}
                          onChange={(event) => update(event, i)}
                        />
                        <label htmlFor={`checkbox-${index}`}>{i.name}</label>
                      </div>

                      <div className="SubCheckBx">
                        {index !== 9 && index !== 10 && (
                          <div className="SubtitleBx">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              name={`checkbox[${index}][Add]`}
                              id={`inner-add-${index}`}
                              checked={i.Add === 1}
                              onChange={() => handleAdd(i)}
                            />
                            <label htmlFor={`inner-add-${index}`}>Add</label>
                          </div>
                        )}

                        <div className="SubtitleBx">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name={`checkbox[${index}][Edit]`}
                            id={`inner-edit-${index}`}
                            checked={i.Edit === 1}
                            onChange={() => handleEdit(i)}
                          />
                          <label htmlFor={`inner-edit-${index}`}>Edit</label>
                        </div>

                        {index !== 9 && index !== 10 && (
                          <div className="SubtitleBx">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              name={`checkbox[${index}][Delete]`}
                              id={`inner-delete-${index}`}
                              checked={i.Delete === 1}
                              onChange={() => handleDelete(i)}
                            />
                            <label htmlFor={`inner-delete-${index}`}>
                              Delete
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                 
                 
                </div> */}
                <div className="row manageRoleBody">
                  {userData.map((i, index) => (
                    <div key={index} className="col-md-6 mb-4">
                      <div className="card">
                        <div className="card-body">
                          <div className="MainTitleChack">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              name={`checkbox[${index}][Module]`}
                              id={`checkbox-${index}`}
                              checked={i.Module === 1}
                              onChange={(event) => update(event, i)}
                            />
                            <label htmlFor={`checkbox-${index}`}>
                              {i.name}
                            </label>
                          </div>

                          <div className="SubCheckBx">
                            {index !== 9 && index !== 10 && (
                              <div className="SubtitleBx">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  name={`checkbox[${index}][Add]`}
                                  id={`inner-add-${index}`}
                                  checked={i.Add === 1}
                                  onChange={() => handleAdd(i)}
                                />
                                <label htmlFor={`inner-add-${index}`}>
                                  Add
                                </label>
                              </div>
                            )}

                            <div className="SubtitleBx">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                name={`checkbox[${index}][Edit]`}
                                id={`inner-edit-${index}`}
                                checked={i.Edit === 1}
                                onChange={() => handleEdit(i)}
                              />
                              <label htmlFor={`inner-edit-${index}`}>
                                Edit
                              </label>
                            </div>

                            {index !== 9 && index !== 10 && (
                              <div className="SubtitleBx">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  name={`checkbox[${index}][Delete]`}
                                  id={`inner-delete-${index}`}
                                  checked={i.Delete === 1}
                                  onChange={() => handleDelete(i)}
                                />
                                <label htmlFor={`inner-delete-${index}`}>
                                  Delete
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button type="submit" className="btn btn-primary button1">
                  SAVE
                </button>
                <button
                  type="button"
                  className="btn btn-primary button2"
                  onClick={() => navigate("/admin/admins/manage")}
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        )}
        {!loading && <APFooter />}
        
      </div>
    </>
  );
};

export default APManageRoles;
