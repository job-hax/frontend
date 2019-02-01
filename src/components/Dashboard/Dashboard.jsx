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

  rejectedsheader(count, message) {
    return (
      <div className="column-rejectedcardsheader">
        <div>
          Rejected ({count})
        </div>
        <div className="rejected-details">
          {message}
        </div>
        <div>
          <img src="../../src/assets/icons/downarrow.png"/>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="dashboard-container">
        <Column
          icon="../../src/assets/icons/toapply.png"
          title="To Apply "
          count={this.jobsToApply.length}
          cards={this.jobsToApply}
          details="..."
        />
        <Column
          icon="../../src/assets/icons/applied2.png"
          title="Applied "
          count={this.jobsApplied.length}
          cards={this.jobsApplied}
          cardsRejected={this.jobsRejectedApplied}
          details="..."
          rejectedsheader={this.rejectedsheader(this.jobsRejectedApplied.length, "rejected without any interview")}
        />
        <Column
          icon="../../src/assets/icons/phonescreen.png"
          title="Phone Screen "
          count={this.jobsPhoneScreen.length}
          cards={this.jobsPhoneScreen}
          cardsRejected={this.jobsRejectedPhoneScreen}
          details="..."
          rejectedsheader={ this.rejectedsheader(this.jobsRejectedPhoneScreen.length, "rejected after phone screen(s)")}
        />
        <Column
          icon="../../src/assets/icons/onsiteinterview.png"
          title="Onsite Interview "
          count={this.jobsOnsiteInterview.length}
          cards={this.jobsOnsiteInterview}
          cardsRejected={this.jobsRejectedOnsiteInterview}
          details="..."
          rejectedsheader={ this.rejectedsheader(this.jobsRejectedOnsiteInterview.length, "rejected after interview(s)")}
        />
        <Column
          icon="../../src/assets/icons/offer.png"
          title="Offer "
          count={this.jobsOffer.length}
          cards={this.jobsOffer}
          cardsRejected={this.jobsRejectedOffer}
          details="..."
          rejectedsheader={ this.rejectedsheader(this.jobsRejectedOffer.length, "you rejected their offer")}
        />
      </div>
    );
  }
}

export default Dashboard;