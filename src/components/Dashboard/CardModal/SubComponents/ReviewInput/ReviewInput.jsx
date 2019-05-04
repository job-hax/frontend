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
      sourceTypes: [],
      employmentStatuses: [],
      employmentAuths: [],
      submitResponseCompany: {},
      submitResponseReview: {},
      emp_status: { id: -1, value: "Select" },
      source_type: { id: -1, value: "Select" },
      pros: "",
      cons: "",
      interview_notes: "",
      overall_company_experience: null,
      interview_difficulty: null,
      overall_interview_experience: null,
      anonymous: false,
      emp_auths: [
        {
          id: 36,
          value: "Select",
          employment_auth: {
            id: 1,
            value: "CPT"
          }
        },
        {
          id: 37,
          value: "Select",
          employment_auth: {
            id: 2,
            value: "OPT"
          }
        },
        {
          id: 38,
          value: "Select",
          employment_auth: {
            id: 3,
            value: "H1B"
          }
        }
      ]
    };

    this.body = {
      company_id: this.props.card.companyObject.id,
      position_id: this.props.card.position.id,
      anonymous: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmploymentAuthChange = this.handleEmploymentAuthChange.bind(
      this
    );
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCompanyRateChange = this.handleCompanyRateChange.bind(this);
    this.handleInterviewDifficultyChange = this.handleInterviewDifficultyChange.bind(
      this
    );
  }

  componentDidMount() {
    console.log("oldReview is", this.props.oldReview);
    if (this.props.oldReview.id != -1) {
      this.body["review_id"] = this.props.oldReview.id;
      if (this.props.oldReview.emp_auths != null) {
        let temporaryAuths = this.state.emp_auths;
        this.props.oldReview.emp_auths.forEach(
          auth =>
            (temporaryAuths.filter(
              preSetAuth =>
                preSetAuth.employment_auth.id == auth.employment_auth.id
            )[0].value = auth.value)
        );
        this.setState({ emp_auths: temporaryAuths });
      }
      if (this.props.oldReview.emp_status != null) {
        this.setState({ emp_status: this.props.oldReview.emp_status });
      }
      if (this.props.oldReview.source_type != null) {
        this.setState({ source_type: this.props.oldReview.source_type });
      }
      if (this.props.oldReview.pros != null) {
        this.setState({ pros: this.props.oldReview.pros });
      }
      if (this.props.oldReview.cons != null) {
        this.setState({ cons: this.props.oldReview.cons });
      }
      if (this.props.oldReview.interview_notes != null) {
        this.setState({
          interview_notes: this.props.oldReview.interview_notes
        });
      }
      if (this.props.oldReview.overall_company_experience != null) {
        this.setState({
          overall_company_experience: this.props.oldReview
            .overall_company_experience
        });
      }
      if (this.props.oldReview.interview_difficulty != null) {
        this.setState({
          interview_difficulty: this.props.oldReview.interview_difficulty
        });
      }
      if (this.props.oldReview.overall_interview_experience != null) {
        this.setState({
          overall_interview_experience: this.props.oldReview
            .overall_interview_experience
        });
      }
      if (this.props.oldReview.anonymous != null) {
        this.setState({ anonymous: this.props.oldReview.anonymous });
      }
    }
    getSourceTypesRequest.config.headers.Authorization = this.props.token;
    fetchApi(getSourceTypesRequest.url, getSourceTypesRequest.config).then(
      response => {
        if (response.ok) {
          if (response.json.success === true) {
            console.log("getSourceTypesRequest response", response.json.data);
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
          console.log(
            "getEmploymentStatusesRequest response",
            response.json.data
          );
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
          console.log("getEmploymentAuthsRequest response", response.json.data);
          this.setState({ employmentAuths: response.json.data });
        }
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.toggleReview();
    reviewSubmitRequest.config.headers.Authorization = this.props.token;
    reviewSubmitRequest.config.body = JSON.stringify(this.body);
    console.log(
      "reviewSubmitRequest.config.body",
      reviewSubmitRequest.config.body
    );
    fetchApi(reviewSubmitRequest.url, reviewSubmitRequest.config).then(
      response => {
        if (response.ok) {
          if (response.json.success === true) {
            console.log("reviewSubmitRequest response", response.json.data);
            this.props.setCompany(response.json.data.company);
            this.props.setReview(response.json.data.review);
          } else {
            this.setState({ isUpdating: false });
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
            "Something went wrong! \n Error: \n Code \n " + response.status
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
    let temporaryAuths = this.state.emp_auths;
    temporaryAuths.filter(
      oldAuth => oldAuth.employment_auth.id == id
    )[0].value = value;
    console.log(
      "filter:  ",
      temporaryAuths.filter(oldAuth => oldAuth.employment_auth.id == id)[0]
        .value
    );
    this.setState({ emp_auths: temporaryAuths });
  }

  handleInputChange(event) {
    const newValue = event.target.value;
    const name = event.target.name;
    if (event.target.type === "checkbox") {
      console.log(event.target.checked);
      this.setState({ anonymous: event.target.checked });
      this.body["anonymous"] = event.target.checked;
    } else if (event.target.type === "dropdown") {
      const object = { id: event.target.id, value: event.target.textContent };
      const optionName = event.target.title;
      this.body[optionName + "_id"] = event.target.id;
      this.setState({
        [optionName]: object
      });
    } else {
      this.body[name] = newValue;
      this.setState({ [name]: newValue });
    }
  }

  handleCompanyRateChange(value) {
    this.body["overall_company_experience"] = value;
    this.setState({ overall_company_experience: value });
  }

  handleInterviewDifficultyChange(value) {
    this.body["interview_difficulty"] = value;
    this.setState({ interview_difficulty: value });
  }

  generateCompanyReviewsPart() {
    console.log("All states:\n", this.state);
    const companyRatingStyle = { width: "200px" };
    return (
      <div>
        <div className="review-header">Company</div>
        <div style={companyRatingStyle}>
          <div className="label">Overall</div>
          <Rate
            tooltips={desc}
            name="overall_company_experience"
            value={
              this.state.overall_company_experience &&
              this.state.overall_company_experience
            }
            onChange={this.handleCompanyRateChange}
          />
        </div>
        <div>
          <div className="label">Pros:</div>
          <textarea
            id="pros-input"
            name="pros"
            type="text"
            className="text-box"
            placeholder="+add pros"
            value={this.state.pros}
            onChange={this.handleInputChange}
          />
        </div>

        <div>
          <div className="label">Cons:</div>
          <textarea
            id="cons-input"
            name="cons"
            type="text"
            className="text-box"
            placeholder="+add cons"
            value={this.state.cons}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="employment-status">
          <div className="label">Employment Status</div>
          <Select
            name="emp_status"
            value={this.state.emp_status.value}
            onChange={() => this.handleInputChange(event)}
            style={{ width: 200, position: "relative" }}
          >
            {this.state.employmentStatuses.map(status => (
              <Option
                id={status.id}
                type="dropdown"
                title="emp_status"
                key={status.id}
                value={status.value}
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
                value={
                  this.state.emp_auths.filter(
                    savedAuth => savedAuth.employment_auth.id == auth.id
                  )[0].value
                }
                type="dropdown"
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
          <RadioGroup
            name="overall_interview_experience"
            value={
              this.state.overall_interview_experience != null &&
              this.state.overall_interview_experience.toString()
            }
            onChange={this.handleInputChange}
          >
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
            name="interview_difficulty"
            value={
              this.state.interview_difficulty && this.state.interview_difficulty
            }
            onChange={this.handleInterviewDifficultyChange}
            tooltips={descDifficulty}
          />
        </div>
        <div>
          <div className="label">How did you get into interview?</div>
          <Select
            name="source_type"
            value={this.state.source_type.value}
            onChange={() => this.handleInputChange(event)}
            style={{ width: 200, position: "relative" }}
          >
            {this.state.sourceTypes.map(source => (
              <Option
                id={source.id}
                title="source_type"
                type="dropdown"
                key={source.id}
                value={source.value}
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
            name="interview_notes"
            type="text"
            className="text-box interview-experience"
            placeholder="+tell about your interview experience"
            value={this.state.interview_notes}
            onChange={this.handleInputChange}
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
                name="intervianonymousew_notes"
                checked={this.state.anonymous}
                type="checkbox"
                onChange={this.handleInputChange}
                style={{ marginLeft: "80px", marginTop: "20px" }}
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
