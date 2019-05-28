import React, { PureComponent } from "react";

import Footer from "../Partials/Footer/Footer.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import { postUsersRequest } from "../../utils/api/requests.js";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";
import Map from "./SubComponents/Map/Map.jsx";
import IndividualMetrics from "./SubComponents/IndividualMetrics/IndividualMetrics.jsx";
import UniversityMetrics from "./SubComponents/UniversityMetrics/UniversityMetrics.jsx";

import "./style.scss";

class Metrics extends PureComponent {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      await this.props.handleTokenExpiration("metrics getData");
      axiosCaptcha(
        postUsersRequest.url("verify_recaptcha"),
        postUsersRequest.config,
        "metrics"
      ).then(response => {
        if (response.statusText === "OK") {
          if (response.data.success != true) {
            this.setState({ isUpdating: false });
            console.log(response, response.data.error_message);
            this.props.alert(
              5000,
              "error",
              "Error: " + response.data.error_message
            );
          }
        }
      });
    }
  }

  render() {
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
        <div className="metric-big-group">
          <IndividualMetrics cookie={this.props.cookie} />
        </div>
        <div>
          <div className="university-metrics-header-container">
            <div className="header-line" />
            <div className="university-metrics-header">
              University Job Metrics
            </div>
            <div className="header-line" />
          </div>
          <div className="metric-big-group">
            <UniversityMetrics cookie={this.props.cookie} />
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
