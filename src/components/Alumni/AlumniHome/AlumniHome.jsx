import React from "react";
import { Redirect } from "react-router-dom";
import { Carousel } from "antd";
import parse from "html-react-parser";

import Spinner from "../../Partials/Spinner/Spinner.jsx";
import { axiosCaptcha } from "../../../utils/api/fetch_api";
import {
  EVENTS,
  BLOGS,
  COLLEGES,
  apiRoot
} from "../../../utils/constants/endpoints.js";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";
import Event from "../../Events/Event.jsx";
import BlogCard from "../../Blog/BlogCard.jsx";
import CoachSummary from "../../CareerService/CoachModal/CoachSummary.jsx";
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
        alumnihome: COLLEGES("homePage")
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
          src={apiRoot + social.icon}
          onClick={() => window.open(social.link)}
        />
      );
    });
    return (
      <div className="social-buttons-container">
        <div className="social-buttons-small-container">{social_buttons}</div>
      </div>
    );
  }

  generateCarouselArea(banners, type) {
    const isSingle = banners.length === 1 ? true : false;
    const containerClass =
      type === "side" ? "side-carousel-container" : "carousel-container";
    const imgDivClass =
      type === "side" ? "side-carousel-image" : "carousel-image";
    const header_media = banners.map(banner => {
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
          <img src={apiRoot + banner.image} />
        </div>
      );
    });

    const coach_media = banners.map(coach => {
      return <CoachSummary coach={coach} />;
    });

    const media = type === "header" ? header_media : coach_media;
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

  generateVideosArea() {
    const videos = this.state.alumnihome.videos.map(video => (
      <div className="video-container">
        <div> {parse(`${video.embed_code}`)}</div>
        <div className="video-title">{video.title}</div>
        <div>{video.description}</div>
      </div>
    ));
    return <div className="videos-area">{videos}</div>;
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
            {header("Videos")}
            {this.generateVideosArea()}
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
