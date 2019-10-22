import React from "react";
import { Table, Modal, Button, Pagination, Tag } from "antd";
import moment from "moment";

import { EVENTS } from "../../../utils/constants/endpoints.js";
import { axiosCaptcha } from "../../../utils/api/fetch_api.js";
import {
  USER_TYPES,
  USER_TYPE_NAMES,
  DATE_AND_TIME_FORMAT
} from "../../../utils/constants/constants.js";
import Spinner from "../../Partials/Spinner/Spinner.jsx";
import Event from "../../Events/Event.jsx";
import EventDetails from "../../Events/EventDetails.jsx";
import EventEditable from "../../Events/EventEditable.jsx";

import "./style.scss";

class EventManage extends React.Component {
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
      career_service_event_list: null,
      alumni_event_list: null,
      student_event_list: null,
      detail_event: {},
      detail_event_id: null,
      stats: null,
      isEditing: false,
      visible: false
    };

    this.handleEventCardClick = this.handleEventCardClick.bind(this);
    this.handleModalCancel = this.handleModalCancel.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDeleteRequest = this.handleDeleteRequest.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.parameterMap = {
      career_services: {
        parameter: "&type=" + USER_TYPES["career_services"],
        state: "career_service_event_list",
        paginationState: "career_service_pagination",
        pageState: "career_service_pageNo"
      },
      alumni: {
        parameter: "&type=" + USER_TYPES["alumni"],
        state: "alumni_event_list",
        paginationState: "alumni_pagination",
        pageState: "alumni_pageNo"
      },
      student: {
        parameter: "&type=" + USER_TYPES["student"],
        state: "student_event_list",
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
        ? EVENTS +
          "?page=" +
          this.state[this.parameterMap[parameter].pageState] +
          "&page_size=" +
          this.state.pageSize +
          this.parameterMap[parameter].parameter
        : EVENTS + this.state.detail_event_id + "/";
    await this.props.handleTokenExpiration("eventApproval getData");
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
                detail_event: response.data.data,
                isWaitingResponse: false,
                visible: true
              });
            }
          }
        }
      })
      .then(() => {
        if (
          this.state.career_service_event_list &&
          this.state.alumni_event_list &&
          this.state.student_event_list
        ) {
          axiosCaptcha(EVENTS + "stats/", config).then(statsResponse => {
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

  async handleEventCardClick(id) {
    await this.setState({ detail_event_id: id });
    this.getData("detailedRequest");
  }

  handleModalCancel(user_type) {
    if (this.state.isEditing) {
      this.getData("initialRequest", user_type);
    }
    this.setState({
      visible: false,
      detail_event_id: null,
      detail_event: {},
      isEditing: false
    });
  }

  handlePageChange(page) {
    this.setState({
      pageNo: page,
      isNewPageRequested: true,
      detail_event_id: null
    });
  }

  async handleDeleteRequest(id, user_type) {
    let config = { method: "DELETE" };
    config.body = { event_id: id };
    await this.props.handleTokenExpiration("eventdelete handle");
    axiosCaptcha(EVENTS, config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          let updatedList = this.state[this.parameterMap[user_type].state];
          updatedList = updatedList.filter(event => event.id !== id);
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
    !this.state.detailed_event_id && this.handleEventCardClick(id);
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
      { title: "Host", dataIndex: "host", key: "host" },
      { title: "Audience", dataIndex: "audience", key: "audience" },
      { title: "Event Type", dataIndex: "event_type", key: "event_type" },
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Event Date", dataIndex: "event_start", key: "event_start" },
      { title: "Address", dataIndex: "address", key: "address" },
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

    const data = this.state[this.parameterMap[user_type].state].map(event => {
      return {
        key: event.id,
        host: event.host_user.first_name + " " + event.host_user.last_name,
        audience: event.user_types.map(type => (
          <Tag color={colorMap[type.name]}>{type.name.toUpperCase()}</Tag>
        )),
        event_type: event.event_type.name,
        title: event.title,
        address: event.location_address,
        event_start: moment(event.event_date_start).format(
          DATE_AND_TIME_FORMAT
        ),
        request_date: moment(event.updated_at).format(DATE_AND_TIME_FORMAT),
        status: {
          is_publish: event.is_publish,
          is_approved: event.is_approved,
          is_rejected: event.is_rejected
        },
        details: event
      };
    });

    return (
      <div>
        <Table
          columns={columns}
          expandedRowRender={record => (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Event
                event={record.details}
                setEventDetail={this.handleEventCardClick}
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
      { title: "Added by", dataIndex: "host_type", key: "host_type" },
      { title: "Last Update", dataIndex: "last_update", key: "last_update" },
      {
        title: "Upcoming Events",
        dataIndex: "upcoming",
        key: "upcoming"
      },
      {
        title: "Last Month Activity",
        dataIndex: "last_month",
        key: "last_month"
      },
      { title: "Event Amount", dataIndex: "event_amount", key: "event_amount" }
    ];

    const data = [];

    this.state[this.parameterMap["career_services"].state].length > 0 &&
      data.push({
        key: USER_TYPES["career_services"],
        host_type: "Career Service",
        last_update: moment(
          this.state[this.parameterMap["career_services"].state][0].updated_at
        ).format(DATE_AND_TIME_FORMAT),
        upcoming:
          this.state.stats["Career Service"].upcoming_x_days +
          " events in next 30 days",
        last_month:
          this.state.stats["Career Service"].last_x_days_created +
          " events added",
        event_amount:
          "Total " +
          this.state[this.parameterMap["career_services"].paginationState]
            .total_count +
          " events"
      });

    this.state[this.parameterMap["alumni"].state].length > 0 &&
      data.push({
        key: USER_TYPES["alumni"],
        host_type: "Alumni",
        last_update: moment(
          this.state[this.parameterMap["alumni"].state][0].updated_at
        ).format(DATE_AND_TIME_FORMAT),
        upcoming:
          this.state.stats["Alumni"].upcoming_x_days +
          " events in next 30 days",
        last_month:
          this.state.stats["Alumni"].last_x_days_created + " events added",
        event_amount:
          "Total " +
          this.state[this.parameterMap["alumni"].paginationState].total_count +
          " events"
      });

    this.state[this.parameterMap["student"].state].length > 0 &&
      data.push({
        key: USER_TYPES["student"],
        host_type: "Student",
        last_update: moment(
          this.state[this.parameterMap["student"].state][0].updated_at
        ).format(DATE_AND_TIME_FORMAT),
        upcoming:
          this.state.stats["Student"].upcoming_x_days +
          " events in next 30 days",
        last_month:
          this.state.stats["Student"].last_x_days_created + " events added",
        event_amount:
          "Total " +
          this.state[this.parameterMap["student"].paginationState].total_count +
          " events"
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
    const footer = [this.deleteButton(this.state.detail_event_id, user_type)];
    user_type === "career_services" &&
      footer.push(this.editButton(this.state.detail_event_id));

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
          <EventDetails
            event={this.state.detail_event}
            handleTokenExpiration={this.props.handleTokenExpiration}
            setEventEdit={false}
            cookie={this.props.cookie}
          />
        ) : (
          <EventEditable
            event={this.state.detail_event}
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
      return <Spinner message="Preparing waiting events..." />;
    return (
      <div id="manage-container" className="manage-list-container">
        {this.generateNestedManageList()}
      </div>
    );
  }
}

export default EventManage;
