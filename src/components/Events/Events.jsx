import React from "react";

import Event from "./Event.jsx";

import "./style.scss";
import {
  getEventsRequest,
  postUsersRequest
} from "../../utils/api/requests.js";
import { axiosCaptcha } from "../../utils/api/fetch_api.js";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";
import Footer from "../Partials/Footer/Footer.jsx";
import EventDetails from "./EventDetails.jsx";
import Spinner from "../Partials/Spinner/Spinner.jsx";

class Events extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventsList: [],
      isUpdating: false,
      isWaitingResponse: false,
      isInitialRequest: "beforeRequest",
      isNewPageRequested: false,
      pagination: {},
      pageNo: 1,
      pageSize: 9,
      detail_event_id: window.location.search.split("=")[1] || null,
      detail_event: {}
    };

    this.setEventDetail = this.setEventDetail.bind(this);
  }

  async componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      this.setState({ isInitialRequest: true });
      if (this.state.detail_event_id == null) {
        await this.getData("initialRequest");
      } else {
        await this.getData("detailedRequest");
      }
      axiosCaptcha(
        postUsersRequest.url("verify_recaptcha"),
        postUsersRequest.config,
        "events"
      ).then(response => {
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
    this.setState({ isWaitingResponse: true });
    const { url, config } = getEventsRequest;
    let newUrl =
      this.state.detail_event_id == null
        ? url +
          "?page=" +
          this.state.pageNo +
          "&page_size=" +
          this.state.pageSize
        : url + "/" + this.state.detail_event_id;
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
          <h2>Events</h2>
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
    return (
      <div>
        <div className="events-page-big-container">
          <div>
            {this.state.detail_event_id == null ? (
              this.generateEventsGrid()
            ) : (
              <EventDetails
                event={this.state.detail_event}
                handleTokenExpiration={this.props.handleTokenExpiration}
              />
            )}
          </div>
        </div>
        <div className={footerClass}>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Events;
