import React, {Component} from "react";
import {Link} from 'react-router-dom';
import Footer from '../Footer/Footer.jsx';
import {registerUserRequest} from '../../utils/api/requests.js';

import './style.scss'

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleSignUp() {
    this.props.googleAuth.signIn();
  }

  handleSubmit(event) {
    event.preventDefault();
    registerUserRequest.body = {
      first_name: event.target[0].value,
      last_name: event.target[1].value,
      username: event.target[2].value,
      email: event.target[3].value,
      password: event.target[4].value,
      password2: event.target[5].value
    }
  }

  generateTopButtons() {
    return (
      <div className="top-buttons">
        <Link to="/">
          <img className="logo" src="src/assets/icons/JobHax-logo-white.svg" alt="JobHax-logo"/>
        </Link>
        <Link to="/">
          <button>Home</button>
        </Link>
      </div>
    )
  }

  generateForm() {
    return (
      <form onSubmit={this.handleSubmit} className="form-container">
        <div className="form-element-container">
          <label>First Name</label>
          <input className="input-box"></input>
        </div>
        <div className="form-element-container">
          <label>Last Name</label>
          <input className="input-box"></input>
        </div>
        <div className="form-element-container">
          <label>User Name</label>
          <input className="input-box"></input>
        </div>
        <div className="form-element-container">
          <label>Email</label>
          <input className="input-box"></input>
        </div>
        <div className="form-element-container">
          <label>Password</label>
          <input className="input-box"></input>
        </div>
        <div className="form-element-container">
          <label>Re-enter Password</label>
          <input className="input-box"></input>
        </div>
        <button className="social-buttons form-button">Sign up</button>
      </form>
    )
  }

  generateSignUp() {
    return (
      <div className="sign_up-container">
        <div className="content-container">
          <h1>Sign up</h1>
          {this.generateForm()}
        </div>
        <div className="social-buttons-container">
          <Link to="/dashboard">
            <button className="social-buttons" onClick={this.handleSignUp}>Sign up with GOOGLE</button>
          </Link>
        </div>
        <div className="redirect-buttons-container">
          <Link to="/signin">
            <button className="social-buttons">Sign in!</button>
          </Link>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="sign_up-background">
        {this.generateTopButtons()}
        {this.generateSignUp()}
        <div className="bottom-fixed-footer">
          <Footer/>
        </div>
      </div>

    )
  }
}

export default SignUp;