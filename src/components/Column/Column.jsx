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
        <div className="column-title">
          {this.props.title}
        </div>
        <div>
          {this.renderCards()}
        </div>
      </div>
    );
  }
}

export default Column;