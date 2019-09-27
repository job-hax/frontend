import React from "react";

import PollCard from "./PollCard.jsx";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";

import "./style.scss";

class PollBox extends React.Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentWillMount() {
    document.addEventListener("mousedown", this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.addEventListener("mousedown", this.handleClickOutside, false);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.togglePollDisplay();
    }
  }

  generatePoll() {
    IS_CONSOLE_LOG_OPEN && console.log("pollbox", this.props.data);
    return (
      <div>
        {this.props.data.map(
          poll =>
            poll.is_published === true && (
              <div key={poll.id}>
                <PollCard
                  poll={poll}
                  alert={this.props.alert}
                  handleTokenExpiration={this.props.handleTokenExpiration}
                />
              </div>
            )
        )}
      </div>
    );
  }

  render() {
    return (
      <div className="poll">
        <div className="poll-box-main" ref={this.setWrapperRef}>
          <div className="poll-box-header-container">
            <div className="poll-box-header">Survey!</div>
          </div>
          <div className="poll-box-body">{this.generatePoll()}</div>
        </div>
      </div>
    );
  }
}

export default PollBox;
