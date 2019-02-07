import React, {Component} from "react";
import {Card} from '../Card/Card.jsx';
import './style.scss';
import {MIN_CARD_NUMBER_IN_COLUMN} from '../../utils/constants/constants.js'


class Column extends Component {

  constructor() {
    super();
    this.state = {
      isRejectedsShowing: false,
      isAddJobClicked: false,
    }
    this.toggleLists = this.toggleLists.bind(this);
    this.toggleAddJob = this.toggleAddJob.bind(this);
  }

  toggleLists () {
    this.setState(state => ({
      isRejectedsShowing: !state.isRejectedsShowing
    }));
  }

  toggleAddJob () {
    this.setState(state => ({
      isAddJobClicked: !state.isAddJobClicked
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
    return (
      !this.state.isAddJobClicked ? 
        <div className="column-addjob" onClick={this.toggleAddJob}>
          Add Job
        </div>
        : 
        <div>
          <div className="column-addjob-form">
            <form id="addjob" >
              <p contenteditable="true" className="addjob-company" id="company" >Enter Company Name</p>
              <h1 contenteditable="true" className="addjob-position" id="jobTitle" >Enter Job Title</h1>
            </form>
          </div>
          <div>
            <button className="column-addjob-button-cancel" onClick={this.toggleAddJob}>Cancel</button>
            <button className="column-addjob-button-addjob" onClick={this.toggleAddJob}>Add Job</button>
          </div> 
        </div>
          
    )
  }

  generateColumnHeader() {
    return (
    <div className="column-header-container"  style= {this.state.isAddJobClicked ? {height:180}:{}} >
      <div className="column-header">
        <div className="column-header column-icon">
          <img src={this.props.icon}/>
        </div>
        <div className="column-header column-title">
          {this.props.title}
          ({this.props.totalCount})
        </div>        
      </div>
      <div >
        {this.addJob()}
      </div>
    </div>
    )
  }
 
  renderIndicator(message) {
    return (
      <div className={this.state.isRejectedsShowing ? "ongoing-indicator" : "rejected-indicator"} onClick={this.toggleLists}>
        {this.state.isRejectedsShowing &&
          <button className="cards-switch-button">
            <img src="../../src/assets/icons/uparrow.png"/>
          </button>
        }
        <div>
          {this.state.isRejectedsShowing ? `Ongoing (${this.props.cards.length})` : `Rejected (${(this.props.totalCount - this.props.cards.length)})`}
        </div>
        <div className="column-indicator-details">
          {message}
        </div>
        {!this.state.isRejectedsShowing &&
          <div >
            <button className="cards-switch-button">
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
        <div >
          {this.generateColumnHeader()}
        </div>
        {this.state.isRejectedsShowing &&
          <div className="column-indicator-container">
            {this.renderIndicator(this.props.ongoingsMessage)}
          </div>
        }
        <div className={this.state.isAddJobClicked ? "column-card-container-short" : "column-card-container"} style={this.state.isRejectedsShowing ? {marginTop:"18px"} : {}}>
          {this.renderCards()}
        </div>
        {(this.props.totalCount - this.props.cards.length) > MIN_CARD_NUMBER_IN_COLUMN &&
          <div className="column-indicator-container">
            {this.state.isRejectedsShowing ? "" : this.renderIndicator(this.props.rejectedsMessage)}
          </div>
        } 
      </div>
    )
  }
}

export default Column;