import React from "react";
import { Table, Modal, Button, Pagination, Tag } from "antd";

import { apiRoot, EVENTS } from "../../../utils/constants/endpoints.js";
import { axiosCaptcha } from "../../../utils/api/fetch_api.js";
import Spinner from "../../Partials/Spinner/Spinner.jsx";
import {
  makeTimeBeautiful,
  USER_TYPES,
  USER_TYPE_NAMES
} from "../../../utils/constants/constants.js";
import Event from "../../Events/Event.jsx";
import EventDetails from "../../Events/EventDetails.jsx";

import "./style.scss";
import EventEditable from "../../Events/EventEditable.jsx";

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
        parameter: "&mine=true",
        state: "career_service_event_list",
        paginationState: "career_service_pagination",
        pageState: "career_service_pageNo"
      },
      alumni: {
        parameter: "&student=false",
        state: "alumni_event_list",
        paginationState: "alumni_pagination",
        pageState: "alumni_pageNo"
      },
      student: {
        parameter: "&student=true",
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
        style={{ width: "105px" }}
      >
        Edit
      </Button>
    );

    this.deleteButton = id => (
      <Button
        key="delete"
        onClick={() => this.handleDelete(id)}
        style={{ width: "105px", marginRight: "12px" }}
      >
        Delete
      </Button>
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
      this.state.detail_event_id == null
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
          this.setState({ isInitialRequest: false });
        }
      });
  }

  async handleEventCardClick(id) {
    await this.setState({ detail_event_id: id });
    this.getData("detailedRequest");
  }

  handleModalCancel() {
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

  async handleDeleteRequest(id) {
    let config = { method: "DELETE" };
    config.body = { event_id: id };
    await this.props.handleTokenExpiration("eventdelete handle");
    axiosCaptcha(EVENTS, config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          let updatedList = this.state.eventList;
          updatedList = updatedList.filter(event => event.id !== id);
          this.setState({ eventList: updatedList });
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

  handleEdit(id) {
    this.setState({ detailed_event_id: id, isEditing: true });
  }

  handleDelete(id) {
    this.handleDeleteRequest(id);
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

    const columns = [
      { title: "Host", dataIndex: "host", key: "host" },
      { title: "Host Type", dataIndex: "host_type", key: "host_type" },
      { title: "Event Type", dataIndex: "event_type", key: "event_type" },
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Time", dataIndex: "event_start", key: "event_start" },
      { title: "Address", dataIndex: "address", key: "address" },
      { title: "Request Date", dataIndex: "request_date", key: "request_date" },
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
          <div style={{ display: "flex" }}>
            {this.deleteButton(record.key)}
            {user_type === "career_services" && this.editButton(record.key)}
          </div>
        )
      }
    ];

    const data = this.state[this.parameterMap[user_type].state].map(event => {
      return {
        key: event.id,
        host: event.host_user.first_name + " " + event.host_user.last_name,
        host_type: event.user_types[0].name,
        event_type: event.event_type.name,
        title: event.title,
        address: event.location_address,
        event_start: makeTimeBeautiful(event.event_date_start, "dateandtime"),
        request_date: makeTimeBeautiful(event.updated_at, "dateandtime"),
        status: {
          is_publish: event.is_publish,
          is_approved: event.is_approved,
          is_rejected: event.is_rejected
        },
        details: event
      };
    });

    const footer = [this.deleteButton(this.state.detail_event_id)];
    user_type === "career_services" &&
      footer.push(this.editButton(this.state.detail_event_id));

    return (
      <div className="manage-list-container">
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
              {this.state.visible && (
                <Modal
                  visible={this.state.visible}
                  title="Manage"
                  onCancel={this.handleModalCancel}
                  width="80vw"
                  getContainer={false}
                  footer={footer}
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
                    />
                  )}
                </Modal>
              )}
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
      </div>
    );
  }

  generateNestedManageList() {
    const columns = [
      { title: "Host Type", dataIndex: "host_type", key: "host_type" },
      { title: "Last Update", dataIndex: "last_update", key: "last_update" },
      {
        title: "Upcoming Event Amount",
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

    const data = [
      {
        key: USER_TYPES["career_services"],
        host_type: "Career Service",
        last_update: makeTimeBeautiful(
          this.state[this.parameterMap["career_services"].state][0].updated_at,
          "dateandtime"
        ),
        upcoming: "5 Events in next 30 days",
        last_month: "3 events added",
        event_amount:
          "Total " +
          this.state[this.parameterMap["career_services"].paginationState]
            .total_count +
          " events"
      },
      {
        key: USER_TYPES["alumni"],
        host_type: "Alumni",
        last_update: makeTimeBeautiful(
          this.state[this.parameterMap["alumni"].state][0].updated_at,
          "dateandtime"
        ),
        upcoming: "3 Events in next 30 days",
        last_month: "2 events added",
        event_amount:
          "Total " +
          this.state[this.parameterMap["alumni"].paginationState].total_count +
          " events"
      },
      {
        key: USER_TYPES["student"],
        host_type: "Student",
        last_update: makeTimeBeautiful(
          this.state[this.parameterMap["student"].state][0].updated_at,
          "dateandtime"
        ),
        upcoming: "1 Events in next 30 days",
        last_month: "2 events added",
        event_amount:
          "Total " +
          this.state[this.parameterMap["student"].paginationState].total_count +
          " events"
      }
    ];

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

  render() {
    if (this.state.isInitialRequest === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    else if (this.state.isInitialRequest === true)
      return <Spinner message="Preparing waiting events..." />;
    return <div>{this.generateNestedManageList()}</div>;
  }
}

export default EventManage;
