import React from "react";
import { Modal } from "antd";

import AlumniCardDetailed from "./AlumniCardDetailed.jsx";
import { apiRoot } from "../../../utils/constants/endpoints.js";

import "./style.scss";

class AlumniCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDetailedModalShowing: false
    };

    this.setDetailedDisplay = this.setDetailedDisplay.bind(this);
  }

  setDetailedDisplay(state) {
    this.setState({ isDetailedModalShowing: state });
  }

  generateCard() {
    const { alumni, displayingAt } = this.props;
    const width = displayingAt == "contacts" ? "380px" : "100%";
    const margin = displayingAt == "contacts" ? "-4px 0px 0px 0px" : "0 0 0 0";
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
          <div style={{ width: "100%" }}>
            <div className="name">
              {alumni.first_name + " " + alumni.last_name}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: width
              }}
            >
              <div className="job-info">
                <div className="position">
                  {displayingAt == "contacts"
                    ? alumni.job_position.job_title
                    : alumni.major.name}
                </div>
              </div>
              <div style={{ margin: margin }}>
                {displayingAt == "contacts" && (
                  <div>
                    <img
                      style={{
                        margin: "0px 0 0 20px",
                        height: 24,
                        width: "auto"
                      }}
                      src={"../../../src/assets/icons/AlumniIconDarkBlue.png"}
                    />
                  </div>
                )}
                <div className="job-info">
                  {alumni.grad_year && (
                    <div className="position">{"Class of "}</div>
                  )}
                  {alumni.grad_year && (
                    <div className="company">{alumni.grad_year}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div
          className="alumni-card"
          onClick={() =>
            this.setState({
              isDetailedModalShowing: !this.state.isDetailedModalShowing
            })
          }
        >
          {this.generateCard()}
        </div>
        <div>
          <Modal
            visible={this.state.isDetailedModalShowing}
            footer={null}
            closable={false}
            bodyStyle={{ padding: 0, margin: 0 }}
          >
            <AlumniCardDetailed
              alumni={this.props.alumni}
              setDetailedDisplay={this.setDetailedDisplay}
              handleTokenExpiration={this.props.handleTokenExpiration}
              card={this.props.card}
            />
          </Modal>
        </div>
      </div>
    );
  }
}

export default AlumniCard;
