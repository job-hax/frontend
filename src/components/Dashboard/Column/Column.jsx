import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { DropTarget } from "react-dnd";
import Card from "../Card/Card.jsx";
import JobInput from "../JobInput/JobInput.jsx";
import { MIN_CARD_NUMBER_IN_COLUMN } from "../../../utils/constants/constants.js";

import "./style.scss";

const columnSpec = {
  drop(props) {
    return {
      name: props.name
    };
  }
};

let collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isCardOverColumn: monitor.isOver(),
    canDropCardInColumn: monitor.canDrop()
  };
};

class Column extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRejectedCards: false,
      showJobInput: false
    };
    this.toggleLists = this.toggleLists.bind(this);
    this.toggleJobInput = this.toggleJobInput.bind(this);
  }

  toggleLists() {
    this.setState(state => ({
      showRejectedCards: !state.showRejectedCards
    }));
  }

  toggleJobInput() {
    this.setState(state => ({
      showJobInput: !state.showJobInput
    }));
  }

  renderCards() {
    const {
      cards,
      cardsRejecteds,
      name,
      updateApplications,
      deleteJobFromList,
      moveToRejected,
      handleTokenExpiration,
      icon,
      id,
      alert
    } = this.props;

    if (this.state.showRejectedCards) {
      return (
        cardsRejecteds &&
        cardsRejecteds.map(card => (
          <Card
            handleTokenExpiration={handleTokenExpiration}
            key={card.id}
            card={card}
            columnName={name}
            deleteJobFromList={deleteJobFromList}
            moveToRejected={moveToRejected}
            updateApplications={updateApplications}
            icon={icon}
            id={id}
            alert={alert}
          />
        ))
      );
    }
    return (
      cards &&
      cards.map(card => (
        <Card
          handleTokenExpiration={handleTokenExpiration}
          columnName={name}
          key={card.id}
          card={card}
          updateApplications={updateApplications}
          deleteJobFromList={deleteJobFromList}
          moveToRejected={moveToRejected}
          updateApplications={updateApplications}
          icon={icon}
          id={id}
          alert={alert}
        />
      ))
    );
  }

  generateColumnHeader() {
    const {
      addNewApplication,
      canDropCardInColumn,
      isCardOverColumn,
      name,
      title,
      totalCount
    } = this.props;

    const { showJobInput } = this.state;

    const columnHeaderClass = classNames({
      "column-header-container": true,
      "no-card": totalCount === MIN_CARD_NUMBER_IN_COLUMN,
      "add-job-height": showJobInput,
      "--column-dropable": canDropCardInColumn && !isCardOverColumn,
      "--column-active": canDropCardInColumn && isCardOverColumn
    });

    return (
      <div className={columnHeaderClass}>
        <div className="column-header">
          <div className="column-header column-icon">
            <img src={this.props.icon} />
          </div>
          <div className="column-header column-title">
            {title}
            {totalCount > MIN_CARD_NUMBER_IN_COLUMN && (
              <div style={{ marginLeft: "4px" }}>({totalCount})</div>
            )}
          </div>
        </div>
        <div>
          <JobInput
            addNewApplication={addNewApplication}
            showInput={showJobInput}
            toggleJobInput={this.toggleJobInput}
            columnName={name}
            alert={this.props.alert}
            handleTokenExpiration={this.props.handleTokenExpiration}
          />
        </div>
      </div>
    );
  }

  renderIndicator(message) {
    const {
      cards,
      totalCount,
      isCardOverColumn,
      canDropCardInColumn
    } = this.props;

    const { showRejectedCards } = this.state;

    const columnHeaderClass = classNames({
      "column-indicator-container": true,
      "--column-dropable": canDropCardInColumn && !isCardOverColumn,
      "--column-active": canDropCardInColumn && isCardOverColumn
    });

    const columnHeaderOngoingIndicatorClass = classNames({
      "column-indicator-container ongoing-indicator": true
    });

    return (
      <div onClick={this.toggleLists}>
        <div className={columnHeaderClass}>
          <div>
            {showRejectedCards
              ? `ONGOING (${cards.length})`
              : `REJECTED (${totalCount - cards.length})`}
          </div>
          {!showRejectedCards && (
            <div className="column-indicator-details">{message}</div>
          )}
          <img
            className="cards-switch-button"
            src="../../src/assets/icons/ExpandArrow@3x.png"
          />
        </div>
        {showRejectedCards && (
          <div className={columnHeaderOngoingIndicatorClass}>
            <div>REJECTED ({totalCount - cards.length})</div>
            <div className="column-indicator-details">{message}</div>
          </div>
        )}
      </div>
    );
  }

  render() {
    const { showJobInput, showRejectedCards } = this.state;

    const {
      canDropCardInColumn,
      cards,
      connectDropTarget,
      isCardOverColumn,
      message,
      totalCount,
      isLastColumn
    } = this.props;

    const columnCardContainerClass = classNames({
      "column-card-container": true,
      middle: showJobInput,
      "--column-dropable": canDropCardInColumn && !isCardOverColumn,
      "--column-active": canDropCardInColumn && isCardOverColumn
    });

    const columnRejectedCardContainerClass = classNames({
      "column-card-container": true,
      shortest: showJobInput,
      short: !showJobInput
    });

    const columnContainerClass = classNames({
      "column-container": true
    });

    return connectDropTarget(
      <div className={columnContainerClass}>
        <div>{this.generateColumnHeader()}</div>
        {showRejectedCards && <div>{this.renderIndicator(message)}</div>}
        {showRejectedCards ? (
          <div className={columnRejectedCardContainerClass}>
            {this.renderCards()}
          </div>
        ) : (
          <div className={columnCardContainerClass}>{this.renderCards()}</div>
        )}
        {totalCount - cards.length > MIN_CARD_NUMBER_IN_COLUMN && (
          <div>{!showRejectedCards && this.renderIndicator(message)}</div>
        )}
      </div>
    );
  }
}

Column.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isCardOverColumn: PropTypes.bool.isRequired,
  canDropCardInColumn: PropTypes.bool.isRequired
};

export default DropTarget("item", columnSpec, collect)(Column);
