import React, {Component} from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {DropTarget} from "react-dnd";
import Card from '../Card/Card.jsx';
import JobInput from '../JobInput/JobInput.jsx';
import {MIN_CARD_NUMBER_IN_COLUMN} from '../../utils/constants/constants.js'

import './style.scss';

const columnSpec = {
  drop(props) {
    return {
      name: props.name
    }
  }
};

let collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isCardOverColumn: monitor.isOver(),
    canDropCardInColumn: monitor.canDrop()
  }
};

class Column extends Component {
  constructor() {
    super();
    this.state = {
      isRejectedsShowing: false,
      isAddJobClicked: false,
    };
    this.toggleLists = this.toggleLists.bind(this);
    this.toggleAddJob = this.toggleAddJob.bind(this);
  }

  toggleLists() {
    this.setState(state => ({
      isRejectedsShowing: !state.isRejectedsShowing
    }));
  }

  toggleAddJob() {
    this.setState(state => ({
      isAddJobClicked: !state.isAddJobClicked
    }));
  }

  renderCards() {
    const {
      cardsRejecteds,
      cards,
      name,
      updateApplications
    } = this.props;

    if (this.state.isRejectedsShowing) {
      return cardsRejecteds &&
        cardsRejecteds.map(card =>
          <Card
            key={card.id}
            card={card}
          />
        );
    }
    return cards &&
      cards.map(card =>
        <Card
          columnName={name}
          key={card.id}
          card={card}
          updateApplications={updateApplications}
        />
      );
  };

  generateColumnHeader() {
    const {
      title,
      totalCount
    } = this.props;

    const {isAddJobClicked} = this.state;

    const columnHeaderClass = classNames({
      'column-header-container': true,
      'no-card': totalCount === MIN_CARD_NUMBER_IN_COLUMN,
      'add-job-height': isAddJobClicked
    });

    return (
      <div className={columnHeaderClass}>
        <div className="column-header">
          <div className="column-header column-icon">
            <img src={this.props.icon}/>
          </div>
          <div className="column-header column-title">
            {title}
            {
              totalCount > MIN_CARD_NUMBER_IN_COLUMN &&
              <div style={{marginLeft: "4px"}}>
                ({totalCount})
              </div>
            }
          </div>
        </div>
        <div>
          {
            <JobInput showInput={this.state.isAddJobClicked}/>
          }
        </div>
      </div>
    )
  }

  renderIndicator(message) {
    const {
      cards,
      totalCount
    } = this.props;

    const {isRejectedsShowing} = this.state;

    return (
      <div onClick={this.toggleLists}>
        <div className="column-indicator-container">
          <div>
            {
              isRejectedsShowing ?
                `ONGOING (${cards.length})` :
                `REJECTED (${(totalCount - cards.length)})`
            }
          </div>
          {
            !isRejectedsShowing &&
            <div className="column-indicator-details">
              {message}
            </div>
          }
          <img className="cards-switch-button" src="../../src/assets/icons/ExpandArrow@3x.png"/>
        </div>
        {isRejectedsShowing &&
        <div className="column-indicator-container ongoing-indicator">
          <div>
            REJECTED ({(totalCount - cards.length)})
          </div>
          <div className="column-indicator-details">
            {message}
          </div>
        </div>
        }
      </div>
    )
  }

  render() {
    const {
      isAddJobClicked,
      isRejectedsShowing
    } = this.state;

    const {
      canDropCardInColumn,
      cards,
      connectDropTarget,
      isCardOverColumn,
      message,
      ongoingsMessage,
      rejectedsMessage,
      title,
      totalCount
    } = this.props;

    const columnCardContainerClass = classNames({
      'column-card-container': true,
      'middle': isAddJobClicked,
      '--column-dropable': canDropCardInColumn && !isCardOverColumn,
      '--column-active': canDropCardInColumn && isCardOverColumn,
    });

    const columnRejectedCardContainerClass = classNames({
      'column-card-container': true,
      'shortest': isAddJobClicked,
      'short': !isAddJobClicked
    });

    return connectDropTarget(
      <div className="column-container">
        <div>
          {this.generateColumnHeader()}
        </div>
        {isRejectedsShowing &&
        <div>
          {this.renderIndicator(message)}
        </div>
        }
        {
          isRejectedsShowing ?
            <div
              className={columnRejectedCardContainerClass}>
              {this.renderCards()}
            </div>
            :
            <div className={columnCardContainerClass}>
              {this.renderCards()}
            </div>
        }
        {
          (totalCount - cards.length) > MIN_CARD_NUMBER_IN_COLUMN &&
          <div>
            {
              !isRejectedsShowing &&
              this.renderIndicator(message)
            }
          </div>
        }
      </div>
    )
  }
}

Column.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isCardOverColumn: PropTypes.bool.isRequired,
  canDropCardInColumn: PropTypes.bool.isRequired
};

export default DropTarget('item', columnSpec, collect)(Column);