import React, { PureComponent } from "react";

import Spinner from "../Partials/Spinner/Spinner.jsx";
import FeatureArea from "./SubComponents/FeatureArea.jsx";
import TrendingBarGraph from "./SubComponents/TrendingBarGraph.jsx";
import PeakLineGraph from "./SubComponents/PeakLineGraph.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import {
  getMonthlyApplicationCountRequest,
  getStatisticsRequest,
  getTrendingRequest,
  postUsersRequest
} from "../../utils/api/requests.js";
import { apiRoot, GET_TOP_COMPANIES } from "../../utils/constants/endpoints.js";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";

import "./style.scss";

class MetricsGlobal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      appsCountByMonthWithTotal: [],
      appsMonthSourcesWithTotal: [],
      currentMonthsOfLastYear: [],
      trendingDataNames: [],
      trendingDataAmounts: [],
      trendingCompaniesWordCount: [],
      statistics: {},

      isInitialRequest: "beforeRequest",
      isChangingGraph: false,
      trendingDataType: GET_TOP_COMPANIES,
      trendingCount: "&count=10",
      trendingYear: "&year=2019",
      tredingStatus: "",
      trendingUrl: "",
      currentCount: "10",
      currentType: "Companies",
      currentYear: "2019",
      currentStatus: "All Applied"
    };
    this.appsCountByMonthWithTotal = [];
    this.appsMonthSourcesWithTotal = [];
    this.currentMonthsOfLastYear = [];
    this.trendingDataNames = [];
    this.trendingDataAmounts = [];
    this.trendingCompaniesWordCount = [];

    this.setTrendingDataType = this.setTrendingDataType.bind(this);
    this.setTrendingDataCount = this.setTrendingDataCount.bind(this);
    this.setTrendingDataYear = this.setTrendingDataYear.bind(this);
    this.setTrendingDataStatus = this.setTrendingDataStatus.bind(this);
  }

  async componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      let trendingUrl =
        apiRoot +
        this.state.trendingDataType +
        "?" +
        this.state.trendingCount +
        this.state.trendingYear +
        this.state.tredingStatus;
      await this.getFirstData(trendingUrl);
      axiosCaptcha(
        postUsersRequest.url("verify_recaptcha"),
        postUsersRequest.config,
        "metrics_global"
      ).then(response => {
        if (response.statusText === "OK") {
          if (response.data.success != true) {
            this.setState({ isUpdating: false });
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

  async getFirstData(trendingUrl) {
    await this.props.handleTokenExpiration("metricsGlobal getFirstData");
    this.getStatisticsData();
    this.getPeakData();
    this.getTrendingData(trendingUrl, false);
  }

  getStatisticsData() {
    this.setState({ isInitialRequest: true });
    IS_CONSOLE_LOG_OPEN &&
      console.log(
        "metrics global statistics request run!",
        "\n-----isInitialRequest",
        this.state.isInitialRequest
      );
    axiosCaptcha(getStatisticsRequest.url, getStatisticsRequest.config).then(
      response => {
        if (response.statusText === "OK") {
          this.setState({
            statistics: response.data.data
          });
        }
      }
    );
  }

  getPeakData() {
    this.setState({ isInitialRequest: true });
    IS_CONSOLE_LOG_OPEN &&
      console.log(
        "metrics global count request run!",
        "\n-----isInitialRequest",
        this.state.isInitialRequest
      );
    axiosCaptcha(
      getMonthlyApplicationCountRequest.url,
      getMonthlyApplicationCountRequest.config
    ).then(response => {
      if (response.statusText === "OK") {
        this.appsCountByMonthWithTotal = response.data.data[0];
        this.appsCountByMonthWithTotal.forEach(element => {
          element["name"] = element["source"];
          delete element["source"];
          element["type"] = "line";
          element["markPoint"] = {
            data: [{ type: "max", name: "max" }]
          };
          element["markLine"] = {
            data: [{ type: "average", name: "average" }]
          };
        });
        this.currentMonthsOfLastYear = response.data.data[1];
        this.setState({
          appsCountByMonthWithTotal: this.appsCountByMonthWithTotal,
          currentMonthsOfLastYear: this.currentMonthsOfLastYear
        });
        this.state.appsCountByMonthWithTotal.map(item =>
          this.appsMonthSourcesWithTotal.push(item.name)
        );
        this.setState({
          appsMonthSourcesWithTotal: this.appsMonthSourcesWithTotal
        });
      }
    });
  }

  async getTrendingData(trendingUrl, isTokenExpirationChecking) {
    IS_CONSOLE_LOG_OPEN &&
      console.log(
        "***********TRENDING RUN!*********\n***********\ntrending Url before request",
        trendingUrl,
        "\n-----isInitialRequest",
        this.state.isInitialRequest,
        "\n-----isChangingGraph",
        this.state.isChangingGraph
      );
    isTokenExpirationChecking &&
      (await this.props.handleTokenExpiration("metricsGlobal getTrendingData"));
    this.setState({ isInitialRequest: true });
    axiosCaptcha(trendingUrl, getTrendingRequest.config).then(response => {
      if (response.statusText === "OK") {
        IS_CONSOLE_LOG_OPEN &&
          console.log(
            "top companies request",
            getTrendingRequest,
            "response",
            response.data.data
          );
        response.data.data.map(element => {
          this.trendingDataNames.push(element.company);
          this.trendingDataAmounts.push(element.count);
        });
        this.setState({
          trendingDataNames: this.trendingDataNames.reverse(),
          trendingDataAmounts: this.trendingDataAmounts.reverse(),
          isChangingGraph: false
        });
        this.setState({
          isInitialRequest: false
        });
      }
    });
  }

  resetExistingTrendingData() {
    this.trendingDataAmounts.length = 0;
    this.trendingDataNames.length = 0;
    this.trendingCompaniesWordCount.length = 0;
  }

  setTrendingDataType(dataType, typeName) {
    this.setState({ isChangingGraph: true });
    this.resetExistingTrendingData();
    const trendingUrl =
      apiRoot +
      dataType +
      "?" +
      this.state.trendingCount +
      this.state.trendingYear +
      this.state.tredingStatus;
    this.getTrendingData(trendingUrl, true);
    this.setState({
      trendingDataType: dataType,
      currentType: typeName
    });
  }

  setTrendingDataYear(dataYear, year) {
    this.setState({ isChangingGraph: true });
    this.resetExistingTrendingData();
    const trendingUrl =
      apiRoot +
      this.state.trendingDataType +
      "?" +
      this.state.trendingCount +
      dataYear +
      this.state.tredingStatus;
    this.getTrendingData(trendingUrl, true);
    this.setState({
      trendingYear: dataYear,
      currentYear: year
    });
  }

  setTrendingDataCount(dataCount, count) {
    this.setState({ isChangingGraph: true });
    this.resetExistingTrendingData();
    const trendingUrl =
      apiRoot +
      this.state.trendingDataType +
      "?" +
      dataCount +
      this.state.trendingYear +
      this.state.tredingStatus;
    this.getTrendingData(trendingUrl, true);
    this.setState({
      trendingCount: dataCount,
      currentCount: count
    });
  }

  setTrendingDataStatus(dataStatus, statusName) {
    this.setState({ isChangingGraph: true });
    this.resetExistingTrendingData();
    const trendingUrl =
      apiRoot +
      this.state.trendingDataType +
      "?" +
      this.state.trendingCount +
      this.state.trendingYear +
      dataStatus;
    this.getTrendingData(trendingUrl, true);
    this.setState({
      tredingStatus: dataStatus,
      currentStatus: statusName
    });
  }

  render() {
    IS_CONSOLE_LOG_OPEN && console.log("render run!");
    this.props.active &&
      IS_CONSOLE_LOG_OPEN &&
      console.log(
        "render ACTIVE! metrics global active",
        this.props.active,
        "\n----isInitialRequest",
        this.state.isInitialRequest,
        "\n----isChangingGraph",
        this.state.isChangingGraph,
        "\n----trendingUrl",
        this.state.trendingUrl
      );
    if (this.state.isInitialRequest === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    if (
      this.state.isInitialRequest === true &&
      this.state.isChangingGraph === false
    )
      return <Spinner message="Preparing your aggregated metrics..." />;
    const menuList = [
      this.state.currentCount,
      this.state.currentType,
      this.state.currentYear,
      this.state.currentStatus
    ];
    return (
      <div>
        <FeatureArea statistics={this.state.statistics} />;
        <div>
          <TrendingBarGraph
            names={this.state.trendingDataNames}
            amounts={this.state.trendingDataAmounts}
            setTrendingDataType={this.setTrendingDataType}
            setTrendingDataYear={this.setTrendingDataYear}
            setTrendingDataCount={this.setTrendingDataCount}
            setTrendingDataStatus={this.setTrendingDataStatus}
            menuNameList={menuList}
          />
          <PeakLineGraph
            data={this.state.appsMonthSourcesWithTotal}
            months={this.state.currentMonthsOfLastYear}
            series={this.state.appsCountByMonthWithTotal}
          />
        </div>
      </div>
    );
  }
}

export default MetricsGlobal;
