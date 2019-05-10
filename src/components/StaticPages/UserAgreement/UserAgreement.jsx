import React, { Component } from "react";
import Footer from "../../Partials/Footer/Footer.jsx";
import { Link } from "react-router-dom";
import parse from "html-react-parser";

import { axiosCaptcha } from "../../../utils/api/fetch_api.js";
import { getAgreementsRequest } from "../../../utils/api/requests.js";

import "./style.scss";

class UserAgreement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_agreement: ""
    };
  }

  componentDidMount() {
    const { url, config } = getAgreementsRequest;
    axiosCaptcha(url, config).then(response => {
      if (response.statusText === "OK") {
        this.setState({ user_agreement: response.data.data.user_agreement });
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
          <h2>User Agreement</h2>
        </div>
      </section>
    );
  }

  generateInfo() {
    return (
      <div className="info-container">
        <div className="info-area">
          {this.state.user_agreement.is_html === true
            ? parse(`${this.state.user_agreement.value}`)
            : this.state.user_agreement.value}
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

export default UserAgreement;
