import React from "react";
import { Icon } from "antd";
import parse from "html-react-parser";

import { axiosCaptcha } from "../../utils/api/fetch_api";
import { getBlogRequest, postBlogRequest } from "../../utils/api/requests.js";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";

import "./style.scss";
import "../../assets/libraryScss/antd-scss/antd.scss";

class BlogCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewCount: null,
      isDetailRequested: false,
      isDetailsShowing: false,
      upVote: null,
      downVote: null,
      voted: null,
      blog: {}
    };

    this.getBlogDetail = this.getBlogDetail.bind(this);
    this.postBlogStats = this.postBlogStats.bind(this);
  }

  componentDidMount() {
    this.setState({
      viewCount: this.props.viewCount,
      upVote: this.props.upVote,
      downVote: this.props.downVote
    });
  }

  // Do not need to check if token expired because when you get blog details you also post BlogsStats which does the check//
  getBlogDetail() {
    axiosCaptcha(getBlogRequest.url(this.props.id), getBlogRequest.config).then(
      response => {
        if (response.statusText === "OK") {
          if (response.data.success === true) {
            this.setState({
              blog: response.data.data
            });
            this.setState({ isDetailsShowing: true });
            IS_CONSOLE_LOG_OPEN && console.log(this.state.blog.content);
          } else {
            this.setState({ isUpdating: false });
            IS_CONSOLE_LOG_OPEN &&
              console.log(response, response.data.error_message);
            this.props.alert(
              5000,
              "error",
              "Error: " + response.data.error_message
            );
          }
        } else {
          this.setState({ isUpdating: false });
          this.props.alert(5000, "error", "Something went wrong!");
        }
      }
    );
  }

  async postBlogStats(type) {
    let newUrl = postBlogRequest.url(this.props.id) + "/" + type + "/";
    await this.props.handleTokenExpiration();
    axiosCaptcha(newUrl, postBlogRequest.config, "blog_stats").then(
      response => {
        if (response.statusText === "OK") {
          if (response.data.success === true) {
            IS_CONSOLE_LOG_OPEN && console.log(response.data);
            if (type === "upvote") {
              this.setState({
                upVote: response.data.data.upvote,
                downVote: response.data.data.downvote
              });
            }
            if (type === "downvote") {
              this.setState({
                upVote: response.data.data.upvote,
                downVote: response.data.data.downvote
              });
            }
            if (type === "view") {
              this.setState({ viewCount: this.state.viewCount + 1 });
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

  handleSeeMore() {
    this.setState({ isDetailRequested: !this.state.isDetailRequested });
    this.getBlogDetail();
    this.postBlogStats("view");
  }

  generateBlogCard() {
    IS_CONSOLE_LOG_OPEN && console.log(this.state.isDetailsShowing);
    return (
      <div className="blog-card-container">
        <div className="blog-card-initial">
          <div className="blog-card-left">
            <div className="blog-card-header">
              <div className="blog-author-avatar">
                <img src="../../../src/assets/icons/SeyfoIcon@3x.png" />
              </div>
              <div>
                <div className="blog-name">{this.props.title}</div>
                <span className="date">{this.props.time}</span>
              </div>
            </div>
            <div className="blog-card-info">{this.props.snippet}</div>
            <div className="blog-stats-container">
              {this.state.isDetailsShowing ? (
                <div
                  onClick={() => this.setState({ isDetailsShowing: false })}
                  className="details-button"
                >
                  Less detail...
                </div>
              ) : (
                <div
                  onClick={() => this.handleSeeMore()}
                  className="details-button"
                >
                  See details...
                </div>
              )}
              <div className="blog-stats">
                <div className="stat">
                  {" "}
                  <Icon type="read" /> {this.state.viewCount}
                </div>
                <div
                  className="stat"
                  onClick={() => this.postBlogStats("upvote")}
                >
                  {" "}
                  <Icon type="like" /> {this.state.upVote}
                </div>
                <div
                  className="stat"
                  onClick={() => this.postBlogStats("downvote")}
                >
                  {" "}
                  <Icon type="dislike" /> {this.state.downVote}
                </div>
              </div>
            </div>
          </div>
          <div className="blog-card-right">
            <img src={this.props.image} />
          </div>
        </div>
        {this.state.isDetailsShowing == true && (
          <div className="blog-card-info">
            {parse(`${this.state.blog.content}`)}
          </div>
        )}
      </div>
    );
  }

  render() {
    return <div>{this.generateBlogCard()}</div>;
  }
}

export default BlogCard;
