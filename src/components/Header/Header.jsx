import React, {Component} from "react";

import './style.scss'

class Header extends Component {
  render() {
    return (
      <div className="header-container">
        <div className="jobhax-logo">
        </div>
        <div className="header-icon general">
          <img src="../../src/assets/icons/syncicon.png"></img>
        </div>
        <div className="header-icon general">
          <img src="../../src/assets/icons/globe.png"></img>
        </div>
        <div className="header-icon general">
          <img src="../../src/assets/icons/metricsicon.png"></img>
        </div>
        <div className="header-icon user-icon">
          <img src="../../src/assets/icons/usericon.png"></img>
        </div>
      </div>
    );
  }
}

export default Header;