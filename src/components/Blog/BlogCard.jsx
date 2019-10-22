import React from "react";
import { Icon } from "antd";
import moment from "moment";

import { apiRoot } from "../../utils/constants/endpoints";
import {
  imageIcon,
  MEDIUM_MD_FORMAT
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
  }

  generateBlogCard() {
    const { blog } = this.props;
    let photoUrl =
      blog.publisher_profile.profile_photo != ("" || null)
        ? apiRoot + blog.publisher_profile.profile_photo
        : "../../../src/assets/icons/User@3x.png";

    const headerImage = blog.header_image ? (
      <img src={apiRoot + blog.header_image} />
    ) : (
      imageIcon
    );
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
                  <div className="info">
                    {moment(blog.created_at).format(MEDIUM_MD_FORMAT)}
                  </div>
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
          <div className="blog-card-right">{headerImage}</div>
        </div>
      </div>
    );
  }

  generateAddNewBlogCard(style, content) {
    return (
      <div
        className="blog-card-container"
        onClick={() => this.props.setBlogDetail("add_new")}
        style={style}
      >
        {content}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.props.blog.id === "add_new"
          ? this.generateAddNewBlogCard(this.props.style, this.props.content)
          : this.generateBlogCard()}
      </div>
    );
  }
}

export default BlogCard;
