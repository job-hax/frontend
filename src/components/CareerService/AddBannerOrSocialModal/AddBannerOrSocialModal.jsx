import React from "react";
import { Modal, Button, Input, Icon, Upload, message } from "antd";

import { axiosCaptcha } from "../../../utils/api/fetch_api";
import { COLLEGES, apiRoot } from "../../../utils/constants/endpoints.js";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";

import "./style.scss";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

class AddBannerOrSocialModal extends React.Component {
  constructor(props) {
    super(props);

    const object = this.props.object
      ? this.props.object
      : {
          link: null,
          image: "",
          icon: ""
        };

    this.state = {
      visible: this.props.visible,
      order: this.props.order,
      link: object.link,
      image: object.image || object.icon,
      type: this.props.type,
      loading: false,
      formData: new FormData()
    };

    this.handlePhotoUpdate = this.handlePhotoUpdate.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }

  componentDidUpdate() {
    if (this.props.visible != this.state.visible) {
      this.setState({ visible: this.props.visible });
    }
  }

  async handleOk() {
    const { order, link, formData, type } = this.state;
    let config = order == null ? { method: "POST" } : { method: "PUT" };
    formData.append("type", type);
    formData.append("link", link);
    if (config.method == "PUT") {
      formData.append("order", order);
    }
    config.body = formData;
    config.headers = {};
    config.headers["Content-Type"] = "multipart/form-data";
    let response = await axiosCaptcha(COLLEGES("homePage"), config);
    if (response.statusText === "OK") {
      if (response.data.success === true) {
        const updatedList =
          type === "header_banner"
            ? response.data.data.header_banners
            : response.data.data.social_media_accounts;
        this.props.alert(3000, "success", "Saved!");
        this.props.handleCancel(this.state.type, updatedList);
      }
    }
  }

  handlePhotoUpdate(file, name) {
    let bodyFormData = this.state.formData;
    bodyFormData.append(name, file);
    this.setState({ formData: bodyFormData });
    getBase64(file, imageUrl =>
      this.setState({
        [name]: imageUrl,
        loading: false,
        is_publish: false
      })
    );
  }

  generateModalBody() {
    const { link, image, loading, type } = this.state;

    const uploadBannerImageButton = (
      <div
        style={{
          width: "80vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div>
          <Icon type={loading ? "loading" : "plus"} />
          <div>Upload Banner Image</div>
        </div>
      </div>
    );

    const uploadSocialIconButton = (
      <div>
        <Icon type={loading ? "loading" : "plus"} />
        <div>Social Icon</div>
      </div>
    );

    const preview_image =
      image.substring(0, 4) == "data" ? image : apiRoot + image;

    const style =
      type === "header_banner"
        ? {
            width: "calc(80vw - 2px)",
            maxWidth: "calc(80vw - 2px)",
            height: "calc(30vw - 10px)",
            overflow: "hidden",
            marginLeft: 5
          }
        : {
            minWidth: "118px",
            height: "118px",
            overflow: "hidden",
            padding: 0
          };

    const bodyStyle =
      type === "header_banner"
        ? { flexDirection: "column" }
        : { justifyContent: "space-around" };

    const imageClass =
      type === "header_banner" ? "banner-image" : "social-account-icon";

    const inputClass =
      type === "header_banner" ? "banner-input" : "social-account-input";

    return (
      <div>
        <div className="add-banner-modal-body" style={bodyStyle}>
          <div className={imageClass}>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              style={style}
              showUploadList={false}
              beforeUpload={beforeUpload}
              action={file => this.handlePhotoUpdate(file, "image")}
            >
              {image != "" ? (
                <img src={preview_image} alt="avatar" />
              ) : type === "header_banner" ? (
                uploadBannerImageButton
              ) : (
                uploadSocialIconButton
              )}
            </Upload>
          </div>
          <div className={inputClass}>
            <Input
              placeholder="Link"
              value={link && link}
              onChange={event => this.setState({ link: event.target.value })}
            />
          </div>
        </div>
      </div>
    );
  }

  generateAddBannerOrSocialModal() {
    const { link, image, type, order, visible } = this.state;
    let minimumInput = link && image !== "";

    this.sendButton = (
      <Button
        key="submit"
        type="primary"
        disabled={!minimumInput}
        loading={this.state.loading}
        onClick={this.handleOk}
        style={{ width: "105px" }}
      >
        Save
      </Button>
    );

    const title_type = type === "header_banner" ? "Banner" : "Social Account";
    const title_functiom = order === null ? "Add " : "Edit ";

    return (
      <Modal
        title={title_functiom + title_type}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.props.handleCancel}
        getContainer={() => document.getElementById("manage-container")}
        width="80vw"
        footer={[this.sendButton]}
      >
        <div className="add-banner-container">{this.generateModalBody()}</div>
      </Modal>
    );
  }

  render() {
    return <div>{this.generateAddBannerOrSocialModal()}</div>;
  }
}

export default AddBannerOrSocialModal;
