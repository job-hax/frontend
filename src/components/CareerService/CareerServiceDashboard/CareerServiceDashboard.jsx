import React from "react";
import { Redirect } from "react-router-dom";
import { Carousel, Modal, Button } from "antd";
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
import Footer from "../../Partials/Footer/Footer.jsx";
import CoachSummary from "../CoachModal/CoachSummary.jsx";
import AddCoachModal from "../AddCoachModal/AddCoachModal.jsx";
import AddVideoModal from "../AddVideoModal/AddVideoModal.jsx";

import "./style.scss";

class CareerServiceDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isWaitingResponse: false,
      isInitialRequest: "beforeRequest",
      addCoachVisible: false,
      addVideoVisible: false,
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
    this.closeAddCoachModal = this.closeAddCoachModal.bind(this);
    this.closeAddVideoModal = this.closeAddVideoModal.bind(this);

    this.add_new_style = {
      backgroundColor: "#efefef",
      border: "2px dashed #aaaaaa",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#aaaaaa",
      fontSize: "50px",
      boxShadow: "none"
    };
  }

  componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      this.setState({ isInitialRequest: true });
      this.getData("alumnihome", false);
      this.getData("events", 3);
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

  closeAddCoachModal() {
    this.setState({ addCoachVisible: false });
  }

  closeAddVideoModal() {
    this.setState({ addVideoVisible: false });
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
          <img src={banner.image} />
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
    let redirect = id === "add_new" ? "/events?edit=true" : "/events?id=" + id;
    this.setState({ redirect: redirect });
  }

  handleBlogCardClick(id) {
    let redirect = id === "add_new" ? "/blogs?edit=true" : "/blogs?id=" + id;
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
    const add_new = (
      <div className="event">
        <Event
          event="add_new"
          setEventDetail={this.handleEventCardClick}
          content="+"
          style={this.add_new_style}
        />
      </div>
    );
    return (
      <div className="events-container">
        {add_new}
        {events}
      </div>
    );
  }

  generateBlogsArea() {
    const blogs = this.state.blogs.map(blog => (
      <div key={blog.id}>
        <BlogCard blog={blog} setBlogDetail={this.handleBlogCardClick} />
      </div>
    ));

    const add_new = (
      <BlogCard
        blog={{ id: "add_new" }}
        setBlogDetail={this.handleBlogCardClick}
        content="+"
        style={this.add_new_style}
      />
    );

    return (
      <div className="blogs-container">
        <div>
          {add_new}
          {blogs}
        </div>
      </div>
    );
  }

  generateCoachArea() {
    const coach_caruosel = this.generateCarouselArea(
      this.state.alumnihome.additional_banners,
      "side"
    );

    const add_new = (
      <div>
        <div
          className="add-new-button"
          style={this.add_new_style}
          onClick={() => this.setState({ addCoachVisible: true })}
        >
          +
        </div>
        <AddCoachModal
          visible={this.state.addCoachVisible}
          handleCancel={this.closeAddCoachModal}
          handleTokenExpiration={this.props.handleTokenExpiration}
          alert={this.props.alert}
          cookie={this.props.cookie}
        />
      </div>
    );

    return (
      <div className="coach-area" id="coach-area">
        {add_new}
        {coach_caruosel}
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

    const addNewVideoStyle = Object.assign({}, this.add_new_style);
    addNewVideoStyle.marginRight = 80;

    const add_new = (
      <div>
        <div
          className="add-new-button"
          style={addNewVideoStyle}
          onClick={() => this.setState({ addVideoVisible: true })}
        >
          +
        </div>
        <AddVideoModal
          visible={this.state.addVideoVisible}
          handleCancel={this.closeAddVideoModal}
          alert={this.props.alert}
        />
      </div>
    );

    return (
      <div className="videos-area">
        {add_new}
        {videos}
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
      return <Spinner message="Preparing admin dashboard..." />;
    if (this.state.isInitialRequest === false) {
      return (
        <div>
          <div className="career-service-dashboard-container">
            {header("Recent Events")}
            {this.generateEventsArea()}
            {header("Recent Blogs")}
            {this.generateBlogsArea()}
            {header("Coaches")}
            {this.generateCoachArea()}
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

export default CareerServiceDashboard;
