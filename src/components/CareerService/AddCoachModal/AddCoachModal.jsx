import React from "react";
import { Redirect } from "react-router-dom";
import { Carousel, Modal, Button, Input, Icon, Upload, message } from "antd";
import parse from "html-react-parser";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import Spinner from "../../Partials/Spinner/Spinner.jsx";
import { axiosCaptcha } from "../../../utils/api/fetch_api";
import { COLLEGES, apiRoot } from "../../../utils/constants/endpoints.js";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";

import "./style.scss";

const { TextArea } = Input;

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

class AddCoachModal extends React.Component {
  constructor(props) {
    super(props);

    const coach = this.props.coach
      ? this.props.coach
      : {
          id: null,
          first_name: null,
          last_name: null,
          email: null,
          title: null,
          calendar_link: null,
          online_conference_link: null,
          content: "",
          summary_photo: "",
          profile_photo: "",
          is_publish: false
        };

    this.state = {
      visible: this.props.visible,
      id: coach.id,
      first_name: coach.first_name,
      last_name: coach.last_name,
      email: coach.email === "null" ? null : coach.email,
      title: coach.title,
      calendar_link: coach.calendar_link,
      online_conference_link:
        coach.online_conference_link === "null"
          ? null
          : coach.online_conference_link,
      content: coach.content,
      summary_photo: coach.summary_photo,
      profile_photo: coach.profile_photo,
      isEditingContent: true,
      editorState: EditorState.createEmpty(),
      loading: false,
      is_publish: coach.is_publish,
      formData: new FormData()
    };

    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.handlePhotoUpdate = this.handlePhotoUpdate.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }

