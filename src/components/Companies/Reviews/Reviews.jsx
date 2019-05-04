import React from "react";
import { Rate, Radio, Select } from "antd";

import CompanyRating from "./CompanyRating/CompanyRating.jsx";
import { makeTimeBeautiful } from "../../../utils/constants/constants.js";
import { fetchApi } from "../../../utils/api/fetch_api";
import { getReviewsRequest } from "../../../utils/api/requests.js";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";

import "./style.scss";
import "../../../assets/libraryScss/antd-scss/antd.scss";

const descDifficulty = ["too easy", "easy", "normal", "hard", "too hard"];
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class Reviews extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reviewsList: []
    };

    this.handlePositionFilterChange = this.handlePositionFilterChange.bind(
      this
    );
  }

  componentDidMount() {
    this.setState({ reviewsList: this.props.reviewsList });
  }

  handlePositionFilterChange(value) {
    let newReviewsUrl =
      getReviewsRequest.url +
      "?company_id=" +
      this.props.company_id +
      "&position_id=" +
      value +
      "&all_reviews=true";
    getReviewsRequest.config.headers.Authorization = this.props.token;
    fetchApi(newReviewsUrl, getReviewsRequest.config).then(response => {
      if (response.ok) {
        this.setState({ reviewsList: response.json.data });
        IS_CONSOLE_LOG_OPEN &&
          console.log(
            "company reviews filter reviews by position  response json data",
            response.json.data
          );
      }
    });
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
                      {review.pros != "" && (
                        <div>
                          <label>Pros:</label>
                          <div className="company-review-text">
                            {review.pros}
                          </div>
                        </div>
                      )}
                      {review.cons != "" && (
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
                {review.interview_notes != "" && (
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
    console.log(this.state.reviewsList);
    return (
      <div>
        {this.props.filterDisplay && (
          <div className="filter">
            <label>Filter:</label>
            <Select
              defaultValue="All Positions"
              style={{ width: 200, position: "relative" }}
              onChange={this.handlePositionFilterChange}
            >
              {this.props.positionsList.map(position => (
                <Select.Option
                  id="company-positions"
                  key={position.id}
                  value={position.id}
                >
                  {position.job_title}
                </Select.Option>
              ))}
            </Select>
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
