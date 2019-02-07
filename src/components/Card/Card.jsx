import React, {Component} from "react";

import './style.scss'

const Card = (props) => {
  const {card: {companyLogo, company, jobTitle, isRejected}} = props;

  return (
    <div className="card-container" style={isRejected ? {backgroundColor: "rgba(188,43,255,.4)", textAlign: "left" } : {} }>
      <div className="card-company-icon">
        <img className="card-company-icon" src={companyLogo} />
      </div>
      <div className="card-company-info">
        <div id="company" contenteditable="true" className="card-company-name">
          {company}
        </div>
        <div id="jobTitle" contenteditable="true" className="card-job-position">
          {jobTitle}
        </div>       
      </div>
      <div className="card-job-details">
        x
      </div>  
    </div>
  );
};

export { Card }