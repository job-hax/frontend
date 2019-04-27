import React from "react";

import defaultLogo from "../../assets/icons/JobHax-logo-black.svg";
import { makeTimeBeautiful } from "../../utils/constants/constants.js";

import "./style.scss";

class NotificationsBox extends React.Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentWillMount() {
    document.addEventListener("mousedown", this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.addEventListener("mousedown", this.handleClickOutside, false);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.toggleDisplay();
    }
  }

  generateNotifications() {
    return this.props.notificationsList.map(notification => (
      <div key={notification.id} className="notification">
        <div className="notification-image">
          <img src={notification.image ? notification.image : defaultLogo} />
        </div>
        <div className="notification-body">
          <div className="notification-header">
            <div className="notification-title">{notification.title}</div>
            <div className="notification-date">
              {makeTimeBeautiful(notification.created_at, "dateandtime")}
            </div>
          </div>
          <div className="notification-content">{notification.content}</div>
        </div>
      </div>
    ));
  }

  render() {
    return (
      <div className="notification-box-container" ref={this.setWrapperRef}>
        <div className="notificaiton-box-header">Notifications</div>
        <div className="notificaitons-list">{this.generateNotifications()}</div>
      </div>
    );
  }
}

export default NotificationsBox;
