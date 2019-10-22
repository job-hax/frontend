import React from "react";
import { Rate, Menu, Dropdown, Button, Icon } from "antd";
import moment from "moment";

import { DATE_AND_TIME_FORMAT } from "../../../utils/constants/constants.js";
import { axiosCaptcha } from "../../../utils/api/fetch_api";
import { REVIEWS } from "../../../utils/constants/endpoints.js";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";

import "./style.scss";

const desc = ["terrible", "bad", "normal", "good", "perfect"];

class Reviews extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reviewsList: this.props.reviewsList,
      displaying: "All Positions"
    };

    this.handlePositionFilterChange = this.handlePositionFilterChange.bind(
      this
    );
  }

  componentDidUpdate() {
    if (this.state.reviewsList != this.props.reviewsList) {
      this.setState({ reviewsList: this.props.reviewsList });
    }
  }

  async handlePositionFilterChange(event) {
    console.log(event);
    let value = event.key;
    let id = event.item.props.value;
    if (value == "Reset") {
      this.setState({
        reviewsList: this.props.reviewsList,
        displaying: "All Positions"
      });
    } else {
      this.setState({ displaying: value });
      await this.props.handleTokenExpiration(
        "reviews handlePositionFilterChange"
      );
      let config = { method: "GET" };
      let newReviewsUrl =
        REVIEWS +
        "?company_id=" +
        this.props.company_id +
        "&position_id=" +
        id +
        "&all_reviews=true";
      axiosCaptcha(newReviewsUrl, config).then(response => {
        if (response.statusText === "OK") {
          this.setState({ reviewsList: response.data.data });
          IS_CONSOLE_LOG_OPEN &&
            console.log(
              "company reviews filter reviews by position  response.data data",
              response.data.data
            );
        }
      });
    }
  }

  generateInterviewDifficulty(value, max = 5) {
    let level = value == null ? 0 : value;
    const circles = [...Array(max + 1).keys()].map(
      no =>
        no != 0 && (
          <div key={no} className="circle-container">
            {no != 1 && <div className="dash"></div>}
            <div
              className="circle"
              style={no == level ? { backgroundColor: "black" } : {}}
            ></div>
          </div>
        )
    );
    return (
      <div className="difficulty-rating-container">
        <div className="first-label">Easy</div>
        {circles}
        <div className="last-label">Difficult</div>
      </div>
    );
  }

  mapReviews() {
    return this.state.reviewsList.map(
      review =>
        review.is_published === true && (
          <div key={review.id} className="review-container">
            <div className="review-header">
              <div className="reviewer-name">
                {review.anonymous === false ? review.username : "Anonymous"}
              </div>
              <div className="header-bottom">
                <div className="date">
                  {moment(review.update_date).format(DATE_AND_TIME_FORMAT)}
                </div>
                <div style={{ marginTop: "-16px" }}>
                  <Rate
                    tooltips={desc}
                    disabled
                    value={review.overall_company_experience}
                  />
                </div>
              </div>
            </div>
            {(review.cons ||
              review.pros ||
              review.emp_status ||
              review.interview_difficulty ||
              review.interview_notes ||
              review.overall_interview_experience ||
              review.source_type) && (
              <div className="review-body">
                <div className="review-body-company">
                  <div className="body-company-sub-container">
                    <div className="body-company-data">
                      {review.emp_status != null && (
                        <div className="employment-status">
                          <label>Employment type:</label>
                          <div className="info">{review.emp_status.value}</div>
                        </div>
                      )}
                      <div className="company-review-text-container">
                        {review.pros != null && review.pros != "" && (
                          <div>
                            <label>Pros:</label>
                            <div className="company-review-text">
                              {review.pros}
                            </div>
                          </div>
                        )}
                        {review.cons != null && review.cons != "" && (
                          <div>
                            <label>Cons:</label>
                            <div
                              className="company-review-text"
                              style={{ marginBottom: 8 }}
                            >
                              {review.cons}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="review-body-interview">
                  <div className="interview-ratings">
                    {(review.overall_interview_experience == 1 ||
                      review.overall_interview_experience == 0) && (
                      <div className="overall-experience-container">
                        <label>Interview overall:</label>
                        <div className="overall-experience">
                          {review.overall_interview_experience == 0 && (
                            <Icon
                              style={{ fontSize: 20, marginTop: "-5px" }}
                              type="like"
                              theme={"filled"}
                            />
                          )}
                          {review.overall_interview_experience == 1 && (
                            <Icon
                              type="dislike"
                              style={{
                                margin: "2px 0px 0px 5px",
                                fontSize: 20
                              }}
                              theme={"filled"}
                            />
                          )}
                        </div>
                      </div>
                    )}
                    {review.interview_difficulty && (
                      <div className="difficulty-container">
                        <label>Interview difficulty:</label>
                        {this.generateInterviewDifficulty(
                          review.interview_difficulty
                        )}
                      </div>
                    )}
                  </div>
                  {review.interview_notes != null &&
                    review.interview_notes != "" && (
                      <div className="interview-experience">
                        <label style={{ margin: "10px 4px 6px 0px" }}>
                          Interview experience:
                        </label>
                        <div className="interview-notes">
                          {review.interview_notes}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        )
    );
  }

  render() {
    IS_CONSOLE_LOG_OPEN && console.log(this.state.reviewsList);
    const menu = (
      <Menu
        style={{
          width: "300px",
          maxHeight: "260px",
          textAlign: "left",
          overflowX: "hidden"
        }}
        selectedKeys={[this.state.displaying]}
        onClick={event => this.handlePositionFilterChange(event)}
      >
        {this.props.positionsList.map(position => (
          <Menu.Item
            id="company-positions"
            key={position.job_title}
            value={position.id}
          >
            {position.job_title}
          </Menu.Item>
        ))}
        <Menu.Divider />
        <Menu.Item value="Reset">Reset</Menu.Item>
      </Menu>
    );

    return (
      <div className="reviews-big-container">
        {this.props.filterDisplay && (
          <div className="filter">
            <Dropdown overlay={menu} placement="bottomCenter">
              <Button>
                {this.state.displaying}
                <Icon type="down" />
              </Button>
            </Dropdown>
          </div>
        )}
        <div className="reviews-container">{this.mapReviews()}</div>
      </div>
    );
  }
}

export default Reviews;
