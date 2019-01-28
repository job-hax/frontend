import React, {Component} from "react";

import './style.scss'

const Card = (props) => {
  console.log('props', props);
  const {card: {company, jobTitle}} = props;
  console.log('props', company, jobTitle);
  return (
    <div className="card-container">
      <div className="card-companyname">
        {company}
      </div>
      <div className="card-jobposition">
        {jobTitle}
      </div>
    </div>
  );
};

export default Card;