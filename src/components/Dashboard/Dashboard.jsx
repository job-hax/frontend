import React, { Component } from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { Input, DatePicker, Checkbox } from "antd";

import Column from "./Column/Column.jsx";
import Spinner from "../Partials/Spinner/Spinner.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import {
  addJobAppsRequest,
  getJobAppsRequest,
  updateJobStatusRequest,
  postUsersRequest
} from "../../utils/api/requests.js";
import { IS_MOCKING } from "../../config/config.js";
import { mockJobApps } from "../../utils/api/mockResponses.js";
import {
  UPDATE_APPLICATION_STATUS,
  IS_CONSOLE_LOG_OPEN
} from "../../utils/constants/constants.js";
import { generateCurrentDate } from "../../utils/helpers/helperFunctions.js";

import "./style.scss";

const { Search } = Input;
const { RangePicker } = DatePicker;

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allApplications: [],
      toApply: [],
      applied: [],
      phoneScreen: [],
      onsiteInterview: [],
      offer: [],
      appliedRejected: [],
      phoneScreenRejected: [],
      onsiteInterviewRejected: [],
      offerRejected: [],
      isInitialRequest: "beforeRequest",
      selectedJobApplications: [],
      displayingList: [],
      isAllSelected: false
    };

    this.toApply = [];
    this.applied = [];
    this.phoneScreen = [];
    this.onsiteInterview = [];
    this.offer = [];
    this.appliedRejected = [];
    this.phoneScreenRejected = [];
    this.onsiteInterviewRejected = [];
    this.offerRejected = [];
    this.selectedJobApplications = [];

    this.updateApplications = this.updateApplications.bind(this);
    this.addNewApplication = this.addNewApplication.bind(this);
    this.deleteJobFromList = this.deleteJobFromList.bind(this);
    this.moveToRejected = this.moveToRejected.bind(this);
    this.onDateQuery = this.onDateQuery.bind(this);
    this.addToSelectedJobApplicationsList = this.addToSelectedJobApplicationsList.bind(
      this
    );
    this.onSelectAll = this.onSelectAll.bind(this);
  }

  async componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      await this.getData();
      axiosCaptcha(
        postUsersRequest.url("verify_recaptcha"),
        postUsersRequest.config,
        "dashboard"
      ).then(response => {
        if (response.statusText === "OK") {
          if (response.data.success != true) {
            this.setState({ isUpdating: false });
            IS_CONSOLE_LOG_OPEN && console.log(response.data.error_message);
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
    if (IS_MOCKING) {
      this.sortJobApplications(mockJobApps.data);
      return;
    }
    if (
      this.props.cookie("get", "jobhax_access_token") != ("" || null) &&
      this.state.isInitialRequest === "beforeRequest"
    ) {
      this.setState({ isInitialRequest: true });
      IS_CONSOLE_LOG_OPEN &&
        console.log(
          "dashboard token",
          this.props.cookie("get", "jobhax_access_token")
        ),
        "\ndashboard active?",
        this.props.active;
      if (this.props.active) {
        await this.props.handleTokenExpiration("dashboard getData");
        const { url, config } = getJobAppsRequest;
        axiosCaptcha(url, config).then(response => {
          if (response.statusText === "OK") {
            let updatedData = response.data.data;
            updatedData.forEach(jobApp => (jobApp.isSelected = false));
            this.setState({
              isInitialRequest: false,
              allApplications: updatedData,
              displayingList: updatedData
            });
            this.sortJobApplications(updatedData);
            IS_CONSOLE_LOG_OPEN &&
              console.log("dashboard response.data data", response.data.data);
          }
        });
      }
    }
  }

  sortJobApplications(applications) {
    this.toApply = [];
    this.applied = [];
    this.phoneScreen = [];
    this.onsiteInterview = [];
    this.offer = [];
    this.appliedRejected = [];
    this.phoneScreenRejected = [];
    this.onsiteInterviewRejected = [];
    this.offerRejected = [];
    for (let application of applications) {
      switch (application.applicationStatus.value.toLowerCase()) {
        case "to apply":
          this.toApply.push(application);
          break;
        case "applied":
          if (application.isRejected) {
            this.appliedRejected.push(application);
          } else {
            this.applied.push(application);
          }
          break;
        case "phone screen":
          if (application.isRejected) {
            this.phoneScreenRejected.push(application);
          } else {
            this.phoneScreen.push(application);
          }
          break;
        case "onsite interview":
          if (application.isRejected) {
            this.onsiteInterviewRejected.push(application);
          } else {
            this.onsiteInterview.push(application);
          }
          break;
        case "offer":
          if (application.isRejected) {
            this.offerRejected.push(application);
          } else {
            this.offer.push(application);
          }
          break;
        default:
      }
    }
    this.refreshJobs();
  }

  refreshJobs() {
    this.setState({
      toApply: this.toApply,
      applied: this.applied,
      phoneScreen: this.phoneScreen,
      onsiteInterview: this.onsiteInterview,
      offer: this.offer,
      appliedRejected: this.appliedRejected,
      offerRejected: this.offerRejected,
      onsiteInterviewRejected: this.onsiteInterviewRejected,
      phoneScreenRejected: this.phoneScreenRejected
    });
  }

  addToSelectedJobApplicationsList(command, jobAppId) {
    if (command === "add") {
      this.selectedJobApplications.push({ jobApp_id: jobAppId });
    }
    if (command === "delete") {
      this.selectedJobApplications = this.selectedJobApplications.filter(
        job => {
          return job.jobApp_id !== jobAppId;
        }
      );
    }
    this.setState({ selectedJobApplications: this.selectedJobApplications });
    console.log(this.selectedJobApplications);
  }

  async updateApplications(card, dragColumnName, dropColumnName) {
    if (dragColumnName === dropColumnName) {
      return;
    }
    const removedItemColumn = this.state[dragColumnName].filter(job => {
      return job.id !== card.id;
    });

    card.applicationStatus = UPDATE_APPLICATION_STATUS[dropColumnName];
    let insertedItemColumn = this.state[dropColumnName].slice();
    insertedItemColumn.unshift(card);
    await this.props.handleTokenExpiration("dashboard updateApplications");
    console.log("ok? after");
    let { url, config } = updateJobStatusRequest;
    config.body = {
      jobapp_id: card.id,
      status_id: card.applicationStatus.id,
      rejected: false
    };
    axiosCaptcha(url, config).then(response => {
      if (response.statusText === "OK") {
        this.setState(() => ({
          [dragColumnName]: removedItemColumn,
          [dropColumnName]: insertedItemColumn
        }));
      }
    });
  }

  async addNewApplication({ name, title, columnName }) {
    await this.props.handleTokenExpiration("dashboard addNewApplication");
    const { url, config } = addJobAppsRequest;
    config.body = {
      job_title: title,
      status_id: UPDATE_APPLICATION_STATUS[columnName].id,
      company: name,
      application_date: generateCurrentDate(),
      source: "N/A"
    };

    axiosCaptcha(url, config, "add_job").then(response => {
      if (response.statusText === "OK") {
        let insertedItemColumn = this.state[columnName].slice();
        insertedItemColumn.unshift(response.data.data);
        this.setState(() => ({
          [columnName]: insertedItemColumn
        }));
      }
    });
  }

  moveToRejected(columnName, card, isRejected) {
    if (isRejected) {
      var listToAdd = columnName + "Rejected";
      var listToRemove = columnName;
    } else {
      var listToAdd = columnName;
      var listToRemove = columnName + "Rejected";
    }
    card.isRejected = !card.isRejected;
    const removedItemColumn = this.state[listToRemove].filter(job => {
      return job.id !== card.id;
    });
    let insertedItemColumn = this.state[listToAdd].slice();
    insertedItemColumn.unshift(card);
    this.setState(() => ({
      [listToRemove]: removedItemColumn,
      [listToAdd]: insertedItemColumn
    }));
  }

  deleteJobFromList(columnName, cardId, isRejected) {
    if (isRejected) {
      columnName = columnName + "Rejected";
    }
    const removedItemColumn = this.state[columnName].filter(job => {
      return job.id !== cardId;
    });
    this.setState(() => ({
      [columnName]: removedItemColumn
    }));
  }

  onSearch(event) {
    let value = event.target.value;
    let queriedList = this.state.allApplications;
    queriedList = queriedList.filter(application => {
      return (
        application.companyObject.company
          .toLowerCase()
          .match(value.trim().toLowerCase()) ||
        application.position.job_title
          .toLowerCase()
          .match(value.trim().toLowerCase())
      );
    });
    console.log(queriedList);
    this.sortJobApplications(queriedList);
    this.setState({ displayingList: queriedList });
  }

  onDateQuery(date, dateString) {
    console.log(date, dateString);
    let mainList = this.state.allApplications;
    let filteredList = [];
    mainList.forEach(application => {
      if (
        date[0] <= new Date(application.applyDate) &&
        new Date(application.applyDate) <= date[1]
      ) {
        filteredList.push(application);
      }
    });
    console.log(filteredList);
    this.sortJobApplications(filteredList);
    this.setState({ displayingList: filteredList });
  }

  async onSelectAll(event) {
    let isSelected = event.target.checked;
    console.log(`checkedAll = `, isSelected);
    this.setState({ isALlSelected: isSelected });
    if (isSelected === true) {
      let selectedDisplayingList = this.state.displayingList;
      selectedDisplayingList.forEach(jobApp => (jobApp.isSelected = true));
      await this.setState({ displayingList: selectedDisplayingList });
      console.log(this.state.displayingList);
      this.selectedJobApplications = [];
      this.state.displayingList.forEach(jobApp =>
        this.selectedJobApplications.push({ jobApp_id: jobApp.id })
      );
      await this.setState({
        selectedJobApplications: this.selectedJobApplications
      });
      console.log(
        "selecteds List after select all",
        this.state.selectedJobApplications
      );
      this.sortJobApplications(this.state.displayingList);
    }
    if (isSelected === false) {
      let selectedDisplayingList = this.state.displayingList;
      selectedDisplayingList.forEach(jobApp => (jobApp.isSelected = false));
      await this.setState({ displayingList: selectedDisplayingList });
      console.log(this.state.displayingList);
      this.selectedJobApplications = [];
      await this.setState({
        selectedJobApplications: this.selectedJobApplications
      });
      console.log(
        "selecteds List after deselect all",
        this.state.selectedJobApplications
      );
      this.sortJobApplications(this.state.displayingList);
    }
  }

  render() {
    IS_CONSOLE_LOG_OPEN && console.log("Dashboard opened!");
    if (this.state.isInitialRequest === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    if (this.state.isInitialRequest && !IS_MOCKING)
      return <Spinner message="Preparing your dashboard..." />;
    return (
      <div>
        <div
          style={{
            position: "absolute",
            margin: "-45px 0 0 80px",
            display: "flex",
            justifyContent: "space-between",
            width: this.state.selectedJobApplications.length > 0 ? 556 : 440
          }}
        >
          <Search
            placeholder=""
            onChange={event => this.onSearch(event)}
            style={{ width: 200 }}
          />
          <RangePicker onChange={this.onDateQuery} style={{ width: 220 }} />
          {this.state.selectedJobApplications.length > 0 && (
            <Checkbox
              style={{
                padding: "6px 0px 0px 6px",
                color: "rgba(0, 0, 0, 0.4)",
                boxShadow: "inset 0px 0px 1px rgba(0,0,0,0.5)",
                backgroundColor: "white",
                borderRadius: 3,
                width: "102px",
                height: "32px"
              }}
              onChange={this.onSelectAll}
            >
              Select All
            </Checkbox>
          )}
        </div>
        <div className="dashboard-container">
          <Column
            name="toApply"
            id="2"
            updateApplications={this.updateApplications}
            addNewApplication={this.addNewApplication}
            deleteJobFromList={this.deleteJobFromList}
            icon="../../src/assets/icons/ToApplyIcon@3x.png"
            title="TO APPLY"
            totalCount={this.state.toApply.length}
            cards={this.state.toApply}
            handleTokenExpiration={this.props.handleTokenExpiration}
            alert={this.props.alert}
            addToSelectedJobApplicationsList={
              this.addToSelectedJobApplicationsList
            }
          />
          <div className="column-divider" />
          <Column
            name="applied"
            id="1"
            updateApplications={this.updateApplications}
            addNewApplication={this.addNewApplication}
            deleteJobFromList={this.deleteJobFromList}
            moveToRejected={this.moveToRejected}
            icon="../../src/assets/icons/AppliedIcon@3x.png"
            title="APPLIED"
            totalCount={
              this.state.applied.length + this.state.appliedRejected.length
            }
            cards={this.state.applied}
            cardsRejecteds={this.state.appliedRejected}
            message="rejected without any interview"
            handleTokenExpiration={this.props.handleTokenExpiration}
            alert={this.props.alert}
            addToSelectedJobApplicationsList={
              this.addToSelectedJobApplicationsList
            }
          />
          <div className="column-divider" />
          <Column
            name="phoneScreen"
            id="3"
            updateApplications={this.updateApplications}
            addNewApplication={this.addNewApplication}
            deleteJobFromList={this.deleteJobFromList}
            moveToRejected={this.moveToRejected}
            icon="../../src/assets/icons/PhoneScreenIcon@3x.png"
            title="PHONE SCREEN"
            totalCount={
              this.state.phoneScreen.length +
              this.state.phoneScreenRejected.length
            }
            cards={this.state.phoneScreen}
            cardsRejecteds={this.state.phoneScreenRejected}
            message="rejected after phone screens"
            handleTokenExpiration={this.props.handleTokenExpiration}
            alert={this.props.alert}
            addToSelectedJobApplicationsList={
              this.addToSelectedJobApplicationsList
            }
          />
          <div className="column-divider" />
          <Column
            name="onsiteInterview"
            id="4"
            updateApplications={this.updateApplications}
            addNewApplication={this.addNewApplication}
            deleteJobFromList={this.deleteJobFromList}
            moveToRejected={this.moveToRejected}
            icon="../../src/assets/icons/OnsiteInterviewIcon@3x.png"
            title="ONSITE INTERVIEW"
            totalCount={
              this.state.onsiteInterview.length +
              this.state.onsiteInterviewRejected.length
            }
            cards={this.state.onsiteInterview}
            cardsRejecteds={this.state.onsiteInterviewRejected}
            message="rejected after interviews"
            handleTokenExpiration={this.props.handleTokenExpiration}
            alert={this.props.alert}
            addToSelectedJobApplicationsList={
              this.addToSelectedJobApplicationsList
            }
          />
          <div className="column-divider" />
          <Column
            name="offer"
            id="5"
            updateApplications={this.updateApplications}
            addNewApplication={this.addNewApplication}
            deleteJobFromList={this.deleteJobFromList}
            moveToRejected={this.moveToRejected}
            icon="../../src/assets/icons/OffersIcon@3x.png"
            title="OFFERS"
            totalCount={
              this.state.offer.length + this.state.offerRejected.length
            }
            cards={this.state.offer}
            cardsRejecteds={this.state.offerRejected}
            message="you rejected their offer"
            handleTokenExpiration={this.props.handleTokenExpiration}
            isLastColumn={true}
            alert={this.props.alert}
            addToSelectedJobApplicationsList={
              this.addToSelectedJobApplicationsList
            }
          />
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Dashboard);
