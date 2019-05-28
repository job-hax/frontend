import React from "react";

import DetailedMetricsGroup from "../Containers/DetailedGroupContainer.jsx";
import SummaryMetricsGroup from "../Containers/SummaryGroupContainer.jsx";
import { axiosCaptcha } from "../../../../utils/api/fetch_api.js";
import { getMetrics } from "../../../../utils/api/requests.js";

class UniversityMetrics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      genericData: [],
      detailedData: [],
      isInitialRequest: "beforeRequest"
    };
  }

  componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      this.getData();
    }
  }

  getData() {
    if (
      this.props.cookie("get", "jobhax_access_token") != ("" || null) &&
      this.state.isInitialRequest === "beforeRequest"
    ) {
      this.setState({ isInitialRequest: true });
      axiosCaptcha(
        getMetrics.url("aggregated/generic"),
        getMetrics.config
      ).then(response => {
        if (response.statusText === "OK") {
          this.data = response.data.data;
          this.setState({
            genericData: this.data
          });
        }
      });
      axiosCaptcha(
        getMetrics.url("aggregated/detailed"),
        getMetrics.config
      ).then(response => {
        if (response.statusText === "OK") {
          this.data = response.data.data;
          this.setState({
            detailedData: this.data,
            isInitialRequest: false
          });
        }
      });
    }
  }

  generateDetailedMetricsGroup() {
    return (
      <div style={{ marginBottom: 80 }}>
        <div>
          <SummaryMetricsGroup
            cookie={this.props.cookie}
            data={this.state.genericData}
          />
        </div>
        <div>
          <DetailedMetricsGroup
            cookie={this.props.cookie}
            data={this.state.detailedData}
          />
        </div>
      </div>
    );
  }

  render() {
    return <div>{this.generateDetailedMetricsGroup()}</div>;
  }
}

export default UniversityMetrics;
