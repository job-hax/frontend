import React from "react";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

class PeakLineGraph extends React.Component {
  constructor(props) {
    super(props);
  }

  chartThemeCreator() {
    echarts.registerTheme("monthlyapplicationsline", {
      color: [
        "#E82F3A",
        "#0077B5",
        "#2164f4",
        "rgb(64,151,219)",
        "#261268",
        "rgb(0,0,0)"
      ],
      backgroundColor: "rgb(92, 39, 195)",
      textStyle: {
        fontType: "Exo",
        color: "white"
      },
      title: {
        textStyle: {
          color: "white"
        }
      },
      splitLine: {
        lineStyle: {
          color: "#black"
        }
      },
      line: {
        smooth: true,
        symbol: "emptyCircle",
        symbolSize: 3
      }
    });
  }

  buildMonthlyApplicationLineGraph() {
    this.chartThemeCreator();
    return {
      title: {
        text: "Peak Season Graph",
        subtext: "",
        x: "center",
        top: "0px"
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: this.props.data,
        x: "center",
        top: "28px",
        textStyle: { color: "white" }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
            title: "save",
            iconStyle: { color: "white", emphasis: { color: "white" } }
          }
        }
      },
      calculable: true,
      xAxis: {
        type: "category",
        boundaryGap: false,
        show: true,
        data: this.props.months
      },
      yAxis: {
        type: "value"
      },
      series: this.props.series
    };
  }

  render() {
    return (
      <div>
        <div
          className="global_graph-container-light-background"
          id="applicationtrend"
        >
          <div className="graph-dark">
            <ReactEcharts
              option={this.buildMonthlyApplicationLineGraph()}
              style={{ height: "440px", width: "720px", margin: "30px" }}
              theme="monthlyapplicationsline"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default PeakLineGraph;
