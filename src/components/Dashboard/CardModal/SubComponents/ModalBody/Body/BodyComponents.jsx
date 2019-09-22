import React from "react";

import JobDetails from "./BodyComponents/JobDetails.jsx";
import Contacts from "./BodyComponents/Contacts.jsx";
import Notes from "./BodyComponents/Notes.jsx";
import JobReviews from "./BodyComponents/JobReviews.jsx";

class BodyComponents extends React.Component {
  constructor(props) {
    super(props);
  }

  displaySelector() {
    switch (this.props.displaying) {
      case "Job Details":
        return (
          <JobDetails
            card={this.props.card}
            alert={this.props.alert}
            updateCard={this.props.updateCard}
            updateHeader={this.props.updateHeader}
          />
        );
      case "Contacts":
        return (
          <Contacts
            card={this.props.card}
            handleTokenExpiration={this.props.handleTokenExpiration}
            alert={this.props.alert}
          />
        );
      case "Reviews":
        return (
          <JobReviews
            card={this.props.card}
            handleTokenExpiration={this.props.handleTokenExpiration}
            alert={this.props.alert}
            setCompany={this.props.setCompany}
          />
        );
      case "Notes":
        return (
          <div className="modal-body main notes">
            <Notes
              card={this.props.card}
              handleTokenExpiration={this.props.handleTokenExpiration}
            />
          </div>
        );
    }
  }

  render() {
    return <div className="modal-body main">{this.displaySelector()}</div>;
  }
}

export default BodyComponents;
