import React from "react";
import { Icon } from "antd";

import "./style.scss";
import { makeTimeBeautiful } from "../../utils/constants/constants";

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = { eventsList: [] };
  }

  generateEventCard() {
    const { event } = this.props;
    let time = makeTimeBeautiful(event.event_date_start, "dateandtime");
    return (
      <div
        className="event-card-container"
        onClick={() => this.props.setEventDetail(event.id)}
      >
        <div className="image">
          <img src={"https://backend.jobhax.com" + event.header_image} />
        </div>
        <div className="date-box">
          <div className="month">{time.split("-")[1].toUpperCase()}</div>
          <div className="day">{time.split("-")[0]}</div>
        </div>
        <div className="body-container">
          <div className="body">
            <div className="type">{event.event_type.name.toUpperCase()}</div>
            <div className="title">{event.title}</div>
            <div className="snippet">{event.short_description}</div>
            <div className="no-data">
              <Icon
                type="schedule"
                style={{ fontSize: "120%", marginRight: 8 }}
              />
              {time}
            </div>
          </div>
          <div className="footer">
            {event.attendee_list.length + " attendees"}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return <div>{this.generateEventCard()}</div>;
  }
}

export default Event;
