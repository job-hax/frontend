import React from "react";
import { Rate, Modal, Button, Dropdown, Menu, Icon, Input, Radio } from "antd";
import classNames from "classnames";

import { axiosCaptcha } from "../../../utils/api/fetch_api";
import {
  IS_CONSOLE_LOG_OPEN,
  closeIcon,
  commentDots
} from "../../../utils/constants/constants.js";
import { USERS, FEEDBACKS } from "../../../utils/constants/endpoints.js";

import "./style.scss";

const desc = ["terrible", "bad", "normal", "good", "wonderful"];
const { TextArea } = Input;

class FeedBack extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textValue: "",
      value: null,
      visible: this.props.visible || false,
      feedbackData: {},
      selectedFeedback: { id: 0, custom_input: false },
      loading: false
    };

    this.body = {};
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);

    this.modalBoxStyle = {
      position: "fixed",
      right: "20px",
      bottom: "120px",
      color: "black",
      width: "250px",
      maxWidth: "250px",
      display: "flex",
      alignItems: "flex-end"
    };

    this.sendButton = (
      <Button
        key="submit"
        type="primary"
        loading={this.state.loading}
        onClick={this.handleOk}
        style={{ width: "105px" }}
      >
        Send
      </Button>
    );
  }

  componentDidMount() {
    let config = { method: "GET" };
    axiosCaptcha(FEEDBACKS, config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          let feedbackData = response.data.data;
          this.setState({ feedbackData: feedbackData });
        }
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.visible != this.props.visible) {
      this.setState({ visible: this.props.visible });
    }
  }

  showModal() {
    this.setState({
      visible: true
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.submit();
  }

  async submit() {
    await this.props.handleTokenExpiration("feedback submit");
    let url = this.props.isUserLoggedIn
      ? USERS("feedback")
      : FEEDBACKS + this.state.feedbackData.id + "/answer/";
    if (this.state.textValue.trim() !== ("" || null)) {
      this.props.isUserLoggedIn
        ? (this.body["text"] = this.state.textValue.trim())
        : (this.body["user_input"] = this.state.textValue.trim());
    }
    let config = { method: "POST" };
    config.body = this.body;
    const response = await axiosCaptcha(url, config, false);
    if (response.statusText === "OK") {
      this.setState({ loading: false });
      if (response.data.success === true) {
        this.setState({ textValue: "", visible: false });
        this.props.passStatesToApp("feedbackEmphasis", false);
        this.props.passStatesToApp("exitIntent", false);
        this.props.passStatesToApp("feedbackType", "normal");
        this.props.alert(
          2000,
          "success",
          "Your feedback has been submitted successfully!"
        );
      } else {
        IS_CONSOLE_LOG_OPEN &&
          console.log(response, response.data.error_message);
        this.props.alert(
          5000,
          "error",
          "Error: " + response.data.error_message
        );
      }
    } else {
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
    this.submit();
  }

  handleCancel() {
    this.setState({ visible: false, textValue: "" });
    this.body = {};
    this.props.passStatesToApp("feedbackEmphasis", false);
    this.props.passStatesToApp("exitIntent", false);
    this.props.passStatesToApp("feedbackType", "normal");
  }

  handleChange(value) {
    this.setState({ value });
    this.body["star"] = value;
  }

  handleTextChange(event) {
    this.setState({ textValue: event.target.value });
  }

  handleMenuClick(event) {
    let custom = event.target.custom;
    let id = event.target.value;
    this.body["item_id"] = id;
    this.setState({
      selectedFeedback: { id: id, custom_input: custom }
    });
  }

  generateFeedbackNonLoggedIn() {
    const radioItems = this.state.feedbackData.items.map(question =>
      !question.custom_input ? (
        <Radio
          value={question.id}
          name={question.value}
          custom={question.custom_input}
        >
          {question.value}
        </Radio>
      ) : (
        <TextArea
          value={this.state.textValue}
          onChange={this.handleTextChange}
          placeholder={question.value}
          autosize={{ minRows: 3, maxRows: 8 }}
          style={{
            margin: "7px 0px",
            padding: 4,
            resize: "none",
            lineHeight: "normal"
          }}
        />
      )
    );

    const radio = (
      <Radio.Group
        onChange={this.handleMenuClick}
        value={this.state.selectedFeedback.id}
      >
        {radioItems}
      </Radio.Group>
    );

    return (
      <div>
        <div style={{ padding: "0px 0px 7px 0px" }}>
          {this.state.feedbackData.title}
        </div>
        {radio}
      </div>
    );
  }

  generateFeedbackLoggedIn() {
    const textPlaceHolder =
      this.props.type === "afterSignup"
        ? "Anything else you'd like us to know?"
        : "Anything we can add or change to improve your experience?";

    const isDemoUser =
      this.props.cookie("get", "is_demo_user") != ("" || null)
        ? this.props.cookie("get", "is_demo_user")
        : false;

    return (
      <div>
        {this.props.type === "normal" && !isDemoUser && (
          <div style={{ padding: "0px 0px 7px 0px" }}>
            {"Hey " +
              this.props.user.first_name +
              ", we are happy to see you are back!"}
          </div>
        )}
        <div style={{ padding: "0px 0px 7px 0px" }}>
          How do you like JobHax so far?
        </div>
        <Rate
          tooltips={desc}
          onChange={value => this.handleChange(value)}
          value={this.state.value}
        />
        <TextArea
          value={this.state.textValue}
          onChange={this.handleTextChange}
          placeholder={textPlaceHolder}
          autosize={{ minRows: 3, maxRows: 8 }}
          style={{
            margin: "7px 0px",
            padding: 4,
            resize: "none",
            lineHeight: "normal"
          }}
        />
      </div>
    );
  }

  generateModal() {
    const { visible } = this.state;

    const content = this.props.isUserLoggedIn
      ? this.generateFeedbackLoggedIn()
      : this.state.feedbackData.items && this.generateFeedbackNonLoggedIn();

    return (
      <Modal
        visible={visible && content}
        style={this.modalBoxStyle}
        onCancel={this.handleCancel}
        confirmLoading={this.state.loading}
        title="Got Feedback?"
        footer={[this.sendButton]}
        closeIcon={closeIcon}
        getContainer={false}
      >
        {content}
      </Modal>
    );
  }

  render() {
    const feedbackButtonStyle =
      window.location.pathname == "/underconstruction"
        ? { display: "none" }
        : { bottom: "86px" };

    const feedbackButtonClass = classNames({
      "feedback-open-button": true,
      shake: this.props.feedbackEmphasis,
      "full-visible": this.state.visible
    });

    return (
      <div className="feedback-container">
        <div className={feedbackButtonClass} style={feedbackButtonStyle}>
          <Button type="primary" onClick={this.showModal}>
            <div style={{ display: "flex" }}>
              <div style={{ height: 24, width: 24, marginRight: 10 }}>
                {commentDots}
              </div>
              <div>Send Feedback</div>
            </div>
          </Button>
        </div>
        <div className="feedback-modal">{this.generateModal()}</div>
      </div>
    );
  }
}

export default FeedBack;
