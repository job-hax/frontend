import React from "react";
import { Redirect } from "react-router-dom";
import { Icon, Button, Affix, Tag } from "antd";
import parse from "html-react-parser";
import moment from "moment";

import {
  USER_TYPES,
  imageIcon,
  LONG_DATE_FORMAT
} from "../../utils/constants/constants";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import { apiRoot, EVENTS } from "../../utils/constants/endpoints";
import Map from "../Metrics/SubComponents/Map/Map.jsx";

import "./style.scss";

class EventDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
      user_type: this.props.cookie("get", "user_type"),
      isLinkDisplaying: false,
      attendance: this.props.event.attended
    };
  }

  async postAttendeeRequest(answer) {
    await this.props.handleTokenExpiration("event postData");
    let config = { method: "POST" };
    let newUrl = EVENTS + this.props.event.id + "/" + answer + "/";
    axiosCaptcha(newUrl, config, false).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success == true) {
          let attend = answer == "attend" ? true : false;
          this.setState({ attendance: attend });
        } else {
          IS_CONSOLE_LOG_OPEN &&
            console.log(response, response.data.error_message);
          this.props.alert(
            5000,
            "error",
            "Error: " + response.data.error_message
          );
        }
      }
    });
  }

  generateAttendance() {
    const { event } = this.props;
    return (
      <div className="attendance-container">
        <div className="attendance">
          <div className="question-container">
            <div className="question">Are you going?</div>
            <div className="attendee-amount">
              {this.state.attendance == true
                ? "You are going!"
                : event.attendee_count == 0
                ? "Be the first attendant!"
                : event.attendee_count + " people going"}
            </div>
          </div>
          <div className="answer-container">
            <Button
              type="primary"
              disabled={this.state.attendance}
              style={{ width: 160, marginRight: 12 }}
              onClick={() => this.postAttendeeRequest("attend")}
            >
              <Icon type="check" />
            </Button>
            <Button
              type="primary"
              disabled={!this.state.attendance}
              style={{ width: 160 }}
              onClick={() => this.postAttendeeRequest("leave")}
            >
              <Icon type="close" />
            </Button>
          </div>
          <div
            className="share-container"
            onMouseEnter={() => this.setState({ isLinkDisplaying: true })}
            onMouseLeave={() => this.setState({ isLinkDisplaying: false })}
          >
            {this.state.isLinkDisplaying == false
              ? "Share Link"
              : window.location.port
              ? window.location.hostname +
                ":" +
                window.location.port +
                "/events?id=" +
                event.id
              : window.location.hostname + "/events?id=" + event.id}
          </div>
        </div>
      </div>
    );
  }

  generateEventHeader() {
    const { event } = this.props;
    let photoUrl =
      event.host_user.profile_photo != ("" || null)
        ? apiRoot + event.host_user.profile_photo
        : "../../../src/assets/icons/User@3x.png";

    let start_date_locale = moment(event.event_date_start).format(
      LONG_DATE_FORMAT
    );
    let day_locale = moment(event.event_date_start).format("DD");
    let month_locale = moment(event.event_date_start)
      .format("MMM")
      .toUpperCase();

    return (
      <div className="event-header">
        <div className="event-datebox">
          <div className="day">{day_locale}</div>
          <div className="month">{month_locale}</div>
        </div>
        <div className="event-info">
          <div className="event-date">{start_date_locale}</div>
          <div className="title">{event.title}</div>
          <div className="host-info">
            <div className="host-photo">
              <img src={photoUrl} />
            </div>
            <div className="name">
              <div>Hosted by</div>
              <div className="host-name">
                {event.host_user.first_name + " " + event.host_user.last_name}
              </div>
            </div>
          </div>
          {event.event_type && (
            <Tag color="geekblue" style={{ margin: "4px 0px 0px 60px" }}>
              {event.event_type.name.toUpperCase()}
            </Tag>
          )}
        </div>
        {window.screen.availWidth > 1200 &&
          window.innerHeight > 600 &&
          this.generateAttendance()}
      </div>
    );
  }

  generateAttendeeCard(attendee) {
    let photoUrl =
      attendee.user.profile_photo != ("" || null)
        ? apiRoot + attendee.user.profile_photo
        : "../../../src/assets/icons/User@3x.png";
    return (
      <div className="attendee-card-container" key={attendee.id}>
        <div>
          <div className="image-container">
            <div className="image">
              <img src={photoUrl} />
            </div>
          </div>
          <div className="name">
            <div>{attendee.user.first_name}</div>
            <div>{attendee.user.last_name}</div>
          </div>
        </div>
      </div>
    );
  }

  generateLocationArea() {
    const { event } = this.props;
    let start_date_locale = moment(event.event_date_start).format(
      LONG_DATE_FORMAT
    );
    let start_hour_locale = moment(event.event_date_start).format("LT");
    let end_hour_locale = moment(event.event_date_end).format("LT");
    return (
      <div>
        <div className="info">
          <div className="icon">
            <Icon type="schedule" style={{ fontSize: "150%" }} />
          </div>
          <div>
            <div>{start_date_locale}</div>
            <div>{start_hour_locale + " to " + end_hour_locale}</div>
          </div>
        </div>
        <div className="info">
          <div className="icon">
            <Icon type="environment" style={{ fontSize: "150%" }} />
          </div>
          <div>
            <div style={{ maxWidth: 260 }}>{event.location_title}</div>
            <div style={{ maxWidth: 260 }}>{event.location_address}</div>
          </div>
        </div>
        <div className="map">
          <Map
            defaultCenter={{ lat: event.location_lat, lng: event.location_lon }}
            positions={[
              {
                id: event.id,
                company: event.location_title,
                location_lat: event.location_lat,
                location_lon: event.location_lon
              }
            ]}
          />
        </div>
      </div>
    );
  }

  generateEventBody() {
    const { event } = this.props;
    const attendees =
      event.attendee_list &&
      event.attendee_list.map(attendee => {
        return this.generateAttendeeCard(attendee);
      });

    const headerImage = event.header_image ? (
      <img src={apiRoot + event.header_image} />
    ) : (
      imageIcon
    );

    return (
      <div className="event-body">
        <div className="event-data">
          <div className="event-photo">{headerImage}</div>
          <div className="details-container">
            <div className="title">Details</div>
            <div className="details">{parse(`${event.details}`)}</div>
          </div>
          {(window.screen.availWidth <= 1200 || window.innerHeight <= 600) && (
            <div>
              <div className="location-container">
                <div className="location"> {this.generateLocationArea()} </div>
              </div>
              {this.generateAttendance()}
            </div>
          )}
          <div className="attendees">
            <div className="title">Attendees ({event.attendee_count})</div>
            {event.attendee_count == 0 ? (
              <div className="no-data">No attendees yet!</div>
            ) : (
              <div className="attendee-list">{attendees}</div>
            )}
          </div>
        </div>
        {window.screen.availWidth > 1200 && window.innerHeight > 600 && (
          <Affix offsetTop={120}>
            <div className="location-container">
              <div className="location"> {this.generateLocationArea()} </div>
            </div>
          </Affix>
        )}
      </div>
    );
  }

  render() {
    let editButtonDisplay =
      this.props.event.mine === true &&
      this.state.user_type.id !== USER_TYPES["career_services"];
    const { redirect } = this.state;
    if (redirect !== null) {
      return <Redirect to={redirect} />;
    }
    window.onpopstate = () => {
      this.setState({ redirect: "/action?type=redirect&" + location.pathname });
    };
    const editButton = (
      <div className="fixed-buttons-container">
        <Button
          type="primary"
          shape="circle"
          size="large"
          onClick={() => this.props.setBlogEdit(this.props.blog)}
        >
          <Icon type="edit" />
        </Button>
      </div>
    );
    return (
      <div className="event-details">
        {editButtonDisplay && editButton}
        {this.generateEventHeader()}
        {this.generateEventBody()}
      </div>
    );
  }
}

export default EventDetails;
