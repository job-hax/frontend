import React, { PureComponent } from "react";

import Footer from "../Partials/Footer/Footer.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import { USERS } from "../../utils/constants/endpoints.js";
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
      user_type: this.props.cookie("get", "user_type")
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
    }
  }

  render() {
    const exclusiveName = this.state.user_type.college_specific_metrics_enabled
      ? USER_TYPE_NAMES[this.state.user_type.id]["header"] + " Job Metrics"
      : "";

    return (
      <div>
        <div style={{ margin: "0 0 0px 0", height: 400 }}>
          <Map
            defaultCenter={{ lat: 37.3729, lng: -121.856 }}
            positions={[
              { lat: 37.3729, lng: -121.856 },
              { lat: 37.4174343, lng: -122.0874049 },
              { lat: 37.4850753, lng: -122.1496129 },
              { lat: 37.3317042, lng: -122.0325086 }
            ]}
          />
        </div>
        <div className="metrics-big-group-container">
          <div>
            <div className="metric-big-group">
              <div className="university-metrics-header-container">
                <div className="header-line" />
                <div className="university-metrics-header">
                  Individual Metrics
                </div>
                <div className="header-line" />
              </div>
              <IndividualMetrics cookie={this.props.cookie} />
            </div>
            {exclusiveName !== "" && (
              <div className="metric-big-group">
                <div className="university-metrics-header-container">
                  <div className="header-line" />
                  <div className="university-metrics-header">
                    {exclusiveName}
                  </div>
                  <div className="header-line" />
                </div>
                <div>
                  <UniversityMetrics
                    cookie={this.props.cookie}
                    isPublic={false}
                  />
                </div>
              </div>
            )}
            <div className="metric-big-group">
              <div className="university-metrics-header-container">
                <div className="header-line" />
                <div className="university-metrics-header">
                  Jobhax Aggregated Metrics
                </div>
                <div className="header-line" />
              </div>
              <div>
                <UniversityMetrics cookie={this.props.cookie} isPublic={true} />
              </div>
            </div>
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
