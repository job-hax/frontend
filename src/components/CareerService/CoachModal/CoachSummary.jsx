import React from "react";
import { apiRoot } from "../../../utils/constants/endpoints.js";
import CoachModal from "./CoachModal.jsx";

import "./style.scss";

class CoachSummary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };

    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel() {
    this.setState({ visible: false });
  }

  generateSummaryCard() {
    const { coach } = this.props;
    return (
      <div className="side-carousel-image" key={coach.id}>
        <img
          src={apiRoot + coach.summary_photo}
          onClick={() => this.setState({ visible: true })}
        />
        <CoachModal
          coach={coach}
          visible={this.state.visible}
          handleCancel={this.handleCancel}
        />
      </div>
    );
  }

  render() {
    return <div>{this.generateSummaryCard()}</div>;
  }
}

export default CoachSummary;
