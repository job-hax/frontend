import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import './style.scss'

class Footer extends Component {
  render() {
    return (
        <div className="footer-container">
            <div className="footer-content footer-inside-links">
                <div>
                    <Link to="/dashboard">
                        <t style={{margin: "4px" , color: "white"}}>About Us</t>
                    </Link>
                    <Link to="/dashboard">
                        <t style={{margin: "4px" , color: "white"}}>FAQ</t>
                    </Link>
                    <Link to="/dashboard">
                        <t style={{margin: "4px" , color: "white"}}>Legal</t>
                    </Link>
                </div>
            </div>
            <div className="footer-content footer-notation">
                <t>JobHax 2019<br />All Rights Reserved</t>
            </div>
           <div className="footer-content footer-social-links">
                <div >
                    <a href="https://github.com/job-hax">
                        <t >GitHub</t>
                    </a>
                    <a href="https://github.com/job-hax">
                        <t >Slack</t>
                    </a>
                    <a href="https://github.com/job-hax">
                        <t >LinkedIn</t>
                    </a>
                </div>
            </div> 
        </div>
      
  );
  }
  }

  export default Footer;