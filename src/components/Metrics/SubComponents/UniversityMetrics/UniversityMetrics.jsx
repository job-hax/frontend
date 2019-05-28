import React from "react";

import DetailedMetricsGroup from "../Containers/DetailedGroupContainer.jsx";
import SummaryMetricsGroup from "../Containers/SummaryGroupContainer.jsx";
import { axiosCaptcha } from "../../../../utils/api/fetch_api.js";
import { getMetrics } from "../../../../utils/api/requests.js";
import Spinner from "../../../Partials/Spinner/Spinner.jsx";

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
      axiosCaptcha(getMetrics.url("personal/generic"), getMetrics.config).then(
        response => {
          if (response.statusText === "OK") {
            this.data = response.data.data;
            this.setState({
              genericData: this.data
            });
          }
        }
      );
      axiosCaptcha(getMetrics.url("personal/detailed"), getMetrics.config).then(
        response => {
          if (response.statusText === "OK") {
            this.data = response.data.data;
            this.setState({
              detailedData: this.data,
              isInitialRequest: false
            });
          }
        }
      );
    }
  }

  generateDetailedMetricsGroup() {
    return (
      <div>
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
    if (this.state.isInitialRequest === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    if (this.state.isInitialRequest === true)
      return <Spinner message="Preparing your metrics..." />;
    return <div>{this.generateDetailedMetricsGroup()}</div>;
  }
}

export default UniversityMetrics;
