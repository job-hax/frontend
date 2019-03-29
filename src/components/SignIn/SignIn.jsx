import React, {Component} from "react";
import {
  Link,
  Redirect
} from 'react-router-dom';

import Footer from '../Footer/Footer.jsx';
import {loginUserRequest} from '../../utils/api/requests.js';
import {fetchApi} from '../../utils/api/fetch_api'

import './style.scss'

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toDashboard: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    let {url, config} = loginUserRequest;
    config.body.username = event.target[0].value;
    config.body.password = event.target[1].value;
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
          <label>Username</label>
          <input className="input-box"></input>
        </div>
        <div className="form-element-container">
          <label>Password</label>
          <input className="input-box"></input>
        </div>
        <button className="social-buttons form-button">Sign in</button>
      </form>
    )
  }

  generateSignIn() {
    return (
      <div className="sign_in-container">
        <div className="content-container">
          <h1>Sign in</h1>
          {this.generateForm()}
        </div>
        <div className="social-buttons-container">
          <Link to="/dashboard">
            <button className="social-buttons" onClick={this.props.handleGoogleSignIn}>Sign in with GOOGLE</button>
          </Link>
        </div>
        <div className="Loading-buttons-container">
          <Link to="/signup">
            <button className="social-buttons">Sign up!</button>
          </Link>
        </div>
      </div>
    )
  }

  render() {
    if (this.state.toDashboard) {

      return <Redirect to='/dashboard'/>
    }
    return (
      <div className="sign_in-background">
        {this.generateTopButtons()}
        {this.generateSignIn()}
        <div className="bottom-fixed-footer">
          <Footer/>
        </div>
      </div>

    )
  }
}

export default SignIn;