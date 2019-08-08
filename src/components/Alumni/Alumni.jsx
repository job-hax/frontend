import React from "react";
import { Pagination, Input } from "antd";

import Spinner from "../Partials/Spinner/Spinner.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import { getAlumniRequest } from "../../utils/api/requests.js";
import AlumniCard from "../Partials/AlumniCards/AlumniCard.jsx";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";
import Footer from "../Partials/Footer/Footer.jsx";

import "./style.scss";
import "../../assets/libraryScss/antd-scss/newantd.scss";

const Search = Input.Search;

class Alumni extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isWaitingResponse: false,
      isInitialRequest: "beforeRequest",
      isNewPageRequested: false,
      isDetailsRequested: false,
      alumniList: {},
      pageNo: 1,
      pageSize: 10,
      query: ""
    };

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  async componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      this.setState({ isInitialRequest: true });
      await this.getData("initialRequest");
    }
  }

  componentDidUpdate() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      if (this.state.isNewPageRequested === true) {
        this.getData("newPageRequest");
        this.setState({ isNewPageRequested: false });
      }
      if (this.state.isQueryRequested === true) {
        this.getData("queryRequest");
        this.setState({ isQueryRequested: false });
      }
    }
  }

  async getData(requestType) {
    this.setState({ isWaitingResponse: true });
    const { url, config } = getAlumniRequest;
    await this.props.handleTokenExpiration("alumni getData");
    axiosCaptcha(url, config).then(response => {
      if (response.statusText === "OK") {
        if (requestType === "initialRequest") {
          this.setState({
            alumniList: response.data,
            isWaitingResponse: false,
            isInitialRequest: false
          });
        } else if (requestType === "newPageRequest") {
          this.setState({
            alumniList: response.data,
            isWaitingResponse: false,
            isNewPageRequested: false
          });
        } else if (requestType === "queryRequest") {
          this.setState({
            alumniList: response.data,
            isWaitingResponse: false,
            isQueryRequested: false
          });
        }
        IS_CONSOLE_LOG_OPEN &&
          console.log("alumni response.data data", response.data);
      }
    });
  }

  handlePageChange(page) {
    this.setState({ pageNo: page, isNewPageRequested: true });
  }

  generateFeatureArea() {
    return (
      <div id="feature">
        <div className="title">
          <h2>Alumni</h2>
        </div>
      </div>
    );
  }

  generateCompanyCards() {
    return this.state.alumniList.data.map(alumni => (
      <div key={alumni.id} style={{ width: 412, backgroundColor: "white" }}>
        <AlumniCard
          alumni={alumni}
          handleTokenExpiration={this.props.handleTokenExpiration}
          isEditable={false}
        />
      </div>
    ));
  }

  render() {
    if (this.state.isInitialRequest === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    else if (this.state.isInitialRequest === true)
      return <Spinner message="Preparing alumni..." />;
    if (this.state.isNewPageRequested === true)
      return <Spinner message={"Preparing page " + this.state.pageNo} />;
    if (this.state.isInitialRequest === false) {
      return (
        <div>
          <div className="reviews-container">
            {this.generateFeatureArea()}
            <div className="company-cards-container">
              <div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end"
                  }}
                >
                  <Search
                    placeholder="search"
                    onSearch={value =>
                      this.setState({ query: value, isQueryRequested: true })
                    }
                    style={{ width: 300, margin: "0 0 24px 0" }}
                  />
                </div>

                <div>
                  {this.generateCompanyCards()}
                  <div className="pagination-container">
                    <Pagination
                      onChange={this.handlePageChange}
                      defaultCurrent={
                        this.state.alumniList.pagination.current_page
                      }
                      current={this.state.alumniList.pagination.current_page}
                      total={this.state.alumniList.pagination.total_count}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              this.state.alumniList.pagination.total_count < 2
                ? "bottom-fixed-footer"
                : ""
            }
          >
            <Footer />
          </div>
        </div>
      );
    }
  }
}

export default Alumni;
