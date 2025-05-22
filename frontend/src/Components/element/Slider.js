import React, { useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { Link } from "react-router-dom";
import axios from "axios";
import BaseApi from "../api/BaseApi";
import ApiKey from "../api/ApiKey";
import HTMLReactParser from "html-react-parser";
import Cookies from "js-cookie";

const Slider = () => {
  const [sliderData, setSliderData] = useState([]);
  const [membershipFeatureData, setMembershipFeatureData] = useState([]);

  //   const [authenticated, setAuthenticated] = useState(false);

  let userType = Cookies.get("user_type");

  const tokenKey = Cookies.get("tokenClient");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(BaseApi + `/homeslider`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setSliderData(response.data.response.sliderList);
        // console.log(sliderData, "fromcomponent");
        // setMembershipFeatureData(response.data.response.plans_details);
      } catch (error) {
        console.log("Cannot get slider data!");
      }
    };
    getData();
    // if (
    //   tokenKey !== "" &&
    //   (userType === "recruiter" || userType === "candidate")
    // ) {
    //   setAuthenticated(true);
    // }
  }, []);

  //   const [hoverMembershipButtonColor, setHoverMembershipButtonColor] =
  //     useState(false);

  //   const handleMembershipButtonMouseEnter = () => {
  //     setHoverMembershipButtonColor(true);
  //   };

  //   const handleMembershipButtonMouseLeave = () => {
  //     setHoverMembershipButtonColor(false);
  //   };

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
        items: 1,
      },
      700: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  };

  return (
    <>
      {sliderData.length > 0 ? (
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
          {/* {sliderData.length > 0
            ? sliderData.map((i) => {
                return (
                  <>
                    <div className="sliderDiv">
                      <img src={i.image} alt="slider" />
                    </div>
                  </>
                );
              })
            : ""} */}
            {sliderData.length > 0
            ? sliderData.map((i) => {
                return (
                  <>
                    <div className="sliderDiv">
                      <div
                        className="sliderImageBox"
                        style={{ backgroundImage: `url(${i.image})` }}
                      ></div>
                      {/* <img src={i.image} alt="slider" /> */}
                    </div>
                  </>
                );
              })
            : ""}

          {/* <img src="/Images/slider1.jpg" alt="slider" />
        <img src="/Images/slider2.jpg" alt="slider" /> */}
        </OwlCarousel>
      ) : (
        ""
      )}
    </>
  );
};

export default Slider;
