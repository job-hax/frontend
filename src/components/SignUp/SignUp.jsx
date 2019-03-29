import React, {Component} from "react";
import {
  Link,
  Redirect
} from 'react-router-dom';
import Footer from '../Footer/Footer.jsx';
import {registerUserRequest} from '../../utils/api/requests.js';
import {fetchApi} from '../../utils/api/fetch_api'

import './style.scss'

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toDashboard: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    let {url, config} = registerUserRequest;
    config.body.first_name = event.target[0].value;
    config.body.last_name = event.target[1].value;
    config.body.username = event.target[2].value;
    config.body.email = event.target[3].value;
    config.body.password = event.target[4].value;
    config.body.password2 = event.target[5].value;
    config.body = JSON.stringify(config.body);
    fetchApi(url, config)
      .then(response => {
        if (response.ok) {
          this.setState({
            toDashboard: true
          });
        }
      });
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
          <Link to="/loading">
            <button className="social-buttons" onClick={this.props.handleGoogleSignIn}>Sign up with GOOGLE</button>
          </Link>
        </div>
        <div className="Loading-buttons-container">
          <Link to="/signin">
            <button className="social-buttons">Sign in!</button>
          </Link>
        </div>
      </div>
    )
  }

  render() {
    if (this.state.toDashboard) {
      return <Redirect to="/dashboard"/>
    }
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