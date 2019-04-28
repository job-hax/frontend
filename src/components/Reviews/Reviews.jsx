import React from "react";

import Spinner from "../Partials/Spinner/Spinner.jsx";
import CompanyReviews from "./CompanyReviews/CompanyReviews.jsx";
import { fetchApi } from "../../utils/api/fetch_api";
import { getJobAppsRequest } from "../../utils/api/requests.js";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";

import "./style.scss";

class Reviews extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isWaitingResponse: "beforeRequest",
      companyList: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate() {
    this.getData();
  }

  getData() {
    if (this.props.active && this.state.isWaitingResponse === "beforeRequest") {
      this.setState({ isWaitingResponse: true });
      IS_CONSOLE_LOG_OPEN && console.log("reviews token", this.props.token);
      IS_CONSOLE_LOG_OPEN && console.log("active?", this.props.active);
      if (this.props.active) {
        const { url, config } = getJobAppsRequest;
        config.headers.Authorization = this.props.token;
        fetchApi(url, config).then(response => {
          if (response.ok) {
            this.setState({
              companyList: response.json.data,
              isWaitingResponse: false
            });
            IS_CONSOLE_LOG_OPEN &&
              console.log("reviews response json data", response.json.data);
          }
        });
      }
    }
  }

  generateFeatureArea() {
    return (
      <div id="feature">
        <div className="title">
          <h2>Company Reviews</h2>
          <p className="small-text">All reviews!</p>
        </div>
      </div>
    );
  }

  generateCompanyCards() {
    return this.state.companyList.map(application => (
      <div key={application.id}>
        <CompanyReviews company={application.companyObject} />
      </div>
    ));
  }

  render() {
    IS_CONSOLE_LOG_OPEN && console.log("reviews token", this.props.token);
    if (this.state.isWaitingResponse === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    if (this.state.isWaitingResponse === true)
      return <Spinner message="Preparing reviews..." />;
    return (
      <div className="reviews-container">
        {this.generateFeatureArea()}
        {this.generateCompanyCards()}
      </div>
    );
  }
}

export default Reviews;
