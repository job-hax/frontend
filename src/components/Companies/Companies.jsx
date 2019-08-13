import React from "react";
import { Pagination, Input, Switch } from "antd";

import Spinner from "../Partials/Spinner/Spinner.jsx";
import CompanyCards from "./CompanyCards/CompanyCards.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import {
  getCompaniesRequest,
  postUsersRequest
} from "../../utils/api/requests.js";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";
import Footer from "../Partials/Footer/Footer.jsx";

import "./style.scss";
import "../../assets/libraryScss/antd-scss/newantd.scss";

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
      mine: true
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.urlBuilder = this.urlBuilder.bind(this);
  }

  async componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      this.setState({ isInitialRequest: true });
      await this.getData("initialRequest");
      axiosCaptcha(
        postUsersRequest.url("verify_recaptcha"),
        postUsersRequest.config,
        "companies"
      ).then(response => {
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
    const { url, config } = getCompaniesRequest;
    let newUrl =
      url + "?page=" + this.state.pageNo + "&page_size=" + this.state.pageSize;
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
          <div className="reviews-container">
            {this.generateFeatureArea()}
            <div className="company-cards-container">
              <div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 500
                  }}
                >
                  <div>
                    My applications only{" "}
                    <Switch
                      defaultChecked={this.state.mine}
                      onChange={checked =>
                        this.setState({ mine: checked, isQueryRequested: true })
                      }
                    />
                  </div>
                  <div>
                    With reviews only{" "}
                    <Switch
                      defaultChecked={this.state.hasReview}
                      onChange={checked =>
                        this.setState({
                          hasReview: checked,
                          isQueryRequested: true
                        })
                      }
                    />
                  </div>
                  <Search
                    placeholder="search"
                    onSearch={value =>
                      this.setState({ q: value, isQueryRequested: true })
                    }
                    style={{ width: 300, margin: "0 0 24px 0" }}
                  />
                </div>

                <div>
                  {this.generateCompanyCards()}
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
