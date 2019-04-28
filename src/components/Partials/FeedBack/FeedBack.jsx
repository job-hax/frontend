import React from "react";
import { Rate, Modal } from "antd";

import { feedbackRequest } from "../../../utils/api/requests.js";
import { fetchApi } from "../../../utils/api/fetch_api";

import "./style.scss";
import "../../../../node_modules/antd-scss/antd.scss";

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

class FeedBack extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 3,
      visible: false
    };

    this.body = {};
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  showModal() {
    this.setState({
      visible: true
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    feedbackRequest.config.headers.Authorization = this.props.token;
    if (event.target[0].value.trim() != (null || "")) {
      this.body["text"] = event.target[0].value.trim();
    }
    this.body["star"] = this.state.value;
    feedbackRequest.config.body = JSON.stringify(this.body);
    console.log(feedbackRequest.config.body);
    fetchApi(feedbackRequest.url, feedbackRequest.config).then(response => {
      if (response.ok) {
        if (response.json.success === true) {
          alert("Your feedback has been submitted successfully!");
        } else {
          this.setState({ isUpdating: false });
          console.log(response, response.json.error_message);
          alert(
            "Error: \n Code " +
              response.json.error_code +
              "\n" +
              response.json.error_message
          );
        }
      } else {
        this.setState({ isUpdating: false });
        alert(
          "Something went wrong! \n Error: \n Code \n " + response.json.status
        );
      }
    });
    this.body = {};
  }

  handleOk() {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 1000);
  }

  handleCancel() {
    this.setState({ visible: false });
  }

  handleChange(value) {
    this.setState({ value });
  }

  generateModal() {
    const { value, visible } = this.state;
    const modalBoxStyle = {
      position: "fixed",
      marginTop: "10%",
      right: "20px",
      color: "#261268"
    };
    const textBoxStyle = {
      border: "1px solid rgba(132, 100, 239, 1)",
      borderRadius: "4px",
      height: "140px",
      width: "100%",
      marginTop: "8px"
    };
    const quesitonContainerStyle = {
      marginTop: "12px"
    };
    const quesitonLabelStyle = {
      marginTop: "8px"
    };
    const buttonsContainerStyle = {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "16px",
      width: "300px"
    };
    const buttonStyle = {
      backgroundColor: "rgb(92, 39, 195)",
      height: "28px",
      width: "70px",
      textAlign: "center",
      paddingTop: "4px",
      marginRight: "16px",
      color: "white"
    };

    return (
      <div>
        <div
          className="feedback-open-button"
          type="primary"
          onClick={this.showModal}
        >
          Feedback
        </div>
        <Modal
          visible={visible}
          title="Feedback"
          width="340px"
          style={modalBoxStyle}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <h4 style={{ color: "#261268" }}>
            Your feedback is important for us
          </h4>
          <form onSubmit={this.handleSubmit}>
            <div style={quesitonContainerStyle} className="question">
              <label style={quesitonLabelStyle} className="question-label">
                How do you like our platform?
              </label>
              <Rate
                tooltips={desc}
                onChange={value => this.handleChange(value)}
                value={value}
              />
              {value ? (
                <span className="ant-rate-text">{desc[value - 1]}</span>
              ) : (
                ""
              )}
            </div>
            <div style={quesitonContainerStyle} className="question">
              <label style={quesitonLabelStyle} className="question-label">
                Would you like to give us a feedback?
              </label>
              <textarea
                style={textBoxStyle}
                className="text-box"
                placeholder="+add feedback"
              />
            </div>
            <div style={buttonsContainerStyle} className="buttons-container">
              <div key="submit" type="primary" onClick={this.handleOk}>
                <button style={buttonStyle} className="button" type="submit">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  render() {
    return <div className="feedback-container">{this.generateModal()}</div>;
  }
}

export default FeedBack;
