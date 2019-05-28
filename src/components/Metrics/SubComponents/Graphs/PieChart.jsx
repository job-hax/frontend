import React from "react";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

class PieChart extends React.Component {
  constructor(props) {
    super(props);
  }

  chartThemeCreator() {
    echarts.registerTheme("pie", {
      color: ["#F4EBC1", "#A0C1B8", "#709FB0", "#726A95", "#351F39"],
      backgroundColor: "white",
      textStyle: {
        fontType: "Exo",
        color: "#261268"
      },
      title: {
        textStyle: {
          color: "#261268"
        }
      }
    });
  }

  buildPieChart() {
    this.chartThemeCreator();
    return {
      title: {
        text: this.props.metric.title,
        x: "left"
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      /*legend: {
        orient: "vertical",
        left: "right",
        data: this.props.metric.legend
      },*/
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
            title: "save",
            iconStyle: { color: "#261268", emphasis: { color: "#261268" } }
          }
        }
      },
      series: [
        {
          name: "Stages",
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: this.props.metric.series,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    };
  }

  render() {
    return (
      <div>
        <div id="applicationstages">
          <div>
            <ReactEcharts
              option={this.buildPieChart()}
              style={this.props.style}
              theme="pie"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default PieChart;