  componentDidMount() {
    const contentBlock = htmlToDraft(this.state.content);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState: editorState
      });
    }
  }

  componentDidUpdate() {
    if (this.props.visible != this.state.visible) {
      this.setState({ visible: this.props.visible });
    }
  }

  async handleOk() {
    const {
      id,
      calendar_link,
      online_conference_link,
      formData,
      title,
      first_name,
      last_name,
      content,
      email,
      is_publish
    } = this.state;
    let config = id == null ? { method: "POST" } : { method: "PUT" };
    formData.append("title", title);
    formData.append("email", email);
    formData.append("online_conference_link", online_conference_link);
    formData.append("calendar_link", calendar_link);
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("content", content);
    formData.append("is_publish", is_publish);
    if (config.method == "PUT") {
      formData.append("blog_id", id);
    }
    config.body = formData;
    config.headers = {};
    config.headers["Content-Type"] = "multipart/form-data";
    console.log(config);
    let response = await axiosCaptcha(COLLEGES("coaches"), config);
    if (response.statusText === "OK") {
      if (response.data.success === true) {
        this.setState({ id: response.data.data.id });
        this.props.alert(3000, "success", "Saved!");
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

  onEditorStateChange(editorState) {
    let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    this.setState({
      editorState: editorState,
      content: html,
      is_publish: false
    });
  }

  generateCoachBody() {
    const {
      content,
      summary_photo,
      profile_photo,
      isEditingContent,
      editorState,
      loading
    } = this.state;
    const uploadSummaryPhotoButton = (
      <div
        style={{
          width: "30vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div>
          <Icon type={loading ? "loading" : "plus"} />
          <div>Upload Summary Photo</div>
        </div>
      </div>
    );

    const uploadProfilePhotoButton = (
      <div
        style={{
          width: "160px",
          height: "160px",
          borderRadius: "80px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div>
          <Icon type={loading ? "loading" : "plus"} />
          <div>Profile Photo</div>
        </div>
      </div>
    );

    const summary_image =
      summary_photo.substring(0, 4) == "data"
        ? summary_photo
        : apiRoot + summary_photo;

    const profile_image =
      profile_photo.substring(0, 4) == "data"
        ? profile_photo
        : apiRoot + profile_photo;
    return (
      <div>
        <div className="add-coach-modal-body">
          <div className="summary-photo">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              style={{
                maxWidth: "calc(30vw - 10px)",
                height: 542,
                overflow: "hidden"
              }}
              showUploadList={false}
              beforeUpload={beforeUpload}
              action={file => this.handlePhotoUpdate(file, "summary_photo")}
            >
              {summary_photo != "" ? (
                <img
                  className={"summary-photo"}
                  src={summary_image}
                  alt="avatar"
                  style={{ height: 544 }}
                />
              ) : (
                uploadSummaryPhotoButton
              )}
            </Upload>
          </div>
          <div className="coach-modal-part">
            <div className="header-part">
              <div className="profile-photo">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  style={{
                    width: 160,
                    height: 160,
                    display: "flex",
                    borderRadius: 80,
                    overflow: "hidden"
                  }}
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  action={file => this.handlePhotoUpdate(file, "profile_photo")}
                >
                  {profile_photo != "" ? (
                    <img src={profile_image} alt="avatar" />
                  ) : (
                    uploadProfilePhotoButton
                  )}
                </Upload>
              </div>
              <div className="coach-input">
                <Input
                  placeholder="First Name"
                  value={this.state.first_name && this.state.first_name}
                  onChange={event =>
                    this.setState({ first_name: event.target.value })
                  }
                />
                <Input
                  placeholder="Last Name"
                  value={this.state.last_name && this.state.last_name}
                  onChange={event =>
                    this.setState({ last_name: event.target.value })
                  }
                />
                <Input
                  placeholder="E-mail"
                  value={this.state.email && this.state.email}
                  onChange={event =>
                    this.setState({ email: event.target.value })
                  }
                />
                <Input
                  placeholder="Title"
                  value={this.state.title && this.state.title}
                  onChange={event =>
                    this.setState({ title: event.target.value })
                  }
                />
                <Input
                  placeholder="Calendar link for appointment"
                  value={this.state.calendar_link && this.state.calendar_link}
                  onChange={event =>
                    this.setState({ calendar_link: event.target.value })
                  }
                />
                <Input
                  placeholder="Online conference link"
                  value={
                    this.state.online_conference_link &&
                    this.state.online_conference_link
                  }
                  onChange={event =>
                    this.setState({
                      online_conference_link: event.target.value
                    })
                  }
                />
              </div>
            </div>
            <div>
              <div className="content-container">
                {isEditingContent ? (
                  <div>
                    <div
                      style={{
                        width: 460,
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBottom: 12
                      }}
                    >
                      <Button
                        onClick={() =>
                          this.setState({ isEditingContent: false })
                        }
                      >
                        {" "}
                        Close Editor{" "}
                      </Button>
                    </div>
                    <Editor
                      editorState={editorState}
                      toolbarClassName="toolbar"
                      wrapperClassName="demo-wrapper"
                      editorClassName="demo-editor editor"
                      onEditorStateChange={this.onEditorStateChange}
                    />
                  </div>
                ) : (
                  <div
                    className="details"
                    onClick={() => this.setState({ isEditingContent: true })}
                  >
                    {content == "" ? (
                      <div style={{ minHeight: 440 }}>Add content...</div>
                    ) : content.length == 8 ? (
                      <div style={{ minHeight: 440 }}>Add content...</div>
                    ) : (
                      parse(`${content}`)
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  generateAddCoachModal() {
    const {
      calendar_link,
      title,
      first_name,
      last_name,
      content,
      summary_photo,
      profile_photo
    } = this.state;
    let minimumInput =
      calendar_link &&
      title &&
      first_name &&
      last_name &&
      content &&
      summary_photo !== "" &&
      profile_photo !== "";

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

    return (
      <Modal
        title={this.state.id ? "Edit Coach" : "Add Coach"}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.props.handleCancel}
        getContainer={() => document.getElementById("main-container")}
        width="80vw"
        footer={[this.sendButton]}
      >
        <div className="add-coach-container">{this.generateCoachBody()}</div>
      </Modal>
    );
  }

  render() {
    return <div>{this.generateAddCoachModal()}</div>;
  }
}

export default AddCoachModal;
