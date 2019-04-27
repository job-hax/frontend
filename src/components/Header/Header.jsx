import React, { Component } from "react";
import { Link } from "react-router-dom";

import NotificationsBox from "../NotificationsBox/NotificationsBox.jsx";
import "./style.scss";

class Header extends Component {
  constructor(props) {
    super(props);
  }

  handleNotifications() {
    this.props.notificationCheck();
    this.props.toggleNotifications();
  }

  render() {
    return (
      <div className="header-container">
        <div className="left-container">
          <div className="jobhax-logo-container">
            <Link to="/dashboard">
              <div className="jobhax-logo" />
            </Link>
          </div>
          {/*<div className="search-box">
            <img className="header-icon search-icon" src="../../src/assets/icons/SearchIcon@3x.png"></img>
            <div>
              <input
                className="search-input"
                id="query"
                onChange={e => {
                  e.preventDefault()
                }}>
              </input>
            </div>
              </div>*/}
        </div>
        <div className="right-container">
          <div className="header-icon general tooltips">
            <Link to="/dashboard">
              {window.location.href.slice(-9) == "dashboard" ? (
                <img src="../../src/assets/icons/SyncIcon@3x.png" />
              ) : (
                <img src="../../src/assets/icons/BoardIcon@3x.png" />
              )}
            </Link>
            <span>
              {window.location.href.slice(-9) == "dashboard"
                ? "Refresh"
                : " Dashboard"}
            </span>
          </div>
          <div className="header-icon general tooltips">
            <Link to="/metrics">
              <img src="../../src/assets/icons/StatsIcon@3x.png" />
              <span>Metrics</span>
            </Link>
          </div>
          <div className="header-icon general tooltips">
            <Link to="/metricsGlobal">
              <img src="../../src/assets/icons/globe.png" />
              <span style={{ height: "48px", lineHeight: "24px" }}>
                Aggregated Metrics
              </span>
            </Link>
          </div>
          <div className="header-icon general tooltips">
            <Link to="/reviews">
              <img src="../../src/assets/icons/reviews.png" />
              <span>Reviews</span>
            </Link>
          </div>
          {!this.props.isNotificationsShowing ? (
            <div
              className="header-icon general tooltips"
              onClick={() => this.handleNotifications()}
            >
              <img src="../../src/assets/icons/NotifIcon@3x.png" />
              <span>Notifications</span>
            </div>
          ) : (
            <div className="header-icon general tooltips">
              <img src="../../src/assets/icons/NotifIcon@3x.png" />
              <NotificationsBox
                notificationsList={this.props.notificationsList}
                toggleDisplay={this.props.toggleNotifications}
              />
            </div>
          )}
          <div className="header-icon user-icon">
            <Link to="/underconstruction">
              <img src="../../src/assets/icons/SeyfoIcon@3x.png" />
            </Link>
          </div>
          <div className="header-icon sign_out">
            <Link to="/">
              <img
                onClick={() => this.props.handleSignOut()}
                src="../../src/assets/icons/log-out@3x.png"
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
