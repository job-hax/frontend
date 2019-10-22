import React from "react";
import { Icon, Button, Affix } from "antd";
import parse from "html-react-parser";
import { Redirect } from "react-router-dom";
import moment from "moment";

import {
  IS_CONSOLE_LOG_OPEN,
  USER_TYPES,
  imageIcon,
  LONG_DATE_AND_TIME_FORMAT,
  MEDIUM_DATE_FORMAT
} from "../../utils/constants/constants";
import { apiRoot, BLOGS } from "../../utils/constants/endpoints";
import { axiosCaptcha } from "../../utils/api/fetch_api";

import "./style.scss";

class BlogDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_type: this.props.cookie("get", "user_type"),
      isLinkDisplaying: false,
      viewCount: null,
      upVote: null,
      downVote: null,
      voted: null,
      redirect: null
    };

    this.postBlogStats = this.postBlogStats.bind(this);
  }

  componentDidMount() {
    this.setState({
      viewCount: this.props.blog.view_count + 1,
      upVote: this.props.blog.upvote,
      downVote: this.props.blog.downvote,
      voted: this.props.blog.voted
    });
    this.postBlogStats("view");
  }

  async postBlogStats(type) {
    let vote = this.state.voted;
    let value = type == "upvote" ? 1 : -1;
    let downvote = this.state.downVote;
    let upvote = this.state.upVote;
    console.log("vote", vote, "value", value);
    if (vote == value) {
      vote = 0;
    } else {
      vote = value;
    }
    downvote =
      this.state.voted == -1
        ? this.state.downVote + -1
        : type == "downvote"
        ? this.state.downVote + 1
        : this.state.downVote;
    upvote =
      this.state.voted == 1
        ? this.state.upVote + -1
        : type == "upvote"
        ? this.state.upVote + 1
        : this.state.upVote;
    let body = { action: vote };
    let config = { method: "POST" };
    if (type != "view") {
      config.body = body;
      this.setState({ voted: vote, downVote: downvote, upVote: upvote });
    }
    let requestType = type == "view" ? "view" : "vote";
    let newUrl = BLOGS + this.props.blog.id + "/" + requestType + "/";
    await this.props.handleTokenExpiration("blogCard postBlogStats");
    axiosCaptcha(newUrl, config, false).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success === true) {
          IS_CONSOLE_LOG_OPEN && console.log(response.data);
        } else {
          IS_CONSOLE_LOG_OPEN &&
            console.log(response, response.data.error_message);
          this.props.alert(
            5000,
            "error",
            "Error: " + response.data.error_message
          );
        }
      } else {
        this.props.alert(5000, "error", "Something went wrong!");
      }
    });
  }

  generateBlogHeader() {
    const { blog } = this.props;
    let photoUrl = apiRoot + blog.publisher_profile.profile_photo;

    let longDateAndTime = moment(blog.created_at).format(
      LONG_DATE_AND_TIME_FORMAT
    );
    let joinDate = moment(blog.publisher_profile.date_joined).format(
      MEDIUM_DATE_FORMAT
    );

    return (
      <div className="blog-header">
        <div className="blog-datebox">
          <div className="day">{moment(blog.created_at).format("DD")}</div>
          <div className="month">
            {moment(blog.created_at)
              .format("MMM")
              .toUpperCase()}
          </div>
        </div>
        <div className="blog-info">
          <div className="title">{blog.title}</div>
          <div className="snippet">{blog.snippet}</div>
          <div className="info-container">
            <div className="info">{longDateAndTime}</div>
            <div className="info">
              <Icon type="dashboard" />
              {" " + Math.round(blog.word_count / 200, 0) + " min"}
            </div>
            <div className="info">
              <Icon type="read" />
              {" " + this.state.viewCount}
            </div>
          </div>
          <div className="author-info">
            <div className="author-photo">
              <img src={photoUrl} />
            </div>
            <div className="author-details">
              <div>
                <div className="name">
                  <div>Author</div>
                  <div className="author-name">
                    {blog.publisher_profile.first_name +
                      " " +
                      blog.publisher_profile.last_name}
                  </div>
                </div>
                <div className="details-container">
                  <div>{"joined " + joinDate}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  generateBlogBody() {
    const { blog } = this.props;
    const upVoteType = this.state.voted == 1 ? "primary" : "";
    const downVoteType = this.state.voted == -1 ? "primary" : "";
    const headerImage = blog.header_image ? (
      <img src={apiRoot + blog.header_image} />
    ) : (
      imageIcon
    );
    return (
      <div className="blog-body">
        <div className="blog-data">
          <div className="blog-photo">{headerImage}</div>
          <div className="details-container">
            <div className="details">{parse(`${blog.content}`)}</div>
          </div>
          <div>
            <div className="engagement">
              <div className="engagement-container">
                <div className="button">
                  <Button
                    type={upVoteType}
                    shape="circle"
                    onClick={() => this.postBlogStats("upvote")}
                  >
                    <Icon type="like" />
                  </Button>
                  <div className="engagement-amount">
                    {this.state.upVote == 0
                      ? "Give the first like!"
                      : this.state.upVote + " likes"}
                  </div>
                </div>
                <div className="button">
                  <Button
                    type={downVoteType}
                    shape="circle"
                    onClick={() => this.postBlogStats("downvote")}
                  >
                    <Icon type="dislike" />
                  </Button>
                  <div className="engagement-amount">
                    {this.state.downVote == 0
                      ? "No dislike!"
                      : this.state.downVote + " dislikes"}
                  </div>
                </div>
              </div>
              <div
                className="share-container"
                onMouseEnter={() => this.setState({ isLinkDisplaying: true })}
                onMouseLeave={() => this.setState({ isLinkDisplaying: false })}
              >
                {this.state.isLinkDisplaying == false
                  ? "Share Link"
                  : window.location.port
                  ? window.location.hostname +
                    ":" +
                    window.location.port +
                    "/blogs?id=" +
                    blog.id
                  : window.location.hostname + "/blogs?id=" + blog.id}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    let editButtonDisplay =
      this.props.blog.mine === true &&
      this.state.user_type.id !== USER_TYPES["career_services"];

    const { redirect } = this.state;
    if (redirect !== null) {
      return <Redirect to={redirect} />;
    }
    window.onpopstate = () => {
      this.setState({ redirect: "/action?type=redirect&" + location.pathname });
    };

    const editButton = (
      <div className="fixed-buttons-container">
        <Button
          type="primary"
          shape="circle"
          size="large"
          onClick={() => this.props.setBlogEdit(this.props.blog)}
        >
          <Icon type="edit" />
        </Button>
      </div>
    );

    return (
      <div className="blog-details">
        {editButtonDisplay && editButton}
        {this.generateBlogHeader()}
        {this.generateBlogBody()}
      </div>
    );
  }
}

export default BlogDetails;
