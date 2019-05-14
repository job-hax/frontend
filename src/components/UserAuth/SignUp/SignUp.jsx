import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Form, Input, Icon, Select, Checkbox, Button } from "antd";

import { googleClientId } from "../../../config/config.js";
import { axiosCaptcha } from "../../../utils/api/fetch_api";
import {
  registerUserRequest,
  authenticateRequest,
  updateProfilePhotoRequest
} from "../../../utils/api/requests.js";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";
import Footer from "../../Partials/Footer/Footer.jsx";

import "./style.scss";

class SignUpPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      isUserLoggedIn: false,
      isUserAuthenticated: false,
      isAuthenticationChecking: false,
      confirmDirty: false,
      isEmailSignUpRequested: false
    };

    this.handleSignUp = this.handleSignUp.bind(this);
    this.generateSignUpForm = this.generateSignUpForm.bind(this);
    this.compareToFirstPassword = this.compareToFirstPassword.bind(this);
    this.validateToNextPassword = this.validateToNextPassword.bind(this);
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
    this.handleGoogleSignIn = this.handleGoogleSignIn.bind(this);
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

  handleGoogleSignIn() {
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          apiKey: "AIzaSyBnF8loY6Vqhs4QWTM_fWCP93Xidbh1kYo",
          clientId: googleClientId,
          scope: "email https://www.googleapis.com/auth/gmail.readonly",
          prompt: "select_account"
        })
        .then(() => {
          this.googleAuth = window.gapi.auth2.getAuthInstance();
          let authenticated = this.googleAuth.isSignedIn.get();
          this.setState(() => ({ isUserAuthenticated: authenticated }));
          this.googleAuth.isSignedIn.listen(
            this.props.setIsUserAuthenticated(this.googleAuth.isSignedIn.get())
          );
          this.googleAuth.signIn().then(response => {
            IS_CONSOLE_LOG_OPEN && console.log("signIn response", response);
            if (response.Zi.token_type === "Bearer") {
              let photoUrl = response.w3.Paa;
              let googleAccessTokenExpiresOn = new Date();
              googleAccessTokenExpiresOn.setSeconds(
                googleAccessTokenExpiresOn.getSeconds() + response.Zi.expires_in
              );
              const { url, config } = authenticateRequest;
              config.body.token = this.googleAuth.currentUser
                .get()
                .getAuthResponse().access_token;
              axiosCaptcha(url, config, "signin").then(response => {
                if (response.statusText === "OK") {
                  this.token = `${
                    response.data.data.token_type
                  } ${response.data.data.access_token.trim()}`;
                  IS_CONSOLE_LOG_OPEN && console.log(this.token);
                  this.refresh_token = response.data.data.refresh_token;
                  let date = new Date();
                  date.setSeconds(
                    date.getSeconds() + response.data.data.expires_in
                  );
                  this.expires_in = date;
                  this.props.cookie(
                    "set",
                    "google_access_token_expiration",
                    googleAccessTokenExpiresOn.getTime(),
                    "/",
                    googleAccessTokenExpiresOn
                  );
                  this.props.cookie(
                    "set",
                    "jobhax_access_token",
                    this.token,
                    "/",
                    date
                  );
                  this.props.cookie(
                    "set",
                    "jobhax_access_token_expiration",
                    date.getTime(),
                    "/"
                  );
                  this.props.cookie(
                    "set",
                    "jobhax_refresh_token",
                    this.refresh_token,
                    "/"
                  );
                  this.props.cookie("set", "remember_me", true, "/");
                  this.postGoogleProfilePhoto(photoUrl, this.token);
                  IS_CONSOLE_LOG_OPEN &&
                    console.log(
                      this.token,
                      "profile updated?",
                      response.data.data.first_login
                    );
                  this.props.passStatesFromSignin(
                    this.token,
                    true,
                    response.data.data.first_login
                  );
                  this.setState({ token: this.token });
                  this.setState({ isUserLoggedIn: true });
                  this.props.setIsUserLoggedIn(this.state.isUserLoggedIn);
                }
              });
              this.setState({ isAuthenticationChecking: false });
              this.props.setIsAuthenticationChecking(
                this.state.isAuthenticationChecking
              );
            }
          });
        });
    });
  }

  postGoogleProfilePhoto(photoURL, token) {
    updateProfilePhotoRequest.config.headers.Authorization = token;
    updateProfilePhotoRequest.config.body = {
      photo_url: photoURL
    };
    console.log(updateProfilePhotoRequest);
    axiosCaptcha(
      updateProfilePhotoRequest.url,
      updateProfilePhotoRequest.config
    ).then(response => {
      if (response.statusText === "OK") {
        console.log(response);
      }
    });
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
        axiosCaptcha(
          registerUserRequest.url,
          registerUserRequest.config,
          "signup"
        ).then(response => {
          if (response.statusText === "OK") {
            console.log(response.data);
            if (response.data.success === true) {
              this.props.alert(
                5000,
                "success",
                "Registration mail has sent to your email successfully! \nPlease click the link on your email to activate your account!"
              );
            } else {
              console.log(response, response.data.error_message);
              this.props.alert(
                5000,
                "error",
                "Error: " + response.data.error_message
              );
            }
          } else {
            if (response.data == "500") {
              this.props.alert(3000, "error", "You have to fill out all from!");
            } else {
              this.props.alert(5000, "error", "Something went wrong!");
            }
          }
        });
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

  generateSignupOptions() {
    return (
      <div>
        <div>
          <div className="social-buttons-container">
            <div>
              <button className="social-buttons-google">
                <img
                  onClick={this.handleGoogleSignIn}
                  src="../../../src/assets/icons/btn_google_signin_light_normal_web@2x.png"
                />
              </button>
            </div>
          </div>
          <div className="email-button-container">
            <div
              onClick={() => this.setState({ isEmailSignUpRequested: true })}
              className="email-button"
            >
              <Icon type="mail" />
              Sign Up with E-mail
            </div>
          </div>
        </div>
        <div style={{ fontSize: "90%" }}>
          Do you have an account? Go <Link to="/signin">sign in!</Link>
        </div>
      </div>
    );
  }

  generateSignUp() {
    return (
      <div className="sign_up-form-container">
        <div className="content-container">
          <h1>Sign up</h1>
          {this.state.isEmailSignUpRequested
            ? this.generateSignUpForm()
            : this.generateSignupOptions()}
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
        <div className="bottom-fixed-footer-sign_up">
          <Footer />
        </div>
      </div>
    );
  }
}

const SignUp = Form.create({ name: "signup" })(SignUpPage);

export default SignUp;
