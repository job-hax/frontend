import React, { PureComponent } from "react";

import Spinner from "../Partials/Spinner/Spinner.jsx";
import Footer from "../Partials/Footer/Footer.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import {
  getTotalAppsCountRequest,
  getAppsCountByMonthRequest,
  getAppsCountByMonthWithTotalRequest,
  getCountByJobtitleAndStatusesRequest,
  getCountByStatusesRequest,
  getWordCountRequest,
  postUsersRequest
} from "../../utils/api/requests.js";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";
import Map from "./SubComponents/Map/Map.jsx";
import IndividualMetrics from "./SubComponents/IndividualMetrics/IndividualMetrics.jsx";

import "./style.scss";

class Metrics extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      totalAppsCountRequest: [],
      appsCountByMonthRequest: [],
      appsMonthSources: [],
      appsCountByMonthWithTotalRequest: [],
      appsMonthSourcesWithTotal: [],
      countByJobtitleAndStatusesRequest: [],
      countByStatusesRequest: [],
      wordCountRequest: [],
      currentMonthsOfLastYear: [],
      isInitialRequest: "beforeRequest",
      isMonthlyLine: false
    };

    this.totalAppsCountRequest = [];
    this.appsCountByMonthRequest = [];
    this.appsMonthSources = [];
    this.appsCountByMonthWithTotalRequest = [];
    this.appsMonthSourcesWithTotal = [];
    this.countByJobtitleAndStatusesRequest = [];
    this.countByStatusesRequest = [];
    this.wordCountRequest = [];
    this.currentMonthsOfLastYear = [];
    this.listData = [];
  }

  async componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      await this.getData();
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

  componentDidUpdate() {
    this.getData();
  }

  async getData() {
    if (
      this.props.cookie("get", "jobhax_access_token") != ("" || null) &&
      this.state.isInitialRequest === "beforeRequest"
    ) {
      this.setState({ isInitialRequest: true });
      await this.props.handleTokenExpiration("metrics getData");
      IS_CONSOLE_LOG_OPEN && console.log("active?", this.props.active);
      IS_CONSOLE_LOG_OPEN && console.log(getTotalAppsCountRequest.config);
      axiosCaptcha(
        getTotalAppsCountRequest.url,
        getTotalAppsCountRequest.config
      ).then(response => {
        if (response.statusText === "OK") {
          this.totalAppsCountRequest = response.data.data;
          this.setState({
            totalAppsCountRequest: this.totalAppsCountRequest
          });
        }
      });
      axiosCaptcha(
        getAppsCountByMonthRequest.url,
        getAppsCountByMonthRequest.config
      ).then(response => {
        if (response.statusText === "OK") {
          this.appsCountByMonthRequest = response.data.data[0];
          this.appsCountByMonthRequest.forEach(element => {
            element["name"] = element["source"];
            delete element["source"];
            element["type"] = "bar";
            element["stack"] = "Company";
          });
          this.appsCountByMonthRequest.forEach(element => {
            let total = 0;
            element["data"].forEach(month => {
              total = total + month;
            });
            this.listData.push({ id: element.name, value: total });
          });
          this.listData
            .sort((a, b) => parseFloat(a.value) - parseFloat(b.value))
            .reverse();
          this.currentMonthsOfLastYear = response.data.data[1];
          this.setState({
            appsCountByMonthRequest: this.appsCountByMonthRequest,
            currentMonthsOfLastYear: this.currentMonthsOfLastYear
          });
          this.state.appsCountByMonthRequest.map(item =>
            this.appsMonthSources.push(item.name)
          );
          this.setState({
            appsMonthSources: this.appsMonthSources
          });
        }
      });
      axiosCaptcha(
        getAppsCountByMonthWithTotalRequest.url,
        getAppsCountByMonthWithTotalRequest.config
      ).then(response => {
        if (response.statusText === "OK") {
          this.appsCountByMonthWithTotalRequest = response.data.data[0];
          this.appsCountByMonthWithTotalRequest.forEach(element => {
            element["name"] = element["source"];
            delete element["source"];
            element["type"] = "line";
          });
          this.setState({
            appsCountByMonthWithTotalRequest: this
              .appsCountByMonthWithTotalRequest
          });
          this.state.appsCountByMonthWithTotalRequest.map(item =>
            this.appsMonthSourcesWithTotal.push(item.name)
          );
          this.setState({
            appsMonthSourcesWithTotal: this.appsMonthSourcesWithTotal
          });
        }
      });
      axiosCaptcha(
        getCountByJobtitleAndStatusesRequest.url,
        getCountByJobtitleAndStatusesRequest.config
      ).then(response => {
        if (response.statusText === "OK") {
          this.countByJobtitleAndStatusesRequest = response.data.data;
          this.countByJobtitleAndStatusesRequest.data.forEach(element => {
            element["type"] = "bar";
            element["stack"] = "Company";
          });
          this.setState({
            countByJobtitleAndStatusesRequest: this
              .countByJobtitleAndStatusesRequest
          });
        }
      });
      axiosCaptcha(
        getCountByStatusesRequest.url,
        getCountByStatusesRequest.config
      ).then(response => {
        if (response.statusText === "OK") {
          this.countByStatusesRequest = response.data.data;
          this.setState({ isInitialRequest: false });
          this.setState({
            countByStatusesRequest: this.countByStatusesRequest
          });
        }
      });
      axiosCaptcha(getWordCountRequest.url, getWordCountRequest.config).then(
        response => {
          if (response.statusText === "OK") {
            this.wordCountRequest = response.data.data;
            this.setState({
              wordCountRequest: this.wordCountRequest
            });
          }
        }
      );
    }
  }

  render() {
    if (this.state.isInitialRequest === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    if (this.state.isInitialRequest === true)
      return <Spinner message="Preparing your metrics..." />;
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
          <IndividualMetrics
            MonthlyApplicationGraph={{
              legendData: this.state.appsMonthSources,
              months: this.currentMonthsOfLastYear,
              series: this.state.appsCountByMonthRequest
            }}
            MonthlyApplicationLineGraph={{
              legendData: this.state.appsMonthSourcesWithTotal,
              months: this.currentMonthsOfLastYear,
              series: this.state.appsCountByMonthWithTotalRequest
            }}
            StagesOfApplicationsPieChart={{
              legendData: this.state.appsMonthSources,
              seriesData: this.state.countByStatusesRequest
            }}
            StagesInPositions={{
              legendData: this.state.countByJobtitleAndStatusesRequest.statuses,
              xData: this.state.countByJobtitleAndStatusesRequest.jobs,
              series: this.state.countByJobtitleAndStatusesRequest.data
            }}
            listData={this.listData}
            value={this.state.totalAppsCountRequest.count}
          />
        </div>
        <div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Metrics;
