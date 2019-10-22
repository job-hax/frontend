import React from "react";
import { Table, Modal, Button } from "antd";

import { apiRoot, COLLEGES } from "../../../../utils/constants/endpoints.js";
import { axiosCaptcha } from "../../../../utils/api/fetch_api.js";
import Spinner from "../../../Partials/Spinner/Spinner.jsx";
import AddBannerOrSocialModal from "../../AddBannerOrSocialModal/AddBannerOrSocialModal.jsx";

import "../style.scss";

class BannersManage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isWaitingResponse: false,
      isInitialRequest: "beforeRequest",
      isNewPageRequested: false,
      redirect: "",
      banner_images_list: null,
      social_accounts_list: null,
      editing_id: null,
      stats: null,
      isEditing: false,
      visible: false
    };

    this.handleModalCancel = this.handleModalCancel.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDeleteRequest = this.handleDeleteRequest.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.parameterMap = {
      banner_images: {
        state: "banner_images_list"
      },
      social_accounts: {
        state: "social_accounts_list"
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

    this.deleteButton = (id, type) => (
      <div className="delete-button">
        <Button
          key="delete"
          onClick={() => this.handleDelete(id, type)}
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
      this.getData();
    }
  }

  async getData() {
    this.setState({ isWaitingResponse: true });
    let config = { method: "GET" };
    let newUrl = COLLEGES("homePage");
    await this.props.handleTokenExpiration("manage alumniHomePage getData");
    axiosCaptcha(newUrl, config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          this.setState({
            banner_images_list: response.data.data.header_banners,
            social_accounts_list: response.data.data.social_media_accounts,
            isWaitingResponse: false,
            isInitialRequest: false
          });
        }
      }
    });
  }

  handleModalCancel(type = null, updatedList = []) {
    if (type === "header_banner") {
      this.setState({ banner_images_list: updatedList });
    } else if (type === "social_media_account") {
      this.setState({ social_accounts_list: updatedList });
    }
    this.setState({
      visible: false,
      editing_id: null,
      isEditing: false
    });
  }

  async handleDeleteRequest(id, type) {
    let config = { method: "DELETE" };
    let delete_type =
      type === "banner_images" ? "header_banner" : "social_media_account";
    config.body = { type: delete_type, order: id };
    await this.props.handleTokenExpiration(
      "manage alumniHomePage delete handle"
    );
    axiosCaptcha(COLLEGES("homePage"), config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          let updatedList = this.state[this.parameterMap[type].state];
          updatedList = updatedList.filter(element => element.id !== id);
          this.setState({ [this.parameterMap[type].state]: updatedList });
          this.handleModalCancel();
          this.props.alert(3000, "success", "Successfully deleted!");
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
    this.setState({ editing_id: id, isEditing: true, visible: true });
  }

  async handleDelete(id, type) {
    await this.handleDeleteRequest(id, type);
    this.getData();
  }

  generateManageList(type) {
    const banner_image = src => (
      <div>
        <img style={{ height: "60px" }} src={src} />
      </div>
    );

    const banner_image_columns = [
      { title: "Image", dataIndex: "image", key: "image" },
      { title: "Link", dataIndex: "link", key: "link" },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        render: record => (
          <div>
            {this.editButton(record.key)}
            {this.deleteButton(record.key, type)}
          </div>
        )
      }
    ];

    const banner_image_data = this.state.banner_images_list.map(element => {
      return {
        key: this.state.banner_images_list.indexOf(element),
        image: banner_image(apiRoot + element.image),
        link: element.internal_link
          ? window.location.origin + "/" + element.link
          : element.link,
        details: element
      };
    });

    const social_account_columns = [
      { title: "Icon", dataIndex: "icon", key: "icon" },
      { title: "Link", dataIndex: "link", key: "link" },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        render: record => (
          <div>
            {this.editButton(record.key)}
            {this.deleteButton(record.key, type)}
          </div>
        )
      }
    ];

    const social_account_data = this.state.social_accounts_list.map(account => {
      return {
        key: this.state.social_accounts_list.indexOf(account),
        icon: banner_image(apiRoot + account.icon),
        link: account.internal_link
          ? window.location.origin + "/" + account.link
          : account.link,
        details: account
      };
    });

    const banner_preview = src => (
      <div className="carousel-container">
        <div className="carousel-image">
          <img src={src} style={{ cursor: "unset" }} />
        </div>
      </div>
    );

    const addNewButton = type => (
      <div className="add-new-button-container">
        <Button
          type="primary"
          onClick={() =>
            this.setState({
              editing_id: null,
              visible: true
            })
          }
        >
          {"Add " + type}
        </Button>
      </div>
    );

    const banner_table = (
      <Table
        title={() => addNewButton("Header Banner")}
        columns={banner_image_columns}
        expandedRowRender={record =>
          banner_preview(apiRoot + record.details.image)
        }
        dataSource={banner_image_data}
        pagination={false}
      />
    );

    const social_accounts_table = (
      <Table
        title={() => addNewButton("Social Media Account")}
        columns={social_account_columns}
        dataSource={social_account_data}
        pagination={false}
      />
    );

    return (
      <div>
        {type === "banner_images" ? banner_table : social_accounts_table}
        {this.state.visible && this.generateDetailedModal(type)}
      </div>
    );
  }

  generateNestedManageList() {
    const columns = [
      { title: "Type", dataIndex: "name", key: "name" },
      { title: "Banner Image Amount", dataIndex: "amount", key: "amount" }
    ];

    const data = [];

    this.state[this.parameterMap["banner_images"].state].length > 0 &&
      data.push({
        key: 1,
        type: "banner_images",
        name: "Banner Images",
        amount: "Total " + this.state.banner_images_list.length + " images"
      });

    this.state[this.parameterMap["social_accounts"].state].length > 0 &&
      data.push({
        key: 2,
        type: "social_accounts",
        name: "Social Accounts",
        amount: "Total " + this.state.social_accounts_list.length + " accounts"
      });

    return (
      <Table
        className="components-table-demo-nested"
        columns={columns}
        expandedRowRender={record => this.generateManageList(record.type)}
        dataSource={data}
        pagination={false}
      />
    );
  }

  generateDetailedModal(type) {
    const footer = [
      this.deleteButton(this.state.detail_event_id, type),
      this.editButton(this.state.detail_event_id)
    ];

    return (
      <Modal
        visible={this.state.visible}
        title="Manage"
        onCancel={() => this.handleModalCancel()}
        width="80vw"
        getContainer={() => document.getElementById("manage-container")}
        footer={footer}
      >
        <AddBannerOrSocialModal
          object={
            this.state.editing_id !== null
              ? this.state[this.parameterMap[type].state][this.state.editing_id]
              : null
          }
          type={
            type === "banner_images" ? "header_banner" : "social_media_account"
          }
          order={this.state.editing_id}
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
      return <Spinner message="Preparing alumni home page manager..." />;
    return (
      <div id="manage-container" className="manage-list-container">
        {this.generateNestedManageList()}
      </div>
    );
  }
}

export default BannersManage;
