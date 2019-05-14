import React from "react";
import classNames from "classnames";

import Reviews from "../Reviews/Reviews.jsx";
import defaultLogo from "../../../assets/icons/JobHax-logo-black.svg";
import { axiosCaptcha } from "../../../utils/api/fetch_api";
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

  async handleSeeReviews() {
    await this.props.handleTokenExpiration("companyCards handleSeeReviews");
    let newPositionUrl =
      getCompaniesRequest.url + this.props.company.id + "/positions";
    axiosCaptcha(newPositionUrl, getCompaniesRequest.config).then(response => {
      if (response.statusText === "OK") {
        this.setState({
          positionsList: response.data.data
        });
        IS_CONSOLE_LOG_OPEN &&
          console.log(
            "company positions response.data data",
            response.data.data
          );
      }
    });
    let newReviewsUrl =
      getReviewsRequest.url +
      "?company_id=" +
      this.props.company.id +
      "&all_reviews=true";
    axiosCaptcha(newReviewsUrl, getReviewsRequest.config).then(response => {
      if (response.statusText === "OK") {
        this.setState({
          reviewsList: response.data.data
        });
        IS_CONSOLE_LOG_OPEN &&
          console.log(
            "company get all reviews response.data data",
            response.data.data
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
              handleTokenExpiration={this.props.handleTokenExpiration}
              filterDisplay={true}
              style={{ paddingTop: 0, maxHeight: "50vh" }}
              reviewContainerStyle={{
                display: "block"
              }}
              leftWidth={{
                minWidth: "384px",
                maxWidth: "384px"
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default CompanyCards;
