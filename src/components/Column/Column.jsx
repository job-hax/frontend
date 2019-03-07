import React, {Component} from "react";
import PropTypes from 'prop-types';
import {DropTarget} from "react-dnd";
import Card from '../Card/Card.jsx';
import {MAX_CARD_NUMBER_IN_COLUMN} from '../../utils/constants/constants.js'

import './style.scss';

const columnSpec = {
  drop() {
    return {
      name: 'column'
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
      isRejectedsShowing: false
    };
    this.toggleLists = this.toggleLists.bind(this);
  }

  toggleLists() {
    this.setState(state => ({
      isRejectedsShowing: !state.isRejectedsShowing
    }));
  }

  renderCards() {
    const {
      cardsRejecteds,
      cards
    } = this.props;

    if (this.state.isRejectedsShowing) {
      return cardsRejecteds &&
        cardsRejecteds.map(card =>
          <Card key={card.id} card={card}/>
        );
    }
    return cards &&
      cards.map(card =>
        <Card key={card.id} card={card}/>
      );
  };

  addJob() {
    return "Add Job"
  }

  generateColumnHeader() {
    return (
      <div className="column-header-container">
        <div className="column-header">
          <div className="column-header column-icon">
            <img src={this.props.icon}/>
          </div>
          <div className="column-header column-title">
            {this.props.title}
            ({this.props.totalCount})
          </div>
          <div className="column-header column-details">
            {this.props.details}
          </div>
        </div>
        <div className="column-addjob">
          {this.addJob()}
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
      <div className={isRejectedsShowing ? "rejected-header" : "column-rejected-cards-header"}
           onClick={this.toggleLists}>
        {
          isRejectedsShowing &&
          <div className={isRejectedsShowing ? "" : "hidden"}>
            <button className="rejecteds-show-button">
              <img src="../../src/assets/icons/uparrow.png"/>
            </button>
          </div>
        }
        <div>
          {
            isRejectedsShowing ?
              `Ongoing (${cards.length})` :
              `Rejected (${totalCount - cards.length})`
          }
        </div>
        <div className="rejected-details">
          {message}
        </div>
        {
          !isRejectedsShowing &&
          <div>
            <button className="rejecteds-show-button">
              <img src="../../src/assets/icons/downarrow.png"/>
            </button>
          </div>
        }
      </div>
    )
  }

  render() {
    const {isRejectedsShowing} = this.state;
    const {
      canDropCardInColumn,
      cards,
      connectDropTarget,
      isCardOverColumn,
      ongoingsMessage,
      rejectedsMessage,
      title
    } = this.props;

    const isColumnActive = canDropCardInColumn && isCardOverColumn;

    return connectDropTarget(
      <div className={`column-container ${isColumnActive && 'column-active'}`}>
        <div>
          {this.generateColumnHeader()}
        </div>
        <div className={isRejectedsShowing ? "column-rejected-cards-header" : ""}>
          <div>
            {isRejectedsShowing ? this.renderIndicator(ongoingsMessage) : ""}
          </div>
          <div className={isRejectedsShowing ? "rejected-visible" : "cards-margin"}>
            {this.renderCards()}
          </div>
        </div>
        <div
          className={
            isRejectedsShowing ? "" :
              (cards.length > MAX_CARD_NUMBER_IN_COLUMN ?
                "rejected-bottom" : "")
          }>
          {
            isRejectedsShowing ? "" :
              title !== "To Apply " ?
                this.renderIndicator(rejectedsMessage) :
                ""
          }
        </div>
      </div>
    )
  }
}

Column.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isCardOverColumn: PropTypes.bool.isRequired,
  canDropCardInColumn: PropTypes.bool.isRequired
};

export default DropTarget('snacks', columnSpec, collect)(Column);