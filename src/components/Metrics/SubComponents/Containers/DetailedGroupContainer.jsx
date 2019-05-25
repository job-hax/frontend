import React from "react";

import DetailedSingleMetric from "./DetailedSingleContainer.jsx";

class DetailedMetricsGroup extends React.Component {
  constructor(props) {
    super(props);
  }

  generateList() {
    let total = 0;
    this.props.listData.forEach(source => (total = source.value + total));
    return this.props.listData.map(source => (
      <div key={this.props.listData.indexOf(source)}>
        <div>{source.id}</div>
        <div
          style={{
            display: "flex",
            justifyContent: "left"
          }}
        >
          <div>
            <div
              style={{
                height: 16,
                width: 180,
                border: "1px solid grey",
                margin: "0 28px 0 0"
              }}
            >
              <div
                style={{
                  height: 14,
                  width: (source.value / 86) * 180,
                  backgroundColor: "#261268"
                }}
              />
            </div>
          </div>
          <div style={{ margin: "0 12px 0 0", fontWeight: 450 }}>
            {source.value}
          </div>
        </div>
      </div>
    ));
  }

  generateGroup() {
    return this.props.metrics.map(metric => (
      <div key={this.props.metrics.indexOf(metric)}>
        <DetailedSingleMetric graph={metric.graph} list={this.generateList()} />
      </div>
    ));
  }

  render() {
    console.log("listdata", this.props.listData);
    return (
      <div>
        <div className="metric-group">{this.generateGroup()}</div>
      </div>
    );
  }
}

export default DetailedMetricsGroup;
