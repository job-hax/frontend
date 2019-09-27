import React from "react";
import { Icon } from "antd";

import { apiRoot } from "../../../utils/constants/endpoints";

import "./style.scss";

class AlumniCardDetailed extends React.Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentWillMount() {
    document.addEventListener("mousedown", this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.addEventListener("mousedown", this.handleClickOutside, false);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.setDetailedDisplay(false);
    }
  }

  generateHeader() {
    const { alumni } = this.props;
    return (
      <div className="header">
        <div className="header-left">
          <div className="avatar">
            {alumni.profile_photo != ("" || null) ? (
              <img src={apiRoot + alumni.profile_photo} />
            ) : (
              <img src="../../../src/assets/icons/User@3x.png" />
            )}
          </div>
          <div>
            <div className="name" style={{ paddingTop: 20 }}>
              {alumni.first_name + " " + alumni.last_name}
            </div>
          </div>
        </div>
      </div>
    );
  }

  generateBody() {
    const { alumni } = this.props;
    return (
      <div className="body">
        <div className="body-component">
          <div className="component-title">Alumni Details</div>
          {alumni.country && (
            <div className="component-info">
              <Icon
                type="environment"
                style={{ color: "rgba(0,0,0,.25)", margin: "4px 12px 0 0" }}
              />
              {alumni.state && (
                <div style={{ margin: "0 2px 0 0" }}>
                  {alumni.state.name + ","}
                </div>
              )}
              <div>{alumni.country.name}</div>
            </div>
          )}
          {alumni.job_position && (
            <div className="component-info">
              <Icon
                type="coffee"
                style={{ color: "rgba(0,0,0,.25)", margin: "4px 12px 0 0" }}
              />
              {alumni.state && (
                <div style={{ margin: "0 4px 0 0" }}>
                  {alumni.job_position.job_title + " at "}
                </div>
              )}
              {alumni.company && <div>{alumni.company.company}</div>}
            </div>
          )}
          {alumni.email && (
            <div className="component-info">
              <Icon
                type="mail"
                style={{ color: "rgba(0,0,0,.25)", margin: "4px 12px 0 0" }}
              />
              <div>{alumni.email}</div>
            </div>
          )}
          {alumni.phone_number && (
            <div className="component-info">
              <Icon
                type="phone"
                style={{ color: "rgba(0,0,0,.25)", margin: "4px 12px 0 0" }}
              />
              <div>{alumni.phone_number}</div>
            </div>
          )}
          {alumni.linkedin_url && (
            <div
              className="component-info"
              style={{ cursor: "pointer" }}
              onClick={() => window.open(alumni.linkedin_url)}
            >
              <Icon
                type="linkedin"
                theme="filled"
                style={{ color: "rgba(0,0,0,.25)", margin: "4px 12px 0 0" }}
              />
              <div>{alumni.name}</div>
            </div>
          )}
        </div>
        {alumni.college && (
          <div className="body-component">
            <div className="component-title">Description</div>
            <div className="component-info">
              {alumni.first_name +
                " has been graduated from " +
                alumni.college.name +
                " in " +
                alumni.grad_year +
                ". His major was " +
                alumni.major.name +
                "."}
            </div>
          </div>
        )}
      </div>
    );
  }

  generateAlumniCard() {
    return (
      <div className="alumni-card">
        <div>{this.generateHeader()}</div>
        <div>{this.generateBody()}</div>
      </div>
    );
  }

  render() {
    return <div ref={this.setWrapperRef}>{this.generateAlumniCard()}</div>;
  }
}

export default AlumniCardDetailed;
