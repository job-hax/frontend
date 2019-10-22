import React from "react";
import { Table, Modal, Button, Pagination, Tag } from "antd";
import moment from "moment";

import { apiRoot, BLOGS } from "../../../utils/constants/endpoints.js";
import { axiosCaptcha } from "../../../utils/api/fetch_api.js";
import {
  USER_TYPE_NAMES,
  USER_TYPES,
  DATE_AND_TIME_FORMAT
} from "../../../utils/constants/constants.js";
import Spinner from "../../Partials/Spinner/Spinner.jsx";
import BlogCard from "../../Blog/BlogCard.jsx";
import BlogDetails from "../../Blog/BlogDetails.jsx";
import BlogEditable from "../../Blog/BlogEditable.jsx";

import "./style.scss";

class BlogManage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isWaitingResponse: false,
      isInitialRequest: "beforeRequest",
      isNewPageRequested: false,
      redirect: "",
      career_service_pageNo: 1,
      alumni_pageNo: 1,
      student_pageNo: 1,
      pageSize: 10,
      career_service_pagination: {},
      alumni_pagination: {},
      student_pagination: {},
      career_service_blog_list: null,
      alumni_blog_list: null,
      student_blog_list: null,
      detail_blog: {},
      detail_blog_id: null,
      stats: null,
      isEditing: false,
      visible: false
    };

    this.handleBlogCardClick = this.handleBlogCardClick.bind(this);
    this.handleModalCancel = this.handleModalCancel.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDeleteRequest = this.handleDeleteRequest.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.parameterMap = {
      career_services: {
        parameter: "&type=" + USER_TYPES["career_services"],
        state: "career_service_blog_list",
        paginationState: "career_service_pagination",
        pageState: "career_service_pageNo"
      },
      alumni: {
        parameter: "&type=" + USER_TYPES["alumni"],
        state: "alumni_blog_list",
        paginationState: "alumni_pagination",
        pageState: "alumni_pageNo"
      },
      student: {
        parameter: "&type=" + USER_TYPES["student"],
        state: "student_blog_list",
        paginationState: "student_pagination",
        pageState: "student_pageNo"
      }
    };

    this.editButton = id => (
      <Button
        key="edit"
        type="primary"
        onClick={() => this.handleEdit(id)}
        style={{ width: "105px", margin: "4px 0px" }}
      >
        Edit
      </Button>
    );

    this.deleteButton = (id, user_type) => (
      <div className="delete-button">
        <Button
          key="delete"
          onClick={() => this.handleDelete(id, user_type)}
          style={{ width: "105px" }}
        >
          Delete
        </Button>
      </div>
    );
  }

  componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      this.setState({ isInitialRequest: true });
      this.getData("initialRequest", "career_services");
      this.getData("initialRequest", "alumni");
      this.getData("initialRequest", "student");
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

  async getData(requestType, parameter) {
    this.setState({ isWaitingResponse: true });
    let config = { method: "GET" };
    let newUrl =
      requestType !== "detailedRequest"
        ? BLOGS +
          "?page=" +
          this.state[this.parameterMap[parameter].pageState] +
          "&page_size=" +
          this.state.pageSize +
          this.parameterMap[parameter].parameter
        : BLOGS + this.state.detail_blog_id + "/";
    await this.props.handleTokenExpiration("blogApproval getData");
    axiosCaptcha(newUrl, config)
      .then(response => {
        if (response.statusText === "OK") {
          if (response.data.success) {
            if (requestType === "initialRequest") {
              this.setState({
                [this.parameterMap[parameter].state]: response.data.data,
                [this.parameterMap[parameter].paginationState]:
                  response.data.pagination,
                isWaitingResponse: false
              });
            } else if (requestType === "newPageRequest") {
              this.setState({
                [this.parameterMap[parameter].state]: response.data.data,
                [this.parameterMap[parameter].paginationState]:
                  response.data.pagination,
                isWaitingResponse: false
              });
            } else if (requestType === "detailedRequest") {
              this.setState({
                detail_blog: response.data.data,
                isWaitingResponse: false,
                visible: true
              });
            }
          }
        }
      })
      .then(() => {
        if (
          this.state.career_service_blog_list &&
          this.state.alumni_blog_list &&
          this.state.student_blog_list
        ) {
          axiosCaptcha(BLOGS + "stats/", config).then(statsResponse => {
            if (statsResponse.statusText === "OK") {
              if (statsResponse.data.success) {
                this.setState({
                  stats: statsResponse.data.data,
                  isWaitingResponse: false,
                  isInitialRequest: false
                });
              }
            }
          });
        }
      });
  }

  async handleBlogCardClick(id) {
    await this.setState({ detail_blog_id: id });
    this.getData("detailedRequest");
  }

  handleModalCancel(user_type) {
    if (this.state.isEditing) {
      this.getData("initialRequest", user_type);
    }
    this.setState({
      visible: false,
      detail_blog_id: null,
      detail_blog: {},
      isEditing: false
    });
  }

  handlePageChange(page) {
    this.setState({
      pageNo: page,
      isNewPageRequested: true,
      detail_blog_id: null
    });
  }

  async handleDeleteRequest(id, user_type) {
    let config = { method: "DELETE" };
    config.body = { blog_id: id };
    await this.props.handleTokenExpiration("blogdelete handle");
    axiosCaptcha(BLOGS, config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          let updatedList = this.state[this.parameterMap[user_type].state];
          updatedList = updatedList.filter(blog => blog.id !== id);
          this.setState({ [this.parameterMap[user_type].state]: updatedList });
          this.handleModalCancel(user_type);
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

  handleEdit(id) {
    this.setState({ isEditing: true });
    !this.state.detailed_blog_id && this.handleBlogCardClick(id);
  }

  async handleDelete(id, user_type) {
    await this.handleDeleteRequest(id, user_type);
    this.getData("initialRequest", user_type);
  }

  generateManageList(user_type) {
    const statusMap = status => (
      <span className="tags-container">
        {status.is_publish && status.is_approved && (
          <Tag color={"green"} key={"published"}>
            {"PUBLISHED"}
          </Tag>
        )}
        {status.is_publish && status.is_rejected && (
          <Tag color={"red"} key={"rejected"}>
            {"REJECTED"}
          </Tag>
        )}
        {status.is_publish && !status.is_rejected && !status.is_approved && (
          <Tag color={"blue"} key={"pending"}>
            {"WAITING APPROVAL"}
          </Tag>
        )}
        {!status.is_publish && (
          <Tag color={"geekblue"} key={"not_published"}>
            {"NOT PUBLISHED"}
          </Tag>
        )}
        {!status.is_publish && (
          <Tag color={"green"} key={"saved"}>
            {"SAVED"}
          </Tag>
        )}
      </span>
    );

    const colorMap = { Alumni: "geekblue", Student: "green", Public: "pink" };

    const columns = [
      { title: "Author", dataIndex: "author", key: "author" },
      { title: "Audience", dataIndex: "audience", key: "audience" },
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Length", dataIndex: "lenght", key: "lenght" },
      { title: "View Count", dataIndex: "views", key: "views" },
      { title: "Likes", dataIndex: "likes", key: "likes" },
      { title: "Dislikes", dataIndex: "dislikes", key: "dislikes" },
      { title: "Last Updated", dataIndex: "request_date", key: "request_date" },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: status => statusMap(status)
      },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        render: record => (
          <div>
            {user_type === "career_services" && this.editButton(record.key)}
            {this.deleteButton(record.key, user_type)}
          </div>
        )
      }
    ];

    const data = this.state[this.parameterMap[user_type].state].map(blog => {
      return {
        key: blog.id,
        author:
          blog.publisher_profile.first_name +
          " " +
          blog.publisher_profile.last_name,
        audience: blog.user_types.map(type => (
          <Tag color={colorMap[type.name]}>{type.name.toUpperCase()}</Tag>
        )),
        title: blog.title,
        lenght: blog.word_count + " words",
        views: blog.view_count + " views",
        likes: blog.upvote + " likes",
        dislikes: blog.downvote + " dislikes",
        request_date: moment(blog.updated_at).format(DATE_AND_TIME_FORMAT),
        status: {
          is_publish: blog.is_publish,
          is_approved: blog.is_approved,
          is_rejected: blog.is_rejected
        },
        details: blog
      };
    });

    return (
      <div>
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
            </div>
          )}
          dataSource={data}
          pagination={false}
        />
        <Pagination
          onChange={this.handlePageChange}
          defaultCurrent={
            this.state[this.parameterMap[user_type].paginationState]
              .current_page
          }
          current={
            this.state[this.parameterMap[user_type].paginationState]
              .current_page
          }
          pageSize={this.state.pageSize}
          total={
            this.state[this.parameterMap[user_type].paginationState].total_count
          }
        />
        {this.state.visible && this.generateDetailedModal(user_type)}
      </div>
    );
  }

  generateNestedManageList() {
    const columns = [
      { title: "Added by", dataIndex: "author_type", key: "author_type" },
      { title: "Last Update", dataIndex: "last_update", key: "last_update" },
      {
        title: "Last Month Activity",
        dataIndex: "last_month",
        key: "last_month"
      },
      { title: "View Count", dataIndex: "views", key: "views" },
      { title: "Likes", dataIndex: "likes", key: "likes" },
      { title: "Dislikes", dataIndex: "dislikes", key: "dislikes" },
      { title: "Blog Amount", dataIndex: "blog_amount", key: "blog_amount" }
    ];

    const data = [];

    this.state[this.parameterMap["career_services"].state].length > 0 &&
      data.push({
        key: USER_TYPES["career_services"],
        author_type: "Career Service",
        last_update: moment(
          this.state[this.parameterMap["career_services"].state][0].updated_at
        ).format(DATE_AND_TIME_FORMAT),
        last_month:
          this.state.stats["Career Service"].last_x_days_created +
          " blogs added",
        views: this.state.stats["Career Service"].view_count + " views",
        likes: this.state.stats["Career Service"].upvote_count + " likes",
        dislikes: this.state.stats["Career Service"].downvote_count + " likes",
        blog_amount:
          "Total " +
          this.state[this.parameterMap["career_services"].paginationState]
            .total_count +
          " blogs"
      });

    this.state[this.parameterMap["alumni"].state].length > 0 &&
      data.push({
        key: USER_TYPES["alumni"],
        author_type: "Alumni",
        last_update: moment(
          this.state[this.parameterMap["alumni"].state][0].updated_at
        ).format(DATE_AND_TIME_FORMAT),
        last_month:
          this.state.stats["Alumni"].last_x_days_created + " blogs added",
        views: this.state.stats["Alumni"].view_count + " views",
        likes: this.state.stats["Alumni"].upvote_count + " likes",
        dislikes: this.state.stats["Alumni"].downvote_count + " dislikes",
        blog_amount:
          "Total " +
          this.state[this.parameterMap["alumni"].paginationState].total_count +
          " blogs"
      });

    this.state[this.parameterMap["student"].state].length > 0 &&
      data.push({
        key: USER_TYPES["student"],
        author_type: "Student",
        last_update: moment(
          this.state[this.parameterMap["student"].state][0].updated_at
        ).format(DATE_AND_TIME_FORMAT),
        last_month:
          this.state.stats["Student"].last_x_days_created + " blogs added",
        views: this.state.stats["Student"].view_count + " views",
        likes: this.state.stats["Student"].upvote_count + " likes",
        dislikes: this.state.stats["Student"].downvote_count + " likes",
        blog_amount:
          "Total " +
          this.state[this.parameterMap["student"].paginationState].total_count +
          " blogs"
      });

    return (
      <Table
        className="components-table-demo-nested"
        columns={columns}
        expandedRowRender={record =>
          this.generateManageList(USER_TYPE_NAMES[record.key].type)
        }
        dataSource={data}
        pagination={false}
      />
    );
  }

  generateDetailedModal(user_type) {
    const footer = [this.deleteButton(this.state.detail_blog_id, user_type)];
    user_type === "career_services" &&
      footer.push(this.editButton(this.state.detail_blog_id));

    const cancelButton = [
      <Button onClick={() => this.handleModalCancel(user_type)}>Cancel</Button>
    ];

    return (
      <Modal
        visible={this.state.visible}
        title="Manage"
        onCancel={() => this.handleModalCancel(user_type)}
        width="80vw"
        getContainer={() => document.getElementById("manage-container")}
        footer={this.state.isEditing ? cancelButton : footer}
      >
        {!this.state.isEditing ? (
          <BlogDetails
            blog={this.state.detail_blog}
            handleTokenExpiration={this.props.handleTokenExpiration}
            setBlogEdit={false}
            cookie={this.props.cookie}
          />
        ) : (
          <BlogEditable
            blog={this.state.detail_blog}
            handleTokenExpiration={this.props.handleTokenExpiration}
            alert={this.props.alert}
            cookie={this.props.cookie}
            handleModalCancel={this.handleModalCancel}
            userType={user_type}
          />
        )}
      </Modal>
    );
  }

  render() {
    if (this.state.isInitialRequest === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    else if (this.state.isInitialRequest === true)
      return <Spinner message="Preparing waiting blogs..." />;
    return (
      <div id="manage-container" className="manage-list-container">
        {this.generateNestedManageList()}
      </div>
    );
  }
}

export default BlogManage;
