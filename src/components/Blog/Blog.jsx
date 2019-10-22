import React from "react";
import { Pagination, Icon, Affix, Button } from "antd";
import { Redirect } from "react-router-dom";

import Spinner from "../Partials/Spinner/Spinner.jsx";
import Footer from "../Partials/Footer/Footer.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import {
  USER_TYPES,
  MEDIUM_MD_FORMAT
} from "../../utils/constants/constants.js";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";
import { apiRoot, USERS, BLOGS } from "../../utils/constants/endpoints.js";
import BlogDetails from "./BlogDetails.jsx";
import BlogEditable from "./BlogEditable.jsx";
import BlogCard from "./BlogCard.jsx";

import "./style.scss";
import moment from "moment";

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
      edit:
        window.location.search
          .split("&")
          .slice(-1)[0]
          .split("=")[1] == "true"
          ? true
          : false,
      editRequested: false,
      edit_blog_id:
        window.location.search
          .split("&")
          .slice(-1)[0]
          .split("=")[1] != "true"
          ? null
          : window.location.search
              .split("&")
              .slice(-1)[0]
              .split("=")[0] == "edit"
          ? window.location.search.split("&")[0].split("=")[1]
          : null,
      detail_blog_id:
        window.location.search
          .split("&")
          .slice(-1)[0]
          .split("=")[1] != "true"
          ? window.location.search.split("=")[1]
          : null,
      detail_blog: {},
      user_type: this.props.cookie("get", "user_type"),
      editable_blog: {
        content: "",
        created_at: new Date().toISOString(),
        downvote: 0,
        header_image: "",
        id: null,
        is_publish: false,
        is_public: false,
        title: "",
        upvote: 0,
        view_count: 0,
        voted: 0,
        snippet: "",
        publisher_profile: this.props.user,
        updated_at: null,
        user_types: [{ id: 3 }, { id: 4 }]
      }
    };

    this.getData = this.getData.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.setBlogDetail = this.setBlogDetail.bind(this);
    this.setBlogEdit = this.setBlogEdit.bind(this);
  }

  async componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      this.setState({ isInitialRequest: true });
      if (this.state.detail_blog_id == null) {
        if (this.state.edit_blog_id == null) {
          await this.getData("initialRequest");
        } else {
          await this.getData("editRequest");
        }
      } else {
        await this.getData("detailedRequest");
      }
      let config = { method: "POST" };
      axiosCaptcha(USERS("verifyRecaptcha"), config, "blog").then(response => {
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
    let path = window.location.pathname;
    let exclusivity =
      this.state.user_type.id !== USER_TYPES["career_services"]
        ? ""
        : path === "/student/blogs"
        ? "&student=true"
        : path === "/alumni/blogs"
        ? "&student=false"
        : "";
    this.setState({ isWaitingResponse: true });
    let config = { method: "GET" };
    let newUrl =
      this.state.detail_blog_id == null && this.state.edit_blog_id == null
        ? BLOGS +
          "?page=" +
          this.state.pageNo +
          "&page_size=" +
          this.state.pageSize +
          exclusivity
        : this.state.edit_blog_id == null
        ? BLOGS + this.state.detail_blog_id + "/"
        : BLOGS + this.state.edit_blog_id + "/";
    await this.props.handleTokenExpiration("blog getData");
    axiosCaptcha(newUrl, config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
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
          } else if (requestType === "editRequest") {
            if (response.data.data.mine) {
              this.setState({
                editable_blog: response.data.data
              });
            }
            this.setState({
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

  setBlogEdit(blog) {
    this.setState({
      edit: true,
      editRequested: true,
      edit_blog_id: blog.id,
      editable_blog: blog
    });
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
          <div style={{ width: "100%" }}>{this.mapBlogs()}</div>
        </div>
        <div className="pagination-container">
          <Pagination
            onChange={this.handlePageChange}
            defaultCurrent={this.state.pagination.current_page}
            current={this.state.pagination.current_page}
            pageSize={this.state.pageSize}
            total={this.state.pagination.total_count}
          />
        </div>
      </div>
    );
  }

  generateFeaturedBlog() {
    const blog = this.state.blogList[0];
    let photoUrl =
      blog.publisher_profile.profile_photo != ("" || null)
        ? apiRoot + blog.publisher_profile.profile_photo
        : "../../../src/assets/icons/User@3x.png";

    const featuredBlog = (
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
            <div>
              <Button onClick={() => this.setBlogDetail(blog.id)}>
                Read More
              </Button>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        {window.screen.availWidth < 800 || window.innerHeight < 600 ? (
          featuredBlog
        ) : (
          <Affix offsetTop={80}>{featuredBlog}</Affix>
        )}
      </div>
    );
  }

  render() {
    const footerClass =
      this.state.edit || this.state.detail_blog_id
        ? ""
        : this.state.blogList.length > 3
        ? ""
        : "bottom-fixed-footer";
    if (this.state.isInitialRequest === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    else if (this.state.isInitialRequest === true)
      return <Spinner message="Preparing blogs..." />;
    else if (this.state.editRequested == true) {
      return (
        <Redirect
          to={
            "action?type=redirect&/blogs?id=" +
            this.state.edit_blog_id +
            "&edit=true"
          }
        />
      );
    } else if (
      this.state.edit == true &&
      !this.state.user_type.blog_creation_enabled
    ) {
      return <Redirect to={"action?type=redirect&/blogs"} />;
    }
    return (
      <div>
        <div className="blog-page-container">
          {this.state.edit != true ? (
            <div>
              {this.state.detail_blog_id == null ? (
                <div className="blog-page-main-container">
                  {this.state.blogList.length >= 1 && (
                    <div>{this.generateFeaturedBlog()}</div>
                  )}
                  {this.state.blogList.length > 1 && (
                    <div>{this.generateBlogsList()}</div>
                  )}
                </div>
              ) : (
                <BlogDetails
                  blog={this.state.detail_blog}
                  handleTokenExpiration={this.props.handleTokenExpiration}
                  setBlogEdit={this.setBlogEdit}
                  cookie={this.props.cookie}
                />
              )}
            </div>
          ) : (
            <div>
              <BlogEditable
                blog={this.state.editable_blog}
                handleTokenExpiration={this.props.handleTokenExpiration}
                cookie={this.props.cookie}
                alert={this.props.alert}
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
