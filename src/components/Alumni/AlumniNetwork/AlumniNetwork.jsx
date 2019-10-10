import React from "react";
import { Pagination, Input, Menu, Dropdown, Icon, Button } from "antd";

import Spinner from "../../Partials/Spinner/Spinner.jsx";
import { axiosCaptcha } from "../../../utils/api/fetch_api";
import { ALUMNI, AUTOCOMPLETE } from "../../../utils/constants/endpoints.js";
import AlumniCard from "../../Partials/AlumniCards/AlumniCard.jsx";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";
import Footer from "../../Partials/Footer/Footer.jsx";

import "./style.scss";

const Search = Input.Search;

class AlumniNetwork extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isWaitingResponse: false,
      isInitialRequest: "beforeRequest",
      isNewPageRequested: false,
      isDetailsRequested: false,
      alumniList: [],
      pagination: {},
      pageNo: 1,
      pageSize: 5,
      q: "",
      major: "",
      major_id: null,
      year: null,
      company: "",
      company_id: null,
      position: "",
      position_id: null,
      country: "",
      country_id: null,
      state: "",
      states: [],
      state_id: null,
      companies: [],
      countries: [],
      majors: [],
      years: [],
      positions: []
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.generateDropdown = this.generateDropdown.bind(this);
    this.urlBuilder = this.urlBuilder.bind(this);
  }

  async componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      this.setState({ isInitialRequest: true });
      this.getDropdownData("companies");
      this.getDropdownData("countries");
      this.getDropdownData("majors");
      this.getDropdownData("positions");
      let yearList = [];
      for (let i = 0; i <= 50 - 1; i++) {
        yearList.push(new Date().getFullYear() + i * -1);
      }
      this.setState({ years: yearList });
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

  getDropdownData(type, id = null) {
    let newType =
      type == "countries"
        ? type
        : type == "states"
        ? "countries/" + id + "/states"
        : "alumni/" + type;
    let config = { method: "GET" };
    axiosCaptcha(AUTOCOMPLETE(newType), config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success === true) {
          IS_CONSOLE_LOG_OPEN && console.log(response.data.data);
          let list = response.data.data;
          this.setState({ [type]: list });
        }
      }
    });
  }

  urlBuilder(list) {
    let parameterList = [];
    for (let i = 0; i <= list.length - 1; i++) {
      if (this.state[list[i]] != "" && this.state[list[i]] != null) {
        parameterList.push({
          name: list[i],
          value: this.state[list[i]]
        });
      }
    }
    return parameterList;
  }

  async getData(requestType) {
    this.setState({ isWaitingResponse: true });
    const parameters = this.urlBuilder([
      "q",
      "year",
      "major_id",
      "company_id",
      "country_id",
      "state_id",
      "position_id"
    ]);
    let config = { method: "GET" };
    let newUrl =
      ALUMNI +
      "?page=" +
      this.state.pageNo +
      "&page_size=" +
      this.state.pageSize;
    parameters.forEach(
      parameter =>
        (newUrl = newUrl + "&" + parameter.name + "=" + parameter.value)
    );
    await this.props.handleTokenExpiration("alumni getData");
    axiosCaptcha(newUrl, config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          let alumniListReceived = response.data.data;
          if (requestType === "initialRequest") {
            this.setState({
              alumniList: alumniListReceived,
              pagination: response.data.pagination,
              isWaitingResponse: false,
              isInitialRequest: false
            });
          } else if (requestType === "newPageRequest") {
            this.setState({
              alumniList: alumniListReceived,
              pagination: response.data.pagination,
              isWaitingResponse: false,
              isNewPageRequested: false
            });
          } else if (requestType === "queryRequest") {
            this.setState({
              alumniList: alumniListReceived,
              pagination: response.data.pagination,
              isWaitingResponse: false,
              isQueryRequested: false
            });
          }
          IS_CONSOLE_LOG_OPEN &&
            console.log("alumni response.data data", response.data);
        }
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

  generateAlumniCards() {
    const alumniCardWidth = window.screen.availWidth > 800 ? "412px" : "100vw";
    return this.state.alumniList.map(alumni => (
      <div
        key={alumni.id}
        style={{ width: alumniCardWidth, backgroundColor: "white" }}
      >
        <AlumniCard
          alumni={alumni}
          handleTokenExpiration={this.props.handleTokenExpiration}
          isEditable={false}
          displayingAt={"alumni"}
        />
      </div>
    ));
  }

  generateSearchBox() {
    return (
      <div className="filter-container">
        <div style={{ margin: "4px 0px 0px 0px" }}>Name:</div>
        <Search
          placeholder="search"
          onSearch={value =>
            this.setState({ q: value, isQueryRequested: true, pageNo: 1 })
          }
          style={{ width: 200 }}
        />
      </div>
    );
  }

  handleDropdownClick(event, listType) {
    this.setState({ pageNo: 1 });
    if (event.key == "-1") {
      let emptyList = [];
      if (listType == "countries") {
        {
          this.setState({
            state: "",
            state_id: null,
            states: emptyList,
            country: "",
            country_id: null,
            isQueryRequested: true
          });
        }
      } else if (listType == "states") {
        this.setState({
          state: "",
          state_id: null,
          isQueryRequested: true
        });
      } else if (listType == "companies") {
        this.setState({
          company: "",
          company_id: null,
          isQueryRequested: true
        });
      } else if (listType == "positions") {
        this.setState({
          position: "",
          position_id: null,
          isQueryRequested: true
        });
      } else if (listType == "majors") {
        this.setState({
          major: "",
          major_id: null,
          isQueryRequested: true
        });
      } else if (listType == "years") {
        this.setState({ year: null, isQueryRequested: true });
      }
    } else {
      if (listType == "countries") {
        if (
          this.state.country != "" &&
          this.state.country != event.item.props.children
        ) {
          let emptyList = [];
          this.setState({
            state: "",
            state_id: null,
            states: emptyList
          });
        }
        this.setState({
          country: event.item.props.children,
          country_id: event.key,
          isQueryRequested: true
        });
        this.getDropdownData("states", event.key);
      } else if (listType == "states") {
        this.setState({
          state: event.item.props.children,
          state_id: event.key,
          isQueryRequested: true
        });
      } else if (listType == "companies") {
        this.setState({
          company: event.item.props.children,
          company_id: event.key,
          isQueryRequested: true
        });
      } else if (listType == "positions") {
        this.setState({
          position: event.item.props.children,
          position_id: event.key,
          isQueryRequested: true
        });
      } else if (listType == "majors") {
        this.setState({
          major: event.item.props.children,
          major_id: event.key,
          isQueryRequested: true
        });
      } else if (listType == "years") {
        this.setState({ year: event.key, isQueryRequested: true });
      }
    }
  }

  generateDropdown(listType, type) {
    const menu = listType => (
      <Menu
        onClick={event => this.handleDropdownClick(event, listType)}
        style={{
          width: "200px",
          maxHeight: "260px",
          textAlign: "center",
          overflowX: "hidden"
        }}
      >
        {listType == "companies"
          ? this.state[listType].map(data => (
              <Menu.Item key={data.id}>{data.company}</Menu.Item>
            ))
          : listType == "years"
          ? this.state[listType].map(year => (
              <Menu.Item key={year}>{year}</Menu.Item>
            ))
          : listType == "positions"
          ? this.state[listType].map(position => (
              <Menu.Item key={position.id}>{position.job_title}</Menu.Item>
            ))
          : this.state[listType].map(data => (
              <Menu.Item key={data.id}>{data.name}</Menu.Item>
            ))}
        <Menu.Divider />
        <Menu.Item key="-1">Reset</Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={() => menu(listType)} placement="bottomRight">
        <Button
          className="ant-dropdown-link"
          style={{
            color: "rgba(100, 100, 100, 0.9)",
            borderColor: "rgb(217, 217, 217)",
            width: 200,
            overflow: "hidden"
          }}
        >
          {this.state[type] == "" || this.state[type] == null
            ? "Please Select"
            : this.state[type]}
          <Icon type="down" />
        </Button>
      </Dropdown>
    );
  }

  generateDropdownFilters(name, listType, type) {
    return (
      <div className="filter-container">
        <div style={{ marginTop: 4 }}>{name}</div>
        <div>{this.generateDropdown(listType, type)}</div>
      </div>
    );
  }

  generateFilterArea() {
    const height = this.state.states.length > 0 ? 380 : 330;
    const marginTop = this.state.pagination.total_count < 5 ? 8 : 40;
    const style = { height: height, marginTop: marginTop };
    return (
      <div className="filter-area-container" style={style}>
        <div className="title">Filter</div>
        <div>{this.generateSearchBox()}</div>
        <div>{this.generateDropdownFilters("Year:", "years", "year")}</div>
        <div>{this.generateDropdownFilters("Major:", "majors", "major")}</div>
        <div>
          {this.generateDropdownFilters("Company:", "companies", "company")}
        </div>
        <div>
          {this.generateDropdownFilters("Position:", "positions", "position")}
        </div>
        <div>
          {this.generateDropdownFilters("Country:", "countries", "country")}
        </div>
        {this.state.states.length > 0 && (
          <div>
            {this.generateDropdownFilters("States:", "states", "state")}
          </div>
        )}
      </div>
    );
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
          <div className="alumni-big-container">
            {this.generateFeatureArea()}

            <div className="alumni-container">
              <div className="alumni-cards-container">
                <div>{this.generateFilterArea()}</div>
                <div>
                  <div>
                    {this.state.pagination.total_count == 0 && (
                      <div className="no-data">
                        No Alumni found based on selected criteria!
                      </div>
                    )}
                    {this.generateAlumniCards()}
                    <div className="pagination-container">
                      <Pagination
                        onChange={this.handlePageChange}
                        defaultCurrent={this.state.pagination.current_page}
                        pageSize={this.state.pageSize}
                        current={this.state.pagination.current_page}
                        total={this.state.pagination.total_count}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              window.screen.availHeight > 870
                ? "bottom-fixed-footer"
                : "footer-margin"
            }
          >
            <Footer />
          </div>
        </div>
      );
    }
  }
}

export default AlumniNetwork;
