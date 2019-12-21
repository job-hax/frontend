import React from "react";
import { Redirect } from "react-router-dom";
import { Carousel, Modal, Button, Input, Icon, Upload, message } from "antd";
import moment from "moment";
import parse from "html-react-parser";
import classNames from "classnames";

import Spinner from "../../Partials/Spinner/Spinner.jsx";
import { axiosCaptcha } from "../../../utils/api/fetch_api";
import {
  apiRoot,
  jobPostingApiRoot
} from "../../../utils/constants/endpoints.js";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";
import ResumeUploader from "./ResumeUploader.jsx";

import "./style.scss";

const { TextArea } = Input;

class JobModal extends React.Component {
  constructor(props) {
    super(props);

    const applicant = this.props.profile_data;

    this.state = {
      mode: this.props.mode,
      first_name: applicant.first_name,
      last_name: applicant.last_name,
      email: applicant.email,
      reference: "",
      resume: false
    };

    this.handleOk = this.handleOk.bind(this);
    this.updateParentState = this.updateParentState.bind(this);
  }

  updateParentState(state_name, new_state) {
    this.setState({ [state_name]: new_state });
  }

  componentDidUpdate() {
    if (this.props.mode != this.state.mode) {
      this.setState({ mode: this.props.mode });
    }
  }

  async handleOk() {
    const { first_name, last_name, email, resume, reference } = this.state;
    this.submitApplication();
    this.addJob();
  }

  generateApplicationFrom() {
    const error_check = state => {
      return (
        this.state[state] === (null || "") && (
          <div className="error-note">{"*"}</div>
        )
      );
    };

    const applicationFromClass = classNames({
      "application-form-container": true,
      "--invisible": this.state.mode !== "APPLY"
    });

    const inputWrapper = ({ label, state, type, placeholder, is_required }) => {
      return (
        <div className="input-container">
          <label>{label}</label>
          <Input
            type={type}
            placeholder={placeholder}
            value={this.state[state]}
            onChange={event => this.setState({ [state]: event.target.value })}
          />
          {is_required && error_check(state)}
        </div>
      );
    };

    return (
      <div className={applicationFromClass}>
        <div className="title">Application Form</div>
        <div className="application-form-body">
          <div className="application-inputs-container">
            {inputWrapper({
              label: "First Name: ",
              state: "first_name",
              type: "text",
              placeholder: "John",
              is_required: true
            })}
            {inputWrapper({
              label: "Last Name: ",
              state: "last_name",
              type: "text",
              placeholder: "Doe",
              is_required: true
            })}
            {inputWrapper({
              label: "Email: ",
              state: "email",
              type: "email",
              placeholder: "johndoe@gmail.com",
              is_required: true
            })}
            {inputWrapper({
              label: "Reference: ",
              state: "reference",
              type: "text",
              placeholder: "Jane Smith from Marketing",
              is_required: false
            })}
          </div>
          <div className="resume-container">
            <ResumeUploader
              card={{ id: 1 }}
              handleTokenExpiration={this.props.handleTokenExpiration}
              updateParentState={this.updateParentState}
            />
          </div>
        </div>
      </div>
    );
  }

  generateJobDetails() {
    const { job } = this.props;

    return (
      <div className="job-details-body">
        <div className="job-card-initial">
          <div className="job-card-left">
            <div className="company-logo">
              <img
                src={
                  apiRoot + "/media/0958d356-1a85-4e2d-9e4d-22b2ea386f54.jpg"
                }
              />
            </div>
          </div>
          <div className="job-card-right">
            <div className="job-title">{job.job.job_title}</div>
            <div className="company-name">
              International Technological University
            </div>
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
            <div className="post-date">
              {moment(job.created_date).fromNow()}
            </div>
          </div>
        </div>
        <div className="details-title">Details</div>
        <div className="details-text">{parse(`${job.responsibilities}`)}</div>
        <div className="details-title">Requirements</div>
        <div className="details-text">{parse(`${job.requirements}`)}</div>
      </div>
    );
  }

  generateJobModal() {
    const { first_name, last_name, email, resume, reference } = this.state;
    let minimumInput = first_name && last_name && email && resume;

    const sendButton = () => {
      return (
        <Button
          type="primary"
          disabled={!minimumInput}
          onClick={() => this.handleOk()}
          style={{ width: "105px" }}
        >
          Submit
        </Button>
      );
    };

    const applyButton = () => {
      return (
        <Button
          type="primary"
          onClick={() =>
            this.props.updateParentState("isJobModalShowing", "APPLY")
          }
          style={{ width: "105px" }}
        >
          Apply
        </Button>
      );
    };

    const closeFormButton = () => {
      return (
        <Button
          onClick={() =>
            this.props.updateParentState("isJobModalShowing", "DETAILS")
          }
          style={{ width: "105px" }}
        >
          Close Form
        </Button>
      );
    };

    const footer_buttons =
      this.state.mode !== "APPLY"
        ? [applyButton()]
        : [closeFormButton(), sendButton()];

    return (
      <Modal
        title={this.state.mode}
        visible={true}
        onOk={this.handleOk}
        onCancel={() =>
          this.props.updateParentState("isJobModalShowing", false)
        }
        getContainer={() => document.getElementById("jobs-container")}
        width="80vw"
        footer={footer_buttons}
      >
        <div className="job-modal-container">
          {this.generateJobDetails()}
          {this.generateApplicationFrom()}
        </div>
      </Modal>
    );
  }

  render() {
    return <div>{this.generateJobModal()}</div>;
  }
}

export default JobModal;
