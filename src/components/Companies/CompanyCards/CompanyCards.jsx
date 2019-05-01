import React from "react";
import classNames from "classnames";

import Reviews from "../Reviews/Reviews.jsx";
import defaultLogo from "../../../assets/icons/JobHax-logo-black.svg";
import { fetchApi } from "../../../utils/api/fetch_api";
import {
  getCompaniesRequest,
  getReviewsRequest
} from "../../../utils/api/requests.js";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";

import "./style.scss";
import CompanyStats from "../../Partials/CompanyStats/CompanyStats.jsx";

class CompanyCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReviewsShowing: false,
      imageLoadError: true,
      positionsList: [],
      reviewsList: []
    };

    this.toggleReviewsDisplay = this.toggleReviewsDisplay.bind(this);
    this.handleSeeReviews = this.handleSeeReviews.bind(this);
  }

  toggleReviewsDisplay() {
    this.setState({
      isReviewsShowing: !this.state.isReviewsShowing
    });
  }

  handleSeeReviews() {
    let newPositionUrl =
      getCompaniesRequest.url + this.props.company.id + "/positions";
    getCompaniesRequest.config.headers.Authorization = this.props.token;
    fetchApi(newPositionUrl, getCompaniesRequest.config).then(response => {
      if (response.ok) {
        this.setState({
          positionsList: response.json.data
        });
        IS_CONSOLE_LOG_OPEN &&
          console.log(
            "company positions response json data",
            response.json.data
          );
      }
    });
    let newReviewsUrl =
      getReviewsRequest.url +
      "?company_id=" +
      this.props.company.id +
      "&all_reviews=true";
    getReviewsRequest.config.headers.Authorization = this.props.token;
    fetchApi(newReviewsUrl, getReviewsRequest.config).then(response => {
      if (response.ok) {
        this.setState({
          reviewsList: response.json.data
        });
        IS_CONSOLE_LOG_OPEN &&
          console.log(
            "company get all reviews response json data",
            response.json.data
          );
      }
    });

    this.toggleReviewsDisplay();
  }

  render() {
    const { company } = this.props;
    const reviewsClass = classNames({
      "company-card-reviews-container": true,
      hidden: !this.state.isReviewsShowing
    });
    return (
      <div className="company-card-container">
        <div className="company-card-initial">
          <div className="company-card-left">
            <div className="company-card-header">
              <div className="company-logo">
                {company.cb_company_logo == null ? (
                  <img src={company.company_logo || defaultLogo} />
                ) : (
                  <img src={company.cb_company_logo} />
                )}
              </div>
              <div className="company-name">{company.company}</div>
            </div>
            <div className="company-card-info" />
            {this.props.company.review_count != 0 &&
              (!this.state.isReviewsShowing ? (
                <div
                  className="see-reviews-button"
                  onClick={this.handleSeeReviews}
                >
                  See {this.props.company.review_count} reviews
                </div>
              ) : (
                <div
                  className="see-reviews-button"
                  onClick={this.toggleReviewsDisplay}
                >
                  See less...
                </div>
              ))}
          </div>
          <div className="company-card-right">
            <CompanyStats company={this.props.company} />
          </div>
        </div>
        {this.state.reviewsList.length != 0 && (
          <div className={reviewsClass}>
            <Reviews
              reviewsList={this.state.reviewsList}
              positionsList={this.state.positionsList}
              company_id={this.props.company.id}
              token={this.props.token}
              style={{ paddingTop: 0, maxHeight: "50vh" }}
              reviewContainerStyle={{
                display: "block"
              }}
              leftWidth={{
                minWidth: "360px",
                maxWidth: "360px"
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default CompanyCards;
