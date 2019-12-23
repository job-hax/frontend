import React from "react";
import classNames from "classnames";
import { Input, Upload, Button, Icon } from "antd";
import moment from "moment";

import { axiosCaptcha } from "../../../utils/api/fetch_api";
import {
  IS_CONSOLE_LOG_OPEN,
  DATE_AND_TIME_FORMAT
} from "../../../utils/constants/constants.js";
import { NOTES, FILES, apiRoot } from "../../../utils/constants/endpoints.js";

class ResumeUploader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: this.props.formed_files
    };

    this.handleUpload = this.handleUpload.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentDidUpdate() {
    if (this.props.formed_files != this.state.files) {
      this.setState({ files: this.props.formed_files });
    }
  }

  handleUpload(file) {
    console.log("resume upload file", file);
    let formedFiles = [
      {
        uid: "1",
        name: file.name,
        status: "done"
      }
    ];
    this.props.updateParentState("resume", file);
    this.props.updateParentState("formed_files", formedFiles);
  }

  handleRemove(file) {
    let formedFiles = this.state.files.filter(
      stored_file => stored_file != file
    );
    this.setState({
      files: formedFiles
    });
    this.props.updateParentState("resume", null);
    this.props.updateParentState("formed_files", []);
  }

  generateFiles() {
    console.log("resume uploader state", this.state);
    return (
      <Upload
        beforeUpload={file => this.handleUpload(file)}
        onRemove={this.handleRemove}
        fileList={this.state.files}
        showUploadList={{ showRemoveIcon: true }}
      >
        {(this.state.files === null || this.state.files.length === 0) && (
          <div>
            <Button>
              <Icon type="upload" /> Upload CV
            </Button>
            <div style={{ color: "red", textAlign: "right" }}>* required</div>
          </div>
        )}
      </Upload>
    );
  }

  render() {
    return <div>{this.generateFiles()}</div>;
  }
}

export default ResumeUploader;
