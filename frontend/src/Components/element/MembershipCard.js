import React, { useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { Link } from "react-router-dom";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import HTMLReactParser from "html-react-parser";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const MembershipCard = (props) => {
  const [membershipData, setMembershipData] = useState([]);
  const [membershipFeatureData, setMembershipFeatureData] = useState([]);

  const [authenticated, setAuthenticated] = useState(false);
  const [t, i18n] = useTranslation("global");

  let userType = Cookies.get("user_type");
  let curr = Cookies.get("curr");

  const tokenKey = Cookies.get("tokenClient");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(BaseApi + `/home`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setMembershipData(response.data.response.plans_details);
        setMembershipFeatureData(response.data.response.plans_details);
      } catch (error) {
        console.log("Cannot get home page data!");
      }
    };
    getData();
    if (
      tokenKey !== "" &&
      (userType === "recruiter" || userType === "candidate")
    ) {
      setAuthenticated(true);
    }
  }, []);

  const [hoverMembershipButtonColor, setHoverMembershipButtonColor] =
    useState(false);

  const handleMembershipButtonMouseEnter = () => {
    setHoverMembershipButtonColor(true);
  };

  const handleMembershipButtonMouseLeave = () => {
    setHoverMembershipButtonColor(false);
  };

  const options = {
    margin: 30,
    responsiveClass: true,
    // nav: true,
    autoplay: true,
    autoplaySpeed: 1000,
    smartSpeed: 1000,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      600: {
        items: 2,
      },
      700: {
        items: 2,
      },
      1000: {
        items: 3,
      },
    },
  };

  const handleBuyWithoutLogin = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "warning",
      title: t("userpage.pleaseLogin"),
    });
  };

  return (
    <>
      {membershipData.length > 0 ? (
        <OwlCarousel
          className="owl-theme"
          autoplay
          autoplaySpeed={1000}
          center={true}
          loop
          margin={0}
          // items={3}
          // nav
          {...options}
        >
          {membershipData.map((i) => {
            return (
              <>
                <div className="item">
                  <div className="MembershipCard">
                    <h4>{i.plan_name}</h4>
                    <h2>
                      {curr} {i.amount}
                    </h2>
                    <h6>{i.plan_type}</h6>
                    <div className="ApplyAll">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="applyimmediately"
                      />
                      <label
                        className="form-check-label"
                        for="applyimmediately"
                      >
                        {t("userpage.applyImmediately")}
                      </label>
                    </div>
                    <ul className="applyoption">
                      {Object.entries(i.features).map(([key, value]) => {
                        return <li><i class="fa-solid fa-circle-check membershipChecks"></i>{value ? HTMLReactParser(value) : ""}</li>;
                      })}
                    </ul>
                    {authenticated ? (
                      <Link to="/plans/purchase" className="btn btn-primary">
                        {t("userpage.buyThisPlan")}
                      </Link>
                    ) : (
                      <Link
                        to="/user/jobseekerlogin"
                        className="btn btn-primary"
                        onClick={handleBuyWithoutLogin}
                      >
                        {t("userpage.buyThisPlan")}
                      </Link>
                    )}
                    {/* <Link className="btn btn-primary">BUY THIS PLAN</Link> */}
                  </div>
                </div>
              </>
            );
          })}
        </OwlCarousel>
      ) : (
        ""
      )}
    </>
  );
};

export default MembershipCard;
