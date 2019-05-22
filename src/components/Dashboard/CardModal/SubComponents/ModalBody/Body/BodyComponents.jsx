import React from "react";

import Company from "./BodyComponents/Company.jsx";
import Contacts from "./BodyComponents/Contacts.jsx";
import PositonReviews from "./BodyComponents/Reviews.jsx";
import Notes from "./BodyComponents/Notes.jsx";

class BodyComponents extends React.Component {
  constructor(props) {
    super(props);
  }

  displaySelector() {
    switch (this.props.displaying) {
      case "Company":
        return <Company card={this.props.card} />;
      case "Contacts":
        return <Contacts />;
      case "Reviews":
        return (
          <PositonReviews
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
