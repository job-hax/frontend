import React from "react";

import { IS_CONSOLE_LOG_OPEN } from "../../../../../../../utils/constants/constants.js";
import Reviews from "../../../../../../Companies/Reviews/Reviews.jsx";
import ReviewInput from "./ReviewInput/ReviewInput.jsx";
import { axiosCaptcha } from "../../../../../../../utils/api/fetch_api.js";
import { REVIEWS } from "../../../../../../../utils/constants/endpoints.js";
import { Button, Icon } from "antd";

class JobReviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnteringReview: false,
      isAlreadySubmittedReview: false,
      isReviewsDisplaying: false,
      isUpdated: false,
      isReviewChanged: false,
      company: {},
      reviewsList: [],
      review: {
        id: -1
      }
    };

    this.toggleReviewEdit = this.toggleReviewEdit.bind(this);
    this.getPositionsReviews = this.getPositionsReviews.bind(this);
    this.requestUpdate = this.requestUpdate.bind(this);
    this.setReview = this.setReview.bind(this);
  }

  componentDidMount() {
    this.getPositionsReviews();
    if (this.props.card.company_object.review_id) {
      //await this.props.handleTokenExpiration("cardModal componentDidMount"); //I am not checking if token expired here because getNotes from Notes.jsx is already checking right before this one is executed!!!
      let config = { method: "GET" };
      let newReviewsUrl =
        REVIEWS + "?review_id=" + this.props.card.company_object.review_id;
      axiosCaptcha(newReviewsUrl, config).then(response => {
        if (response.statusText === "OK") {
          this.setState({ review: response.data.data });
          IS_CONSOLE_LOG_OPEN &&
            console.log("reviews old review", response.data.data);
        }
      });
    }
  }

  async componentDidUpdate() {
    if (this.state.isReviewChanged === true) {
      IS_CONSOLE_LOG_OPEN && console.log("reviews componentDidUpdate");
      this.getPositionsReviews();
      this.setState({ isReviewChanged: false });
    }
  }

  requestUpdate() {
    this.setState({ isReviewChanged: true });
  }

  setReview(review) {
    this.setState({ review: review });
  }

  getPositionsReviews() {
    let config = { method: "GET" };
    let reviewsUrl =
      REVIEWS +
      "?company_id=" +
      this.props.card.company_object.id +
      "&position_id=" +
      this.props.card.position.id +
      "&all_reviews=true";
    axiosCaptcha(reviewsUrl, config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          this.setState({
            reviewsList: response.data.data,
            isReviewsDisplaying: true
          });
        }
      }
    });
  }

  toggleReviewEdit() {
    this.setState({
      isReviewsDisplaying: !this.state.isReviewsDisplaying,
      isEnteringReview: !this.state.isEnteringReview
    });
  }

  render() {
    IS_CONSOLE_LOG_OPEN &&
      console.log("jobreviews render", this.state.reviewsList);
    const { card } = this.props;
    const buttonText = this.props.card.company_object.review_id
      ? "Update Your Review"
      : "Add a Review";
    const iconType = this.props.card.company_object.review_id ? "edit" : "plus";
    return (
      <div style={{ height: "510px", overflow: "hidden" }}>
        <div className="modal-review-big-container">
          {!this.state.isEnteringReview && (
            <div className="review-entry-container">
              <div className="review-button">
                <Button type="primary" onClick={this.toggleReviewEdit}>
                  <Icon type={iconType} />
                  {buttonText}
                </Button>
              </div>
              <div>
                {this.state.reviewsList.length == 0 && (
                  <div className="no-data" style={{ paddingTop: 80 }}>
                    No reviews entered for {card.position.job_title} position at{" "}
                    {card.company_object.company}
                  </div>
                )}
                {this.state.isReviewsDisplaying === true && (
                  <div style={{ paddingTop: 40 }}>
                    <Reviews
                      reviewsList={this.state.reviewsList}
                      positionsList={[]}
                      company_id={this.props.card.company_object.id}
                      filterDisplay={false}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {this.state.isEnteringReview && (
            <div className="review-entry-container">
              <div className="modal-reviews-container">
                <ReviewInput
                  toggleReview={this.toggleReviewEdit}
                  card={this.props.card}
                  setCompany={this.props.setCompany}
                  setReview={this.setReview}
                  renewReviews={this.requestUpdate}
                  oldReview={this.state.review}
                  alert={this.props.alert}
                  handleTokenExpiration={this.props.handleTokenExpiration}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default JobReviews;
