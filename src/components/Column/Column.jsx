import React, {Component} from "react";
import Card from '../Card/Card.jsx'

import './style.scss'

class Column extends Component {
  renderCards() {
    return this.props.cards &&
      this.props.cards.map(card =>
        <Card key={card.id} card={card}/>);
  };

  addJob() {
    return "Add Job"
  }

  render() {
    return (
      <div className="column-container">
        <div className="column-header">
          <div className="column-header column-icon">
            <img src={this.props.icon}/>
          </div>
          <div className="column-header column-title">
            {this.props.title}
          </div>
          <div className="column-header column-details">
            {this.props.details}
          </div>          
        </div>
        <div className="column-addjob">
          {this.addJob()}
        </div>
        <div>
          {this.renderCards()}
        </div>
      </div>
    );
  }
}

export default Column;