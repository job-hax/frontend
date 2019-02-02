import React, {Component} from "react";
import { Card} from '../Card/Card.jsx';
import './style.scss'


class Column extends Component {

  constructor() {
    super();
    this.state = {isRejectedsShowing: false}

    this.toggleLists = this.toggleLists.bind(this);
  }

  toggleLists () {
    console.log('test : ' + this.state.isRejectedsShowing);
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
    else{
      return this.props.cards &&
        this.props.cards.map(card =>
          <Card key={card.id} card={card}/>);
    }
  };

  addJob() {
    return "Add Job"
  }

  columnHeader() {
    return (
    <div className="column-header-container">
        <div className="column-header">
          <div className="column-header column-icon">
            <img src={this.props.icon}/>
          </div>
          <div className="column-header column-title">
            {this.props.title}
            ({this.props.totalcount})
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
      <div className={this.state.isRejectedsShowing ? "rejected-header" : "column-rejected-cards-header"}>
        <div className={this.state.isRejectedsShowing ? "" : "hidden"}>
          <button className="rejecteds-show-button" onClick={this.toggleLists} >
            <img src="../../src/assets/icons/uparrow.png"/>
          </button>
        </div>
        <div>
          {this.state.isRejectedsShowing ? "On Going (" + this.props.cards.length + ")" : "Rejected (" + (this.props.totalcount - this.props.cards.length) + ")"}
        </div>
        <div className="rejected-details">
          {message}
        </div>
        <div className={this.state.isRejectedsShowing ? "hidden" : ""}>
          <button className="rejecteds-show-button" onClick={this.toggleLists} >
            <img src="../../src/assets/icons/downarrow.png"/>
          </button>
        </div>
      </div>
    )  
  }

  render() {
    return (
      <div className="column-container">
        <div>
          {this.columnHeader()}
        </div>
        <div className= {this.state.isRejectedsShowing ? "column-rejected-cards-header" : ""}>
          <div >
            {this.state.isRejectedsShowing ? this.renderIndicator(this.props.ongoingsMessage) : ""}
          </div>
          <div className= {this.state.isRejectedsShowing ? "rejected-visible" : "cards-margin" } >
            {this.renderCards()}
          </div> 
        </div>
        <div className={this.state.isRejectedsShowing ? "" : (this.props.cards.length < 6 ? "" : "rejected-bottom") }>
          {this.state.isRejectedsShowing ? "" : this.props.title != "To Apply " ? this.renderIndicator(this.props.rejectedsMessage) : ""}
        </div>
      </div>
    )
  }
}

export default Column;