import React, {Component} from "react";
import Column from '../Column/Column.jsx';
import {fetchApi} from '../../utils/api/fetch_api'
import {GET_JOB_APPS} from '../../utils/constants/endpoints.js';

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
  }

  componentDidMount() {
    const config = {
      url: GET_JOB_APPS,
      method: 'GET'
    };
    fetchApi(config)
      .then(response => {
        this.sortApplications(response);
      });
  }

  sortApplications(applications) {
    for (let application of applications) {
      switch (application.applicationStatus.value) {
        case 'toapply':
          this.jobsToApply.push(application);
          break;
        case 'applied':
          if (application.isRejected) {
            this.jobsRejectedApplied.push(application)
          }
          else {
            this.jobsApplied.push(application);
          }
          break;
        case 'phonescreen':
          if (application.isRejected) {
            this.jobsRejectedPhoneScreen.push(application)
          }
          else {
            this.jobsPhoneScreen.push(application);
          }
          break;
        case 'onsiteinterview':
          if (application.isRejected) {
            this.jobsRejectedOnsiteInterview.push(application)
          }
          else {
            this.jobsOnsiteInterview.push(application);
          }
          break;
        case 'offer':
          if (application.isRejected) {
            this.jobsRejectedOffer.push(application)
          }
          else {
            this.jobsOffer.push(application);
          }
          break;
        default:
      }
    }
    this.setState({
      jobsToApply: this.jobsToApply,
      jobsApplied: this.jobsApplied,
      jobsInterview: this.jobsPhoneScreen,
      jobsRejected: this.jobsOnsiteInterview,
      jobsOffer: this.jobsOffer,
    });
  }

  render() {
    return (
      <div className="dashboard-container">
        <Column
          icon="../../src/assets/icons/ToApplyIcon@3x.png"
          title="TO APPLY"
          totalCount={this.jobsToApply.length}
          cards={this.jobsToApply}
        />
        <Column
          icon="../../src/assets/icons/AppliedIcon@3x.png"
          title="APPLIED"
          totalCount={this.jobsApplied.length + this.jobsRejectedApplied.length}
          cards={this.jobsApplied}
          cardsRejecteds={this.jobsRejectedApplied}
          message="rejected without any interview"
        />
        <Column
          icon="../../src/assets/icons/PhoneScreenIcon@3x.png"
          title="PHONE SCREEN"
          totalCount={this.jobsPhoneScreen.length + this.jobsRejectedPhoneScreen.length}
          cards={this.jobsPhoneScreen}
          cardsRejecteds={this.jobsRejectedPhoneScreen}
          message="rejected after phone screens"
        />
        <Column
          icon="../../src/assets/icons/OnsiteInterviewIcon@3x.png"
          title="ONSITE INTERVIEW"
          totalCount={this.jobsOnsiteInterview.length + this.jobsRejectedOnsiteInterview.length}
          cards={this.jobsOnsiteInterview}
          cardsRejecteds={this.jobsRejectedOnsiteInterview}
          message="rejected after interviews"
        />
        <Column
          icon="../../src/assets/icons/OffersIcon@3x.png"
          title="OFFERS"
          totalCount={this.jobsOffer.length + this.jobsRejectedOffer.length}
          cards={this.jobsOffer}
          cardsRejecteds={this.jobsRejectedOffer}
          message="you rejected their offer"
        />
      </div>
    );
  }
}

export default Dashboard;