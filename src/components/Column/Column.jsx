import React, {Component} from "react";
import { Card} from '../Card/Card.jsx';
import './style.scss';
import {MAX_CARD_NUMBER_IN_COLUMN} from '../../utils/constants/constants.js'


class Column extends Component {

  constructor() {
    super();
    this.state = {isRejectedsShowing: false}
    this.toggleLists = this.toggleLists.bind(this);
  }

  toggleLists () {
    this.setState(state => ({
      isRejectedsShowing: !state.isRejectedsShowing
    }));
  }

  renderCards() {
    if(this.state.isRejectedsShowing){
      return this.props.cardsRejecteds &&
        this.props.cardsRejecteds.map(card =>
          <Card key={card.id} card={card}/>);
    }
    return this.props.cards &&
      this.props.cards.map(card =>
        <Card key={card.id} card={card}/>);
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
    return (
      <div className={this.state.isRejectedsShowing ? "rejected-header" : "column-rejected-cards-header"} onClick={this.toggleLists}>
        {this.state.isRejectedsShowing &&
          <div className={this.state.isRejectedsShowing ? "" : "hidden"}>
            <button className="rejecteds-show-button">
              <img src="../../src/assets/icons/uparrow.png"/>
            </button>
          </div>
        }
        <div>
          {this.state.isRejectedsShowing ? `Ongoing (${this.props.cards.length})` : `Rejected (${(this.props.totalCount - this.props.cards.length)})`}
        </div>
        <div className="rejected-details">
          {message}
        </div>
        {!this.state.isRejectedsShowing &&
          <div >
            <button className="rejecteds-show-button">
              <img src="../../src/assets/icons/downarrow.png"/>
            </button>
          </div>
        }
      </div>
    )  
  }

  render() {
    return (
      <div className="column-container">
        <div>
          {this.generateColumnHeader()}
        </div>
        <div className= {this.state.isRejectedsShowing ? "column-rejected-cards-header" : ""}>
          <div >
            {this.state.isRejectedsShowing ? this.renderIndicator(this.props.ongoingsMessage) : ""}
          </div>
          <div className= {this.state.isRejectedsShowing ? "rejected-visible" : "cards-margin" } >
            {this.renderCards()}
          </div> 
        </div>
        <div className={this.state.isRejectedsShowing ? "" : (this.props.cards.length > MAX_CARD_NUMBER_IN_COLUMN ? "rejected-bottom" : "") }>
          {this.state.isRejectedsShowing ? "" : this.props.title != "To Apply " ? this.renderIndicator(this.props.rejectedsMessage) : ""}
        </div>
      </div>
    )
  }
}

export default Column;