import React from "react";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

class Radar extends React.Component {
  constructor(props) {
    super(props);
  }

  chartThemeCreator() {
    echarts.registerTheme("radar", {
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

  buildRadar() {
    this.chartThemeCreator();
    return {
      title: {
        text: this.props.metric.title,
        x: "left"
      },
      tooltip: {
        trigger: "axis"
      },
      /*legend: {
        orient: "vertical",
        left: "right",
        data: this.props.metric.legend && this.props.metric.legend
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
      polar: this.props.metric.polar,
      series: [
        {
          name: this.props.metric.title,
          type: "radar",
          data: this.props.metric.series
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
              option={this.buildRadar()}
              style={this.props.style}
              theme="radar"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Radar;
