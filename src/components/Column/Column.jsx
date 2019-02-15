import React, {Component} from "react";
import classNames from 'classnames';
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
        <div className="column-addJob" onClick={this.toggleAddJob}>
          +
        </div>
        : 
        <div>
          <div>
            <form className="column-addJob-form" id="addJob" >
              <h1 contentEditable="true" className="addJob-company" id="company" >Company Name</h1>
              <h1 contentEditable="true" className="addJob-position" id="jobTitle" >Job Title</h1>
            </form>
          </div>
          <div>
            <button className="column-addJob-form-button" onClick={this.toggleAddJob}>Cancel</button>
            <button className="column-addJob-form-button addJob" onClick={this.toggleAddJob}>Add Job</button>
          </div> 
        </div>
          
    )
  }

  generateColumnHeader() {

    const columnHeaderClass = classNames({
      'column-header-container': true,
      'no-card': this.props.totalCount === MIN_CARD_NUMBER_IN_COLUMN,
      'add-job-height' : this.state.isAddJobClicked
      });

    return (
    <div className={columnHeaderClass} >
      <div className="column-header">
        <div className="column-header column-icon">
          <img src={this.props.icon}/>
        </div>
        <div className="column-header column-title">
          {this.props.title}
          {this.props.totalCount > MIN_CARD_NUMBER_IN_COLUMN &&
            <div style={{marginLeft:"4px"}}>
              ({this.props.totalCount})  
            </div>
          }
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
      <div onClick={this.toggleLists}>
        <div className="column-indicator-container">
          <div>
            {this.state.isRejectedsShowing ? `ONGOING (${this.props.cards.length})` : `REJECTED (${(this.props.totalCount - this.props.cards.length)})`}
          </div>
          {!this.state.isRejectedsShowing &&
            <div className="column-indicator-details">
              {message}
            </div>
          }
          <img className="cards-switch-button" src="../../src/assets/icons/ExpandArrow@3x.png"/>
        </div> 
        {this.state.isRejectedsShowing &&
          <div className="column-indicator-container ongoing-indicator">
            <div>
              REJECTED ({(this.props.totalCount - this.props.cards.length)})
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
    return (
      <div className="column-container">
        <div>
          {this.generateColumnHeader()}
        </div>
        {this.state.isRejectedsShowing &&
          <div>
            {this.renderIndicator(this.props.message)}
          </div>
        }
        {this.state.isRejectedsShowing ?
        <div   className={this.state.isAddJobClicked ? "column-card-container shortest" : "column-card-container short"}>
          {this.renderCards()}
        </div>
        :
        <div   className={this.state.isAddJobClicked ? "column-card-container middle" : "column-card-container"}>
          {this.renderCards()}
        </div>
        }
        {(this.props.totalCount - this.props.cards.length) > MIN_CARD_NUMBER_IN_COLUMN &&
          <div>
            {!this.state.isRejectedsShowing && this.renderIndicator(this.props.message)}
          </div>
        } 
      </div>
    )
  }
}

export default Column;