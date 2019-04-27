import React, { PureComponent } from "react";

import Spinner from "../Spinner/Spinner.jsx";
import DropDownSelector from "../MetricsGlobal/SubComponents/DropDownSelector.jsx";
import FeatureArea from "./SubComponents/FeatureArea.jsx";
import MonthlyApplicationGraph from "./SubComponents/MonthlyApplicationGraph.jsx";
import MonthlyApplicationLineGraph from "./SubComponents/MonthlyApplicationLineGraph.jsx";
import StagesOfApplicationsPieChart from "./SubComponents/StagesOfApplicationsPieChart.jsx";
import StagesInPositions from "./SubComponents/StagesInPositions.jsx";
import { fetchApi } from "../../utils/api/fetch_api";
import {
  getTotalAppsCountRequest,
  getAppsCountByMonthRequest,
  getAppsCountByMonthWithTotalRequest,
  getCountByJobtitleAndStatusesRequest,
  getCountByStatusesRequest,
  getWordCountRequest
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
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate() {
    this.getData();
  }

  getData() {
    if (this.props.active && this.state.isWaitingResponse === "beforeRequest") {
      this.setState({ isWaitingResponse: true });
      IS_CONSOLE_LOG_OPEN && console.log("metrics token:", this.props.token);
      IS_CONSOLE_LOG_OPEN && console.log("active?", this.props.active);
      getTotalAppsCountRequest.config.headers.Authorization = this.props.token;
      IS_CONSOLE_LOG_OPEN && console.log(getTotalAppsCountRequest.config);
      fetchApi(
        getTotalAppsCountRequest.url,
        getTotalAppsCountRequest.config
      ).then(response => {
        if (response.ok) {
          this.totalAppsCountRequest = response.json.data;
          this.setState({
            totalAppsCountRequest: this.totalAppsCountRequest
          });
        }
      });
      getAppsCountByMonthRequest.config.headers.Authorization = this.props.token;
      fetchApi(
        getAppsCountByMonthRequest.url,
        getAppsCountByMonthRequest.config
      ).then(response => {
        if (response.ok) {
          this.appsCountByMonthRequest = response.json.data[0];
          this.appsCountByMonthRequest.forEach(element => {
            element["name"] = element["source"];
            delete element["source"];
            element["type"] = "bar";
            element["stack"] = "Company";
          });
          this.currentMonthsOfLastYear = response.json.data[1];
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
      fetchApi(
        getAppsCountByMonthWithTotalRequest.url,
        getAppsCountByMonthWithTotalRequest.config
      ).then(response => {
        if (response.ok) {
          this.appsCountByMonthWithTotalRequest = response.json.data[0];
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
      fetchApi(
        getCountByJobtitleAndStatusesRequest.url,
        getCountByJobtitleAndStatusesRequest.config
      ).then(response => {
        if (response.ok) {
          this.countByJobtitleAndStatusesRequest = response.json.data;
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
      fetchApi(
        getCountByStatusesRequest.url,
        getCountByStatusesRequest.config
      ).then(response => {
        if (response.ok) {
          this.countByStatusesRequest = response.json.data;
          this.setState({ isWaitingResponse: false });
          this.setState({
            countByStatusesRequest: this.countByStatusesRequest
          });
        }
      });
      getWordCountRequest.config.headers.Authorization = this.props.token;
      fetchApi(getWordCountRequest.url, getWordCountRequest.config).then(
        response => {
          if (response.ok) {
            this.wordCountRequest = response.json.data;
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
      </div>
    );
  }
}

export default Metrics;
