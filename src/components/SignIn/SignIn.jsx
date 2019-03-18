import React, {Component} from "react";
import {Link} from 'react-router-dom';
import Footer from '../Footer/Footer.jsx';
import {registerUserRequest} from '../../utils/api/requests.js';

import './style.scss'

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  handleSignIn() {
    this.props.googleAuth.signIn();
  }

  handleSubmit(event) {
    event.preventDefault()
    console.log(event.target[0].value)
    console.log(event.target[1].value)
    registerUserRequest.body={
      email: event.target[0].value,
      password: event.target[1].value
    }
  }

  generateTopButtons(){
    return (
      <div className="home-button">
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
          <label>Email</label>
          <input className="input-box"></input>
        </div>
        <div className="form-element-container">
          <label>Password</label>
          <input className="input-box"></input>
        </div>
        <button className="social-buttons form-button" >Sign in </button>
      </form>
    )
  }

  generateSignIn() {
    return(
      <div className="sign_in-container">
        <div className="content-container">
          <h1>Sign in</h1>
          {this.generateForm()}
        </div>
        <div className="social-buttons-container">
          <Link to="/dashboard">
            <button className="social-buttons" onClick={this.handleSignIn}>Sign in with GOOGLE</button>
          </Link>
        </div>
        <div className="redirect-buttons-container">
          <Link to="/signup">
            <button className="social-buttons">Sign up!</button>
          </Link>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="sign_in-background">
        {this.generateTopButtons()}
        {this.generateSignIn()}
        <div  className="bottom-fixed-footer">
          <Footer/>
        </div> 
      </div>
      
    )
  }
}

export default SignIn;