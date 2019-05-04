import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Footer from "../../Partials/Footer/Footer.jsx";

import "./style.scss";

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.handleSignUp = this.handleSignUp.bind(this);
    this.generateSignUpForm = this.generateSignUpForm.bind(this);
  }

  handleSignUp(event) {
    IS_CONSOLE_LOG_OPEN && console.log("handle sign up first");
    event.preventDefault();
    registerUserRequest.config.body.first_name = event.target[0].value;
    registerUserRequest.config.body.last_name = event.target[1].value;
    registerUserRequest.config.body.username = event.target[2].value;
    registerUserRequest.config.body.email = event.target[3].value;
    registerUserRequest.config.body.password = event.target[4].value;
    registerUserRequest.config.body.password2 = event.target[5].value;
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
            alert(
              "Registration mail has sent to your email successfully! \nPlease click the link on your email to activate your account!"
            );
          } else {
            console.log(response, response.json.error_message);
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
    registerUserRequest.config.body = JSON.parse(
      registerUserRequest.config.body
    );
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

  generateSignUpForm() {
    return (
      <form onSubmit={this.handleSignUp} className="form-container">
        <div className="form-element-container">
          <label>First Name</label>
          <input className="input-box" />
        </div>
        <div className="form-element-container">
          <label>Last Name</label>
          <input className="input-box" />
        </div>
        <div className="form-element-container">
          <label>User Name</label>
          <input className="input-box" />
        </div>
        <div className="form-element-container">
          <label>Email</label>
          <input className="input-box" />
        </div>
        <div className="form-element-container">
          <label>Password</label>
          <input type="password" className="input-box" />
        </div>
        <div className="form-element-container">
          <label>Re-enter Password</label>
          <input type="password" className="input-box" />
        </div>
        <button className="social-buttons form-button">Sign up</button>
      </form>
    );
  }

  generateSignUp() {
    return (
      <div className="sign_up-container">
        <div className="content-container">
          <h1>Sign up</h1>
          {this.generateSignUpForm()}
        </div>
        <div className="Loading-buttons-container">
          <Link to="/signin">
            <button className="social-buttons">Sign in!</button>
          </Link>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="sign_up-background">
        {this.generateTopButtons()}
        {this.generateSignUp()}
        <div className="bottom-fixed-footer">
          <Footer />
        </div>
      </div>
    );
  }
}

export default SignUp;
