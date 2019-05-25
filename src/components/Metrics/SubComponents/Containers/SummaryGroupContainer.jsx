import React from "react";

import SummaryMetricSingle from "./SummarySingleContainer.jsx";

class SummaryMetricsGroup extends React.Component {
  constructor(props) {
    super(props);
  }

  generateGroup() {
    return this.props.metrics.map(metric => (
      <div key={this.props.metrics.indexOf(metric)}>
        <SummaryMetricSingle
          graph={metric.graph}
          title={metric.title}
          description={metric.description}
          value={metric.value}
        />
      </div>
    ));
  }

  render() {
    return (
      <div>
        <div className="metric-group">{this.generateGroup()}</div>
      </div>
    );
  }
}

export default SummaryMetricsGroup;
