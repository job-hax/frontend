import React from "react";
import { Pagination, Icon, Affix, Button } from "antd";

import Spinner from "../Partials/Spinner/Spinner.jsx";
import Footer from "../Partials/Footer/Footer.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import { getBlogsRequest, postUsersRequest } from "../../utils/api/requests.js";
import { makeTimeBeautiful } from "../../utils/constants/constants.js";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";
import BlogCard from "./BlogCard.jsx";

import "./style.scss";
import { apiRoot } from "../../utils/constants/endpoints.js";
import BlogDetails from "./BlogDetails.jsx";
import BlogEditable from "./BlogEditable.jsx";

class Blog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isWaitingResponse: false,
      isInitialRequest: "beforeRequest",
      isNewPageRequested: false,
      blogList: [],
      pagination: {},
      pageNo: 1,
      pageSize: 10,
      edit: false,
      detail_blog_id: window.location.search.split("=")[1] || null,
      detail_blog: {},
      user_type: this.props.cookie("get", "user_type"),
      editable_blog: {
        content: "",
        created_at: new Date().toISOString(),
        downvote: 0,
        header_image: "",
        id: null,
        is_published: false,
        title: "",
        upvote: 0,
        view_count: 0,
        voted: 0,
        snippet: ""
      }
    };

    this.getData = this.getData.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.setBlogDetail = this.setBlogDetail.bind(this);
  }

  async componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      this.setState({ isInitialRequest: true });
      if (this.state.detail_blog_id == null) {
        await this.getData("initialRequest");
      } else {
        await this.getData("detailedRequest");
      }
      axiosCaptcha(
        postUsersRequest.url("verify_recaptcha"),
        postUsersRequest.config,
        "blog"
      ).then(response => {
        if (response.statusText === "OK") {
          if (response.data.success != true) {
            IS_CONSOLE_LOG_OPEN &&
              console.log(response, response.data.error_message);
            this.props.alert(
              5000,
              "error",
              "Error: " + response.data.error_message
            );
          }
        }
      });
    }
  }

  componentDidUpdate() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      if (this.state.isNewPageRequested === true) {
        this.getData("newPageRequest");
        this.setState({ isNewPageRequested: false });
      }
    }
  }

  async getData(requestType) {
    this.setState({ isWaitingResponse: true });
    const { url, config } = getBlogsRequest;
    let newUrl =
      this.state.detail_blog_id == null
        ? url +
          "?page=" +
          this.state.pageNo +
          "&page_size=" +
          this.state.pageSize
        : url + this.state.detail_blog_id + "/";
    await this.props.handleTokenExpiration("blog getData");
    axiosCaptcha(newUrl, config).then(response => {
      if (response.statusText === "OK") {
        if (requestType === "initialRequest") {
          this.setState({
            blogList: response.data.data,
            pagination: response.data.pagination,
            isWaitingResponse: false,
            isInitialRequest: false
          });
        } else if (requestType === "newPageRequest") {
          this.setState({
            blogList: response.data.data,
            pagination: response.data.pagination,
            isWaitingResponse: false,
            isNewPageRequested: false
          });
        } else if (requestType === "detailedRequest") {
          this.setState({
            detail_blog: response.data.data,
            isWaitingResponse: false,
            isInitialRequest: false
          });
        }
        IS_CONSOLE_LOG_OPEN &&
          console.log(
            "BlogRequest Response",
            response.data,
            this.state.pagination
          );
      }
    });
  }

  async setBlogDetail(id) {
    let blog = this.state.blogList.filter(blog => id == blog.id)[0];
    await this.setState({
      detail_blog_id: id,
      detail_blog: blog
    });
    this.getData("detailedRequest");
  }

  handlePageChange(page) {
    this.setState({ pageNo: page, isNewPageRequested: true });
  }

  mapBlogs() {
    return this.state.blogList.slice(1).map(blog => (
      <div key={blog.id}>
        <BlogCard
          blog={blog}
          setBlogDetail={this.setBlogDetail}
          alert={this.props.alert}
          handleTokenExpiration={this.props.handleTokenExpiration}
        />
      </div>
    ));
  }

  generateBlogsList() {
    return (
      <div>
        <div className="blog-container">
          <div>{this.mapBlogs()}</div>
        </div>
        <div className="pagination-container">
          <Pagination
            onChange={this.handlePageChange}
            defaultCurrent={this.state.pagination.current_page}
            current={this.state.pagination.current_page}
            total={this.state.pagination.total_count}
          />
        </div>
      </div>
    );
  }

  generateFeaturedBlog() {
    const blog = this.state.blogList[0];
    let longDate = makeTimeBeautiful(blog.created_at, "longDate");
    let photoUrl =
      blog.publisher_profile.profile_photo.substring(0, 4) == "http"
        ? blog.publisher_profile.profile_photo
        : apiRoot + blog.publisher_profile.profile_photo;
    return (
      <div>
        <Affix offsetTop={80}>
          <div className="featured-blog">
            <div className="header-photo">
              <img src={apiRoot + blog.header_image} />
            </div>
            <div className="blog-card-left">
              <div className="blog-name">{blog.title}</div>
              <div className="blog-card-info">{blog.snippet}</div>
              <div className="blog-card-footer">
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
                <div>
                  <Button onClick={() => this.setBlogDetail(blog.id)}>
                    Read More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Affix>
      </div>
    );
  }

  render() {
    const footerClass =
      this.state.blogList.length > 3 ? "" : "bottom-fixed-footer";
    if (this.state.isInitialRequest === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    else if (this.state.isInitialRequest === true)
      return <Spinner message="Preparing blogs..." />;
    return (
      <div>
        <div className="blog-page-container">
          {this.state.edit != true ? (
            <div>
              {this.state.detail_blog_id == null ? (
                <div className="blog-page-main-container">
                  <div>{this.generateFeaturedBlog()}</div>
                  <div>{this.generateBlogsList()}</div>
                </div>
              ) : (
                <BlogDetails
                  blog={this.state.detail_blog}
                  handleTokenExpiration={this.props.handleTokenExpiration}
                />
              )}
              {this.state.user_type == 2 && (
                <div className="fixed-button">
                  <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    onClick={() => this.setState({ edit: true })}
                  >
                    <Icon type="plus" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <BlogEditable
                blog={this.state.editable_blog}
                publisher={this.props.user}
                handleTokenExpiration={this.props.handleTokenExpiration}
              />
            </div>
          )}
        </div>
        <div className={footerClass}>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Blog;
