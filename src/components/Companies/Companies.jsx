import React from "react";
import { Pagination, Input, Switch, Icon, Checkbox } from "antd";

import Spinner from "../Partials/Spinner/Spinner.jsx";
import CompanyCards from "./CompanyCards/CompanyCards.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import { USERS, COMPANIES } from "../../utils/constants/endpoints.js";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";
import Footer from "../Partials/Footer/Footer.jsx";

import "./style.scss";

const Search = Input.Search;

class Companies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isWaitingResponse: false,
      isInitialRequest: "beforeRequest",
      isNewPageRequested: false,
      isDetailsRequested: false,
      companies: {},
      pageNo: 1,
      pageSize: 10,
      q: "",
      hasReview: false,
      mine: true,
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
      let config = { method: "POST" };
      axiosCaptcha(USERS("verifyRecaptcha"), config, "companies").then(
        response => {
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
        }
      );
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
    const parameters = this.urlBuilder(["q", "hasReview", "mine"]);
    let config = { method: "GET" };
    let newUrl =
      COMPANIES +
      "?page=" +
      this.state.pageNo +
      "&page_size=" +
      this.state.pageSize;
    parameters.forEach(
      parameter =>
        (newUrl = newUrl + "&" + parameter.name + "=" + parameter.value)
    );
    await this.props.handleTokenExpiration("companies getData");
    axiosCaptcha(newUrl, config).then(response => {
      if (response.statusText === "OK") {
        if (requestType === "initialRequest") {
          this.setState({
            companies: response.data,
            isWaitingResponse: false,
            isInitialRequest: false
          });
        } else if (requestType === "newPageRequest") {
          this.setState({
            companies: response.data,
            isWaitingResponse: false,
            isNewPageRequested: false
          });
        } else if (requestType === "queryRequest") {
          this.setState({
            companies: response.data,
            isWaitingResponse: false,
            isQueryRequested: false
          });
        }

        IS_CONSOLE_LOG_OPEN &&
          console.log("companies response.data data", response.data);
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
          <h2>Companies</h2>
        </div>
      </div>
    );
  }

  generateCompanyCards() {
    return this.state.companies.data.map(company => (
      <div key={company.id}>
        <CompanyCards
          company={company}
          handleTokenExpiration={this.props.handleTokenExpiration}
        />
      </div>
    ));
  }

  render() {
    if (this.state.isInitialRequest === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    else if (this.state.isInitialRequest === true)
      return <Spinner message="Preparing companies..." />;
    if (this.state.isNewPageRequested === true)
      return <Spinner message={"Preparing page " + this.state.pageNo} />;
    if (this.state.isInitialRequest === false) {
      return (
        <div>
          <div className="companies-big-container">
            <div className="companies-container">
              {this.generateFeatureArea()}
              <div className="company-cards-container">
                {!this.state.searchClicked ? (
                  <div
                    className="companies-search-before-click"
                    onClick={() => this.setState({ searchClicked: true })}
                  >
                    <Search placeholder="search" />
                  </div>
                ) : (
                  <div className="companies-search" ref={this.setWrapperRef}>
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
                <div className="checkbox-container">
                  <div style={{ marginRight: 25 }}>
                    <Checkbox
                      defaultChecked={this.state.mine}
                      onChange={event =>
                        this.setState({
                          mine: event.target.checked,
                          isQueryRequested: true,
                          pageNo: 1
                        })
                      }
                    />
                    <span style={{marginLeft:5}}>My applications only</span>
                  </div>
                  <div>
                    <Checkbox
                      defaultChecked={this.state.hasReview}
                      onChange={event =>
                        this.setState({
                          hasReview: event.target.checked,
                          isQueryRequested: true,
                          pageNo: 1
                        })
                      }
                    />
                    <span style={{marginLeft:5}}>With reviews only</span>
                  </div>
                </div>
                <div>
                  {this.state.companies.pagination.total_count == 0 ? (
                    <div
                      className="no-data"
                      style={{ textAlign: "center", margin: "24px 0 24px 0" }}
                    >
                      No companies found based on your criteria!
                    </div>
                  ) : (
                    this.generateCompanyCards()
                  )}
                  <div className="pagination-container">
                    <Pagination
                      onChange={this.handlePageChange}
                      defaultCurrent={
                        this.state.companies.pagination.current_page
                      }
                      current={this.state.companies.pagination.current_page}
                      total={this.state.companies.pagination.total_count}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              this.state.companies.pagination.total_count < 2
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

export default Companies;
