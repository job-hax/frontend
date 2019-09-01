import React from "react";
import { Icon } from "antd";
import parse from "html-react-parser";

import { axiosCaptcha } from "../../utils/api/fetch_api";
import { apiRoot } from "../../utils/constants/endpoints";
import {
  IS_CONSOLE_LOG_OPEN,
  makeTimeBeautiful
} from "../../utils/constants/constants.js";

import "./style.scss";

class BlogCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      blog: {}
    };

    this.handleBlogCardClick = this.handleBlogCardClick.bind(this);
  }

  handleBlogCardClick(blog) {
    this.props.setBlogDetail(blog.id);
    this.postBlogStats("view");
  }

  generateBlogCard() {
    const { blog } = this.props;
    let longDate = makeTimeBeautiful(blog.created_at, "longDate");
    let photoUrl =
      blog.publisher_profile.profile_photo.substring(0, 4) == "http"
        ? blog.publisher_profile.profile_photo
        : apiRoot + blog.publisher_profile.profile_photo;
    return (
      <div
        className="blog-card-container"
        onClick={() => this.handleBlogCardClick(blog)}
      >
        <div className="blog-card-initial">
          <div className="blog-card-left">
            <div className="blog-name">{blog.title}</div>
            <div className="blog-card-info">{blog.snippet}</div>
            <div className="blog-author">
              <div className="blog-author-avatar">
                <img src={photoUrl} />
              </div>
              <div>
                <div className="name">
                  {blog.publisher_profile.first_name +
                    " " +
                    blog.publisher_profile.last_name}
                </div>
                <div className="info-container">
                  <div className="info">{longDate.split(",")[1]}</div>
                  <div className="info">
                    <Icon type="dashboard" />
                    {" " + Math.round(blog.word_count / 200, 0) + " min"}
                  </div>
                  <div className="info">
                    <Icon type="read" />
                    {" " + blog.view_count}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="blog-card-right">
            <img src={apiRoot + blog.header_image} />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return <div>{this.generateBlogCard()}</div>;
  }
}

export default BlogCard;
