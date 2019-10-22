import React from "react";
import moment from "moment";

import defaultLogo from "../../../assets/icons/JobHax-logo-black.svg";
import { DATE_AND_TIME_FORMAT } from "../../../utils/constants/constants.js";

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
              {moment(notification.created_at).format(DATE_AND_TIME_FORMAT)}
            </div>
          </div>
          <div className="notification-content">{notification.content}</div>
        </div>
      </div>
    ));
  }

  render() {
    return (
      <div
        className="notification-box-container"
        style={this.props.customBoxStyle}
      >
        <div className="notification-box-header">
          <div>Notifications</div>
          <img
            src="../../../src/assets/icons/beta_flag.png"
            className="beta-flag"
          />
        </div>
        {this.props.notificationsList.length == 0 ? (
          <div className="notification-notice">
            {" "}
            You do not have any notifications at the moment!{" "}
          </div>
        ) : (
          <div className="notifications-list" style={this.props.itemListHeight}>
            {this.generateNotifications()}
          </div>
        )}
      </div>
    );
  }
}

export default NotificationsBox;
