import React from "react";

class SummaryMetricSingle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="metric-summary-container">
        <div className="metric-summary">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ margin: "0px 0 0 12px" }}>{this.props.graph}</div>
            <div>
              <div
                style={{
                  fontSize: "150%",
                  fontWeight: "600",
                  margin: "72px 0 0 12px"
                }}
              >
                {this.props.value}
              </div>
              <div
                style={{
                  fontSize: "110%",
                  fontWeight: "450",
                  margin: "0px 0 0 12px"
                }}
              >
                {this.props.title}
              </div>
            </div>
          </div>
          <div
            style={{ marginTop: 0, padding: 12, borderTop: "1px solid grey" }}
          >
            {this.props.description}
          </div>
        </div>
      </div>
    );
  }
}

export default SummaryMetricSingle;
