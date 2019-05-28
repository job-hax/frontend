import React from "react";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

class BarGraph extends React.Component {
  constructor(props) {
    super(props);
  }

  chartThemeCreator() {
    echarts.registerTheme("bar", {
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

  buildBarGraph() {
    this.chartThemeCreator();
    return {
      title: {
        text: this.props.metric.title,
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
        data: this.props.metric.legend,
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
          axisLabel: {
            show: this.props.metric.xAxis.length > 12 ? false : true
          },
          data: this.props.metric.xAxis
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      series: this.props.metric.series
    };
  }

  render() {
    return (
      <div id="monthlyapplication">
        <div>
          <ReactEcharts
            option={this.buildBarGraph()}
            style={this.props.style}
            theme="bar"
          />
        </div>
      </div>
    );
  }
}

export default BarGraph;
