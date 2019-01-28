import React, {Component} from "react";
import Card from '../Card/Card.jsx'

import './style.scss'

class Column extends Component {
  renderCards() {
    if (this.props.cards) {
      return this.props.cards.map((card) => {
        return <Card key={card.id} card={card}/>
      });
    }
  };

  render() {
    return (
      <div className="column-container">
        <div className="column-header">
          <div className="column-header icon">
            <img src= {this.props.icon}></img>
          </div>
          <div className="column-header title">
            {this.props.title}
          </div>
          <div className="column-header details">
            {this.props.details}
          </div>          
        </div>
        <div>
          {this.renderCards()}
        </div>
      </div>
    );
  }
}

export default Column;