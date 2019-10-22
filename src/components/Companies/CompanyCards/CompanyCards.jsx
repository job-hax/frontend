import React from "react";
import classNames from "classnames";

import Reviews from "../Reviews/Reviews.jsx";
import defaultLogo from "../../../assets/icons/JobHax-logo-black.svg";
import { axiosCaptcha } from "../../../utils/api/fetch_api";
import {
  COMPANIES,
  REVIEWS,
  apiRoot
} from "../../../utils/constants/endpoints.js";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";
import CompanyStats from "../../Partials/CompanyStats/CompanyStats.jsx";

import "./style.scss";
import { Icon } from "antd";

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
    let companiesConfig = { method: "GET" };
    let newPositionUrl =
      COMPANIES + this.props.company.id + "/positions/?hasReview=true";
    axiosCaptcha(newPositionUrl, companiesConfig).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          this.setState({
            positionsList: response.data.data
          });
          IS_CONSOLE_LOG_OPEN &&
            console.log(
              "company positions response.data data",
              response.data.data
            );
        }
      }
    });
    let config = { method: "GET" };
    let newReviewsUrl =
      REVIEWS + "?company_id=" + this.props.company.id + "&all_reviews=true";
    axiosCaptcha(newReviewsUrl, config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          this.setState({
            reviewsList: response.data.data
          });
          IS_CONSOLE_LOG_OPEN &&
            console.log(
              "company get all reviews response.data data",
              response.data.data
            );
        }
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
            <div className="company-logo">
              <img src={apiRoot + company.logo} />
            </div>
          </div>
          <div className="company-card-right">
            <div className="company-name">{company.company}</div>
            <CompanyStats
              company={this.props.company}
              stats={true}
              ratings={true}
            />
          </div>
        </div>
        {this.props.company.review_count != 0 &&
          (!this.state.isReviewsShowing ? (
            <div className="see-reviews-button" onClick={this.handleSeeReviews}>
              View {this.props.company.review_count} reviews
              <Icon type="down" style={{ margin: "2px 0px 0px 5px" }} />
            </div>
          ) : (
            <div
              className="see-reviews-button"
              onClick={this.toggleReviewsDisplay}
            >
              Hide {this.props.company.review_count} reviews
              <Icon type="up" style={{ margin: "2px 0px 0px 5px" }} />
            </div>
          ))}
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
