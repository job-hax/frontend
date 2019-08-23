import React from "react";
import { Icon, Button, Affix } from "antd";
import parse from "html-react-parser";

import "./style.scss";
import {
  makeTimeBeautiful,
  IS_CONSOLE_LOG_OPEN
} from "../../utils/constants/constants";
import { apiRoot } from "../../utils/constants/endpoints";
import { postBlogRequest } from "../../utils/api/requests";
import { axiosCaptcha } from "../../utils/api/fetch_api";

class BlogDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLinkDisplaying: false,
      viewCount: null,
      isDetailRequested: false,
      isDetailsShowing: false,
      upVote: null,
      downVote: null,
      upVote: null,
      downVote: null,
      voted: null,
      snippet: " "
    };

    this.postBlogStats = this.postBlogStats.bind(this);
  }

  componentDidMount() {
    this.setState({
      viewCount: this.props.blog.view_count + 1,
      upVote: this.props.blog.upvote,
      downVote: this.props.blog.downvote
    });
    this.postBlogStats("view");
  }

  async postBlogStats(type) {
    if (type == "upvote" && this.state.upVoted) {
      return;
    } else if (type == "downvote" && this.state.downVoted) {
      return;
    } else {
      let newUrl = postBlogRequest.url(this.props.blog.id) + "/" + type + "/";
      await this.props.handleTokenExpiration("blogCard postBlogStats");
      axiosCaptcha(newUrl, postBlogRequest.config, "blog_stats").then(
        response => {
          if (response.statusText === "OK") {
            if (response.data.success === true) {
              IS_CONSOLE_LOG_OPEN && console.log(response.data);
              if (type === "upvote") {
                this.setState({
                  upVoted: true,
                  downVoted: false,
                  upVote: response.data.data.upvote,
                  downVote: response.data.data.downvote
                });
              }
              if (type === "downvote") {
                this.setState({
                  upVoted: false,
                  downVoted: true,
                  upVote: response.data.data.upvote,
                  downVote: response.data.data.downvote
                });
              }
              if (type === "view") {
                this.setState({
                  snippet: response.data.data.snippet
                });
              }
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
        }
      );
    }
  }

  generateBlogHeader() {
    const { blog } = this.props;
    let photoUrl =
      blog.publisher_profile.profile_photo.substring(0, 4) == "http"
        ? blog.publisher_profile.profile_photo
        : apiRoot + blog.publisher_profile.profile_photo;
    let time = makeTimeBeautiful(blog.created_at, "dateandtime");
    let longDate = makeTimeBeautiful(blog.created_at, "longDate");
    let joinDate = makeTimeBeautiful(
      blog.publisher_profile.date_joined,
      "longDate"
    );
    return (
      <div className="blog-header">
        <div className="blog-datebox">
          <div className="day">{time.split("-")[0]}</div>
          <div className="month">{time.split("-")[1].toUpperCase()}</div>
        </div>
        <div className="blog-info">
          <div className="title">{blog.title}</div>
          <div className="snippet">{this.state.snippet}</div>
          <div className="info-container">
            <div className="info">
              {longDate + " at " + time.split("at")[1]}
            </div>
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
                  <div>
                    {"joined" +
                      joinDate.split(",")[1] +
                      "," +
                      joinDate.split(",")[2]}
                  </div>
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
    const upVoteType = this.state.upVoted ? "primary" : "";
    const downVoteType = this.state.downVoted ? "primary" : "";
    return (
      <div className="blog-body">
        <div className="blog-data">
          <div className="blog-photo">
            <img src={apiRoot + blog.header_image} />
          </div>
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
    history.pushState(null, null, location.href);
    window.onpopstate = function() {
      window.location.assign("blogs");
    };
    return (
      <div className="blog-details">
        {this.generateBlogHeader()}
        {this.generateBlogBody()}
      </div>
    );
  }
}

export default BlogDetails;
