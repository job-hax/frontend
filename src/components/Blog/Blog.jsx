import React from "react";
import { Pagination, Icon } from "antd";

import Spinner from "../Partials/Spinner/Spinner.jsx";
import Footer from "../Partials/Footer/Footer.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import { getBlogsRequest, postUsersRequest } from "../../utils/api/requests.js";
import { makeTimeBeautiful } from "../../utils/constants/constants.js";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";
import BlogCard from "./BlogCard.jsx";

import "./style.scss";

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
            this.setState({ isUpdating: false });
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
    await this.props.handleTokenExpiration();
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

  generateHeaderArea() {
    return (
      <section style={{ height: "32vh" }} className="header_area">
        <div style={{ marginTop: "100px" }}>
          <h2 style={{ fontSize: "300%" }}>JOBHAX BLOG</h2>
        </div>
      </section>
    );
  }

  mapBlogs() {
    return this.state.blogList.map(blog => (
      <div key={blog.id}>
        <BlogCard
          title={blog.title}
          snippet={blog.snippet}
          time={makeTimeBeautiful(blog.created_at, "dateandtime")}
          image={blog.image}
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

  render() {
    if (this.state.blogList.length == 0)
      return <Spinner message="Reachings blogs..." />;
    return (
      <div>
        <div className="under_constrution-container">
          <div>{this.generateHeaderArea()}</div>
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
          <div className="footer-blog">
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

export default Blog;
