import React from "react";
import { Table, Modal, Button, Pagination } from "antd";
import moment from "moment";

import { BLOGS } from "../../../utils/constants/endpoints.js";
import { axiosCaptcha } from "../../../utils/api/fetch_api.js";
import { DATE_AND_TIME_FORMAT } from "../../../utils/constants/constants.js";
import Spinner from "../../Partials/Spinner/Spinner.jsx";
import BlogCard from "../../Blog/BlogCard.jsx";
import BlogDetails from "../../Blog/BlogDetails.jsx";

import "./style.scss";
class BlogApproval extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isWaitingResponse: false,
      isInitialRequest: "beforeRequest",
      isNewPageRequested: false,
      redirect: "",
      pageNo: 1,
      pageSize: 10,
      pagination: {},
      blogList: [],
      detail_blog: {},
      detail_blog_id: null,
      visible: false
    };

    this.handleBlogCardClick = this.handleBlogCardClick.bind(this);
    this.handleModalCancel = this.handleModalCancel.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleApprove = this.handleApprove.bind(this);
    this.handleReject = this.handleReject.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.approveButton = id => (
      <Button
        key="approve"
        type="primary"
        onClick={() => this.handleApprove(id)}
        style={{ width: "105px" }}
      >
        Approve
      </Button>
    );

    this.rejectButton = id => (
      <Button
        key="reject"
        onClick={() => this.handleReject(id)}
        style={{ width: "105px", marginRight: "12px" }}
      >
        Reject
      </Button>
    );
  }

  componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      this.setState({ isInitialRequest: true });
      this.getData("initialRequest");
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
    let config = { method: "GET" };
    let newUrl =
      this.state.detail_blog_id == null
        ? BLOGS +
          "?page=" +
          this.state.pageNo +
          "&page_size=" +
          this.state.pageSize +
          "&waiting=true"
        : BLOGS + this.state.detail_blog_id + "/";
    await this.props.handleTokenExpiration("blogApproval getData");
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
              isInitialRequest: false,
              visible: true
            });
          }
        }
      }
    });
  }

  async handleBlogCardClick(id) {
    await this.setState({ detail_blog_id: id });
    this.getData("detailedRequest");
  }

  handleModalCancel() {
    this.setState({ visible: false, detail_blog_id: null, detail_blog: {} });
  }

  handlePageChange(page) {
    this.setState({
      pageNo: page,
      isNewPageRequested: true,
      detail_blog_id: null
    });
  }

  async handleSubmit(decision, id) {
    let approval = decision === "approve" ? true : false;
    let config = { method: "PATCH" };
    config.body = { blog_id: id, approved: approval };
    await this.props.handleTokenExpiration("blogApproval decision");
    axiosCaptcha(BLOGS, config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          let updatedList = this.state.blogList;
          updatedList = updatedList.filter(blog => blog.id !== id);
          this.setState({ blogList: updatedList });
          this.handleModalCancel();
        } else {
          this.props.alert(
            5000,
            "error",
            "Error: " + response.data.error_message
          );
        }
      }
    });
  }

  handleApprove(id) {
    this.handleSubmit("approve", id);
  }

  handleReject(id) {
    this.handleSubmit("reject", id);
  }

  generateApprovalList() {
    const columns = [
      { title: "Author", dataIndex: "author", key: "author" },
      { title: "Type", dataIndex: "type", key: "type" },
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Length", dataIndex: "lenght", key: "lenght" },
      { title: "Request Date", dataIndex: "request_date", key: "request_date" },
      { title: "Pending", dataIndex: "pending", key: "pending" },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        render: record => (
          <div style={{ display: "flex" }}>
            {this.rejectButton(record.key)}
            {this.approveButton(record.key)}
          </div>
        )
      }
    ];

    const data = this.state.blogList.map(blog => {
      return {
        key: blog.id,
        author:
          blog.publisher_profile.first_name +
          " " +
          blog.publisher_profile.last_name,
        type: blog.user_types[0].name,
        title: blog.title,
        lenght: blog.word_count + " words",
        request_date: moment(blog.updated_at).format(DATE_AND_TIME_FORMAT),
        pending:
          Math.round(
            (new Date() - new Date(blog.updated_at)) / (1000 * 60 * 60 * 24)
          ) + " days",
        details: blog
      };
    });

    return (
      <div className="approval-list-container">
        <Table
          columns={columns}
          expandedRowRender={record => (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <BlogCard
                blog={record.details}
                setBlogDetail={this.handleBlogCardClick}
                alert={this.props.alert}
                handleTokenExpiration={this.props.handleTokenExpiration}
              />
              {this.state.visible && (
                <Modal
                  visible={this.state.visible}
                  title="Waiting Approval"
                  onCancel={this.handleModalCancel}
                  width="80vw"
                  getContainer={false}
                  footer={[
                    this.rejectButton(this.state.detail_blog_id),
                    this.approveButton(this.state.detail_blog_id)
                  ]}
                >
                  <BlogDetails
                    blog={this.state.detail_blog}
                    handleTokenExpiration={this.props.handleTokenExpiration}
                    setBlogEdit={false}
                    cookie={this.props.cookie}
                  />
                </Modal>
              )}
            </div>
          )}
          dataSource={data}
          pagination={false}
        />
        <Pagination
          onChange={this.handlePageChange}
          defaultCurrent={this.state.pagination.current_page}
          current={this.state.pagination.current_page}
          pageSize={this.state.pageSize}
          total={this.state.pagination.total_count}
        />
      </div>
    );
  }

  render() {
    if (this.state.isInitialRequest === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    else if (this.state.isInitialRequest === true)
      return <Spinner message="Preparing waiting blogs..." />;
    return <div>{this.generateApprovalList()}</div>;
  }
}

export default BlogApproval;
