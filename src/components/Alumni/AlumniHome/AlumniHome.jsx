import React from "react";
import { Redirect } from "react-router-dom";
import { Carousel } from "antd";

import Spinner from "../../Partials/Spinner/Spinner.jsx";
import { axiosCaptcha } from "../../../utils/api/fetch_api";
import { EVENTS, BLOGS, ALUMNI } from "../../../utils/constants/endpoints.js";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";
import Event from "../../Events/Event.jsx";
import BlogCard from "../../Blog/BlogCard.jsx";
import Footer from "../../Partials/Footer/Footer.jsx";

import "./style.scss";

class AlumniHome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isWaitingResponse: false,
      isInitialRequest: "beforeRequest",
      redirect: "",
      events: null,
      blogs: null,
      alumnihome: null,
      roots: {
        events: EVENTS,
        blogs: BLOGS,
        alumnihome: ALUMNI + "homePage/"
      }
    };

    this.handleBlogCardClick = this.handleBlogCardClick.bind(this);
    this.handleEventCardClick = this.handleEventCardClick.bind(this);
  }

  componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      this.setState({ isInitialRequest: true });
      this.getData("alumnihome", false);
      this.getData("events", 4);
      this.getData("blogs", 3);
    }
  }

  async getData(requestType, pageSize) {
    this.setState({ isWaitingResponse: true });
    let config = { method: "GET" };
    let newUrl =
      pageSize !== false
        ? this.state.roots[requestType] + "?page=1&page_size=" + pageSize
        : this.state.roots[requestType];
    await this.props.handleTokenExpiration("alumnihome getData");
    axiosCaptcha(newUrl, config)
      .then(response => {
        if (response.statusText === "OK") {
          if (response.data.success) {
            let received = response.data.data;
            this.setState({
              [requestType]: received,
              isWaitingResponse: false
            });
          }
        }
      })
      .then(() => {
        if (this.state.alumnihome && this.state.blogs && this.state.events) {
          this.setState({ isInitialRequest: false });
        }
      });
  }

  generateSocialButtons() {
    const socials = this.state.alumnihome.social_media_accounts;
    const social_buttons = socials.map(social => {
      return (
        <img
          className="social-button"
          src={social.icon}
          onClick={() => window.open(social.link)}
        />
      );
    });
    return <div className="social-buttons-container">{social_buttons}</div>;
  }

  generateCarouselArea(banners, type) {
    const isSingle = banners.length === 1 ? true : false;
    const containerClass =
      type === "side" ? "side-carousel-container" : "carousel-container";
    const imgDivClass =
      type === "side" ? "side-carousel-image" : "carousel-image";
    const media = banners.map(banner => {
      return (
        <div
          className={imgDivClass}
          key={banners.indexOf(banner)}
          onClick={() =>
            banner.internal_link
              ? this.setState({ redirect: "/" + banner.link })
              : window.open(banner.link)
          }
        >
          <img src={banner.image} />
        </div>
      );
    });
    const carousel = (
      <Carousel autoplay={!isSingle} dots={!isSingle}>
        {media}
      </Carousel>
    );
    return (
      <div className={containerClass}>
        {carousel}
        {type === "header" && this.generateSocialButtons()}
      </div>
    );
  }

  handleEventCardClick(id) {
    let redirect = "/events?id=" + id;
    this.setState({ redirect: redirect });
  }

  handleBlogCardClick(id) {
    let redirect = "/blogs?id=" + id;
    this.setState({ redirect: redirect });
  }

  generateEventsArea() {
    const events = this.state.events.map(event => {
      return (
        <div key={event.id} className="event">
          <Event
            key={event.id}
            event={event}
            setEventDetail={this.handleEventCardClick}
          />
        </div>
      );
    });
    return <div className="events-container">{events}</div>;
  }

  generateBlogsArea() {
    const blogs = this.state.blogs.map(blog => (
      <div key={blog.id}>
        <BlogCard
          blog={blog}
          setBlogDetail={this.handleBlogCardClick}
          alert={this.props.alert}
          handleTokenExpiration={this.props.handleTokenExpiration}
        />
      </div>
    ));

    return (
      <div className="blogs-container">
        <div>{blogs}</div>
        {this.generateCarouselArea(
          this.state.alumnihome.additional_banners,
          "side"
        )}
      </div>
    );
  }

  render() {
    const header = title => <div className="area-title">{title}</div>;
    if (this.state.redirect !== "") {
      return <Redirect to={this.state.redirect} />;
    } else if (this.state.isInitialRequest === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    else if (this.state.isInitialRequest === true)
      return <Spinner message="Preparing alumni home page..." />;
    if (this.state.isInitialRequest === false) {
      return (
        <div>
          <div className="alumni-home-container">
            {this.generateCarouselArea(
              this.state.alumnihome.header_banners,
              "header"
            )}
            {header("Upcoming Events")}
            {this.generateEventsArea()}
            {header("Recent Blogs")}
            {this.generateBlogsArea()}
          </div>
          <div className="footer-margin">
            <Footer />
          </div>
        </div>
      );
    }
  }
}

export default AlumniHome;
