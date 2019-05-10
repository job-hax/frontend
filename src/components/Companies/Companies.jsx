import React from "react";
import { Pagination, Input } from "antd";
import { ReCaptcha } from "react-recaptcha-v3";

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
import "../../assets/libraryScss/antd-scss/antd.scss";

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
      query: ""
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.verifyReCaptchaCallback = this.verifyReCaptchaCallback.bind(this);
  }

  componentDidMount() {
    this.getData("initialRequest");
  }

  componentDidUpdate() {
    if (this.props.active === true) {
      if (this.state.isInitialRequest === "beforeRequest") {
        this.setState({ isInitialRequest: true });
        this.getData("initialRequest");
      }
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

  verifyReCaptchaCallback(recaptchaToken) {
    IS_CONSOLE_LOG_OPEN &&
      console.log("\n\nyour recaptcha token:", recaptchaToken, "\n");
    postUsersRequest.config["body"] = JSON.stringify({
      recaptcha_token: recaptchaToken,
      action: "companies"
    });
    postUsersRequest.config.headers.Authorization = this.props.token;
    axiosCaptcha(
      postUsersRequest.url("verify_recaptcha"),
      postUsersRequest.config
    ).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success != true) {
          this.setState({ isUpdating: false });
          console.log(response, response.data.error_message);
          this.props.alert(
            5000,
            "error",
            "Error: " + response.data.error_message
          );
        }
      }
      postUsersRequest.config["body"] = {};
    });
  }

  getData(requestType) {
    this.setState({ isWaitingResponse: true });
    IS_CONSOLE_LOG_OPEN &&
      console.log(
        "companies token",
        this.props.token,
        "\nactive?",
        this.props.active
      );
    const { url, config } = getCompaniesRequest;
    let newUrl =
      url +
      "?page=" +
      this.state.pageNo +
      "&page_size=" +
      this.state.pageSize +
      "&q=" +
      this.state.query;
    config.headers.Authorization = this.props.token;
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
        <CompanyCards company={company} token={this.props.token} />
      </div>
    ));
  }

  render() {
    IS_CONSOLE_LOG_OPEN &&
      console.log(
        "companies token",
        this.props.token,
        "initialrequest",
        this.state.isInitialRequest
      );
    if (this.state.isInitialRequest === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    else if (this.state.isInitialRequest === true)
      return <Spinner message="Preparing companies..." />;
    if (this.state.isNewPageRequested === true)
      return <Spinner message={"Preparing page " + this.state.pageNo} />;
    if (this.props.active && this.state.isInitialRequest === false) {
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
                    justifyContent: "end"
                  }}
                >
                  <Search
                    placeholder="search"
                    onSearch={value =>
                      this.setState({ query: value, isQueryRequested: true })
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
          <div>
            <ReCaptcha
              sitekey="6LfOH6IUAAAAAL4Ezv-g8eUzkkERCWlnnPq_SdkY"
              action="companies"
              verifyCallback={this.verifyReCaptchaCallback}
            />
          </div>
          <Footer />
        </div>
      );
    }
  }
}

export default Companies;
