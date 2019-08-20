import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

import { axiosCaptcha } from "../../../utils/api/fetch_api";
import { syncUserEmailsRequest } from "../../../utils/api/requests.js";
import NotificationsBox from "../NotificationsBox/NotificationsBox.jsx";
import "./style.scss";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_type:
        this.props.cookie("get", "user_type") != ("" || null)
          ? this.props.cookie("get", "user_type")
          : 0
    };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleSyncUserEmail = this.handleSyncUserEmail.bind(this);
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
      this.props.toggleNotifications(false);
    }
  }

  handleNotifications() {
    this.props.notificationCheck();
    this.props.toggleNotifications(true);
  }

  async handleSyncUserEmail() {
    if (
      this.props.cookie("get", "google_access_token_expiration") == ("" || null)
    ) {
      this.props.alert(
        5000,
        "info",
        "Automatic sync is available for users who logged in with Gmail account.\n If you have never logged in with your Gmail, you can link your account with Google account on profile page."
      );
    } else {
      this.props.alert(3000, "info", "Syncing with your email...");
      const { url, config } = syncUserEmailsRequest;
      await this.props.handleTokenExpiration("header handleSyncUserEmail");
      axiosCaptcha(url, config).then(response => {
        if (response.statusText === "OK") {
          this.props.passStatesFromHeader(new Date().getTime());
        }
      });
    }
  }

  render() {
    const fixed = { position: "fixed" };
    const normal = { margin: 0 };
    const style = window.location.pathname === "/mentors" ? fixed : normal;
    return (
      <div className="header-container" style={style}>
        <div className="left-container">
          <div className="jobhax-logo-container">
            <Link to="/dashboard">
              <div className="jobhax-logo" />
            </Link>
          </div>
        </div>
        <div className="right-container">
          <div className="header-icon general tooltips">
            {window.location.pathname == "/dashboard" ? (
              <img
                onClick={this.handleSyncUserEmail}
                src="../../../src/assets/icons/SyncIcon@3x.png"
              />
            ) : (
              <Link to="/dashboard">
                <img src="../../../src/assets/icons/BoardIcon@3x.png" />
              </Link>
            )}
            <span>
              {window.location.pathname == "/dashboard"
                ? "Refresh"
                : " Dashboard"}
            </span>
          </div>
          <div className="header-icon general tooltips">
            <Link to="/metrics">
              <img src="../../../src/assets/icons/StatsIcon@3x.png" />
              <span>Metrics</span>
            </Link>
          </div>
          {(this.state.user_type == 2 || this.state.user_type == 3) && (
            <div className="header-icon general tooltips">
              <Link to="/alumni">
                <img src="../../../src/assets/icons/AlumniIcon.png" />
                <span>Alumni</span>
              </Link>
            </div>
          )}
          {window.location.pathname.substring(0, 6) == "/event" ? (
            <div
              className="header-icon general tooltips"
              onClick={() => window.location.assign("/events")}
            >
              <img src="../../../src/assets/icons/EventIcon.png" />
              <span>Events</span>
            </div>
          ) : (
            <div className="header-icon general tooltips">
              <Link to="/events">
                <img src="../../../src/assets/icons/EventIcon.png" />
                <span>Events</span>
              </Link>
            </div>
          )}
          {/*<div className="header-icon general tooltips">
            <Link to="/mentors">
              <img src="../../../src/assets/icons/MentorIcon.png" />
              <span>Mentorship</span>
            </Link>
          </div>
          <div className="header-icon general tooltips">
            <Link to="/metricsGlobal">
              <img src="../../../src/assets/icons/globe.png" />
              <span>Aggregated Metrics</span>
            </Link>
          </div>*/}
          <div className="header-icon general tooltips">
            <Link to="/companies">
              <img src="../../../src/assets/icons/company_icon.png" />
              <span>Companies</span>
            </Link>
          </div>
          {!this.props.isNotificationsShowing ? (
            <div
              className="header-icon general tooltips"
              onClick={() => this.handleNotifications()}
            >
              <img
                src="../../../src/assets/icons/beta_flag_2.png"
                style={{
                  position: "absolute",
                  height: "24px",
                  margin: "0px 0px 0 -2px"
                }}
              />
              <img src="../../../src/assets/icons/NotifIcon@3x.png" />
              <span>Notifications</span>
            </div>
          ) : (
            <div
              className="header-icon general tooltips"
              ref={this.setWrapperRef}
            >
              <img
                src="../../../src/assets/icons/NotifIcon@3x.png"
                onClick={() => this.props.toggleNotifications(false)}
              />
              <NotificationsBox
                notificationsList={this.props.notificationsList}
              />
            </div>
          )}
          {this.props.profilePhotoUrl != "" ? (
            <div className="header-icon user-icon">
              <Link to="/profile">
                <img src={this.props.profilePhotoUrl} />
              </Link>
            </div>
          ) : (
            <div className="header-icon user-icon">
              <Link to="/profile">
                <img src="../../../src/assets/icons/SeyfoIcon@3x.png" />
              </Link>
            </div>
          )}
          <div className="header-icon sign_out">
            <Link to="/home">
              <img
                onClick={() => this.props.handleSignOut()}
                src="../../../src/assets/icons/log-out@3x.png"
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
