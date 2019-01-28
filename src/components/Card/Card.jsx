import React, {Component} from "react";

import './style.scss'

const Card = (props) => {
  const {card: {company, jobTitle}} = props;

  return (
    <div className="card-container">
      <div className="card-company-name">
        {company}
      </div>
      <div className="card-job-position">
        {jobTitle}
      </div>
    </div>
  );
};

export default Card;