import React, {Component} from "react";

import './style.scss'

class Header extends Component {
  render() {
    return (
      <div className="header-container">
        <div className="header-icon general">
          <img src="../../src/assets/icons/settings.png"></img>
        </div>
        <div className="header-icon general">
          <img src="../../src/assets/icons/connect.png"></img>
        </div>
        <div className="header-icon general">
          <img src="../../src/assets/icons/metrics.png"></img>
        </div>
        <div className="header-icon user-icon">
          <img src="../../src/assets/icons/user.png"></img>
        </div>
      </div>
    );
  }
}

export default Header;