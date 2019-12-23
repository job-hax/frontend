import React from "react";
import classNames from "classnames";
import moment from "moment";

import JobModal from "../JobModal/JobModal.jsx";
import defaultLogo from "../../../assets/icons/JobHax-logo-black.svg";
import { axiosCaptcha } from "../../../utils/api/fetch_api";
import { apiRoot } from "../../../utils/constants/endpoints.js";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";

import "./style.scss";
import { Icon, Button } from "antd";

class JobCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isJobModalShowing: false,
      imageLoadError: true
    };

    this.updateParentState = this.updateParentState.bind(this);
  }

  updateParentState(state_name, new_state) {
    this.setState({ [state_name]: new_state });
  }

  render() {
    const { job } = this.props;

    const date_style =
      new Date().getTime() - new Date(job.created_date).getTime() <
      3 * 24 * 60 * 60 * 1000
        ? { color: "green" }
        : {};

    return (
      <div className="job-card-container">
        <div className="job-card-wrapper">
          <div className="job-card-initial">
            <div className="job-card-left">
              <div className="company-logo">
                <img src={apiRoot + job.company.logo} />
              </div>
            </div>
            <div className="job-card-right">
              <div className="job-title">{job.job}</div>
              <div className="company-name">{job.company.company}</div>
              <div className="job-location-and-type">
                <div>
                  {job.city}, {job.state.code}, {job.country.name}
                </div>
                <div>
                  {job.department}
                  {job.department && job.job_type && " - "}
                  {job.job_type}
                </div>
              </div>
              <div className="post-date" style={date_style}>
                {moment(job.created_date).fromNow()}
              </div>
            </div>
          </div>
          <div className="job-card-button">
            <Button
              type="primary"
              onClick={() => this.setState({ isJobModalShowing: "APPLY" })}
            >
              APPLY
            </Button>
            <Button
              onClick={() => this.setState({ isJobModalShowing: "DETAILS" })}
            >
              Details
            </Button>
          </div>
        </div>
        {this.state.isJobModalShowing != false && (
          <JobModal
            job={job}
            profile_data={this.props.profile_data}
            handleTokenExpiration={this.props.handleTokenExpiration}
            updateParentState={this.updateParentState}
            mode={this.state.isJobModalShowing}
          />
        )}
      </div>
    );
  }
}

export default JobCard;
