import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { DragSource } from "react-dnd";
import classNames from "classnames";
import defaultLogo from "../../../assets/icons/JobHax-logo-black.svg";
import linkedInLogo from "../../../assets/icons/linkedInLogo.png";
import hiredComLogo from "../../../assets/icons/hiredComLogo.png";
import indeedLogo from "../../../assets/icons/indeedLogo.png";
import vetteryLogo from "../../../assets/icons/vetteryLogo.jpg";
import glassdoorLogo from "../../../assets/icons/glassdoorLogo.png";
import leverLogo from "../../../assets/icons/leverLogo.png";
import jobviteLogo from "../../../assets/icons/jobviteLogo.jpg";
import smartRecruiterLogo from "../../../assets/icons/smartRecruiterLogo.png";
import greenHouseLogo from "../../../assets/icons/greenHouseLogo.png";
import zipRecruiterLogo from "../../../assets/icons/zipRecruiterLogo.png";
import CardModal from "../CardModal/CardModal.jsx";

import "./style.scss";

const cardSpec = {
  beginDrag(props) {
    return props.card;
  },

  endDrag(props, monitor) {
    if (monitor.didDrop()) {
      return props.updateApplications(
        props.card,
        props.columnName,
        monitor.getDropResult().name
      );
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

class Card extends PureComponent {
  constructor() {
    super();
    this.state = {
      showModal: false,
      imageLoadError: true
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.updateCard = this.updateCard.bind(this);
  }

  toggleModal() {
    this.setState(({ showModal }) => ({
      showModal: !showModal
    }));
  }

  updateCard(newCompanyObject) {
    this.props.card.companyObject = newCompanyObject;
  }

  sourceLogoSelector(source) {
    if (source == null) return;
    if (source.value == "Hired.com") {
      return <img src={hiredComLogo} />;
    } else if (source.value == "LinkedIn") {
      return <img src={linkedInLogo} />;
    } else if (source.value == "Indeed") {
      return <img src={indeedLogo} />;
    } else if (source.value == "Vettery") {
      return <img src={vetteryLogo} />;
    } else if (source.value == "glassdoor") {
      return <img src={glassdoorLogo} />;
    } else if (source.value == "jobvite.com") {
      return <img src={jobviteLogo} />;
    } else if (source.value == "smartrecruiters.com") {
      return <img src={smartRecruiterLogo} />;
    } else if (source.value == "greenhouse.io") {
      return <img src={greenHouseLogo} />;
    } else if (source.value == "lever.co") {
      return <img src={leverLogo} />;
    } else if (source.value == "ziprecruiter.com") {
      return <img src={zipRecruiterLogo} />;
    }
  }

  renderCard() {
    const {
      card: {
        companyObject,
        position,
        isRejected,
        app_source,
        token,
        columnName,
        deleteJobFromList,
        moveToRejected,
        updateApplications,
        icon,
        id
      },
      isDragging
    } = this.props;

    const { showModal } = this.state;

    const cardClass = classNames({
      "card-container": true,
      "rejected-cards": isRejected,
      "--is_dragging": isDragging
    });

    return (
      <div>
        {showModal && (
          <CardModal
            token={token}
            columnName={columnName}
            toggleModal={this.toggleModal}
            deleteJobFromList={deleteJobFromList}
            moveToRejected={moveToRejected}
            updateApplications={updateApplications}
            icon={icon}
            id={id}
            updateCard={this.updateCard}
            alert={this.props.alert}
            {...this.props}
          />
        )}
        <div className={cardClass} onClick={this.toggleModal}>
          <div className="card-company-icon">
            {companyObject.cb_company_logo === null ? (
              <img src={companyObject.company_logo || defaultLogo} />
            ) : (
              <img src={companyObject.cb_company_logo} />
            )}
          </div>
          <div className="card-company-info">
            <div id="company" className="card-company-name">
              {companyObject.company}
            </div>
            <div id="jobTitle" className="card-job-position">
              {position.job_title}
            </div>
          </div>
          <div className="card-job-details">
            {this.sourceLogoSelector(app_source)}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      card: { isRejected },
      connectDragSource
    } = this.props;

    if (isRejected) {
      return this.renderCard();
    }
    return connectDragSource(this.renderCard());
  }
}

Card.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

export default DragSource("item", cardSpec, collect)(Card);
