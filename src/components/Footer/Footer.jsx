import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import './style.scss'

class Footer extends Component {
    render() {
        return (
            <div className="footer-container">
                <div className="footer-content footer-inside-links">
                    <div>
                        <Link to="/aboutus">
                            <span style={{margin: "4px" , color: "white"}}>About Us</span>
                        </Link>
                        <Link to="/underconstruction">
                            <span style={{margin: "4px" , color: "white"}}>FAQ</span>
                        </Link>
                        <Link to="/underconstruction">
                            <span style={{margin: "4px" , color: "white"}}>Legal</span>
                        </Link>
                    </div>
                </div>
                <div className="footer-content footer-notation">
                    <span>JobHax 2019<br />All Rights Reserved</span>
                </div>
                <div className="footer-content footer-social-links">
                    <div >
                        <a href="https://github.com/job-hax">
                            <span style={{margin: "4px" , color: "white"}}>GitHub</span>
                        </a>
                        <a href="https://jobhax.slack.com">
                            <span style={{margin: "4px" , color: "white"}}>Slack</span>
                        </a>
                        <a href="https://groups.google.com/forum/#!forum/jobhax">
                            <span style={{margin: "4px" , color: "white"}}>Forum</span>
                        </a>
                    </div>
                </div> 
            </div>   
        );
    }
}

export default Footer;