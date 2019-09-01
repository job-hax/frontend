import React from "react";
import { Collapse } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

import { FAQS } from "../../../utils/constants/endpoints.js";
import Footer from "../../Partials/Footer/Footer.jsx";
import Spinner from "../../Partials/Spinner/Spinner.jsx";

import "./style.scss";

const Panel = Collapse.Panel;

class FAQ extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isRequested: false, faqList: [] };
  }

  async componentDidMount() {
    let config = { method: "GET" };
    const response = await axios.get(FAQS, config);
    this.setState({ faqList: response.data.data });
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
          <h2>Frequently Asked Questions</h2>
        </div>
      </section>
    );
  }

  generateAccordion() {
    return (
      <Collapse accordion>
        {this.state.faqList.map(faq => (
          <Panel key={faq.id} header={faq.title}>
            <p>{faq.description}</p>
          </Panel>
        ))}
      </Collapse>
    );
  }

  render() {
    if (this.state.faqList.length == 0)
      return <Spinner message="Reaching the FAQs..." />;
    return (
      <div className="under_constrution-container">
        <div>{this.generateHeaderArea()}</div>
        <div>{this.generateAccordion()}</div>
        <div className="footer-bottom">
          <Footer />
        </div>
      </div>
    );
  }
}

export default FAQ;
