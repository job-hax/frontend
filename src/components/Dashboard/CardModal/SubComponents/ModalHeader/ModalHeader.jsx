import React from "react";

import defaultLogo from "../../../../../assets/icons/JobHax-logo-black.svg";
import MoveOptions from "./MoveOptions.jsx";

class ModalHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      updateHeader: this.props.updateHeader,
      card: this.props.card
    };
  }

  componentDidUpdate() {
    this.state.updateHeader &&
      this.setState({
        card: this.props.card,
        updateHeader: !this.props.updateHeader
      });
  }

  generateModalHeader() {
    const { card } = this.state;
    return (
      <div className="modal-header-container">
        <div className="modal-header">
          <div className="job-card-info-container">
            <div className="modal-company-icon">
              {card.companyObject.cb_company_logo == null ? (
                <img src={card.companyObject.company_logo || defaultLogo} />
              ) : (
                <img src={card.companyObject.cb_company_logo} />
              )}
            </div>
            <div className="header-text">
              <div className="header-text company-name">
                {
                  card.companyObject.company
                    .split(",")[0]
                    .split("-")[0]
                    .split("(")[0]
                }
              </div>
              <div className="header-text job-title">
                {
                  card.position.job_title
                    .split(",")[0]
                    .split("-")[0]
                    .split("(")[0]
                }
              </div>
            </div>
          </div>
          <MoveOptions
            showOptions={this.props.showOptions}
            card={this.props.card}
            icon={this.props.icon}
            id={this.props.id}
            columnName={this.props.columnName}
            deleteJobFromList={this.props.deleteJobFromList}
            moveToRejected={this.props.moveToRejected}
            updateApplications={this.props.updateApplications}
            handleTokenExpiration={this.props.handleTokenExpiration}
          />
        </div>
      </div>
    );
  }

  render() {
    return <div>{this.generateModalHeader()}</div>;
  }
}

export default ModalHeader;
