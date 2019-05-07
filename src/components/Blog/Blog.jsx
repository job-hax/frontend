import React from "react";
import { Pagination, Icon } from "antd";
import { ReCaptcha } from "react-recaptcha-v3";

import Spinner from "../Partials/Spinner/Spinner.jsx";
import Footer from "../Partials/Footer/Footer.jsx";
import { fetchApi } from "../../utils/api/fetch_api";
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
    this.verifyReCaptchaCallback = this.verifyReCaptchaCallback.bind(this);
  }

  componentDidMount() {
    this.getData("initialRequest");
  }

  componentDidUpdate() {
    if (this.props.active === true) {
      if (this.state.isInitialRequest === "beforeRequest") {
        this.setState({ isInitialRequest: true });
        this.getData("initialRequest");
      }
      if (this.state.isNewPageRequested === true) {
        this.getData("newPageRequest");
        this.setState({ isNewPageRequested: false });
      }
    }
  }

  verifyReCaptchaCallback(recaptchaToken) {
    IS_CONSOLE_LOG_OPEN &&
      console.log("\n\nyour recaptcha token:", recaptchaToken, "\n");
    postUsersRequest.config["body"] = JSON.stringify({
      recaptcha_token: recaptchaToken,
      action: "blog"
    });
    fetchApi(
      postUsersRequest.url("verify_recaptcha/"),
      postUsersRequest.config
    ).then(response => {
      if (response.ok) {
        if (response.json.success != true) {
          this.setState({ isUpdating: false });
          console.log(response, response.json.error_message);
          this.props.alert(
            5000,
            "error",
            "Error: " + response.json.error_message
          );
        }
      }
      postUsersRequest.config["body"] = {};
    });
  }

  getData(requestType) {
    this.setState({ isWaitingResponse: true });
    IS_CONSOLE_LOG_OPEN &&
      console.log(
        "companies token",
        this.props.token,
        "\nactive?",
        this.props.active
      );
    const { url, config } = getBlogsRequest;
    let newUrl =
      url + "?page=" + this.state.pageNo + "&page_size=" + this.state.pageSize;
    config.headers.Authorization = this.props.token;
    getBlogsRequest.config.headers.Authorization = this.props.token;
    fetchApi(newUrl, config).then(response => {
      if (response.ok) {
        if (requestType === "initialRequest") {
          this.setState({
            blogList: response.json.data,
            pagination: response.json.pagination,
            isWaitingResponse: false,
            isInitialRequest: false
          });
        } else if (requestType === "newPageRequest") {
          this.setState({
            blogList: response.json.data,
            pagination: response.json.pagination,
            isWaitingResponse: false,
            isNewPageRequested: false
          });
        }
        IS_CONSOLE_LOG_OPEN &&
          console.log(
            "BlogRequest Response",
            response.json,
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
          token={this.props.token}
          alert={this.props.alert}
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
          <div>
            <ReCaptcha
              sitekey="6LfOH6IUAAAAAL4Ezv-g8eUzkkERCWlnnPq_SdkY"
              action="blog"
              verifyCallback={this.verifyReCaptchaCallback}
            />
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
