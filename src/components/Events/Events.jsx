import React from "react";

import Event from "./Event.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api.js";
import { USERS, EVENTS } from "../../utils/constants/endpoints.js";
import {
  IS_CONSOLE_LOG_OPEN,
  USER_TYPES
} from "../../utils/constants/constants.js";
import Footer from "../Partials/Footer/Footer.jsx";
import EventDetails from "./EventDetails.jsx";
import EventEditable from "./EventEditable.jsx";
import Spinner from "../Partials/Spinner/Spinner.jsx";

import "./style.scss";

class Events extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventsList: [],
      isUpdating: false,
      isWaitingResponse: false,
      isInitialRequest: "beforeRequest",
      isNewPageRequested: false,
      user_type: this.props.cookie("get", "user_type"),
      pagination: {},
      pageNo: 1,
      pageSize: 9,
      detail_event_id:
        window.location.search
          .split("&")
          .slice(-1)[0]
          .split("=")[1] != "true"
          ? window.location.search.split("=")[1]
          : null,
      detail_event: {},
      edit:
        window.location.search
          .split("&")
          .slice(-1)[0]
          .split("=")[1] == "true"
          ? true
          : false,
      editRequested: false,
      edit_event_id:
        window.location.search
          .split("&")
          .slice(-1)[0]
          .split("=")[1] != "true"
          ? null
          : window.location.search
              .split("&")
              .slice(-1)[0]
              .split("=")[0] == "edit"
          ? window.location.search.split("&")[0].split("=")[1]
          : null,
      editable_event: {
        attended: true,
        attendee_count: 0,
        attendee_list: [],
        created_at: new Date().toISOString(),
        details: "",
        event_date_start: new Date().toISOString(),
        event_date_end: new Date(
          new Date().setTime(new Date().getTime() + 3 * 60 * 60 * 1000)
        ).toISOString(),
        id: null,
        event_type: null,
        header_image: "",
        is_publish: false,
        is_public: false,
        title: "",
        location_address: "",
        location_title: "",
        location_lat: 37.389194,
        location_lon: -121.9306859,
        spot_count: 0,
        short_description: "",
        host_user: this.props.user,
        updated_at: null,
        user_types: [{ id: 3 }, { id: 4 }]
      }
    };

    this.setEventDetail = this.setEventDetail.bind(this);
  }

  async componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      this.setState({ isInitialRequest: true });
      if (this.state.detail_event_id == null) {
        if (this.state.edit_event_id == null) {
          await this.getData("initialRequest");
        } else {
          await this.getData("editRequest");
        }
      } else {
        await this.getData("detailedRequest");
      }
      let config = { method: "POST" };
      axiosCaptcha(USERS("verifyRecaptcha"), config, false).then(response => {
        if (response.statusText === "OK") {
          if (response.data.success != true) {
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
  }

  componentDidUpdate() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      if (this.state.isNewPageRequested === true) {
        this.getData("newPageRequest");
        this.setState({ isNewPageRequested: false });
      }
    }
  }

  async getData(requestType) {
    let path = window.location.pathname;
    let exclusivity =
      this.state.user_type.id !== USER_TYPES["career_services"]
        ? ""
        : path === "/student/events"
        ? "&student=true"
        : path === "/alumni/events"
        ? "&student=false"
        : "";
    this.setState({ isWaitingResponse: true });
    let config = { method: "GET" };
    let newUrl =
      this.state.detail_event_id == null && this.state.edit_event_id == null
        ? EVENTS +
          "?page=" +
          this.state.pageNo +
          "&page_size=" +
          this.state.pageSize +
          exclusivity
        : this.state.edit_event_id == null
        ? EVENTS + this.state.detail_event_id + "/"
        : EVENTS + this.state.edit_event_id + "/";
    await this.props.handleTokenExpiration("events getData");
    axiosCaptcha(newUrl, config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success == true) {
          if (requestType === "initialRequest") {
            this.setState({
              eventsList: response.data.data,
              pagination: response.data.pagination,
              isWaitingResponse: false,
              isInitialRequest: false
            });
          } else if (requestType === "newPageRequest") {
            this.setState({
              eventsList: response.data.data,
              pagination: response.data.pagination,
              isWaitingResponse: false,
              isNewPageRequested: false
            });
          } else if (requestType === "detailedRequest") {
            this.setState({
              detail_event: response.data.data,
              isWaitingResponse: false,
              isInitialRequest: false
            });
          } else if (requestType === "editRequest") {
            if (response.data.data.mine) {
              this.setState({
                editable_event: response.data.data
              });
            }
            this.setState({
              isWaitingResponse: false,
              isInitialRequest: false
            });
          }
        }
      }
    });
  }

  async setEventDetail(id) {
    let event = this.state.eventsList.filter(event => id == event.id)[0];
    await this.setState({ detail_event_id: id, detail_event: event });
    this.getData("detailedRequest");
  }

  generateFeatureArea() {
    return (
      <div>
        <div className="page-title">
          <h2>
            {this.state.user_type.name === "Alumni"
              ? "ITU Alumni Events"
              : "Events"}
          </h2>
        </div>
      </div>
    );
  }

  generateEventsGrid() {
    const events = this.state.eventsList.map(event => {
      return (
        <Event
          key={event.id}
          event={event}
          setEventDetail={this.setEventDetail}
        />
      );
    });
    return (
      <div className="events-page-medium-container">
        {this.generateFeatureArea()}
        <div className="events-page-small-container">
          <div className="event-list">{events}</div>
        </div>
      </div>
    );
  }

  render() {
    const footerClass =
      this.state.eventsList.length != 0
        ? ""
        : this.state.detail_event_id != null
        ? ""
        : "bottom-fixed-footer";
    if (this.state.isInitialRequest === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    else if (this.state.isInitialRequest === true)
      return <Spinner message="Preparing events..." />;
    else if (this.state.editRequested == true) {
      return (
        <Redirect
          to={
            "action?type=redirect&/events?id=" +
            this.state.edit_event_id +
            "&edit=true"
          }
        />
      );
    } else if (
      this.state.edit == true &&
      !this.state.user_type.blog_creation_enabled
    ) {
      return <Redirect to={"action?type=redirect&/events"} />;
    }
    return (
      <div>
        <div className="events-page-big-container">
          {this.state.edit != true ? (
            <div>
              {this.state.detail_event_id == null ? (
                this.generateEventsGrid()
              ) : (
                <EventDetails
                  event={this.state.detail_event}
                  handleTokenExpiration={this.props.handleTokenExpiration}
                  cookie={this.props.cookie}
                />
              )}
            </div>
          ) : (
            <div>
              <EventEditable
                event={this.state.editable_event}
                handleTokenExpiration={this.props.handleTokenExpiration}
                alert={this.props.alert}
                cookie={this.props.cookie}
              />
            </div>
          )}
        </div>
        <div className={footerClass}>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Events;
