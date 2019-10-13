import React from "react";
import { Modal, Button } from "antd";
import { apiRoot } from "../../../utils/constants/endpoints.js";
import parse from "html-react-parser";

import "./style.scss";

class CoachModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible
    };
  }

  componentDidUpdate() {
    if (this.props.visible != this.state.visible) {
      this.setState({ visible: this.props.visible });
    }
  }

  generateCoachModal() {
    const { coach } = this.props;
    const header = (
      <div className="coach-modal-header">
        <div className="coach-head-photo">
          <img src={apiRoot + coach.profile_photo} />
        </div>
        <div className="coach-header-info">
          <div className="coach-name">
            {coach.first_name + " " + coach.last_name}
          </div>
          <div>{coach.title} </div>
          <div>{coach.email && coach.email} </div>
          <div className="connection-buttons-container">
            <Button
              disabled={
                coach.calendar_link === null || coach.calendar_link === "null"
              }
              onClick={() => window.open(coach.calendar_link)}
            >
              Book Appointment
            </Button>
            <Button
              disabled={
                coach.online_conference_link === null ||
                coach.online_conference_link === "null"
              }
              onClick={() => window.open(coach.online_conference_link)}
            >
              Online Meeting
            </Button>
          </div>
        </div>
      </div>
    );

    const body = (
      <div className="coach-modal-body">{parse(`${coach.content}`)}</div>
    );

    return (
      <Modal
        title={header}
        visible={this.state.visible}
        onCancel={this.props.handleCancel}
        footer={null}
        closable={false}
        getContainer={() => document.getElementById("main-container")}
        width={460}
      >
        {body}
      </Modal>
    );
  }

  render() {
    return <div>{this.generateCoachModal()}</div>;
  }
}

export default CoachModal;
