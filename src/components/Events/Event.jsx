import React from "react";

import "./style.scss";

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = { eventsList: [] };
  }

  generateEventCard() {
    const { event } = this.props;
    return <div className="event-card-container">{event.title}</div>;
  }

  render() {
    return <div>{this.generateEventCard()}</div>;
  }
}

export default Event;
