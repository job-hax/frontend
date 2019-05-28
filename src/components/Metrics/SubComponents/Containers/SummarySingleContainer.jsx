import React from "react";

import LineGraph from "../Graphs/LineGraph.jsx";
import PieChart from "../Graphs/PieChart.jsx";
import BarGraph from "../Graphs/BarGraph.jsx";

class SummaryMetricSingle extends React.Component {
  constructor(props) {
    super(props);
  }

  graphSelector() {
    const style = {
      height: "160px",
      width: "120px",
      margin: "0 10px 10px 10px"
    };
    switch (this.props.metric.graph.type) {
      case "line":
        return <LineGraph metric={this.props.metric.graph} style={style} />;
      case "pie":
        return <PieChart metric={this.props.metric.graph} style={style} />;
      case "bar":
        return <BarGraph metric={this.props.metric.graph} style={style} />;
    }
  }

  render() {
    return (
      <div className="metric-summary-container">
        <div className="metric-summary">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ margin: "0px 0 0 12px" }}>{this.graphSelector()}</div>
            <div>
              <div
                style={{
                  fontSize: "150%",
                  fontWeight: "600",
                  margin: "72px 0 0 12px"
                }}
              >
                {this.props.metric.value}
              </div>
              <div
                style={{
                  fontSize: "110%",
                  fontWeight: "450",
                  margin: "0px 0 0 12px"
                }}
              >
                {this.props.metric.title}
              </div>
            </div>
          </div>
          <div
            style={{
              width: 270,
              margin: "0 0 0px 0px"
            }}
          >
            <img
              style={{
                width: 30,
                height: 30,
                margin: "-1px 0 0px 242px",
                position: "absolute",
                zIndex: "20"
              }}
              src="../../../../src/assets/icons/beta_flag_2.png"
            />
          </div>
          <div
            style={{ marginTop: 0, padding: 12, borderTop: "1px solid grey" }}
          >
            {this.props.metric.description}
          </div>
        </div>
      </div>
    );
  }
}

export default SummaryMetricSingle;
