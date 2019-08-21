import React from "react";
import { Pagination, Icon, Affix } from "antd";

import Spinner from "../Partials/Spinner/Spinner.jsx";
import Footer from "../Partials/Footer/Footer.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import { getBlogsRequest, postUsersRequest } from "../../utils/api/requests.js";
import { makeTimeBeautiful } from "../../utils/constants/constants.js";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";
import BlogCard from "./BlogCard.jsx";

import "./style.scss";
import { apiRoot } from "../../utils/constants/endpoints.js";

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
      pageSize: 10
    };

    this.getData = this.getData.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  async componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      this.setState({ isInitialRequest: true });
      await this.getData("initialRequest");
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
      url + "?page=" + this.state.pageNo + "&page_size=" + this.state.pageSize;
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

  handlePageChange(page) {
    this.setState({ pageNo: page, isNewPageRequested: true });
  }

  mapBlogs() {
    return this.state.blogList.map(blog => (
      <div key={blog.id}>
        <BlogCard
          blog={blog}
          time={makeTimeBeautiful(blog.created_at, "dateandtime")}
          image={apiRoot + blog.header_image}
          id={blog.id}
          viewCount={blog.view_count}
          upVote={blog.upvote}
          downVote={blog.downvote}
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
    return (
      <div>
        <Affix offset={80}>
          <div className="featured-blog">
            <div className="header-photo">
              <img src={apiRoot + blog.header_image} />
            </div>
            <div className="blog-card-left">
              <div className="blog-name">{blog.title}</div>
              <div className="blog-card-info">{blog.snippet}</div>
              <div className="blog-author">
                <div className="blog-author-avatar">
                  <img src="https://backend.jobhax.com/media/35753f11-c262-4a53-97b1-4d0f9b6bc088_K3cVSao.png" />
                </div>
                <div>
                  <div className="name">Author Name</div>
                  <div className="date">{longDate.split(",")[1]}</div>
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
    if (this.state.blogList.length == 0)
      return <Spinner message="Reachings blogs..." />;
    return (
      <div className="blog-page-container">
        <div className="blog-page-main-container">
          <div>{this.generateFeaturedBlog()}</div>
          <div>{this.generateBlogsList()}</div>
        </div>
        <div className={footerClass}>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Blog;
