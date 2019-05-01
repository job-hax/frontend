import React from "react";
import { Pagination } from "antd";

import Spinner from "../Partials/Spinner/Spinner.jsx";
import CompanyReviews from "./CompanyCards/CompanyCards.jsx";
import { fetchApi } from "../../utils/api/fetch_api";
import { getCompaniesRequest } from "../../utils/api/requests.js";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";
import Footer from "../Partials/Footer/Footer.jsx";

import "./style.scss";
import "../../assets/libraryScss/antd-scss/antd.scss";

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
      pageSize: 10
    };

    this.handlePageChange = this.handlePageChange.bind(this);
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
    }
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
      url + "?page=" + this.state.pageNo + "&page_size=" + this.state.pageSize;
    config.headers.Authorization = this.props.token;
    fetchApi(newUrl, config).then(response => {
      if (response.ok) {
        if (requestType === "initialRequest") {
          this.setState({
            companies: response.json,
            isWaitingResponse: false,
            isInitialRequest: false
          });
        } else if (requestType === "newPageRequest") {
          this.setState({
            companies: response.json,
            isWaitingResponse: false,
            isNewPageRequested: false
          });
        }

        IS_CONSOLE_LOG_OPEN &&
          console.log("companies response json data", response.json);
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
        <CompanyReviews company={company} />
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
      return <Spinner message="Preparing reviews..." />;
    if (this.state.isNewPageRequested === true)
      return <Spinner message={"Preparing page " + this.state.pageNo} />;
    if (this.props.active && this.state.isInitialRequest === false) {
      return (
        <div className="reviews-container">
          {this.generateFeatureArea()}
          <div className="company-cards-container">
            <div>
              {this.generateCompanyCards()}
              <div className="pagination-container">
                <Pagination
                  onChange={this.handlePageChange}
                  defaultCurrent={this.state.companies.pagination.current_page}
                  total={this.state.companies.pagination.total_count}
                />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    }
  }
}

export default Companies;
