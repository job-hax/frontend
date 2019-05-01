import React from "react";
import { List, Avatar, Icon } from "antd";
import parse from "html-react-parser";

import Spinner from "../Partials/Spinner/Spinner.jsx";
import Footer from "../Partials/Footer/Footer.jsx";
import { fetchApi } from "../../utils/api/fetch_api";
import { getBlogRequest, getBlogsRequest } from "../../utils/api/requests.js";
import { makeTimeBeautiful } from "../../utils/constants/constants.js";

import "./style.scss";
import "../../assets/libraryScss/antd-scss/antd.scss";

const IconText = ({ type, text }) => (
  <span style={{ marginTop: 20, marginRight: 12 }}>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

class Blog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRequested: false,
      blogList: [],
      isDetailRequested: false,
      isDetailsShowing: false,
      blog: {}
    };

    this.getBlogDetail = this.getBlogDetail.bind(this);
  }

  componentDidUpdate() {
    if (this.props.token && this.props.active && !this.state.isRequested) {
      getBlogsRequest.config.headers.Authorization = this.props.token;
      fetchApi(getBlogsRequest.url, getBlogsRequest.config).then(response => {
        if (response.ok) {
          this.setState({
            isRequested: true
          });
          this.setState({
            blogList: response.json.data
          });
          console.log(this.state.blogList);
        }
      });
    }
  }

  getBlogDetail(blogId) {
    getBlogRequest.config.headers.Authorization = this.props.token;
    fetchApi(getBlogRequest.url(blogId), getBlogsRequest.config).then(
      response => {
        if (response.ok) {
          this.setState({
            blog: response.json.data
          });
          this.setState({ isDetailsShowing: true });
          console.log(this.state.blog.content);
        }
      }
    );
  }

  handleSeeMore(blogId) {
    this.setState({ isDetailRequested: !this.state.isDetailRequested });
    this.getBlogDetail(blogId);
  }

  generateHeaderArea() {
    return (
      <section style={{ height: "32vh" }} className="header_area">
        <div style={{ marginTop: "100px" }}>
          <h2 style={{ fontSize: "300%" }}>JOBHAX BLOG</h2>
        </div>
      </section>
    );
  }

  generateBlogCard(title, snippet, postDate, image, blogId) {
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
                <div className="blog-name">{title}</div>
                <span className="date">{postDate}</span>
              </div>
            </div>
            <div className="blog-card-info">{snippet}</div>
            {this.state.isDetailsShowing && blogId == this.state.blog.id ? (
              <div
                onClick={() => this.setState({ isDetailsShowing: false })}
                className="details-button"
              >
                Less detail...
              </div>
            ) : (
              <div
                onClick={() => this.handleSeeMore(blogId)}
                className="details-button"
              >
                See details...
              </div>
            )}
          </div>
          <div className="blog-card-right">
            <img src={image} />
          </div>
        </div>
        {this.state.isDetailsShowing == true &&
          blogId == this.state.blog.id && (
            <div>{parse(`${this.state.blog.content}`)}</div>
          )}
      </div>
    );
  }

  mapBlogs() {
    return this.state.blogList.map(blog => (
      <div key={blog.id}>
        {this.generateBlogCard(
          blog.title,
          blog.snippet,
          makeTimeBeautiful(blog.created_at, "dateandtime"),
          blog.image,
          blog.id
        )}
      </div>
    ));
  }

  render() {
    if (this.state.blogList.length == 0)
      return <Spinner message="Reachings blogs..." />;
    return (
      <div className="under_constrution-container">
        <div>{this.generateHeaderArea()}</div>
        <div className="blog-container">
          <div>{this.mapBlogs()}</div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Blog;
