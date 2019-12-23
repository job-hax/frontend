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
  jobPostingApiRoot,
  JOB_APPS,
  FILES,
  SUBMIT_JOB_APPLICATION
} from "../../../utils/constants/endpoints.js";
import {
  IS_CONSOLE_LOG_OPEN,
  successMessage
} from "../../../utils/constants/constants.js";
import ResumeUploader from "./ResumeUploader.jsx";

import "./style.scss";
import { generateCurrentDate } from "../../../utils/helpers/helperFunctions.js";

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
      phone_number: applicant.phone_number,
      body_form_data: false,
      resume: null,
      formed_files: [],
      is_applied: false
    };

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

  submitApplication() {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      resume,
      reference
    } = this.state;
    let bodyFormData = new FormData();
    bodyFormData.append("candidate_resume", resume);
    bodyFormData.append("first_name", first_name);
    bodyFormData.append("last_name", last_name);
    bodyFormData.append("email", email);
    bodyFormData.append("phone_number", phone_number);
    bodyFormData.append("reference", reference);
    bodyFormData.append("position_id", this.props.job.id);

    let config = { method: "POST" };
    config.headers = {};
    config.headers["Content-Type"] = "multipart/form-data";

    config.body = bodyFormData;
    axiosCaptcha(SUBMIT_JOB_APPLICATION, config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          successMessage("Application is submitted to the Company");
          this.addNewApplication();
        }
      }
    });
  }

  async addNewApplication() {
    const { job } = this.props;
    await this.props.handleTokenExpiration("jobs addNewApplication");
    let config = { method: "POST" };
    config.body = {
      job_title: job.job,
      status_id: 1,
      company: job.company.company,
      application_date: generateCurrentDate(),
      source: "JOBHAX"
    };
    axiosCaptcha(JOB_APPS, config, "add_job").then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          const job_info = response.data.data;
          successMessage("Application is added to the dashboard");
          let config = { method: "POST" };
          config.headers = {};
          config.headers["Content-Type"] = "multipart/form-data";
          const bodyFormData = new FormData();
          bodyFormData.append("file", this.state.resume);
          config.body = bodyFormData;
          axiosCaptcha(FILES(job_info.id), config).then(response => {
            if (response.statusText === "OK") {
              if (response.data.success) {
                successMessage("CV is attached to the job application");
                this.props.updateParentState("isJobModalShowing", "DETAILS");
                this.setState({ is_applied: true });
              }
            }
          });
        }
      }
    });
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
              label: "Phone: ",
              state: "phone_number",
              type: "phone",
              placeholder: "2221112233",
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
              updateParentState={this.updateParentState}
              formed_files={this.state.formed_files}
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
              <img src={apiRoot + job.company.logo} />
            </div>
          </div>
          <div className="job-card-right">
            <div className="job-title">{job.job.job_title}</div>
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
    const {
      first_name,
      last_name,
      email,
      resume,
      phone_number,
      reference,
      is_applied
    } = this.state;
    let minimumInput =
      first_name && last_name && email && resume && phone_number;

    const apply_button_text = is_applied ? "Applied" : "Apply";

    const sendButton = () => {
      return (
        <Button
          type="primary"
          disabled={!minimumInput}
          onClick={() => this.submitApplication()}
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
          disabled={is_applied}
          onClick={() =>
            this.props.updateParentState("isJobModalShowing", "APPLY")
          }
          style={{ width: "105px" }}
        >
          {apply_button_text}
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
        onOk={this.submitApplication}
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
