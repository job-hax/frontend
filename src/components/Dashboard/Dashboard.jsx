import React, {Component} from "react";
import Column from '../Column/Column.jsx';
import {fetchApi} from '../../utils/api/fetch_api'

import './style.scss'

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jobsApplied: [],
      jobsInterview: [],
      jobsOffer: [],
      jobsRejected: [],
    };

    this.jobsApplied = [];
    this.jobsInterview = [];
    this.jobsOffer = [];
    this.jobsRejected = [];
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
        case 'applied':
          this.jobsApplied.push(application);
          break;
        case 'interview':
          this.jobsInterview.push(application);
          break;
        case 'offer':
          this.jobsOffer.push(application);
          break;
        case 'rejected':
          this.jobsRejected.push(application);
          break;
        default:
      }
    }
    this.setState({
      jobsApplied: this.jobsApplied,
      jobsInterview: this.jobsInterview,
      jobsOffer: this.jobsOffer,
      jobsRejected: this.jobsRejected
    });
  }


  render() {
    return (
      <div className="dashboard-container">
        <Column
          icon="../../src/assets/icons/applied.png"
          title="Applied"
          cards={this.jobsApplied}
          details="..."
        />
        <Column
          icon="../../src/assets/icons/interview.png"
          title="Interview"
          cards={this.jobsInterview}
          details="..."
        />
        <Column
          icon="../../src/assets/icons/offer.png"
          title="Offer"
          cards={this.jobsOffer}
          details="..."
        />
        <Column
          icon="../../src/assets/icons/rejected.png"
          title="Rejected"
          cards={this.jobsRejected}
          details="..."
        />
      </div>
    );
  }
}

export default Dashboard;