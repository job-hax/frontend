import React from "react";
import { Table, Modal, Button, Pagination, Tag } from "antd";
import parse from "html-react-parser";
import moment from "moment";

import { COLLEGES } from "../../../../utils/constants/endpoints.js";
import { axiosCaptcha } from "../../../../utils/api/fetch_api.js";
import { MEDIUM_DATE_FORMAT } from "../../../../utils/constants/constants.js";
import Spinner from "../../../Partials/Spinner/Spinner.jsx";
import AddVideoModal from "../../AddVideoModal/AddVideoModal.jsx";

import "../style.scss";

class VideosManage extends React.Component {
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
      videoList: [],
      detail_video: {},
      detail_video_id: null,
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

    this.activationButton = video => (
      <Button
        key="activation"
        onClick={() => this.handleActivation(video)}
        style={{ width: "105px", margin: "4px" }}
      >
        {video.is_publish ? "Deactivate" : "Activate"}
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
    await this.props.handleTokenExpiration("videosManage getData");
    axiosCaptcha(COLLEGES("homePage/videos"), config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          if (requestType === "initialRequest") {
            this.setState({
              videoList: response.data.data,
              pagination: response.data.pagination,
              isWaitingResponse: false,
              isInitialRequest: false
            });
          } else if (requestType === "newPageRequest") {
            this.setState({
              videoList: response.data.data,
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
    let video = this.state.videoList.filter(video => video.id === id)[0];
    this.setState({ detail_video_id: id, visible: true, detail_video: video });
  }

  handleModalCancel() {
    if (this.state.isEditing) {
      this.getData("initialRequest");
    }
    this.setState({
      visible: false,
      detail_video_id: null,
      detail_video: {},
      isEditing: false
    });
  }

  handlePageChange(page) {
    this.setState({
      pageNo: page,
      isNewPageRequested: true,
      detail_video_id: null
    });
  }

  async handleDeleteRequest(id) {
    let config = { method: "DELETE" };
    config.body = { homepage_video_id: id };
    await this.props.handleTokenExpiration("videodelete handle");
    axiosCaptcha(COLLEGES("homePage/videos"), config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          let updatedList = this.state.videoList;
          updatedList = updatedList.filter(video => video.id !== id);
          this.setState({ videoList: updatedList });
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

  async handleActivationRequest(video) {
    let config = { method: "PUT" };
    let body = { homepage_video_id: video.id, is_publish: !video.is_publish };
    config.body = body;
    await this.props.handleTokenExpiration("videoActivation handle");
    axiosCaptcha(COLLEGES("homePage/videos"), config).then(response => {
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

  async handleActivation(video) {
    await this.handleActivationRequest(video);
    this.getData("initialRequest");
  }

  handleEdit(id) {
    this.setState({ isEditing: true });
    !this.state.detailed_video_id && this.handleCoachCardClick(id);
  }

  async handleDelete(id) {
    await this.handleDeleteRequest(id);
    this.getData("initialRequest");
  }

  generateManageList() {
    const columns = [
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Description", dataIndex: "description", key: "description" },
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

    const data = this.state.videoList.map(video => {
      return {
        key: video.id,
        title: video.title,
        description: video.description,
        date: moment(video.created_at).format(MEDIUM_DATE_FORMAT),
        status: (
          <Tag color={video.is_publish ? "green" : "red"}>
            {video.is_publish ? "ACTIVE" : "DEACTIVATED"}
          </Tag>
        ),
        details: video
      };
    });

    const addNewButton = (
      <div className="add-new-button-container">
        <Button
          type="primary"
          onClick={() =>
            this.setState({
              detail_video: null,
              detail_video_id: null,
              visible: true
            })
          }
        >
          Add Video
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
              <div className="video-container">
                <div> {parse(`${record.details.embed_code}`)}</div>
                <div className="video-title">{record.details.title}</div>
                <div>{record.details.description}</div>
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
        <AddVideoModal
          video={this.state.detail_video}
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
      return <Spinner message="Preparing waiting videos..." />;
    return (
      <div id="manage-container" className="manage-list-container">
        {this.generateManageList()}
      </div>
    );
  }
}

export default VideosManage;
