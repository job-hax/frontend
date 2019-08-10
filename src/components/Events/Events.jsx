import React from "react";

import Event from "./Event.jsx";

import "./style.scss";
import {
  getEventsRequest,
  postUsersRequest
} from "../../utils/api/requests.js";
import { axiosCaptcha } from "../../utils/api/fetch_api.js";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";

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
      pageSize: 9
    };
  }

  async componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      this.setState({ isInitialRequest: true });
      await this.getData("initialRequest");
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
      url + "?page=" + this.state.pageNo + "&page_size=" + this.state.pageSize;
    await this.props.handleTokenExpiration("events getData");
    axiosCaptcha(newUrl, config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success == true) {
          let multiple = [];
          for (let i = 0; i < 9; i++) {
            multiple.push(response.data.data[0]);
          }
          if (requestType === "initialRequest") {
            this.setState({
              eventsList: multiple,
              pagination: response.data.pagination,
              isWaitingResponse: false,
              isInitialRequest: false
            });
          } else if (requestType === "newPageRequest") {
            this.setState({
              eventsList: multiple,
              pagination: response.data.pagination,
              isWaitingResponse: false,
              isNewPageRequested: false
            });
          }
        }
      }
    });
  }

  render() {
    const events = this.state.eventsList.map(event => {
      return <Event key={event.id} event={event} />;
    });
    return <div className="event-list">{events}</div>;
  }
}

export default Events;
