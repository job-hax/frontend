import React from "react";
import faker from "faker";
import ApprovalCard from "./ApprovalCard.jsx";

import "./style.scss";

function generateComment() {
  return (
    <div className="comment">
      <a href="/" className="avatar">
        <img alt="avatar" src={faker.image.avatar()} />
      </a>
      <div className="content">
        <a href="/" className="author">
          {faker.name.firstName().toString()}
        </a>
        <div className="metadata">
          <span className="date" style={{ fontSize: "90%" }}>
            {faker.date.past().toString()}
          </span>
        </div>
        <div className="text" style={{ fontSize: "85%" }}>
          {faker.lorem.text().toString()}
        </div>
      </div>
    </div>
  );
}

function reviewCardRandomGenerator() {
    const amount = Math.floor(Math.random() * 6) + 1 
    const list = [];
    for (let i = 0; i <= amount ; i++) {
    list.push(<ApprovalCard content={generateComment()} />);
    };
    return list.map(item => (
        <div key={Math.random()}>
            {item}
        </div>
    ))
};

const Comments = () => {
  return (
    <div className="ui container comments">
      {reviewCardRandomGenerator()}
    </div>
  );
};

export default Comments;
