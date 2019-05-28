import React from "react";

import DetailedMetricsGroup from "../Containers/DetailedGroupContainer.jsx";
import SummaryGroupContainer from "../Containers/SummaryGroupContainer.jsx";
import BarGraph from "../Graphs/BarGraph.jsx";
import LineGraph from "../Graphs/LineGraph.jsx";
import PieChart from "../Graphs/PieChart.jsx";

class UniversityMetrics extends React.Component {
  constructor(props) {
    super(props);
  }

  generateDetailedMetricsGroup() {
    return (
      <div>
        <div>
          <SummaryGroupContainer
            metrics={[
              {
                graph: (
                  <LineGraph
                    legendData={this.props.LineGraph.legendData}
                    xData={this.props.LineGraph.xData}
                    series={this.props.LineGraph.series}
                    style={{
                      height: "160px",
                      width: "120px",
                      margin: "0 10px 10px 10px"
                    }}
                  />
                ),
                title: "Total Jobs Applied",
                value: this.props.value,
                description: "12% INCREASE from last Month"
              },
              {
                graph: (
                  <LineGraph
                    legendData={this.props.LineGraph.legendData}
                    xData={this.props.LineGraph.xData}
                    series={this.props.LineGraph.series}
                    style={{
                      height: "160px",
                      width: "120px",
                      margin: "0 10px 10px 10px"
                    }}
                  />
                ),
                title: "Total Jobs Applied",
                value: this.props.value,
                description: "12% INCREASE from last Month"
              },
              {
                graph: (
                  <LineGraph
                    legendData={this.props.LineGraph.legendData}
                    xData={this.props.LineGraph.xData}
                    series={this.props.LineGraph.series}
                    style={{
                      height: "160px",
                      width: "120px",
                      margin: "0 10px 10px 10px"
                    }}
                  />
                ),
                title: "Total Jobs Applied",
                value: this.props.value,
                description: "12% INCREASE from last Month"
              },
              {
                graph: (
                  <LineGraph
                    legendData={this.props.LineGraph.legendData}
                    xData={this.props.LineGraph.xData}
                    series={this.props.LineGraph.series}
                    style={{
                      height: "160px",
                      width: "120px",
                      margin: "0 10px 10px 10px"
                    }}
                  />
                ),
                title: "Total Jobs Applied",
                value: this.props.value,
                description: "12% INCREASE from last Month"
              }
            ]}
          />
        </div>
        <div>
          <DetailedMetricsGroup
            metrics={[
              {
                graph: (
                  <BarGraph
                    title="Monthly Applications"
                    legendData={this.props.BarGraph.legendData}
                    xData={this.props.BarGraph.xData}
                    series={this.props.BarGraph.series}
                    style={{
                      height: "200px",
                      width: "240px",
                      margin: "10px"
                    }}
                  />
                ),
                list: ["selam"]
              },
              {
                graph: (
                  <LineGraph
                    legendData={this.props.LineGraph.legendData}
                    xData={this.props.LineGraph.xData}
                    series={this.props.LineGraph.series}
                    style={{
                      height: "200px",
                      width: "240px",
                      margin: "10px"
                    }}
                  />
                ),
                list: ["selam"]
              },
              {
                graph: (
                  <PieChart
                    legendData={this.props.PieChart.legendData}
                    seriesData={this.props.PieChart.seriesData}
                    style={{
                      height: "200px",
                      width: "240px",
                      margin: "10px"
                    }}
                  />
                ),
                list: ["selam"]
              },
              {
                graph: (
                  <BarGraph
                    title="Stages In Positions"
                    legendData={this.props.BarGraphPositions.legendData}
                    xData={this.props.BarGraphPositions.xData}
                    series={this.props.BarGraphPositions.series}
                    style={{
                      height: "200px",
                      width: "240px",
                      margin: "10px"
                    }}
                  />
                ),
                list: ["selam"]
              }
            ]}
            listData={this.props.listData}
          />
        </div>
      </div>
    );
  }

  render() {
    return <div>{this.generateDetailedMetricsGroup()}</div>;
  }
}

export default UniversityMetrics;
