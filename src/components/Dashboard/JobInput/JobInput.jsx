import React, { PureComponent } from "react";
import classNames from "classnames";
import { AutoComplete, Select, Icon, Menu } from "antd";

import { axiosCaptcha } from "../../../utils/api/fetch_api";
import { getPositionsRequest } from "../../../utils/api/requests.js";

import "./style.scss";

class JobInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      companyName: "",
      jobTitle: "",
      autoCompleteCompanyData: [],
      autoCompletePositionsData: []
    };
    this.handlePositionsSearch = this.handlePositionsSearch.bind(this);
    this.handleAddNewApplication = this.handleAddNewApplication.bind(this);
    this.cancelJobInputEdit = this.cancelJobInputEdit.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
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
    axiosCaptcha(url, config).then(response => {
      if (response.statusText === "OK") {
        console.log(response);
        let bufferList = [];
        response.data.forEach(company => bufferList.push(company.name));
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
          autoCompleteCompanyData: bufferList
        });
      }
    });
  }

  async handlePositionsSearch(value) {
    this.setState({ jobTitle: value });
    await this.props.handleTokenExpiration("jobInput handlePositionsSearch");
    const { url, config } = getPositionsRequest;
    let newUrl = url + "?q=" + value + "&count=5";
    axiosCaptcha(newUrl, config).then(response => {
      if (response.statusText === "OK") {
        console.log(response.data);
        let bufferPositionsList = [];
        response.data.data.forEach(position =>
          bufferPositionsList.push(position.job_title)
        );
        this.setState({
          autoCompletePositionsData: bufferPositionsList
        });
      }
    });
  }

  handleAddNewApplication(e) {
    e.preventDefault();
    const { columnName } = this.props;
    this.props
      .addNewApplication({
        columnName,
        name: e.target[0].value,
        title: e.target[1].value
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
      "--button-disabled":
        companyName.trim().length < 1 || jobTitle.trim().length < 1
    });
    return showInput ? (
      <div>
        <form
          className="column-addJob-form"
          onSubmit={this.handleAddNewApplication}
        >
          <AutoComplete
            dataSource={this.state.autoCompleteCompanyData}
            style={{ width: "90%", marginTop: "4px" }}
            onSearch={this.handleSearch}
            placeholder="Company Name"
            value={companyName}
          />
          <AutoComplete
            dataSource={this.state.autoCompletePositionsData}
            style={{ width: "90%", marginTop: "4px" }}
            onSearch={this.handlePositionsSearch}
            placeholder="Job Title"
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
