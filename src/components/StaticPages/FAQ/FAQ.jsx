import React from "react";
import { Collapse } from "antd";

import { getFAQsRequest } from "../../../utils/api/requests.js";
import { fetchApi } from "../../../utils/api/fetch_api";
import Footer from "../../Partials/Footer/Footer.jsx";
import Spinner from "../../Partials/Spinner/Spinner.jsx";

const Panel = Collapse.Panel;

class FAQ extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isRequested: false, faqList: [] };
  }

  componentDidMount() {
    fetchApi(getFAQsRequest.url, getFAQsRequest.config).then(response => {
      if (response.ok) {
        this.setState({
          isRequested: true
        });
        this.setState({
          faqList: response.json.data
        });
      }
    });
  }

  generateHeaderArea() {
    return (
      <section style={{ height: "44.5vh" }} className="header_area">
        <div style={{ marginTop: "200px" }}>
          <h2 style={{ fontSize: "240%" }}>Frequently Asked Questions</h2>
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
      return <Spinner message="Reachings the FAQs..." />;
    return (
      <div className="under_constrution-container">
        <div>{this.generateHeaderArea()}</div>
        <div>{this.generateAccordion()}</div>
        {this.props.active ? (
          <div>
            <Footer />
          </div>
        ) : (
          <div className="footer-bottom">
            <Footer />
          </div>
        )}
      </div>
    );
  }
}

export default FAQ;
