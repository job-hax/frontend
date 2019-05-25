import React from "react";

class DetailedMetricSingle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="metric-detailed-container">
        <div className="metric">
          <div>{this.props.graph}</div>
          <div style={{ margin: "10px 0 0 20px", fontWeight: "bold" }}>
            Top Sources
          </div>
          <div className="list-container">
            <div className="list">{this.props.list}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default DetailedMetricSingle;
