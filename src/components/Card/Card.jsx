import React, {Component} from "react";
import { DetailsModal , toggleModal} from '../DetailsModal/DetailsModal.jsx';

import './style.scss'

const Card = (props) => {
  const {card: {companyLogo, company, jobTitle, isRejected}} = props;

  return (
    <div className={isRejected ? "card-container rejected-cards" : "card-container"} >
      <div className="card-company-icon">
        <img src={companyLogo} />
      </div>
      <div className="card-company-info">
        <div id="company" className="card-company-name">
          {company}
        </div>
        <div id="jobTitle" className="card-job-position">
          {jobTitle}
        </div>       
      </div>
      <div className="card-job-details">
        <DetailsModal></DetailsModal>  
      </div>
      
    </div>
  );
};

export { Card }