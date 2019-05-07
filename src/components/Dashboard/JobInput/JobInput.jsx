import React, { PureComponent } from "react";
import { ReCaptcha } from "react-recaptcha-v3";
import classNames from "classnames";

import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";

import "./style.scss";

class JobInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      companyName: "",
      jobTitle: "",
      recaptchaToken: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddNewApplication = this.handleAddNewApplication.bind(this);
    this.cancelJobInputEdit = this.cancelJobInputEdit.bind(this);
    this.verifyReCaptchaCallback = this.verifyReCaptchaCallback.bind(this);
  }

  verifyReCaptchaCallback(recaptchaToken) {
    IS_CONSOLE_LOG_OPEN &&
      console.log("\n\nyour recaptcha token:", recaptchaToken, "\n");
    this.setState({ recaptchaToken: recaptchaToken });
  }

  cancelJobInputEdit() {
    this.props.toggleJobInput();
    this.setState({
      companyName: "",
      jobTitle: ""
    });
  }

  handleInputChange(stateKey) {
    return e =>
      this.setState({
        [stateKey]: e.target.value
      });
  }

  handleAddNewApplication(e) {
    e.preventDefault();
    const { columnName } = this.props;
    this.props
      .addNewApplication({
        columnName,
        name: e.target[0].value,
        title: e.target[1].value,
        recaptchaToken: this.state.recaptchaToken
      })
      .then(({ ok }) => {
        if (ok) {
          this.setState({
            companyName: "",
            jobTitle: ""
          });
        }
      });
  }

  render() {
    const { showInput, toggleJobInput } = this.props;

    const { companyName, jobTitle } = this.state;

    const addJobButtonClass = classNames({
      "column-addJob-form-button": true,
      "--addJob": true,
      "--button-disabled":
        companyName.trim().length < 1 || jobTitle.trim().length < 1
    });
    return showInput ? (
      <div>
        <form
          className="column-addJob-form"
          onSubmit={this.handleAddNewApplication}
        >
          <input
            name="company"
            className="input-add-job --company"
            placeholder="Company Name"
            onChange={this.handleInputChange("companyName")}
            value={companyName}
          />
          <input
            name="title"
            className="input-add-job --position"
            placeholder="Job Title"
            onChange={this.handleInputChange("jobTitle")}
            value={jobTitle}
          />
          <div className="column-addJob-form-buttons-container">
            <button
              className="column-addJob-form-button"
              type="reset"
              onClick={this.cancelJobInputEdit}
            >
              Cancel
            </button>
            <button className={addJobButtonClass} type="submit">
              Add Job
            </button>
          </div>
          <div>
            <ReCaptcha
              sitekey="6LfOH6IUAAAAAL4Ezv-g8eUzkkERCWlnnPq_SdkY"
              action="add_job"
              verifyCallback={this.verifyReCaptchaCallback}
            />
          </div>
        </form>
      </div>
    ) : (
      <div className="column-addJob" onClick={toggleJobInput}>
        <div className="button-inside">+</div>
      </div>
    );
  }
}

export default JobInput;
