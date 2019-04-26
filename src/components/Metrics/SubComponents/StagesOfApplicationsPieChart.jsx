import React from "react";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

class StagesOfApplicationsPieChart extends React.Component {
  constructor(props) {
    super(props);
  }

  chartThemeCreator() {
    echarts.registerTheme("stagesofapplications", {
      color: ["#F4EBC1", "#A0C1B8", "#709FB0", "#726A95", "#351F39"],
      backgroundColor: "rgb(92, 39, 195)",
      textStyle: {
        fontType: "Exo",
        color: "white"
      },
      title: {
        textStyle: {
          color: "white"
        }
      }
    });
  }

  buildStagesOfApplicationsPieChart() {
    this.chartThemeCreator();
    return {
      title: {
        text: "Stages of Applications",
        x: "center"
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: "vertical",
        left: "right",
        data: this.props.legendData
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
      series: [
        {
          name: "Stages",
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: this.props.seriesData,
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
        <div
          className="graph-container-light-background"
          id="applicationstages"
        >
          <div className="graph-dark">
            <ReactEcharts
              option={this.buildStagesOfApplicationsPieChart()}
              style={{ height: "440px", width: "740px", margin: "30px" }}
              theme="stagesofapplications"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default StagesOfApplicationsPieChart;
