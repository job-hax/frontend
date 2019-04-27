import React from "react";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

import DropDownSelector from "../../Partials/DropDown/DropDownSelector.jsx";
import {
  TRENDING_STATUS_OPTIONS,
  TRENDING_YEAR_OPTIONS,
  TRENDING_COUNT_OPTIONS,
  TRENDING_TYPE_OPTIONS
} from "../../../utils/constants/constants.js";

class TrendingBarGraph extends React.Component {
  constructor(props) {
    super(props);
  }

  chartThemeCreator() {
    echarts.registerTheme("trending", {
      color: [
        "rgb(92, 39, 195)",
        "#261268",
        "#E82F3A",
        "#0077B5",
        "#2164f4",
        "rgb(64,151,219)"
      ],
      backgroundColor: "white",
      legend: {
        textStyle: {
          color: "#261268"
        }
      },
      textStyle: {
        fontType: "Exo",
        color: "#261268"
      },
      title: {
        textStyle: {
          color: "#261268"
        }
      },
      line: {
        smooth: true,
        symbol: "emptyCircle",
        symbolSize: 3
      }
    });
  }

  buildTrendingGraph() {
    this.chartThemeCreator();
    return {
      title: {
        x: "center",
        text: "Trending",
        subtext:
          "Top " +
          this.props.menuNameList[0] +
          " " +
          this.props.menuNameList[1] +
          " in " +
          this.props.menuNameList[2] +
          " for " +
          this.props.menuNameList[3] +
          " stage(s)"
      },
      tooltip: {
        trigger: "axis"
      },
      toolbox: {
        show: true,
        title: "save",
        feature: {
          saveAsImage: {
            show: true,
            title: "save",
            iconStyle: { color: "#261268", emphasis: { color: "#261268" } }
          }
        }
      },
      calculable: true,
      xAxis: [
        {
          type: "value",
          boundaryGap: [0, 0.01]
        }
      ],
      yAxis: [
        {
          type: "category",
          name: this.props.menuNameList[1],
          nameLocation: "center",
          show: true,
          axisLabel: { show: false },
          data: this.props.names
        }
      ],
      series: [
        {
          name: "Application Amount",
          type: "bar",
          itemStyle: {
            normal: {
              label: { show: true, position: "inside", color: "white" }
            }
          },
          data: this.props.amounts
        }
      ]
    };
  }

  render() {
    return (
      <div>
        <div className="selection-menu-container">
          <div className="selection-menu">
            <div className="filter-indicator">Selected:</div>
            <DropDownSelector
              itemList={TRENDING_COUNT_OPTIONS}
              selector={this.props.setTrendingDataCount}
              menuName={this.props.menuNameList[0]}
            />
            <DropDownSelector
              itemList={TRENDING_TYPE_OPTIONS}
              selector={this.props.setTrendingDataType}
              menuName={this.props.menuNameList[1]}
            />
            <DropDownSelector
              itemList={TRENDING_YEAR_OPTIONS}
              selector={this.props.setTrendingDataYear}
              menuName={this.props.menuNameList[2]}
            />
            <DropDownSelector
              itemList={TRENDING_STATUS_OPTIONS}
              selector={this.props.setTrendingDataStatus}
              menuName={this.props.menuNameList[3]}
            />
          </div>
        </div>

        <div
          className="global_graph-container-dark-background"
          id="monthlyapplication"
        >
          <div className="graph" style={{ marginTop: "40px" }}>
            <ReactEcharts
              option={this.buildTrendingGraph()}
              style={{
                height: "440px",
                width: "720px",
                margin: "30px"
              }}
              theme="trending"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TrendingBarGraph;
