import React from "react";
import classNames from "classnames";
import { Input, Upload, Button, Icon } from "antd";
import moment from "moment";

import { axiosCaptcha } from "../../../../../../../utils/api/fetch_api";
import {
  IS_CONSOLE_LOG_OPEN,
  DATE_AND_TIME_FORMAT
} from "../../../../../../../utils/constants/constants.js";
import {
  NOTES,
  FILES,
  apiRoot
} from "../../../../../../../utils/constants/endpoints.js";

class Files extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: null,
      formData: null
    };

    this.handleUpload = this.handleUpload.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.getFiles = this.getFiles.bind(this);
  }

  componentDidMount() {
    this.getFiles();
  }

  async getFiles() {
    await this.props.handleTokenExpiration("files getNotes");
    const { card } = this.props;
    let config = { method: "GET" };
    axiosCaptcha(FILES(card.id), config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          let rawFiles = response.data.data;
          let formedFiles = [];
          rawFiles.forEach(element => {
            let file = {};
            file.uid = element.id.toString();
            file.name = element.name;
            file.status = "done";
            file.url = apiRoot + element.file;
            formedFiles.push(file);
          });
          this.setState({
            files: formedFiles
          });
        }
      }
    });
  }

  handleUpload(file) {
    const { card } = this.props;
    console.log(file);
    let bodyFormData = new FormData();
    let config = { method: "POST" };
    config.headers = {};
    config.headers["Content-Type"] = "multipart/form-data";
    bodyFormData.append("file", file);
    config.body = bodyFormData;
    axiosCaptcha(FILES(card.id), config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          console.log("file submitted!");
          this.getFiles();
        }
      }
    });
  }

  handleRemove(file) {
    const { card } = this.props;
    let config = { method: "DELETE" };
    console.log(file);
    config.body = { jobapp_file_id: parseInt(file.uid) };
    axiosCaptcha(FILES(card.id), config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          this.getFiles();
        }
      }
    });
  }

  generateFiles() {
    console.log(this.state);
    return (
      <Upload
        action={file => this.handleUpload(file)}
        onRemove={this.handleRemove}
        fileList={this.state.files}
        showUploadList={{ showRemoveIcon: true, showDownloadIcon: true }}
      >
        <Button>
          <Icon type="upload" /> Upload
        </Button>
      </Upload>
    );
  }

  render() {
    return <div>{this.generateFiles()}</div>;
  }
}

export default Files;
