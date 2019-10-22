import React from "react";
import { Icon } from "antd";
import moment from "moment";

import {
  imageIcon,
  DATE_AND_TIME_FORMAT
} from "../../utils/constants/constants";
import { apiRoot } from "../../utils/constants/endpoints";

import "./style.scss";

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = { eventsList: [] };
  }

  generateEventCard() {
    const { event } = this.props;
    let day_locale = moment(event.event_date_start).format("DD");
    let month_locale = moment(event.event_date_start)
      .format("MMM")
      .toUpperCase();

    const headerImage = event.header_image ? (
      <img src={apiRoot + event.header_image} />
    ) : (
      imageIcon
    );
    return (
      <div
        className="event-card-container"
        onClick={() => this.props.setEventDetail(event.id)}
      >
        <div className="image">{headerImage}</div>
        <div className="date-box">
          <div className="month">{month_locale}</div>
          <div className="day">{day_locale}</div>
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
              {moment(event.event_date_start).format(DATE_AND_TIME_FORMAT)}
            </div>
          </div>
          <div className="footer">{event.attendee_count + " attendees"}</div>
        </div>
      </div>
    );
  }

  generateAddNewEventCard(style, content) {
    return (
      <div
        className="event-card-container"
        onClick={() => this.props.setEventDetail("add_new")}
        style={style}
      >
        {content}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.props.event === "add_new"
          ? this.generateAddNewEventCard(this.props.style, this.props.content)
          : this.generateEventCard()}
      </div>
    );
  }
}

export default Event;
