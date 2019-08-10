import React from "react";
import { Rate, Statistic, Icon } from "antd";

import "../../../assets/libraryScss/antd-scss/newantd.scss";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants";

class CompanyStats extends React.Component {
  constructor(props) {
    super(props);
  }

  generateCompanyRatings() {
    const { company } = this.props;
    let ratingTotal = 0;
    let countTotal = 0;
    let details = [];
    company.ratings.forEach(
      rating => (
        (ratingTotal += Number(rating.id) * Number(rating.count)),
        (countTotal += Number(rating.count)),
        details.push(
          rating.count.toString() + " user voted " + rating.id.toString()
        )
      )
    );
    const averageRating =
      ratingTotal == 0 ? 0 : Math.round(ratingTotal / countTotal);
    IS_CONSOLE_LOG_OPEN && console.log("average rating", averageRating);
    return (
      <div>
        <Rate tooltips={details} disabled value={averageRating} />
      </div>
    );
  }

  generateEmploymentAuthStats() {
    const { company } = this.props;
    return company.supported_employment_auths.map(stat => (
      <div
        className="authorization-stat-container"
        key={stat.id}
        style={{ marginTop: "6px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: 188
          }}
        >
          <label style={{ fontWeight: "450", marginTop: "6px" }}>
            {stat.value}
          </label>
          <div style={{ display: "flex", justifyContent: "left" }}>
            <div style={{ marginRight: "12px" }}>
              <Statistic
                title="Hire"
                value={
                  stat.yes == 0 ? 0 : (stat.yes / (stat.yes + stat.no)) * 100
                }
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                prefix={<Icon type="arrow-up" />}
                suffix="%"
              />
            </div>
            <div style={{ marginRight: "12px" }}>
              <Statistic
                title="Nope"
                value={
                  stat.no == 0 ? 0 : (stat.no / (stat.yes + stat.no)) * 100
                }
                precision={2}
                valueStyle={{ color: "#cf1322" }}
                prefix={<Icon type="arrow-down" />}
                suffix="%"
              />
            </div>
          </div>
        </div>
      </div>
    ));
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
      <div className="statistics-container">
        {this.generateCompanyStatistics()}
      </div>
    );
  }
}

export default CompanyStats;
