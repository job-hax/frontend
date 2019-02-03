import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import './style.scss'

class Header extends Component {
  render() {
    return (
      <div className="header-container">
        <div className="jobhaxlogo">
          <Link to="/">
            Back
          </Link>
        </div>
        <div className="header-icon general">
          <Link to="/test1/">
            <img src="../../src/assets/icons/syncicon.png"></img>
          </Link>
        </div>
        <div className="header-icon general">
          <Link to="/test1/">
            <img src="../../src/assets/icons/globe.png"></img>
          </Link>
        </div>
        <div className="header-icon general">
          <Link to="/dashboard">
            <img src="../../src/assets/icons/metricsicon.png"></img>
          </Link>
        </div>
        <div className="header-icon user-icon">
          <Link to="/test1/">
            <img src="../../src/assets/icons/usericon.png"></img>
          </Link>
        </div>
      </div>
  );
  }
  }

  export default Header;