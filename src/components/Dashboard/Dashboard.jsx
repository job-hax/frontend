import React, { Component } from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { ReCaptcha } from "react-recaptcha-v3";

import Column from "./Column/Column.jsx";
import Spinner from "../Partials/Spinner/Spinner.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import {
  addJobAppsRequest,
  getJobAppsRequest,
  syncUserEmailsRequest,
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

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toApply: [],
      applied: [],
      phoneScreen: [],
      onsiteInterview: [],
      offer: [],
      appliedRejected: [],
      phoneScreenRejected: [],
      onsiteInterviewRejected: [],
      offerRejected: [],
      isWaitingResponse: "beforeRequest"
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

    this.updateApplications = this.updateApplications.bind(this);
    this.addNewApplication = this.addNewApplication.bind(this);
    this.deleteJobFromList = this.deleteJobFromList.bind(this);
    this.moveToRejected = this.moveToRejected.bind(this);
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
      action: "dashboard"
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
    if (IS_MOCKING) {
      this.sortJobApplications(mockJobApps.data);
      return;
    }
    if (this.props.active && this.state.isWaitingResponse === "beforeRequest") {
      this.setState({ isWaitingResponse: true });
      IS_CONSOLE_LOG_OPEN && console.log("dashboard token", this.props.token),
        "\ndashboard active?",
        this.props.active;
      if (this.props.active) {
        const { url, config } = syncUserEmailsRequest;
        config.headers.Authorization = this.props.token;
        axiosCaptcha(url, config)
          .then(response => {
            return {
              ok: response.statusText === "OK"
            };
          })
          .then(({ ok }) => {
            const { url, config } = getJobAppsRequest;
            config.headers.Authorization = this.props.token;
            axiosCaptcha(url, config).then(response => {
              if (response.statusText === "OK") {
                this.sortJobApplications(response.data.data);
                this.setState({ isWaitingResponse: false });
                IS_CONSOLE_LOG_OPEN &&
                  console.log(
                    "dashboard response.data data",
                    response.data.data
                  );
              }
            });
          });
      }
    }
  }

  sortJobApplications(applications) {
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

  updateApplications(card, dragColumnName, dropColumnName) {
    if (dragColumnName === dropColumnName) {
      return;
    }
    const removedItemColumn = this.state[dragColumnName].filter(job => {
      return job.id !== card.id;
    });

    card.applicationStatus = UPDATE_APPLICATION_STATUS[dropColumnName];
    let insertedItemColumn = this.state[dropColumnName].slice();
    insertedItemColumn.unshift(card);

    let { url, config } = updateJobStatusRequest;
    config.body = JSON.stringify({
      jobapp_id: card.id,
      status_id: card.applicationStatus.id,
      rejected: false
    });
    config.headers.Authorization = this.props.token;

    axiosCaptcha(url, config).then(response => {
      if (response.statusText === "OK") {
        this.setState(() => ({
          [dragColumnName]: removedItemColumn,
          [dropColumnName]: insertedItemColumn
        }));
      }
    });
  }

  addNewApplication({ name, title, columnName, recaptchaToken }) {
    return new Promise(resolve => {
      const { url, config } = addJobAppsRequest;
      config.headers.Authorization = this.props.token;
      config.body = JSON.stringify({
        job_title: title,
        status_id: UPDATE_APPLICATION_STATUS[columnName].id,
        company: name,
        application_date: generateCurrentDate(),
        source: "N/A",
        recaptcha_token: recaptchaToken
      });

      axiosCaptcha(url, config).then(response => {
        if (response.statusText === "OK") {
          let insertedItemColumn = this.state[columnName].slice();
          insertedItemColumn.unshift(response.data.data);

          this.setState(() => ({
            [columnName]: insertedItemColumn
          }));

          resolve({ ok: true });
        }
      });
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

  render() {
    IS_CONSOLE_LOG_OPEN &&
      console.log(
        "Dashboard opened!",
        this.props.active,
        this.state.isWaitingResponse,
        this.props.token
      );
    if (this.state.isWaitingResponse === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    if (this.state.isWaitingResponse && !IS_MOCKING)
      return <Spinner message="Preparing your dashboard..." />;
    return (
      <div>
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
            token={this.props.token}
            alert={this.props.alert}
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
            token={this.props.token}
            alert={this.props.alert}
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
            token={this.props.token}
            alert={this.props.alert}
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
            token={this.props.token}
            alert={this.props.alert}
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
            token={this.props.token}
            isLastColumn={true}
            alert={this.props.alert}
          />
        </div>
        <div>
          <ReCaptcha
            sitekey="6LfOH6IUAAAAAL4Ezv-g8eUzkkERCWlnnPq_SdkY"
            action="dashboard"
            verifyCallback={this.verifyReCaptchaCallback}
          />
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Dashboard);
