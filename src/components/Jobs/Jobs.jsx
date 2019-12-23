import React from "react";
import { Pagination, Input, Select, Switch, Icon, Checkbox } from "antd";

import Spinner from "../Partials/Spinner/Spinner.jsx";
import JobCard from "./JobCard/JobCard.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import { USERS, COMPANIES, JOBS } from "../../utils/constants/endpoints.js";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";
import Footer from "../Partials/Footer/Footer.jsx";

import "./style.scss";

const Search = Input.Search;
const { Option } = Select;

class Jobs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isWaitingResponse: false,
      isInitialRequest: "beforeRequest",
      isNewPageRequested: false,
      isDetailsRequested: false,
      jobs: {},
      profile_data: {},
      pageNo: 1,
      pageSize: 10,
      q: "",
      department: "",
      type: "",
      searchClicked: false
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.urlBuilder = this.urlBuilder.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  async componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      this.setState({ isInitialRequest: true });
      await this.getData("initialRequest");
      this.getProfileData();
      let config = { method: "POST" };
      axiosCaptcha(USERS("verifyRecaptcha"), config).then(response => {
        if (response.statusText === "OK") {
          if (response.data.success != true) {
            this.setState({ isUpdating: false });
            IS_CONSOLE_LOG_OPEN &&
              console.log(response, response.data.error_message);
            this.props.alert(
              5000,
              "error",
              "Error: " + response.data.error_message
            );
          }
        }
      });
    }
  }

  componentDidUpdate() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      if (this.state.isNewPageRequested === true) {
        this.getData("newPageRequest");
        this.setState({ isNewPageRequested: false });
      }
      if (this.state.isQueryRequested === true) {
        this.getData("queryRequest");
        this.setState({ isQueryRequested: false });
      }
    }
  }

  componentWillMount() {
    document.addEventListener("mousedown", this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.addEventListener("mousedown", this.handleClickOutside, false);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if (this.state.q == ("" || null || false)) {
        this.setState({ searchClicked: false });
      }
    }
  }

  urlBuilder(list) {
    let parameterList = [];
    for (let i = 0; i <= list.length - 1; i++) {
      if (
        this.state[list[i]] != "" &&
        this.state[list[i]] != null &&
        this.state[list[i]] != false
      ) {
        parameterList.push({
          name: list[i],
          value: this.state[list[i]]
        });
      }
    }
    return parameterList;
  }

  async getData(requestType) {
    this.setState({ isWaitingResponse: true });
    const parameters = this.urlBuilder(["q", "department", "type"]);
    let config = { method: "GET" };
    let url_parameters =
      "?id=1835&page=" +
      this.state.pageNo +
      "&page_size=" +
      this.state.pageSize;
    parameters.forEach(
      parameter =>
        (url_parameters =
          url_parameters + "&" + parameter.name + "=" + parameter.value)
    );
    const newUrl = JOBS(url_parameters);
    await this.props.handleTokenExpiration("jobs getData");
    axiosCaptcha(newUrl, config).then(response => {
      if (response.statusText === "OK") {
        if (requestType === "initialRequest") {
          this.setState({
            jobs: response.data,
            isWaitingResponse: false,
            isInitialRequest: false
          });
        } else if (requestType === "newPageRequest") {
          this.setState({
            jobs: response.data,
            isWaitingResponse: false,
            isNewPageRequested: false
          });
        } else if (requestType === "queryRequest") {
          this.setState({
            jobs: response.data,
            isWaitingResponse: false,
            isQueryRequested: false
          });
        }

        IS_CONSOLE_LOG_OPEN &&
          console.log("jobs response.data data", response.data);
      }
    });
  }

  getProfileData() {
    let config = { method: "GET" };
    axiosCaptcha(USERS("profile"), config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          this.setState({ profile_data: response.data.data });
        }
      }
    });
  }

  handlePageChange(page) {
    this.setState({ pageNo: page, isNewPageRequested: true });
  }

  generateFeatureArea() {
    return (
      <div id="feature">
        <div className="title">
          <h2>Jobs</h2>
        </div>
      </div>
    );
  }

  generateJobCards() {
    return this.state.jobs.data.map(job => (
      <div key={job.id}>
        <JobCard
          job={job}
          profile_data={this.state.profile_data}
          handleTokenExpiration={this.props.handleTokenExpiration}
        />
      </div>
    ));
  }

  generateFilterArea() {
    const { department, type } = this.state;
    return (
      <div className="filter-area-container">
        <div className="filter-indicator">Filter by:</div>
        <div className="filter-dropdown">
          <Select
            defaultValue=""
            onChange={value =>
              this.setState({
                department: value,
                isQueryRequested: true,
                pageNo: 1
              })
            }
            dropdownMatchSelectWidth={false}
          >
            <Option value="">
              {department === "" ? "Department" : "All Departments"}
            </Option>
            <Option value="Business">Business</Option>
            <Option value="Engineering">Engineering</Option>
            <Option value="Finance">Finance</Option>
            <Option value="Marketing">Marketing</Option>
            <Option value="Legal">Legal</Option>
          </Select>
        </div>
        <div className="filter-dropdown">
          <Select
            defaultValue=""
            onChange={value =>
              this.setState({
                type: value,
                isQueryRequested: true,
                pageNo: 1
              })
            }
            dropdownMatchSelectWidth={false}
          >
            <Option value="">{type === "" ? "Type" : "All Types"}</Option>
            <Option value="Full Time">Full Time</Option>
            <Option value="Part Time">Part Time</Option>
            <Option value="Contractor">Contractor</Option>
          </Select>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.isInitialRequest === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    else if (this.state.isInitialRequest === true)
      return <Spinner message="Preparing jobs..." />;
    if (this.state.isNewPageRequested === true)
      return <Spinner message={"Preparing page " + this.state.pageNo} />;
    if (this.state.isInitialRequest === false) {
      return (
        <div>
          <div className="jobs-big-container">
            <div className="jobs-container" id="jobs-container">
              {this.generateFeatureArea()}
              <div className="job-cards-container">
                {!this.state.searchClicked ? (
                  <div
                    className="jobs-search-before-click"
                    onClick={() => this.setState({ searchClicked: true })}
                  >
                    <Search placeholder="search" />
                  </div>
                ) : (
                  <div className="jobs-search" ref={this.setWrapperRef}>
                    <Search
                      placeholder="search"
                      onChange={event =>
                        this.setState({ q: event.target.value })
                      }
                      onSearch={value =>
                        this.setState({
                          q: value,
                          isQueryRequested: true,
                          pageNo: 1
                        })
                      }
                    />
                  </div>
                )}
                {this.generateFilterArea()}
                <div>
                  {this.state.jobs.pagination.total_count == 0 ? (
                    <div
                      className="no-data"
                      style={{ textAlign: "center", margin: "24px 0 24px 0" }}
                    >
                      No jobs found based on your criteria!
                    </div>
                  ) : (
                    this.generateJobCards()
                  )}
                  <div className="pagination-container">
                    <Pagination
                      onChange={this.handlePageChange}
                      defaultCurrent={this.state.jobs.pagination.current_page}
                      current={this.state.jobs.pagination.current_page}
                      total={this.state.jobs.pagination.total_count}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              this.state.jobs.pagination.total_count < 2
                ? "bottom-fixed-footer"
                : ""
            }
          >
            <Footer />
          </div>
        </div>
      );
    }
  }
}

export default Jobs;
