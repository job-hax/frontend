import React, {Component} from "react";
import { Card, CardRejected} from '../Card/Card.jsx';
import './style.scss'


class Column extends Component {
  renderCards() {
    return this.props.cards &&
      this.props.cards.map(card =>
        <Card key={card.id} card={card}/>);
  };

  renderCardsRejected() {
    return this.props.cardsRejected &&
      this.props.cardsRejected.map(cardRejected =>
        <CardRejected key={cardRejected.id} cardRejected={cardRejected}/>);
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
            ({this.props.count})
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

  columnFooter (lenght) {
    if (lenght < 5) {
      return (
        <div>
          <div>
            {this.props.rejectedsheader}
          </div>
          <div className="rejected-hidden" >
            {this.renderCardsRejected()}
          </div> 
        </div>
      ) 
    }
    else {
      return (
        <div className="rejected-bottom">
          <div >
            {this.props.rejectedsheader}
          </div>
          <div className="rejected-hidden" >
            {this.renderCardsRejected()}
          </div> 
        </div>
      )
    }
  }

  render() {
    return (
        <div className="column-container">
          <div>
            {this.columnHeader()}
          </div>
          <div className="cards-margin">
            {this.renderCards()}
          </div>
          <div>
            {this.columnFooter(this.props.count)}
          </div>
        </div>
    );
  }
}

export default Column;