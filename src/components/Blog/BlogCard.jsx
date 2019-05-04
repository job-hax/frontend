import React from "react";
import { Icon } from "antd";
import parse from "html-react-parser";

import { fetchApi } from "../../utils/api/fetch_api";
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

  getBlogDetail() {
    getBlogRequest.config.headers.Authorization = this.props.token;
    fetchApi(getBlogRequest.url(this.props.id), getBlogRequest.config).then(
      response => {
        if (response.ok) {
          if (response.json.success === true) {
            this.setState({
              blog: response.json.data
            });
            this.setState({ isDetailsShowing: true });
            IS_CONSOLE_LOG_OPEN && console.log(this.state.blog.content);
          } else {
            this.setState({ isUpdating: false });
            console.log(response, response.json.error_message);
            alert(
              "Error: \n Code " +
                response.json.error_code +
                "\n" +
                response.json.error_message
            );
          }
        } else {
          this.setState({ isUpdating: false });
          alert(
            "Something went wrong! \n Error: \n Code \n " + response.status
          );
        }
      }
    );
  }

  postBlogStats(type) {
    postBlogRequest.config.headers.Authorization = this.props.token;
    let newUrl = postBlogRequest.url(this.props.id) + "/" + type + "/";
    fetchApi(newUrl, postBlogRequest.config).then(response => {
      if (response.ok) {
        if (response.json.success === true) {
          IS_CONSOLE_LOG_OPEN && console.log(response.json);
          if (type === "upvote") {
            this.setState({
              upVote: response.json.data.upvote,
              downVote: response.json.data.downvote
            });
          }
          if (type === "downvote") {
            this.setState({
              upVote: response.json.data.upvote,
              downVote: response.json.data.downvote
            });
          }
          if (type === "view") {
            this.setState({ viewCount: this.state.viewCount + 1 });
          }
        } else {
          console.log(response, response.json.error_message);
          alert(
            "Error: \n Code " +
              response.json.error_code +
              "\n" +
              response.json.error_message
          );
        }
      } else {
        alert("Something went wrong! \n Error: \n Code \n " + response.status);
      }
    });
  }

  handleSeeMore() {
    this.setState({ isDetailRequested: !this.state.isDetailRequested });
    this.getBlogDetail();
    this.postBlogStats("view");
  }

  generateBlogCard() {
    console.log(this.state.isDetailsShowing);
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
          <div>{parse(`${this.state.blog.content}`)}</div>
        )}
      </div>
    );
  }

  render() {
    return <div>{this.generateBlogCard()}</div>;
  }
}

export default BlogCard;
