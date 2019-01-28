import React, {Component} from "react";

import './style.scss'

class Header extends Component {
  render() {
    return (
      <div className="header-container">
        <div className="header-icon icon-settings">
        </div>
        <div className="header-icon icon-globe">
        </div>
        <div className="header-icon icon-dashboard">
        </div>
        <div className="header-icon icon-profile">
        </div>
      </div>
    );
  }
}

export default Header;