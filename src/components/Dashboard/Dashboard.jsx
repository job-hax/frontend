import React, {Component} from "react";
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Column from '../Column/Column.jsx';
import {fetchApi} from '../../utils/api/fetch_api'
import {
  authenticateRequest,
  getJobAppsRequest,
  syncUserEmailsRequest
} from '../../utils/api/requests.js'
import {IS_MOCKING} from '../../config/config.js';
import {mockJobApps} from '../../utils/api/mockResponses.js'

import './style.scss'

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jobsToApply: [],
      jobsApplied: [],
      jobsPhoneScreen: [],
      jobsOnsiteInterview: [],
      jobsOffer: [],
      jobsRejectedApplied: [],
      jobsRejectedPhoneScreen: [],
      jobsRejectedOnsiteInterview: [],
      jobsRejectedOffer: [],
    };

    this.jobsToApply = [];
    this.jobsApplied = [];
    this.jobsPhoneScreen = [];
    this.jobsOnsiteInterview = [];
    this.jobsOffer = [];
    this.jobsRejectedApplied = [];
    this.jobsRejectedPhoneScreen = [];
    this.jobsRejectedOnsiteInterview = [];
    this.jobsRejectedOffer = [];

    this.updateApplications = this.updateApplications.bind(this);
    this.addNewApplication = this.addNewApplication.bind(this);
  }

  componentDidMount() {
    if (IS_MOCKING) {
      this.sortJobApplications(mockJobApps.data);
      return;
    }
    const {url, config} = authenticateRequest;
    config.body.token = this.props.googleAuth.currentUser.get().getAuthResponse().access_token;
    config.body = JSON.stringify(config.body);
    fetchApi(url, config)
      .then(response => {
        if (response.ok) {
          return response.json;
        }
      })
      .then(response => {
        const {url, config} = syncUserEmailsRequest;
        config.headers.Authorization = `${response.data.token_type} ${response.data.access_token}`;
        fetchApi(url, config)
          .then(response => {
            return {
              ok: response.ok,
              token: config.headers.Authorization
            }
          })
          .then(({ok, token}) => {
            if (ok) {
              const {url, config} = getJobAppsRequest;
              config.headers.Authorization = token;
              fetchApi(url, config)
                .then(response => {
                  if (response.ok) {
                    this.sortJobApplications(response.json.data);
                  }
                });
            }
          });
      })
  }

  sortJobApplications(applications) {
    for (let application of applications) {
      switch (application.applicationStatus.value.toLowerCase()) {
        case 'toapply':
          this.jobsToApply.push(application);
          break;
        case 'applied':
          if (application.isRejected) {
            this.jobsRejectedApplied.push(application)
          } else {
            this.jobsApplied.push(application);
          }
          break;
        case 'phonescreen':
          if (application.isRejected) {
            this.jobsRejectedPhoneScreen.push(application)
          } else {
            this.jobsPhoneScreen.push(application);
          }
          break;
        case 'onsiteinterview':
          if (application.isRejected) {
            this.jobsRejectedOnsiteInterview.push(application)
          } else {
            this.jobsOnsiteInterview.push(application);
          }
          break;
        case 'offer':
          if (application.isRejected) {
            this.jobsRejectedOffer.push(application)
          } else {
            this.jobsOffer.push(application);
          }
          break;
        default:
      }
    }
    this.refreshJobs();
  }

  refreshJobs() {
    this.setState({
      jobsToApply: this.jobsToApply,
      jobsApplied: this.jobsApplied,
      jobsPhoneScreen: this.jobsPhoneScreen,
      jobsOnsiteInterview: this.jobsOnsiteInterview,
      jobsOffer: this.jobsOffer,
      jobsRejectedApplied: this.jobsRejectedApplied,
      jobsRejectedOffer: this.jobsRejectedOffer,
      jobsRejectedOnsiteInterview: this.jobsRejectedOnsiteInterview,
      jobsRejectedPhoneScreen: this.jobsRejectedPhoneScreen,
    });
  }

  updateApplications(card, dragColumnName, dropColumnName) {
    if (dragColumnName === dropColumnName) {
      return;
    }
    const removedItemColumn = this.state[dragColumnName]
      .filter(job => {
        return job.id !== card.id;
      });

    let insertedItemColumn = this.state[dropColumnName].slice();
    insertedItemColumn.unshift(card);

    this.setState(() => ({
      [dragColumnName]: removedItemColumn,
      [dropColumnName]: insertedItemColumn
    }));
  }

  addNewApplication({name, title}) {
  // addNewApplication(card, columnName) {
    // let insertedItemColumn = this.state[columnName].slice();
    // insertedItemColumn.unshift(card);

    // this.setState(() => ({
    //   [columnName]: insertedItemColumn
    // }));

    console.log(name, title);
  }

  render() {
    return (
      <div className="dashboard-container">
        <Column
          name="jobsToApply"
          updateApplications={this.updateApplications}
          addNewApplication={this.addNewApplication}
          icon="../../src/assets/icons/ToApplyIcon@3x.png"
          title="TO APPLY"
          totalCount={this.state.jobsToApply.length}
          cards={this.state.jobsToApply}
        />
        <Column
          name="jobsApplied"
          updateApplications={this.updateApplications}
          addNewApplication={this.addNewApplication}
          icon="../../src/assets/icons/AppliedIcon@3x.png"
          title="APPLIED"
          totalCount={this.state.jobsApplied.length + this.state.jobsRejectedApplied.length}
          cards={this.state.jobsApplied}
          cardsRejecteds={this.state.jobsRejectedApplied}
          message="rejected without any interview"
        />
        <Column
          name="jobsPhoneScreen"
          updateApplications={this.updateApplications}
          addNewApplication={this.addNewApplication}
          icon="../../src/assets/icons/PhoneScreenIcon@3x.png"
          title="PHONE SCREEN"
          totalCount={this.state.jobsPhoneScreen.length + this.state.jobsRejectedPhoneScreen.length}
          cards={this.state.jobsPhoneScreen}
          cardsRejecteds={this.state.jobsRejectedPhoneScreen}
          message="rejected after phone screens"
        />
        <Column
          name="jobsOnsiteInterview"
          updateApplications={this.updateApplications}
          addNewApplication={this.addNewApplication}
          icon="../../src/assets/icons/OnsiteInterviewIcon@3x.png"
          title="ONSITE INTERVIEW"
          totalCount={this.state.jobsOnsiteInterview.length + this.state.jobsRejectedOnsiteInterview.length}
          cards={this.state.jobsOnsiteInterview}
          cardsRejecteds={this.state.jobsRejectedOnsiteInterview}
          message="rejected after interviews"
        />
        <Column
          name="jobsOffer"
          updateApplications={this.updateApplications}
          addNewApplication={this.addNewApplication}
          icon="../../src/assets/icons/OffersIcon@3x.png"
          title="OFFERS"
          totalCount={this.state.jobsOffer.length + this.state.jobsRejectedOffer.length}
          cards={this.state.jobsOffer}
          cardsRejecteds={this.state.jobsRejectedOffer}
          message="you rejected their offer"
        />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Dashboard);

