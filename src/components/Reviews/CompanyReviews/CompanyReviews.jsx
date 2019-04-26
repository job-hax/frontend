import React from "react";
import classNames from "classnames";
import faker from "faker";

import Review from "../Review/Review.jsx";
import defaultLogo from "../../../assets/icons/JobHax-logo-black.svg";

import "./style.scss";

class CompanyReviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReviewsShowing: false,
      imageLoadError: true
    };
  }

  render() {
    const { company } = this.props;
    const reviewsClass = classNames({
      "company-card-reviews-container": true,
      hidden: !this.state.isReviewsShowing
    });
    return (
      <div className="company-card-container">
        <div
          className="company-card-initial"
          onClick={() =>
            this.setState({ isReviewsShowing: !this.state.isReviewsShowing })
          }
        >
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
            <div className="company-card-info">
              {faker.lorem.paragraph().toString()}
            </div>
          </div>
          <div className="company-card-right">stars</div>
        </div>
        <div className={reviewsClass}>
          <Review />
        </div>
      </div>
    );
  }
}

export default CompanyReviews;
