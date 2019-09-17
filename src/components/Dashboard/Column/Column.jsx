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

  renderCards(type) {
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

    if (type == "rejected") {
      return (
        <div style={{ margin: "15px 0px 0px 0px" }}>
          {cardsRejecteds &&
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
                addToSelectedJobApplicationsList={
                  this.props.addToSelectedJobApplicationsList
                }
                isSelected={card.isSelected}
              />
            ))}
        </div>
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
          addToSelectedJobApplicationsList={
            this.props.addToSelectedJobApplicationsList
          }
          isSelected={card.isSelected}
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
      totalCount,
      cards
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
          {/*<div className="column-header column-icon">
            <img src={this.props.icon} />
    </div>*/}
          <div className="column-header column-title">
            {title}
            {totalCount > MIN_CARD_NUMBER_IN_COLUMN && (
              <div style={{ marginLeft: "4px" }}>({cards.length})</div>
            )}
          </div>
        </div>
        {showJobInput && (
          <JobInput
            addNewApplication={addNewApplication}
            showInput={showJobInput}
            toggleJobInput={this.toggleJobInput}
            columnName={name}
            alert={this.props.alert}
            handleTokenExpiration={this.props.handleTokenExpiration}
          />
        )}
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

    const columnHeaderRejectedIndicatorClass = classNames({
      "column-indicator-container rejected-indicator": true
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
          <div className={columnHeaderRejectedIndicatorClass}>
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
      isLastColumn,
      addNewApplication,
      name
    } = this.props;

    const columnCardContainerClass = classNames({
      "column-card-container": true,
      "--short": showJobInput
    });

    const ongoingsContainerClass = classNames({
      "column-ongoings-container": true,
      "--single": !showRejectedCards,
      "--double": showRejectedCards,
      "--column-dropable": canDropCardInColumn && !isCardOverColumn,
      "--column-active": canDropCardInColumn && isCardOverColumn
    });

    const rejectedsContainerClass = classNames({
      "column-rejecteds-container": true,
      "--double": showRejectedCards
    });

    const columnContainerClass = classNames({
      "column-container": true
    });

    const expandArrowClass = classNames({
      "expand-arrow": true,
      "--horizontal-flip": showRejectedCards
    });

    return connectDropTarget(
      <div className="column-big-container">
        <div className={ongoingsContainerClass}>
          <div className={columnContainerClass}>
            {this.generateColumnHeader()}
            <div className="column-body-container">
              <div className={columnCardContainerClass}>
                {this.renderCards("ongoing")}
              </div>
              {!showJobInput && (
                <div
                  onClick={() => this.setState({ showJobInput: !showJobInput })}
                  className="job-input-button"
                >
                  <div className="button-inside">+</div>
                </div>
              )}
            </div>
          </div>
        </div>
        {totalCount - cards.length > MIN_CARD_NUMBER_IN_COLUMN && (
          <div className={rejectedsContainerClass}>
            <div
              onClick={() =>
                this.setState({ showRejectedCards: !showRejectedCards })
              }
              className="rejecteds-button"
            >
              <div className="button-inside">
                Rejected ({totalCount - cards.length})
              </div>
              <div>
                <img
                  className={expandArrowClass}
                  src="../../src/assets/icons/ExpandArrow@3x.png"
                />
              </div>
            </div>
            {showRejectedCards && (
              <div className="column-container">
                <div className="column-body-container">
                  <div className="column-card-container">
                    {this.renderCards("rejected")}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

{
  /*
      <div className="column-big-container">
        <div className="column-medium-container">
          <div className={columnContainerClass}>
            {this.generateColumnHeader()}
            {showRejectedCards && <div>{this.renderIndicator(message)}</div>}
            {showRejectedCards ? (
              <div className={columnRejectedCardContainerClass}>
                {this.renderCards()}
              </div>
            ) : (
              <div className={columnCardContainerClass}>
                {this.renderCards()}
              </div>
            )}
            {totalCount - cards.length > MIN_CARD_NUMBER_IN_COLUMN && (
              <div>{!showRejectedCards && this.renderIndicator(message)}</div>
            )}
          </div>
        </div>
      </div>

*/
}

Column.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isCardOverColumn: PropTypes.bool.isRequired,
  canDropCardInColumn: PropTypes.bool.isRequired
};

export default DropTarget("item", columnSpec, collect)(Column);
