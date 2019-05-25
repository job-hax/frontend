import React from "react";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

class StagesInPositions extends React.Component {
  constructor(props) {
    super(props);
  }

  chartThemeCreator() {
    echarts.registerTheme("positionsbystages", {
      color: [
        "#E82F3A",
        "#0077B5",
        "#2164f4",
        "rgb(64,151,219)",
        "#261268",
        "rgb(0,0,0)"
      ],
      backgroundColor: "white",
      textStyle: {
        fontType: "Exo",
        color: "#261268"
      },
      title: {
        textStyle: {
          color: "#261268"
        }
      },
      splitLine: {
        lineStyle: {
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

  buildPositionsByStagesGraph() {
    this.chartThemeCreator();
    return {
      title: {
        text: "Position by Stages",
        subtext: "",
        x: "left",
        top: "0px"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        },
        position: "absolute"
      },
      /*legend: {
        data: this.props.legendData,
        x: "center",
        top: "30px"
      },*/
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
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        axisLabel: { show: false },
        data: this.props.xData
      },
      yAxis: {
        type: "value",
        axisLabel: { splitLine: 1 }
      },
      series: this.props.series
    };
  }

  render() {
    return (
      <div>
        <div id="stagesinpositions">
          <div>
            <ReactEcharts
              option={this.buildPositionsByStagesGraph()}
              style={this.props.style}
              theme="positionsbystages"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default StagesInPositions;
