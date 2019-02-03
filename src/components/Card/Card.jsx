import React, {Component} from "react";

import './style.scss'

const Card = (props) => {
  const {card: {companyLogo, company, jobTitle, isRejected}} = props;

  return (
    <div className={isRejected ? "card-rejected-container" : "card-container" }>
      <div className="card-company-icon">
        <img className="card-company-icon" src={companyLogo} />
      </div>
      <div className="card-company-info">
        <div className="card-company-name">
          {company}
        </div>
        <div className="card-job-position">
          {jobTitle}
        </div>       
      </div>
      <div className="card-job-details">
        ...
      </div>  
    </div>
  );
};

export { Card }