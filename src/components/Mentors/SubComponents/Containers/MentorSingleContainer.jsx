import React from "react";
import { Button } from "antd";

class MentorSingle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="mentors-container">
        <div className="mentor-card-container">
          <div
            className="mentor-card"
            onClick={() => this.props.selectMentor(this.props.mentor)}
          >
            <div className="mentor-top">
              <div className="avatar">
                <img
                  src={
                    this.props.mentor.photoUrl
                      ? this.props.mentor.photoUrl
                      : "../../../../src/assets/icons/SeyfoIcon@3x.png"
                  }
                />
              </div>
            </div>
            <div className="mentor-bottom">
              <div className="mentor-name">{this.props.mentor.fullName}</div>
              <div className="mentor-employment">
                {this.props.mentor.position +
                  " at " +
                  this.props.mentor.company}
              </div>
              <div className="mentor-company">
                <img src={this.props.mentor.companyLogo} />
                <div className="company-name">{this.props.mentor.company}</div>
              </div>
            </div>
            <div className="button-container">
              <Button
                type="primary"
                style={{ width: "180px", borderRadius: 0 }}
              >
                Connect
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MentorSingle;
