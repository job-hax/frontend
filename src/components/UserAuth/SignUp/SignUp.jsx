import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Icon, Select, Checkbox, Button } from "antd";

import { fetchApi } from "../../../utils/api/fetch_api";
import { registerUserRequest } from "../../../utils/api/requests.js";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";
import Footer from "../../Partials/Footer/Footer.jsx";

import "./style.scss";

const UserAgreementModal = Form.create({ name: "form_in_modal" })(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          centered
          title="User Agreement"
          okText="Submit"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Username or Email Address">
              {getFieldDecorator("username", {
                rules: [
                  {
                    required: true,
                    message: "Please enter your username or email address!"
                  }
                ]
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

class SignUpPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmDirty: false,
      isAgreementRead: false,
      isAgreementDisplaying: false
    };

    this.handleSignUp = this.handleSignUp.bind(this);
    this.generateSignUpForm = this.generateSignUpForm.bind(this);
    this.compareToFirstPassword = this.compareToFirstPassword.bind(this);
    this.validateToNextPassword = this.validateToNextPassword.bind(this);
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
  }

  compareToFirstPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords do not match!");
    } else {
      callback();
    }
  }

  validateToNextPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  }

  handleConfirmBlur(event) {
    const value = event.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  handleSignUp(event) {
    event.preventDefault();
    if (
      event.target[0].value.trim() === (null || "") ||
      event.target[1].value.trim() === (null || "") ||
      event.target[2].value.trim() === (null || "") ||
      event.target[3].value.trim() === (null || "")
    ) {
      this.props.alert(3000, "error", "You have to fill out all sign up form!");
    } else {
      if (this.state.isAgreementRead === true) {
        registerUserRequest.config.body.first_name = "";
        registerUserRequest.config.body.last_name = "";
        registerUserRequest.config.body.username = event.target[0].value;
        registerUserRequest.config.body.email = event.target[1].value;
        registerUserRequest.config.body.password = event.target[2].value;
        registerUserRequest.config.body.password2 = event.target[3].value;
        IS_CONSOLE_LOG_OPEN &&
          console.log(
            "handle sign up config body",
            registerUserRequest.config.body
          );
        registerUserRequest.config.body = JSON.stringify(
          registerUserRequest.config.body
        );
        fetchApi(registerUserRequest.url, registerUserRequest.config).then(
          response => {
            if (response.ok) {
              console.log(response.json);
              if (response.json.success === true) {
                this.props.alert(
                  5000,
                  "success",
                  "Registration mail has sent to your email successfully! \nPlease click the link on your email to activate your account!"
                );
              } else {
                console.log(response, response.json.error_message);
                this.props.alert(
                  5000,
                  "error",
                  "Error: " + response.json.error_message
                );
              }
            } else {
              if (response.json == "500") {
                this.props.alert(
                  3000,
                  "error",
                  "You have to fill out all from!"
                );
              } else {
                this.props.alert(5000, "error", "Something went wrong!");
              }
            }
          }
        );
        registerUserRequest.config.body = JSON.parse(
          registerUserRequest.config.body
        );
      } else {
        this.props.alert(
          3000,
          "error",
          "You have to agree with the user agreement!"
        );
      }
    }
  }

  generateTopButtons() {
    return (
      <div className="sign_up-top">
        <Link to="/">
          <img
            className="logo"
            src="src/assets/icons/JobHax-logo-white.svg"
            alt="JobHax-logo"
          />
        </Link>
        <Link to="/">
          <button>Home</button>
        </Link>
      </div>
    );
  }

  generateSignUpForm() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSignUp}>
        <Form.Item style={{ width: "272px" }}>
          {getFieldDecorator("Username", {
            rules: [
              {
                required: true,
                message: "Please enter your Username!",
                whitespace: true
              }
            ]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Username"
              style={{ width: "272px" }}
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("email", {
            rules: [
              {
                type: "email",
                message: "The enter is not valid E-mail!"
              },
              {
                required: true,
                message: "Please enter your E-mail!"
              }
            ]
          })(
            <Input
              prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="E-mail"
              style={{ width: "272px" }}
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "Please enter your password!"
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Password"
              style={{ width: "272px" }}
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("confirm", {
            rules: [
              {
                required: true,
                message: "Please confirm your password!"
              },
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Confirm Password"
              style={{ width: "272px" }}
              onBlur={this.handleConfirmBlur}
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("agreement", {
            valuePropName: "checked"
          })(
            <div style={{ display: "flex", justifyContent: "left" }}>
              <div>
                <Checkbox
                  style={{
                    width: "24px",
                    height: "48px"
                  }}
                  onClick={() =>
                    this.setState({
                      isAgreementRead: !this.state.isAgreementRead
                    })
                  }
                />
              </div>
              <div style={{ marginTop: "-8px" }}>
                <span
                  style={{
                    width: "252px",
                    fontSize: "90%",
                    height: "48px",
                    padding: 0
                  }}
                >
                  I agree with the{" "}
                  <a onClick={() => window.open("/useragreement")}>
                    user agreement
                  </a>{" "}
                  and{" "}
                </span>
                <div
                  style={{
                    marginTop: "-24px",
                    fontSize: "90%"
                  }}
                >
                  <a onClick={() => window.open("/privacypolicy")}>
                    privacy policy
                  </a>
                </div>
              </div>
            </div>
          )}
        </Form.Item>
        <Form.Item>
          <div style={{ marginTop: "-28px" }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                borderRadius: 0,
                width: "272px"
              }}
            >
              Sign Up
            </Button>
          </div>
        </Form.Item>
        <div style={{ fontSize: "90%" }}>
          Do you have an account? Go <Link to="/signin">sign in!</Link>
        </div>
      </Form>
    );
  }

  generateSignUp() {
    return (
      <div className="sign_up-form-container">
        <div className="content-container">
          <h1>Sign up</h1>
          {this.generateSignUpForm()}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="sign_up-background">{this.generateTopButtons()}</div>
        <div className="sign_up-vertical-container">
          <div className="sign_up-container">{this.generateSignUp()}</div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    );
  }
}

const SignUp = Form.create({ name: "signup" })(SignUpPage);

export default SignUp;
