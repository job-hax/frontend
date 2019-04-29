import React from "react";
import { Rate, Select, Radio, Checkbox } from "antd";

import { fetchApi } from "../../../../../utils/api/fetch_api.js";
import {
  reviewSubmitRequest,
  getSourceTypesRequest,
  getEmploymentStatusesRequest,
  getEmploymentAuthsRequest
} from "../../../../../utils/api/requests.js";

import "./style.scss";
import "../../../../../assets/libraryScss/antd-scss/antd.scss";

const desc = ["terrible", "bad", "normal", "good", "perfect"];
const descDifficulty = ["too easy", "easy", "normal", "hard", "too hard"];
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class ReviewInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      companyRateValue: null,
      interviewRateValue: null,
      sourceTypes: [],
      employmentStatuses: [],
      employmentAuths: [],
      submitResponseCompany: {},
      submitResponseReview: {}
    };

    this.body = {
      company_id: this.props.card.companyObject.id,
      position_id: this.props.card.position.id,
      anonymous: false
    };

    this.handleCompanyRatingChange = this.handleCompanyRatingChange.bind(this);
    this.handleInterviewRatingChange = this.handleInterviewRatingChange.bind(
      this
    );
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmploymentAuthChange = this.handleEmploymentAuthChange.bind(
      this
    );
    this.handleCompanyRatingChange = this.handleCompanyRatingChange.bind(this);
    this.handleInterviewSourceChange = this.handleInterviewSourceChange.bind(
      this
    );
    this.handleInterviewRatingChange = this.handleInterviewRatingChange.bind(
      this
    );
    this.handleEmploymentStatusChange = this.handleEmploymentStatusChange.bind(
      this
    );
    this.handlePublicityChange = this.handlePublicityChange.bind(this);
    this.handleOverallInterviewExperienceChange = this.handleOverallInterviewExperienceChange.bind(
      this
    );
  }

  componentDidMount() {
    getSourceTypesRequest.config.headers.Authorization = this.props.token;
    fetchApi(getSourceTypesRequest.url, getSourceTypesRequest.config).then(
      response => {
        if (response.ok) {
          if (response.json.success === true) {
            console.log(response.json.data);
            this.setState({ sourceTypes: response.json.data });
          }
        }
      }
    );
    getEmploymentStatusesRequest.config.headers.Authorization = this.props.token;
    fetchApi(
      getEmploymentStatusesRequest.url,
      getEmploymentStatusesRequest.config
    ).then(response => {
      if (response.ok) {
        if (response.json.success === true) {
          console.log(response.json.data);
          this.setState({ employmentStatuses: response.json.data });
        }
      }
    });
    getEmploymentAuthsRequest.config.headers.Authorization = this.props.token;
    fetchApi(
      getEmploymentAuthsRequest.url,
      getEmploymentAuthsRequest.config
    ).then(response => {
      if (response.ok) {
        if (response.json.success === true) {
          console.log(response.json.data);
          this.setState({ employmentAuths: response.json.data });
        }
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.toggleReview();
    console.log(event.target);
    if (event.target[0].value.trim() != "") {
      this.body["pros"] = event.target[0].value.trim();
    }
    if (event.target[1].value.trim() != "") {
      this.body["cons"] = event.target[1].value.trim();
    }
    if (event.target[4].value.trim() != "") {
      this.body["interview_notes"] = event.target[4].value.trim();
    }
    reviewSubmitRequest.config.headers.Authorization = this.props.token;
    reviewSubmitRequest.config.body = JSON.stringify(this.body);
    console.log(reviewSubmitRequest.config.body);
    fetchApi(reviewSubmitRequest.url, reviewSubmitRequest.config).then(
      response => {
        if (response.ok) {
          if (response.json.success === true) {
            console.log(response.json.data);
            this.props.setCompany(response.json.data.company);
          } else {
            this.setState({ isUpdating: false });
            console.log(response, response.json.error_message);
            alert(
              "Error: \n Code " +
                response.json.error_code +
                "\n" +
                response.json.error_message
            );
          }
        } else {
          this.setState({ isUpdating: false });
          alert(
            "Something went wrong! \n Error: \n Code \n " + response.json.status
          );
        }
      }
    );
    this.body = {
      job_app_id: this.props.card.id,
      company_id: this.props.card.companyObject.id,
      position_id: this.props.card.position.id
    };
  }

  handleCompanyRatingChange(value) {
    this.setState({ companyRateValue: value });
    this.body["overall_company_experience"] = value;
  }

  handleInterviewRatingChange(value) {
    this.setState({ interviewRateValue: value });
    this.body["interview_difficulty"] = value;
  }

  handleOverallInterviewExperienceChange(event) {
    this.body["overall_interview_experience"] = Number(event.target.value);
  }

  handleEmploymentStatusChange(value) {
    this.body["emp_status_id"] = Number(value);
  }

  handleEmploymentAuthChange(value, id) {
    let object = { id: Number(id), value: value };
    if (!this.body.emp_auths) {
      this.body["emp_auths"] = [];
      this.body["emp_auths"].push(object);
    } else {
      let temporaryList = [];
      let i = 0;
      for (i == 0; i < this.body.emp_auths.length; i++) {
        if (Number(this.body.emp_auths[i].id) != Number(id)) {
          temporaryList.push(this.body.emp_auths[i]);
        }
      }
      temporaryList.push(object);
      this.body["emp_auths"] = temporaryList;
    }
  }

  handleInterviewSourceChange(value) {
    this.body["source_type_id"] = Number(value);
  }

  handlePublicityChange(event) {
    this.body["anonymous"] = event.target.checked;
  }

  generateCompanyReviewsPart() {
    const companyRatingStyle = { width: "200px" };
    console.log("response in state", this.state.submitResponseReview);
    return (
      <div>
        <div className="review-header">Company</div>
        <div style={companyRatingStyle}>
          <div className="label">Overall</div>
          <Rate
            tooltips={desc}
            onChange={value => this.handleCompanyRatingChange(value)}
            defaultValue={
              this.state.submitResponseReview.overall_company_experience
            }
            value={this.state.companyRateValue}
          />
          {this.state.companyRateValue ? (
            <span className="ant-rate-text">
              {desc[this.state.companyRateValue - 1]}
            </span>
          ) : (
            ""
          )}
        </div>
        <div>
          <div className="label">Pros:</div>
          <textarea
            id="pros-input"
            className="text-box"
            placeholder="+add pros"
          />
        </div>

        <div>
          <div className="label">Cons:</div>
          <textarea
            id="cons-input"
            className="text-box"
            placeholder="+add cons"
          />
        </div>
        <div className="employment-status">
          <div className="label">Employment Status</div>
          <Select
            defaultValue="Select"
            style={{ width: 200, position: "relative" }}
            onChange={this.handleEmploymentStatusChange}
          >
            {this.state.employmentStatuses.map(status => (
              <Option
                id="employment-status-option-parttime"
                key={status.id}
                value={status.id}
              >
                {status.value}
              </Option>
            ))}
          </Select>
        </div>
        <div className="employment-authorization">
          <div className="label">Employment Authorization</div>
          {this.state.employmentAuths.map(auth => (
            <div key={auth.id} className="employment-authorization-item">
              <label className="label">{auth.value}</label>
              <Select
                defaultValue="Select"
                style={{ width: 150, position: "relative" }}
                onChange={value =>
                  this.handleEmploymentAuthChange(value, auth.id)
                }
              >
                <Option id="employment-auth-cpt-yes" value={true}>
                  Supported
                </Option>
                <Option id="employment-auth-cpt-no" value={false}>
                  Not Supported
                </Option>
              </Select>
            </div>
          ))}
        </div>
      </div>
    );
  }

  generateInterviewReviewsPart() {
    const interviewRatingStyle = { width: "200px" };
    return (
      <div>
        <div className="review-header">Interview</div>
        <div className="overall-interview-experience">
          <div className="label">Overall</div>
          <RadioGroup onChange={this.handleOverallInterviewExperienceChange}>
            <RadioButton id="overall-interview-experience-good" value="0">
              Good
            </RadioButton>
            <RadioButton id="overall-interview-experience-bad" value="1">
              Bad
            </RadioButton>
          </RadioGroup>
        </div>
        <div style={interviewRatingStyle} className="question">
          <div className="label">Difficulty</div>
          <Rate
            tooltips={descDifficulty}
            onChange={value => this.handleInterviewRatingChange(value)}
            value={this.state.interviewRateValue}
          />
          {this.state.interviewRateValue ? (
            <span className="ant-rate-text">
              {desc[this.state.interviewRateValue - 1]}
            </span>
          ) : (
            ""
          )}
        </div>
        <div>
          <div className="label">How did you get into interview?</div>
          <Select
            defaultValue="Select"
            style={{ width: 200, position: "relative" }}
            onChange={this.handleInterviewSourceChange}
          >
            {this.state.sourceTypes.map(source => (
              <Option
                id="interview-source-online"
                key={source.id}
                value={source.id}
              >
                {source.value}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <div className="label">Interview experience:</div>
          <textarea
            id="interview-experience-text"
            className="text-box interview-experience"
            placeholder="+tell about your interview experience"
          />
        </div>
      </div>
    );
  }

  generateReviewForm() {
    return (
      <div className="review-form-container">
        <form onSubmit={this.handleSubmit}>
          <div className="review-form">
            <div className="company-reviews">
              {this.generateCompanyReviewsPart()}
            </div>
            <div className="interview-reviews">
              {this.generateInterviewReviewsPart()}
              <Checkbox
                style={{ marginLeft: "80px", marginTop: "20px" }}
                onChange={this.handlePublicityChange}
              >
                Anonymous
              </Checkbox>
              <div className="review-button-container">
                <button
                  className="review-button"
                  onClick={this.props.toggleReview}
                >
                  Cancel
                </button>
                <button className="review-button" type="submit">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  render() {
    return <div>{this.generateReviewForm()}</div>;
  }
}

export default ReviewInput;
