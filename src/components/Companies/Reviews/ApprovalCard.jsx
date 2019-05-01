import React from "react";

import "./style.scss";

const ApprovalCard = props => {
  return (
    <div className="ui cards" style={{ marginTop: "20px" }}>
      <div
        className="card"
        style={{
          width: "90%",
          marginTop: "0px",
          marginLeft: "32px"
        }}
      >
        <div className="content">{props.content}</div>
        <div className="extra content">
          <div className="ui two buttons">
            <button className="ui basic green button">Up</button>
            <button className="ui basic red button">Down</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalCard;
