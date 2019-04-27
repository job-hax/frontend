import React from "react";

import defaultLogo from "../../assets/icons/JobHax-logo-black.svg";
import { makeTimeBeautiful } from "../../utils/constants/constants.js";

import "./style.scss";

class NotificationsBox extends React.Component {
  constructor(props) {
    super(props);
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
      <div className="notification-box-container">
        <div className="notificaiton-box-header">Notifications</div>
        <div className="notificaitons-list">{this.generateNotifications()}</div>
      </div>
    );
  }
}

export default NotificationsBox;
