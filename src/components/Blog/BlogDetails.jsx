import React from "react";
import { Icon, Button, Affix } from "antd";
import parse from "html-react-parser";

import "./style.scss";
import { makeTimeBeautiful } from "../../utils/constants/constants";
import { apiRoot } from "../../utils/constants/endpoints";
import Map from "../Metrics/SubComponents/Map/Map.jsx";
import { postEventsRequest } from "../../utils/api/requests";
import { axiosCaptcha } from "../../utils/api/fetch_api";

class BlogDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLinkDisplaying: false
    };
  }

  async postAttendeeRequest(answer) {
    await this.props.handleTokenExpiration("event postData");
    let newUrl =
      postEventsRequest.url + "/" + this.props.event.id + "/" + answer;
    axiosCaptcha(newUrl, postEventsRequest.config, "events").then(response => {
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

  generateBlogHeader() {
    const { blog } = this.props;
    let photoUrl =
      event.host_user.profile_photo.substring(0, 4) == "http"
        ? event.host_user.profile_photo
        : apiRoot + event.host_user.profile_photo;
    let time = makeTimeBeautiful(event.event_date_start, "dateandtime");
    let longDate = makeTimeBeautiful(event.event_date_start, "longDate");
    return (
      <div className="event-header">
        <div className="event-datebox">
          <div className="day">{time.split("-")[0]}</div>
          <div className="month">{time.split("-")[1].toUpperCase()}</div>
        </div>
        <div className="event-info">
          <div className="event-date">{longDate}</div>
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
        </div>
        <div className="attendance">
          <div className="question-container">
            <div className="question">Are you going?</div>
            <div className="attendee-amount">
              {this.state.attendance == true
                ? "You are going!"
                : event.attendee_list.length == 0
                ? "Be the first attendant!"
                : event.attendee_list.length + " people going"}
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

  generateAttendeeCard(attendee) {
    let photoUrl =
      attendee.user.profile_photo.substring(0, 4) == "http"
        ? attendee.user.profile_photo
        : apiRoot + attendee.user.profile_photo;
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
    let longDate = makeTimeBeautiful(event.event_date_start, "longDate");
    return (
      <div>
        <div className="info">
          <div className="icon">
            <Icon type="schedule" style={{ fontSize: "150%" }} />
          </div>
          <div>
            <div>{longDate}</div>
            <div>
              {makeTimeBeautiful(event.event_date_start, "dateandtime").split(
                "at"
              )[1] +
                " to " +
                makeTimeBeautiful(event.event_date_end, "dateandtime").split(
                  "at"
                )[1]}
            </div>
          </div>
        </div>
        <div className="info">
          <div className="icon">
            <Icon type="environment" style={{ fontSize: "150%" }} />
          </div>
          <div>
            <div>{event.location_title}</div>
            <div>{event.location_address}</div>
          </div>
        </div>
        <div className="map">
          <Map
            defaultCenter={{ lat: event.location_lat, lng: event.location_lon }}
            positions={[{ lat: event.location_lat, lng: event.location_lon }]}
          />
        </div>
      </div>
    );
  }

  generateEventBody() {
    const { event } = this.props;
    const attendees = event.attendee_list.map(attendee => {
      return this.generateAttendeeCard(attendee);
    });
    return (
      <div className="event-body">
        <div className="event-data">
          <div className="event-photo">
            <img src={apiRoot + event.header_image} />
          </div>
          <div className="details-container">
            <div className="title">Details</div>
            <div className="details">{parse(`${event.details}`)}</div>
          </div>
          <div className="attendees">
            <div className="title">
              Attendees ({event.attendee_list.length})
            </div>
            {event.attendee_list.length == 0 ? (
              <div className="no-data">No attendees yet!</div>
            ) : (
              <div className="attendee-list">{attendees}</div>
            )}
          </div>
        </div>
        <Affix offsetTop={120}>
          <div className="location-container">
            <div className="location"> {this.generateLocationArea()} </div>
          </div>
        </Affix>
      </div>
    );
  }

  render() {
    history.pushState(null, null, location.href);
    window.onpopstate = function() {
      window.location.assign("blogs");
    };
    return (
      <div className="event-details">
        {this.generateEventHeader()}
        {this.generateEventBody()}
      </div>
    );
  }
}

export default BlogDetails;