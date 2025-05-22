import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = (props) => {
  const handleClick = (id) => {
    sessionStorage.setItem("catId", id);
  };
  return (
    <>
      <div className="card catCard">
        <div className="card-body catCardBody">
          <Link to="/searchjob" onClick={() => handleClick(props.id)}>
            <h5 className="card-title catCardTitle">{props.title}</h5>
            {/* <h5 className="card-subtitle catCardSubtitle mb-2">{props.title2}</h5> */}
          </Link>
          <div className="ImageCard">
            <img className="imageChild1" src={props.image1} alt="" />
            <img className="imageChild2" src={props.image2} alt="" />
          </div>
          <h6 className="catCardFooter">{props.footer?.substring(0,64)}</h6>
        </div>
      </div>
    </>
  );
};

export default CategoryCard;
