import React from "react";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

class Radar extends React.Component {
  constructor(props) {
    super(props);
  }

  chartThemeCreator() {
    echarts.registerTheme("radar", {
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

  buildRadar() {
    this.chartThemeCreator();
    return {
      title: {
        show: false,
        text: this.props.metric.title
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
        show: false,
        feature: {
          saveAsImage: {
            show: true,
            title: "save",
            iconStyle: { color: "#261268", emphasis: { color: "#261268" } }
          }
        }
      },
      radar: this.props.metric.polar,
      calculable: true,
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
        <div id="radar">
          <div
            style={{
              width: 260,
              height: 40,
              margin: "10px 0 -40px 16px",
              display: "flex",
              justifyContent: "left"
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "130%" }}>
              {this.props.metric.title}
            </div>
            <img
              style={{
                width: 40,
                height: 40,
                margin: "-12px 0 0px 90px",
                zIndex: "20"
              }}
              src="../../../../src/assets/icons/beta_flag_2.png"
            />
          </div>
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
