import React from "react";

import {
  APPLICATION_STATUSES_IN_ORDER,
  IS_CONSOLE_LOG_OPEN
} from "../../../../../utils/constants/constants.js";
import { axiosCaptcha } from "../../../../../utils/api/fetch_api";
import {
  deleteJobRequest,
  updateJobStatusRequest
} from "../../../../../utils/api/requests.js";

class MoveOptions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showOptions: false
    };

    this.toggleOptions = this.toggleOptions.bind(this);
  }

  toggleOptions() {
    this.setState(state => ({
      showOptions: !state.showOptions
    }));
  }

  deleteJobFunction() {
    const { card, token, deleteJobFromList, columnName } = this.props;
    const body = {
      jobapp_id: card.id
    };
    let { url, config } = deleteJobRequest;
    config.headers.Authorization = token;
    IS_CONSOLE_LOG_OPEN && console.log("delete job request body\n", body);
    config.body = body;
    axiosCaptcha(url, config).then(response => {
      IS_CONSOLE_LOG_OPEN &&
        console.log("delete job request response\n", response, card);
      if (response.statusText === "OK") {
        IS_CONSOLE_LOG_OPEN && console.log("function ", columnName, card.id);
        deleteJobFromList(columnName, card.id, card.isRejected);
      }
    });
  }

  updateAsRejected() {
    const { card, token, moveToRejected, columnName } = this.props;
    var isRejected = !card.isRejected;
    const body = {
      jobapp_id: card.id,
      status_id: card.applicationStatus.id,
      rejected: isRejected
    };
    let { url, config } = updateJobStatusRequest;
    config.headers.Authorization = token;
    IS_CONSOLE_LOG_OPEN &&
      console.log("update to rejected request body\n", body);
    config.body = body;
    axiosCaptcha(url, config).then(response => {
      IS_CONSOLE_LOG_OPEN &&
        console.log("update to rejected request response\n", response, card);
      if (response.statusText === "OK") {
        IS_CONSOLE_LOG_OPEN && console.log("function ", columnName, card.id);
        moveToRejected(columnName, card, isRejected);
      }
    });
  }

  updateCardStatusToOtherStatuses(insertedColumnName) {
    const { card, columnName, updateApplications } = this.props;
    updateApplications(card, columnName, insertedColumnName);
  }

  otherApplicationStatusesGenerator() {
    const { columnName } = this.props;
    var statuses = APPLICATION_STATUSES_IN_ORDER.filter(
      item => item.id !== columnName
    );
    return statuses.map(item => (
      <div
        key={item.id}
        className="options"
        value={item.id}
        onClick={() => this.updateCardStatusToOtherStatuses(item.id)}
      >
        <img src={item.icon.toString().split("@")[0] + "InBtn@1x.png"} />
        <p>{item.name}</p>
      </div>
    ));
  }

  moveToOptionsGenerator() {
    const { card, icon } = this.props;
    if (this.state.showOptions) {
      return (
        <div className="options-container">
          <div className="explanation">MOVE TO:</div>
          {card.applicationStatus.id != 2 ? (
            <div className="options" onClick={() => this.updateAsRejected()}>
              {card.isRejected ? (
                <div className="ongoing-option">
                  <img src={icon.toString().split("@")[0] + "InBtn@1x.png"} />
                  <p>Ongoing</p>
                </div>
              ) : (
                <div className="rejected-option">
                  <img
                    src={"../../src/assets/icons/RejectedIconInBtn@1x.png"}
                  />
                  <p>Rejected</p>
                </div>
              )}
            </div>
          ) : (
            <div className="unable">
              <img src={"../../src/assets/icons/RejectedIconInBtn@1x.png"} />
              Rejected
            </div>
          )}
          {this.otherApplicationStatusesGenerator()}
          <div
            className="delete-option"
            onClick={() => this.deleteJobFunction()}
          >
            <img src="../../src/assets/icons/DeleteIconInBtn@1x.png" />
            <p>Delete</p>
          </div>
        </div>
      );
    } else {
      return;
    }
  }

  render() {
    return (
      <div
        className="modal-header options"
        onMouseEnter={this.toggleOptions}
        onMouseLeave={this.toggleOptions}
      >
        <div className="current-status">
          <img
            src={this.props.icon.toString().split("@")[0] + "White@1x.png"}
          />
          <p>
            {APPLICATION_STATUSES_IN_ORDER[parseInt(this.props.id) - 1]["name"]}
          </p>
        </div>
        {this.moveToOptionsGenerator()}
      </div>
    );
  }
}

export default MoveOptions;
