import React, { PureComponent } from "react";

import Header from "../Header/Header.jsx";
import Spinner from "../Spinner/Spinner.jsx";
import FeatureArea from "./Components/FeatureArea.jsx";
import TrendingBarGraph from "./Components/TrendingBarGraph.jsx";
import PeakLineGraph from "./Components/PeakLineGraph.jsx";
import { fetchApi } from "../../utils/api/fetch_api";
import {
  getMonthlyApplicationCountRequest,
  getStatisticsRequest,
  getTrendingRequest
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

      isWaitingResponse: "beforeRequest",
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

  componentDidMount() {
    this.setState({
      trendingUrl:
        apiRoot +
        this.state.trendingDataType +
        "?" +
        this.state.trendingCount +
        this.state.trendingYear +
        this.state.tredingStatus
    });
  }

  componentDidUpdate() {
    this.getStatisticsData();
    this.getPeakData();
    if (
      this.props.active &&
      this.state.trendingUrl &&
      this.state.isWaitingResponse === "beforeRequest"
    ) {
      this.getTrendingData(this.state.trendingUrl);
    }
  }

  getStatisticsData() {
    if (
      this.props.active &&
      this.state.isWaitingResponse === "beforeRequest" &&
      this.state.isChangingGraph === false
    ) {
      this.setState({ isWaitingResponse: true });
      IS_CONSOLE_LOG_OPEN &&
        console.log(
          "metrics global statistics request run!",
          "\n-----isWaitingResponse",
          this.state.isWaitingResponse
        );
      getStatisticsRequest.config.headers.Authorization = this.props.token;
      fetchApi(getStatisticsRequest.url, getStatisticsRequest.config).then(
        response => {
          if (response.ok) {
            this.setState({
              statistics: response.json.data,
              isWaitingResponse: false
            });
          }
        }
      );
    }
  }

  getPeakData() {
    if (
      this.props.active &&
      this.state.isWaitingResponse === "beforeRequest" &&
      this.state.isChangingGraph === false
    ) {
      this.setState({ isWaitingResponse: true });
      IS_CONSOLE_LOG_OPEN &&
        console.log(
          "metrics global count request run!",
          "\n-----isWaitingResponse",
          this.state.isWaitingResponse
        );
      getMonthlyApplicationCountRequest.config.headers.Authorization = this.props.token;
      fetchApi(
        getMonthlyApplicationCountRequest.url,
        getMonthlyApplicationCountRequest.config
      ).then(response => {
        if (response.ok) {
          this.appsCountByMonthWithTotal = response.json.data[0];
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
          this.currentMonthsOfLastYear = response.json.data[1];
          this.setState({
            appsCountByMonthWithTotal: this.appsCountByMonthWithTotal,
            currentMonthsOfLastYear: this.currentMonthsOfLastYear
          });
          this.state.appsCountByMonthWithTotal.map(item =>
            this.appsMonthSourcesWithTotal.push(item.name)
          );
          this.setState({
            appsMonthSourcesWithTotal: this.appsMonthSourcesWithTotal,
            isWaitingResponse: false
          });
        }
      });
    }
  }

  getTrendingData(trendingUrl) {
    IS_CONSOLE_LOG_OPEN &&
      console.log(
        "***********TRENDING RUN!*********\n***********\ntrending Url before request",
        trendingUrl,
        "\n-----isWaitingResponse",
        this.state.isWaitingResponse,
        "\n-----isChangingGraph",
        this.state.isChangingGraph
      );
    this.setState({ isWaitingResponse: true });
    getTrendingRequest.config.headers.Authorization = this.props.token;
    fetchApi(trendingUrl, getTrendingRequest.config).then(response => {
      if (response.ok) {
        IS_CONSOLE_LOG_OPEN &&
          console.log(
            "top companies request",
            getTrendingRequest,
            "response",
            response.json.data
          );
        response.json.data.map(element => {
          this.trendingDataNames.push(element.company);
          this.trendingDataAmounts.push(element.count);
        });
        this.setState({
          trendingDataNames: this.trendingDataNames.reverse(),
          trendingDataAmounts: this.trendingDataAmounts.reverse(),
          isChangingGraph: false
        });
        this.setState({
          isWaitingResponse: false
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
    this.getTrendingData(trendingUrl);
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
    this.getTrendingData(trendingUrl);
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
    this.getTrendingData(trendingUrl);
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
    this.getTrendingData(trendingUrl);
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
        "\n----isWaitingResponse",
        this.state.isWaitingResponse,
        "\n----isChangingGraph",
        this.state.isChangingGraph,
        "\n----trendingUrl",
        this.state.trendingUrl
      );
    if (this.state.isWaitingResponse === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    if (
      this.state.isWaitingResponse === true &&
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
        <Header handleSignOut={this.props.handleSignOut} />
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
