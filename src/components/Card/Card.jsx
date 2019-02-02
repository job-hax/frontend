import React, {Component} from "react";

import './style.scss'

const Card = (props) => {
  const {card: {companyLogo, company, jobTitle}} = props;

  return (
    <div className="card-container">
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

const CardRejected = (props) => {
  const {cardRejected: {companyLogo, company, jobTitle}} = props;

  return (
    <div className="cardRejected-container">
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

export { Card, CardRejected }