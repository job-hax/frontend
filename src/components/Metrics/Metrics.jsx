import React, { PureComponent } from "react";

import Footer from "../Partials/Footer/Footer.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import { USERS, METRICS } from "../../utils/constants/endpoints.js";
import {
  IS_CONSOLE_LOG_OPEN,
  USER_TYPES,
  USER_TYPE_NAMES
} from "../../utils/constants/constants.js";
import Map from "./SubComponents/Map/Map.jsx";
import IndividualMetrics from "./SubComponents/IndividualMetrics/IndividualMetrics.jsx";
import UniversityMetrics from "./SubComponents/UniversityMetrics/UniversityMetrics.jsx";

import "./style.scss";

class Metrics extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      user_type: this.props.cookie("get", "user_type"),
      locations: []
    };

    this.metricMap = {
      public: [
        { header: "Jobhax Aggregated Metrics", public: true, student: null }
      ],
      student: [
        //{ header: "Student Aggregated Metrics", public: false, student: null },
        { header: "Jobhax Aggregated Metrics", public: true, student: null }
      ],
      alumni: [
        //{ header: "Alumni Aggregated Metrics", public: false, student: null },
        { header: "Jobhax Aggregated Metrics", public: true, student: null }
      ],
      career_services: [
        { header: "Alumni Aggregated Metrics", public: false, student: false },
        { header: "Student Aggregated Metrics", public: false, student: true },
        { header: "University Aggregated Metrics", public: true, student: null }
      ]
    };
  }

  async componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      await this.props.handleTokenExpiration("metrics componentDidMount");
      let config = { method: "POST" };
      axiosCaptcha(USERS("verifyRecaptcha"), config, "metrics").then(
        response => {
          if (response.statusText === "OK") {
            if (response.data.success != true) {
              this.setState({ isUpdating: false });
              IS_CONSOLE_LOG_OPEN &&
                console.log(response, response.data.error_message);
              this.props.alert(
                5000,
                "error",
                "Error: " + response.data.error_message
              );
            }
          }
        }
      );
      axiosCaptcha(METRICS("companyLocations/"), {
        method: "GET"
      }).then(response => {
        if (response.statusText === "OK") {
          if (response.data.success) {
            this.setState({ locations: response.data.data });
          }
        }
      });
    }
  }

  render() {
    const user_type = type =>
      this.state.user_type.id === USER_TYPES[type] ? true : false;
    const individualMetrics = (
      <div className="metric-big-group">
        <div className="university-metrics-header-container">
          <div className="header-line" />
          <div className="university-metrics-header">Individual Metrics</div>
          <div className="header-line" />
        </div>
        <IndividualMetrics cookie={this.props.cookie} />
      </div>
    );

    const universityMetrics = (header, isPublic, isStudent) => (
      <div className="metric-big-group">
        <div className="university-metrics-header-container">
          <div className="header-line" />
          <div className="university-metrics-header">{header}</div>
          <div className="header-line" />
        </div>
        <UniversityMetrics
          cookie={this.props.cookie}
          isPublic={isPublic}
          isStudent={isStudent}
        />
      </div>
    );

    const aggregatedMetrics = this.metricMap[
      USER_TYPE_NAMES[this.state.user_type.id].type
    ].map(metric => {
      return universityMetrics(metric.header, metric.public, metric.student);
    });

    return (
      <div>
        <div style={{ margin: "0 0 0px 0", height: 400 }}>
          <Map
            defaultCenter={{ lat: 37.5237183, lng: -122.3423894 }}
            positions={this.state.locations}
          />
        </div>
        <div className="metrics-big-group-container">
          <div>
            {!user_type("career_services") && individualMetrics}
            {aggregatedMetrics}
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Metrics;
