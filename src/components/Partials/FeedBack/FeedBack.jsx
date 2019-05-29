import React from "react";
import { Rate, Modal } from "antd";

import { feedbackRequest } from "../../../utils/api/requests.js";
import { axiosCaptcha } from "../../../utils/api/fetch_api";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";

import "./style.scss";
import "../../../assets/libraryScss/antd-scss/newantd.scss";

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

class FeedBack extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textValue: "",
      value: null,
      visible: false
    };

    this.body = {};
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  showModal() {
    this.setState({
      visible: true
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.submit(event.target[0].value);
  }

  async submit(feedback) {
    await this.props.handleTokenExpiration("feedback submit");
    if (feedback.trim() != (null || "")) {
      this.body["text"] = this.state.textValue.trim();
    }
    feedbackRequest.config.body = this.body;
    console.log(feedbackRequest.config.body);
    const response = await axiosCaptcha(
      feedbackRequest.url,
      feedbackRequest.config,
      "feedback"
    );
    if (response.statusText === "OK") {
      if (response.data.success === true) {
        this.setState({ textValue: "" });
        this.props.alert(
          2000,
          "success",
          "Your feedback has been submitted successfully!"
        );
      } else {
        this.setState({ isUpdating: false });
        console.log(response, response.data.error_message);
        this.props.alert(
          5000,
          "error",
          "Error: " + response.data.error_message
        );
      }
    } else {
      this.setState({ isUpdating: false });
      if (response.data === 500) {
        this.props.alert(
          5000,
          "error",
          "You have to fill the all feedback form!"
        );
      } else {
        this.props.alert(5000, "error", "Something went wrong!");
      }
    }
    this.body = {};
    this.setState({ value: null });
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
    this.body["star"] = value;
  }

  handleTextChange(event) {
    this.setState({ textValue: event.target.value });
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
      marginTop: "8px",
      maxHeight: "140px",
      minHeight: "140px"
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
      height: "32px",
      width: "70px",
      textAlign: "center",
      paddingTop: "0px",
      marginRight: "16px",
      color: "white",
      cursor: "pointer"
    };

    const feedbackButtonStyle =
      window.location.pathname == "/underconstruction"
        ? { display: "none" }
        : { bottom: "86px" };

    return (
      <div>
        <div
          className="feedback-open-button"
          style={feedbackButtonStyle}
          type="primary"
          onClick={this.showModal}
        >
          <div>
            <img src="../../../../src/assets/icons/feedback_icon.png" />
          </div>
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
                value={this.state.textValue}
                onChange={this.handleTextChange}
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
