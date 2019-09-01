import React from "react";
import { AutoComplete, DatePicker, Select } from "antd";
import moment from "moment";

import {
  makeTimeBeautiful,
  IS_CONSOLE_LOG_OPEN
} from "../../../../../../../utils/constants/constants.js";
import { axiosCaptcha } from "../../../../../../../utils/api/fetch_api.js";
import {
  JOB_APPS,
  GET_SOURCES,
  AUTOCOMPLETE
} from "../../../../../../../utils/constants/endpoints.js";

class JobDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCompanyEditing: false,
      isPositionsEditing: false,
      isApplyDateEditing: false,
      isApplicationSourcesEditing: false,
      companyName:
        this.props.card.company_object &&
        this.props.card.company_object.company,
      jobTitle: this.props.card.position && this.props.card.position.job_title,
      apply_date: makeTimeBeautiful(this.props.card.apply_date, "date"),
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
    if (this.state.jobTitle.trim() == (null || "")) {
      this.props.alert(3000, "error", "Position cannot be empty!");
      if (this.props.card.position) {
        this.setState({
          jobTitle: this.props.card.position.job_title
        });
      }
    } else {
      this.body["job_title"] = this.state.jobTitle.trim();
    }
    if (this.state.companyName.trim() == (null || "")) {
      this.props.alert(3000, "error", "Company name cannot be empty!");
      if (this.props.card.company_object) {
        this.setState({
          companyName: this.props.card.company_object.company
        });
      }
    } else {
      this.body["company"] = this.state.companyName.trim();
    }
    this.body["source"] = this.state.source;
    let config = { method: "PATCH" };
    config.body = this.body;
    const response = await axiosCaptcha(JOB_APPS, config);
    if (response.statusText === "OK") {
      if (response.data.success === true) {
        this.props.updateCard(
          response.data.data.company_object,
          response.data.data.position,
          response.data.data.apply_date,
          response.data.data.app_source
        );
        this.props.updateHeader();
      } else {
        IS_CONSOLE_LOG_OPEN &&
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
        IS_CONSOLE_LOG_OPEN && console.log(response);
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
            value={companyName && companyName}
            onSelect={value => this.setState({ companyName: value })}
          />
        ) : this.props.card.editable == true ? (
          <div className={infoClass} onClick={this.toggleCompanyEdit}>
            {companyName && companyName}
          </div>
        ) : (
          <div className={infoClass}>{companyName && companyName}</div>
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
            value={jobTitle && jobTitle}
            onSelect={value => this.setState({ jobTitle: value })}
          />
        ) : this.props.card.editable == true ? (
          <div className={infoClass} onClick={this.togglePositionsEdit}>
            {jobTitle && jobTitle}
          </div>
        ) : (
          <div className={infoClass}>{jobTitle && jobTitle}</div>
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
    this.setState({ apply_date: dateString, isApplyDateEditing: false });
  }

  generateApplyDateInfo() {
    IS_CONSOLE_LOG_OPEN && console.log("date", this.props.card.apply_date);
    const dateFormat = "MM.DD.YYYY";
    const { apply_date, isApplyDateEditing } = this.state;
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
              new Date(this.props.card.apply_date.split("T")[0] + "T06:00:00"),
              dateFormat
            )}
            format={dateFormat}
            style={{ width: "200px", marginTop: "4px" }}
          />
        ) : this.props.card.editable == true ? (
          <div className={infoClass} onClick={this.toggleApplyDateEdit}>
            {apply_date}
          </div>
        ) : (
          <div className={infoClass}>{apply_date}</div>
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
    let config = { method: "GET" };
    axiosCaptcha(GET_SOURCES, config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          IS_CONSOLE_LOG_OPEN && console.log(response.data);
          this.setState({
            sourcesList: response.data.data
          });
        }
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
