import React from "react";
import { Table, Modal, Button, Pagination } from "antd";
import moment from "moment";

import { EVENTS } from "../../../utils/constants/endpoints.js";
import { axiosCaptcha } from "../../../utils/api/fetch_api.js";
import { DATE_AND_TIME_FORMAT } from "../../../utils/constants/constants.js";
import Spinner from "../../Partials/Spinner/Spinner.jsx";
import Event from "../../Events/Event.jsx";
import EventDetails from "../../Events/EventDetails.jsx";

import "./style.scss";

class EventApproval extends React.Component {
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
      eventList: [],
      detail_event: {},
      detail_event_id: null,
      visible: false
    };

    this.handleEventCardClick = this.handleEventCardClick.bind(this);
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
      this.state.detail_event_id == null
        ? EVENTS +
          "?page=" +
          this.state.pageNo +
          "&page_size=" +
          this.state.pageSize +
          "&waiting=true"
        : EVENTS + this.state.detail_event_id + "/";
    await this.props.handleTokenExpiration("eventApproval getData");
    axiosCaptcha(newUrl, config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          if (requestType === "initialRequest") {
            this.setState({
              eventList: response.data.data,
              pagination: response.data.pagination,
              isWaitingResponse: false,
              isInitialRequest: false
            });
          } else if (requestType === "newPageRequest") {
            this.setState({
              eventList: response.data.data,
              pagination: response.data.pagination,
              isWaitingResponse: false,
              isNewPageRequested: false
            });
          } else if (requestType === "detailedRequest") {
            this.setState({
              detail_event: response.data.data,
              isWaitingResponse: false,
              isInitialRequest: false,
              visible: true
            });
          }
        }
      }
    });
  }

  async handleEventCardClick(id) {
    await this.setState({ detail_event_id: id });
    this.getData("detailedRequest");
  }

  handleModalCancel() {
    this.setState({ visible: false, detail_event_id: null, detail_event: {} });
  }

  handlePageChange(page) {
    this.setState({
      pageNo: page,
      isNewPageRequested: true,
      detail_event_id: null
    });
  }

  async handleSubmit(decision, id) {
    let approval = decision === "approve" ? true : false;
    let config = { method: "PATCH" };
    config.body = { event_id: id, approved: approval };
    await this.props.handleTokenExpiration("eventApproval decision");
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

  handleApprove(id) {
    this.handleSubmit("approve", id);
  }

  handleReject(id) {
    this.handleSubmit("reject", id);
  }

  generateApprovalList() {
    const columns = [
      { title: "Host", dataIndex: "host", key: "host" },
      { title: "Host Type", dataIndex: "host_type", key: "host_type" },
      { title: "Event Type", dataIndex: "event_type", key: "event_type" },
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Time", dataIndex: "event_start", key: "event_start" },
      { title: "Address", dataIndex: "address", key: "address" },
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

    const data = this.state.eventList.map(event => {
      return {
        key: event.id,
        host: event.host_user.first_name + " " + event.host_user.last_name,
        host_type: event.user_types[0].name,
        event_type: event.event_type.name,
        title: event.title,
        address: event.location_address,
        event_start: moment(event.event_date_start).format(
          DATE_AND_TIME_FORMAT
        ),
        request_date: moment(event.updated_at).format(DATE_AND_TIME_FORMAT),
        pending:
          Math.round(
            (new Date() - new Date(event.updated_at)) / (1000 * 60 * 60 * 24)
          ) + " days",
        details: event
      };
    });

    return (
      <div className="approval-list-container">
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
                  title="Waiting Approval"
                  onCancel={this.handleModalCancel}
                  width="80vw"
                  getContainer={false}
                  footer={[
                    this.rejectButton(this.state.detail_event_id),
                    this.approveButton(this.state.detail_event_id)
                  ]}
                >
                  <EventDetails
                    event={this.state.detail_event}
                    handleTokenExpiration={this.props.handleTokenExpiration}
                    setEventEdit={false}
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
      return <Spinner message="Preparing waiting events..." />;
    return <div>{this.generateApprovalList()}</div>;
  }
}

export default EventApproval;
