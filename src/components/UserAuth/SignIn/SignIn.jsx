import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal, Form, Input } from "antd";

import Footer from "../../Partials/Footer/Footer.jsx";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";
import { googleClientId } from "../../../config/config.js";

import { fetchApi } from "../../../utils/api/fetch_api";
import {
  authenticateRequest,
  loginUserRequest,
  updateProfilePhotoRequest,
  postUsersRequest
} from "../../../utils/api/requests.js";

import "./style.scss";

const ForgotPasswordModal = Form.create({ name: "form_in_modal" })(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Forgot Password"
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

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      username: "",
      password: "",
      profilePhotoUrl: "",
      isUserLoggedIn: false,
      isUserAuthenticated: false,
      isAuthenticationChecking: false,
      isVerificationReSendDisplaying: false,
      showModal: false
    };

    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleGoogleSignIn = this.handleGoogleSignIn.bind(this);
    this.generateSignInForm = this.generateSignInForm.bind(this);
    this.postUser = this.postUser.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.saveFormRef = this.saveFormRef.bind(this);
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  handleCreate() {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log("Received values of form: ", values);
      postUsersRequest.config.body = JSON.stringify(values);
      fetchApi(
        postUsersRequest.url("forgot_password"),
        postUsersRequest.config
      ).then(response => {
        if (response.ok) {
          if (response.json.success === true) {
            this.toggleModal();
            alert("A link to reset password has sent to your email!");
          } else {
            alert(
              "Error: \n Code " +
                response.json.error_code +
                "\n" +
                response.json.error_message
            );
          }
        } else {
          alert(
            "Something went wrong! \n Error: \n Code \n " + response.status
          );
        }
      });
      form.resetFields();
    });
  }

  saveFormRef(formRef) {
    this.formRef = formRef;
  }

  postUser(type) {
    if (type === "generate_activation_code") {
      postUsersRequest.config.body = JSON.stringify({
        username: this.state.username,
        password: this.state.password
      });
      fetchApi(postUsersRequest.url(type), postUsersRequest.config).then(
        response => {
          if (response.ok) {
            if (response.json.success === true) {
              this.setState({
                isVerificationReSendDisplaying: false,
                username: "",
                password: ""
              });
              alert("New activation link has sent to your email!");
            } else {
              alert(
                "Error: \n Code " +
                  response.json.error_code +
                  "\n" +
                  response.json.error_message
              );
            }
          } else {
            alert(
              "Something went wrong! \n Error: \n Code \n " + response.status
            );
          }
        }
      );
    }
  }

  handleSignIn(event) {
    IS_CONSOLE_LOG_OPEN && console.log("handle sign in first");
    event.preventDefault();
    loginUserRequest.config.body.username = event.target[0].value;
    loginUserRequest.config.body.password = event.target[1].value;
    IS_CONSOLE_LOG_OPEN &&
      console.log("handle sign in config body", loginUserRequest.config.body);
    loginUserRequest.config.body = JSON.stringify(loginUserRequest.config.body);
    fetchApi(loginUserRequest.url, loginUserRequest.config).then(response => {
      if (response.ok) {
        if (response.json.success === true) {
          this.token = `${
            response.json.data.token_type
          } ${response.json.data.access_token.trim()}`;
          IS_CONSOLE_LOG_OPEN && console.log(this.token);
          this.setState({
            token: this.token
          });
          this.props.passStatesFromSignin(
            this.token,
            true,
            response.json.data.profile_updated
          );
          this.setState({
            isUserLoggedIn: true,
            isAuthenticationChecking: false
          });
          this.props.setIsUserLoggedIn(true);
          this.props.setIsAuthenticationChecking(false);
        } else {
          if (response.json.error_code === 13) {
            this.setState({
              isVerificationReSendDisplaying: true,
              username: loginUserRequest.config.body.username,
              password: loginUserRequest.config.body.password
            });
          } else {
            console.log(response, response.json.error_message);
            alert(
              "Error: \n Code " +
                response.json.error_code +
                "\n" +
                response.json.error_message
            );
          }
        }
      } else {
        alert("Something went wrong! \n Error: \n Code \n " + response.status);
      }
    });
    loginUserRequest.config.body = JSON.parse(loginUserRequest.config.body);
  }

  handleGoogleSignIn() {
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          clientId: googleClientId,
          scope: "email https://www.googleapis.com/auth/gmail.readonly"
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
              IS_CONSOLE_LOG_OPEN &&
                console.log(
                  "google access_token:",
                  response.Zi.access_token,
                  response,
                  response.w3.Paa
                );
              let photoUrl = response.w3.Paa;
              const { url, config } = authenticateRequest;
              config.body.token = this.googleAuth.currentUser
                .get()
                .getAuthResponse().access_token;
              config.body = JSON.stringify(config.body);
              fetchApi(url, config).then(response => {
                if (response.ok) {
                  this.token = `${
                    response.json.data.token_type
                  } ${response.json.data.access_token.trim()}`;
                  this.postGoogleProfilePhoto(photoUrl, this.token);
                  IS_CONSOLE_LOG_OPEN &&
                    console.log(
                      this.token,
                      "profile updated?",
                      response.json.data.profile_updated
                    );
                  this.props.passStatesFromSignin(
                    this.token,
                    true,
                    response.json.data.profile_updated
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
              config.body = JSON.parse(config.body);
            }
          });
        });
    });
  }

  postGoogleProfilePhoto(photoURL, token) {
    updateProfilePhotoRequest.config.headers.Authorization = token;
    updateProfilePhotoRequest.config.body = JSON.stringify({
      photo_url: photoURL
    });
    console.log(updateProfilePhotoRequest);
    fetchApi(
      updateProfilePhotoRequest.url,
      updateProfilePhotoRequest.config
    ).then(response => {
      if (response.ok) {
        console.log(response);
      }
    });
  }

  generateTopButtons() {
    return (
      <div className="top-buttons">
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

  generateSignInForm() {
    const style = {
      textSize: "90%",
      textWeight: "350",
      textStyle: "italic",
      cursor: "pointer"
    };
    return (
      <form onSubmit={this.handleSignIn} className="form-container">
        <div className="form-element-container">
          <label>Username</label>
          <input className="input-box" />
        </div>
        <div className="form-element-container">
          <label>Password</label>
          <input type="password" className="input-box" />
        </div>
        <div
          style={{
            textAlign: "end",
            marginRight: "20px"
          }}
        >
          <div>
            <span style={style} onClick={this.toggleModal}>
              {" "}
              Forgot password?{" "}
            </span>
            <ForgotPasswordModal
              wrappedComponentRef={this.saveFormRef}
              visible={this.state.showModal}
              onCancel={this.toggleModal}
              onCreate={this.handleCreate}
            />
          </div>
          {this.state.isVerificationReSendDisplaying && (
            <div onClick={() => this.postUser("generate_activation_code")}>
              <a style={style}> Resend activation email? </a>
            </div>
          )}
        </div>

        <button className="social-buttons form-button">Sign in</button>
      </form>
    );
  }

  generateSignIn() {
    return (
      <div className="sign_in-container">
        <div className="content-container">
          <h1>Sign in</h1>
          {this.generateSignInForm()}
        </div>
        <div className="social-buttons-container">
          <Link to="/dashboard">
            <button
              className="social-buttons"
              onClick={this.handleGoogleSignIn}
            >
              Sign in with GOOGLE
            </button>
          </Link>
        </div>
        <div className="Loading-buttons-container">
          <Link to="/signup">
            <button className="social-buttons">Sign up!</button>
          </Link>
        </div>
      </div>
    );
  }

  render() {
    IS_CONSOLE_LOG_OPEN && console.log("signIn page render run");
    return (
      <div className="sign_in-background">
        {this.generateTopButtons()}
        {this.generateSignIn()}
        <div className="bottom-fixed-footer">
          <Footer />
        </div>
      </div>
    );
  }
}

export default SignIn;
