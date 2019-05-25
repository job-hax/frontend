import React from "react";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

class MonthlyApplicationGraph extends React.Component {
  constructor(props) {
    super(props);
  }

  chartThemeCreator() {
    echarts.registerTheme("monthlyapplications", {
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

  buildMonthlyApplicationGraph() {
    this.chartThemeCreator();
    return {
      title: {
        text: "Monthly Application",
        subtext: "",
        x: "left",
        top: "0px"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      /*legend: {
        data: this.props.legendData,
        x: "center",
        top: "28px"
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
      xAxis: [
        {
          type: "category",
          data: this.props.months
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      series: this.props.series
    };
  }

  render() {
    return (
      <div id="monthlyapplication">
        <div>
          <ReactEcharts
            option={this.buildMonthlyApplicationGraph()}
            style={this.props.style}
            theme="monthlyapplications"
          />
        </div>
      </div>
    );
  }
}

export default MonthlyApplicationGraph;
