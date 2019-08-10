import React from "react";
import { AutoComplete, DatePicker, Select } from "antd";
import moment from "moment";

import { makeTimeBeautiful } from "../../../../../../../utils/constants/constants.js";
import { axiosCaptcha } from "../../../../../../../utils/api/fetch_api.js";
import {
  getAutoCompleteRequest,
  getSourcesRequest,
  editJobAppRequest
} from "../../../../../../../utils/api/requests.js";
import CompanyStats from "../../../../../../Partials/CompanyStats/CompanyStats.jsx";

class JobDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCompanyEditing: false,
      isPositionsEditing: false,
      isApplyDateEditing: false,
      isApplicationSourcesEditing: false,
      companyName: this.props.card.companyObject.company,
      jobTitle: this.props.card.position.job_title,
      applyDate: makeTimeBeautiful(this.props.card.applyDate, "date"),
      source:
        this.props.card.app_source === null
          ? "N/A"
          : this.props.card.app_source.value,
      autoCompleteCompanyData: [],
      autoCompletePositionsData: [],
      sourcesList: []
    };

    this.body = { jobapp_id: this.props.card.id };

    this.handlePositionsSearch = this.handlePositionsSearch.bind(this);
    this.handleCompanySearch = this.handleCompanySearch.bind(this);
    this.handleApplyDate = this.handleApplyDate.bind(this);
    this.handleApplicationSources = this.handleApplicationSources.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
    this.toggleCompanyEdit = this.toggleCompanyEdit.bind(this);
    this.togglePositionsEdit = this.togglePositionsEdit.bind(this);
    this.toggleApplyDateEdit = this.toggleApplyDateEdit.bind(this);
    this.toggleApplicationSourcesEdit = this.toggleApplicationSourcesEdit.bind(
      this
    );
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    this.getApplicationSources();
  }

  async submitChanges() {
    this.body["job_title"] = this.state.jobTitle;
    this.body["company"] = this.state.companyName;
    this.body["source"] = this.state.source;
    const { url, config } = editJobAppRequest;
    config.body = this.body;
    const response = await axiosCaptcha(url, config);
    if (response.statusText === "OK") {
      if (response.data.success === true) {
        this.props.updateCard(
          response.data.data.companyObject,
          response.data.data.position,
          response.data.data.applyDate,
          response.data.data.app_source
        );
        this.props.updateHeader();
      } else {
        console.log(response, response.data.error_message);
        this.props.alert(
          5000,
          "error",
          "Error: " + response.data.error_message
        );
      }
    } else {
      this.props.alert(5000, "error", "Something went wrong!");
    }
  }

  //Toggle All When Click Outside their group div
  componentWillMount() {
    document.addEventListener("mousedown", this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.addEventListener("mousedown", this.handleClickOutside, false);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  async handleClickOutside(event) {
    if (
      this.state.isCompanyEditing == true ||
      this.state.isPositionsEditing == true ||
      this.state.isApplicationSourcesEditing == true
    ) {
      if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
        await setTimeout(() => {
          this.toggleAll();
        }, 500);
      }
    }
  }

  toggleAll() {
    this.setState({
      isCompanyEditing: false,
      isPositionsEditing: false,
      isApplyDateEditing: false,
      isApplicationSourcesEditing: false
    });
    this.submitChanges();
  }

  //Company Info
  toggleCompanyEdit() {
    this.setState({
      isCompanyEditing: true,
      isPositionsEditing: false,
      isApplyDateEditing: false,
      isApplicationSourcesEditing: false
    });
  }

  handleCompanySearch(value) {
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
        this.setState({
          autoCompleteCompanyData: bufferList
        });
      }
    });
  }

  generateCompanyInfo() {
    const {
      companyName,
      autoCompleteCompanyData,
      isCompanyEditing
    } = this.state;
    const infoClass =
      this.props.card.editable == true ? "text-editable" : "text";
    return (
      <div className="modal-body main data info">
        <label>
          <div>{"Company"}</div>
          <div>{" : "}</div>
        </label>
        {isCompanyEditing == true ? (
          <AutoComplete
            dataSource={autoCompleteCompanyData}
            style={{ width: "200px", marginTop: "4px" }}
            onSearch={this.handleCompanySearch}
            placeholder="Company Name"
            value={companyName}
          />
        ) : this.props.card.editable == true ? (
          <div className={infoClass} onClick={this.toggleCompanyEdit}>
            {companyName}
          </div>
        ) : (
          <div className={infoClass}>{companyName}</div>
        )}
      </div>
    );
  }

  //Position Info
  togglePositionsEdit() {
    this.setState({
      isPositionsEditing: true,
      isCompanyEditing: false,
      isApplyDateEditing: false,
      isApplicationSourcesEditing: false
    });
  }

  handlePositionsSearch(value) {
    this.setState({ jobTitle: value });
    const { url, config } = getAutoCompleteRequest;
    let newUrl = url("positions") + "?q=" + value + "&count=5";
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

  generatePositionsInfo() {
    const {
      jobTitle,
      autoCompletePositionsData,
      isPositionsEditing
    } = this.state;
    const infoClass =
      this.props.card.editable == true ? "text-editable" : "text";
    return (
      <div className="modal-body main data info">
        <label>
          <div>{"Position"}</div>
          <div>{" : "}</div>
        </label>
        {isPositionsEditing == true ? (
          <AutoComplete
            dataSource={autoCompletePositionsData}
            style={{ width: "200px", marginTop: "4px" }}
            onSearch={this.handlePositionsSearch}
            placeholder="Job Title"
            value={jobTitle}
          />
        ) : this.props.card.editable == true ? (
          <div className={infoClass} onClick={this.togglePositionsEdit}>
            {jobTitle}
          </div>
        ) : (
          <div className={infoClass}>{jobTitle}</div>
        )}
      </div>
    );
  }

  //Application Date Info
  toggleApplyDateEdit() {
    this.setState({
      isCompanyEditing: false,
      isPositionsEditing: false,
      isApplyDateEditing: true,
      isApplicationSourcesEditing: false
    });
  }

  handleApplyDate(date, dateString) {
    this.body["application_date"] = date.toISOString().split("T")[0];
    this.submitChanges();
    this.setState({ applyDate: dateString, isApplyDateEditing: false });
  }

  generateApplyDateInfo() {
    console.log("date", this.props.card.applyDate);
    const dateFormat = "MM.DD.YYYY";
    const { applyDate, isApplyDateEditing } = this.state;
    const infoClass =
      this.props.card.editable == true ? "text-editable" : "text";
    return (
      <div className="modal-body main data info">
        <label>
          <div>{"Applied On"}</div>
          <div>{" : "}</div>
        </label>
        {isApplyDateEditing == true ? (
          <DatePicker
            onChange={this.handleApplyDate}
            defaultValue={moment(
              new Date(this.props.card.applyDate.split("T")[0] + "T06:00:00"),
              dateFormat
            )}
            format={dateFormat}
            style={{ width: "200px", marginTop: "4px" }}
          />
        ) : this.props.card.editable == true ? (
          <div className={infoClass} onClick={this.toggleApplyDateEdit}>
            {applyDate}
          </div>
        ) : (
          <div className={infoClass}>{applyDate}</div>
        )}
      </div>
    );
  }

  //Application Source Info
  toggleApplicationSourcesEdit() {
    this.setState({
      isApplicationSourcesEditing: true,
      isCompanyEditing: false,
      isPositionsEditing: false,
      isApplyDateEditing: false
    });
  }

  getApplicationSources() {
    const { url, config } = getSourcesRequest;
    axiosCaptcha(url, config).then(response => {
      if (response.statusText === "OK") {
        console.log(response.data);
        this.setState({
          sourcesList: response.data.data
        });
      }
    });
  }

  handleApplicationSources(event) {
    this.setState({ source: event.target.textContent });
  }

  generateApplicationSourcesInfo() {
    const { source, sourcesList, isApplicationSourcesEditing } = this.state;
    const infoClass =
      this.props.card.editable == true ? "text-editable" : "text";
    return (
      <div className="modal-body main data info">
        <label>
          <div>{"Source"}</div>
          <div>{" : "}</div>
        </label>
        {isApplicationSourcesEditing == true ? (
          <Select
            name="source"
            value={source}
            onChange={() => this.handleApplicationSources(event)}
            style={{ width: "200px", marginTop: "4px" }}
          >
            {sourcesList.map(each => (
              <Option
                id={each.id}
                type="dropdown"
                title="source"
                key={each.id}
                value={each.value}
              >
                {each.value}
              </Option>
            ))}
          </Select>
        ) : this.props.card.editable == true ? (
          <div
            className={infoClass}
            onClick={this.toggleApplicationSourcesEdit}
          >
            {source}
          </div>
        ) : (
          <div className={infoClass}>{source}</div>
        )}
      </div>
    );
  }

  generateAllInfo() {
    return (
      <div>
        {this.generateCompanyInfo()}
        {this.generatePositionsInfo()}
        {this.generateApplyDateInfo()}
        {this.generateApplicationSourcesInfo()}
      </div>
    );
  }

  render() {
    return (
      <div ref={this.setWrapperRef} className="modal-body main data">
        <div>{this.generateAllInfo()}</div>
      </div>
    );
  }
}

export default JobDetails;
