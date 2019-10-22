import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Menu } from "antd";
import ReactGA from "react-ga";

import "./style.scss";

const { SubMenu } = Menu;

class DrawerMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_demo_user:
        this.props.cookie("get", "is_demo_user") != ("" || null)
          ? this.props.cookie("get", "is_demo_user")
          : false,
      current:
        window.location.pathname != "/blogs"
          ? window.location.pathname
          : window.location.search != "?edit=true"
          ? window.location.pathname
          : window.location.pathname + window.location.search,
      request: false,
      redirect: false
    };

    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  componentDidUpdate() {
    if (
      this.state.current != window.location.pathname &&
      this.state.current != window.location.pathname + window.location.search &&
      this.state.request
    ) {
      this.setState({ request: false, redirect: true });
    }
    if (
      (this.state.current === window.location.pathname ||
        this.state.current ===
          window.location.pathname + window.location.search) &&
      this.state.redirect
    ) {
      this.setState({ redirect: false });
    }
    if (this.state.is_demo_user != this.props.cookie("get", "is_demo_user")) {
      this.setState({ is_demo_user: this.props.cookie("get", "is_demo_user") });
    }
  }

  async handleMenuClick(event) {
    let page = event.key;
    let request = page === "addCoach" ? false : true;
    this.setState({ request: request });
    if (
      [
        "/events",
        "/events?edit=true",
        "/student/events",
        "/alumni/events"
      ].includes(page) &&
      window.location.pathname.includes("event")
    ) {
      this.setState({ current: "/action?type=redirect&" + page });
    } else if (
      [
        "/blogs",
        "/blogs?edit=true",
        "/student/blogs",
        "/alumni/blogs"
      ].includes(page) &&
      window.location.pathname.includes("blogs")
    ) {
      this.setState({ current: "/action?type=redirect&" + page });
    } else if (page === "addCoach") {
      this.setState({ addCoachVisible: true });
    } else {
      this.setState({ current: page });
    }
  }

  generateDrawerMenu() {
    const jobMenu = (
      <SubMenu title="Career Service" key="career-service">
        <Menu.Item key="/career-service/dashboard">Dashboard</Menu.Item>
        <SubMenu title="Waiting Approvals">
          <Menu.Item
            key="/career-service/approval/events"
            id="/career-service/approval/events"
          >
            Events
          </Menu.Item>
          <Menu.Item
            key="/career-service/approval/blogs"
            id="/career-service/approval/blogs"
          >
            Blogs
          </Menu.Item>
        </SubMenu>
        <SubMenu title="Add New">
          <Menu.Item key="/events?edit=true">Event</Menu.Item>
          <Menu.Item key="/blogs?edit=true">Blog</Menu.Item>
        </SubMenu>
        <SubMenu title="Manage">
          {/*<Menu.Item key="/career-service/manage/jobhax-landing-page">
            Jobhax Landing Page
            </Menu.Item>*/}
          <SubMenu title="Alumni Home Page">
            <Menu.Item key="/career-service/manage/alumni-home-page/banner-images">
              Banner Images
            </Menu.Item>
            <Menu.Item key="/career-service/manage/alumni-home-page/coaches">
              Coaches
            </Menu.Item>
            <Menu.Item key="/career-service/manage/alumni-home-page/videos">
              Videos
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="/career-service/manage/events">Events</Menu.Item>
          <Menu.Item key="/career-service/manage/blogs">Blogs</Menu.Item>
        </SubMenu>
        <Menu.Item key="/career-service/metrics">University Metrics</Menu.Item>
      </SubMenu>
    );

    const communityMenu = (
      <SubMenu title="Student View" key="student-view">
        <Menu.Item key="/student/blogs">Blog</Menu.Item>
        <Menu.Item key="/student/events">Events</Menu.Item>
      </SubMenu>
    );

    const alumniMenu = (
      <SubMenu title="Alumni View" key="alumni-view">
        <Menu.Item key="/alumni/home">Home</Menu.Item>
        <Menu.Item key="/alumni/network">Network</Menu.Item>
        <Menu.Item key="/alumni/blogs">Blog</Menu.Item>
        <Menu.Item key="/alumni/events">Events</Menu.Item>
      </SubMenu>
    );

    const menu = (
      <Menu
        defaultOpenKeys={["career-service"]}
        mode="inline"
        theme="dark"
        onClick={event => this.handleMenuClick(event)}
        selectedKeys={
          this.state.addCoachVisible
            ? ["addCoach"]
            : [window.location.pathname + window.location.search]
        }
      >
        {jobMenu}
        {communityMenu}
        {alumniMenu}
      </Menu>
    );

    return menu;
  }

  render() {
    const menuSpace = { width: 180, height: "100%" };
    if (this.state.redirect) {
      return <Redirect to={this.state.current} />;
    }
    return (
      <div>
        <div className="drawer-container">{this.generateDrawerMenu()}</div>
        <div style={menuSpace}></div>
      </div>
    );
  }
}

export default DrawerMenu;
