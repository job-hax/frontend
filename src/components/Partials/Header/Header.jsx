import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Menu, Icon } from "antd";

import { axiosCaptcha } from "../../../utils/api/fetch_api";
import { USERS } from "../../../utils/constants/endpoints";
import NotificationsBox from "../NotificationsBox/NotificationsBox.jsx";
import "./style.scss";

const { SubMenu } = Menu;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_type:
        this.props.cookie("get", "user_type") != ("" || null)
          ? this.props.cookie("get", "user_type")
          : 0,
      current:
        window.location.pathname != "/blogs"
          ? window.location.pathname
          : window.location.search != "?edit=true"
          ? window.location.pathname
          : window.location.pathname + window.location.search,
      request: false,
      redirect: false
    };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleSyncUserEmail = this.handleSyncUserEmail.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  componentDidUpdate() {
    if (this.state.current != window.location.pathname && this.state.request) {
      this.setState({ request: false, redirect: true });
    }
    if (this.state.current == window.location.pathname && this.state.redirect) {
      this.setState({ redirect: false });
    }
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
      let config = { method: "GET" };
      await this.props.handleTokenExpiration("header handleSyncUserEmail");
      axiosCaptcha(USERS("syncUserEmails"), config).then(response => {
        if (response.statusText === "OK") {
          if (response.data.success) {
            this.props.passStatesFromHeader(
              "syncResponseTimestamp",
              new Date().getTime()
            );
          }
        }
      });
    }
  }

  async handleMenuClick(event) {
    const setStateAsync = state => {
      return new Promise(resolve => {
        this.setState(state, resolve);
      });
    };
    this.setState({ request: true });
    let page = event.key;
    if (page == "/logout") {
      this.props.passStatesFromHeader("logout", true);
      await setStateAsync({ current: "/home" });
      this.props.handleSignOut();
    } else if (page == "/events") {
      if (window.location.pathname.substring(0, 6) == "/event") {
        this.setState({ current: "action?type=redirect&/events" });
      } else {
        this.setState({ current: page });
      }
    } else if (page == "/blogs?edit=true") {
      if (window.location.pathname.substring(0, 5) == "/blog") {
        this.setState({ current: "action?type=redirect&/blogs?edit=true" });
      } else {
        this.setState({ current: page });
      }
    } else if (page == "/blogs") {
      if (window.location.pathname.substring(0, 5) == "/blog") {
        this.setState({ current: "action?type=redirect&/blogs" });
      } else {
        this.setState({ current: page });
      }
    } else {
      this.setState({ current: page });
    }
  }

  generateLoggedInHeader() {
    const isDashboardOpenedByDefault =
      window.location.pathname == "/" ? "/dashboard" : "";
    const profilePhotoUrl = this.props.profilePhotoUrl
      ? this.props.profilePhotoUrl
      : "../../../src/assets/icons/SeyfoIcon@3x.png";
    const fixed = { position: "fixed" };
    const normal = { margin: 0 };
    const style = window.location.pathname === "/mentors" ? fixed : normal;
    return (
      <div className="header-container" style={style}>
        <div className="left-container">
          <div className="jobhax-logo-container">
            <div
              className="jobhax-logo"
              onClick={() =>
                this.setState({ current: "/dashboard", request: true })
              }
            />
          </div>
        </div>
        <div className="right-container">
          {window.location.pathname == "/dashboard" && (
            <div className="header-icon general tooltips">
              <img
                onClick={this.handleSyncUserEmail}
                style={{ height: 16 }}
                src="../../../src/assets/icons/SyncIcon@3x.png"
              />
              <span>Refresh</span>
            </div>
          )}
          <Menu
            onClick={event => this.handleMenuClick(event)}
            selectedKeys={[this.state.current, isDashboardOpenedByDefault]}
            mode="horizontal"
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <SubMenu
              title={
                <div className="header-icon menu-icon">
                  <img src="../../../src/assets/icons/BusinessIcon.png" />
                </div>
              }
            >
              <Menu.Item key="/dashboard">Dashboard</Menu.Item>
              <Menu.Item key="/metrics">Metrics</Menu.Item>
              <Menu.Item key="/companies">Companies</Menu.Item>
            </SubMenu>
            <SubMenu
              title={
                <div className="header-icon menu-icon">
                  <img src="../../../src/assets/icons/SchoolIcon.png" />
                </div>
              }
            >
              {(this.state.user_type == 2 || this.state.user_type == 3) && (
                <Menu.Item key="/alumni">Alumni</Menu.Item>
              )}
              <Menu.Item key="/blogs">Blog</Menu.Item>
              <Menu.Item key="/events">Events</Menu.Item>
            </SubMenu>
          </Menu>
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
          <Menu
            onClick={event => this.handleMenuClick(event)}
            selectedKeys={[this.state.current]}
            mode="horizontal"
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <SubMenu
              title={
                <div className="header-icon user-icon">
                  <img src={profilePhotoUrl} />
                </div>
              }
            >
              <Menu.Item key="/profile">Profile</Menu.Item>
              <Menu.Item key="/blogs?edit=true">Add Blog</Menu.Item>
              <Menu.Item key="/logout">
                <Icon type="logout" />
                Logout
              </Menu.Item>
            </SubMenu>
          </Menu>
        </div>
      </div>
    );
  }

  generateNonLoggedInHeader() {
    return (
      <div className="header-container">
        <div className="left-container">
          <div className="jobhax-logo-container">
            <div
              className="jobhax-logo"
              onClick={() => this.setState({ current: "/home", request: true })}
            />
          </div>
        </div>
        <div className="right-container out">
          <div
            className="option"
            onClick={() => this.setState({ current: "/signin", request: true })}
          >
            Log In
          </div>
          <div>/</div>
          <div
            className="option"
            onClick={() => this.setState({ current: "/signup", request: true })}
          >
            Sign Up
          </div>
        </div>
      </div>
    );
  }

  render() {
    let header = "";
    if (this.state.redirect) {
      return <Redirect to={this.state.current} />;
    }
    if (this.props.isUserLoggedIn) {
      header = this.generateLoggedInHeader();
    } else {
      header = this.generateNonLoggedInHeader();
    }
    return (
      <div>
        {header}
        <div className="header-height"></div>
      </div>
    );
  }
}

export default Header;
