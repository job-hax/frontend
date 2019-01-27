import React, {Component} from "react";

import './style.scss'

class Header extends Component {
  render() {
    return (
      <div className="header-container">
        <div className="header-icon username">
          Icon1
        </div>
        <div className="header-icon username">
          Icon2
        </div>
        <div className="header-icon username">
          Icon3
        </div>
        <div className="header-icon username">
          Icon4
        </div>
      </div>
    );
  }
}

export default Header;