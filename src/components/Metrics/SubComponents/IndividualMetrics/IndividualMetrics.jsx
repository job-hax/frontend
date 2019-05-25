import React from "react";

import DetailedMetricsGroup from "../Containers/DetailedGroupContainer.jsx";
import SummaryGroupContainer from "../Containers/SummaryGroupContainer.jsx";
import MonthlyApplicationGraph from "../Graphs/MonthlyApplicationGraph.jsx";
import MonthlyApplicationLineGraph from "../Graphs/MonthlyApplicationLineGraph.jsx";
import StagesOfApplicationsPieChart from "../Graphs/StagesOfApplicationsPieChart.jsx";
import StagesInPositions from "../Graphs/StagesInPositions.jsx";

class IndividualMetrics extends React.Component {
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
                  <MonthlyApplicationLineGraph
                    legendData={
                      this.props.MonthlyApplicationLineGraph.legendData
                    }
                    months={this.props.MonthlyApplicationLineGraph.months}
                    series={this.props.MonthlyApplicationLineGraph.series}
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
                  <MonthlyApplicationLineGraph
                    legendData={
                      this.props.MonthlyApplicationLineGraph.legendData
                    }
                    months={this.props.MonthlyApplicationLineGraph.months}
                    series={this.props.MonthlyApplicationLineGraph.series}
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
                  <MonthlyApplicationLineGraph
                    legendData={
                      this.props.MonthlyApplicationLineGraph.legendData
                    }
                    months={this.props.MonthlyApplicationLineGraph.months}
                    series={this.props.MonthlyApplicationLineGraph.series}
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
                  <MonthlyApplicationLineGraph
                    legendData={
                      this.props.MonthlyApplicationLineGraph.legendData
                    }
                    months={this.props.MonthlyApplicationLineGraph.months}
                    series={this.props.MonthlyApplicationLineGraph.series}
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
                  <MonthlyApplicationGraph
                    legendData={this.props.MonthlyApplicationGraph.legendData}
                    months={this.props.MonthlyApplicationGraph.months}
                    series={this.props.MonthlyApplicationGraph.series}
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
                  <MonthlyApplicationLineGraph
                    legendData={
                      this.props.MonthlyApplicationLineGraph.legendData
                    }
                    months={this.props.MonthlyApplicationLineGraph.months}
                    series={this.props.MonthlyApplicationLineGraph.series}
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
                  <StagesOfApplicationsPieChart
                    legendData={
                      this.props.StagesOfApplicationsPieChart.legendData
                    }
                    seriesData={
                      this.props.StagesOfApplicationsPieChart.seriesData
                    }
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
                  <StagesInPositions
                    legendData={this.props.StagesInPositions.legendData}
                    xData={this.props.StagesInPositions.xData}
                    series={this.props.StagesInPositions.series}
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

export default IndividualMetrics;
