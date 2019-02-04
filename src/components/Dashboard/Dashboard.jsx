import React, {Component} from "react";
import Column from '../Column/Column.jsx';
import {fetchApi} from '../../utils/api/fetch_api'

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
    fetchApi()
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
          icon="../../src/assets/icons/toapply.png"
          title="To Apply "
          totalCount={this.jobsToApply.length}
          cards={this.jobsToApply}
          details="..."
        />
        <Column
          icon="../../src/assets/icons/applied2.png"
          title="Applied "
          ongoingCount ={this.jobsApplied.length}
          totalCount={this.jobsApplied.length + this.jobsRejectedApplied.length} 
          cards={this.jobsApplied}
          cardsRejecteds={this.jobsRejectedApplied}
          details="..."
          rejectedsMessage=  "rejected without any interview"
          ongoingsMessage= "ongoing before interview stage"
        />
        <Column
          icon="../../src/assets/icons/phonescreen.png"
          title="Phone Screen "
          ongoingCount= {this.jobsPhoneScreen.length}
          totalCount={this.jobsPhoneScreen.length + this.jobsRejectedPhoneScreen.length}
          cards={this.jobsPhoneScreen}
          cardsRejecteds={this.jobsRejectedPhoneScreen}
          details="..."
          rejectedsMessage= "rejected after phone screen(s)"
          ongoingsMessage= "ongoing application(s) at phone screen"
        />
        <Column
          icon="../../src/assets/icons/onsiteinterview.png"
          title="Onsite Interview "
          ongoingCount={this.jobsOnsiteInterview.length}
          totalCount={this.jobsOnsiteInterview.length + this.jobsRejectedOnsiteInterview.length}
          cards={this.jobsOnsiteInterview}
          cardsRejecteds={this.jobsRejectedOnsiteInterview}
          details="..."
          rejectedsMessage= "rejected after interview(s)"
          ongoingsMessage= "ongoing application(s) at onsite interview"
        />
        <Column
          icon="../../src/assets/icons/offer.png"
          title="Offer "
          ongoingCount={this.jobsOffer.length }
          totalCount={this.jobsOffer.length + this.jobsRejectedOffer.length}
          cards={this.jobsOffer}
          cardsRejecteds={this.jobsRejectedOffer}
          details="..."
          rejectedsMessage= "you rejected their offer"
          ongoingsMessage= "waiting your response to offer"
        />
      </div>
    );
  }
}

export default Dashboard;