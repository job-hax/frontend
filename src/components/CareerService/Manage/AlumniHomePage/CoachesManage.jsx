import React from "react";
import { Table, Modal, Button, Pagination, Tag } from "antd";
import moment from "moment";

import { COLLEGES } from "../../../../utils/constants/endpoints.js";
import { axiosCaptcha } from "../../../../utils/api/fetch_api.js";
import { MEDIUM_DATE_FORMAT } from "../../../../utils/constants/constants.js";
import Spinner from "../../../Partials/Spinner/Spinner.jsx";
import AddCoachModal from "../../AddCoachModal/AddCoachModal.jsx";
import CoachSummary from "../../CoachModal/CoachSummary.jsx";

import "../style.scss";

class CoachesManage extends React.Component {
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
      coachList: [],
      detail_coach: {},
      detail_coach_id: null,
      visible: false
    };

    this.handleCoachCardClick = this.handleCoachCardClick.bind(this);
    this.handleModalCancel = this.handleModalCancel.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDeleteRequest = this.handleDeleteRequest.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.editButton = id => (
      <Button
        key="edit"
        type="primary"
        onClick={() => this.handleEdit(id)}
        style={{ width: "105px", margin: "4px" }}
      >
        Edit
      </Button>
    );

    this.deleteButton = id => (
      <div className="delete-button">
        <Button
          key="delete"
          onClick={() => this.handleDelete(id)}
          style={{ width: "105px" }}
        >
          Delete
        </Button>
      </div>
    );

    this.activationButton = coach => (
      <Button
        key="activation"
        onClick={() => this.handleActivation(coach)}
        style={{ width: "105px", margin: "4px" }}
      >
        {coach.is_publish ? "Deactivate" : "Activate"}
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
    await this.props.handleTokenExpiration("coachManage getData");
    axiosCaptcha(COLLEGES("coaches"), config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          if (requestType === "initialRequest") {
            this.setState({
              coachList: response.data.data,
              pagination: response.data.pagination,
              isWaitingResponse: false,
              isInitialRequest: false
            });
          } else if (requestType === "newPageRequest") {
            this.setState({
              coachList: response.data.data,
              pagination: response.data.pagination,
              isWaitingResponse: false,
              isNewPageRequested: false
            });
          }
        }
      }
    });
  }

  async handleCoachCardClick(id) {
    let coach = this.state.coachList.filter(coach => coach.id === id)[0];
    this.setState({ detail_coach_id: id, visible: true, detail_coach: coach });
  }

  handleModalCancel() {
    if (this.state.isEditing) {
      this.getData("initialRequest");
    }
    this.setState({
      visible: false,
      detail_coach_id: null,
      detail_coach: {},
      isEditing: false
    });
  }

  handlePageChange(page) {
    this.setState({
      pageNo: page,
      isNewPageRequested: true,
      detail_coach_id: null
    });
  }

  async handleDeleteRequest(id) {
    let config = { method: "DELETE" };
    config.body = { coach_id: id };
    await this.props.handleTokenExpiration("coachdelete handle");
    axiosCaptcha(COLLEGES("coaches"), config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          let updatedList = this.state.coachList;
          updatedList = updatedList.filter(coach => coach.id !== id);
          this.setState({ coachList: updatedList });
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

  async handleActivationRequest(coach) {
    let config = { method: "PUT" };
    config.body = { coach_id: coach.id, is_publish: !coach.is_publish };
    await this.props.handleTokenExpiration("coachActivation handle");
    axiosCaptcha(COLLEGES("coaches"), config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
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

  async handleActivation(coach) {
    await this.handleActivationRequest(coach);
    this.getData("initialRequest");
  }

  handleEdit(id) {
    this.setState({ isEditing: true });
    !this.state.detailed_coach_id && this.handleCoachCardClick(id);
  }

  async handleDelete(id) {
    await this.handleDeleteRequest(id);
    this.getData("initialRequest");
  }

  generateManageList() {
    const columns = [
      { title: "Coach", dataIndex: "coach", key: "coach" },
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Join Date", dataIndex: "date", key: "date" },
      { title: "Status", dataIndex: "status", key: "status" },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        render: record => (
          <div style={{ display: "flex" }}>
            {this.deleteButton(record.key)}
            {this.editButton(record.key)}
            {this.activationButton(record.details)}
          </div>
        )
      }
    ];

    const data = this.state.coachList.map(coach => {
      return {
        key: coach.id,
        coach: coach.first_name + " " + coach.last_name,
        title: coach.title,
        email: coach.email,
        date: moment(coach.created_at).format(MEDIUM_DATE_FORMAT),
        status: (
          <Tag color={coach.is_publish ? "green" : "red"}>
            {coach.is_publish ? "ACTIVE" : "DEACTIVATED"}
          </Tag>
        ),
        details: coach
      };
    });

    const addNewButton = (
      <div className="add-new-button-container">
        <Button
          type="primary"
          onClick={() =>
            this.setState({
              detail_coach: null,
              detail_coach_id: null,
              visible: true
            })
          }
        >
          Add Coach
        </Button>
      </div>
    );

    return (
      <div>
        <div className="header-button-container">{addNewButton}</div>
        <Table
          columns={columns}
          expandedRowRender={record => (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="side-carousel-container">
                <CoachSummary coach={record.details} />
              </div>
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
        {this.generateDetailedModal()}
      </div>
    );
  }

  generateDetailedModal() {
    const cancelButton = [
      <Button onClick={() => this.handleModalCancel()}>Cancel</Button>
    ];

    return (
      <Modal
        visible={this.state.visible}
        title="Manage"
        onCancel={() => this.handleModalCancel()}
        width={"80vw"}
        getContainer={() => document.getElementById("manage-container")}
        footer={cancelButton}
      >
        <AddCoachModal
          coach={this.state.detail_coach}
          visible={this.state.visible}
          handleCancel={this.handleModalCancel}
          handleTokenExpiration={this.props.handleTokenExpiration}
          alert={this.props.alert}
          cookie={this.props.cookie}
        />
      </Modal>
    );
  }

  render() {
    if (this.state.isInitialRequest === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    else if (this.state.isInitialRequest === true)
      return <Spinner message="Preparing waiting coachs..." />;
    return (
      <div id="manage-container" className="manage-list-container">
        {this.generateManageList()}
      </div>
    );
  }
}

export default CoachesManage;
