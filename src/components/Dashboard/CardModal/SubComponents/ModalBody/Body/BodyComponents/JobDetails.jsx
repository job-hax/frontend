import React from "react";
import { AutoComplete, DatePicker, Select, Timeline } from "antd";
import moment from "moment";

import {
  IS_CONSOLE_LOG_OPEN,
  MEDIUM_DATE_FORMAT,
  DATE_AND_TIME_FORMAT
} from "../../../../../../../utils/constants/constants.js";
import { axiosCaptcha } from "../../../../../../../utils/api/fetch_api.js";
import {
  JOB_APPS,
  GET_SOURCES,
  AUTOCOMPLETE
} from "../../../../../../../utils/constants/endpoints.js";
import CompanyStats from "../../../../../../Partials/CompanyStats/CompanyStats.jsx";

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
      apply_date: moment(this.props.card.apply_date).format(MEDIUM_DATE_FORMAT),
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

    this.inputStyle = { width: "400px", marginTop: "4px" };
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
          this.setState({
            autoCompleteCompanyData: bufferList
          });
        }
      });
    }
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
      <div className="info">
        <label>
          <div>{"Company"}</div>
        </label>
        {isCompanyEditing == true ? (
          <AutoComplete
            dataSource={autoCompleteCompanyData}
            style={this.inputStyle}
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
    if (value.trim() !== "") {
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

  generatePositionsInfo() {
    const {
      jobTitle,
      autoCompletePositionsData,
      isPositionsEditing
    } = this.state;
    const infoClass =
      this.props.card.editable == true ? "text-editable" : "text";
    return (
      <div className="info">
        <label>
          <div>{"Position"}</div>
        </label>
        {isPositionsEditing == true ? (
          <AutoComplete
            dataSource={autoCompletePositionsData}
            style={this.inputStyle}
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
      <div className="info">
        <label>
          <div>{"Applied on"}</div>
        </label>
        {isApplyDateEditing == true ? (
          <DatePicker
            onChange={this.handleApplyDate}
            defaultValue={moment(this.props.card.apply_date)}
            format={dateFormat}
            style={this.inputStyle}
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
      <div className="info">
        <label>
          <div>{"Source"}</div>
        </label>
        {isApplicationSourcesEditing == true ? (
          <Select
            name="source"
            value={source}
            onChange={() => this.handleApplicationSources(event)}
            style={this.inputStyle}
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

  generateRatings() {
    let ratingTotal = 0;
    let countTotal = 0;
    this.props.card.company_object.ratings.forEach(
      rating => (
        (ratingTotal += Number(rating.id) * Number(rating.count)),
        (countTotal += Number(rating.count))
      )
    );
    const averageRating =
      ratingTotal == 0 ? 0 : Math.round((ratingTotal / countTotal) * 10) / 10;
    return (
      <div className="info">
        <label> Ratings </label>
        <div style={{ margin: "10px 4px 0px 0px" }}>
          <CompanyStats
            stats={false}
            ratings={true}
            company={this.props.card.company_object}
          />
        </div>
        <div style={{ fontSize: "20px", marginTop: 6 }}>
          {countTotal != 0 && averageRating}
        </div>
      </div>
    );
  }

  generateTimeline() {
    const points = this.props.card.timeline.map(point => (
      <Timeline.Item key={point.id}>
        {point.name} {moment(point.time).format(DATE_AND_TIME_FORMAT)}
      </Timeline.Item>
    ));

    return <Timeline mode="alternate">{points}</Timeline>;
  }

  generateAllInfo() {
    return (
      <div>
        {this.generateCompanyInfo()}
        {this.generatePositionsInfo()}
        {this.generateApplyDateInfo()}
        {this.generateApplicationSourcesInfo()}
        {this.generateRatings()}
        {/*this.generateTimeline()*/}
      </div>
    );
  }

  render() {
    return (
      <div ref={this.setWrapperRef} className="data">
        <div>{this.generateAllInfo()}</div>
      </div>
    );
  }
}

export default JobDetails;
