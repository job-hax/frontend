import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Footer from "../Partials/Footer/Footer.jsx";

import "./style.scss";

class SignUp extends Component {
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

  generateSignUp() {
    return (
      <div className="sign_up-container">
        <div className="content-container">
          <h1>Sign up</h1>
          {this.props.generateSignUpForm()}
        </div>
        <div className="social-buttons-container">
          <Link to="/dashboard">
            <button
              className="social-buttons"
              onClick={this.props.handleGoogleSignIn}
            >
              Sign up with GOOGLE
            </button>
          </Link>
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
    if (this.props.toSigIn) {
      return <Redirect to="/signin" />;
    }
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
