import React, {Component} from "react";

import './style.scss'

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    this.props.googleAuth.signIn();
  }

  render() {
    return (
      <div className="login-container">
        <div>
          <button onClick={this.handleLogin}>
            LOGIN WITH GOOGLE
          </button>
        </div>
      </div>
    )
  }
}

export default Login;