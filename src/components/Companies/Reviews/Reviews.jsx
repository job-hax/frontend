import React from "react";
import { Rate, Radio, Select, Menu, Dropdown, Button, Icon } from "antd";

import CompanyRating from "./CompanyRating/CompanyRating.jsx";
import { makeTimeBeautiful } from "../../../utils/constants/constants.js";
import { axiosCaptcha } from "../../../utils/api/fetch_api";
import { getReviewsRequest } from "../../../utils/api/requests.js";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";

import "./style.scss";
import "../../../assets/libraryScss/antd-scss/newantd.scss";

const descDifficulty = ["too easy", "easy", "normal", "hard", "too hard"];
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class Reviews extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reviewsList: [],
      displaying: "All Positions"
    };

    this.handlePositionFilterChange = this.handlePositionFilterChange.bind(
      this
    );
  }

  componentDidMount() {
    this.setState({ reviewsList: this.props.reviewsList });
  }

  async handlePositionFilterChange(event) {
    console.log(event);
    let value = event.item.props.children;
    let id = event.key;
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
      let newReviewsUrl =
        getReviewsRequest.url +
        "?company_id=" +
        this.props.company_id +
        "&position_id=" +
        id +
        "&all_reviews=true";
      axiosCaptcha(newReviewsUrl, getReviewsRequest.config).then(response => {
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

  mapReviews() {
    return this.state.reviewsList.map(
      review =>
        review.is_published === true && (
          <div
            key={review.id}
            className="review-container"
            style={this.props.reviewContainerStyle}
          >
            <div className="review-header">
              <div className="reviewer-name">
                {review.anonymous === false ? review.username : "Anonymous"}
              </div>
              <div className="date">
                last updated on{" "}
                {makeTimeBeautiful(review.update_date, "dateandtime")}
              </div>
            </div>
            <div className="review-body">
              <div className="review-body-company">
                <div className="body-company-title">Company</div>
                <div className="body-company-sub-container">
                  <div
                    className="body-company-data"
                    style={this.props.leftWidth}
                  >
                    <div className="employment-status">
                      <label>Employment Type:</label>
                      {review.emp_status === null ? (
                        <div className="not-specified">"Not specified"</div>
                      ) : (
                        <div className="info">{review.emp_status.value}</div>
                      )}
                    </div>
                    <div className="company-review-text-container">
                      {review.pros != null &&
                        review.pros != "" &&
                        (
                            <div>
                              <label>Pros:</label>
                              <div className="company-review-text">
                                {review.pros}
                              </div>
                            </div>
                          )}
                      {review.cons != null &&
                        review.cons != "" &&
                        (
                            <div>
                              <label>Cons:</label>
                              <div className="company-review-text">
                                {review.cons}
                              </div>
                            </div>
                          )}
                    </div>
                  </div>
                  <div className="body-company-ratings">
                    <label>Overall:</label>
                    <CompanyRating
                      emp_auths={review.emp_auths}
                      rating={review.overall_company_experience}
                    />
                  </div>
                </div>
              </div>
              <div className="review-body-interview">
                <div className="body-interview-title">Interview</div>
                <div className="interview-ratings">
                  <div
                    className="overall-experience-container"
                    style={this.props.leftWidth}
                  >
                    <label>Overall:</label>
                    <div className="overall-experience">
                      <RadioGroup
                        name="overall_interview_experience"
                        value={
                          review.overall_interview_experience != null &&
                          review.overall_interview_experience.toString()
                        }
                        onChange={this.handleInputChange}
                        //style={{marginTop:"-8px"}}
                      >
                        <RadioButton
                          id="overall-interview-experience-good"
                          value="0"
                        >
                          Good
                        </RadioButton>
                        <RadioButton
                          id="overall-interview-experience-bad"
                          value="1"
                        >
                          Bad
                        </RadioButton>
                      </RadioGroup>
                    </div>
                  </div>
                  <div className="difficulty-container">
                    <label style={{ margin: "10px 8px 6px 4px" }}>
                      Difficulty:
                    </label>
                    <Rate
                      tooltips={descDifficulty}
                      disabled
                      value={review.interview_difficulty}
                    />
                  </div>
                </div>
                {review.interview_notes != null &&
                  review.interview_notes !="" && 
                  (
                      <div className="interview-experience">
                        <label style={{ margin: "10px 4px 6px 0px" }}>
                          Interview Experience:
                        </label>
                        <div className="interview-notes">
                          {review.interview_notes}
                        </div>
                      </div>
                    )}
              </div>
            </div>
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
        onClick={event => this.handlePositionFilterChange(event)}
      >
        {this.props.positionsList.map(position => (
          <Menu.Item
            id="company-positions"
            key={position.id}
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
      <div>
        {this.props.filterDisplay && (
          <div className="filter">
            <label>Filter:</label>
            <Dropdown overlay={menu} placement="bottomCenter">
              <Button
                className="ant-dropdown-link"
                style={{
                  color: "rgba(100, 100, 100, 0.9)",
                  width: 200,
                  overflow: "hidden"
                }}
              >
                {this.state.displaying}
                <Icon type="down" />
              </Button>
            </Dropdown>
          </div>
        )}
        <div style={this.props.style} className="reviews-container">
          {this.mapReviews()}
        </div>
      </div>
    );
  }
}

export default Reviews;
