import React from "react";
import { Rate, Statistic, Icon } from "antd";

const desc = ["terrible", "bad", "normal", "good", "perfect"];

class CompanyRating extends React.Component {
  constructor(props) {
    super(props);
  }

  generateCompanyRatings() {
    const { rating } = this.props;
    return (
      <div>
        <Rate tooltips={desc} disabled value={rating} />
      </div>
    );
  }

  generateEmploymentAuthStats() {
    const { emp_auths } = this.props;
    if (emp_auths.length != 0) {
      return emp_auths.map(rating => (
        <div
          className="review-authorization-stat-container"
          key={rating.id}
          style={{ marginTop: "6px" }}
        >
          <div style={{ display: "flex", justifyContent: "left" }}>
            <label
              style={{
                marginRight: "20px",
                fontWeight: "450",
                marginTop: "6px"
              }}
            >
              {rating.employment_auth.value}
            </label>
            <div style={{ marginRight: "12px" }}>
              <Statistic
                title="Hire"
                value={rating.value == true ? 100 : 0}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                prefix={<Icon type="arrow-up" />}
                suffix="%"
              />
            </div>
            <div style={{ marginRight: "12px" }}>
              <Statistic
                title="Nope"
                value={rating.value == false ? 100 : 0}
                precision={2}
                valueStyle={{ color: "#cf1322" }}
                prefix={<Icon type="arrow-down" />}
                suffix="%"
              />
            </div>
          </div>
        </div>
      ));
    }
  }

  generateCompanyStatistics() {
    return (
      <div style={{ width: "240px", fontSize: "90%" }}>
        {this.generateCompanyRatings()}
        <div style={{ marginTop: "12px" }}>
          {this.generateEmploymentAuthStats()}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="review-statistics-container">
        {this.generateCompanyStatistics()}
      </div>
    );
  }
}

export default CompanyRating;
