import React, {Component} from "react";
import {Link} from 'react-router-dom';
import Footer from '../Footer/Footer.jsx';

import './style.scss'

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    this.props.googleAuth.signIn();
  }

  handleSignUp(event) {
    event.preventDefault()
    console.log(event.target[0].value)
    console.log(event.target[1].value)
  }

  generateForm() {
    return (
      <form onSubmit={this.handleSignUp} className="form-container">
        <div className="form-element-container">
          <label>User Name</label>
          <input className="input-box"></input>
        </div>
        <div className="form-element-container">
          <label>Password</label>
          <input className="input-box"></input>
        </div>
        <button className="social-buttons" >Sign Up </button>
      </form>
    )
  }

  generateLogin() {
    return(
      <div className="login-container">
        <div className="content-container">
          <h1>Register</h1>
          {this.generateForm()}
        </div>
        <div className="social-buttons-container">
          <Link to="/dashboard">
            <button className="social-buttons" onClick={this.handleLogin}>Sign Up With GOOGLE</button>
          </Link>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.generateLogin()}
        <div  className="bottom-fixed-footer">
          <Footer/>
        </div> 
      </div>
      
    )
  }
}

export default Login;