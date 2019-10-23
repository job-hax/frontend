import React, { PureComponent } from "react";
import classNames from "classnames";
import { AutoComplete, Select, Icon, Menu, Button } from "antd";

import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants";
import { axiosCaptcha } from "../../../utils/api/fetch_api";
import { AUTOCOMPLETE } from "../../../utils/constants/endpoints";

import "./style.scss";

class JobInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      companyName: "",
      jobTitle: "",
      autoCompleteCompanyData: [],
      autoCompletePositionsData: [],
      animate: true
    };
    this.handlePositionsSearch = this.handlePositionsSearch.bind(this);
    this.handleAddNewApplication = this.handleAddNewApplication.bind(this);
    this.cancelJobInputEdit = this.cancelJobInputEdit.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ animate: false });
    }, 5);
  }

  handleSearch(value) {
    this.setState({ companyName: value });
    if (value.trim() !== "") {
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
          IS_CONSOLE_LOG_OPEN && console.log(response);
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
  }

  async handlePositionsSearch(value) {
    this.setState({ jobTitle: value });
    if (value.trim() !== "") {
      await this.props.handleTokenExpiration("jobInput handlePositionsSearch");
      let config = { method: "GET" };
      let newUrl = AUTOCOMPLETE("positions") + "?q=" + value + "&count=5";
      axiosCaptcha(newUrl, config).then(response => {
        if (response.statusText === "OK") {
          if (response.data.success) {
            IS_CONSOLE_LOG_OPEN && console.log(response.data);
            let bufferPositionsList = [];
            response.data.data.forEach(position =>
              bufferPositionsList.push(position.job_title)
            );
            this.setState({
              autoCompletePositionsData: bufferPositionsList
            });
          }
        }
      });
    }
  }

  handleAddNewApplication() {
    const { columnName } = this.props;
    //this.props.toggleJobInput();
    this.props.addNewApplication({
      columnName,
      name: this.state.companyName,
      title: this.state.jobTitle
    });
    this.setState({
      companyName: "",
      jobTitle: ""
    });
  }

  cancelJobInputEdit() {
    this.props.toggleJobInput();
    this.setState({
      animate: true,
      companyName: "",
      jobTitle: ""
    });
  }

  render() {
    const { showInput, toggleJobInput } = this.props;
    const { companyName, jobTitle, animate } = this.state;

    const containerClass = classNames({
      "column-addJob-form": true,
      "--animation-from-zero": animate
    });

    return (
      <div>
        <form
          className={containerClass}
          onSubmit={this.handleAddNewApplication}
        >
          <AutoComplete
            dataSource={this.state.autoCompleteCompanyData}
            style={{ marginTop: "4px" }}
            className="input-addJob"
            onSearch={this.handleSearch}
            placeholder="Company Name"
            value={companyName}
            onSelect={value => this.setState({ companyName: value })}
          />
          <AutoComplete
            dataSource={this.state.autoCompletePositionsData}
            style={{ marginTop: "4px" }}
            className="input-addJob"
            onSearch={this.handlePositionsSearch}
            placeholder="Job Title"
            value={jobTitle}
            onSelect={value => this.setState({ jobTitle: value })}
          />
          <div className="column-addJob-form-buttons-container">
            <button
              className="column-addJob-form-button"
              type="reset"
              onClick={this.cancelJobInputEdit}
            >
              Cancel
            </button>
            <Button
              type="primary"
              disabled={
                companyName.trim().length < 1 || jobTitle.trim().length < 1
              }
              onClick={this.handleAddNewApplication}
            >
              Add Job
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

export default JobInput;
