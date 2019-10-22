import React from "react";
import { Redirect } from "react-router-dom";
import { Carousel, Modal, Button, Input, Icon, Upload, message } from "antd";
import parse from "html-react-parser";

import Spinner from "../../Partials/Spinner/Spinner.jsx";
import { axiosCaptcha } from "../../../utils/api/fetch_api";
import { COLLEGES, apiRoot } from "../../../utils/constants/endpoints.js";
import {
  IS_CONSOLE_LOG_OPEN,
  imageIcon
} from "../../../utils/constants/constants.js";

import "./style.scss";

const { TextArea } = Input;

class AddVideoModal extends React.Component {
  constructor(props) {
    super(props);

    const video = this.props.video
      ? this.props.video
      : {
          id: null,
          title: null,
          description: null,
          embed_code: null,
          is_publish: false
        };

    this.state = {
      visible: this.props.visible,
      id: video.id,
      title: video.title,
      description: video.description,
      embed_code: video.embed_code,
      is_publish: video.is_publish,
      embed_code_correct: true
    };

    this.handleOk = this.handleOk.bind(this);
    this.handleEmbedCodeInput = this.handleEmbedCodeInput.bind(this);
  }

  componentDidUpdate() {
    if (this.props.visible != this.state.visible) {
      this.setState({ visible: this.props.visible });
    }
  }

  async handleOk() {
    const {
      id,
      title,
      description,
      embed_code,
      embed_code_correct
    } = this.state;
    if (!embed_code_correct) {
      this.props.alert(3000, "error", "Embed code must start with '<iframe' !");
      return;
    }
    let config = id == null ? { method: "POST" } : { method: "PUT" };
    let body = {
      title: title,
      description: description,
      embed_code: embed_code
    };
    if (config.method == "PUT") {
      body.update({ homepage_video_id: id });
    }
    config.body = body;
    let response = await axiosCaptcha(COLLEGES("homePage/videos"), config);
    if (response.statusText === "OK") {
      if (response.data.success === true) {
        this.setState({ id: response.data.data.id });
        this.props.alert(3000, "success", "Saved!");
      }
    }
  }

  handleEmbedCodeInput(event) {
    let code = event.target.value;
    const code_validity = code.startsWith("<iframe");
    console.log("validity", code, code_validity);
    this.setState({ embed_code: code, embed_code_correct: code_validity });
  }

  generateVideoInput() {
    return (
      <div>
        <div className="add-video-modal-body">
          <div className="video-container">
            <div>
              {this.state.embed_code && this.state.embed_code_correct ? (
                parse(`${this.state.embed_code}`)
              ) : (
                <div className="video-frame">{imageIcon}</div>
              )}
            </div>
            <div className="video-title">
              {this.state.title ? this.state.title : "Title"}
            </div>
            <div>
              {this.state.description
                ? this.state.description
                : "Video Description"}
            </div>
          </div>
          <div className="video-input">
            <Input
              placeholder="Title"
              value={this.state.title && this.state.title}
              onChange={event => this.setState({ title: event.target.value })}
            />
            <TextArea
              placeholder="Description"
              autosize={{ minRows: 2, maxRows: 5 }}
              value={this.state.description && this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })
              }
            />
            <TextArea
              placeholder="Embed Code"
              autosize={{ minRows: 3, maxRows: 8 }}
              value={this.state.embed_code && this.state.embed_code}
              onChange={this.handleEmbedCodeInput}
            />
            {!this.state.embed_code_correct && this.state.embed_code && (
              <div className="error-note">
                {"* Embed code must start with <iframe"}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  generateAddVideoModal() {
    const { title, description, embed_code } = this.state;
    let minimumInput = title && description && embed_code;

    this.sendButton = (
      <Button
        key="submit"
        type="primary"
        disabled={!minimumInput}
        onClick={this.handleOk}
        style={{ width: "105px" }}
      >
        Save
      </Button>
    );

    return (
      <Modal
        title={this.state.id ? "Edit Video" : "Add Video"}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.props.handleCancel}
        getContainer={() => document.getElementById("manage-container")}
        width="80vw"
        footer={[this.sendButton]}
      >
        <div className="add-video-container">{this.generateVideoInput()}</div>
      </Modal>
    );
  }

  render() {
    return <div>{this.generateAddVideoModal()}</div>;
  }
}

export default AddVideoModal;
