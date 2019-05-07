import React, { PureComponent } from "react";
import { ReCaptcha } from "react-recaptcha-v3";
import classNames from "classnames";
import { AutoComplete, Select, Icon, Menu } from "antd";

import { fetchApi } from "../../../utils/api/fetch_api";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";

import "./style.scss";

class JobInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      companyName: "",
      jobTitle: "",
      recaptchaToken: "",
      autoCompleteData: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddNewApplication = this.handleAddNewApplication.bind(this);
    this.cancelJobInputEdit = this.cancelJobInputEdit.bind(this);
    this.verifyReCaptchaCallback = this.verifyReCaptchaCallback.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  verifyReCaptchaCallback(recaptchaToken) {
    IS_CONSOLE_LOG_OPEN &&
      console.log("\n\nyour recaptcha token:", recaptchaToken, "\n");
    this.setState({ recaptchaToken: recaptchaToken });
  }

  handleSearch(value) {
    this.setState({ companyName: value });
    let url =
      "https://autocomplete.clearbit.com/v1/companies/suggest?query=" + value;
    let config = {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json"
      }
    };
    fetchApi(url, config).then(response => {
      if (response.ok) {
        console.log(response);
        let bufferList = [];
        response.json.forEach(company => bufferList.push(company.name));
        {
          /*<Select.Option
              key={Math.random()}
              value={company.name}
              style={{ display: "flex", justifyContent: "left" }}
              onClick={this.onCompanySelect}
            >
              <div>
                <div
                  style={{
                    height: "20px",
                    minWidth: "20px",
                    maxWidth: "20px",
                    marginRight: "16px",
                    overflow: "hidden"
                  }}
                >
                  <img
                    src={company.logo}
                    style={{ height: "20px", width: "auto" }}
                  />
                </div>
                <div style={{ maxWidth: "140px", overflow: "hidden" }}>
                  {company.name.length >= 18
                    ? company.name.substring(0, 17) + "..."
                    : company.name}
                </div>
              </div>
          </Select.Option>*/
        }
        this.setState({
          autoCompleteData: bufferList
        });
      }
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

  cancelJobInputEdit() {
    this.props.toggleJobInput();
    this.setState({
      companyName: "",
      jobTitle: ""
    });
  }

  render() {
    const { showInput, toggleJobInput } = this.props;

    const { companyName, jobTitle } = this.state;

    const addJobButtonClass = classNames({
      "column-addJob-form-button": true,
      "--addJob": true,
      "--button-disabled": companyName.length < 1 || jobTitle.trim().length < 1
    });
    return showInput ? (
      <div>
        <form
          className="column-addJob-form"
          onSubmit={this.handleAddNewApplication}
        >
          <AutoComplete
            dataSource={this.state.autoCompleteData}
            style={{ width: 200 }}
            onSearch={this.handleSearch}
            placeholder="Company Name"
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
