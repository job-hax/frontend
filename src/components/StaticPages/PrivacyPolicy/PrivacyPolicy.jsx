import React, { Component } from "react";
import Footer from "../../Partials/Footer/Footer.jsx";
import { Link } from "react-router-dom";
import parse from "html-react-parser";

import { axiosCaptcha } from "../../../utils/api/fetch_api.js";
import { AGREEMENTS } from "../../../utils/constants/endpoints.js";

import "./style.scss";

class PrivacyPolicy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      privacy_policy: ""
    };
  }

  componentDidMount() {
    let config = { method: "GET" };
    axiosCaptcha(AGREEMENTS, config).then(response => {
      if (response.statusText === "OK") {
        this.setState({ privacy_policy: response.data.data.privacy });
      }
    });
  }

  generateTopButtons() {
    return (
      <div className="legal-top">
        <Link to="/home">
          <img
            className="logo"
            src="src/assets/icons/JobHax-logo-white.svg"
            alt="JobHax-logo"
          />
        </Link>
        <Link to="/home">
          <button>Home</button>
        </Link>
      </div>
    );
  }

  generateHeaderArea() {
    return (
      <section className="header_area">
        {this.generateTopButtons()}
        <div>
          <h2>Privacy Policy</h2>
        </div>
      </section>
    );
  }

  generateInfo() {
    return (
      <div className="info-container">
        <div className="info-area">
          {this.state.privacy_policy.is_html === true
            ? parse(`${this.state.privacy_policy.value}`)
            : this.state.privacy_policy.value}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="under_constrution-container">
        <div>
          {this.generateHeaderArea()}
          {this.generateInfo()}
        </div>
        <div className="footer-bottom">
          <Footer />
        </div>
      </div>
    );
  }
}

export default PrivacyPolicy;
