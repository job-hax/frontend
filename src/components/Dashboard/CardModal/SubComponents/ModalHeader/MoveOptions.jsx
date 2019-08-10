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

  async deleteJobFunction() {
    await this.props.handleTokenExpiration("moveOptions deleteJobFunction");
    const { card, deleteJobFromList, columnName } = this.props;
    const body = {
      jobapp_id: card.id
    };
    let { url, config } = deleteJobRequest;
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

  async updateAsRejected() {
    await this.props.handleTokenExpiration("moveOptions updateAsRejected");
    const { card, moveToRejected, columnName } = this.props;
    var isRejected = !card.isRejected;
    const body = {
      jobapp_id: card.id,
      status_id: card.applicationStatus.id,
      rejected: isRejected
    };
    let { url, config } = updateJobStatusRequest;
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
    if (this.props.card.isRejected === true) {
      statuses = statuses.filter(status => status.id !== "toApply");
    }
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
    let optionsContainerHeight =
      this.props.card.isRejected == true ? { height: 198 } : { height: 228 };
    if (this.state.showOptions) {
      return (
        <div className="options-container" style={optionsContainerHeight}>
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
