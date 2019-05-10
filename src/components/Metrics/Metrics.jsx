import React, { PureComponent } from "react";
import { ReCaptcha } from "react-recaptcha-v3";

import Spinner from "../Partials/Spinner/Spinner.jsx";
import DropDownSelector from "../Partials/DropDown/DropDownSelector.jsx";
import FeatureArea from "./SubComponents/FeatureArea.jsx";
import MonthlyApplicationGraph from "./SubComponents/MonthlyApplicationGraph.jsx";
import MonthlyApplicationLineGraph from "./SubComponents/MonthlyApplicationLineGraph.jsx";
import StagesOfApplicationsPieChart from "./SubComponents/StagesOfApplicationsPieChart.jsx";
import StagesInPositions from "./SubComponents/StagesInPositions.jsx";
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
      isWaitingResponse: "beforeRequest",
      isMonthlyLine: false,
      selectedGraph: "Bar"
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

    this.graphSelector = this.graphSelector.bind(this);
    this.verifyReCaptchaCallback = this.verifyReCaptchaCallback.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate() {
    this.getData();
  }

  verifyReCaptchaCallback(recaptchaToken) {
    IS_CONSOLE_LOG_OPEN &&
      console.log("\n\nyour recaptcha token:", recaptchaToken, "\n");
    postUsersRequest.config["body"] = JSON.stringify({
      recaptcha_token: recaptchaToken,
      action: "metrics"
    });
    postUsersRequest.config.headers.Authorization = this.props.token;
    axiosCaptcha(
      postUsersRequest.url("verify_recaptcha"),
      postUsersRequest.config
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
      postUsersRequest.config["body"] = {};
    });
  }

  getData() {
    if (this.props.active && this.state.isWaitingResponse === "beforeRequest") {
      this.setState({ isWaitingResponse: true });
      IS_CONSOLE_LOG_OPEN && console.log("metrics token:", this.props.token);
      IS_CONSOLE_LOG_OPEN && console.log("active?", this.props.active);
      getTotalAppsCountRequest.config.headers.Authorization = this.props.token;
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
      getAppsCountByMonthRequest.config.headers.Authorization = this.props.token;
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
      getAppsCountByMonthWithTotalRequest.config.headers.Authorization = this.props.token;
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
      getCountByJobtitleAndStatusesRequest.config.headers.Authorization = this.props.token;
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
      getCountByStatusesRequest.config.headers.Authorization = this.props.token;
      axiosCaptcha(
        getCountByStatusesRequest.url,
        getCountByStatusesRequest.config
      ).then(response => {
        if (response.statusText === "OK") {
          this.countByStatusesRequest = response.data.data;
          this.setState({ isWaitingResponse: false });
          this.setState({
            countByStatusesRequest: this.countByStatusesRequest
          });
        }
      });
      getWordCountRequest.config.headers.Authorization = this.props.token;
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

  graphSelector(param, value) {
    this.setState({ isMonthlyLine: param, selectedGraph: value });
  }

  render() {
    IS_CONSOLE_LOG_OPEN && console.log("metrics token", this.props.token);
    if (this.state.isWaitingResponse === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    if (this.state.isWaitingResponse === true)
      return <Spinner message="Preparing your metrics..." />;
    return (
      <div>
        <FeatureArea count={this.state.totalAppsCountRequest.count} />
        <div className="selection-menu-container">
          <div className="selection-menu">
            <div className="filter-indicator">Selected:</div>
            <DropDownSelector
              itemList={[
                { id: 0, value: "Bar", param: false },
                { id: 1, value: "Line", param: true }
              ]}
              selector={this.graphSelector}
              menuName={this.state.selectedGraph}
            />
          </div>
        </div>
        <div className="graph-container-dark-background">
          {this.state.isMonthlyLine ? (
            <MonthlyApplicationLineGraph
              legendData={this.state.appsMonthSourcesWithTotal}
              months={this.currentMonthsOfLastYear}
              series={this.state.appsCountByMonthWithTotalRequest}
            />
          ) : (
            <MonthlyApplicationGraph
              legendData={this.state.appsMonthSources}
              months={this.currentMonthsOfLastYear}
              series={this.state.appsCountByMonthRequest}
            />
          )}
        </div>
        <StagesOfApplicationsPieChart
          legendData={this.state.appsMonthSources}
          seriesData={this.state.countByStatusesRequest}
        />
        <StagesInPositions
          legendData={this.state.countByJobtitleAndStatusesRequest.statuses}
          xData={this.state.countByJobtitleAndStatusesRequest.jobs}
          series={this.state.countByJobtitleAndStatusesRequest.data}
        />
        <div>
          <ReCaptcha
            sitekey="6LfOH6IUAAAAAL4Ezv-g8eUzkkERCWlnnPq_SdkY"
            action="metrics"
            verifyCallback={this.verifyReCaptchaCallback}
          />
        </div>
      </div>
    );
  }
}

export default Metrics;
